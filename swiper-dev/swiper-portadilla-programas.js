setTimeout(function () {
  $('.notaSwiper .noticias').addClass('swiper-wrapper');
  $('.swiper-wrapper .article').addClass('swiper-slide');

  var notaSwiper = new Swiper(".notaSwiper", {
      slidesPerView: 1,
      slidesPerColumn: 2,
      spaceBetween: 30,

      breakpoints: {
          360: {
              slidesPerView: 1.5,
              spaceBetween: 20,
          },
          768: {
              slidesPerView: 3,
              spaceBetween: 30,
          },
          1024: {
              slidesPerView: 3.5,
              spaceBetween: 30,
          },
          1200: {
              slidesPerView: 4.5,
              spaceBetween: 30,
          },
      },


  });

}, 500);