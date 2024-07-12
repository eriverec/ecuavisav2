var swiper = new Swiper(".swPatent", {
  slidesPerView: 1.3,
  spaceBetween: 20,
  centeredSlides: true,
  initialSlide: 0,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
      initialSlide: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2.5,
      initialSlide: 1,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 2.5,
      initialSlide: 1,
      spaceBetween: 20,
    },

  },
});

var swiperDos = new Swiper(".swPatentDos", {
  slidesPerView: 1.3,
  spaceBetween: 20,
  initialSlide: 0,
  centeredSlides: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  breakpoints: {
    640: {
      slidesPerView: 2.5,
      initialSlide: 1,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 2.5,
      initialSlide: 1,
      spaceBetween: 20,
    },
    1024: {
      slidesPerView: 3.5,
      initialSlide: 1,
      spaceBetween: 20,
    },
  },
});

var swiperFooter = new Swiper(".revistaSwiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});