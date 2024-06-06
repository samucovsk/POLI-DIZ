var express = require("express");
var router = express.Router();
const tipoQuartosController = require("../../config/pool_conexoes");

router.get("/", function (req, res) {
    res.render("pages/index", {pagina:"home", logado:null});
});

router.get("/cadastro", function (req, res) {
    res.render("pages/cadastro-eleitor", {pagina:"cadastro", logado:null});
});
