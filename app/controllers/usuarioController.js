const usuario = require("../models/usuarioModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const usuarioModel = require("../models/usuarioModel");
var salt = bcrypt.genSaltSync(12);

const usuarioController = {
    // Validações
    regrasValidacaoFormCad: [
        body("nome")
            .isLength({ min: 3, max: 45 }).withMessage("Mínimo de 3 letras e máximo de 45!"),
        body("email")
            .isEmail().withMessage("Insira um <strong>endereço de email</strong> valido!"),
        body("dataNascUsuario")
            .isDate().withMessage('Data deve estar no <strong>formato YYYY-MM-DD</strong>.'),
        body("Estado")
            .notEmpty().withMessage("Escolha seu <strong>Estado</strong>."),
        body("senha")
            .isStrongPassword().withMessage('<strong>Senha:</strong> Insira uma senha forte.'),
        body("confirmarSenha")
            .isStrongPassword().withMessage('<strong>Confirmar senha:</strong> Insira uma senha forte.')
            .custom((confirmaSenha, { req }) => {
                if (confirmaSenha === req.body.senha) {
                    return true;
                }
                throw new Error()
            }).withMessage('As senhas <strong>não coincidem</strong>.')
    ],

    regrasValidacaoFormLogin: [

    ],

    cadastrarUsuario: async (req, res)=>{
        const erros = validationResult(req)
        if (!erros.isEmpty()){
            console.log(erros)
            return res.render(
                "pages/cadastro-usuario", 
                { 
                    pagina: "usuario", 
                    logado: null, 
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
                dataNascUsuario: req.body.dataNascUsuario,
                enderecoUsuario: req.body.Estado
            }

            const resultado = await usuarioModel.create(dadosForm);
            console.log(resultado);
            console.log('Cadastro realizado!');
                
            res.render(
                "pages/cadastro-usuario", 
                { 
                    pagina: "usuario", 
                    logado: true, 
                    erros: null,
                    dadosForm: req.body 
                }
            );
        } catch (err) {
            console.log(err);
        }
    }

}

module.exports = usuarioController