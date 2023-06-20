let stringHtml = `
<div id="cookieNotice" class="cookie-overlay p-4" style="display: none;">
  <div class="title-wrap" style="font-weight: bold; font-size: 20px;">
      <h4><img src="https://estadisticas.ecuavisa.com/sites/gestor/Banner/cookies.svg" alt="cookies">Aviso de política de cookies</h4>
  </div>
  <div class="content-wrap">
      <div class="msg-wrap" >
          <p> Ecuavisa utiliza cookies propias y de terceros para fines analíticos anónimos, guardar las preferencias que selecciones y para el funcionamiento general de la página.
              <br><br>Puedes aceptar todas las cookies pulsando el botón "Aceptar" o configurarlas o rechazar su uso pulsando el botón "Configurar".<br>
              <!--Puedes obtener más información y volver a configurar tus preferencias en cualquier momento en la</p>
              <p style="margin-top: 10px;"><a style="color:#115cfa;" href="https://www.ecuavisa.com/servicios/politicas-de-privacidad" target="_blank">Política de cookies</a>.</p>-->

              <p style="margin-top: 10px;"><a style="color:#115cfa;" href="https://www.ecuavisa.com/servicios/politicas-de-privacidad" target="_blank">Políticas de privacidad</a></p>
              <p style="margin-top: 10px;"><a style="color:#115cfa;" href="https://www.ecuavisa.com/servicios/politica-cookies" target="_blank">Políticas de cookies</a></p>
          
          <div class="btn-wrap ">
              <button class="btn btnRechazar" id="configurar">Configurar</button>
              <button class="btn btnAceptar" id="aceptarcookies" onclick="acceptCookieConsent();">Aceptar</button>
          </div>
      </div>
  </div>
</div>

  `;
/*Se va agregar los dos modals*/
var modalCookieNotice = document.createElement("div");
modalCookieNotice.innerHTML = stringHtml;
document.body.appendChild(modalCookieNotice);

