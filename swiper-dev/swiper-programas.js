// $(`.lista-bloque-informativos`).addClass("swiper");
// $(".lista-bloque-informativos .noticias").addClass("swiper-wrapper");
// $(".lista-bloque-informativos .noticias .article").addClass("swiper-slide");

var classListaProgramas = document.querySelectorAll('.lista-bloque-informativos');
var classListaProgramasNot = document.querySelectorAll('.lista-bloque-informativos .noticias');
var classListaProgramasNotArt = document.querySelectorAll('.lista-bloque-informativos .noticias article');

classListaProgramas.classList.add('swiper');
classListaProgramasNot.classList.add('swiper-wrapper');

for (const swiperSlideProg of classListaProgramasNotArt) {
  swiperSlideProg.classList.add('swiper-slide');
}


var swiperfuturo = new Swiper(classListaProgramas, {
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