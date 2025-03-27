/*****************************************************CREACIÓN DE EVENTO PARA MIPERFIL DESDE GLOBAL JS*****************************************************/
// var EndeventTemas = new CustomEvent("end-event-rdMiperfil-temas", { "detail": "Temas dentro de mi perfil ha terminado de ejecutar" });
/****************************************************/

/*// Crear un objeto con los valores que deseas enviar
var datosAdicionales = {
  key1: "valor1",
  key2: "valor2",
  key3: 42
};

// Crear y disparar el evento personalizado con los datos adicionales
var EndeventTemas = new CustomEvent("end-event-rdMiperfil-temas", {
  detail: datosAdicionales
});

// Disparar el evento en el contexto que desees
document.dispatchEvent(EndeventTemas);

// Suscribirse al evento personalizado y manejarlo cuando ocurre
document.addEventListener("end-event-rdMiperfil-temas", function(event) {
  var datosRecibidos = event.detail; // Aquí están los datos adicionales enviados
  console.log("Evento personalizado recibido con datos:", datosRecibidos);

  // Ejemplo: Acceder a valores específicos enviados junto con el evento
  console.log("Valor de key1:", datosRecibidos.key1);
  console.log("Valor de key2:", datosRecibidos.key2);
  console.log("Valor de key3:", datosRecibidos.key3);

  // Realiza aquí cualquier otra acción que desees con los datos adicionales
});


*/

