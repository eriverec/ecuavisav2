/*
1.- swipper mySwiper
2.- swiper-wrapper
3.- swiper-slide

swiper-pagination
swiper-button-prev
swiper-button-next
swiper-scrollbar
*/
$(document).ready(function () {
  $(`.lista-bloque-estilo`).addClass("swiper");
  $(".lista-bloque-estilo .noticias").addClass("swiper-wrapper");
  $(".lista-bloque-estilo .noticias .article").addClass("swiper-slide");

  var dpagination = document.createElement("div");
  dpagination.classList = "swiper-pagination";
  $(".lista-bloque-estilo").prepend(dpagination);
  // document.querySelector(`.lista-bloque-estilo`).insertBefore(dpagination);

  var swiperEstilo = new Swiper(".lista-bloque-estilo", {
    slidesPerView: 2,
    spaceBetween: 30,
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
      clickable: true,
    },
    breakpoints: {
      600: {
        slidesPerView: 1.5,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 2,
        spaceBetween: 30,
      },
    },
  });
});
