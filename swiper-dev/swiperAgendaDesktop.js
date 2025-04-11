function SwiperAgendaDesktop() {
  //SWIPER AGENDA DESKTOP
  const agendaDeskSwiper = document.querySelector('.agDesktopSwiper');
  const agendaDeskWraper = document.querySelector('.agDesktopSwiper .noticias');
  const agendaDeskSlider = document.querySelectorAll('.agDesktopSwiper .noticias .article');

  // var divPagDesk = document.createElement('div');
  // divPagDesk.classList.add('swiper-pagination');
  // agendaDeskSwiper.appendChild(divPagDesk);

  if (agendaDeskSwiper) {
    agendaDeskSwiper.classList.add('swiper');
    agendaDeskWraper.classList.add('swiper-wrapper');

    for (const agendaDeskSliders of agendaDeskSlider) {
      agendaDeskSliders.classList.add('swiper-slide');
    }

    var dymanicDesk = new Swiper(agendaDeskSwiper, {
      slidesPerView: 2,
      spaceBetween: 30,
      autoplay: {
        delay: 3000,
        disableOnInteraction: false,
      },
    });

  }

}

function SwiperAgendaMobile() {
  //SWIPER AGENDA MOBILE
  const agendaSwiper = document.querySelector('.agendaSwiper');
  const agendaWraper = document.querySelector('.agendaSwiper .noticias');
  const agendaSlider = document.querySelectorAll('.agendaSwiper .noticias .article');

  if (agendaSwiper) {
    var divPag = document.createElement('div');
    divPag.classList.add('swiper-pagination');
    agendaSwiper.appendChild(divPag);

    agendaSwiper.classList.add('swiper');
    agendaWraper.classList.add('swiper-wrapper');

    for (const agendaSliders of agendaSlider) {
      agendaSliders.classList.add('swiper-slide');
    }

    var dymanic = new Swiper(agendaSwiper, {
      slidesPerView: 1,
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

  }

}


function sGoMobile() {
  setTimeout(function () {
    if (typeof Swiper === "undefined") {
      sGoMobile();
    } else {
      SwiperAgendaMobile();
    }
  }, 400);
}


// setTimeout(function () {
//   SwiperAgendaDesktop();
// }, 300);



function swiperGoAgendaDesk() {
  setTimeout(function () {
    if (typeof Swiper === "undefined") {
      swiperGoAgendaDesk();
    } else {
      SwiperAgendaDesktop();
    }
  }, 400);
}

$(document).ready(function () {
  swiperGoAgendaDesk();
  sGoMobile();
});