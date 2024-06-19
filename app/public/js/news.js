function noturno(){
    const root = document.documentElement;
    root.classList.toggle('noturno');
}
document.addEventListener("DOMContentLoaded", function () {
    const linksLeiaMais = document.querySelectorAll('.leia-mais');
    const noticias = document.querySelectorAll('.noticia');

    linksLeiaMais.forEach((link, index) => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const noticiaAtual = noticias[index];

            if (!noticiaAtual.classList.contains('expandida')) {
                expandirNoticia(noticiaAtual);
                esconderOutrasNoticias(noticiaAtual);
            } else {
                contrairNoticia(noticiaAtual);
                mostrarOutrasNoticias();
            }
        });
    });

    function expandirNoticia(noticia) {
        noticia.classList.add('expandida');
    }

    function contrairNoticia(noticia) {
        noticia.classList.remove('expandida');
    }

    function esconderOutrasNoticias(noticiaAtual) {
        noticias.forEach(noticia => {
            if (noticia !== noticiaAtual) {
                noticia.style.display = 'none';
            }
        });
    }

    function mostrarOutrasNoticias() {
        noticias.forEach(noticia => {
            noticia.style.display = 'block';
        });
    }
});
