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
const uploadPhotoPost = upload("./app/public/imagem/imagens_servidor/postagens/", 3, ['jpeg', 'jpg', 'png'], 3 / 4, 0);

/* ====================== Rotas GET ====================== */
 
router.get('/logOut', autenticador.limparSessao, function (req, res) {
    res.redirect('/');
});
 
router.get("/", autenticador.verificarUsuAutenticado, function (req, res) {
    console.log(req.session.autenticado);
   
    res.render("pages/index", { pagina: "home", logado: req.session.autenticado });
});
 
router.get("/home", autenticador.verificarUsuAutenticado,function (req, res) {
    res.render("pages/index", { pagina: "home", logado: req.session.autenticado });
});
 
router.get("/escolha", function (req, res) {
    res.render("pages/escolha", { pagina: "escolha", logado: req.session.autenticado });
});

router.get("/superchat", autenticador.verificarUsuAutenticado,function (req, res) {
    res.render("pages/links", { pagina: "superchat", logado: req.session.autenticado });
});

router.get("/noticias", function (req, res) {
    res.render("pages/news", { pagina: "noticias", logado: req.session.autenticado });
});
 
router.get("/politicos", function (req, res) {
    res.render("pages/PARTIDOS", { pagina: "politicos", logado: req.session.autenticado });
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
            }
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
    autenticador.verificarUsuAutorizado('eleitor', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null }),
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
    autenticador.verificarUsuAutorizado('candidato', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null }),
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
    autenticador.verificarUsuAutorizado('candidato', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null }),
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
    '/postarFoto/:id',
    uploadPhotoPost('foto'),
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('candidato', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null }),
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
    autenticador.verificarUsuAutorizado('eleitor', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null }),
    editarUsuarioController.regrasValidacaoFormAttPerfilEleitor,
    function (req, res) {
        editarUsuarioController.atualizarPerfilEleitor(req, res);
    }
);
 
router.post(
    '/editar_eleitor/atualizar_conta_eleitor',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('eleitor', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null }),
    editarUsuarioController.regrasValidacaoFormAttContaEleitor,
    function (req, res) {
        editarUsuarioController.atualizarContaEleitor(req, res);
    }
);
 
router.post(
    '/editar_eleitor/atualizar_fotos_eleitor',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('eleitor', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null }),
    uploadPerfil("imgPerfil"),
    function (req, res) {
        console.log(req.body);
        editarUsuarioController.mudarFotosEleitor(req, res);
    }
)
 
router.post(
    '/editar_candidato/atualizar_perfil_candidato',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('candidato', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null }),
    editarPoliticoController.regrasValidacaoFormAttPerfilCandidato,
    function (req, res) {
        editarPoliticoController.atualizarPerfilCandidato(req, res);
    }
);
 
router.post(
    '/editar_candidato/atualizar_conta_candidato',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('candidato', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null }),
    editarPoliticoController.regrasValidacaoFormAttContaCandidato,
    function (req, res) {
        editarPoliticoController.atualizarContaCandidato(req, res);
    }
);
 
router.post(
    '/editar_candidato/atualizar_fotos_candidato',
    autenticador.verificarUsuAutenticado,
    autenticador.verificarUsuAutorizado('candidato', 'pages/login', { pagina: "login", logado: null, dadosForm: { email: '', senha: '' }, form_aprovado: false, erros: null }),
    uploadPerfil("imgPerfil"),
    function (req, res) {
        console.log(req.body);
        editarPoliticoController.mudarFotosCandidato(req, res);
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