/*****************************************************CREACIÓN DE EVENTO PARA VERFICCAR EL LOGIN*****************************************************/
const ECUAVISA_EC = {
  version:"0.038",
  validateUrl: function(url) {
    // Get the domain of the current page.
    const currentDomain = window.location.hostname;
    // Get the domain of the URL to be validated.
    const urlDomain = url.split('/')[2];
    // Return true if the two domains are the same, false otherwise.
    return currentDomain === urlDomain;
  },
  loginCheckEmail:async function (email) {
      var ins = this;
      return new Promise(async (resolve, reject) => {
          try {
              const myHeadersLogin = new Headers();
              myHeadersLogin.append("Content-Type", "application/json");
              const url = "https://micuenta.ecuavisa.com/loginservice/check/email";
              var requestOptions = {
                  method: 'POST',
                  headers: myHeadersLogin,
                  body: JSON.stringify({
                    "email": email
                  }),
                  redirect: 'follow'
              };
              const response = await fetch(url, requestOptions);
              const result = await response.json();
              if(result.existe){

                  if(ins.login()){
                      ins.SET_user("id", result.wylexId);
                      ins.SET_user("wylexUserId", result.wylexId);
                      ins.SET_user("wylexIdObject", result.idObject);
                  }

                  resolve({
                      resp:true,
                      id:result.wylexId,
                      idObject:result.idObject,
                  });

              }
              resolve({
                  resp:false,
                  id:0
              });
          } catch (error) {
            reject(error);
          }
      });
  },
  loginUser: async function (email) {
      var ins = this;
      return new Promise(async (resolve, reject) => {
          try {
            const passwords = ["EcuavisaDefault2023.", "EcuavisaDefault202."];
            let loginSuccessful = false;
            const myHeadersLogin = new Headers();
            myHeadersLogin.append("Content-Type", "application/x-www-form-urlencoded");
            const url = "https://www.ecuavisa.com/restapi/user/login";

            for (const password of passwords) {
              const urlencoded = new URLSearchParams();
              urlencoded.append("username", email);
              urlencoded.append("password", password);
              urlencoded.append("keepAlive", false);
              urlencoded.append("origin", "");

              const responseLogin = await fetch(url, {
                method: "POST",
                headers: myHeadersLogin,
                body: urlencoded,
              });

              if (responseLogin.status === 418) {
                loginSuccessful = false;
                break;
              }

              const data = await responseLogin.text();

              if (data === `{"returnValue":{"infomsg":"Usuario no existe"}}`) {
                loginSuccessful = true;
                break;
              }

              // Uncomment the following code block if needed
              // if (
              //     data.exception !== undefined &&
              //     data.exception !== "Usuario y/o Contraseña no corresponden"
              // ) {
              //     loginSuccessful = true;
              //     break;
              // }
            }

            if(!loginSuccessful){
              // var urlToken = await ins.encriptarLogin();
              // var redirect = "https://www.ecuavisa.com/";
              // var urlGenerada = "https://www.ecuavisa.com/user-portlet/refreshuserentitlements?redirect=" + redirect + "&ssodata=" + urlToken.encrypt;
              // console.log(urlToken, urlGenerada)
            }

            resolve(loginSuccessful);
          } catch (error) {
            // var urlToken = await ins.encriptarLogin();
            // var redirect = "https://www.ecuavisa.com/";
            // var urlGenerada = "https://www.ecuavisa.com/user-portlet/refreshuserentitlements?redirect=" + redirect + "&ssodata=" + urlToken;
            // console.log(urlToken, urlGenerada)

            // resolve({
            //   url: urlGenerada,
            //   login: loginSuccessful,
            //   email:result.email,
            //   urlSinFormat: redirect
            // });

            reject(error);
          }
      });
  },
  ecuavisaScroll: async function () {
      var ins = this;
      return new Promise((resolve, reject) => {
        try {
          let interaccionRealizada = false;
          let timeoutId = null;
          function realizarInteraccion() {
            if (!interaccionRealizada) {
              interaccionRealizada = true;
              resolve(true);
              clearTimeout(timeoutId);
              document.removeEventListener('mouseover', realizarInteraccion);
              window.removeEventListener('scroll', realizarInteraccion);
            }
          }

          function tiempoSinInteraccion() {
            if (!interaccionRealizada) {
              interaccionRealizada = true;
              resolve(true);
              clearTimeout(timeoutId);
              document.removeEventListener('mouseover', realizarInteraccion);
              window.removeEventListener('scroll', realizarInteraccion);
            }
          }
          // Esperar el evento mouseover
          document.addEventListener('mouseover', realizarInteraccion);
          // Esperar el evento scroll
          window.addEventListener('scroll', realizarInteraccion);
          // Establecer un temporizador para 3 minutos (180,000 ms)
          timeoutId = setTimeout(tiempoSinInteraccion, 120000);
        } catch (error) {
          reject(error);
        }
      });
  },
  encriptarLogin: async function () {
      var ins = this;
      var email = ins.USER_data("email");
      var id = ins.USER_data("wylexIdObject");

      return new Promise(async (resolve, reject) => {
          try {
            const myHeadersLogin = new Headers();
            myHeadersLogin.append("Content-Type", "application/json");
            var resp = await fetch(`https://micuenta.ecuavisa.com/loginservice/encrypt/user/ecuavisa`,{
              method: "POST",
              body: JSON.stringify({
                email: email,
                id: id
              }),
              headers: myHeadersLogin,
            }); 
            var obtener = await resp.json();
            resolve(obtener);
          } catch (error) {
            reject(error);
          }
      });
  },
  initUserToken: async function (token, redirect) {
      var ins = this;
      return new Promise(async (resolve, reject) => {
        try {
          var myHeaders = new Headers();
          myHeaders.append("Authorization", "JWT " + token);
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow'
          };
          const response = await fetch(`${ins.api.loginService}tasks`, requestOptions);
          const result = await response.json();

          if (result.message != 'Usuario No Autorizado') {
            localStorage.wylexUserAlertView = true;
            localStorage.wylexUserId = result.userId;
            localStorage.wylexFirstName = result.first_name;
            localStorage.wylexLastName = result.last_name;
            localStorage.wylexEmail = result.email;
            localStorage.wylexIdObject = result._id;
            localStorage.wylexStatusPerfil = result.user_new;
            localStorage.wylexAvatar = result.avatar || 'https://estadisticas.ecuavisa.com/sites/gestor/Recursos/usuario.png';

            /*Login INICIO*/
            var loginSuccessful = await ins.loginUser(result.email);
            /*Login FIN*/

            var urlGenerada = "https://www.ecuavisa.com/user-portlet/refreshuserentitlements?redirect=" + redirect + "&ssodata=" + result.url;
            resolve({
              url: urlGenerada,
              login: loginSuccessful,
              email:result.email,
              urlSinFormat: redirect
            });
          } else {
            reject(new Error('Usuario No Autorizado'));
          }
        } catch (error) {
          reject(error);
        }
      });
  },
  initFuncion: async function (nombreFuncion, tiempoEspera = 10) {
    return new Promise((resolve, reject) => {
      let contador = 0;

      if (window[nombreFuncion] && typeof window[nombreFuncion] === 'function') {
          resolve(true);
      }
      
      const intervalo = setInterval(() => {
        if (window[nombreFuncion] && typeof window[nombreFuncion] === 'function') {
          clearInterval(intervalo);
          resolve(true);
        }
        
        contador++;
        
        if (contador >= tiempoEspera) {
          clearInterval(intervalo);
          resolve(false);
        }
      }, 1000); // Intervalo de comprobación (1 segundo en este ejemplo)
    });
  },
  initVariable: async function (nombreVariable, tiempoEspera = 10) {
      return new Promise((resolve, reject) => {
          let contador = 0;

          if (window[nombreVariable] !== undefined) {
              resolve(true);
          }

          const intervalo = setInterval(() => {
            if (window[nombreVariable] !== undefined) {
              clearInterval(intervalo);
              resolve(true);
            }

            contador++;

            if (contador >= tiempoEspera) {
              clearInterval(intervalo);
              resolve(false);
            }
          }, 1000); // Intervalo de comprobación (1 segundo en este ejemplo)
      });
  },
  initDomVariable: async function (nombreVariable, tiempoEspera = 10) {
      return new Promise((resolve, reject) => {
          let contador = 0;

          if (document.querySelector(nombreVariable)) {
              resolve(true);
          }

          const intervalo = setInterval(() => {
            if (document.querySelector(nombreVariable)) {
              clearInterval(intervalo);
              resolve(true);
            }

            contador++;

            if (contador >= tiempoEspera) {
              clearInterval(intervalo);
              resolve(false);
            }
          }, 1000); // Intervalo de comprobación (1 segundo en este ejemplo)
      });
  },
  jqueryInit: async function() {
      const maxAttempts = 10; // Número máximo de intentos
      let attempts = 0;
      return new Promise((resolve, reject) => {
          if (window.jQuery) {
              resolve("Existe Jquery");
          }
          var runJquery = setInterval(function() {
              attempts++;
              if (window.jQuery) {
                  clearInterval(runJquery);
                  resolve("Existe Jquery");
              } else if (attempts >= maxAttempts) {
                  clearInterval(runJquery);
                  reject(new Error("No se pudo cargar jQuery después de varios intentos"));
              }
          }, 500);
      });
  },
  swiperInit: async function(tiempoEspera = 45) {
      const maxAttempts = tiempoEspera; // Número máximo de intentos
      let attempts = 0;
      let primerScroll = true; // Variable para controlar si se hizo el primer scroll

      return new Promise((resolve, reject) => {
        const scrollHandler = () => {
          if (primerScroll) {
            primerScroll = false;

            if (typeof Swiper !== 'undefined') {
              clearInterval(runJquery);
              resolve("Existe Swiper");
            }

            var runJquery = setInterval(function() {
              attempts++;
              if (typeof Swiper !== 'undefined') {
                clearInterval(runJquery);
                resolve("Existe Swiper");
              } else if (attempts >= maxAttempts) {
                clearInterval(runJquery);
                reject(new Error("No se pudo cargar Swiper después de varios intentos"));
              }
            }, 500);

            // Desvincular el evento de scroll una vez que se ha manejado el primer scroll
            document.removeEventListener('scroll', scrollHandler);
          }
        };

        // Agregar el evento de scroll al documento
        document.addEventListener('scroll', scrollHandler);
      });
  },
  swiper:{
      swiperSliderClass:"element",
      existeComponente:function(swiperSliderId, swiperSlider, swiperWraper, itemClass){
        var item = document.querySelector(`${swiperSlider} ${itemClass}`);
        var slider = document.querySelector(swiperSlider);
        if (!item || !slider || slider.swiper) {
          console.log("Elemento no existe: " + swiperSliderId);
          return false;
        }
        return true;
      },
      getGridRows:function() {
        if (window.matchMedia('(max-width: 576px)').matches) {
          return 4; // Para pantallas con un ancho máximo de 576px, muestra 4 filas
        } else if (window.matchMedia('(max-width: 768px)').matches) {
          return 4; // Para pantallas con un ancho máximo de 768px, muestra 4 filas
        } else {
          return 4; // Para pantallas con un ancho mayor a 768px, muestra 3 filas
        }
      },
      getGridPerView:function() {
        if (window.matchMedia('(max-width: 576px)').matches) {
          return 1; // Para pantallas con un ancho máximo de 576px, muestra 1 filas
        } else if (window.matchMedia('(max-width: 768px)').matches) {
          return 1; // Para pantallas con un ancho máximo de 768px, muestra 1 filas
        } else {
          return 1; // Para pantallas con un ancho mayor a 768px, muestra 3 filas
        }
      },
      getGridSpace:function() {
        if (window.matchMedia('(max-width: 576px)').matches) {
          return 5; // Para pantallas con un ancho máximo de 576px, muestra 5 filas
        } else if (window.matchMedia('(max-width: 768px)').matches) {
          return 5; // Para pantallas con un ancho máximo de 768px, muestra 3 filas
        } else {
          return 20; // Para pantallas con un ancho mayor a 768px, muestra 20 filas
        }
      },
      armarSwiper:function(swiperSliderId, swiperSlider, swiperWraper, itemClass, addPag = true, addNav = true){
        var ins = this;
        var swiperElementSlider = swiperWraper + ` .${ins.swiperSliderClass}`;
        var classListaPauta = document.querySelectorAll(swiperSlider);
        var classListaPautaNot = document.querySelectorAll(swiperWraper);
        var classListaPautaNotArt = document.querySelectorAll(swiperElementSlider);

        for (const ins of classListaPauta) {
            ins.classList.add('swiper');
        }

        for (const ins of classListaPautaNot) {
            ins.classList.add('swiper-wrapper');
        }
        
        if(addPag){
          var divPagination = document.createElement("div");
          divPagination.classList.add('swiper-pagination');
          divPagination.classList.add('swiper-pagination-mi-ecuavisa-'+swiperSliderId);

          for (const ins of classListaPauta) {
              ins.appendChild(divPagination);
          }
        }

        if(addNav){
          var divNavigation = document.createElement("div");
          divNavigation.innerHTML = `
            <!-- If we need navigation buttons -->
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          `;
          
          for (const ins of classListaPauta) {
              ins.appendChild(divNavigation);
          }
        }

        for (const SlideProg of classListaPautaNotArt) {
            SlideProg.classList.add('swiper-slide');
        }

        return true;
      },
      init:function(swiper = {swiperSliderId:'', swiperSlider:'', swiperWraper:'', itemClass:'', numberPreview: 4, pagination:false , navigation: true}){
        var ins = this;
        return ins.initComponent(swiper.swiperSliderId, swiper.swiperSlider, swiper.swiperWraper, swiper.itemClass, swiper.numberPreview, swiper.pagination , swiper.navigation, swiper.style);
        
      },
      initComponent:function(swiperSliderId, swiperSlider, swiperWraper, itemClass, numberPreview, pagination = false , navigation= true, style="swiper"){
          var ins = this;
          var breakpoints = {};
          if (typeof numberPreview === 'object' && numberPreview !== null) {
            breakpoints = {};

            if(numberPreview.hasOwnProperty('360')){
              if(!numberPreview['360'].hasOwnProperty('slidesPerView')){
                numberPreview['360']['slidesPerView'] = 1.5;
              }
              if(!numberPreview['360'].hasOwnProperty('spaceBetween')){
                numberPreview['360']['spaceBetween'] = 20;
              }
            }else{
              numberPreview["360"]= {
                 slidesPerView: 1.5,
                 spaceBetween: 20,
              }
            }

            if(numberPreview.hasOwnProperty('768')){
              if(!numberPreview['768'].hasOwnProperty('slidesPerView')){
                numberPreview['768']['slidesPerView'] = 3;
              }
              if(!numberPreview['768'].hasOwnProperty('spaceBetween')){
                numberPreview['768']['spaceBetween'] = 20;
              }
            }else{
              numberPreview["768"]= {
                 slidesPerView: 3,
                 spaceBetween: 20,
              }
            }

            if(numberPreview.hasOwnProperty('1024')){
              if(!numberPreview['1024'].hasOwnProperty('slidesPerView')){
                numberPreview['1024']['slidesPerView'] = 4;
              }
              if(!numberPreview['1024'].hasOwnProperty('spaceBetween')){
                numberPreview['1024']['spaceBetween'] = 20;
              }
            }else{
              numberPreview["1024"]= {
                 slidesPerView: 4,
                 spaceBetween: 20,
              }
            }

            breakpoints = numberPreview;
            // console.log(numberPreview)

            // breakpoints = {
            //    360: {
            //      slidesPerView: (typeof (numberPreview['360'].slidesPerView) === 'undefined' ) ? 1.5 : numberPreview['360'].slidesPerView,
            //      spaceBetween: (typeof (numberPreview['360'].spaceBetween) === 'undefined' ) ? 20 : numberPreview['360'].spaceBetween,
            //    },
            //    768: {
            //      slidesPerView: (typeof (numberPreview['768'].slidesPerView) === 'undefined' ) ? 3 : numberPreview['768'].slidesPerView,
            //      spaceBetween: (typeof (numberPreview['768'].spaceBetween) === 'undefined' ) ? 20 : numberPreview['768'].spaceBetween,
            //    },
            //    1024: {
            //      slidesPerView: (typeof (numberPreview['1024'].slidesPerView) === 'undefined' ) ? 4 : numberPreview['1024'].slidesPerView,
            //      spaceBetween: (typeof (numberPreview['1024'].spaceBetween) === 'undefined' ) ? 20 : numberPreview['1024'].spaceBetween,
            //    },
            // };
          }else{
            breakpoints = {
               360: {
                 slidesPerView: 1.5,
                 spaceBetween: 20,
               },
               768: {
                 slidesPerView: 3,
                 spaceBetween: 20,
               },
               1024: {
                 slidesPerView: numberPreview,
                 spaceBetween: 20,
               }
            }
          }

          if(!ins.existeComponente(swiperSliderId, swiperSlider, swiperWraper, itemClass )){
            return false;
          }
          ins.armarSwiper(swiperSliderId, swiperSlider, swiperWraper, itemClass, pagination, navigation);

          var config = {
            slidesPerView: 1,
            // spaceBetween: 20,
            initialSlide: 0,
            // navigation: {
            //   nextEl: swiperSlider+" .swiper-button-next",
            //   prevEl: swiperSlider+" .swiper-button-prev",
            // },
            // pagination: {
              //     el: ('.swiper-pagination-mi-ecuavisa-'+swiperSliderId),
              //     clickable: true,
              // },
            breakpoints: breakpoints
          };

          if(style == "grid"){
            config = {
                // pagination: {
                //     el: ('.swiper-pagination-mi-ecuavisa-'+swiperSliderId),
                //     clickable: true,
                // },




                slidesPerView: ins.getGridPerView(),
                grid: {
                    rows: numberPreview || ins.getGridRows(),
                },
                spaceBetween: 0



                // slidesPerView: 1,
                // slidesPerGroup: 1,
                // slidesPerColumn: 3,
                // spaceBetween: 1,
                // slidesPerColumnFill: 'column',




                /*autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                },*/
            };
          }

          if(navigation){
            config["navigation"] = {
              nextEl: swiperSlider+" .swiper-button-next",
              prevEl: swiperSlider+" .swiper-button-prev",
            };
          }

          if(pagination){
            config["pagination"] = {
                el: ('.swiper-pagination-mi-ecuavisa-'+swiperSliderId),
                clickable: true,
                dynamicBullets:true
            };
          }

          var swiper = new Swiper(swiperSlider, config);
          return swiper;
      }
  },
  baseUrl:function(){
      return window.location.origin + "/";
  },
  myUrl:function(){
      const currentURL = window.location.href;
      const cleanURL = currentURL.split('#')[0].split('?')[0];
      return cleanURL;
  },
  isPageProduccion:function(){
      var ins = this;
      if(ins.baseUrl() == "https://ecv-vp.milenium.cloud/" || document.querySelectorAll(".webkit.ltr").length != 0){
          return false;
      }else{
          return true;
      }
  },
  isMobileCheck: function() {
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  },
  pathnameFunction: function (url){
      var urlLocal = url;
      var urlLocalText = urlLocal.split('/')[(urlLocal.split('/')).length - 1];
      return urlLocalText;
  },
  isLocalStorageEnabled:function(){
      getStorage = () => localStorage;
      try {
          const key = "__some_random_key_you_are_not_going_to_use__";
          getStorage().setItem(key, key);
          getStorage().removeItem(key);
          return true;
      } catch (e) {
          return false;
      }
  },
  isLocalIndexDBEnabled:function(){
      if (!('indexedDB' in window)) {
        return false;
      }
      return true;
  },
  URL:{
      miEcuavisa:"https://www.ecuavisa.com/servicios/mi-ecuavisa/",
      miPerfil:"https://www.ecuavisa.com/servicios/perfil/",
      registro:"https://www.ecuavisa.com/servicios/registro/",
  },
  api:{
      showandevents:{
          get:"https://showandevents-service.vercel.app/",
          add:"https://showandevents-service.vercel.app/add/"
      },
      loginService:"https://micuenta.ecuavisa.com/loginservice/",
      exportPDF:"https://ecuavisapdfs.phpdemo.site/",
      seguimientoTemaOld:"https://ecuavisa-seguimiento-tema.onrender.com/",
      seguimientoTema:"https://ecuavisa-temas.vercel.app/",
      estadisticas:"https://estadisticas.ecuavisa.com/",
      ecuavisaDev:"https://ecuavisadev.netlify.app/",
      headerResources:"https://ecuavisa-header-resources.vercel.app/",
      notificacion:{
          add: 'https://ecuavisa-notificaciones.vercel.app/',
          obtener: 'https://ecuavisa-notificaciones.vercel.app/',
          delete: 'https://ecuavisa-notificaciones.vercel.app/',
          get:function(info){
              var notificaciones = JSON.parse(ECUAVISA_EC.USER_data(info));
              var url = location.href;
              var urlObj = new URL(url);
              urlObj.search = '';
              var url_local = urlObj.toString();
              var nota_url = url_local.split("/").pop();
              for(var i in notificaciones){
                  var noti = notificaciones[i];
                  var UrlData = noti.url;
                  var urlObjTemp = new URL(UrlData);
                  urlObjTemp.search = '';
                  var url_localTemp = urlObjTemp.toString();
                  var notiUrl = (url_localTemp).split("/").pop();
                  if(notiUrl == nota_url){
                      return noti;
                  }
              }
              return {};
          },
          all:function(info = 'notificaciones'){
              var notificaciones = JSON.parse(ECUAVISA_EC.USER_data(info));
              return notificaciones || [];
          }
      }
  },
  login: function (){

    return true;
      if(!this.isLocalStorageEnabled()){
          console.log({
              resp:false,
              mensaje:"localStorage o las cookies no están activadas"
          });
          // alert("localStorage o las cookies no están activadas, se deben activar");
          return false;
      }

      // if(!this.isPageProduccion()){
      //     return true;
      // }

      if(localStorage.getItem('wylexFirstName') && localStorage.getItem('wylexUserId')){
          return true;
      }
      return false;
  },
  logout: function(boton) {
    var ins = this;
    if(!boton){
      alert("Debe mandar un elemento dentro de la función")
      return false;
    }
    return new Promise((resolve, reject) => {
      var myHeaders = new Headers();
      var requestOptions = {
        method: 'POST',
        headers: myHeaders
      };
      boton.classList.add('diasbled');
      fetch(window.origin+"/restapi/user/logout", requestOptions)
        .then(response => response.json())
        .then(jsondata => {
          localStorage.clear();
          window.location.href = ins.URL_login();
          boton.classList.remove('diasbled');
          resolve("Logout exitoso"); // Resuelve la promesa con la respuesta deseada
        })
        .catch(error => {
          boton.classList.remove('diasbled');
          reject(error); // Rechaza la promesa en caso de error
        });
    });
  },
  ESTADO_ITER_ACTIVO:async function(){
      var contador = 0;
      var estadoIter = setInterval(function () {
          if (typeof ITER !== 'undefined') {
            clearInterval(estadoIter);
            return true;
          }else{
              if(contador == 500){
                  clearInterval(estadoIter);
                  return false;
              }
              contador++;
          }
      }, 500);
      return false;
  },
  URL_login:function(){
      return 'https://www.ecuavisa.com/servicios/login/';
  },
  URL_principal:function(){
      return 'https://www.ecuavisa.com/';
  },
  URL_perfil:function(){
      return 'https://www.ecuavisa.com/servicios/perfil/';
  },
  ESTADO_modal:function(estado = null){
      if(!this.isLocalStorageEnabled()){
          console.log({
              resp:false,
              mensaje:"localStorage o las cookies no están activadas"
          })
          return false;
      }
      var nombreVariable = 'estadomodal|main_ecuavisa';
      var estadomodal = localStorage.getItem(nombreVariable) || null;
      if(estado == null){
          if(estadomodal == null){
              estadomodal = localStorage.setItem(nombreVariable, 'false') || null;
          }
      }else{
          estadomodal = localStorage.setItem(nombreVariable, (estado?'true':'false')) || null;
      }
      
      return this.USER_data('estadomodal') == 'true';
  },
  USER_data:function(info = ''){
      if(!this.isLocalStorageEnabled()){
          console.log({
              resp:false,
              mensaje:"localStorage o las cookies no están activadas"
          })
          return false;
      }
      if(info == ''){
          var data = {
              "id" : localStorage.getItem('wylexUserId') || null,
              "name" : localStorage.getItem('wylexFirstName') || null,
              "isnewuser" : localStorage.getItem('wylexStatusPerfil') || null,
              "useralertview" : localStorage.getItem('wylexUserAlertView') || null,
              "wylexIdObject" : localStorage.getItem('wylexIdObject') || null,
              "lastname" : localStorage.getItem('wylexLastName') || null,
              "email" : localStorage.getItem('wylexEmail') || null,
              "avatar" : localStorage.getItem('wylexAvatar') || 'https://estadisticas.ecuavisa.com/sites/gestor/Recursos/usuario.png'
          };
          
          for(var i = 0; i < localStorage.length; i++) {              
              var clave = localStorage.key(i);
              if(clave.includes("main_ecuavisa")){
                  var nameV = clave.split("|")[0];
                  var valueD = localStorage.getItem(clave);
                  data[nameV] = valueD;
              }
          }
          return data;
      }
      var infoLocal = localStorage.getItem(info) || null;
      if(infoLocal == null){
          infoLocal = ECUAVISA_EC.USER_data()[info] || null;
      }
      return infoLocal;
  },
  SET_user:function(name = '', value=''){
      if(!this.isLocalStorageEnabled()){
          console.log({
              resp:false,
              mensaje:"localStorage o las cookies no están activadas"
          })
          return false;
      }
      if(localStorage.getItem(name)){
          localStorage.setItem(name,value);
          return true;
      }
      localStorage.setItem(`${name}|main_ecuavisa`,value);
      return true;
  },
  validarEmail:function (email) {
    const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/;
    const partesEmail = email.split("@");
    if (regexEmail.test(email) && partesEmail[1].length <= 25 && partesEmail[1].split(".")[1].length <= 5) {
      return true;
    } else {
      return false;
    }
  },
  MODAL:{
      login:{
          idmodal:`modalLogin_${Math.floor(Math.random() * 100)}`,
          idform:`form_login_user_${Math.floor(Math.random() * 100)}`,
          insModal:null,
          modalShow:false,
          getURL: window.location.href.split('?')[0],
          modalHTML:function(){
              var ins = this;
              var idEC = ins.idmodal;
              return `<div class="modal fade" id="${idEC}" tabindex="-1" aria-labelledby="${idEC}Label" aria-hidden="true">
                         <div class="modal-dialog">
                            <div class="modal-content">
                              <div class="modal-header">
                                  <h5 class="modal-title" id="${idEC}Label">Para realizar esta acción debes iniciar sesión</h5>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> 
                              </div>
                              <form id="${ins.idform}">
                                  <div class="modal-body">
                                     <label for="">¿Desea iniciar sesión?</label>
                                     <div class="mt-4 mb-3">
                                        <div class="row">
                                          <div class="col-12 mb-2">
                                            <label for="email-${idEC}" class="form-label">Dirección de correo electrónico</label>
                                            <input type="email" maxlength="100" required class="form-control" name="email" id="email-${idEC}" placeholder="Dirección de correo electrónico">
                                          </div>
                                          <div class="col-12">
                                            <label for="password-${idEC}" class="form-label">Contraseña</label>
                                            <input type="password" maxlength="100" required class="form-control" name="password" id="password-${idEC}" placeholder="Contraseña">
                                          </div>
                                          <div class="col-12 mt-2 politica-privacidad-modal">
                                              <label style="display:flex; align-items:center; margin: -4px -5px;"> 
                                                  <input type="checkbox" id="checkTerms" class="checkTerms" style="width:20px; height:20px; flex:none; margin: 0 5px;" required=""> Acepto la <a href="https://www.ecuavisa.com/servicios/politicas-de-privacidad" style="text-decoration-line: underline; flex:none; margin: 0 5px;" target="_blank">Política de Privacidad.</a> 
                                              </label>
                                          </div>

                                          <div class="col-12 mt-2 politica-privacidad-modal">
                                              <p class="register-class" style="font-family: 'Archivo', sans-serif; font-style: normal; font-weight: 700;"> ¿No tienes una cuenta? <a href="#" onclick="window.location = '${ECUAVISA_EC.URL_login()}?registro=true&nextpage=${ins.getURL}'">Regístrate</a> </p>
                                          </div>
                                        </div>
                                      </div>
                                  </div>
                                  <div class="modal-footer">
                                      <div class="botonesaccionlogout">
                                          <button type="button" class="btn btn-primary font-weight-bold btn-cancelar" data-bs-dismiss="modal">Cancelar</button>
                                          <button type="submit" id="form_btn_login_user" class="btn btn-primary btn-send-cr">Acceder</button> 
                                      </div>
                                  </div>
                              </form>
                            </div>
                         </div>
                      </div>`;
          },
          css:function(){
              return ``;
          },
          mensajeRespuesta:function(resp, mensaje){
              var ins = this;
              if(!document.querySelector('#modal-resp')){
                  var divRespuesta = document.createElement("div");
                  divRespuesta.setAttribute(`id`, "modal-resp");
                  document.querySelector(`#${ins.idmodal} .modal-body > div`).before(divRespuesta);
              }

              var respuesta = (resp?'success':'danger');
              var modalResp = document.querySelector('#modal-resp');
              modalResp.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
              <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </symbol>
              <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </symbol>
              <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </symbol>
              </svg>
              <div class="alert alert-${respuesta} alert-dismissible fade show" role="alert">
                ${resp? `<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>` : `  <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>`} ${mensaje}
                <button style="background-size: 25px !important;" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>`;
              return true;
          },
          initComponent:function(){
              var ins = this;
              if(ins.insModal!=null){
                  ins.insModal.show();
                  return true;
              }

              var contador = 0;
              if(!window.bootstrap){
                  var scriptBoostrap = document.createElement("script");
                  scriptBoostrap.setAttribute( 'src', `https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js` );
                  document.body.appendChild(scriptBoostrap);
              }
              var existemodal = setInterval(function () {
                  if (window.bootstrap) {
                      ins.insModal = new bootstrap.Modal(document.getElementById(ins.idmodal), { keyboard: false });
                      var myModal = ins.insModal;
                      if(!ECUAVISA_EC.MODAL.login.modalShow){
                          if(!ECUAVISA_EC.login()){
                              myModal.show();
                          }
                      }
                      var modalId = document.getElementById(ins.idmodal);
                      modalId.addEventListener('show.bs.modal', function () {
                        ECUAVISA_EC.MODAL.login.modalShow = true;
                      });
                      modalId.addEventListener('hidden.bs.modal', function () {
                        ECUAVISA_EC.MODAL.login.modalShow = false;
                      });
                      clearInterval(existemodal);
                  }else{
                    contador++;
                  }
                  if(contador == 100){
                    console.log("Jquery no está definido");
                    clearInterval(existemodal);
                  }
              }, 500);
              return true;
          },
          body:function(){
              var ins = this;
              var classModal = "MODAL_FORMULARIO_USUARIO_LOGIN";
              if(!document.querySelector(`.${classModal}`)){
                  var addDivModal = document.createElement("div");
                  addDivModal.classList = classModal;
                  addDivModal.innerHTML = ins.modalHTML();
                  document.querySelector('body').appendChild(addDivModal);
                  return true;
              }
              return false;
          },
          initUserToken:function(userData, btn, btnOld, redirect){
              // var myHeaders = new Headers();
              // myHeaders.append("Authorization", "JWT "+userData.token);
              // var requestOptions = {
              //     method: 'POST',
              //     headers: myHeaders,
              //     redirect: 'follow'
              // };
              // var resp = fetch(`${ECUAVISA_EC.api.loginService}tasks`, requestOptions)
              // .then(response => response.json())
              // .then (async (result) => {
              //   if(result.message!='Usuario No Autorizado'){
              //     localStorage.wylexUserAlertView    = true;
              //     localStorage.wylexUserId    = result.userId;
              //     localStorage.wylexFirstName = result.first_name;
              //     localStorage.wylexLastName  = result.last_name;
              //     localStorage.wylexEmail     = result.email;
              //     localStorage.wylexStatusPerfil  =result.user_new;
              //     localStorage.wylexAvatar=result.avatar  || 'https://estadisticas.ecuavisa.com/sites/gestor/Recursos/usuario.png'
                  
              //     btn.innerHTML = btnOld;
              //     btn.removeAttribute('disabled');
              //     var urlGenerada = "https://www.ecuavisa.com/user-portlet/refreshuserentitlements?redirect=" + redirect + "&ssodata=" + userData.url;
                  
              //     /*Login INICIO*/
              //     ECUAVISA_EC.loginUser(result.email)
              //     .then(loginSuccessful => {
              //         window.location = redirect;
              //         btn.removeAttribute('disabled'); 
              //     }).catch(error => alert(error));
              //     /*Login FIN*/
              //   }
              // })
              // .catch(error => {
                
              // });

              ECUAVISA_EC.initUserToken(userData.token, redirect)
              .then(tokenResult => {
                  btn.innerHTML = btnOld;
                  btn.removeAttribute('disabled');
                  // var urlGenerada = "https://www.ecuavisa.com/user-portlet/refreshuserentitlements?redirect=" + redirect + "&ssodata=" + userData.url;
                  
                  // window.location = urlGenerada;
                  // btn.removeAttribute('disabled');  
                  /*Login INICIO*/
                  ECUAVISA_EC.loginUser(tokenResult.email)
                  .then(loginSuccessful => {
                      window.location = tokenResult.url;
                      btn.removeAttribute('disabled'); 
                  }).catch(error => alert(error));
                  /*Login FIN*/

              }).catch(error => alert(error));

          },
          enviarData:function(btn, dataForm){
              var ins = this;
              var btnOld = btn.innerHTML;
              btn.innerHTML = "Enviado....";
              var resp = fetch("https://micuenta.ecuavisa.com/loginservice/signIn", {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams(dataForm)
              })
              .then( (response) => response.json())
              .then( (result) => {
                  document.getElementById(ins.idform).reset();
                  if (result.token) {
                      ins.initUserToken(result,btn, btnOld, dataForm.redirect);
                  } else {
                      ins.mensajeRespuesta(false, "Nombre de usuario o contraseña incorrecto");
                      btn.innerHTML = btnOld;
                      btn.removeAttribute('disabled');
                  }
                  //ins.modalInst.hide();
                return true;
              })
              .catch((error) => {
                ins.mensajeRespuesta(false, error);
              });
          },
          init:function(){
              var ins = this;
              if(!ins.body()){
                  ins.insModal.show();
                  return false;
              }
              ins.initComponent();
              setTimeout(function(){
                var btn = document.getElementById("form_btn_login_user");
                var form = document.getElementById(ins.idform);

                form.addEventListener("submit", function(e){
                  e.preventDefault();
                  if(ECUAVISA_EC.login()){
                      return false;
                  }
                  var emailIns = document.getElementById(`email-${ins.idmodal}`);
                  if(!ECUAVISA_EC.validarEmail(emailIns.value)){
                    emailIns.classList.add("is-invalid");
                    return false;
                  }
                  emailIns.classList.remove("is-invalid");

                  const myFormData = new FormData(e.target);
                  const dataArray = [...myFormData];
                  const data = Object.fromEntries(dataArray);
                  var dataForm = {};
                  const obj = data;
                  for (const [key, value] of Object.entries(obj)) {
                    dataForm[key] = value;
                  }
                  dataForm["redirect"] = ins.getURL;
                  btn.setAttribute('disabled', true);
                  //console.log(dataForm)
                  ins.enviarData(btn, dataForm);
                  return true;
                });
              }, 700);
          }
      },
      login_v2:{
          idmodal:`modalLogin_${Math.floor(Math.random() * 100)}`,
          idform:`form_login_user_${Math.floor(Math.random() * 100)}`,
          insModal:null,
          modalShow:false,
          getURL: window.location.href.split('?')[0],
          modalHTML:function(){
              var ins = this;
              var idEC = ins.idmodal;
              return `<div class="modal fade" id="${idEC}" tabindex="-1" aria-labelledby="${idEC}Label" aria-hidden="true">
                         <div class="modal-dialog modal-fullscreen">
                            <div class="modal-content">
                              <div class="modal-header">
                                  <!--<h5 class="modal-title" id="${idEC}Label">Para realizar esta acción debes iniciar sesión</h5>-->
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> 
                              </div>
                              <form id="${ins.idform}">
                                  <div class="logo-ecuavisa-lr"> 
                                      <a href="/"> 
                                          <img src="https://www.ecuavisa.com/base-portlet/webrsrc/ctxvar/c4dfeea6-9638-4d43-b549-7eca2ab57634.png" width="95" height="52" title="Logo Ecuavisa" alt="logoecuavisa"> 
                                      </a> 
                                  </div>
                                  <div class="modal-body container">
                                      <div class="row">
                                         <div class="col-12">
                                             <label for="">iniciar sesión</label>
                                             <div class="mt-4 mb-3">
                                                <div class="row">
                                                  <div class="col-12 mb-2">
                                                    <label for="email-${idEC}" class="form-label">Dirección de correo electrónico</label>
                                                    <input type="email" maxlength="100" required class="form-control" name="email" id="email-${idEC}" placeholder="Dirección de correo electrónico">
                                                  </div>
                                                  <div class="col-12">
                                                    <label for="password-${idEC}" class="form-label">Contraseña</label>
                                                    <input type="password" maxlength="100" required class="form-control" name="password" id="password-${idEC}" placeholder="Contraseña">
                                                  </div>
                                                  <div class="col-12 mt-2 politica-privacidad-modal">
                                                      <label style="display:flex; align-items:center; margin: -4px -5px;"> 
                                                          <input type="checkbox" id="checkTerms" class="checkTerms" style="width:20px; height:20px; flex:none; margin: 0 5px;" required=""> Acepto la <a href="https://www.ecuavisa.com/servicios/politicas-de-privacidad" style="text-decoration-line: underline; flex:none; margin: 0 5px;" target="_blank">Política de Privacidad.</a> 
                                                      </label>
                                                  </div>
                                                  <div class="modal-footer">
                                                      <div class="botonesaccionlogout">
                                                          <button type="button" class="btn btn-primary font-weight-bold btn-cancelar" data-bs-dismiss="modal">Cancelar</button>
                                                          <button type="submit" id="form_btn_login_user" class="btn btn-primary btn-send-cr">Acceder</button> 
                                                      </div>
                                                  </div>

                                                  <div class="col-12 mt-2 politica-privacidad-modal">
                                                      <p class="register-class" style="font-family: 'Archivo', sans-serif; font-style: normal; font-weight: 700;"> ¿No tienes una cuenta? <a href="#" onclick="window.location = '${ECUAVISA_EC.URL_login()}?registro=true&nextpage=${ins.getURL}'">Regístrate</a> </p>
                                                  </div>
                                                </div>
                                             </div>
                                         </div>
                                      </div>
                                  </div>
                                  <div class="modal-footer">
                                      <div class="botonesaccionlogout redes-sociales">
                                          <div class="auth-method-separator"> 
                                              <span>o accede a través de</span> 
                                          </div>
                                          <div class="boton-redes-lr"> 
                                              <div class="br-google"> 
                                                  <a href="#" id="" class="facebook modal-login" onclick="">
                                                      <img class="img" src="https://play-lh.googleusercontent.com/6UgEjh8Xuts4nwdWzTnWH8QtLuHqRMUB7dp24JYVE2xcYzq4HA8hFfcAbU-R-PC_9uA1=s94-rw" alt="google" width="24" height="24" title="Icono">
                                                  </a> 
                                              </div> 
                                              <div class="br-facebook"> 
                                                  <a href="#" id="" class="facebook modal-login" onclick="">
                                                      <img class="img" src="https://estadisticas.ecuavisa.com/sites/default/files/2023-01/R.webp" alt="face" width="24" height="24" title="Icono">
                                                  </a> 
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </form>
                            </div>
                         </div>
                      </div>`;
          },
          css:function(){
              return ``;
          },
          mensajeRespuesta:function(resp, mensaje){
              var ins = this;
              if(!document.querySelector('#modal-resp')){
                  var divRespuesta = document.createElement("div");
                  divRespuesta.setAttribute(`id`, "modal-resp");
                  document.querySelector(`#${ins.idmodal} .modal-body > div`).before(divRespuesta);
              }

              var respuesta = (resp?'success':'danger');
              var modalResp = document.querySelector('#modal-resp');
              modalResp.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
              <symbol id="check-circle-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
              </symbol>
              <symbol id="info-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </symbol>
              <symbol id="exclamation-triangle-fill" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </symbol>
              </svg>
              <div class="alert alert-${respuesta} alert-dismissible fade show" role="alert">
                ${resp? `<svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill"/></svg>` : `  <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>`} ${mensaje}
                <button style="background-size: 25px !important;" type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>`;
              return true;
          },
          initComponent:function(){
              var ins = this;
              if(ins.insModal!=null){
                  ins.insModal.show();
                  return true;
              }

              var contador = 0;
              if(!window.bootstrap){
                  var scriptBoostrap = document.createElement("script");
                  scriptBoostrap.setAttribute( 'src', `https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js` );
                  document.body.appendChild(scriptBoostrap);
              }
              var existemodal = setInterval(function () {
                  if (window.bootstrap) {
                      ins.insModal = new bootstrap.Modal(document.getElementById(ins.idmodal), { keyboard: false });
                      var myModal = ins.insModal;
                      if(!ECUAVISA_EC.MODAL.login.modalShow){
                          if(!ECUAVISA_EC.login()){
                              myModal.show();
                          }
                      }
                      var modalId = document.getElementById(ins.idmodal);
                      modalId.addEventListener('show.bs.modal', function () {
                        ECUAVISA_EC.MODAL.login.modalShow = true;
                      });
                      modalId.addEventListener('hidden.bs.modal', function () {
                        ECUAVISA_EC.MODAL.login.modalShow = false;
                      });
                      clearInterval(existemodal);
                  }else{
                    contador++;
                  }
                  if(contador == 100){
                    console.log("Jquery no está definido");
                    clearInterval(existemodal);
                  }
              }, 500);
              return true;
          },
          body:function(){
              var ins = this;
              var classModal = "MODAL_FORMULARIO_USUARIO_LOGIN";
              if(!document.querySelector(`.${classModal}`)){
                  var addDivModal = document.createElement("div");
                  addDivModal.classList = classModal;
                  addDivModal.innerHTML = ins.modalHTML();
                  document.querySelector('body').appendChild(addDivModal);
                  return true;
              }
              return false;
          },
          initUserToken:function(userData, btn, btnOld, redirect){
              ECUAVISA_EC.initUserToken(userData.token, redirect)
              .then(tokenResult => {
                  btn.innerHTML = btnOld;
                  btn.removeAttribute('disabled');
                  // var urlGenerada = "https://www.ecuavisa.com/user-portlet/refreshuserentitlements?redirect=" + redirect + "&ssodata=" + userData.url;
                  
                  // window.location = urlGenerada;
                  // btn.removeAttribute('disabled');  
                  /*Login INICIO*/
                  ECUAVISA_EC.loginUser(tokenResult.email)
                  .then(loginSuccessful => {
                      window.location = tokenResult.url;
                      btn.removeAttribute('disabled'); 
                  }).catch(error => alert(error));
                  /*Login FIN*/

              }).catch(error => alert(error));
          },
          enviarData:function(btn, dataForm){
              var ins = this;
              var btnOld = btn.innerHTML;
              btn.innerHTML = "Enviado....";
              var resp = fetch("https://micuenta.ecuavisa.com/loginservice/signIn", {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams(dataForm)
              })
              .then( (response) => response.json())
              .then( (result) => {
                  document.getElementById(ins.idform).reset();
                  if (result.token) {
                      ins.initUserToken(result,btn, btnOld, dataForm.redirect);
                  } else {
                      ins.mensajeRespuesta(false, "Nombre de usuario o contraseña incorrecto");
                      btn.innerHTML = btnOld;
                      btn.removeAttribute('disabled');
                  }
                  //ins.modalInst.hide();
                return true;
              })
              .catch((error) => {
                ins.mensajeRespuesta(false, error);
              });
          },
          validateLogSocials:function() {
            let check = document.getElementById("checkTerms");
            if (check.checked == true) {
              return {
                  resp:true, msj:[
                      "https://micuenta.ecuavisa.com/loginservice/auth/google",
                      "https://micuenta.ecuavisa.com/loginservice/auth/facebook"
                  ]
              }
            } else {
              alert("Acepte los términos y condiciones para continuar");
              return {
                  resp:false
              };
            }
          },
          init:function(){
              var ins = this;
              if(!ins.body()){
                  ins.insModal.show();
                  return false;
              }
              ins.initComponent();
              setTimeout(function(){
                var btn = document.getElementById("form_btn_login_user");
                var form = document.getElementById(ins.idform);

                form.addEventListener("submit", function(e){
                  e.preventDefault();
                  if(ECUAVISA_EC.login()){
                      return false;
                  }
                  var emailIns = document.getElementById(`email-${ins.idmodal}`);
                  if(!ECUAVISA_EC.validarEmail(emailIns.value)){
                    emailIns.classList.add("is-invalid");
                    return false;
                  }
                  emailIns.classList.remove("is-invalid");

                  const myFormData = new FormData(e.target);
                  const dataArray = [...myFormData];
                  const data = Object.fromEntries(dataArray);
                  var dataForm = {};
                  const obj = data;
                  for (const [key, value] of Object.entries(obj)) {
                    dataForm[key] = value;
                  }
                  dataForm["redirect"] = ins.getURL;
                  btn.setAttribute('disabled', true);
                  //console.log(dataForm)
                  ins.enviarData(btn, dataForm);
                  return true;
                });

                /*Click para google*/
                var google = document.querySelector(".br-google .modal-login.facebook");
                google.addEventListener("click", function(e){
                  var resp = ins.validateLogSocials();
                  if(resp.resp){
                      window.location = resp.msj[0];
                  }
                });

                /*Click para facebook*/
                var facebook = document.querySelector(".br-facebook .modal-login.facebook");
                facebook.addEventListener("click", function(e){
                  var resp = ins.validateLogSocials();
                  if(resp.resp){
                      window.location = resp.msj[1];
                  }
                });
              }, 700);
          }
      }
  }
}

/***********************login.logout().then(() => {
console.log("Logout completado");
// Código adicional a ejecutar después del logout
});*****************************/
