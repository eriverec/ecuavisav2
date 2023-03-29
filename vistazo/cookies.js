let stringHtml = `
    <div id="cookieNotice" class="cookie-overlay p-4" style="display: block;">
          <div class="title-wrap" style="font-weight: bold; font-size: 20px;">
              <h4><img src="https://estadisticas.ecuavisa.com/sites/gestor/Banner/cookies.svg" alt="cookies">Aviso de política de cookies</h4>
          </div>
          <div class="content-wrap">
              <div class="msg-wrap" >
                  <p> Vistazo utiliza cookies propias y de terceros para fines analíticos anónimos, guardar las preferencias que selecciones y para el funcionamiento general de la página. Encontrará información más detallada en nuestra <a href="https://www.ecuavisa.com/servicios/politica-cookies" class="text-primary">Política de Cookies</a>.
                      <br><br>Puedes aceptar todas las cookies pulsando el botón "Aceptar" o configurarlas o rechazar su uso pulsando el botón "Configurar".<br>
                      <!--Puedes obtener más información y volver a configurar tus preferencias en cualquier momento en la</p>
                      <p style="margin-top: 10px;"><a style="color:#115cfa;" href="https://www.ecuavisa.com/servicios/politicas-de-privacidad" target="_blank">Política de cookies</a>.</p>-->
                  
                  <div class="btn-wrap ">
                      <button class="btnRechazar" id="configurar">Configurar</button>
                      <button class="btnAceptar" id="aceptarcookies" onclick="acceptCookieConsent();">Aceptar</button>
                  </div>
              </div>
          </div>
      </div>
  `;
  /*Se va agregar los dos modals*/
  var modalCookieNotice = document.createElement("div");
  modalCookieNotice.innerHTML = stringHtml;
  document.body.appendChild(modalCookieNotice);

  setTimeout(checkCookie(), 150);

  function checkCookie() {
    let cookie_consent = getCookie("user_cookie_consent");
    if (cookie_consent != "") {
      document.getElementById("cookieNotice").style.display = "none";
    } else if (localStorage.getItem("noCookiesVistazo")) {
      document.getElementById("cookieNotice").style.display = "none";
    } else {
      document.getElementById("cookieNotice").style.display = "block";
    }
  }

  // Crear cookie
  function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  // Borrar cookie
  function deleteCookie(cname) {
    const d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=;" + expires + ";path=/";
  }

  // Leer cookie
  function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  // Set cookie consent
  function acceptCookieConsent() {
    deleteCookie("user_cookie_consent");
    setCookie("user_cookie_consent", 1, 30);
    document.getElementById("cookieNotice").style.display = "none";
  }

  function declineCookieConsent() {
    document.getElementById("cookieNotice").style.display = "none";
    localStorage.setItem("noCookiesVistazo", true);
  }

  var actionsCofigCookies = {
    opciones: [
      {
        titulo: "Almacenar o acceder a información en un dispositivo",
        accept: false, //true or false
        id: 1, //ID único
      },
      {
        titulo: "Seleccionar anuncios básicos",
        accept: false,
        id: 2,
      },
      {
        titulo: "Seleccionar anuncios personalizados",
        accept: false,
        id: 3,
      },
    ],
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
      if (localStorage.getItem("dataAcceptCookiesVistazo")) {
        localStorage.setItem(
          "dataAcceptCookiesVistazo",
          JSON.stringify(this.opciones)
        );
      }
      this.listItems();
      return true;
    },
    guardarItems: function () {
      var lista = this.opciones;
      localStorage.setItem("dataAcceptCookiesVistazo", JSON.stringify(lista));
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
                                              Al pulsar "Guardar y cerrar" se guardará la selección de cookies que hayas realizado. Si pulsas sobre "Aceptar todas y cerrar" aceptarás todas las cookies. 
                                              Si pulsas sobre "Rechazar todas y cerrar" rechazarás todas las cookies no esenciales. 
                                              La aceptación de algunos grupos de cookies se realiza mediante algunas acciones explicitas que vienen detalladas debajo.
                                          </div>
                                          <div class="table-panel-items" id="items-modal">
                                              
                                          </div>
                                      </div>
                                      <div class="footer-modal">
                                          <!--<button class="btnRechazar">Rechazar todas y cerrar</button>-->
                                          <button class="btnRechazar" id="aceptar-todos">Aceptar todas y cerrar</button>
                                          <button class="btnAceptar disabled" id="aceptar-modal">Guardar y cerrar</button>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>`;
    },
    optionsHTML: function (data) {
      return `<div class="content-items" option-id="3">
                      <div class="title-panel">${data.titulo}</div>
                      <div class="check-panel" actions="list-options">
                          <input type="checkbox" class="option-check" ${
                            data.accept ? "checked" : ""
                          } id="switch-${data.id}" data-json='{"id":${
        data.id
      },"accept":${data.accept}}'/>
                          <label for="switch-${data.id}">Toggle</label>
                      </div>
                  </div>`;
    },
    listItems: function () {
      var itemsContent = document.getElementById("items-modal");
      itemsContent.innerHTML = "";

      var lista =
        JSON.parse(localStorage.getItem("dataAcceptCookiesVistazo")) ||
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
      document
        .getElementById("configurar")
        .addEventListener("click", function () {
          var modal = document.getElementById("modal-ec");
          if (modal.classList.contains("hidden-modal")) {
            modal.classList.remove("hidden-modal");
          }
          if (actionsCofigCookies.existeItem()) {
            document
              .querySelector("#aceptar-modal")
              .classList.remove("disabled");
          } else {
            document.querySelector("#aceptar-modal").classList.add("disabled");
          }
        });
      document
        .getElementById("aceptar-todos")
        .addEventListener("click", function () {
          actionsCofigCookies.editarItems("accept", true);
          document.querySelector("#aceptar-modal").classList.remove("disabled");
        });
      document
        .getElementById("aceptarcookies")
        .addEventListener("click", function () {
          actionsCofigCookies.editarItems("accept", true);
          /*Guarda los items a localstorage*/
          actionsCofigCookies.guardarItems();
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
      document
        .querySelector(".table-panel-items")
        .addEventListener("click", function (event) {
          setTimeout(() => {
            if (event.target.matches(".option-check")) {
              var data = JSON.parse(event.target.getAttribute("data-json"));
              var accept = false;
              if (!data.accept) {
                accept = true;
              }
              data.accept = accept;
              event.target.setAttribute("data-json", JSON.stringify(data));
              actionsCofigCookies.editarItem(data.id, "accept", accept);

              if (actionsCofigCookies.existeItem()) {
                document
                  .querySelector("#aceptar-modal")
                  .classList.remove("disabled");
              } else {
                document
                  .querySelector("#aceptar-modal")
                  .classList.add("disabled");
              }
            }
          }, 0);
        });
      return true;
    },
  };

  actionsCofigCookies.init();