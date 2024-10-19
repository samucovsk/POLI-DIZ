const express = require("express");
const router = express.Router();
const pool = require('../../config/pool-conexoes');
 
const usuarioController = require("../controllers/usuarioController");
const politicoController = require("../controllers/politicosController");
const editarUsuarioController = require('../controllers/editarUsuarioController');
const editarPoliticoController = require('../controllers/editarPoliticoController');
 
const { autenticador } = require("../sessions/autenticador_middleware");
const { mensagemErro } = require("../util/logs");
const upload = require("../util/uploadImg");
const usuarioModel = require("../models/usuarioModel");
const politicosModel = require("../models/politicosModel");
const { body } = require("express-validator");
const uploadPerfil = upload("./app/public/imagem/imagens_servidor/perfil/", 3, ['jpeg', 'jpg', 'png'], 3 / 4, 0);
const uploadBanner = upload("./app/public/imagem/imagens_servidor/banner/", 3, ['jpeg', 'jpg', 'png', 'avif', 'webp'], null, 0);
const uploadPhotoPost = upload("./app/public/imagem/imagens_servidor/postagens/", 3, ['jpeg', 'jpg', 'png'], 3 / 4, 0);

/* ====================== Rotas GET ====================== */
 
router.get('/logOut', autenticador.limparSessao, function (req, res) {
    res.redirect('/');
});
 
router.get("/", autenticador.verificarUsuAutenticado, function (req, res) {
    console.log(req.session.autenticado);
   
    res.render("pages/index", { pagina: "home", logado: req.session.autenticado });
});
 
router.get("/escolha", function (req, res) {
    res.render("pages/escolha", { pagina: "escolha", logado: req.session.autenticado });
});
/* temporario*/
 
router.get("/postnovo", function (req, res) {
    res.render("pages/postnovo", { pagina: "postnovo", logado: req.session.autenticado });
});

/*temporario*/ 
router.get("/superchat", autenticador.verificarUsuAutenticado,function (req, res) {
    res.render("pages/links", { pagina: "superchat", logado: req.session.autenticado });
});

router.get("/noticias", function (req, res) {
    res.render("pages/news", { pagina: "noticias", logado: req.session.autenticado });
});
 
router.get("/politicos", function (req, res) {
    res.render("pages/PARTIDOS", { pagina: "politicos", logado: req.session.autenticado });
});
router.get("/pcdob", function (req, res) {
    res.render("pages/pcdob", { pagina: "pcdob", logado: req.session.autenticado });
});
router.get("/uniaobrasil", function (req, res) {
    res.render("pages/uniaobrasil", { pagina: "uniaobrasil", logado: req.session.autenticado });
});
router.get("/agir", function (req, res) {
    res.render("pages/agir", { pagina: "agir", logado: req.session.autenticado });
});
router.get("/cidadania23", function (req, res) {
    res.render("pages/cidadania23", { pagina: "cidadania23", logado: req.session.autenticado });
});
router.get("/dc", function (req, res) {
    res.render("pages/dc", { pagina: "dc", logado: req.session.autenticado });
});
router.get("/prd", function (req, res) {
    res.render("pages/prd", { pagina: "prd", logado: req.session.autenticado });
});
router.get("/rede", function (req, res) {
    res.render("pages/rede", { pagina: "rede", logado: req.session.autenticado });
});
router.get("/solidariedade", function (req, res) {
    res.render("pages/solidariedade", { pagina: "solidariedade", logado: req.session.autenticado });
});
router.get("/up", function (req, res) {
    res.render("pages/up", { pagina: "up", logado: req.session.autenticado });
});
router.get("/psd", function (req, res) {
    res.render("pages/psd", { pagina: "psd", logado: req.session.autenticado });
});
router.get("/pt", function (req, res) {
    res.render("pages/pt", { pagina: "pt", logado: req.session.autenticado });
});
router.get("/prtb", function (req, res) {
    res.render("pages/prtb", { pagina: "prtb", logado: req.session.autenticado });
});
router.get("/pv", function (req, res) {
    res.render("pages/pv", { pagina: "pv", logado: req.session.autenticado });
});
router.get("/avante", function (req, res) {
    res.render("pages/avante", { pagina: "avante", logado: req.session.autenticado });
});
router.get("/mdb", function (req, res) {
    res.render("pages/mdb", { pagina: "mdb", logado: req.session.autenticado });
});
router.get("/mobiliza", function (req, res) {
    res.render("pages/mobiliza", { pagina: "mobiliza", logado: req.session.autenticado });
});
router.get("/novo", function (req, res) {
    res.render("pages/novo", { pagina: "novo", logado: req.session.autenticado });
});
router.get("/pcb", function (req, res) {
    res.render("pages/pcb", { pagina: "pcb", logado: req.session.autenticado });
});
router.get("/pco", function (req, res) {
    res.render("pages/pco", { pagina: "pco", logado: req.session.autenticado });
});
router.get("/pdt", function (req, res) {
    res.render("pages/pdt", { pagina: "pdt", logado: req.session.autenticado });
});
router.get("/pl", function (req, res) {
    res.render("pages/pl", { pagina: "pl", logado: req.session.autenticado });
});
router.get("/pode", function (req, res) {
    res.render("pages/pode", { pagina: "pode", logado: req.session.autenticado });
});
router.get("/pp", function (req, res) {
    res.render("pages/pp", { pagina: "pp", logado: req.session.autenticado });
});
router.get("/psol", function (req, res) {
    res.render("pages/psol", { pagina: "psol", logado: req.session.autenticado });
});
router.get("/pmb", function (req, res) {
    res.render("pages/pmb", { pagina: "pmb", logado: req.session.autenticado });
});
router.get("/pstu", function (req, res) {
    res.render("pages/pstu", { pagina: "pstu", logado: req.session.autenticado });
});
router.get("/psb", function (req, res) {
    res.render("pages/psb", { pagina: "psb", logado: req.session.autenticado });
});
router.get("/psdb", function (req, res) {
    res.render("pages/psdb", { pagina: "psdb", logado: req.session.autenticado });
});
router.get("/republicanos", function (req, res) {
    res.render("pages/republicanos", { pagina: "republicanos", logado: req.session.autenticado });
});

