var pool = require("../../config/pool-conexoes");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { mensagemErro } = require("../util/logs");
const usuarioModel = require("../models/usuarioModel");
const politicosModel = require("../models/politicosModel");
const { removeImg } = require("../util/removeImg");
var salt = bcrypt.genSaltSync(12);

const editarUsuarioController = {
    regrasValidacaoFormAttPerfilEleitor: [
        body('nome').isLength({ min: 3 }).withMessage(mensagemErro.NOME_INVALIDO),
        body('desc_usuario').isLength({ min: 3, max: 250 }).withMessage(mensagemErro.DESC_INVALIDA),
        body('cep').isPostalCode("BR").withMessage(mensagemErro.CEP_INVALIDO),
        body('telefone')
            .isNumeric().withMessage(mensagemErro.TELEFONE_INVALIDO)
            .isMobilePhone("pt-BR").withMessage(mensagemErro.TELEFONE_INVALIDO),
        body('estado').notEmpty().withMessage(mensagemErro.UF_INVALIDA),
        body('cpf').custom(async cpf => {
            let soma = 0;
            let resto;
            for (let i = 1; i <= 9; i++) {
                soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
            }
            resto = (soma * 10) % 11;

            if (resto === 10 || resto === 11) {
                resto = 0;
            }
            if (resto !== parseInt(cpf.substring(9, 10))) {
                throw new Error(mensagemErro.CPF_INVALIDO);
            }

            soma = 0;

            // Validação do segundo dígito verificador
            for (let i = 1; i <= 10; i++) {
                soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
            }
            resto = (soma * 10) % 11;

            if (resto === 10 || resto === 11) {
                resto = 0;
            }
            if (resto !== parseInt(cpf.substring(10, 11))) {
                throw new Error(mensagemErro.CPF_INVALIDO);
            }

            return true;
        })
    ],

    regrasValidacaoFormAttContaEleitor: [
        body('email').isEmail().withMessage(mensagemErro.EMAIL_INVALIDO),
        body('senha').isStrongPassword().withMessage(mensagemErro.SENHA_FRACA)
    ],

    atualizarPerfilEleitor: async (req, res) => {
        const erros = validationResult(req);
        
        if (!erros.isEmpty()) {
            console.log(erros);
            
            return res.render('pages/editar-eleitor', { logado: req.session.autenticado, dadosForm: req.body, erros: erros });
        }

        try {
            const results = await pool.query(
                "UPDATE Usuario SET nomeUsuario = ?, enderecoUsuario = ?, descUsuario = ?, CPFUsuario = ?, cepUsuario = ?, TelefoneUsuario = ?  WHERE idUsuario = ?",
                [req.body.nome, req.body.estado, req.body.desc_usuario, req.body.cpf, req.body.cep, req.body.telefone, req.session.autenticado.id]
            );

            console.log(results);

            const usuarioAtualizado = await usuarioModel.findId(req.session.autenticado.id);
            
            if (usuarioAtualizado.length > 0) {
                req.session.autenticado = {
                    nome: usuarioAtualizado[0].nomeUsuario,
                    id: usuarioAtualizado[0].idUsuario,
                    estado: usuarioAtualizado[0].enderecoUsuario,
                    cpf: usuarioAtualizado[0].CPFUsuario,
                    cep: usuarioAtualizado[0].cepUsuario,
                    telefone: usuarioAtualizado[0].TelefoneUsuario,
                    foto_usuario: usuarioAtualizado[0].fotoPerfilUsuario,
                    desc_usuario: usuarioAtualizado[0].descUsuario,
                    data_nascimento: usuarioAtualizado[0].dataNascUsuario,
                    tipo: "eleitor"
                };
            }

            res.redirect('/perfil-eleitor/' + req.session.autenticado.id);
        } catch (err) {
            console.log(err);
        }
    },

    atualizarContaEleitor: async (req, res) => {
        const erros = validationResult(req);
        
        if (!erros.isEmpty()) {
            return res.render('pages/editar-eleitor', { logado: req.session.autenticado, dadosForm: req.body, erros: erros });
        }
        
        try {
            const senhaComHash = bcrypt.hashSync(req.body.senha, salt);
            
            const results = await pool.query(
                "UPDATE Usuario SET emailUsuario = ?, senha = ?  WHERE idUsuario = ?",
                [req.body.email, senhaComHash, req.session.autenticado.id]
            );

            console.log(results);

            const usuarioAtualizado = await usuarioModel.findId(req.session.autenticado.id);
            
            if (usuarioAtualizado.length > 0) {
                req.session.autenticado = {
                    nome: usuarioAtualizado[0].nomeUsuario,
                    id: usuarioAtualizado[0].idUsuario,
                    estado: usuarioAtualizado[0].enderecoUsuario,
                    cpf: usuarioAtualizado[0].CPFUsuario,
                    cep: usuarioAtualizado[0].cepUsuario,
                    telefone: usuarioAtualizado[0].TelefoneUsuario,
                    foto_usuario: usuarioAtualizado[0].fotoPerfilUsuario,
                    desc_usuario: usuarioAtualizado[0].descUsuario,
                    data_nascimento: usuarioAtualizado[0].dataNascUsuario,
                    tipo: "eleitor"
                };
            }


            res.redirect('/perfil-eleitor/' + req.session.autenticado.id);
        } catch (err) {
            console.log(err);
        }
    },

    mudarFotosEleitor: async (req, res) => {
        const erros = {
            errors: []
        };
        const erroMulter = req.session.erroMulter;
        if (erroMulter != null) {
            console.log(erroMulter);
            
            erros.errors.push(erroMulter);
            removeImg(`./app/public/img/imagens-servidor/capaImg/${req.file.filename}`);

            const user = req.session.autenticado ? await usuarioModel.findId(req.session.autenticado.id) : new Error("Erro ao acessar o banco")
            res.render(
                "./pages/editar-eleitor", 
                {
                    logado: user[0],
                    dadosForm: req.body,
                    erros: erros,
                }
            );
        }

        if (!req.file) {
            console.log("falha ao carregar arquivo!")
            const user = req.session.autenticado ? await usuarioModel.findId(req.session.autenticado.id) : new Error("Erro ao acessar o banco")
            return res.render(
                "./pages/editar-eleitor", 
                {
                    logado: user[0],
                    dadosForm: req.body,
                    erros: erros,
                }
            )
        } else {
            try {
                let caminhoFoto = req.session.autenticado.foto_usuario
                if (caminhoFoto != req.file.filename && caminhoFoto != "fotoPerfilPadrao.jpg") {
                    removeImg(`./app/public/img/imagens-servidor/perfil/${caminhoFoto}`)
                }
                caminhoFoto = req.file.filename
                let resultado = await pool.query(
                    "UPDATE Usuario SET fotoPerfilUsuario = ? WHERE idUsuario = ?",
                    [caminhoFoto, req.session.autenticado.id]
                );

                const user = await usuarioModel.findId(req.session.autenticado.id);

                req.session.autenticado = user[0];
                req.session.autenticado.foto = caminhoFoto;
                console.log(resultado)
                
                const dadosNotificacao = {
                    tipo: "sucess",
                    titulo: "Tudo ocorreu como esperado :)",
                    msg: "Sua foto foi atualizada!"
                }

                res.redirect('/perfil-eleitor/' + req.session.autenticado.id);
            } catch (errors) {
                console.log(errors)
            }
        }
    }
};

module.exports = editarUsuarioController;