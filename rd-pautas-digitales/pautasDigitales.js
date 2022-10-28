var swjs = document.createElement("script");
swjs.src = "https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js";
document.head.appendChild(swjs);
var slc = document.createElement("link");
slc.rel = "stylesheet";
slc.href = "https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css";
document.head.appendChild(slc);

// setTimeout(function () {
//   swiperPautas();
// }, 300);

function swiperPautas() {
  var classListaPauta = document.querySelector('.banner_fijos_rd');
  var classListaPautaNot = document.querySelector('.banner_fijos_rd .noticias');
  var classListaPautaNotArt = document.querySelectorAll('.banner_fijos_rd .noticias .article');

  classListaPauta.classList.add('swiper');
  classListaPautaNot.classList.add('swiper-wrapper');

  for (const SlideProg of classListaPautaNotArt) {
    SlideProg.classList.add('swiper-slide');
  }

  var swiperPautas = new Swiper(".banner_fijos_rd", {
    slidesPerView: 1,
    spaceBetween: 20,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
  });

}


function sGoDigital() {
  setTimeout(function () {
    if (typeof Swiper === "undefined") {
      sGoDigital();
    } else {
      swiperPautas();
    }
  }, 400);
}

$(document).ready(function () {
  sGoDigital();
});