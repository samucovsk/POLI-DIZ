const { validationResult } = require("express-validator");
const usuario = require("../models/usuarioModel");
const bcrypt = require("bcryptjs");
const politico = require("../models/politicosModel");

const verificarUsuAutenticado = (req, res, next) => {
    if (req.session.autenticado) {
        var autenticado = req.session.autenticado;
    } else {
        var autenticado = { nome: null, id: null, tipo: null };
    }
    req.session.autenticado = autenticado;
    next();
}

const limparSessao = (req, res, next) => {
    req.session.destroy();
    next();
}

const gravarUsuAutenticado = async (req, res, next) => {
    const erros = validationResult(req); 
    var autenticado = { nome: null, id: null, data_nascimento: null };

    if (erros.isEmpty()) {
        let results;
        let total = 0;
        let isPolitico = req.body.tipo_politico ? true : false;        

        if (isPolitico) {
            results = await politico.findCampoCustom(req.body.email, "contatoPoliticos");
            if (results[0].status_politico === 0) {
                return res.render(
                    'pages/login',
                    {
                        pagina: "login",
                        logado: req.session.autenticado,
                        form_aprovado: false,
                        cadastro_aprovado: false,
                        erros: null,
                        dadosForm: {
                            email: "",
                            senha: "",
                        },
                        dadosNotificacao: {
                            type: "warning",
                            msg: 'Verifique sua caixa de email para prosseguir.',
                            title: "Conta não ativada!"
                        }
                    }  
                );
            }
        } else {
            results = await usuario.findCampoCustom(req.body.email, "emailUsuario");
            if (results[0].status_usuario === 0) {
                return res.render(
                    'pages/login',
                    {
                        pagina: "login",
                        logado: req.session.autenticado,
                        form_aprovado: false,
                        cadastro_aprovado: false,
                        erros: null,
                        dadosForm: {
                            email: "",
                            senha: "",
                        },
                        dadosNotificacao: {
                            type: "warning",
                            msg: 'Verifique sua <strong> caixa de email</strong> para prosseguir.',
                            title: "Conta não ativada!"
                        }
                    }  
                );
            }
        }
        total = Object.keys(results).length;
        
        if (total == 1) {           
            if (isPolitico) {
                autenticado = {
                    nome: results[0].nomePoliticos,
                    id: results[0].idPoliticos,
                    estado: results[0].ufPoliticos,
                    data_nascimento: results[0].dataNascPoliticos,
                    email: results[0].contatoPoliticos,
                    candidatura: results[0].candidaturaPoliticos,
                    foto_usuario: results[0].fotoPerfilPoliticos,
                    banner_usuario: results[0].bannerPoliticos,
                    desc_usuario: results[0].descPoliticos,
                    reuniao_politico: {
                        url: results[0].linkReuniao,
                        expiraEm: results[0].dataExpiracao_reuniao
                    },
                    tipo: "candidato"
                };
            } else {
                autenticado = {
                    nome: results[0].nomeUsuario,
                    id: results[0].idUsuario,
                    estado: results[0].enderecoUsuario,
                    cpf: results[0].CPFUsuario,
                    cep: results[0].cepUsuario,
                    telefone: results[0].TelefoneUsuario,
                    foto_usuario: results[0].fotoPerfilUsuario,
                    banner_usuario: results[0].bannerUsuario,
                    desc_usuario: results[0].descUsuario,
                    data_nascimento: results[0].dataNascUsuario,
                    tipo: "eleitor"
                };
            }
        }
    }
    req.session.autenticado = autenticado; 
    console.log(req.session.autenticado);
    
    next();
}

const verificarUsuAutorizado = (tipoPermitido, destinoFalha, dadosPagina) => {
    return (req, res, next) => {
        if (req.session.autenticado.nome != null &&
            tipoPermitido.includes(req.session.autenticado.tipo)) { 
            next();
        } else {
            res.render(destinoFalha, dadosPagina);
        }
    };
}

module.exports.autenticador = {
    verificarUsuAutenticado,
    limparSessao,
    gravarUsuAutenticado,
    verificarUsuAutorizado
}
