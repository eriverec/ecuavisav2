var classListaProgramas = document.querySelector('.lista-bloque-informativos');
var classListaProgramasNot = document.querySelector('.lista-bloque-informativos .noticias');
var classListaProgramasNotArt = document.querySelectorAll('.lista-bloque-informativos .noticias article');

classListaProgramas.classList.add('swiper');
classListaProgramasNot.classList.add('swiper-wrapper');

for (const SlideProg of classListaProgramasNotArt) {
  SlideProg.classList.add('swiper-slide');
}

var swiperProg = new Swiper(classListaProgramas, {
  slidesPerView: 1.5,
  spaceBetween: 30,

  breakpoints: {
    600: {
      slidesPerView: 1.5,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3.5,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 3.5,
      spaceBetween: 30,
    },
    1200: {
      slidesPerView: 4.5,
      spaceBetween: 30,
    },
  },
});