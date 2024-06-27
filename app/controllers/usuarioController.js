const usuario = require("../models/usuarioModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(12);

const usuarioController = {
    // Validações
    regrasValidacaoFormCad: [
        body("nome")
            .isLength({ min: 3, max: 45 }).withMessage("Mínimo de 3 letras e máximo de 45!"),
    ],

    // Função de cadastro
    cadastrar: (req, res) => {
        const erros = validationResult(req);
        console.log(erros);
        var dadosForm = {
            nomeUsuario: req.body.nome,
            emailUsuario: req.body.email,
            dataNascUsuario: req.body.dataNascUsuario,
            senha: req.body.senha,
        };
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render("pages/cadastro", { listaErros: erros, valores: req.body })
        }
        try {
            let create = usuario.create(dadosForm);
            res.redirect("/")
        } catch (e) {
            console.log(e);
            res.render("pages/cadastro", { listaErros: erros, valores: req.body })
        }
    }
}

module.exports = usuarioController