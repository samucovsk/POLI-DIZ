var pool = require("../../config/pool-conexoes");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { mensagemErro } = require("../util/logs");
const usuarioModel = require("../models/usuarioModel");
const politicosModel = require("../models/politicosModel");
const { removeImg } = require("../util/removeImg");
var salt = bcrypt.genSaltSync(12);

const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));
const https = require("https");
const jwt = require("jsonwebtoken");
const { enviarEmail } = require("../util/email");
  
const email = require("./../util/enviar-email");

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

    cadastrarUsuario: async (req, res) => {
        const erros = validationResult(req);
        if (!erros.isEmpty()) {
            console.log(erros);
            return res.render("pages/cadastro-usuario", { 
                pagina: "usuario", 
                logado: req.session.autenticado,
                form_aprovado: false, 
                erros: erros,
                dadosForm: req.body
            });
        }
    
        try {
            const senhaComHash = bcrypt.hashSync(req.body.senha, salt);
    
            const dadosForm = {
                nomeUsuario: req.body.nome,
                senha: senhaComHash,
                emailUsuario: req.body.email,
                dataNascUsuario: req.body.data_nascimento,
                enderecoUsuario: req.body.estado
            };
    
            const resultado = await usuarioModel.create(dadosForm);
            console.log('Cadastro realizado!', resultado);
            
            const token = jwt.sign(
                { userId: resultado.insertId }, 
                process.env.SECRET_KEY,
                { expiresIn: '1h' }
            );            
    
            console.log('Token JWT:', token);
    
            // Gera o HTML do e-mail
            const html = await require('../util/enviar-email')(process.env.URL_BASE, token, 0);
    
            // Envia o e-mail
            enviarEmail(dadosForm.emailUsuario, "Cadastro no PoliDiz", null, html, () => {
                res.render("pages/cadastro-usuario", { 
                    pagina: "usuario", 
                    logado: req.session.autenticado, 
                    form_aprovado: true,
                    erros: null,
                    dadosForm: req.body 
                });
            });
            
        } catch (e) {
            console.log(e);
            return res.render("pages/cadastro-usuario", { 
                pagina: "usuario", 
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
                    return res.json({msg: err});
                }
    
                const [user] = await pool.query('SELECT * FROM Usuario WHERE idUsuario = ?', [decoded.userId]);
                console.log(user.senhaUsuario);
                
                if (!user) {
                    console.log({ message: "Usuário não encontrado" });
                    return res.json({msg: 'Erro ao achar usuário'}) 
                }
    
                const [results] = await pool.query('UPDATE Usuario SET status_usuario = 1 WHERE idUsuario = ?', [decoded.userId]);
                
                console.log({ message: "Conta ativada" });
    
                res.render(
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
                            type: 'sucess',
                            msg: "Sua conta foi ativada!",
                            title: "Prontinho :)"
                        } 
                    }
                ) 
            });
    
        } catch (e) {
            console.log(e);
            res.redirect('/error'); // Redireciona em caso de erro inesperado
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
                    dadosForm: req.body,
                    dadosNotificacao: null
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
                dadosForm: req.body,
                dadosNotificacao: null
            });
    },
    
    validarTokenNovaSenha: async (req, res) => {
        //receber token da URL
    
        const token = req.query.token;
        console.log(token);
        //validar token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
          if (err) {
            res.render("pages/rec-senha", {
              erros: null,
              dadosNotificacao: { titulo: "Link expirado!", mensagem: "Insira seu e-mail para iniciar o reset de senha.", tipo: "error", },
              dadosForm: req.body,
              rota: "recuperarSenha"
            });
          } else {
            res.render("pages/rec-senha", {
              erros: null,
              logado: req.session.autenticado,
              dadosNotificacao: null,
              rota: "recuperarSenha"
            });
          }
        });
    },

    resetarSenha: async (req, res) => {
        const erros = validationResult(req);
        console.log(erros);
        if (!erros.isEmpty()) {
          return res.render("pages/rec-senha", {
            erros: erros,
            dadosNotificacao: null,
            dadosForm: req.body,
            rota: "recuperarSenha"
          });
        }
        try {
          //gravar nova senha
          const senha = bcrypt.hashSync(req.body.senha);
          
          if (req.body.isPolitico) {
            await pool.query('UPDATE Politicos SET senhaPoliticos = ? WHERE contatoPoliticos = ?', [senha, req.body.email]);
          } else {
            await pool.query('UPDATE Usuario SET senhaUsuario = ? WHERE emailUsuario = ?', [senha, req.body.email]);
          }

          res.render("pages/login", {
            erros: null,
            dadosNotificacao: {
              title: "Perfil alterado",
              msg: "Nova senha registrada",
              type: "success",
            },
            dadosForm: {
                email: req.body.email,
                senha: ""
            },
            form_aprovado: false
          });
        } catch (e) {
          console.log(e);
        }
    },

    recuperarSenha: async (req, res) => {
        const erros = validationResult(req);
        console.log(erros);
        if (!erros.isEmpty()) {
          return res.render("pages/rec-senha", {
            erros: erros,
            dadosNotificacao: null,
            dadosForm: req.body,
            logado: req.session.autenticado
          });
        }
        try {
          //logica do token
          let user;
          if (req.body.isPolitico) {
            user = await pool.query('SELECT * FROM Politicos WHERE contatoPoliticos = ?', [req.body.email]);
          } else {
            user = await pool.query('SELECT * FROM Usuario WHERE emailUsuario = ?', [req.body.email]);
          }

          const userId = user[0].insertId;

          const token = jwt.sign(
            { userId: userId, expiresIn: "40m" },
            process.env.SECRET_KEY
          );
          
            const html = await require("../util/enviar-email")(process.env.URL_BASE, token, 1);
            enviarEmail(req.body.email, "Pedido de recuperação de senha", null, html, () => {
                return res.render("pages/login", {
                    erros: null,
                    logado: req.session.autenticado,
                    dadosNotificacao: {
                        title: "Recuperação de senha",
                        msg: "Enviamos um e-mail com instruções para resetar sua senha",
                        type: "success",
                    },
                    dadosForm: {
                        senha: "",
                        email: ""
                    },
                    form_aprovado: false
                });
            });
        } catch (e) {
          console.log(e);
        }
      },

}

module.exports = usuarioController;