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

  var dpagination = document.createElement("div");
  dpagination.classList = "swiper-pagination";
  tabsContent.appendChild(dpagination);

  var masvistoestilo = new Swiper(tabsContent, {
    slidesPerView: 1,
    slidesPerColumn: 2,
    spaceBetween: 30,
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

function masVistoEstiloCurio() {

  const tabsContent = document.querySelectorAll('.carrusel-programas._curio .iter-tabview-content')[1];
  const agendaDeskWraper = document.querySelector('.carrusel-programas._curio .iter-tabview-content-item');
  const agendaDeskSlider = document.querySelectorAll('.carrusel-programas._curio .iter-tabview-content-item .element');

  tabsContent.classList.add('swiper');
  agendaDeskWraper.classList.add('swiper-wrapper');

  for (const agendaDeskSliders of agendaDeskSlider) {
    agendaDeskSliders.classList.add('swiper-slide');
  }

  var dpagination = document.createElement("div");
  dpagination.classList = "swiper-pagination";
  tabsContent.appendChild(dpagination);

  var masvistoestilo = new Swiper(tabsContent, {
    slidesPerView: 1,
    slidesPerColumn: 2,
    spaceBetween: 30,
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

// ECUAVISA_EC.initDomVariable(`.carrusel-programas .iter-tabview-content-item .element`).then(() => {
//   ECUAVISA_EC.swiperInit().then(() => {
//     // noTePierdas();
//     // masVistoEstilo();
//     // masVistoEstiloCurio();
//   })
// });





// function sGoEstiloSect() {
//   setTimeout(function () {
//     if (typeof Swiper === "undefined") {
//       sGoEstiloSect();
//     } else {
//       // noTePierdas();
//       masVistoEstilo();
//       masVistoEstiloCurio();
//     }
//   }, 400);
// }

// $(document).ready(function () {
//   sGoEstiloSect();
// });




