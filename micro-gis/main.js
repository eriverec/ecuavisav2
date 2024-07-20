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

var swiperDos = new Swiper(".swPatentTres", {
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
      slidesPerView: 2.5,
      initialSlide: 1,
      spaceBetween: 20,
    },
  },
});

var swiperDos = new Swiper(".swPatentCuatro", {
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
      slidesPerView: 2.5,
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


function updateVideoSource() {
  var videoElement = document.getElementById('myVideo');
  var sourceElement = document.getElementById('videoSource');

  if (window.innerWidth <= 767) { // Si el ancho de la ventana es menor o igual a 768px (típico de dispositivos móviles)
    sourceElement.src = 'https://estadisticas.ecuavisa.com/sites/gis/Story%20IG.mp4';
  } 

  videoElement.load(); // Recarga el video para aplicar el nuevo src
}

// Llama a la función cuando la página se carga por primera vez
window.onload = updateVideoSource;

// Llama a la función cada vez que se redimensiona la ventana
window.onresize = updateVideoSource;


/* CARGAR LOS VIDEOS DESPUES DEL EVENTO DEL USUARIO */


// document.addEventListener('DOMContentLoaded', (event) => {
//   let hasScrolled = false;
//   let hasMovedMouse = false;
//   let iframeLoaded = false;

//   function checkToLoadIframe() {
//       if (hasScrolled && hasMovedMouse && !iframeLoaded) {
//           iframeLoaded = true;

//           const iframe = document.querySelector('.videosderudo #vrudo');
//           iframe.src = "//rudo.video/vod/bS5qxH";

//           // Remover los listeners después de cargar el iframe
//           window.removeEventListener('scroll', onScroll);
//           window.removeEventListener('mousemove', onMouseMove);
//           console.log("video rudo cargado");
//       }
//   }

//   function onScroll() {
//       hasScrolled = true;
//       checkToLoadIframe();
//   }

//   function onMouseMove() {
//       hasMovedMouse = true;
//       checkToLoadIframe();
//   }

//   window.addEventListener('scroll', onScroll);
//   window.addEventListener('mousemove', onMouseMove);
// });