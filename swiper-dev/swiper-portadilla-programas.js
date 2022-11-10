var time_jquery = setInterval(function() {
    if (window.jQuery) {
      if(typeof Swiper !== 'undefined'){
        init_jquery();
          clearInterval(time_jquery);
      }
    }
}, 500);

let init_jquery = function(){
    swiperProgramasGlobal();
    cardsTemasDestacados();
    changeTitleMasVisto();
}

function swiperProgramasGlobal() {
    $('.notaSwiper .noticias').addClass('swiper-wrapper');
    $('.swiper-wrapper .article').addClass('swiper-slide');

    var notaSwiper = new Swiper(".notaSwiper", {
        slidesPerView: 1,
        slidesPerColumn: 2,
        spaceBetween: 30,

        breakpoints: {
            360: {
                slidesPerView: 1.5,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3.5,
                spaceBetween: 30,
            },
            1200: {
                slidesPerView: 4.5,
                spaceBetween: 30,
            },
        },
    });
}

function cardsTemasDestacados() {
    $('.tarjeta-destacada').addClass('swiper');
    $('.tarjeta-destacada .noticias').addClass('swiper-wrapper');
    $('.tarjeta-destacada .noticias .article').addClass('swiper-slide');

    var swiperProg = new Swiper(".tarjeta-destacada", {
        effect: "cards",
        grabCursor: true,
    });
}

function changeTitleMasVisto() {
    var infor = document.querySelector('.title_informativos .tit-vid a h2');
    var entre = document.querySelector(".title_entretenimiento .tit-vid a h2");
    var deleteClass = document.querySelector('.MENU_M_VISTO .container');
    deleteClass.classList.remove('container');
    infor.textContent = 'ACTUALIDAD';
    entre.textContent = 'ENTRETENIMIENTO';

}

var device;
var b = navigator.userAgent.toLowerCase();
// Responsive functions

function desktop() {
    var dx = $('.programas-desktop .iconPlay')[0];
    var xd = $('.programas-desktop .IMG_SEC_TIT_PORTADA .text_block');
    $(dx).prependTo(xd);
    $('.programas-desktop .IMG_SEC_TIT_PORTADA .multimediaIconMacroWrapper .iconPlay').remove();
}


if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(b)) {
    console.log("tablet");
    device = "Tablet";
} else if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/i.test(b)) {
    console.log("Mobil");
    device = "Mobile";
} else {
    desktop();
    console.log("desktop");
    device = "PC";
}



// function swiperGo() {
//     setTimeout(function () {
//       if (typeof Swiper === "undefined") {
//         swiperGo();
//       } else {
//         swiperProgramasGlobal();
//         cardsTemasDestacados();
//         changeTitleMasVisto();
//       }
//     }, 400);
//   }
  
//   $(document).ready(function () {
//     swiperGo();
//   });
  //     seguimosSwiper();
  //     dameSwiper ();