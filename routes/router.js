const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
    res.render("public/pages/index", {pagina:"home", logado:null});
});
router.get("/login", function (req, res) {
    res.render("pages/login");
});
router.get("/noticias", function (req, res) {
    res.render("pages/news");
});
router.get("/politicos", function (req, res) {
    res.render("pages/perfil-candidato");
});

module.exports = router;