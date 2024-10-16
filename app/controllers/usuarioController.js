var pool = require("../../config/pool-conexoes");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { mensagemErro } = require("../util/logs");
const usuarioModel = require("../models/usuarioModel");
const politicosModel = require("../models/politicosModel");
const { removeImg } = require("../util/removeImg");
var salt = bcrypt.genSaltSync(12);

const usuarioController = {
    // Validações
    regrasValidacaoFormCad: [
        body("nome")
            .isLength({ min: 3, max: 45 }).withMessage(`<strong>Nome de Usuário:</strong> ${mensagemErro.NOME_INVALIDO}`),
        body("email")
            .isEmail().withMessage(mensagemErro.EMAIL_INVALIDO)
            .custom(async emailUsuario => {
                try {
                    const resultado = await usuarioModel.findCampoCustom(emailUsuario, "emailUsuario");
                    
                    if (resultado.length > 0) {
                        throw new Error();
                    }
                } catch (e) {
                    throw new Error();
                }
            }).withMessage(mensagemErro.EMAIL_ATIVO),
        body("data_nascimento")
            .custom(dataUsuario => {
                const dataAtual = new Date();
                const dataUsuarioDate = new Date(dataUsuario);

                if (isNaN(dataUsuarioDate.getTime()) || dataUsuarioDate > dataAtual) {
                    throw new Error(mensagemErro.DATA_INVALIDA);
                }
                return true;
            }).withMessage(mensagemErro.DATA_INVALIDA)
            .isDate().withMessage(mensagemErro.DATA_FORMATO_INVALIDO),
        body("estado")
            .notEmpty().withMessage(mensagemErro.UF_INVALIDA),
        body("senha")
            .isStrongPassword().withMessage(`<strong>Senha:</strong> ${mensagemErro.SENHA_FRACA}`),
        body("confirmarSenha")
            .isStrongPassword().withMessage(`<strong>Confirmar senha:</strong> ${mensagemErro.SENHA_FRACA}`)
            .custom((confirmaSenha, { req }) => {
                if (confirmaSenha === req.body.senha) {
                    return true;
                }
                throw new Error()
            }).withMessage(mensagemErro.SENHAS_DISCREPANTES)
    ],

    regrasValidacaoFormLogin: [
        body('email')
            .isEmail().withMessage(mensagemErro.EMAIL_INVALIDO)
            .custom(async (emailUsuario, { req }) => {
                try {
                    let resultado;
                    if (req.body.tipo_politico) {
                        resultado = await politicosModel.findCampoCustom(emailUsuario, "contatoPoliticos");
                    } else {
                        resultado = await usuarioModel.findCampoCustom(emailUsuario, "emailUsuario");
                    }

                    console.log(resultado);
                    
                    if (resultado.length >= 2) {
                        throw new Error(mensagemErro.EMAIL_ATIVO);
                    } else if (resultado.length === 0) {
                        throw new Error(mensagemErro.EMAIL_INEXISTENTE);
                    }

                    return true;
                } catch (e) {
                    throw new Error(e);
                }
            }),
        body('senha')
            .isStrongPassword().withMessage(mensagemErro.SENHA_FRACA)
            .custom(async (senhaForm, { req }) => {
                let msgErroPadrao = false;
                try {
                    const isPolitico = req.body.tipo_politico ? true : false;

                    const results = await (
                        isPolitico
                            ? politicosModel.findCampoCustom(req.body.email, "contatoPoliticos")
                            : usuarioModel.findCampoCustom(req.body.email, "emailUsuario")
                    );

                    const senhaCorreta = isPolitico
                        ? results[0].senhaPoliticos
                        : results[0].senhaUsuario;               
                    
                    console.log(senhaForm);
                    console.log(senhaCorreta);
                    
                    
                    if (!bcrypt.compareSync(senhaForm, senhaCorreta)) {
                        msgErroPadrao = true; 
                    }
                    
                } catch (err) {
                    throw new Error(err);
                }

                if (msgErroPadrao) {
                    throw new Error(msgErroPadrao);
                }
            }).withMessage(mensagemErro.SENHA_INCORRETA)
    ],

    cadastrarUsuario: async (req, res)=>{
        const erros = validationResult(req)
        if (!erros.isEmpty()){
            console.log(erros)
            return res.render(
                "pages/cadastro-usuario", 
                { 
                    pagina: "usuario", 
                    logado: req.session.autenticado,
                    form_aprovado: false, 
                    erros: erros,
                    dadosForm: req.body
                }
            );
        }

        try {
            const senhaComHash = bcrypt.hashSync(req.body.senha, salt);

            const dadosForm = {
                nomeUsuario: req.body.nome,
                senha: senhaComHash,
                emailUsuario: req.body.email,
                dataNascUsuario: req.body.data_nascimento,
                enderecoUsuario: req.body.estado
            }

            const resultado = await usuarioModel.create(dadosForm);
            console.log(resultado);
            console.log('Cadastro realizado!');
                
            res.render(
                "pages/cadastro-usuario", 
                { 
                    pagina: "usuario", 
                    logado: req.session.autenticado, 
                    form_aprovado: true,
                    erros: null,
                    dadosForm: req.body 
                }
            );
        } catch (err) {
            console.log(err);
        }
    },

    signInEleitor: async (req, res) => {
        const erros = validationResult(req);
        console.log(erros);
        
        if (!erros.isEmpty()) {
            return res.render(
                "pages/login", 
                { 
                    pagina: "login", 
                    logado: req.session.autenticado, 
                    form_aprovado: false,
                    erros: erros,
                    dadosForm: req.body
                }
            );
        }

        return res.render(
            "pages/login", 
            { 
                pagina: "login", 
                logado: req.session.autenticado, 
                erros: null,
                form_aprovado: true,
                dadosForm: req.body
            });
    }

}

module.exports = usuarioController;