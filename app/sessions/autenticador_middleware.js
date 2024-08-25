const { validationResult } = require("express-validator");
const usuario = require("../models/usuarioModel");
const bcrypt = require("bcryptjs");
const politico = require("../models/politicosModel");

const verificarUsuAutenticado = (req, res, next) => {
    if (req.session.autenticado) {
        var autenticado = req.session.autenticado;
    } else {
        var autenticado = { autenticado: null, id: null, tipo: null };
    }
    req.session.autenticado = autenticado;
    next();
}

const limparSessao = (req, res, next) => {
    req.session.destroy();
    next();
}

const gravarUsuAutenticado = async (req, res, next) => {
    erros = validationResult(req)
    if (erros.isEmpty()) {
        var dadosForm = {
            email: req.body.email,
            senha: req.body.senha,
            politico: req.body.tipo_politico
        };
        let results;
        let total = 0;

        if (politico) {
            results = await politico.findUserEmail(dadosForm);
        } else {
            results = await usuario.findUserEmail(dadosForm);
        }
        total = Object.keys(results).length;

        if (total == 1) {
            let compararSenha = politico 
                ? bcrypt.compareSync(dadosForm.senha, results[0].senhaPolitico)
                : bcrypt.compareSync(dadosForm.senha, results[0].senhaUsuario);

            if (compararSenha) {
                if (politico) {
                    var autenticado = {
                        nome: results[0].nomePolitico,
                        id: results[0].idPolitico,
                        data_nascimento: results[0].dataNascPolitico
                    };
                } else {
                    var autenticado = {
                        nome: results[0].nomeUsuario,
                        id: results[0].idUsuario,
                        data_nascimento: results[0].dataNascUsuario
                    };
                }
            }
        } else {
            var autenticado =  { nome: null, id: null, data_nascimento: null };
        }
    } else {
        var autenticado =  { nome: null, id: null, data_nascimento: null };
    }
    req.session.autenticado = autenticado;
    console.log(req.session.autenticado);
    
    next();
}

const verificarUsuAutorizado = (tipoPermitido, destinoFalha) => {
    return (req, res, next) => {
        if (req.session.autenticado.autenticado != null &&
            tipoPermitido.find(function (element) { return element == req.session.autenticado.tipo }) != undefined) {
            next();
        } else {
            res.render(destinoFalha, req.session.autenticado);
        }
    };
}

module.exports.autenticador = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado
}
