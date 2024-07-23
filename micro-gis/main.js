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

