const express = require("express");
const router = express.Router();
const pool = require('../../config/pool-conexoes');

const usuarioController = require("../controllers/usuarioController");
const politicoController = require("../controllers/politicosController");
const { autenticador } = require("../sessions/autenticador_middleware");


/* ====================== Rotas GET ====================== */

router.get('/logOut', autenticador.limparSessao, function (req, res) {
    res.redirect('/');
});

router.get("/", autenticador.verificarUsuAutenticado, function (req, res) {
    res.render("pages/index", { pagina: "home", logado: req.session.autenticado });
});

router.get("/home", autenticador.verificarUsuAutenticado,function (req, res) {
    res.render("pages/index", { pagina: "home", logado: req.session.autenticado });
});

router.get("/escolha", function (req, res) {
    res.render("pages/escolha", { pagina: "escolha", logado: req.session.autenticado });
});
router.get("/noticias", function (req, res) {
    res.render("pages/news", { pagina: "noticias", logado: req.session.autenticado });
});
router.get("/login_usuario", function (req, res) {
    res.render("pages/login", { 
        pagina: "login", 
        erros: null, 
        form_aprovado: false, 
        cadastro_aprovado: true,
        logado: req.session.autenticado,
        dadosForm: {
            email: "",
            senha: ""
        }
    });
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
            erros: null, 
            dadosForm: { 
                email: "", 
                senha: "", 
            }
        }
    )
});

router.get('/perfil', function (req, res) {
    console.log(req.session.autenticado);
    
    res.render('pages/perfil', { pagina: "escolha", logado: req.session.autenticado })
});

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

module.exports = router;