var cookieCRUD = {
  checkCookieSupport:function() {
    return navigator.cookieEnabled;
  },
  getCookie: function(name){
    var ins = this;
    if (ins.checkCookieSupport()) {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name + "=") === 0) {
          return cookie.substring(name.length + 1, cookie.length);
        }
      }
    } else {
      // console.log("El navegador no soporta cookies.");
      return ins.getLocalStorageItem(name);
    }
    return null;
  },
  createCookie:function(name, value, days) {
    var ins = this;
    if (ins.checkCookieSupport()) {
      var expires = "";
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + value + expires + "; path=/";
      console.log("Cookie creada:", name);
    } else {
      ins.createLocalStorageItem(name, value, days);
      // console.log("El navegador no soporta cookies.");
    }
  },
  updateCookie:function(name, value) {
    if (ins.checkCookieSupport()) {
      if (ins.getCookie(name) !== null) {
        ins.createCookie(name, value);
        console.log("Cookie actualizada:", name);
      } else {
        console.log("La cookie", name, "no existe.");
      }
    } else {
      console.log("El navegador no soporta cookies.");
    }
  },
  deleteCookie:function(name) {
    if (ins.checkCookieSupport()) {
      if (ins.getCookie(name) !== null) {
        ins.createCookie(name, "", -1);
        console.log("Cookie eliminada:", name);
      } else {
        console.log("La cookie", name, "no existe.");
      }
    } else {
      console.log("El navegador no soporta cookies.");
    }
  },
  checkCookie:function() {
    var ins = this;
    if (ins.checkCookieSupport()) {
      var cookie_consent = ins.getCookie("user_cookie_consent");
      if (cookie_consent !== null) {
        document.getElementById("cookieNotice").style.display = "none";
        // console.log("DISPLAY 1")
      } else {
        document.getElementById("cookieNotice").style.display = "block";
        // console.log("DISPLAY 3")
      }
    } else {
      // console.log("El navegador no soporta cookies.");
      var cookie_consent = ins.getLocalStorageItem("user_cookie_consent");
      if (cookie_consent !== null) {
        document.getElementById("cookieNotice").style.display = "none";
        // console.log("DISPLAY 1")
      } else {
        document.getElementById("cookieNotice").style.display = "block";
        // console.log("DISPLAY 3")
      }
    }
  },
  checkLocalStorageSupport:function() {
    try {
      var storage = window.localStorage;
      var testKey = "__test__";
      storage.setItem(testKey, testKey);
      storage.removeItem(testKey);
      return true;
    } catch (e) {
      return false;
    }
  },
  createLocalStorageItem:function(key, value, days) {
    var ins = this;
    if (ins.checkLocalStorageSupport()) {
      var expirationDate = null;
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expirationDate = date.toISOString();
      }
      var item = {
        value: value,
        expirationDate: expirationDate
      };
      localStorage.setItem(key, JSON.stringify(item));
      console.log("Item creado en localStorage:", key);
    } else {
      console.log("El navegador no soporta localStorage.");
    }
  },
  getLocalStorageItem:function(key) {
    var ins = this;
    if (ins.checkLocalStorageSupport()) {
      var item = localStorage.getItem(key);
      if (item) {
        item = JSON.parse(item);
        // Comprobar la fecha de expiración
        if (item.expirationDate && new Date(item.expirationDate) < new Date()) {
          // Item expirado, eliminarlo
          ins.deleteLocalStorageItem(key);
          console.log("Item expirado eliminado de localStorage:", key);
          return null;
        }
        return item.value;
      }
    } else {
      // console.log("El navegador no soporta localStorage.");
      document.getElementById("cookieNotice").classList.add("notSupportCookies");
      
      // alert("Por favor, habilita las cookies en tu navegador para utilizar este sitio.");
      return null;
    }
  },
  updateLocalStorageItem:function(key, value) {
    var ins = this;
    if (ins.checkLocalStorageSupport()) {
      var item = localStorage.getItem(key);
      if (item) {
        item = JSON.parse(item);
        // Actualizar solo el valor
        item.value = value;
        localStorage.setItem(key, JSON.stringify(item));
        console.log("Item actualizado en localStorage:", key);
      } else {
        console.log("Item no encontrado en localStorage:", key);
      }
    } else {
      console.log("El navegador no soporta localStorage.");
    }
  },
  deleteLocalStorageItem:function(key) {
    var ins = this;
    if (ins.checkLocalStorageSupport()) {
      if (ins.getLocalStorageItem(key) !== null) {
        localStorage.removeItem(key);
        console.log("Item eliminado de localStorage:", key);
      } else {
        console.log("El item", key, "no existe en localStorage.");
      }
    } else {
      console.log("El navegador no soporta localStorage.");
    }
  }
}

setTimeout(cookieCRUD.checkCookie(), 150);

// function checkCookie() {
//   let cookie_consent = getCookie("user_cookie_consent");
//   if (cookie_consent != "") {
//     document.getElementById("cookieNotice").style.display = "none";
//     console.log("DISPLAY 1")
//   } else if (localStorage.getItem("noCookiesEcuavisa")) {
//     document.getElementById("cookieNotice").style.display = "none";
//     console.log("DISPLAY 2")
//   } else {
//     document.getElementById("cookieNotice").style.display = "block";
//     console.log("DISPLAY 3")
//   }
// }

// Crear cookie
// function setCookie(cname, cvalue, exdays) {
//   const d = new Date();
//   d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
//   let expires = "expires=" + d.toUTCString();
//   document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
// }

// Borrar cookie
// function deleteCookie(cname) {
//   const d = new Date();
//   d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
//   let expires = "expires=" + d.toUTCString();
//   document.cookie = cname + "=;" + expires + ";path=/";
// }

// Leer cookie
// function getCookie(cname) {
//   let name = cname + "=";
//   let decodedCookie = decodeURIComponent(document.cookie);
//   let ca = decodedCookie.split(";");
//   for (let i = 0; i < ca.length; i++) {
//     let c = ca[i];
//     while (c.charAt(0) == " ") {
//       c = c.substring(1);
//     }
//     if (c.indexOf(name) == 0) {
//       return c.substring(name.length, c.length);
//     }
//   }
//   return "";
// }

// Set cookie consent
function acceptCookieConsent() {
  // deleteCookie("user_cookie_consent");
  cookieCRUD.createCookie("user_cookie_consent", 1, 30);
  document.getElementById("cookieNotice").style.display = "none";
}

