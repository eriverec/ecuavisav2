
function getNameTag() {
  var selec = document.querySelector('.categoryListItemLink span');
  var metaSelec = selec.textContent;
  var cintillo = document.querySelector('.cintillo-single h2');
  var dataAuthor = document.querySelector('.author_card .text_block .name_autor');
  if (dataAuthor) {
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
    //mejora carga del paginador y bloques ocultos por js
    // $('.ecv_relacionadas_2022').removeClass('invisible');
    $('.invisible2').removeClass('invisible2');

    if (window.location.pathname === "/metadatos/-/meta/bbc-news-mundo") {
      // Espera a que el DOM esté completamente cargado

      // Selecciona el div que deseas ocultar. Usa el selector adecuado (clase, id, etc.)
      var divnamecargo = document.querySelector('.author_card .author_box .text_block .name_cargo'); // o por id: document.getElementById('id-del-divnamecargo')

      if (divnamecargo) {
        divnamecargo.style.display = "none";
      }

    }

  } else {
    console.log(false);

  }
}

function removeDuplicateInfo() {
  setTimeout(function () {
    if (typeof Swiper === "undefined") {
      removeDuplicateInfo();
    } else {
      var duplicateTag = $('.author_card.d-md-flex')[1];
      if (duplicateTag) {
        duplicateTag.remove();
      }
    }
  }, 400);
}

if (ECUAVISA_EC) {
  ECUAVISA_EC.initDomVariable('.categoryListBlock .categoryList article').then((e) => {
    if (e) {
      // Selecciona el contenedor de los artículos
      const categoryList = document.querySelector('.categoryListBlock .categoryList');

      // Si el contenedor existe
      if (categoryList) {
        // Obtén todos los artículos dentro del contenedor
        const articles = categoryList.querySelectorAll('article');

        // Si hay más de un artículo, elimina todos excepto el primero
        for (let i = 1; i < articles.length; i++) {
          categoryList.removeChild(articles[i]);
        }
      }

      //Iniciar componentes:

      setTimeout(function () {
        getNameTag();
        hideBlock();
        //remueve la clase en página de metadatos
        $('.invisible2').removeClass('invisible2');
        // remueve bloque duplicadas en autores como bbc etc 

      }, 300)

      removeDuplicateInfo();
    }
  })
}