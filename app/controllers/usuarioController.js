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
            .isEmail().withMessage("Insira endereço de email valido"),
            body("dataNascUsuario")
            .isISO8601().withMessage('Data deve estar no formato YYYY-MM-DD.'),
            body("Estado")
            .isEmpty().withMessage("Escolha seu estado."),
            body("senha")
            .isStrongPassword().custom(senha => {
                if (senha === body("confirmarSenha")){
                    return
                }else {
                    throw new Error()
                }
            })
    ],
    cadastrarUsuario:(req, res)=>{
        const erros = validationResult(req)
        if (!erros.isEmpty()){
            console.log(erros)
            return res.render("pages/cadastro-usuario", { pagina: "usuario", logado: null, erros:erros });
        }
    }

}

module.exports = usuarioController