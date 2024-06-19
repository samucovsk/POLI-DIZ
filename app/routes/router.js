const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
    res.render("pages/index", {pagina:"home", logado:null});
});
router.get("/login", function (req, res) {
    res.render("pages/login", {pagina:"login", logado:null});
});
router.get("/noticias", function (req, res) {
    res.render("pages/news", {pagina:"noticia", logado:null});
});
router.get("/politicos", function (req, res) {
    res.render("pages/perfil-candidato", {pagina:"politicos", logado:null});
});

module.exports = router;