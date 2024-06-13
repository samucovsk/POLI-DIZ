router.get("/home", function (req, res) {
    res.render("pages/index.html",{pagina:"home"});
});
router.get("/login", function (req, res) {
    res.render("pages/login.html",{pagina:"login"});
});
router.get("/noticia", function (req, res) {
    res.render("pages/news.html",{pagina:"noticias"});
});
router.get("/politicos", function (req, res) {
    res.render("pages/perfil-candidato.html",{pagina:"politicos"});
});