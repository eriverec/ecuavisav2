/*******************************************************************
  @VARIABLES GLOBALES ECUAVISA_EC: REVISAR ARCHIVO main_ecuavisa.js
  revision 8 de septiembre 2023 noche 1

  ECUAVISA_EC.api.seguimientoTema = https://ecuavisa-seguimiento-tema.onrender.com/
*******************************************************************/
// **************************************************************** //
//SCRIPT DE VALIDATION EN MILISEGUNDOS

// const urlObjetos = [
//     { urlactual: "https://www.google.com", milliseconds: 1000 },
//     { urlactual: "https://www.github.com", milliseconds: 2000 },
//     { urlactual: "https://www.ecuavisa.com/noticias/seguridad/la-policia-enfrenta-a-la-delincuencia-con-un-deficit-de-21-de-uniformados-LK4941386", milliseconds: 3000 },
//     { urlactual: "https://www.ecuavisa.com/envivo", milliseconds: 4000 }
// ];
// console.log(urlObjetos);

//recorremos el objetos para coincidir con la url
// fetch("https://estadisticas.ecuavisa.com/sites/services/global/getMirrorUrl.php")


/******HACEMOS ÉNFASIS DE QUE SE NECESITA ./main_ecuavisa.js 
 * para que global no tenga errores*******/
if(!ECUAVISA_EC){
  console.log("Este archivo necesita ./main_ecuavisa.js para su correcto funcionamiento");
}
/******HACEMOS ÉNFASIS DE QUE SE NECESITA ./main_ecuavisa.js 
* para que global no tenga errores*******/

if(new URLSearchParams(window.location.search).get('dispositivoecuavisa2023')){
  if(new URLSearchParams(window.location.search).get('dispositivoecuavisa2023')=="ios"){
      window.location = "https://apps.apple.com/ec/app/whatsapp-messenger/id310633997";
  }
}

//crear el script el envivo manager
const envivoManager = document.createElement('script');
envivoManager.src = 'https://ecuavisav2.pages.dev/envivoManager/emanager.js';
// document.body.appendChild(envivoManager);

const exClassEnvivo = document.querySelector(".liveIndicator.pard__envivo a");
const exClassAudio = document.querySelector("#parent_radio a");

if(exClassEnvivo || exClassAudio){
  exClassEnvivo.href = "/envivo";
  exClassAudio.href = "/audio-envivo";
}

fetch("https://estadisticas.ecuavisa.com/sites/services/global/datareader.php")
  .then((response) => response.json())
  .then((data) => {
  // console.log(data)
  // Iterar a través de los objetos JSON utilizando el método forEach
      data.forEach(objeto => {
          // condiciones de cada item del objeto
          if (objeto.urlactual === window.location.href) {// Si se encuentra la URL buscada
          console.log("La URL actual coincide con la URL del objeto: ", "URL:", objeto.urlactual, "Milisegundos:", objeto.milliseconds);
          setTimeout(() => {
              //obtenermos el iduser del localsotage
              const userIdX = localStorage.getItem('wylexUserId') || 0;
              if (userIdX == 0) {
              console.warn("Lo siento no estas registrado");
              } else {
              console.info("Si estas registrado")
              }
          }, objeto.milliseconds);
          }
          //si encuentra un registro de configuración
          if (objeto.configuracionModuloSugerencias === true)
          {
              console.log("mostrando Sugerencias");
              if (typeof bloqueUsuarioSugerencia === "undefined") {
                  //reloginProtect();
              } else {
                      bloqueUsuarioSugerencia.init(); // iniciamos bloque sugerencias
              }
              
          }
          if (objeto.configuracionModuloSugerenciasModal === true)
          {
              console.log("mostrando Sugerencias en modal");
              if (typeof bloqueUsuarioSugerencia === "undefined") {
                  //reloginProtect();
              } else {
                      modalUsuarioSugerencia.init(); // iniciamos modal sugerencias
              }
          }
      });
  })
  .catch((error) => console.log(error));

// FIN SCRIPT DE VALIDATION EN MILISEGUNDOS
// ***************************************** //


//MOSTRAR EN EL MENU EL NOMBRE DEL USUARIO LOGUEADO
function nombresUsuarioHeader(){
  const getUserGlobal = ECUAVISA_EC.USER_data();
  const isMobile = window.matchMedia("only screen and (max-width: 767px)").matches;
  const isTablet = window.matchMedia("only screen and (min-width: 768px) and (max-width: 991px)").matches;
  const isDesktop = window.matchMedia("only screen and (min-width: 992px)").matches;
  const getNombre = getUserGlobal.name;
  const getApellido = getUserGlobal.lastname;
  
  const selectLogo = document.querySelector('.loginIcon span');
  if (selectLogo) {
      if (isMobile || isTablet) {
          selectLogo.textContent = getNombre ? `Hola ${getNombre}` : "";
      } else {
          selectLogo.textContent = getNombre ? `Hola ${getNombre}` : "";
          document.querySelector(".ly-header .header-logo").style.marginLeft = "auto";
      }
  }
}
nombresUsuarioHeader();

// if(getUserGlobal.name){
//   document.querySelector('.loginIcon span').textContent = `${getNombre} ${getApellido}`;
// }else{
//   document.querySelector('.loginIcon span').textContent = "Regístrate";
// }


/*VARIABLES GLOBALES*/
var URL_login_G = ECUAVISA_EC.URL_login();
var URL_principal_G = ECUAVISA_EC.URL_principal();
var URL_perfil_G = ECUAVISA_EC.URL_perfil();
var MODAL_ESTADO_LOGIN = ECUAVISA_EC.ESTADO_modal();

const divportada_g = document.createElement('div');
divportada_g.classList.add('itemFijo');

function eventBuscarPortdada (){
  //div contenedor
  const divContenedor = document.createElement('div');
  divContenedor.classList.add('parentContenedor');
  divContenedor.style.display = "none";
  document.querySelector('.portadaNav').appendChild(divContenedor);
  
  //div buscar
  const divBuscar = document.createElement('div');
  divBuscar.classList.add('itemBuscar');
  document.querySelector('.itemsNavs').appendChild(divBuscar);
  document.querySelector(".itemBuscar").innerHTML = `<button title="Buscador de contenido Ecuavisa" class="botonBuscarMenu"><svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M10 2.5a7.5 7.5 0 0 1 5.964 12.048l4.743 4.745a1 1 0 0 1-1.32 1.497l-.094-.083-4.745-4.743A7.5 7.5 0 1 1 10 2.5Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="#212121" /></svg></button>`;
  
  //mover el buscador al nuevo bloque
  const divAMover = document.querySelector('.tabnavBuscador');
  const divDestinoParent = document.querySelector('.parentContenedor'); 
  divDestinoParent.appendChild(divAMover);
  
  //crear un nuevo boton cerrar 
  const divCerrar = document.createElement('button');
  divCerrar.classList.add('botonCerrarMenu');
  document.querySelector('.parentContenedor .lst-item.tabnavBuscador').appendChild(divCerrar);
  document.querySelector(".botonCerrarMenu").innerHTML = `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" id="mdi-close" viewBox="0 0 24 24"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>`;
  
  //crear el evento del boton oara ocultar y mostrar un div
  const botonBuscar = document.querySelector('.botonBuscarMenu');
  const botonCerrar = document.querySelector('.botonCerrarMenu');
  const bloqueBreaking = document.querySelector('.itemsNavs');
  
  botonBuscar.addEventListener('click', () => {
      divDestinoParent.style.display = 'block';
      bloqueBreaking.style.display = 'none';
  });
  
  botonCerrar.addEventListener('click', () => {
      divDestinoParent.style.display = 'none';
      bloqueBreaking.style.display = 'inline-flex';
  });
}

