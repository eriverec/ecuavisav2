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

function SwiperAgendaMobile() {
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



document.addEventListener("DOMContentLoaded", function() {
  var lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.srcset = lazyImage.dataset.srcset;
          lazyImage.classList.remove("lazy");
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  } else {
    // Possibly fall back to event handlers here
  }
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
    console.log("movil");
  } else if (isTablet()) {
    videoSource.src = 'https://estadisticas.ecuavisa.com/sites/gis/Header_animacion.mp4';
  } else {
    videoSource.src = 'https://estadisticas.ecuavisa.com/sites/gis/Header_animacion.mp4';
  }
  document.getElementById('myVideo').load();
}

// Call the function on page load
// window.onload = setVideoSource;

// setVideoSource();


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

