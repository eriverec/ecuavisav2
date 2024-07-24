function SwiperPatent() {
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
  const carv = document.querySelector('.cargandoVideos');
  const swBlo = document.querySelector('.carrusel-bloque');


  if (carv) {
    carv.style.display = "none";
  }

  if (swBlo) {
    swBlo.classList.remove('d-none');
  }
}


function SwiperDos() {
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

}

function SwiperTres() {
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

}

function SwiperCuatro() {
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

}

function sGoMobile() {
  setTimeout(function () {
    if (typeof Swiper === "undefined") {
      sGoMobile();
    } else {
      SwiperPatent();
      SwiperDos();
      SwiperTres();
      SwiperCuatro();
    }
  }, 400);
}

$(document).ready(function () {
  sGoMobile();
});



document.addEventListener("DOMContentLoaded", function () {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to event handlers here
  }
});


document.addEventListener("DOMContentLoaded", function () {
  var lazyVideos = [].slice.call(document.querySelectorAll("video.lazy"));

  if ("IntersectionObserver" in window) {
    var lazyVideoObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (video) {
        if (video.isIntersecting) {
          for (var source in video.target.children) {
            var videoSource = video.target.children[source];
            if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE") {
              videoSource.src = videoSource.dataset.src;
            }
          }

          video.target.load();
          video.target.classList.remove("lazy");
          lazyVideoObserver.unobserve(video.target);
        }
      });
    });

    lazyVideos.forEach(function (lazyVideo) {
      lazyVideoObserver.observe(lazyVideo);
    });
  }
});


const links = document.querySelectorAll('.menu_global a[href*="#"]');
let currentActiveLink = null;

for (const link of links) {
  link.addEventListener('click', function (event) {
    const target = document.querySelector(this.hash);
    if (target) {
      event.preventDefault();
      const top = target.offsetTop - 50; // Ajusta la posición superior (resta 50px)
      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });

      if (currentActiveLink) {
        currentActiveLink.classList.remove('active');
      }
      currentActiveLink = this;
      this.classList.add('active');
    }
  });
}






// document.addEventListener('DOMContentLoaded', function() {
//   // Verifica si la pantalla tiene un ancho menor a 768px (considerado como móvil)
//   if (window.innerWidth < 768) {
//       var video = document.getElementById('headerVideo');
//       var source = document.getElementById('videoSource');
//       // Cambia el src del video
//       source.src = 'https://estadisticas.ecuavisa.com/sites/gis/Header%20Vertical.mp4';
//       // Recarga el video para que el cambio surta efecto
//       video.load();
//   }else{
//     var video = document.getElementById('headerVideo');
//       var source = document.getElementById('videoSource');
//       // Cambia el src del video
//       source.src = 'https://estadisticas.ecuavisa.com/sites/gis/Header_animacion.mp4';
//       // Recarga el video para que el cambio surta efecto
//       video.load();
//   }
// });



