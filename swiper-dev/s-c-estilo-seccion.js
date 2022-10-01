setTimeout(function () {
  // var noticiasCard = document.querySelector('.card_dest_estilo');
  // var noticiasEstilo = document.querySelector('.card_dest_estilo .noticias');
  // var articuloEstilo = document.querySelectorAll('.card_dest_estilo .noticias article');
  

  // noticiasCard.classList.add('swiper');
  // noticiasEstilo.classList.add('swiper-wrapper');

  // for (const art of articuloEstilo) {
  //   art.classList.add('swiper-slide');
  // }

  $('.card_dest_estilo').addClass('swiper');
  $('.card_dest_estilo .noticias').addClass('swiper-wrapper');
  $('.card_dest_estilo .noticias .article').addClass('swiper-slide');

  var swiperEsti = new Swiper(".card_dest_estilo", {
    effect: "cards",
    grabCursor: true,
  });
}, 500);