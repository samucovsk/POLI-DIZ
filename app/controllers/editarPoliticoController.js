var pool = require("../../config/pool-conexoes");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { mensagemErro } = require("../util/logs");
const politicosModel = require("../models/politicosModel");
const { removeImg } = require("../util/removeImg");
var salt = bcrypt.genSaltSync(12);
 
const editarPoliticoController = {
    // Validações do formulário de atualização de perfil
    regrasValidacaoFormAttPerfilCandidato: [
        body('nome').isLength({ min: 3 }).withMessage(mensagemErro.NOME_INVALIDO),
        body('desc_usuario').isLength({ min: 3, max: 250 }).withMessage(mensagemErro.DESC_INVALIDA),
        body('estado').notEmpty().withMessage(mensagemErro.UF_INVALIDA),
        body('candidatura').notEmpty().withMessage('Especifique sua candidatura.'),
    ],
 
    // Validações do formulário de atualização de conta
    regrasValidacaoFormAttContaCandidato: [
        body('email').isEmail().withMessage(mensagemErro.EMAIL_INVALIDO),
        body('senha').custom(senha => {
            if (!senha) {
                return;
            }

            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

            if (regex.test(senha)) {
                throw new Error();
            }
        }).withMessage(mensagemErro.SENHA_FRACA)
    ],
 
    // Atualiza perfil do político
    atualizarPerfilCandidato: async (req, res) => {
        const erros = validationResult(req);
       
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render('pages/editar-candidato', { logado: req.session.autenticado, dadosForm: req.body, erros: erros });
        }
 
        try {
            const results = await pool.query(
                "UPDATE Politicos SET nomePoliticos = ?, ufPoliticos = ?, descPoliticos = ?, candidaturaPoliticos = ? WHERE idPoliticos = ?",
                [req.body.nome, req.body.estado, req.body.desc_usuario, req.body.candidatura, req.session.autenticado.id]
            );
 
            console.log(results);
 
            const politicoAtualizado = await politicosModel.findId(req.session.autenticado.id);
           
            if (politicoAtualizado.length > 0) {
                // Atualiza a sessão com os novos dados
                req.session.autenticado = {
                    nome: politicoAtualizado[0].nomePoliticos,
                    id: politicoAtualizado[0].idPoliticos,
                    estado: politicoAtualizado[0].ufPoliticos,
                    candidatura: politicoAtualizado[0].candidaturaPoliticos,
                    foto_usuario: politicoAtualizado[0].fotoPerfilPoliticos,
                    desc_usuario: politicoAtualizado[0].descPoliticos,
                    tipo: "candidato"
                };
 
                res.redirect('/perfil-candidato/' + req.session.autenticado.id);
            }
        } catch (err) {
            console.log(err);
        }
    },
 
    // Atualiza conta do político (email e senha)
    atualizarContaCandidato: async (req, res) => {
        const erros = validationResult(req);
       
        if (!erros.isEmpty()) {
            return res.render('pages/editar-candidato', { logado: req.session.autenticado, dadosForm: req.body, erros: erros });
        }
       
        try {
            const senhaComHash = bcrypt.hashSync(req.body.senha, salt);
           
            const results = await pool.query(
                "UPDATE Politicos SET contatoPoliticos = ?, senhaPoliticos = ? WHERE idPoliticos = ?",
                [req.body.email, senhaComHash, req.session.autenticado.id]
            );
 
            console.log(results);
 
            const politicoAtualizado = await politicosModel.findId(req.session.autenticado.id);
           
            if (politicoAtualizado.length > 0) {
                req.session.autenticado = {
                    nome: politicoAtualizado[0].nomePoliticos,
                    id: politicoAtualizado[0].idPoliticos,
                    estado: politicoAtualizado[0].ufPoliticos,
                    candidatura: politicoAtualizado[0].candidaturaPoliticos,
                    foto_usuario: politicoAtualizado[0].fotoPerfilPoliticos,
                    desc_usuario: politicoAtualizado[0].descPoliticos,
                    tipo: "candidato"
                };
            }
 
            res.redirect('/perfil-candidato/' + req.session.autenticado.id);
        } catch (err) {
            console.log(err);
        }
    },
 
    // Atualiza a foto de perfil do político
    mudarFotosCandidato: async (req, res) => {
        const erros = { errors: [] };
        const erroMulter = req.session.erroMulter;
 
        if (erroMulter != null) {
            console.log(erroMulter);
            erros.errors.push(erroMulter);
            const politico = await politicosModel.findId(req.session.autenticado.id);
            return res.render("./pages/editar-candidato", {
                logado: politico[0],
                dadosForm: req.body,
                erros: erros,
            });
        }
 
        if (!req.file) {
            console.log("Falha ao carregar arquivo!");
            const politico = await politicosModel.findId(req.session.autenticado.id);
            return res.render("./pages/editar-candidato", {
                logado: politico[0],
                dadosForm: req.body,
                erros: erros,
            });
        } else {
            try {
                let caminhoFoto = req.session.autenticado.foto_usuario;
                if (caminhoFoto !== req.file.filename && caminhoFoto !== "fotoPerfilPadrao.jpg") {
                    removeImg(`./app/public/imagem/imagens-servidor/perfil/${caminhoFoto}`);
                }
                caminhoFoto = req.file.filename;
 
                let resultado = await pool.query(
                    "UPDATE Politicos SET fotoPerfilPoliticos = ? WHERE idPoliticos = ?",
                    [caminhoFoto, req.session.autenticado.id]
                );
 
                const politicoAtualizado = await politicosModel.findId(req.session.autenticado.id);
 
                req.session.autenticado = {
                    ...req.session.autenticado,
                    foto_usuario: caminhoFoto
                };
 
                console.log(resultado);
               
                const dadosNotificacao = {
                    tipo: "sucesso",
                    titulo: "Tudo ocorreu como esperado :)",
                    msg: "Sua foto foi atualizada!"
                };
 
                res.redirect('/perfil-candidato/' + req.session.autenticado.id);
            } catch (err) {
                console.log(err);
            }
        }
    },

    mudarBannerCandidato: async (req, res) => {
        const erros = { errors: [] };
        const erroMulter = req.session.erroMulter;
 
        if (erroMulter != null) {
            console.log(erroMulter);
            erros.errors.push(erroMulter);
            const politico = await politicosModel.findId(req.session.autenticado.id);
            return res.render("./pages/editar-candidato", {
                logado: politico[0],
                dadosForm: req.body,
                erros: erros,
            });
        }
 
        if (!req.file) {
            console.log("Falha ao carregar arquivo!");
            const politico = await politicosModel.findId(req.session.autenticado.id);
            return res.render("./pages/editar-candidato", {
                logado: politico[0],
                dadosForm: req.body,
                erros: erros,
            });
        } else {
            try {
                let caminhoFoto = req.session.autenticado.foto_usuario;
                if (caminhoFoto !== req.file.filename && caminhoFoto !== "bannerPadrao.jpg") {
                    removeImg(`./app/public/imagem/imagens-servidor/banner/${caminhoFoto}`);
                }
                caminhoFoto = req.file.filename;
 
                let resultado = await pool.query(
                    "UPDATE Politicos SET bannerPoliticos = ? WHERE idPoliticos = ?",
                    [caminhoFoto, req.session.autenticado.id]
                );
 
                const politicoAtualizado = await politicosModel.findId(req.session.autenticado.id);
 
                req.session.autenticado = {
                    ...req.session.autenticado,
                    foto_usuario: caminhoFoto
                };
 
                console.log(resultado);
 
                res.redirect('/perfil-candidato/' + req.session.autenticado.id);
            } catch (err) {
                console.log(err);
            }
        }
    } 
};
 
module.exports = editarPoliticoController;