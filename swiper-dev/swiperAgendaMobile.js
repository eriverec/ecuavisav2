 function SwiperAgendaMobile() {
   //SWIPER AGENDA MOBILE
   const agendaSwiper = document.querySelector('.agendaSwiper');
   const agendaWraper = document.querySelector('.agendaSwiper .noticias');
   const agendaSlider = document.querySelectorAll('.agendaSwiper .noticias .article');

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


 function sGoMobile() {
   setTimeout(function () {
     if (typeof Swiper === "undefined") {
       sGoMobile();
     } else {
      SwiperAgendaMobile();
     }
   }, 400);
 }

 $(document).ready(function () {
   sGoMobile();
 });