const express = require("express");
const router = express.Router();
const pool = require('../../config/pool-conexoes');

const usuarioController = require("../controllers/usuarioController")

router.post("/cadastro", usuarioController.regrasValidacaoFormCad, function (req, res){
    usuarioController.cadastrarUsuario(req, res)
})

router.get("/", function (req, res) {
    res.render("pages/index", { pagina: "home", logado: null });
});

router.get("/home", function (req, res) {
    res.render("pages/index", { pagina: "home", logado: null });
});

router.get("/escolha", function (req, res) {
    res.render("pages/escolha", { pagina: "escolha", logado: null });
});
router.get("/noticias", function (req, res) {
    res.render("pages/news", { pagina: "noticias", logado: null });
});
router.get("/politicos", function (req, res) {
    res.render("pages/PARTIDOS", { pagina: "politicos", logado: null });
});
router.get("/usuario", function (req, res) {
    res.render("pages/cadastro-usuario", { pagina: "usuario", logado: null, erros:null });
});
router.get("/login", function (req, res) {
    res.render("pages/login", { pagina: "login", logado: null });
});

router.post("/cadastro",
    usuarioController.regrasValidacaoFormCad,
    async function (req, res) {
        usuarioController.cadastrar(req, res);
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