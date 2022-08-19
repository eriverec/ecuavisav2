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
  $(".lista-programacion-bloque").addClass("swiper");
  $(".lista-programacion-bloque .noticias").addClass("swiper-wrapper");
  $(".lista-programacion-bloque .noticias .article").addClass("swiper-slide");

  var dpagination = document.createElement("div");
  dpagination.classList = "swiper-scrollbar";
  $(".lista-programacion-bloque").append(dpagination);

  var swiperProgramacionWeb = new Swiper(".lista-programacion-bloque", {
    slidesPerView: 1.5,
    spaceBetween: 10,
    scrollbar: {
      el: ".swiper-scrollbar",
      hide: true,
    },
    breakpoints: {
      600: {
        slidesPerView: 1.5,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 2.5,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 3.5,
        spaceBetween: 10,
      },
    },
  });
});
