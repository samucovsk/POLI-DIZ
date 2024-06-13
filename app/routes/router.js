router.get("/home", function (req, res) {
    res.render("views/pages/index.html",{pagina:"home"});
});
router.get("/login", function (req, res) {
    res.render("views/pages/login.html",{pagina:"login"});
});
router.get("/noticia", function (req, res) {
    res.render("views/pages/news.html",{pagina:"noticias"});
});
router.get("/politicos", function (req, res) {
    res.render("views/pages/perfil-candidato.html",{pagina:"politicos"});
});