router.get("/politicocadastro", function (req, res) {
    res.render(
        "pages/cadastro-politico",
        {
            pagina: "politicocadastro",
            logado: req.session.autenticado,
            form_aprovado: false,
            erros: null,
            dadosForm: {
                nome: "",
                email: "",
                data_nascimento: "",
                cpf: "",
                Estado: "",
                senha: "",
                confirmarSenha: ""
            }
        }
    );
});
 
router.get("/usuario", function (req, res) {
    res.render(
        "pages/cadastro-usuario",
        {
            pagina: "usuario",
            logado: req.session.autenticado,
            form_aprovado: false,
            erros: null,
            dadosForm: {
                nome: "",
                email: "",
                data_nascimento: "",
                Estado: "",
                senha: "",
                confirmarSenha: ""
            }
        }
    );
});

router.get('/ativar-conta', autenticador.verificarUsuAutenticado, (req, res) => {
    usuarioController.ativarConta(req, res);
    politicoController.ativarConta(req, res);
});

router.get('/rec-senha', autenticador.verificarUsuAutenticado, (req, res) => {
    res.render(
        'pages/rec-senha', 
        {
            erros: null,
            dadosNotificacao: null,
            dadosForm: {
                senha: '',
                email: ''
            },
            rota: 'redefinirSenha'
        }
    )
});

router.get('/resetar-senha', autenticador.verificarUsuAutenticado, (req, res) => {
    usuarioController.validarTokenNovaSenha(req, res);
});
 
router.get('/signin', function (req, res) {
    res.render('pages/login',
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
            dadosNotificacao: null
        }
    )
});
 
router.get(
    '/perfil-eleitor/:id',
    autenticador.verificarUsuAutenticado,
    async function (req, res) {
        try {
            const userId = req.params.id;
            const [results] = await usuarioModel.findId(userId);
            console.log(results);
           
            const dadosUsuario = {
                nome: results.nomeUsuario,
                id: results.idUsuario,
                estado: results.enderecoUsuario,
                foto_usuario: results.fotoPerfilUsuario,
                banner_usuario: results.bannerUsuario,
                desc_usuario: results.descUsuario,
                perfilAdm: false
            };
 
            if (dadosUsuario.id === req.session.autenticado.id) {
                dadosUsuario.perfilAdm = true;
            }
           
            console.log(req.session.autenticado);
            res.render('pages/perfil-eleitor', { pagina: "perfil-eleitor", logado: req.session.autenticado, dadosUsuario: dadosUsuario, dadosNotificacao: null, userId });
        } catch (err) {
            console.log(err);
        }
    }
);
 
