document.addEventListener("DOMContentLoaded", function () {
    const menuHamburguer = document.querySelector('.menu-hamburguer');
    const menu = document.querySelector('.menu');

    menuHamburguer.addEventListener('click', () => {
        menu.classList.toggle('aberto');
    });
});