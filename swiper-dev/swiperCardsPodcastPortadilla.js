setTimeout(function () {
  var classListaPodcastPor = document.querySelector('.temas_destacados_swiper');
  var classListaPodcastPorNot = document.querySelector('.temas_destacados_swiper .noticias');
  var classListaPodcastPorNotArt = document.querySelectorAll('.temas_destacados_swiper .noticias article');

  classListaPodcastPor.classList.add('swiper');
  classListaPodcastPorNot.classList.add('swiper-wrapper');

  for (const swiperSlideClas of classListaPodcastPorNotArt) {
    swiperSlideClas.classList.add('swiper-slide');
  }

  var swiperPodcastPor = new Swiper(".temas_destacados_swiper", {
    effect: "cards",
    grabCursor: true,
  });
}, 500);