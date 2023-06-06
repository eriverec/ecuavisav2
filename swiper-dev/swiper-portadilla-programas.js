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
    $('.bloque-programas.notaSwiper .noticias').addClass('swiper-wrapper');
    $('.bloque-programas.notaSwiper .article').addClass('swiper-slide');
    var items = document.querySelectorAll('.bloque-programas.notaSwiper');
    for(var i in items){
        if(typeof items[i].innerHTML != 'undefined'){
            if(items[i].querySelector('div') != null){
                var idTemp = `notaSwiper${items[i].id}`;
                items[i].classList.add(idTemp);
            }
        }
    }

    for(var i in items){
        if(typeof items[i].innerHTML != 'undefined'){
            if(typeof items[i].innerHTML != 'undefined'){
                if(items[i].querySelector('div') != null){
                    var idTemp = `notaSwiper${items[i].id}`;
                    var notaSwiper = new Swiper(`.${idTemp}`, {
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
            }
        }
    }

    
}

function cardsTemasDestacados() {
    $('.tarjeta-destacada.tarjetaSwiper').addClass('swiper');
    $('.tarjeta-destacada.tarjetaSwiper .noticias').addClass('swiper-wrapper');
    $('.tarjeta-destacada.tarjetaSwiper .noticias .article').addClass('swiper-slide');

    var swiperProg = new Swiper(".tarjeta-destacada.tarjetaSwiper", {
        effect: "cards",
        grabCursor: true,
    });
}

function changeTitleMasVisto() {
    var infor = document.querySelector('.title_informativos .tit-vid a h2');
    var entre = document.querySelector(".title_entretenimiento .tit-vid a h2");
    if(document.querySelector('.MENU_M_VISTO .container')){
         var deleteClass = document.querySelector('.MENU_M_VISTO .container');
        deleteClass.classList.remove('container');
        infor.textContent = 'ACTUALIDAD';
        entre.textContent = 'ENTRETENIMIENTO';
    }
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

let init_jQuery_Swiper = function(){
  setTimeout(function () {
    if((typeof Swiper !== 'undefined')){
      init_jquery_2(".u-t-comunidad");
      init_jquery_2(".u-t-comunidad-gye");
     /* init_jquery(".u-n-1min");*/
    }
  }, 400) ;
}

let init_jquery_2 = function($contenedor){
  //u-t-comunidad
  document.querySelector( $contenedor ).innerHTML += `<div class="swiper-button-next"></div>
    <div class="swiper-button-prev"></div>
    <div class="swiper-pagination"></div>`;
    
  var noticias = document.querySelector($contenedor+" .noticias");
  noticias.style.display = 'flex';
  noticias.classList.add("swiper-wrapper");
  var slides = document.querySelectorAll(".swiper-wrapper .article");

  for (let elem of slides) {
    elem.classList.add("swiper-slide");
  }
  var swiper = new Swiper($contenedor, {
      slidesPerView: 3,
      spaceBetween: 20,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
        dynamicBullets:true
      },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      breakpoints: {
        // when window width is >= 320px
        320: {
          slidesPerView: 1.5,
          spaceBetween: 10
        },
        // when window width is >= 480px
        480: {
          slidesPerView: 2.5,
          spaceBetween: 10
        },
        // when window width is >= 640px
        640: {
          slidesPerView: 2.5,
          spaceBetween: 10
        },
      
        768:{
          slidesPerView: 1,
          spaceBetween: 10
        },

        992: {
            slidesPerView: 2,
            spaceBetween: 20
        },
        
        1280: {
            slidesPerView: 2,
            spaceBetween: 20
        }
      }
    });
}

setTimeout(function(){
    if((typeof Swiper !== 'undefined')){
      init_jquery_2(".u-t-comunidad");
      init_jquery_2(".u-t-comunidad-gye");
     /* init_jquery(".u-n-1min");*/
    }else{
      init_jQuery_Swiper();
    }
}, 1500);