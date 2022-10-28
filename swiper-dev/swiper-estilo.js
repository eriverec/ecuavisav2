function swiperHomeEstilo() {
  var classListaEstilo = document.querySelectorAll('.lista-bloque-estilo');
  var classListaEstiloNot = document.querySelectorAll('.lista-bloque-estilo .noticias');
  var classListaEstiloNotArt = document.querySelectorAll('.lista-bloque-estilo .noticias article');

  for (const swiper of classListaEstilo) {
    swiper.classList.add('swiper');
  }

  for (const swiperWa of classListaEstiloNot) {
    swiperWa.classList.add('swiper-wrapper');
  }

  for (const swiperSlideClas of classListaEstiloNotArt) {
    swiperSlideClas.classList.add('swiper-slide');
  }

  var swiperEstilo = new Swiper(".lista-bloque-estilo", {
    effect: "cards",
    grabCursor: true,
  });
}

function sGoHEstilo() {
  setTimeout(function () {
    if (typeof Swiper === "undefined") {
      sGoHEstilo();
    } else {
      swiperHomeEstilo();
    }
  }, 400);
}

$(document).ready(function () {
  sGoHEstilo();
});