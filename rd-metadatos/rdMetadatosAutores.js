setTimeout(function () {
  getNameTag();
  hideBlock();
}, 300)

function getNameTag() {
  var selec = document.querySelector('.categoryListItemLink span');
  var metaSelec = selec.textContent;
  var cintillo = document.querySelector('.cintillo-single h2');
  var dataAuthor = document.querySelector('.author_card .text_block .name_autor');
  if(dataAuthor){
    dataAuthor.append(`${metaSelec}`);
  }
  cintillo.append(`Recopilación de todo lo publicado en Ecuavisa sobre ${metaSelec}.`);
}


function hideBlock() {
  if (typeof authorSlug !== 'undefined') {
    console.log(true);
    //oculta lineas de metadatos
    document.querySelector('.categoryGroup').style.display = "none";
    document.querySelector('.c_azul_global div').style.display = "none";
    document.querySelector('.name_tema .cintillo-rd').style.display = "none";
    document.querySelector('.cintillo-single').style.display = "none";
    document.querySelector('.btn_seguimiento.meta').style.display = "none";
    //remueve clases
    var removeClassBBC = document.querySelector('.bbc');
    var removeClassSingle = document.querySelector('.single-tag');
    removeClassBBC.classList.remove('mb-4');
    removeClassSingle.classList.remove('mb-4');
    //mejora carga del paginador
    $('.ecv_relacionadas_2022').removeClass('invisible');
    $('.categoryGroup').removeClass('invisible');
    $('.c_azul_global div').removeClass('invisible');
    $('.name_tema .cintillo-rd').removeClass('invisible');
    $('.cintillo-single').removeClass('invisible');
    $('.btn_seguimiento.meta').removeClass('invisible');
    
  } else {
    console.log(false);
  }
}

// function swiperGo () {
//   setTimeout(function () {
//    if (typeof Swiper === "undefined") {
//      swiperGo();
   
//    } else {
//            episodiosSwiper();
//            $('.bloque-programas').removeClass('invisible');
//    }
//   }, 400) ; 
//   }