router.get("/home", function (req, res) {
    res.render("pages/index.html");
});
router.get("/login", function (req, res) {
    res.render("pages/login.html");
});
router.get("/noticia", function (req, res) {
    res.render("pages/news.html");
});
router.get("/politicos", function (req, res) {
    res.render("pages/perfil-candidato.html");
});