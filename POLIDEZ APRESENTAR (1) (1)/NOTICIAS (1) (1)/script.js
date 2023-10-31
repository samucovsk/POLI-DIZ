document.addEventListener('DOMContentLoaded', function() {
    const overlay = document.querySelector('.overlay');
    const text = document.querySelector('.animated-text');

    // Adiciona a classe 'active' ao overlay e ao texto
    function showText() {
        overlay.classList.add('active');
        text.classList.add('active');
    }

    // Aguarda 1 segundo e, em seguida, exibe o texto
    setTimeout(showText, 1200);
});