router.get(
    '/perfil-candidato/:id',
    autenticador.verificarUsuAutenticado,
    async function (req, res) {
        try {
            const userId = req.params.id;
            console.log("id: " + userId);
            const [results] = await politicosModel.findId(userId);
            console.log(results);
           
            const dadosUsuario = {
                nome: results.nomePoliticos,
                id: results.idPoliticos,
                email: results.contatoPoliticos,
                estado: results.ufPoliticos,
                candidatura: results.candidaturaPoliticos,
                foto_usuario: results.fotoPerfilPoliticos,
                banner_usuario: results.bannerPoliticos,
                desc_usuario: results.descPoliticos,
                perfilAdm: false
            };
 
            if (dadosUsuario.id === req.session.autenticado.id) {
                dadosUsuario.perfilAdm = true;
            }

            const [ postagens ] = await pool.query('SELECT * FROM Postagem WHERE Politicos_idPoliticos = ?', [userId]);
            
            console.log(postagens);
            
            res.render(
                'pages/perfil-candidato', 
                { 
                    pagina: "perfil-candidato", 
                    logado: req.session.autenticado, 
                    dadosNotificacao: null, 
                    dadosUsuario: dadosUsuario, 
                    postagens: postagens,
                    userId 
                }
            );
        } catch (err) {
            console.log(err);
        }
    }
);
 
router.get(
    '/editar_eleitor/:id',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('eleitor', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null, dadosNotificacao: null }),
    function (req, res) {
        const userId = req.params.id;
 
        console.log("Id logado:" + req.session.autenticado.id);
        console.log("Id req:" + userId);
       
 
        if (parseInt(req.session.autenticado.id) !== parseInt(userId)) {
            res.redirect('/');
        }
 
        res.render(
            'pages/editar-eleitor',
            {
                logado: req.session.autenticado,
                dadosForm: req.session.autenticado,
                erros: null,
                form_aprovado: false,
                userId
            }
        );
    }
);
 
router.get(
    '/editar_candidato/:id',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('candidato', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null, dadosNotificacao: null }),
    function (req, res) {
        const userId = req.params.id;
 
        if (parseInt(req.session.autenticado.id) !== parseInt(userId)) {
            res.redirect('/');
        }
 
        res.render(
            'pages/editar-candidato',
            {
                logado: req.session.autenticado,
                dadosForm: req.session.autenticado,
                erros: null,
                userId
            }
        );
    }
);
 
router.get(
    '/postarFoto',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('candidato', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null, dadosNotificacao: null }),
    function (req, res) {
        res.render('pages/postar_foto', { logado: req.session.autenticado, erros: null, dadosForm: null });
    }
);
 
/* ====================== Rotas POST ====================== */
 
router.post("/cadastro", usuarioController.regrasValidacaoFormCad, function (req, res){
    usuarioController.cadastrarUsuario(req, res);
    console.log(req.session.autenticado);
   
});
 
router.post("/cadastro-politico", politicoController.regrasValidacaoFormCad, function (req, res) {
    politicoController.cadastrarPolitico(req, res);
});
 
router.post('/signin', usuarioController.regrasValidacaoFormLogin, autenticador.gravarUsuAutenticado, function (req, res) {
    console.log(req.session.autenticado);
   
    usuarioController.signInEleitor(req, res);
});

router.post(
    '/redefinirSenha', 
    autenticador.verificarUsuAutenticado, 
    [
        body('senha').isStrongPassword().withMessage(mensagemErro.SENHA_FRACA),
        body('email')
            .isEmail().withMessage(mensagemErro.EMAIL_INVALIDO)
            .custom(async (emailUsuario, { req }) => {
                try {
                    let resultado;
                    if (req.body.isPolitico) {
                        resultado = await politicosModel.findCampoCustom(emailUsuario, "contatoPoliticos");
                    } else {
                        resultado = await usuarioModel.findCampoCustom(emailUsuario, "emailUsuario");
                    }

                    console.log(resultado);
                    
                    if (resultado.length === 0) {
                        throw new Error(mensagemErro.EMAIL_INEXISTENTE);
                    }

                    return true;
                } catch (e) {
                    throw new Error(e);
                }
        })
    ],
    (req, res) => {
        usuarioController.recuperarSenha(req, res);
    }
);

router.post(
    '/recuperarSenha', 
    autenticador.verificarUsuAutenticado, 
    [
        body('senha').isStrongPassword().withMessage(mensagemErro.SENHA_FRACA),
        body('email')
            .isEmail().withMessage(mensagemErro.EMAIL_INVALIDO)
            .custom(async (emailUsuario, { req }) => {
                try {
                    let resultado;
                    if (req.body.isPolitico) {
                        resultado = await politicosModel.findCampoCustom(emailUsuario, "contatoPoliticos");
                    } else {
                        resultado = await usuarioModel.findCampoCustom(emailUsuario, "emailUsuario");
                    }

                    console.log(resultado);
                    
                    if (resultado.length === 0) {
                        throw new Error(mensagemErro.EMAIL_INEXISTENTE);
                    }

                    return true;
                } catch (e) {
                    throw new Error(e);
                }
        })
    ],
    (req, res) => {
        usuarioController.resetarSenha(req, res);
    }
);
 
