function cardEpecialEcu(){
  $('.cardsLista').addClass('swiper');
  $('.cardsLista .noticias').addClass('swiper-wrapper');
  $('.cardsLista .noticias .article').addClass('swiper-slide');

  var swiperEsti = new Swiper(".cardsLista", {
    effect: "cards",
    grabCursor: true,
  });
}

function swiperGoEspEcua() {
  setTimeout(function () {
    if (typeof Swiper === "undefined") {
      swiperGoEspEcua();
    } else {
      cardEpecialEcu();
    }
  }, 300);
}

$(document).ready(function () {
  swiperGoEspEcua();
});

