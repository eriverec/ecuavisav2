function cardEpecialEcu(){
  // $('.cardsLista').addClass('swiper');
  // $('.cardsLista .noticias').addClass('swiper-wrapper');
  // $('.cardsLista .noticias .article').addClass('swiper-slide');

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

  var swiperEspecial = new Swiper(".cardsLista", {
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
  }, 400);
}

$(document).ready(function () {
  swiperGoEspEcua();
});

