var express = require("express");
var router = express.Router();

router.get("/index.html", function (req, res) {
    res.render("app\views\pages\index.html",{pagina:"index"});
});