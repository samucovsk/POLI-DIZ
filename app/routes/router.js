var express = require("express");
var router = express.Router();

router.get("/login.html", function (req, res) {
    res.render("app\views\pages\login.html",{pagina:"login"});
});