// var b=navigator.userAgent.toLowerCase();
const dispTablet = /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(navigator.userAgent);
const dispMobile = /(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/i.test(navigator.userAgent);

// if (dispTablet) {
//     // console.log("tablet");
//     setTimeout(() => {eventBuscarPortdada();}, 1000);
// } else if (dispMobile) {
//     // console.log("Mobil");
//     setTimeout(() => {eventBuscarPortdada();}, 1000);
// } else {
//     // console.log("desktop");
// }


// divportada.innerText = "PORTADA";
if(document.querySelector('.itemsNavs')!=null){
  document.querySelector('.itemsNavs').appendChild(divportada_g);
  document.querySelector(".itemFijo").innerHTML = `<a href="/">PORTADA</a>`;
}

// const swiperNav = () => {
//     var classListaitemsNavs = document.querySelector('.itemsNavs');
//     var classListaitemsNavsNot = document.querySelector('.itemsNavs .noticias');
//     var classListaitemsNavsNotArt = document.querySelectorAll('.itemsNavs .noticias article');

//     classListaitemsNavs.classList.add('swiper');
//     classListaitemsNavsNot.classList.add('swiper-wrapper');

//     // var dpaginationNavs = document.createElement("div");
//     // dpaginationNavs.classList = "swiper-scrollbar";
//     // classListaitemsNavs.append(dpaginationNavs);


//     for (const SlideProg of classListaitemsNavsNotArt) {
//     SlideProg.classList.add('swiper-slide');
//     }

//     var swiperNavs = new Swiper(".itemsNavs", {
//     slidesPerView: 1.5,
//     spaceBetween: 20,
//     // scrollbar: {
//     //     el: ".swiper-scrollbar",
//     //     hide: true,
//     // },
//     breakpoints: {
//         600: {
//         slidesPerView: 1.5, spaceBetween: 20,
//         },
//         768: {
//         slidesPerView: 3, spaceBetween: 20,
//         },
//         1024: { slidesPerView: 5, spaceBetween: 20,
//         },
//         1200: { slidesPerView: 6, spaceBetween: 20,
//         },
//         },
//     });
// }

// swiperNav();
// ########## End Swiper Global ########
var entra_una = true;
var pathname_ec = window.location.pathname;

// ########## RankSwiper Global ########

//########## Header rediseño ##########    
localStorage.setItem('fixheader', '') // vaciamos en cada refresh
var fixHeader = localStorage.getItem('fixheader');

// function ajusteIcon1() {
//     // const userIcon = document.querySelector('.userIcon');
//     // document.querySelector(".pw-btn").innerHTML = '';
//     // document.querySelector(".pw-btn").appendChild(userIcon);

//     // const userIcon = document.querySelector('.userIcon');
//     // document.querySelector(".pw-btn").appendChild(document.createTextNode(' '));
//     // document.querySelector(".pw-btn").appendChild(userIcon);

//     localStorage.setItem('fixheader', 'yes')
//     // $('.container-logo-movil').parent('div').addClass('newbg container');
// }
//######## Fin  Header rediseño ########  

//document.addEventListener("DOMContentLoaded", function (event) {/*code */});// document ready  vanilla js

$(document).ready(function () {/*code */ });// document ready Jquery
// document ready Protecmedia
// jQryIter(document).bind("widgetCompleteLoad", function (e, widgetElement) {
//   runJquery2();
// });
//######## Fin  Ejecucion de Scripts ########  


function buildHeader() {
  const portadaNav = document.querySelector('.portadaNav');
  const envivoBar = document.querySelector('.enVivoRedy');
  const userIcon = document.querySelector('.userIcon');
  const newHeader = document.querySelector('.ly-header');
  // newHeader.appendChild(portadaNav);
  newHeader.insertBefore(portadaNav, newHeader.firstChild);
  newHeader.insertBefore(envivoBar, newHeader.firstChild);
  document.querySelector(".desktop").classList.add("d-none");

  document.querySelector(".pw-btn").innerHTML = '';
  document.querySelector(".pw-btn")[1].appendChild(userIcon);
}

function initMenuSticky(){
  $('.ly-header-redy .container .container-logo-movil').clone().addClass('new-menu-sticky ocultar-ecuavisa').appendTo('.ly-header-redy');
  $('.new-menu-sticky > *').wrapAll("<div class='container-cr newbg px-md-0 container'></div>");

  $('.new-menu-sticky .menu-movil-click').click(function(){
      jQuery(".container-menu").toggleClass("nav-expanded");
  });

  const optionMenu_sticky = document.querySelector(".new-menu-sticky .select-menu");
  if(optionMenu_sticky){
      const selectBtn_sticky =  optionMenu_sticky.querySelector(".select-btn");
      const options_sticky = optionMenu_sticky.querySelectorAll(".option");
      const sBtn_text_sticky = optionMenu_sticky.querySelector(".sBtn-text");

      selectBtn_sticky.addEventListener("click", () =>
         optionMenu_sticky.classList.toggle("active")
      );
  
     options_sticky.forEach((option) => {
         option.addEventListener("click", () => {
              let selectedOption = option.querySelector(".option-text").innerText;
              sBtn_text_sticky.innerText = selectedOption;
              optionMenu_sticky.classList.remove("active");
         });
     })
  }


  $(document).scroll(function() {
      var y = $(this).scrollTop();
      if (y > 450) {
          $('.new-menu-sticky').removeClass('ocultar-ecuavisa');
          //$('.ly-header .movil .container-menu').css('top', ( y - 160)+'px');
          $('.ly-header .movil .container-menu').addClass('classScrollingMenu');
          // $('.hm-r02.container-menu.nav-expanded').css('margin-top','0px');
      } else {
          $('.new-menu-sticky').addClass('ocultar-ecuavisa');
          $('.ly-header .movil .container-menu').removeClass('classScrollingMenu');
          // $('.hm-r02.container-menu.nav-expanded').css('margin-top','50px');
      }
  });

  botonesPerfil();
}

//DICE LUIS QUE ESTO SALVA VIDAS
function runJquery2() {
  $('.container-logo-movil').parent('div').addClass('newbg px-md-0 container');
  $('.portadaNav').parent('.container').addClass('px-0');

  // agregamos accion al icono login
  var loginUrl = $('.pw-btn').attr('href');
  $('.loginIcon').attr('href', loginUrl);
  //MEJORAR LA CARGA DEL HEADER DEL PODEROSO REDY
  $('.invisible').removeClass('invisible');  

  
}

// ECUAVISA_EC.jqueryInit().then(result => {
//     runJquery2();
//     console.log('construimos header');
// }).catch(error => {
//     console.log(error);
//     // Aquí puedes manejar el error en caso de que jQuery no se haya cargado
// });

var runJquery = setInterval(function () {
  if (window.jQuery) {
      runJquery2();
      console.log('construimos header');
      // clear interval
      clearInterval(runJquery);
      // loginGo();
  }
}, 300);

if (window.jQuery) {
  runJquery2();
  // console.log('fixing header'); // indicador de hader arreglado
  // clear interval
  clearInterval(runJquery);

}
setTimeout(function () {
  runJquery2();
}, 2060);


// elecciones 
// var eleccionesHeader = `<div class=" mb-3 redybanner eleccionesEnvivoBanner" style="display:none"><a href="https://www.ecuavisa.com/envivo"> <img class="pud_desktop" width="100%" alt="post-desktop" src="https://estadisticas.ecuavisa.com/sites/gestor/elecciones/1920x200-en-vivo.jpg"> <img class="pud_mobile" width="100%" alt="post-mobile" src="https://estadisticas.ecuavisa.com/sites/gestor/elecciones/400x100-banner.jpg"> </a> </div>`; 
// $(eleccionesHeader).insertBefore('.notas-1-p-ap');



//elecciones fin




// ménú desktop
menuContent = $('.nav-dropdown.nav.noSubNav').html(); //tomamos el menú mobile actual
// console.log(menuContent);

const navDesktop = document.createElement('div'); //creamos el elemento para menu desktop
navDesktop.classList.add('navDesktop'); //agregamos la clase desktop
navDesktop.innerHTML = menuContent;
$(navDesktop).insertAfter('.newbg'); //ubicamos el menú debajo del header

//Submenú desktop al hacer hover en los items
$(".navDesktop .parent-nav li .sectionName").hover( function() {
  //var elTexto = $(this).text(); console.log(elTexto); //solo validabamos si obtenia el texto

  function createSM (){//función que crea el tag que tendrá los submenú
      let submenuContainer = document.createElement('ul'); 
      submenuContainer.id = 'submenuDesktop';
      submenuContainer.classList.add('parent-nav', 'lst', 'cf');
      $('.navDesktop').append(submenuContainer);   
  }
  
  
  var submenuDesktp = document.querySelector(`#submenuDesktop`);
  submenuDesktp ? console.log('') : createSM (); //##################################

  var elementos = $(this).parents('.tab-grp').find('.lst-items').html();// obtenemos itemos de submenu
  //console.log(elementos);
  elementos ? $('#submenuDesktop').html(elementos) : $('#submenuDesktop').remove(); //metemos los items al contenedor ########################
  

  // setTimeout(function () {
  //     $('#submenuDesktop').remove();
  // }, 3500);
  
});

/*INICIO - Header sticky*/
/*jQuery(".container-menu").toggleClass("nav-expanded")
$('.new-menu-sticky').height()*/


// $(document).ready(function () {
  // runJquery2()

  //funcion de la ampliada
  /*var laFuente = $('.cutline .byline-image');
  $('.cutline').prepend(laFuente);

  var cleanCut = $(".cutline").html();
  if (cleanCut) {
      var cleanCut2 = cleanCut.replace("(", "");
      var cleanedCut = cleanCut2.replace(")", "");
      $('.cutline').html(cleanedCut);
  } else {
      console.log('no es una ampliada')
  }*/


  //  setTimeout(function(){ runqatarswiper1(); }, 600);
// });

// $(".cutline").text($(".cutline").text().replace("()", ""));


// var chck_if_sfe_loco_scroll_loaded = setInterval( function() {
//     if(window.jQuery){
//         clearInterval(chck_if_sfe_loco_scroll_loaded);
//         //tu codigo
//      }
// }, 500);



// ################################################################
// ######################### ZONA PRIVADA #########################
// ################################################################


//cerrar sesion action
/*logoutBtn = document.querySelector('.botonCerrarSesion');
logoutBtn.addEventListener("click", function () {
  localStorage.clear();
  window.location.href = URL_login_G;
  // window.location('');
});*/

var clearSesion = function(){
  var botonCerrarSesion = document.querySelectorAll('.botonCerrarSesion');
  botonCerrarSesion.forEach(function(el){
    //el.setAttribute('disabled', true);
      el.style.opacity = 0.5;
      el.style.pointerEvents = "none";
  });
  var myHeaders = new Headers();
  var requestOptions = {
      method: 'POST',
      headers: myHeaders
  };
  fetch(window.origin+"/restapi/user/logout", requestOptions).then(response => {
      return response.json();
  }).then(jsondata => {
      localStorage.clear();
      window.location.href = URL_login_G;
  });
}

var login_new = {
  idmodal:`modal_default_${Math.floor(Math.random() * 100)}`,
  name_modal:`modal_default_name`,
  name_class_modal:`modal_default_class`,
  getURL: window.location.href.split('?')[0],
  showAndHide:function( show="" ){
      var ins = this;
      ins.posicion();
      var content_login = document.querySelector(`.${ins.name_class_modal}`);
      var solo_body = document.querySelector(`body`);
      var content_login_body = document.querySelector(`.${ins.name_class_modal} .modal-perfil-new `);

      /*
      if(!content_login_body.classList.contains( 'active-animation' )){
          
      }else{
          
      }*/
      
      if(show == ""){
          if(!content_login.classList.contains( 'd-none-ec' )){
              content_login_body.classList.add("active-animation");//disabled-scrool
              solo_body.classList.remove("disabled-scroll");
              setTimeout(function(){
                  content_login.classList.add("d-none-ec");
              }, 1000);
          }else{
              /*PARA QUE APAREZCA*/
              solo_body.classList.add("disabled-scroll");
              content_login.classList.remove("d-none-ec");
              setTimeout(function(){
                  content_login_body.classList.remove("active-animation");
              }, 200);
          }
      }

      if(show == "show"){
          solo_body.classList.add("disabled-scroll");
          content_login.classList.remove("d-none-ec");
          setTimeout(function(){
              content_login_body.classList.remove("active-animation");
          }, 200);
      }

      if(show == "hide"){
          solo_body.classList.remove("disabled-scroll");
          content_login_body.classList.add("active-animation");//disabled-scrool
          setTimeout(function(){
              content_login.classList.add("d-none-ec");
          }, 200);
      }
  },
  posicion:function(){
      var ins = this;
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      var alturaNormal = document.querySelector('.row.mx-0.h-r01');
      var valorAlturaNormal = alturaNormal.offsetHeight;

      if(document.querySelector(".new-menu-sticky")){ 
          var selectMenus = document.querySelector(".new-menu-sticky");
          if(!selectMenus.classList.contains( 'ocultar-ecuavisa' )){
              valorAlturaNormal = selectMenus.offsetHeight;
          }
      }
      
      document.querySelector('#estilos_cr_modal').innerHTML =  ins.css(valorAlturaNormal);

      if(scrollTop > 80 && scrollTop < 450){
          //ins.showAndHide("hide");
          //document.querySelector(`.${ins.name_class_modal}`).style = "margin-top:-1000vh";
      }else{
          //document.querySelector(`.${ins.name_class_modal}`).style = "";
      }

      //if(window.innerHeight < 726){
      document.querySelector('#estilos_cr_modal').innerHTML =  ins.css(valorAlturaNormal, (window.innerHeight - valorAlturaNormal));
      //}
      
      return true;
  },
  initComponent:function(){
      var ins = this;
      /*var selectMenus = document.querySelectorAll(".select-btn");
      selectMenus.forEach((selectMenu) => {
          selectMenu.addEventListener("click", () => {
              var padre = selectMenu.closest('.row.mx-0.h-r01');
              var alturaPadre = 0;
              if (padre) {
                  alturaPadre = padre.offsetHeight;
              }else{
                  padre = selectMenu.closest('.new-menu-sticky');
                  alturaPadre = padre.offsetHeight;
              }
          });
          console.log(alturaPadre)
          document.querySelector('#estilos_cr_modal').innerHTML =  ins.css(alturaPadre);
      });*/
      var fondo_perfils = document.querySelectorAll(".posicion_atras_modal");
      fondo_perfils.forEach((fondo_perfil) => {
          fondo_perfil.addEventListener("click", () => {
              ins.showAndHide();
              //document.querySelector(`.${ins.name_class_modal}`).classList.add("d-none-ec");
          });
      });
      var btn_imagen = document.querySelectorAll(".img-perfil-new");
      btn_imagen.forEach((btnimage) => {
          btnimage.addEventListener("click", () => {
              ins.showAndHide();
              //document.querySelector(`.${ins.name_class_modal}`).classList.add("d-none-ec");
          });
      });
      var btn_cerrar_new_menu = document.querySelectorAll(".btn_cerrar_new_menu");
      btn_cerrar_new_menu.forEach((btnimage) => {
          btnimage.addEventListener("click", () => {
              ins.showAndHide();
              //document.querySelector(`.${ins.name_class_modal}`).classList.add("d-none-ec");
          });
      });

      ins.posicion();
      var entra = false;
      var lastScrollPosition = 0;
      window.addEventListener('scroll', () => {
          var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
          var scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollPosition > lastScrollPosition) {
              // El scroll fue hacia abajo
              if(scrollTop > 80 && scrollTop < 450){
                  if(!entra){
                      ins.showAndHide("hide");
                      entra = true;
                      console.log("Entra entre 80 y 450 abajo")
                  }
                  //document.querySelector(`.${ins.name_class_modal}`).style = "margin-top:-1000vh";
              }
          } else if (scrollPosition < lastScrollPosition) {
              // El scroll fue hacia arriba
              if(scrollTop > 80 && scrollTop < 450){
                  if(entra){
                      ins.showAndHide("hide");
                      entra = false;
                      console.log("Entra entre 80 y 450 arriba")
                  }
                  //document.querySelector(`.${ins.name_class_modal}`).style = "margin-top:-1000vh";
              }
          }

          lastScrollPosition = scrollPosition;
          
      });

      // Obtener todos los elementos con la clase "mi-elemento"
      const elementos = document.querySelectorAll('.navDesktop .parent-nav li .sectionName');

      // Iterar sobre cada elemento y agregar eventos hover
      elementos.forEach(elemento => {
        elemento.addEventListener('mouseenter', () => {
          //ins.showAndHide();
        });

        elemento.addEventListener('mouseleave', () => {
          // Acción al salir del hover en el elemento
          elemento.style.backgroundColor = '';
        });
      });
      
  },
  modalPerfil:function (){
      var user = ECUAVISA_EC.USER_data();
      var avatar = user.avatar || "https://estadisticas.ecuavisa.com/sites/gestor/Recursos/user-perfil.png";
      return `<div class="contenido-perfil-new">
        <div class="btn_cerrar_new_menu">x</div>
        <div class="col-perfil-new">
          <div class="row-perfil-new">
            <div class="img-perfil-new">
              <img src="${avatar}" class="img-user-perfil-new">
            </div>
          </div>
          <div class="row-perfil-new">
            <div class="user-perfil-new">
              <div class="name-perfil-new">
                <h3 class="title-perfil-new">${(user.name).length < 6 ? "Hola, "+user.name : user.name }</h3>
                <p class="description-perfil-new p-0 m-0">¡Bienvenido(a) a tu perfil!</p>
              </div>
            </div>
          </div>
          <div class="row-perfil-new">
            <div class="btn-perfil-new">
              <div class="btn-perfil-new">
                <a href="${ ECUAVISA_EC.URL.miEcuavisa || "#" }" class="btn-perfil-link">
                  Mi Ecuavisa
                  <img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos/icon-right-celeste.png" class="icon_rght_perfil">
                </a>
                <a href="${ ECUAVISA_EC.URL.miPerfil || "#" }" class="btn-perfil-link">
                  Mi Cuenta
                  <img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos/icon-right-celeste.png" class="icon_rght_perfil">
                </a>
              </div>
              <div class="space-line perfil-new"></div>
              <div class="btn-perfil-new">
                <button onclick="ECUAVISA_EC.logout(this)" class="btn btn-default btn-perfil-new-link btn-cerrar-perfil-new">
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  },
  modalHTML:function(){
      var ins = this;
      var idEC = ins.idmodal;
      return `<div class="posicion_atras_modal"></div> <div id="estilos_cr_modal">${ins.css()}</div> <div name-modal="${ins.name_modal}" class="modal-perfil-new" id="${idEC}" tabindex="-1" aria-labelledby="${idEC}Label" aria-hidden="true">
                 <div class="modal-dialog">
                    <div class="modal-content">
                      <div class="modal-body">
                         ${ins.modalPerfil()}
                      </div>
                    </div>
                 </div>
              </div>`;
  },
  css:function(alturaModal, alturaModalContent = ""){
      var ins = this;
      return `<style>.${ins.name_class_modal}{z-index:999;position:fixed;width:100%;left:0;top:0px;height:100vh;overflow:hidden}.posicion_atras_modal{top:0px;background:rgba(0,0,0,.75);position:fixed;width:100%;height:100%;z-index:999}.modal-perfil-new{position:absolute;right:0;top:0px;transition:1s all;transform:translate(0%,0px);z-index:1000}.${ins.name_class_modal} .modal-header{background:#23DCD1;padding:1rem 1.5rem 1rem 1.5rem;align-items:initial;text-align:left;border:0px}.${ins.name_class_modal} .modal-content{border-radius:0PX;border:none;background:#060127}.${ins.name_class_modal} .modal-body{padding:1.5rem 1rem 0 1rem;text-align:left;overflow:auto;height:auto}.${ins.name_class_modal} .modal-body label{font-family:Archivo,sans-serif;font-style:normal;font-weight:700;font-size:20.4685px;line-height:33px}.${ins.name_class_modal} .btn{line-height:1!important}.${ins.name_class_modal} .btn-primary:hover{color:#2927b9;background-color:transparent!important;border-color:transparent!important}.${ins.name_class_modal} .modal-footer button:not(.btn-send-cr):after{content:url('https://estadisticas.ecuavisa.com/sites/gestor/Banner/Vector-login.svg');width:100%}.${ins.name_class_modal} .btn-close{background:url('https://estadisticas.ecuavisa.com/sites/gestor/Banner/close-fill.svg') center/1em auto no-repeat!important;border:0;background-size:32px!important;opacity:1!important}.${ins.name_class_modal} .btn-check:focus+.btn-primary,.${ins.name_class_modal} .btn-primary:focus{box-shadow:0 0 0 .25rem rgb(49 132 253/0%)}.${ins.name_class_modal} .btn-close:focus{box-shadow:0 0 0 .25rem rgb(13 110 253/0%)}.${ins.name_class_modal} .modal-dialog{margin-top:0;margin-right:0;max-width:355px;min-width:355px}@media only screen and (min-width:900px) and (max-width:1050px){.${ins.name_class_modal} .modal-body{${alturaModalContent != ""?`height:${alturaModalContent + alturaModal * 1}px;`:""}}}.${ins.name_class_modal} .modal-title{font-style:normal;font-weight:700;font-size:22px;font-size:23.027px;line-height:28px;color:#2927B9;font-family:Archivo,sans-serif}.${ins.name_class_modal} .modal-footer{border-top:1px solid transparent!important;padding:1rem 0 .75rem 0!important}.${ins.name_class_modal} .btn-cancelar,.${ins.name_class_modal} .modal-footer .btn-send-cr{display:flex;flex-direction:column;font-family:Mattone 150;font-style:normal;font-size:14px;text-transform:uppercase;padding:10px 17px;color:#2927b9;font-weight:700}.${ins.name_class_modal} .btn-cancelar{background-color:transparent!important;border-color:transparent!important;font-weight:700;color:#2927b9}.${ins.name_class_modal} .btn-send-cr{background-color:#23DCD1;border:1px solid #23DCD1;align-items:center;flex-direction:row!important;height:38px;margin-bottom:8px;padding:10px 25px!important}.${ins.name_class_modal} .btn-send-cr:hover{border:1px solid #23DCD1!important}.${ins.name_class_modal} .modal{z-index:9999!important;}.${ins.name_class_modal} .modal-body .row label{font-size:15px;margin-bottom:0}</style>`;
  },
  body:function(){
      var ins = this;
      var classModal = `MODAL_${ins.name_modal}`;
      ins.name_class_modal = classModal;
      if(!document.querySelector(`.${ins.name_class_modal}`)){
          var addDivModal = document.createElement("div");
          addDivModal.classList = ins.name_class_modal;
          addDivModal.innerHTML = ins.modalHTML();
          document.querySelector('body').appendChild(addDivModal);
          return true;
      }
      return false;
  },
  init:function(name_modal = "modal_default"){
      if(ECUAVISA_EC.USER_data("id") == null){
          console.log("Usuario inválido, no logueado")
          return false;
      }
      var ins = this;
      ins.idmodal = `${name_modal}_${Math.floor(Math.random() * 100)}`;
      ins.name_modal = `${name_modal}`;
      ins.body();
      ins.initComponent();
      document.querySelector(`.${ins.name_class_modal}`).classList.add("d-none-ec");
  }
}

var inicio_nuevo_login = false;

var botonesPerfil = function(){
  var boxes2 = document.querySelectorAll('.ly-header-redy .select-menu:not(.ly-header-redy .select-menu .options)');
  boxes2.forEach( function(box) {
      box.addEventListener('click', function handleClick(event) {
          if(localStorage.getItem('wylexFirstName')){
              //this.querySelector('.options .option a').setAttribute('href', URL_perfil_G);
              //this.querySelector('.options .option a').classList.remove("botonCerrarSesion");
              /*this.querySelector('.options').innerHTML = `
                <!---->
                <li class="option">
                  <a href="${URL_perfil_G}"> <img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos/header_user-negro.svg" alt="icon"> <span class="option-text">Mi perfil</span> </a>
                </li>
                <li class="option">
                  <a href="#" class="botonCerrarSesion" onclick="clearSesion()"> <img src="https://estadisticas.ecuavisa.com/sites/default/files/2022-10/cerrar-sesion.png" alt="icon"> <span class="option-text">Cerrar sesión</span> </a>
                </li>
              `;*/
              if(!inicio_nuevo_login){
                  login_new.init();
                  inicio_nuevo_login = true;
                  setTimeout(function(){
                      login_new.showAndHide("show");
                  }, 500);
              }else{
                  login_new.showAndHide("show");
              }
          }else{
              //this.querySelector('.options .option a').classList.add("botonCerrarSesion");
              this.querySelector('.options').innerHTML = /*html*/`
                <li class="option">
                  <a href="#" class="botonCerrarSesion" onclick="clearSesion()"> 
                      <img src="https://estadisticas.ecuavisa.com/sites/default/files/2022-10/cerrar-sesion.png" alt="icon"> 
                      <span class="option-text">Iniciar sesión</span> 
                  </a>
                </li>
                <!-- EL BOTON SOY NUEVO -->
                <!--<li class="option">
                  <a href="https://www.ecuavisa.com/servicios/registro" class=""> 
                      <img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2Fsurvey-line%20(1).png" alt="icon"> 
                      <span class="option-text">Soy nuevo</span> 
                  </a>
                </li>-->
                
                `;
          }
          
      });
  });
}

$('.author_box .btn_seguimiento .btn_siguiendo').addClass('dnone'); // ocultar boton siguiendo (tags - autores)
$('.btn_seguimiento.meta .btn_siguiendo').addClass('dnone');
$('.author-data .btn_seguimiento .btn_siguiendo').addClass('dnone'); //lista de autores
$('.botones__ .button_siguiendo').addClass('dnone');


var NameUser = localStorage.getItem('wylexFirstName'); //variable de nombre
var fullName = localStorage.getItem('wylexFirstName')+' '+localStorage.getItem('wylexLastName'); //variable de nombre
var UserId = localStorage.getItem('wylexUserId'); //variable de id de usuario



function zonaPrivadaRules(){ // cosas que pasan, en la zona privada
  var UserId = localStorage.getItem('wylexUserId') || 0; // reasignamos la variable de id de usuario
  
  //suscripciones
  // $('.temas-hot .botones__').each( function(){ // recorremos cada tema (tag) de esta nota
  // });
  // obtención de temas del usuario

  if(UserId == 0){
      console.log('Usuario no registrado');
      // autores
      $('.author_box .btn_seguimiento .btn_siguiendo').on('click', function(){ // boton siguiendo 
          //$('.author_box .btn_seguimiento .btn_seguir').removeClass("dnone");
          //$(this).addClass("dnone");
          //const autorpath = document.URL.split("/").pop(); //obtenemos el ultimo path del url
          //console.log("dejaste de seguir a "+autorpath); // ej "abdon-rodriguez"
          if(ModalIniciarSesionEC()){ //SI EL USUARIO ESTÁ LOGUEADO ENTRA, CASO CONTRARIO MUESTRA EL MODAL
              window.location.href = URL_login_G;
          }
      });

      $('.author_box .btn_seguimiento .btn_seguir').on('click', function(){ // boton seguir 
          //$('.author_box .btn_seguimiento .btn_siguiendo').removeClass("dnone");
          //$(this).addClass("dnone");
          //const autorpath = document.URL.split("/").pop(); //obtenemos el ultimo path del url
          //console.log("siguiendo a "+autorpath); // ej "abdon-rodriguez"
          
          if(ModalIniciarSesionEC()){ //SI EL USUARIO ESTÁ LOGUEADO ENTRA, CASO CONTRARIO MUESTRA EL MODAL
              window.location.href = URL_login_G;
          }
      });

      return false;
  }
  var myHeaders2 = new Headers();
  var raw = JSON.stringify({
      "id": UserId
  });
  var requestOptions = {
      method: 'GET',
      headers: myHeaders2,
      body: raw
  };
  fetch(ECUAVISA_EC.api.seguimientoTema+UserId)
  //fetch("https://estadisticas.ecuavisa.com/sites/gestor/zonaPrivada/temasget.php", requestOptions)
  .then(response =>  response.json()
    //   response.json()).then( data => {
    //       for(var i in data.usuario.Temas){
    //         const d = data.usuario.Temas[i];
    //           // $temas += perfil.notificaciones.html_(d);
    //           console.log(d);
    //       }
    //     }
  ).then( (result) => {
          // console.log(result); // imprimimmos los temas como resulado
          if(result.resp){
              var data = result.data;
              if(!Array.isArray(data)){
                  localStorage.setItem('resultTemas',JSON.stringify(data));
                  if($('.container').hasClass("MP_suscripciones")){
                      /*Se ejecuta solocuando estoy dentro de mi perfil*/
                      seccionTemas(JSON.stringify(data));
                  }else{
                      var url = document.URL;
                      modelosTemasBtn(JSON.stringify(data), url);
                      modelosAmpliadas(JSON.stringify(data), url);
                      modelosAutores(JSON.stringify(data), url);
                  }
              }
          }else{
              console.log("Error seguimiento de tema: ", resp.message);
          }
      }).catch(error => console.log('ha ocurrido un error', error));
      /*Hace que se muestren los temas más rápido por medio de localstorage*/
      /*if($('.container').hasClass("MP_suscripciones")){
      if(localStorage.getItem('resultTemas')!= null){
          seccionTemas(localStorage.getItem('resultTemas'));
      }
      }*/
  
}

function existeTema(data, nombre){
  var jsonD = JSON.parse(data);
  if(jsonD.message == null){
      var temas = jsonD['usuario']['Temas'];
      for(var i in temas){
          var tema = temas[i];
          if(nombre.toUpperCase() == (tema.name).toUpperCase() && tema.follow == true){
              return true;
          }
      }
  }
  return false;
}

function modelosAmpliadas(data, url){
  $('.metas .item_tema a').each( function(){ // recorremos cada tema (tag) de esta nota
      /*
      .button_seguir: +
      .button_siguiendo: -
      */
      tema = $(this).text();
      if(existeTema(data, tema)){
          $(this).addClass('button_siguiendo');
      }else{
          $(this).addClass('button_seguir');
      }
  });
}

function pathnameFunction(url){
  var urlLocal = url;
  var urlLocalText = urlLocal.split('/')[(urlLocal.split('/')).length - 1];
  return urlLocalText;
}

function modelosTemasBtn(data, url){
  var jsonD = JSON.parse(data);
  if(jsonD.message == null){
      var temas = jsonD['usuario']['Temas'];
      for(var i in temas){
          var tema = temas[i];
          if(url.includes(tema.feedUrl) && tema.follow == true){
              $('.btn_seguimiento').find('.btn_seguir').addClass('dnone');
              $('.btn_seguimiento').find('.btn_siguiendo').removeClass('dnone');
          }
      }
  }
}

function seccionTemas(data){
  var temasJson = {
      html:function(dat, i){
          return `<article class="categoryListItem" data-categoryid="${dat.id}" data-categoryname="${dat.name}"> 
                      <span class="categoryListItemPosition">${i}</span> 
                      <a class="categoryListItemLink" href="${dat.feedUrl}">
                          <div class="metaTitle"> Tema</div> ${dat.name}
                      </a>
                      <div class="botones__">
                          <div class="button_siguiendo">
                              <a class="follow" href="javascript:void(0);">
                                  <span>Siguiendo</span>
                                  <img width="12px" height='9px' src="https://ecuavisadev.netlify.app/rd-podcast/assets/Vector26.svg" alt="check" title="Siguiendo">
                              </a>
                          </div>
                          <div class="button_seguir dnone">
                              <a class="follow" href="javascript:void(0);">
                                  <span>Seguir</span>
                                  <img width="13px" height='13px' src="https://ecuavisadev.netlify.app/rd-mi-perfil/assets/Add.svg" alt="check" title="Seguir">
                              </a>
                          </div>
                      </div>
                  </article>`;
      },
      init:function(dat){
          temasJson.listar(dat);
      },
      listar:function(dat){
          $('.MP_suscripciones .categoryList article.categoryListItem').remove();
          var temas = dat['usuario']['Temas'];
          for(var i in temas){
              var tema = temas[i];
              if(tema.follow){
                  $('.MP_suscripciones .categoryList').append(temasJson.html(tema, i));
              }
          }
      },
      existe:function(dat){
          var temas = dat['usuario']['Temas'];
          for(var i in temas){
              var tema = temas[i];
              if(tema.follow){
                  return true;
              }
          }
          return false;
      },
      suscriptionDymanic:function() {
          $(".categoryListItemLink").prepend('<div class="metaTitle"> Tema</div>');
          $(".categoryListItem").append(`
          <div class="botones__">
              <div class="button_siguiendo dnone">
                  <a class="follow" href="javascript:void(0);">
                      <span>Siguiendo</span>
                      <img src="https://ecuavisadev.netlify.app/rd-podcast/assets/Vector26.svg" alt="check">
                  </a>
              </div>
              <div class="button_seguir">
                  <a class="follow" href="javascript:void(0);">
                      <span>Seguir</span>
                      <img src="https://ecuavisadev.netlify.app/rd-mi-perfil/assets/Add.svg" alt="check">
                  </a>
              </div>
          </div>`);
      }
  }

  var jsonD = JSON.parse(data);
  temasJson.suscriptionDymanic();
  $('.author_box .btn_seguimiento .btn_siguiendo').addClass('dnone'); // ocultar boton siguiendo (tags - autores)
  $('.btn_seguimiento.meta .btn_siguiendo').addClass('dnone');
  $('.author-data .btn_seguimiento .btn_siguiendo').addClass('dnone'); //lista de autores
  $('.botones__ .button_siguiendo').addClass('dnone');
  $('.MP_suscripciones .categoryTitle').css('display', '');
  if(jsonD.message == null){
      if(temasJson.existe(jsonD)){
          $('.MP_suscripciones .categoryTitle').css('display', 'none');
          temasJson.init(jsonD);
      }
  }
  // setTimeout(() => {
  //     document.dispatchEvent(EndeventTemas);
  // }, 1700);
}

var dataAutoresG = [];
var urlAutoresG = '';
//########### TEMAS Y SUSCRIPCIONES  ############
function suscripcionTema(datosTema, btn, btn_old, tipoBtn='0'){
  var UserId = localStorage.getItem('wylexUserId'); // reasignamos la variable de id de usuario
  var interesId = 0;
  if(document.querySelector("article.categoryListItem.categoryPageItem")){
      if(document.querySelectorAll("article.categoryListItem.categoryPageItem").length < 2){
          interesId = document.querySelector("article.categoryListItem.categoryPageItem").getAttribute("data-categoryid");
      }
  }
  if (!UserId){
      /*Si no existe sesión, el evento click de botones de seguir y seguimiento 
      lo va a redireccionar al login */
      window.location = URL_login_G;
      return false;
  }

  var settings = {
      "url": ECUAVISA_EC.api.seguimientoTema,
      "method": "POST",
      "timeout": 0,
      "headers": {
          "Content-Type": "application/json"
      },
      "data": JSON.stringify({
          "id": UserId,
          "nombre": fullName,
          "tema": datosTema
      }),
  };

  var resp = fetch("https://sugerencias-ecuavisa.vercel.app/interes/add", {
   method: "POST",
   headers: {
     "Content-Type": "application/json",
   },
   body: JSON.stringify({
     "userId": UserId,
     "interesId": interesId,
     "description": "-",
     "title": datosTema.name,
     "estado": (datosTema.follow?1:0),
     "meta_existe": true,
   }),
  }).then( (response) => response.json())
  .then( (result) => {
   // meta_favorite_action(id);
   // bloqueUsuarioIntereses.init();
   return true;
  }).catch((error) => {
   console.log("error", error);
  });

  $.ajax(settings).done(function (response) {
      btn.html(btn_old);
      btn.addClass("dnone").removeClass('loading');
      setTimeout(function(){
          if(tipoBtn == '0'){
              btn.parent('.botones__').find('.button_siguiendo').removeClass('dnone');
              btn.parent('.btn_seguimiento').find('.btn_siguiendo').removeClass('dnone');
          }
          else{
              btn.parent('.botones__').find('.button_seguir').removeClass('dnone');
              btn.parent('.btn_seguimiento').find('.btn_seguir').removeClass('dnone');
          }
          localStorage.setItem('resultTemas',JSON.stringify(response));
          dataAutoresG = JSON.stringify(response);
      }, 700);
  });
}

/*
  Eventos de botones temas, 
  aquí se asegura que jquery está cargado
*/

var globalBandera = 0;

$('.temas-hot').on('click', 'div.button_seguir', function(){
  var $btn = $(this);
  var $btn_old = $(this).html();
  var linkTema = $(this).parents('article').find("a.categoryListItemLink");
  var atrib = $(linkTema).prop('href');
  const temaPath = atrib.split("/").pop();
  const temaName = $(this).parents('article').attr('data-categoryname');
  var temaData = 
      {
          "name": temaName,
          "feedUrl": atrib,
          "follow": true
      };
  if(ModalIniciarSesionEC()){ //SI EL USUARIO ESTÁ LOGUEADO ENTRA, CASO CONTRARIO MUESTRA EL MODAL
      $btn.addClass("loading");
      $btn.find("a").html('<span>Espere...</span>');
      if(globalBandera == 0){
          globalBandera = 1;
          suscripcionTema(temaData, $btn, $btn_old);
      }
      
  }
  
});

  $('.temas-hot').on('click', 'div.button_siguiendo', function(){ // boton siguiendo    
      var $btn = $(this);   
      var $btn_old = $(this).html(); 
      var linkTema = $(this).parents('article').find("a.categoryListItemLink");
      var atrib = $(linkTema).prop('href');
      const temaName = $(this).parents('article').attr('data-categoryname');
      const temaPath2 = atrib.split("/").pop(); //obtenemos el ultimo path del url

      if(ModalIniciarSesionEC()){ //SI EL USUARIO ESTÁ LOGUEADO ENTRA, CASO CONTRARIO MUESTRA EL MODAL
          $btn.addClass("loading");
          $btn.find("a").html('<span>Espere...</span>');
          var temaData = {
              "name": temaName,
              "feedUrl": atrib,
              "follow": false
          };
          if(globalBandera == 0){
              globalBandera = 1;
              suscripcionTema(temaData, $btn, $btn_old, '1');
          }
      }
      
      //console.log(`Dejaste de seguir a: ${JSON.stringify(temaData)}`);
  });

  /*SEGUIR Y DEJAR DE SEGUIR DENTRO DE METADATOS*/
  $('.btnseguimiento_meta, .btn_seguimiento').on('click', 'div.btn_seguir', function(){
      var $btn = $(this);
      var $btn_old = $(this).html();
      var linkTema = $('article.categoryPageItem').find("a.categoryListItemLink").attr('href');
      var atrib = linkTema;
      const temaPath = atrib.split("/").pop();
      const temaName = $('article.categoryPageItem').attr('data-categoryname');
      var temaData = {
          "name": temaName,
          "feedUrl": atrib,
          "follow": true
      };

      if(ModalIniciarSesionEC()){ //SI EL USUARIO ESTÁ LOGUEADO ENTRA, CASO CONTRARIO MUESTRA EL MODAL
          $btn.addClass("loading");
          $btn.html('<span>Espere...</span>');
          suscripcionTema(temaData, $btn, $btn_old);
          var fTema = temaData['follow'];
      }
      
  });

  $('.btnseguimiento_meta, .btn_seguimiento').on('click', 'div.btn_siguiendo', function(){
      var $btn = $(this);   
      var $btn_old = $(this).html();      
      var linkTema = $('article.categoryPageItem').find("a.categoryListItemLink").attr('href');
      const temaName = $('article.categoryPageItem').attr('data-categoryname');
      var atrib = linkTema;
      const temaPath2 = atrib.split("/").pop(); 

      var temaData = {
          "name": temaName,
          "feedUrl": atrib,
          "follow": false
      };

      if(ModalIniciarSesionEC()){ //SI EL USUARIO ESTÁ LOGUEADO ENTRA, CASO CONTRARIO MUESTRA EL MODAL
          $btn.addClass("loading");
          $btn.html('<span>Espere...</span>');
          suscripcionTema(temaData, $btn, $btn_old, '1');
      }
      

      //console.log(`Dejaste de seguir a: ${JSON.stringify(temaData)}`);
  });
//########### FIN SUSCRIPCIONES ############
// hide following btn lista de autores
$('.author-data .btn_seguimiento .btn_siguiendo').addClass('dnone');

// ################################################################
// ###################### ZONA PRIVADA - AUTORES ##################
// ################################################################

function existeAutor(data, nombre){
  var jsonD = JSON.parse(data);
  if(jsonD.message == null){
      var temas = jsonD['usuario']['Temas'];
      for(var i in temas){
          var tema = temas[i];
          if(nombre.toUpperCase() == (tema.name).toUpperCase() && tema.follow == true){
              return true;
          }
      }
  }
  return false;
}

function recorrerAutores(){
  $('.author-data .carrusel-list article').each( function(){
      /*
      .button_seguir: +
      .button_siguiendo: -
      */
      var nombre = $(this).find(".block_text >  a .priority-content").html();
      if(existeAutor(dataAutoresG, nombre)){
          $(this).find('.btn_siguiendo').removeClass('dnone');
          $(this).find('.btn_seguir').addClass('dnone');
      }else{
          $(this).find('.btn_siguiendo').addClass('dnone');
          $(this).find('.btn_seguir').removeClass('dnone');
      }
  });
}

function modelosAutores(data, url){
  dataAutoresG = data;
  urlAutoresG = url;
  recorrerAutores();

  $('.author-data').on('click', 'article div.btn_seguir', function(){
      var $btn = $(this);
      var $btn_old = $(this).html();
      var linkTema = $(this).parents('.BloqueInfo').find(".block_text >  a").attr('href');
      var atrib = linkTema;
      const temaPath = atrib.split("/").pop();
      const temaName = $(this).parents('.BloqueInfo').find(".block_text >  a .priority-content").html();
      var temaData = {
          "name": temaName,
          "feedUrl": atrib,
          "follow": true
      };
      if(ModalIniciarSesionEC()){ //SI EL USUARIO ESTÁ LOGUEADO ENTRA, CASO CONTRARIO MUESTRA EL MODAL
          $btn.addClass("loading");
          $btn.html('<span>Espere...</span>');
          suscripcionTema(temaData, $btn, $btn_old);
      }
      
  });

  $('.author-data').on('click', 'article div.btn_siguiendo', function(){
      var $btn = $(this);
      var $btn_old = $(this).html();
      var linkTema = $(this).parents('.BloqueInfo').find(".block_text >  a").attr('href');
      var atrib = linkTema;
      const temaPath = atrib.split("/").pop();
      const temaName = $(this).parents('.BloqueInfo').find(".block_text >  a .priority-content").html();
      var temaData = {
          "name": temaName,
          "feedUrl": atrib,
          "follow": false
      };

      if(ModalIniciarSesionEC()){ //SI EL USUARIO ESTÁ LOGUEADO ENTRA, CASO CONTRARIO MUESTRA EL MODAL
          $btn.addClass("loading");
          $btn.html('<span>Espere...</span>');
          suscripcionTema(temaData, $btn, $btn_old, '1');
          console.log(`Dejaste de seguir a: ${JSON.stringify(temaData)}`);
      }
      
  });

  $('body').on('DOMNodeInserted', 'div.author-data', function(e) {
      recorrerAutores();
      //recorrerAutores(); $(e.target).attr('id') === 'yith-wapo-container'
  });
}

/*BOTÓN DE REDIRECCIÓN*/
  function redireccionAlLogin(url_2=""){
      //CAPTURAMOS LA URL ACTUAL
      var urlNext = ECUAVISA_EC.myUrl() || window.location.href;
      var urlParamsGET = new URLSearchParams(window.location.search);
      var urlRedirectNextpage = urlParamsGET.get('nextpage') || null;

      //BUSCAMOS NEXTOAGE, SI LO ENCONTRAMOS VERIFICAMOS SI NO ES LA URL DEL LOGIN
      if(urlRedirectNextpage){
      if(urlNext.includes("https://www.ecuavisa.com/servicios/login") || urlNext.includes("https://www.ecuavisa.com/servicios/registro")){
        //SI ES LA URL DEL LOGIN NO SE DEBE CAMBIAR A LOGIN, SI NO DEJAR COMO ESTABA ANTERIORMENTE
        urlNext = "?nextpage=" + encodeURIComponent(urlRedirectNextpage);
      }
      }else{
          if(urlNext.includes("https://www.ecuavisa.com/servicios/login") || urlNext.includes("https://www.ecuavisa.com/servicios/registro")){
            //SI ES LA URL DEL LOGIN NO SE DEBE CAMBIAR A LOGIN, SI NO DEJAR COMO ESTABA ANTERIORMENTE
            urlNext = "";
          }else{
            urlNext = "?nextpage=" + encodeURIComponent(urlNext);
          }
      }
      window.location = URL_login_G + urlNext + (url_2==""?"":`&${url_2}`);
  }

  /*EVENTO CLICK PARA EL MENU STICKY*/
  ECUAVISA_EC.initDomVariable(".new-menu-sticky .loginIcon", 10).then((existe_2) => {
      if(existe_2){
          const loginIcons = document.querySelectorAll('.loginIcon');
          loginIcons.forEach(function(icon) {
              icon.addEventListener('click', function() {
                  if (!ECUAVISA_EC.login()) {
                    redireccionAlLogin();
                  }
              });
          });
      }
  })
  /*EVENTO CLICK PARA EL MENU STICKY*/

  /*EVENTO CLICK PARA EL MENU NORMAL*/
  ECUAVISA_EC.initDomVariable(".loginIcon", 10).then((existe) => {
      if(existe){
          const loginIcons = document.querySelectorAll('.loginIcon');
          loginIcons.forEach(function(icon) {
              icon.addEventListener('click', function() {
                  if (!ECUAVISA_EC.login()) {
                      redireccionAlLogin();
                  }
              });
          });
      }
  })
  /*EVENTO CLICK PARA EL MENU NORMAL*/

/*BOTÓN DE REDIRECCIÓN*/

/*FUNCIÓN PARA INICIAR SESION, SE NECESITA TL TK(TOKEN) Y LA URL DE REDIRECCIÓN*/
  if(new URLSearchParams(window.location.search).get('tk')){
      ECUAVISA_EC.initUserToken( new URLSearchParams(window.location.search).get('tk') , (ECUAVISA_EC.myUrl() || window.location.href)).then(urlGenerada => {
        localStorage.setItem('urlTk', urlGenerada.url);
        nombresUsuarioHeader();
      }).catch(error => {
        // Se produjo un error durante la ejecución de la función
        console.log('Ocurrió un error en initUserToken:', error);
        // Realiza acciones de manejo de errores aquí
      })
  }
/*FUNCIÓN PARA INICIAR SESION*/

//loginGo()
/*VALIDAR EXISTENCIA DEL SWIPER*/
function loginIconEvent() {
  ECUAVISA_EC.swiperInit(15).then(result => {
      // Aquí puedes continuar con el código después de que swiper se haya cargado
      NameUser = localStorage.getItem('wylexFirstName');
      //ZONA PRIVADA LOGIN BUTON FUNCTIONS
      // if ((NameUser== "") || (NameUser == null) ){ // si el nombre esta vacío no muestra el cerrar sesión
      if (NameUser == null ){ // si el nombre esta vacío no muestra el cerrar sesión
      // $(".botonCerrarSesion").addClass('d-none');
          console.log('nombre no existe');
          // $(".botonCerrarSesion").parents(".options").removeClass('dnone');
          //zonaPrivadaRules();
          $(".botonCerrarSesion").parents(".options").addClass('dnone');
          //loginGo(); // mandamos redireccion al icono de usuario para realizar un login
      }else{ //quitamos opcion de cerrar sesión
          $(".botonCerrarSesion").parents(".options").removeClass('dnone');
          console.log('nombre existe');
          
      }
  }).catch(error => {
      console.log(error);
      // Aquí puedes manejar el error en caso de que jQuery no se haya cargado
  });
}
loginIconEvent()

/*VALIDAR EXISTENCIA DEL SWIPER*/

/*MODAL INICIAR SESIÓN*/
function logoutModalLogin(idEC){
  if (!localStorage.getItem('wylexUserId')){
      var getIdModal = localStorage.getItem('modalID') || idEC;
      var modalHtmlEC = `<div class="modal fade" id="${idEC}" tabindex="-1" aria-labelledby="${idEC}Label" aria-hidden="true">
                         <div class="modal-dialog">
                            <div class="modal-content">
                               <div class="modal-header">
                                  <h5 class="modal-title" id="${idEC}Label">Para realizar esta acción debes iniciar sesión</h5>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> 
                               </div>
                                  <div class="modal-body">
                                     <label for="">¿Desea iniciar sesión?</label>
                                  </div>
                                  <div class="modal-footer">
                                      <div class="botonesaccionlogout">
                                          <button type="button" class="btn btn-primary font-weight-bold btn-cancelar" data-dismiss="modal" onclick="ModalIniciarSesionEC('hide', '${idEC}')">Cancelar</button>
                                          <a href="${URL_login_G}" id="aceptarEC" class="btn btn-primary">Ir</a> 
                                      </div>
                                  </div>
                            </div>
                         </div>
                      </div>`;

      var styleEC = `<style>
                     #${idEC} .modal-header {
                          background: #fff;
                          padding: 1.5rem 1.5rem 0 1.5rem;
                          align-items: initial;
                          text-align: center;
                          border: 0px;
                     }

                     #${idEC} .modal-content {
                        border: none;
                     }

                     #${idEC} .modal-body {
                          padding: 1.5rem 1.5rem 0 1.5rem;
                          text-align: center;
                     }

                     #${idEC} .modal-body label {
                        font-family: 'Archivo', sans-serif;
                        font-style: normal;
                        font-weight: 700;
                        font-size: 20.4685px;
                        line-height: 33px;
                     }

                     #${idEC} .btn {
                        line-height: 1 !important;
                     }

                     #${idEC} .btn-primary:hover {
                        color: #2927b9;
                        background-color: transparent !important;
                        border-color: transparent !important;
                     }

                     #${idEC} .modal-footer button:not(#aceptarEC):after {
                        content: url('https://estadisticas.ecuavisa.com/sites/gestor/Banner/Vector-login.svg');
                        width: 100%;
                     }

                     #${idEC} .btn-close {
                        background: url('https://estadisticas.ecuavisa.com/sites/gestor/Banner/close-fill.svg') center/1em auto no-repeat !important;
                        border: 0;
                        background-size: 32px!important;
                        opacity: 1 !important;
                     }

                     #${idEC} .btn-check:focus+.btn-primary,
                     #${idEC} .btn-primary:focus {
                        box-shadow: 0 0 0 0.25rem rgb(49 132 253 / 0%);
                     }

                     #${idEC} .btn-close:focus {
                        box-shadow: 0 0 0 0.25rem rgb(13 110 253 / 0%);
                     }

                     #${idEC} .modal-dialog {
                        max-width: 425px;
                     }

                     #${idEC} .modal-title {
                        font-style: normal;
                        font-weight: 700;
                        font-size: 22px;
                        font-size: 23.027px;
                        line-height: 28px;
                        color: #2927B9;
                        font-family: 'Archivo', sans-serif;
                     }

                     #${idEC} .modal-footer {
                        border-top: 1px solid transparent !important;
                        padding: 1rem 0 0.75rem 0 !important;
                     }

                     #${idEC} .btn-cancelar,
                     #${idEC} .modal-footer #aceptarEC {
                        display: flex;
                        flex-direction: column;
                        font-family: 'Mattone 150';
                        font-style: normal;
                        font-size: 14px;
                        text-transform: uppercase;
                        padding: 10px 17px;
                        color: #2927b9;
                        font-weight: 700;
                     }

                     #${idEC} .btn-cancelar{
                        background-color: transparent !important;
                        border-color: transparent !important;
                        font-weight: 700;
                        color: #2927b9;
                     }

                     #${idEC} #aceptarEC {
                          background-color: #23DCD1;
                          border: 1px solid #23DCD1;
                          align-items: center;
                          flex-direction: row!important;
                          height: 38px;
                          margin-bottom: 8px;
                          padding: 10px 25px!important;
                      }

                      #${idEC} #aceptarEC:hover {
                          border: 1px solid #23DCD1!important;
                      }

                     .botonesaccionlogout {
                          width: 100%;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                      }
                  </style>`;
      
      if(!document.querySelector('#'+getIdModal)){
          if(window.jQuery){
              $('body').append(styleEC+modalHtmlEC);
              localStorage.setItem('modalID', idEC);
          }
      }
      return false;
  }
  return true;
}

function ModalIniciarSesionEC(estado= 'show', id= 0){
  if(localStorage.getItem('wylexFirstName')){
    return true;
  }

  if(ECUAVISA_EC.ESTADO_modal()){
      /*Crea un id único al modal, antes de crearlo, el modal se crea solo si el usuario no existe,
      si la variable ECUAVISA_EC.ESTADO_modal() = true*/
      var idEC = 'modalLogin_'+Math.floor(Math.random() * 100);
      logoutModalLogin(idEC);
      var getIdModal = localStorage.getItem('modalID') || id;
      if (!localStorage.getItem('wylexUserId')){
          if(window.jQuery){

              /*Si el boostrapp js no existe se lo crea, sirve para el modal*/
              var bootstrap_enabled = (typeof $().modal == 'function');
              if(!bootstrap_enabled){
                  var scriptBoostrap = document.createElement("script");
                  scriptBoostrap.setAttribute( 'src', `https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js` );
                  document.body.appendChild(scriptBoostrap);
              }
              
              if( (estado != 'show') || (estado == 'show' && $('#'+getIdModal).hasClass('show') == false) ){
                  var existemodal = setInterval(function () {
                      if ((typeof $().modal == 'function')) {
                          $(`#${getIdModal}`).modal(estado);
                          clearInterval(existemodal);
                      }
                  }, 500);
                  
              }
          }
          return false;
      }
      return true;
  }else{
      window.location.href = URL_login_G;
      return false;
  }
}

function newInputSt () {
  //Mover el input search a sticky
   const divBase = document.querySelector('.basic-search-rd-sticky');
   const divDestinoSticky = document.querySelector('.new-menu-sticky .content-menu-ec');
   if(divDestinoSticky || divBase){
       divDestinoSticky.appendChild(divBase);
       divBase.style.display = "block";
   }
   
   //visible el icon sear en el menu sticky
   const BotonSearchIcon_2 = document.querySelector('.new-menu-sticky .content-menu-ec .search-icon');
   BotonSearchIcon_2 ? BotonSearchIcon_2.style.display = "block" : '';
   
   //boton para mostrar y ocultar el estado del icon y del input
   if(BotonSearchIcon_2){
       //visible el div del porllet search
       document.querySelector('.advanced-search-portlet.basic-search-rd-sticky').style.display = 'block';
       
       //agregar un placeholder al nuevo input
       document.querySelector(".basic-search-rd-sticky .iter-field.iter-field-text .iter-field-element input").placeholder = "Buscar...";

       BotonSearchIcon_2.addEventListener('click', function() {
           const searchIcon_2 = document.querySelector('.new-menu-sticky .content-menu-ec .search-icon');
           if (!searchIcon_2.classList.contains('active_search')) {
               searchIcon_2.classList.add('active_search');
               document.querySelector('.basic-search-rd-sticky .iter-field-input.iter-field-input-text').style.display = "block";
           } else{
               searchIcon_2.classList.remove('active_search')
               document.querySelector('.basic-search-rd-sticky .iter-field-input.iter-field-input-text').style.display = "none";
           }
       });
   }
}

/*FIN MODAL INICIAR SESIÓN*/

/*VALIDAR EXISTENCIA DE JQUERY*/
ECUAVISA_EC.jqueryInit().then(result => {
  zonaPrivadaRules();
  botonesPerfil();
  setTimeout(function(){
      initMenuSticky();
      newInputSt();
  }, 1000);
  // Aquí puedes continuar con el código después de que jQuery se haya cargado
}).catch(error => {
  console.log(error);
  // Aquí puedes manejar el error en caso de que jQuery no se haya cargado
});
/*VALIDAR EXISTENCIA DE JQUERY*/

//Relog 
// const timeoutID = setTimeout(function(){relog();}, 4000);
// const intervalID = setInterval(function(){relog();}, 1000*60);

function relog() {
  // // console.log("relog")
  // let existeUsuario = localStorage.getItem('wylexUserId');
  // let existeUrl = localStorage.getItem('urlTk');
  // if(existeUsuario && existeUrl){
  //   var horaLog = new Date();  
  //   if(localStorage.getItem('horaLog')){
  //     var otra = localStorage.getItem('horaLog');
  //     var difHora = Math.abs( (horaLog - new Date(otra)) / (60*1000));
  //     //console.log("horaLog",new Date(horaLog));
  //     //console.log("local storage", otra);
  //     // console.log("Dif hora",difHora);
  //     if(difHora >= 90){ 
  //         localStorage.setItem('horaLog',horaLog);
  //         let redirect = window.location.href;
  //         window.location = "https://www.ecuavisa.com/user-portlet/refreshuserentitlements?redirect=" + redirect + "&ssodata=" + existeUrl;
          

  //     }
  //    }
  //     else{
  //     localStorage.setItem('horaLog',horaLog); 
  //     }
  //   }else{
  //     return false;
  //   }

  var horaLog = new Date();  
  if(localStorage.getItem('horaLog')){
      var otra = localStorage.getItem('horaLog');
      var difHora = Math.abs( (horaLog - new Date(otra)) / (60*1000));
      if(difHora >= 90){ 
          //EN EL FUTURO DEBERÍAMOS ELIMINAR horalog
          localStorage.setItem('horaLog',horaLog);
      }
  }else{
      localStorage.setItem('horaLog',horaLog); 
  }

  if(ECUAVISA_EC){
      //VERIFICA QUE LA VARIABLE ITER EXISTE, ESTA DEBE ESTAR EN TODO EL SITIO WEB SI O SI.
      ECUAVISA_EC.initVariable("ITER", 10).then((existe) => {
          //FUNCION QUE ESPERA UNA VARIABLE DURANTE 10 SEGUNDOS EN LA PÁGINA
          if(existe && ECUAVISA_EC.login() && ECUAVISA_EC.isPageProduccion()){
              var correo = ECUAVISA_EC.USER_data("email");
              var id = ECUAVISA_EC.USER_data("id");
              if(parseInt(id) == 0){
                  ECUAVISA_EC.loginCheckEmail(correo).then(respuesta => {
                      if(respuesta){
                          console.log("Se ha refrescado el localStorage");         
                      }
                  }).catch(error => {
                      console.log('Ocurrió un error en al buscar el correo:', error);
                  });
              }
              // SI EXISTE LA VARIABLE ITER Y EL LOGIN DE LOCALSTORAGE EXISTE MANDA A VERIFICAR SI ITER.USER.ID QUE EL LOGIN DE ITER ESTÁ VACÍO.
              if(ITER.USER.id == "" && ITER.USER.id.length < 1){
                  //OBTIENE EL CORREO DE MANERA SENCILLA DESDE ECUAVISA_EC
                  ECUAVISA_EC.loginUser(correo).then(respuesta => {
                      //ECUAVISA_EC TIENE LA FUNCIONALIDAD DE INICIAR SESION DE ITER DE MANERA SILENCIOSA MANDANDO EL CORREO, ESTE OBTIENE UNA RESPUESTA TRUE O FALSA
                      if(!respuesta){
                        // SI OBTIENE UNA RESPUESTA FALSE, MANDA Y UTILIZAR LA URL PROPORCIONADA POR PROTEC
                        // VARIABLE LOCALSTORAGE initLogin es la cantidad de veces que hace redirección
                        if(ECUAVISA_EC.USER_data("initLogin")){
                          if(ECUAVISA_EC.USER_data("initLogin") == "0"){
                              let existeUrl = localStorage.getItem('urlTk');
                              let redirect = ECUAVISA_EC.myUrl() || window.location.href;
                              window.location = "https://www.ecuavisa.com/user-portlet/refreshuserentitlements?redirect=" + redirect + "&ssodata=" + existeUrl;
                              
                              ECUAVISA_EC.SET_user("initLogin", "1");
                          }
                        }
                      }else{
                          console.log("Acabas de iniciar sesión nuevamente");
                          ECUAVISA_EC.SET_user("initLogin", "0");
                      }

                    }).catch(error => {
                      // Se produjo un error durante la ejecución de la función
                      console.log('Ocurrió un error en initUserToken:', error);
                      // Realiza acciones de manejo de errores aquí
                    });
              }else{
                  ECUAVISA_EC.SET_user("initLogin", "0");
              }
          }
      });
  }
}
relog();
/*######################################################*/
/*###############PROYECTO TRAZABILIDAD##################*/
/*######################################################*/

function loadTrazabilidad() {
return new Promise((resolve, reject) => {
  const script = document.createElement('script');
  script.src = 'https://cdn-ecuavisa.pages.dev/trazabilidad.js';
  script.onload = resolve;
  script.onerror = reject;
  document.head.appendChild(script);
  console.log("trazabilidad inyectado correctamente");
});
}
// loadTrazabilidad(); // no tocar

/*#####PROYECTO USUARIO ANONIMOS CUENTE LAS 3 PRIMERAS VISITAS#######*/
/*######################################################*/
const contValueUser = () => {
  // Verificar si localStorage es compatible en el navegador actual
  if (typeof (Storage) !== "undefined") {
    // Obtener el contador almacenado en localStorage, si existe
    var contador = localStorage.getItem("contador");

    // Verificar si el contador no existe o es nulo
    if (contador === null) {
      // Si no existe, establecer el valor inicial del contador como 1
      contador = 1;
    } else {
      // Si existe, incrementar el contador en 1
      contador++;
    }

    // Almacenar el valor actualizado del contador en localStorage
    localStorage.setItem("contador", contador);

    // Verificar si se alcanzaron las 3 visitas
    if (contador >= 4) {
      // Mostrar un mensaje por consola cuando se alcanzan las 3 visitas
      console.log("Has alcanzado el limite de visitas para un usuario anonimo - Debes de registrarte");
      const urlCentral = "https://www.ecuavisa.com/servicios/login/"
      if (window.location.href != urlCentral) {
        window.location.href = urlCentral;
        localStorage.removeItem("contador");
      }
    }
  } else {
    // Si localStorage no es compatible con el navegador, mostrar un mensaje de error
    console.log("Lo siento, tu navegador no es compatible con localStorage.");
  }
}

const valUserLogin = () => {
  if(!ECUAVISA_EC.login()){
      contValueUser();
  }
  // const userLoginRD = localStorage.getItem('wylexUserId') || null;
  // if (userLoginRD == null) {
  //   console.log('no estas logueado');
  //   contValueUser();
  // } else {
  //   console.log('estas logueado');
  // }
}

//   valUserLogin();


/*######################################################*/
/*###############PROYECTO ECUAVISA CONFIG ##############*/
/*######################################################*/



/*###############PROYECTO ECUAVISA CONFIG ##############*/
/*######################################################*/


const valId = () => {
  if(!ECUAVISA_EC.login()){
      redireccionAlLogin('msjenvivo=true');
  }
  // const userLoginRD = localStorage.getItem('wylexUserId') || null;
  // if (userLoginRD == null) {
  //     redireccionAlLogin('msjenvivo=true');
  // } else { }
}


const baseRD = window.location.href;
const urlRadioRD = "https://www.ecuavisa.com/audio-envivo";
const urlEnvivoRD = "https://www.ecuavisa.com/envivo";
const urlEcuGO = "https://www.ecuavisa.com/ecuavisa-go";

// Inicio - validor del envivo
if(!ECUAVISA_EC.login()){
  if (baseRD === urlEnvivoRD) {
      setTimeout(() => {
          valId();
      }, 60000); //1 minuto
  }
}
// Fin - validor del envivo

/*###############PROYECTO PAYWALL ARTICULOS ##############*/
/*######################################################*/
const eventPaywall = () => {
  const paywallMeta = document.querySelector('meta[name="paywall"]');
  if (paywallMeta) {
      const paywallValue = paywallMeta.getAttribute('content');
      // console.log(paywallValue);
      if (paywallValue === 'premium') {
          console.log('si es premium');
          if (!window.location.href.includes("/ecuavisa-go/")){
              setTimeout(() => {
                  valId();
              }, 30000); //medio minuto
          } else{
              console.log("si es href ecuavisa-go");
          }
      } else if (paywallValue === 'free_access') {
          console.log("si es free_access");
          
      } else {
          console.log('no esta suscrito');
      }
  } else {
      console.log("no existe paywallMeta");
  }
}

eventPaywall();


/*###############PROYECTO COOKIES ##############*/
/*######################################################*/
var isNoWebView = window.navigator.userAgent.includes('Safari/');
if (isNoWebView) {
  var cookiesJSEcuavisa = document.createElement("script");
  cookiesJSEcuavisa.src = "https://ecuavisav2.pages.dev/cookiesWeb/cookiesEcv.js";
  document.head.appendChild(cookiesJSEcuavisa);

  var cookiesCSSEcuavisa = document.createElement("link");
  cookiesCSSEcuavisa.rel = "stylesheet";
  cookiesCSSEcuavisa.href = "https://ecuavisav2.pages.dev/cookiesWeb/cookiesEcv.css";
  document.head.appendChild(cookiesCSSEcuavisa);
}

/*EVENTO, CAJA DE BÚSQUEDA DEL HEADER, MOSTRAR Y OCULTAR*/

ECUAVISA_EC.initDomVariable(".content-menu-ec .search-icon", 10).then((existe) => {
  if(existe){
      var searchIcon = document.querySelector('.content-menu-ec .search-icon');
      // Agrega el evento click al elemento
      var primeraVezBuscador = true;
      if (searchIcon) {
          searchIcon.addEventListener('click', function() {
              setTimeout(function(){
                  // Verifica si la clase "active_search" está activa
                    if (searchIcon.classList.contains('active_search')) {
                      // La clase "active_search" está activa
                      document.querySelector('.content-menu-ec .advanced-search-portlet').style.display = 'block';
                      //console.log('La clase active_search está activa');
                    } else {
                      // La clase "active_search" no está activa
                      document.querySelector('.content-menu-ec .advanced-search-portlet').style.display = 'none';
                      if(primeraVezBuscador){
                          document.querySelector('.content-menu-ec .advanced-search-portlet').style.display = 'block';
                          primeraVezBuscador = false;
                      }
                      
                      //console.log('La clase active_search no está activa');
                    }
              }, 200);
            
          });
      }
  }
});
/*EVENTO, CAJA DE BÚSQUEDA DEL HEADER, MOSTRAR Y OCULTAR*/
