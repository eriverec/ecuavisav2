  function swiperHomeTematica() {
    var classListaProgramas = document.querySelector('.__tematicaSemanal');
    var classListaProgramasNot = document.querySelector('.__tematicaSemanal .noticias');
    var classListaProgramasNotArt = document.querySelectorAll('.__tematicaSemanal .noticias article');

    classListaProgramas.classList.add('swiper');
    classListaProgramasNot.classList.add('swiper-wrapper');
  
    for (const SlideProg of classListaProgramasNotArt) {
      SlideProg.classList.add('swiper-slide');
    }

    var dpagination = document.createElement("div");
    dpagination.classList = "swiper-pagination";
    classListaProgramas.append(dpagination);

    var swiperProg = new Swiper(".__tematicaSemanal", {
      slidesPerView: 1.5,
      spaceBetween: 20,
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
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1200: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
      },
    });
  }


  function sGoHTematica() {
    setTimeout(function () {
      if (typeof Swiper === "undefined") {
        sGoHTematica();
      } else {
        swiperHomeTematica();
      }
    }, 400);
  }

  $(document).ready(function () {
    sGoHTematica();
  });