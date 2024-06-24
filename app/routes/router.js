const express = require("express");
const router = express.Router();
const db = require('../database');

router.get("/", function (req, res) {
    res.render("pages/index", {pagina:"home", logado:null});
});

router.get("/home", function (req, res) {
    res.render("pages/index", {pagina:"home", logado:null});
});

router.get("/escolha", function (req, res) {
    res.render("pages/escolha", {pagina:"escolha", logado:null});
});
router.get("/noticias", function (req, res) {
    res.render("pages/news", {pagina:"noticias", logado:null});
});
router.get("/politicos", function (req, res) {
    res.render("pages/PARTIDOS", {pagina:"politicos", logado:null});
});
router.get("/usuario", function (req, res) {
    res.render("pages/cadastro-usuario", {pagina:"usuario", logado:null});
});
//banco de dados//
router.get('/tabelas', (req, res) => {
    db.query('SHOW TABLES', (err, results) => {
      if (err) {
        return res.status(500).send('Erro ao listar as tabelas: ' + err.message);
      }
      res.json(results);
    });
  });

module.exports = router;