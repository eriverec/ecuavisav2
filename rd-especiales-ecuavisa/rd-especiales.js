
setTimeout(function () {
  var classListaEspecial = document.querySelectorAll('.cardsLista');
  var classListaEspecialNot = document.querySelectorAll('.cardsLista .noticias');
  var classListaEspecialNotArt = document.querySelectorAll('.cardsLista .noticias article');

  for (const xy of classListaEspecial) {
    xy.classList.add('swiper');
  }

  for (const xyz of classListaEspecialNot) {
    xyz.classList.add('swiper-wrapper');
  }

  for (const SlideEspeS of classListaEspecialNotArt) {
    SlideEspeS.classList.add('swiper-slide');
  }

  var swiperEspecial = new Swiper(classListaEspecial, {
    effect: "cards",
    grabCursor: true,
  });
}, 500);