// function declineCookieConsent() {
//   document.getElementById("cookieNotice").style.display = "none";
//   localStorage.setItem("noCookiesEcuavisa", true);
// }

var actionsCofigCookies = {
  opciones: [{
    titulo: 'Almacenar o acceder a información en un dispositivo',
    descripcion: 'Se refiere a la recopilación de información del dispositivo del usuario, como su dirección IP y configuración de idioma',
    accept: false, //true or false
    id: 1//ID único
  }, {
    titulo: 'Seleccionar anuncios básicos',
    descripcion: 'Se refiere a la selección de anuncios genéricos que se basan en la temática del sitio web o en la ubicación geográfica del usuario.',
    accept: false,
    id: 2
  }, {
    titulo: 'Seleccionar anuncios personalizados',
    descripcion: 'Se refiere a la selección de anuncios que se basan en la actividad del usuario en el sitio web o en otros sitios web que ha visitado.',
    accept: false,
    id: 3
  }],
  existeItem: function () {
    var lista = this.opciones;
    for (var i in lista) {
      if (lista[i].accept) {
        return true;
      }
    }
    return false;
  },
  buscarItem: function (id) {
    var lista = this.opciones;
    var item = lista.find(({ id }) => id === id);
    return item || [];
  },
  editarItem: function (id, index, value) {
    for (var i in this.opciones) {
      var ins = this.opciones[i];
      if (ins.id == id) {
        this.opciones[i][index] = value;
        return true;
      }
    }
    return false;
  },
  editarItems: function (index, value) {
    for (var i in this.opciones) {
      this.opciones[i][index] = value;
    }
    if (localStorage.getItem("dataAcceptCookiesEcuavisa")) {
      localStorage.setItem(
        "dataAcceptCookiesEcuavisa",
        JSON.stringify(this.opciones)
      );
    }
    this.listItems();
    return true;
  },
  editarItemsIndex: function (index, value, id) {
    for (var i in this.opciones) {
      this.opciones[i][index] = false;
    }

    this.opciones[id][index] = value;
    if (localStorage.getItem('dataAcceptCookiesEcuavisa')) {
      localStorage.setItem('dataAcceptCookiesEcuavisa', JSON.stringify(this.opciones));
    }
    this.listItems();
    return true;
  },
  guardarItems: function () {
    var lista = this.opciones;
    localStorage.setItem("dataAcceptCookiesEcuavisa", JSON.stringify(lista));
    return true;
  },
  HTMLConfig: function (data) {
    return `<div class="modal-ecuavisa hidden-modal" id="modal-ec">
      <div class="fondo-modal">
          <div class="exterior-modal">
              <div class="container-modal">
                  <div class="preferences-modal">
                      <div class="header-modal">
                          <div class="title-text">
                              Configuración de cookies
                          </div>
                          <button type="button" id="btn-cerrar">Cerrar</button>
                      </div>
                      <div class="body-modal">
                          <div class="descripccion-modal">
                              Al pulsar "Guardar y cerrar" se guardará la selección de cookies que hayas realizado. Si pulsas sobre "Aceptar todo" aceptarás todas las cookies. 
                              Si pulsas sobre "Rechazar todo" rechazarás todas las cookies no esenciales. 
                              La aceptación de algunos grupos de cookies se realiza mediante algunas acciones explicitas que vienen detalladas debajo.

                          </div>
                          <div class="table-panel-items" id="items-modal">
                              
                          </div>
                      </div>
                      <div class="footer-modal">
                          <div class="block_btn_re_acep p-0 m-0">
                              <button class="btn btnRechazar" id="rechazar_todo">Rechazar todo</button>
                              <button class="btn btnAceptar" id="aceptar-todos">Aceptar todo</button>
                          </div>
                          <button class="btn btnAceptar disabled" style="display:none" id="aceptar-modal">Guardar y cerrar</button>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>`;
  },
  optionsHTML: function (data) {
    return `<div class="content-items" option-id="3">
    <div class="title-panel">
        <div>
            ${data.titulo}
            <small>
                ${data.descripcion}
            </small>
        </div>
    </div>
    <div class="check-panel" actions="list-options">
        <input type="checkbox" class="option-check" ${(data.accept ? 'checked' : '')} id="switch-${data.id}" data-json='{"id":${data.id},"accept":${data.accept}}'/>
        <label for="switch-${data.id}">Toggle</label>
    </div>
</div>`;
  },
  listItems: function () {
    var itemsContent = document.getElementById("items-modal");
    itemsContent.innerHTML = "";

    var lista =
      JSON.parse(localStorage.getItem("dataAcceptCookiesEcuavisa")) ||
      this.opciones;
    this.opciones = lista;
    var html = "";
    for (var i in lista) {
      var ins = lista[i];
      html += this.optionsHTML(ins);
    }
    itemsContent.innerHTML += html;
  },
  init: function () {
    modalCookieNotice.innerHTML += this.HTMLConfig();
    this.listItems();

    document
      .getElementById("btn-cerrar")
      .addEventListener("click", function () {
        var modal = document.getElementById("modal-ec");
        if (!modal.classList.contains("hidden-modal")) {
          modal.classList.add("hidden-modal");
        }
      });
    document.getElementById("configurar").addEventListener("click", function () {
      var modal = document.getElementById("modal-ec");
      if (modal.classList.contains("hidden-modal")) {
        modal.classList.remove("hidden-modal");
      }
      if (actionsCofigCookies.existeItem()) {
        document.querySelector(".block_btn_re_acep").style.display = "none";

        document.querySelector("#aceptar-modal").style.display = "block";
        document.querySelector("#aceptar-modal").classList.remove("disabled");
      } else {
        document.querySelector(".block_btn_re_acep").style.display = "flex";

        document.querySelector("#aceptar-modal").style.display = "none";
        document.querySelector("#aceptar-modal").classList.add("disabled");
      }
    });
    document.getElementById("aceptar-todos").addEventListener("click", function () {
      actionsCofigCookies.editarItems('accept', true);
      document.querySelector("#aceptar-modal").classList.remove("disabled");

      var modal = document.getElementById("modal-ec");
      modal.classList.add("hidden-modal");
      /*Guarda los items a localstorage*/
      actionsCofigCookies.guardarItems();
      /*Guarda las cookies*/
      acceptCookieConsent();
    });
    document.getElementById("aceptarcookies").addEventListener("click", function () {
      actionsCofigCookies.editarItems("accept", true);
      /*Guarda los items a localstorage*/
      actionsCofigCookies.guardarItems();
    });

    document.getElementById("rechazar_todo").addEventListener("click", function () {
      actionsCofigCookies.editarItemsIndex('accept', true, 0);
      document.querySelector("#aceptar-modal").classList.remove("disabled");

      var modal = document.getElementById("modal-ec");
      modal.classList.add("hidden-modal");
      /*Guarda los items a localstorage*/
      actionsCofigCookies.guardarItems();
      /*Guarda las cookies*/
      acceptCookieConsent();
    });

    document
      .getElementById("aceptar-modal")
      .addEventListener("click", function () {
        var modal = document.getElementById("modal-ec");
        modal.classList.add("hidden-modal");
        /*Guarda los items a localstorage*/
        actionsCofigCookies.guardarItems();
        /*Guarda las cookies*/
        acceptCookieConsent();
      });
    document.querySelector(".table-panel-items").addEventListener("click", function (event) {
      setTimeout(() => {
        if (event.target.matches('.option-check')) {
          var data = JSON.parse(event.target.getAttribute('data-json'));
          var accept = false;
          if (!data.accept) {
            accept = true;
          }
          data.accept = accept;
          event.target.setAttribute("data-json", JSON.stringify(data));
          actionsCofigCookies.editarItem(data.id, 'accept', accept);

          if (actionsCofigCookies.existeItem()) {
            document.querySelector(".block_btn_re_acep").style.display = "none";

            document.querySelector("#aceptar-modal").style.display = "block";
            document.querySelector("#aceptar-modal").classList.remove("disabled");
          } else {
            document.querySelector("#aceptar-modal").classList.add("disabled");

            document.querySelector("#aceptar-modal").style.display = "none";
            document.querySelector(".block_btn_re_acep").style.display = "flex";
          }
        }
      }, 0);
    });
    return true;
  },
};

actionsCofigCookies.init();