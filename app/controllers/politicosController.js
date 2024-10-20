const usuario = require("../models/usuarioModel");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const usuarioModel = require("../models/usuarioModel");
const { mensagemErro } = require("../util/logs");
const politicosModel = require("../models/politicosModel");
const pool = require("../../config/pool-conexoes");
var salt = bcrypt.genSaltSync(12);

const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const https = require("https");
const jwt = require("jsonwebtoken");
const { enviarEmail } = require("../util/email");
const { emitWarning } = require("process");
 
const politicoController = {
    // Validações
    regrasValidacaoFormCad: [
        body("nome")
            .isLength({ min: 3, max: 45 }).withMessage(`<strong>Nome de Usuário:</strong> ${mensagemErro.NOME_INVALIDO}`),
        body("email")
            .isEmail().withMessage(mensagemErro.EMAIL_INVALIDO)
            .custom(async emailUsuario => {
                try {
                    const resultado = politicosModel.findCampoCustom(emailUsuario, "contatoPoliticos");
                   
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
            .notEmpty().withMessage(`Escolha um <strong>Partido</strong>.`)
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
               
            const token = jwt.sign(
                { userId: resultado.insertId }, 
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );            
    
            console.log('Token JWT:', token);
    
            // Gera o HTML do e-mail
            const html = await require('../util/enviar-email')(process.env.URL_BASE, token, 0);
    
            // Envia o e-mail
            enviarEmail(dadosForm.contatoPoliticos, "Cadastro no PoliDiz", null, html, () => {
                res.render("pages/cadastro-politico", { 
                    pagina: "politicocadastro", 
                    logado: req.session.autenticado, 
                    form_aprovado: true,
                    erros: null,
                    dadosForm: req.body 
                });
            });
            
        } catch (e) {
            console.log(e);
            return res.render("pages/cadastro-politico", { 
                pagina: "politicocadastro", 
                logado: req.session.autenticado,
                form_aprovado: false, 
                erros: erros,
                dadosForm: req.body
            });
        }
    },

    ativarConta: async (req, res) => {
        try {
            const token = req.query.token;
            console.log("Token recebido:", token);
    
            jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
                if (err) {
                    console.log({ message: "Token inválido ou expirado" });
                    return res.json({ msg: err });
                }
    
                const [rows] = await pool.query('SELECT * FROM Politicos WHERE idPoliticos = ?', [decoded.userId]);
                const user = rows[0]; // Primeiro item do resultado
                if (!user) {
                    console.log({ message: "Usuário não encontrado" });
                    return res.json({ msg: 'Erro ao achar usuário' });
                }
                console.log(user);
    
                const [results] = await pool.query("UPDATE Politicos SET status_politico = 1 WHERE idPoliticos = ?", [decoded.userId]);
                console.log(results);
    
                console.log({ message: "Conta ativada" });
    
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
                            type: 'success',  // Corrigido para 'success'
                            msg: "Sua conta foi ativada!",
                            title: "Prontinho :)"
                        }
                    }
                );
            });
    
        } catch (e) {
            console.log(e);
            res.redirect('/error'); // Redireciona em caso de erro inesperado
        }
    },
    
 
    realizarPostagem: async (req, res, userId) => {
        const erros = validationResult(req);
        let erroMulter = req.session.erroMulter;
 
        if (erroMulter != null) {
            console.log(erroMulter);
            erros.errors.push(erroMulter);
            const politico = await politicosModel.findId(req.session.autenticado.id);
            return res.render("./pages/postar_foto", {
                logado: req.session.autenticado,
                dadosForm: req.body,
                erros: erros,
            });
        }
 
        if (!req.file) {
            console.log("Ops, falha ao carregar arquivo!");
            erroMulter = {
                value: '',
                msg: 'É necessário enviar pelo menos uma imagem.',
                path: 'foto'
            }
            erros.errors.push(erroMulter);

            return res.render("pages/postar_foto", {
                logado: req.session.autenticado,
                dadosForm: req.body,
                erros: erros,
                userId
            });
        }

        try {
            let caminhoFoto = req.file.filename;

            const date = new Date();
            const dataPostagem = `${date.getFullYear()}--${date.getMonth()}--${date.getDay()}`;
    
            const dadosForm = {
                Titulo_postagem: req.body.titulo,
                Imagem_postagem	: caminhoFoto,
                Politicos_idPoliticos: userId,
                data_postagem: dataPostagem
            };
    
            const results = await politicosModel.guardarPostagem(dadosForm);

            console.log('Postagem guardada no db');
            
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

            const [ postagens ] = await pool.query('SELECT * FROM Postagem WHERE Politicos_idPoliticos = ?', [userId]);
    
            res.render(
                'pages/perfil-candidato', 
                { 
                    pagina: "perfil-candidato", 
                    logado: req.session.autenticado, 
                    dadosNotificacao: null, 
                    dadosUsuario: { ...req.session.autenticado, perfilAdm: true }, 
                    postagens: postagens,
                    dadosNotificacao: {
                        type: 'sucess',
                        title: 'Tudo ocorreu como esperado :)',
                        msg: 'Seu feed foi atualizado.'
                    },
                    userId,
                }
            );
        } catch (err) {
            console.log(err);
        }
    },

    guardarUrlReuniao: async (req, res) => {
        const erros = validationResult(req);

        if (!erros.isEmpty()) {
            return res.render(
                'pages/perfil-candidato', 
                { 
                    pagina: "perfil-candidato", 
                    logado: req.session.autenticado, 
                    dadosNotificacao: null, 
                    erros: erros,
                    dadosUsuario: { ...req.session.autenticado, perfilAdm: true }, 
                    postagens: postagens,
                    userId,
                }
            );
        }
        const inicioReuniao = new Date();
        const fimReuniao = new Date(inicioReuniao.getTime() + 60 * 60 * 1000);

        const tempoReuniao = fimReuniao - inicioReuniao;
        const userId = req.user.id;
        
        if (tempoReuniao <= 0) {
            return res.render(
                'pages/perfil-candidato', 
                { 
                    pagina: "perfil-candidato", 
                    logado: req.session.autenticado, 
                    dadosNotificacao: {
                        type: 'warning',
                        msg: 'A reunião foi encerrada.',
                        title: 'Houve um imprevisto.'
                    }, 
                    erros: null,
                    dadosUsuario: { ...req.session.autenticado, perfilAdm: true }, 
                    postagens: postagens,
                    userId,
                }
            );
        }

        pool.query(
            'UPDATE Politicos SET linkReuniao = ?, dataExpiracaoReuniao = ? WHERE id = ?',
            [req.body.url, fimReuniao, userId],
            (error, results) => {
                if (error) return res.status(500).json({ message: 'Erro ao salvar o link' });

                setTimeout(() => {
                    db.query('UPDATE Politicos SET LinkReuniao = NULL, dataExpiracaoReuniao = NULL WHERE id = ?', [userId], (error) => {
                        if (error) {
                            return res.render(
                                'pages/perfil-candidato', 
                                { 
                                    pagina: "perfil-candidato", 
                                    logado: req.session.autenticado, 
                                    dadosNotificacao: null, 
                                    erros: [
                                        {
                                            path: 'url',
                                            msg: "Houve um erro ao carregar o link."
                                        }
                                    ],
                                    dadosUsuario: { ...req.session.autenticado, perfilAdm: true }, 
                                    postagens: postagens,
                                    userId,
                                }
                            );
                        } else {
                            console.log(`Link do Meet removido para o usuário ${userId}`);
                        }
                    });
                }, tempoReuniao);

                return res.render(
                    'pages/perfil-candidato', 
                    { 
                        pagina: "perfil-candidato", 
                        logado: req.session.autenticado, 
                        dadosNotificacao: {
                            type: 'sucess',
                            msg: 'A reunião está disponível para os demais usuários.',
                            title: 'Tudo ocorreu como esperado :)'
                        }, 
                        erros: null,
                        dadosUsuario: { ...req.session.autenticado, perfilAdm: true }, 
                        postagens: postagens,
                        userId,
                    }
                );
            }
        );
        
    }
 
}
 
module.exports = politicoController