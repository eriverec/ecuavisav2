//No te pierdas
function noTePierdas() {
  $('.note-pierdas').addClass('swiper');
  $('.note-pierdas .noticias').addClass('swiper-wrapper');
  $('.note-pierdas .noticias .article').addClass('swiper-slide');

  var dpagination = document.createElement("div");
  dpagination.classList = "swiper-pagination";
  document.querySelector(".note-pierdas").appendChild(dpagination);

  var notepierdas = new Swiper(".note-pierdas", {
    slidesPerView: 1,
    slidesPerColumn: 2,
    spaceBetween: 10,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints: {
      360: {
        slidesPerView: 1.5,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
    },

  });
}

function masVistoEstilo() {

  const tabsContent = document.querySelectorAll('.carrusel-programas .iter-tabview-content')[1];
  const agendaDeskWraper = document.querySelector('.carrusel-programas .iter-tabview-content-item');
  const agendaDeskSlider = document.querySelectorAll('.carrusel-programas .iter-tabview-content-item .element');

  tabsContent.classList.add('swiper');
  agendaDeskWraper.classList.add('swiper-wrapper');

  for (const agendaDeskSliders of agendaDeskSlider) {
    agendaDeskSliders.classList.add('swiper-slide');
  }

  var masvistoestilo = new Swiper(tabsContent, {
    slidesPerView: 1,
    slidesPerColumn: 2,
    spaceBetween: 10,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
    breakpoints: {
      360: {
        slidesPerView: 1.5,
        spaceBetween: 10,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 10,
      },
    },

  });

 
}



function sGoEstiloSect() {
  setTimeout(function () {
    if (typeof Swiper === "undefined") {
      sGoEstiloSect();
    } else {
      noTePierdas();
      masVistoEstilo();
    }
  }, 400);
}

$(document).ready(function () {
  sGoEstiloSect();
});