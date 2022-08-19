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
  $(`.lista-bloque-futuro`).addClass("swiper");
  $(".lista-bloque-futuro .noticias").addClass("swiper-wrapper");
  $(".lista-bloque-futuro .noticias .article").addClass("swiper-slide");

  // var dpagination = document.createElement("div");
  // dpagination.classList = "swiper-pagination";
  // $(".lista-bloque-futuro").prepend(dpagination);

  var swiperfuturo = new Swiper(".lista-bloque-futuro", {
    slidesPerView: 2.5,
    spaceBetween: 30,
    // pagination: {
    //   el: ".swiper-pagination",
    //   dynamicBullets: true,
    //   clickable: true,
    // },
    breakpoints: {
      600: {
        slidesPerView: 2.5,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 40,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });
});
