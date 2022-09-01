var classListaProgramas = document.querySelectorAll('.lista-bloque-programas');
var classListaProgramasNot = document.querySelectorAll('.lista-bloque-programas .noticias');
var classListaProgramasNotArt = document.querySelectorAll('.lista-bloque-programas .noticias article');


for (const SlideProgS of classListaProgramas) {
  SlideProgS.classList.add('swiper');
}

for (const SlideProgSW of classListaProgramasNot) {
  SlideProgSW.classList.add('swiper-wrapper');
}

for (const SlideProg of classListaProgramasNotArt) {
  SlideProg.classList.add('swiper-slide');
}

var swiperProg = new Swiper(".lista-bloque-programas", {
  slidesPerView: 2,
  spaceBetween: 30,

  breakpoints: {
    600: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: 30,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
    1200: {
      slidesPerView: 4,
      spaceBetween: 30,
    },
  },
});