const usuario = require("../models/usuarioModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const usuarioModel = require("../models/usuarioModel");
const { mensagemErro } = require("../util/logs");
const politicosModel = require("../models/politicosModel");
var salt = bcrypt.genSaltSync(12);
 
const politicoController = {
    // Validações
    regrasValidacaoFormCad: [
        body("nome")
            .isLength({ min: 3, max: 45 }).withMessage(`<strong>Nome de Usuário:</strong> ${mensagemErro.NOME_INVALIDO}`),
        body("email")
            .isEmail().withMessage(mensagemErro.EMAIL_INVALIDO)
            .custom(async emailUsuario => {
                try {
                    const resultado = await usuario.findCampoCustom(emailUsuario, "contatoPoliticos");
                   
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
            }).withMessage(mensagemErro.SENHAS_DISCREPANTES),
        body('partido')
            .isLength({ min: 3, max: 45 }).withMessage(`<strong>Nome de Partido:</strong> ${mensagemErro.NOME_INVALIDO}`)
    ],
 
    cadastrarPolitico: async (req, res)=>{
        const erros = validationResult(req)
        if (!erros.isEmpty()){
            console.log(erros)
            return res.render(
                "pages/cadastro-politico",
                {
                    pagina: "politicocadastro",
                    logado: null,
                    erros: erros,
                    dadosForm: req.body
                }
            );
        }
 
        try {
            const senhaComHash = bcrypt.hashSync(req.body.senha, salt);
 
            const dadosForm = {
                nomePoliticos: req.body.nome,
                senhaPoliticos: senhaComHash,
                contatoPoliticos: req.body.email,
                dataNascPoliticos: req.body.data_nascimento,
                ufPoliticos: req.body.estado
            }
 
            const resultado = await politicosModel.create(dadosForm);
            console.log(resultado);
            console.log('Cadastro realizado!');
               
            res.render(
                "pages/cadastro-politico",
                {
                    pagina: "politicocadastro",
                    logado: true,
                    form_aprovado: true,
                    erros: null,
                    dadosForm: req.body
                }
            );
        } catch (err) {
            console.log(err);
        }
    },
 
    realizarPostagem: async (req, res, userId) => {
        const [user] = await politicosModel.findId(userId);
        let autenticado;
 
        const dadosForm = {
            tituloPost: req.body.titulo,
            fotoPost: req.body.foto,
            idUsuarioPost: userId
        };
 
        const results = await politicosModel.guardarPostagem(dadosForm);
 
        if (req.session.autenticado) {
            autenticado = req.session.autenticado;
        } else {
            autenticado = {
                nome: results[0].nomePoliticos,
                id: results[0].idPoliticos,
                estado: results[0].ufPoliticos,
                data_nascimento: results[0].dataNascPoliticos,
                email: results[0].contatoPoliticos,
                candidatura: results[0].candidaturaPoliticos,
                foto_usuario: results[0].fotoPerfilPoliticos,
                desc_usuario: results[0].descPoliticos,
                tipo: "candidato"
            };
        }
    }
 
}
 
module.exports = politicoController