const usuario = require("../models/usuarioModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
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

        res.render(
            "pages/cadastro-usuario", 
            { 
                pagina: "usuario", 
                logado: true, 
                erros: null,
                dadosForm: req.body 
            }
        );
    }

}

module.exports = usuarioController