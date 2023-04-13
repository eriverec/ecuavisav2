// function swiperHomeExplico() {
//   var classListaExplico = document.querySelector('.rd-texplico-la-noticia');
//   var classListaExplicoNot = document.querySelector('.rd-texplico-la-noticia .noticias');
//   var classListaExplicoNotArt = document.querySelectorAll('.rd-texplico-la-noticia .noticias article');

//   var dpagination = document.createElement("div");
//   dpagination.classList = "swiper-pagination";
//   classListaExplico.classList.add('swiper');
//   classListaExplico.append(dpagination);

//   classListaExplicoNot.classList.add('swiper-wrapper');

//   for (const SlideExplico of classListaExplicoNotArt) {
//     SlideExplico.classList.add('swiper-slide');
//   }

//   var swiperExplico = new Swiper(".rd-texplico-la-noticia", {
//     slidesPerView: 1.5,
//     spaceBetween: 20,
//     pagination: {
//       el: ".swiper-pagination",
//       dynamicBullets: true,
//       clickable: true,
//     },
//     breakpoints: {
//       600: {
//         slidesPerView: 1.5,
//         spaceBetween: 20,
//       },
//       768: {
//         slidesPerView: 3,
//         spaceBetween: 30,
//       },
//       1024: {
//         slidesPerView: 4,
//         spaceBetween: 30,
//       },
//       1200: {
//         slidesPerView: 4,
//         spaceBetween: 30,
//       },
//     },
//   });
// }


// function sGoHomeExplico() {
//   setTimeout(function () {
//     if (typeof Swiper === "undefined") {
//       sGoHomeExplico();
//     } else {
//       swiperHomeExplico();
//     }
//   }, 400);
// }

// $(document).ready(function () {
//   sGoHomeExplico();
// });