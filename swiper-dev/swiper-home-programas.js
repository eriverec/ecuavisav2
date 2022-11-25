function swiperHomeProgramas() {
  var classListaProgramas = document.querySelectorAll('.lista-bloque-programas');
  var classListaProgramasNot = document.querySelectorAll('.lista-bloque-programas .noticias');
  var classListaProgramasNotArt = document.querySelectorAll('.lista-bloque-programas .noticias article');



  for (const SlideProgS of classListaProgramas) {
    var dpagination = document.createElement("div");
    dpagination.classList = "swiper-pagination";
    SlideProgS.classList.add('swiper');
    SlideProgS.append(dpagination);
  }

  for (const SlideProgSW of classListaProgramasNot) {
    SlideProgSW.classList.add('swiper-wrapper');
  }

  for (const SlideProg of classListaProgramasNotArt) {
    SlideProg.classList.add('swiper-slide');
  }

  var swiperProg = new Swiper(".lista-bloque-programas", {
    slidesPerView: 1.5,
    spaceBetween: 20,
    pagination: {
      el: ".swiper-pagination",
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


function sGoHProgramas() {
  setTimeout(function () {
    if (typeof Swiper === "undefined") {
      sGoHProgramas();
    } else {
      swiperHomeProgramas();
    }
  }, 400);
}

$(document).ready(function () {
  sGoHProgramas();
});