function cardEpecialEcu(){
  // $('.cardsLista').addClass('swiper');
  // $('.cardsLista .noticias').addClass('swiper-wrapper');
  // $('.cardsLista .noticias .article').addClass('swiper-slide');

  var classListaEspecial = document.querySelector('.cardsLista');
  var classListaEspecialNot = document.querySelector('.cardsLista .noticias');
  var classListaEspecialNotArt = document.querySelectorAll('.cardsLista .noticias article');

  classListaEspecial.classList.add('swiper');
  classListaEspecialNot.classList.add('swiper-wrapper');

  for (const SlideEspeS of classListaEspecialNotArt) {
    SlideEspeS.classList.add('swiper-slide');
  }

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

