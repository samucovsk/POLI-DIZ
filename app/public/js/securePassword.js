(() => {
    const formPagina = document.getElementById('form');

    // Isso só evita que você cole conteúdo de outros campos fo formulário no campo da senha
    formPagina.confirmarSenha.addEventListener('paste', function (ev) {
        ev.preventDefault();
    });
})();