
setTimeout(function () {

  $('.cardsLista').addClass('swiper');
  var parentNoticias = $('.cardsLista .noticias');

  if (parentNoticias){
    parentNoticias.addClass('swiper-wrapper');
    $('.cardsLista .noticias .article').addClass('swiper-slide');
    var swiperEspecial = new Swiper(".cardsLista", {
      effect: "cards",
      grabCursor: true,
    });
  }else{
    console.log('no exite la clase cardsLista -> noticias')
  }

}, 300);