router.post(
    '/postarFoto/:id',
    uploadPhotoPost('foto'),
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('candidato', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null, dadosNotificacao: null }),
    body('titulo').notEmpty().withMessage('Insira um título').isLength({min: 5}).withMessage('Título muito curto!'),
    function (req, res) {
        console.log(req.file);
        
        const userId = parseInt(req.params.id);
        politicoController.realizarPostagem(req, res, userId);
    }
);
 
// Atualizar dados de usuário
 
router.post(
    '/editar_eleitor/atualizar_perfil_eleitor',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('eleitor', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null, dadosNotificacao: null }),
    editarUsuarioController.regrasValidacaoFormAttPerfilEleitor,
    function (req, res) {
        editarUsuarioController.atualizarPerfilEleitor(req, res);
    }
);
 
router.post(
    '/editar_eleitor/atualizar_conta_eleitor',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('eleitor', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null, dadosNotificacao: null }),
    editarUsuarioController.regrasValidacaoFormAttContaEleitor,
    function (req, res) {
        editarUsuarioController.atualizarContaEleitor(req, res);
    }
);
 
router.post(
    '/editar_eleitor/atualizar_fotos_eleitor',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('eleitor', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null, dadosNotificacao: null }),
    uploadPerfil("imgPerfil"),
    function (req, res) {
        console.log(req.body);
        editarUsuarioController.mudarFotosEleitor(req, res);
    }
)
 
router.post(
    '/editar_candidato/atualizar_perfil_candidato',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('candidato', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null, dadosNotificacao: null }),
    editarPoliticoController.regrasValidacaoFormAttPerfilCandidato,
    function (req, res) {
        editarPoliticoController.atualizarPerfilCandidato(req, res);
    }
);
 
router.post(
    '/editar_candidato/atualizar_conta_candidato',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('candidato', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null, dadosNotificacao: null }),
    editarPoliticoController.regrasValidacaoFormAttContaCandidato,
    function (req, res) {
        editarPoliticoController.atualizarContaCandidato(req, res);
    }
);
 
router.post(
    '/editar_candidato/atualizar_fotos_candidato',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('candidato', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null, dadosNotificacao: null }),
    uploadPerfil("imgPerfil"),
    function (req, res) {
        console.log(req.body);
        editarPoliticoController.mudarFotosCandidato(req, res);
    }
)

router.post(
    '/editar_candidato/atualizar_banner_candidato',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('candidato', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null, dadosNotificacao: null }),
    uploadBanner("bannerPerfil"),
    function (req, res) {
        console.log(req.body);
        editarPoliticoController.mudarBannerCandidato(req, res);
    }
)
 
//banco de dados//
router.get('/tabelas', async (req, res) => {
    try {
        const [results, fields] = await pool.query('SHOW TABLES');
        res.json(results);
    } catch (error) {
        console.error('Erro ao listar as tabelas:', error);
        res.status(500).send('Erro ao listar as tabelas');
    }
});
 
// Apenas teste (pode apagar dps)
router.get('/pegar_usuario', async (req, res) => {
    try {
        const [results, fields] = await pool.query('SELECT * FROM Usuario WHERE idUsuario = 55');
        const usuario = {
            nome: results[0].nomeUsuario,
            id: results[0].idUsuario,
            estado: results[0].enderecoUsuario,
            cpf: results[0].CPFUsuario,
            cep: results[0].cepUsuario,
            telefone: results[0].TelefoneUsuario,
            foto_usuario: results[0].fotoPerfilUsuario,
            desc_usuario: results[0].descUsuario,
            data_nascimento: results[0].dataNascUsuario,
            tipo: "eleitor"
        };
 
        const listaUsuarios = await pool.query("SELECT * FROM Usuario");
 
        console.log(listaUsuarios);
       
 
        res.render('pages/lista_usu', { logado: usuario, dadosNotificacao: null, dadosPagina: listaUsuarios });
       
    } catch (error) {
        console.error('Erro ao listar as tabelas:', error);
        res.status(500).send('Erro ao listar as tabelas');
    }
})
 
module.exports = router;