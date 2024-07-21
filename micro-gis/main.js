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




function isMobile() {
  return /Mobi|Android/i.test(navigator.userAgent);
}

function isTablet() {
  return /Tablet|iPad/i.test(navigator.userAgent);
}

function setVideoSource() {
  var videoSource = document.getElementById('videoSource');
  if (isMobile()) {
    videoSource.src = 'https://estadisticas.ecuavisa.com/sites/gis/Story%20IG.mp4';
  } else if (isTablet()) {
    videoSource.src = 'https://estadisticas.ecuavisa.com/sites/gis/Header_animacion.mp4';
  } else {
    videoSource.src = 'https://estadisticas.ecuavisa.com/sites/gis/Header_animacion.mp4';
  }
  document.getElementById('myVideo').load();
}

// Call the function on page load
window.onload = setVideoSource;



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