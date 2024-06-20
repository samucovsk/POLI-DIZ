
let slideIndex = 0;

const showSlides = (n) => {
    const slides = document.querySelectorAll('.carousel-image');
    if (n >= slides.length) {
        slideIndex = 0;
    } 
    if (n < 0) {
        slideIndex = slides.length - 1;
    }
    slides.forEach((slide, index) => {
        slide.style.transform = `translateX(-${slideIndex * 100}%)`;
    });
}