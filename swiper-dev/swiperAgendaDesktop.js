function SwiperAgendaDesktop() {
  //SWIPER AGENDA DESKTOP
  const agendaDeskSwiper = document.querySelector('.agDesktopSwiper');
  const agendaDeskWraper = document.querySelector('.agDesktopSwiper .noticias');
  const agendaDeskSlider = document.querySelectorAll('.agDesktopSwiper .noticias .article');

  // var divPagDesk = document.createElement('div');
  // divPagDesk.classList.add('swiper-pagination');
  // agendaDeskSwiper.appendChild(divPagDesk);

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
    // pagination: {
    //   el: ".swiper-pagination",
    //   clickable: true,
    // },
  });
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
});