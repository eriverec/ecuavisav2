setTimeout(function () {
  $('.cardsLista').addClass('swiper');
  $('.cardsLista .noticias').addClass('swiper-wrapper');
  $('.cardsLista .noticias .article').addClass('swiper-slide');

  var swiperEsti = new Swiper(".cardsLista", {
    effect: "cards",
    grabCursor: true,
  });
}, 300);

