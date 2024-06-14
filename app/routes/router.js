router.get("/home", function (req, res) {
    res.render("pages/index.html");
});
router.get("/login", function (req, res) {
    res.render("C:\Users\PMB\Downloads\POLI-DEZ\app\views\pages\login.html");
});
router.get("/noticias", function (req, res) {
    res.render("pages/news.html");
});
router.get("/politicos", function (req, res) {
    res.render("pages/perfil-candidato.html");
});