setTimeout(function () {
  var classListaPodcastPor = document.querySelectorAll('.temas_destacados');
  var classListaPodcastPorNot = document.querySelectorAll('.temas_destacados .noticias');
  var classListaPodcastPorNotArt = document.querySelectorAll('.temas_destacados .noticias article');

  classListaPodcastPor.classList.add('swiper');
  classListaPodcastPorNot.classList.add('swiper-wrapper');

  for (const swiperSlideClas of classListaPodcastPorNotArt) {
    swiperSlideClas.classList.add('swiper-slide');
  }

  var swiperPodcastPor = new Swiper(".temas_destacados", {
    effect: "cards",
    grabCursor: true,
  });
}, 500);