let stringHtml=`
<div id="cookieNotice" class="cookie-overlay p-4" style="display: none;">
  <div class="title-wrap" style="font-weight: bold; font-size: 20px;">
      <div><img width="24px" height="24px" src="https://estadisticas.ecuavisa.com/sites/gestor/Banner/cookies.svg" alt="cookies">Aviso de política de cookies</div>
  </div>
  <div class="content-wrap">
      <div class="msg-wrap" >
          <p> Ecuavisa utiliza cookies propias y de terceros para fines analíticos anónimos, guardar las preferencias que selecciones y para el funcionamiento general de la página.
              <br><br>Puedes aceptar todas las cookies pulsando el botón "Aceptar" o configurarlas o rechazar su uso pulsando el botón "Configurar".<br>
              <!--Puedes obtener más información y volver a configurar tus preferencias en cualquier momento en la</p>
              <p style="margin-top: 10px;"><a style="color:#115cfa;" href="https://www.ecuavisa.com/servicios/politicas-de-privacidad" target="_blank">Política de cookies</a>.</p>-->

              <p style="margin-top: 10px;"><a style="color:#115cfa;" href="https://www.ecuavisa.com/servicios/politicas-de-privacidad" target="_blank">Política de privacidad</a></p>
              <p style="margin-top: 10px;"><a style="color:#115cfa;" href="https://www.ecuavisa.com/servicios/politica-cookies" target="_blank">Políticas de cookies</a></p>
          
          <div class="btn-wrap ">
              <button class="btn btnRechazar" id="configurar">Configurar</button>
              <button class="btn btnAceptar" id="aceptarcookies" onclick="acceptCookieConsent();">Aceptar</button>
          </div>
      </div>
  </div>
</div>

  `;var modalCookieNotice=document.createElement("div"),cookieCRUD=(modalCookieNotice.innerHTML=stringHtml,document.body.appendChild(modalCookieNotice),{checkCookieSupport:function(){return navigator.cookieEnabled},getCookie:function(e){if(!this.checkCookieSupport())return this.getLocalStorageItem(e);for(var o=document.cookie.split(";"),t=0;t<o.length;t++){var a=o[t].trim();if(0===a.indexOf(e+"="))return a.substring(e.length+1,a.length)}return null},createCookie:function(e,o,t){var a,i;this.checkCookieSupport()?(a="",t&&((i=new Date).setTime(i.getTime()+24*t*60*60*1e3),a="; expires="+i.toUTCString()),document.cookie=e+"="+o+a+"; path=/",console.log("Cookie creada:",e)):this.createLocalStorageItem(e,o,t)},updateCookie:function(e,o){var t=this;t.checkCookieSupport()?null!==t.getCookie(e)?(t.createCookie(e,o),console.log("Cookie actualizada:",e)):console.log("La cookie",e,"no existe."):console.log("El navegador no soporta cookies.")},deleteCookie:function(e){var o=this;o.checkCookieSupport()?null!==o.getCookie(e)?(o.createCookie(e,"",-1),console.log("Cookie eliminada:",e)):console.log("La cookie",e,"no existe."):console.log("El navegador no soporta cookies.")},checkCookie:function(){var e=this;e=e.checkCookieSupport()?e.getCookie("user_cookie_consent"):e.getLocalStorageItem("user_cookie_consent"),document.getElementById("cookieNotice").style.display=null!==e?"none":"block"},checkLocalStorageSupport:function(){try{var e=window.localStorage,o="__test__";return e.setItem(o,o),e.removeItem(o),!0}catch(e){return!1}},createLocalStorageItem:function(e,o,t){var a,i;this.checkLocalStorageSupport()?(a=null,t&&((i=new Date).setTime(i.getTime()+24*t*60*60*1e3),a=i.toISOString()),localStorage.setItem(e,JSON.stringify({value:o,expirationDate:a})),console.log("Item creado en localStorage:",e)):console.log("El navegador no soporta localStorage.")},getLocalStorageItem:function(e){var o;return this.checkLocalStorageSupport()?(o=localStorage.getItem(e))?(o=JSON.parse(o)).expirationDate&&new Date(o.expirationDate)<new Date?(this.deleteLocalStorageItem(e),console.log("Item expirado eliminado de localStorage:",e),null):o.value:void 0:(document.getElementById("cookieNotice").classList.add("notSupportCookies"),null)},updateLocalStorageItem:function(e,o){var t;this.checkLocalStorageSupport()?(t=localStorage.getItem(e))?((t=JSON.parse(t)).value=o,localStorage.setItem(e,JSON.stringify(t)),console.log("Item actualizado en localStorage:",e)):console.log("Item no encontrado en localStorage:",e):console.log("El navegador no soporta localStorage.")},deleteLocalStorageItem:function(e){this.checkLocalStorageSupport()?null!==this.getLocalStorageItem(e)?(localStorage.removeItem(e),console.log("Item eliminado de localStorage:",e)):console.log("El item",e,"no existe en localStorage."):console.log("El navegador no soporta localStorage.")}});function acceptCookieConsent(){cookieCRUD.createCookie("user_cookie_consent",1,30),document.getElementById("cookieNotice").style.display="none"}0==document.querySelectorAll(".webkit.ltr").length&&setTimeout(cookieCRUD.checkCookie(),150);var actionsCofigCookies={opciones:[{titulo:"Almacenar o acceder a información en un dispositivo",descripcion:"Se refiere a la recopilación de información del dispositivo del usuario, como su dirección IP y configuración de idioma",accept:!1,id:1},{titulo:"Seleccionar anuncios básicos",descripcion:"Se refiere a la selección de anuncios genéricos que se basan en la temática del sitio web o en la ubicación geográfica del usuario.",accept:!1,id:2},{titulo:"Seleccionar anuncios personalizados",descripcion:"Se refiere a la selección de anuncios que se basan en la actividad del usuario en el sitio web o en otros sitios web que ha visitado.",accept:!1,id:3}],existeItem:function(){var e,o=this.opciones;for(e in o)if(o[e].accept)return!0;return!1},buscarItem:function(e){return this.opciones.find(({id:e})=>e==e)||[]},editarItem:function(e,o,t){for(var a in this.opciones)if(this.opciones[a].id==e)return this.opciones[a][o]=t,!0;return!1},editarItems:function(e,o){for(var t in this.opciones)this.opciones[t][e]=o;return localStorage.getItem("dataAcceptCookiesEcuavisa")&&localStorage.setItem("dataAcceptCookiesEcuavisa",JSON.stringify(this.opciones)),this.listItems(),!0},editarItemsIndex:function(e,o,t){for(var a in this.opciones)this.opciones[a][e]=!1;return this.opciones[t][e]=o,localStorage.getItem("dataAcceptCookiesEcuavisa")&&localStorage.setItem("dataAcceptCookiesEcuavisa",JSON.stringify(this.opciones)),this.listItems(),!0},guardarItems:function(){var e=this.opciones;return localStorage.setItem("dataAcceptCookiesEcuavisa",JSON.stringify(e)),!0},HTMLConfig:function(e){return`<div class="modal-ecuavisa hidden-modal" id="modal-ec">
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
  </div>`},optionsHTML:function(e){return`<div class="content-items" option-id="3">
    <div class="title-panel">
        <div>
            ${e.titulo}
            <small>
                ${e.descripcion}
            </small>
        </div>
    </div>
    <div class="check-panel" actions="list-options">
        <input type="checkbox" class="option-check" ${e.accept?"checked":""} id="switch-${e.id}" data-json='{"id":${e.id},"accept":${e.accept}}'/>
        <label for="switch-${e.id}">Toggle</label>
    </div>
</div>`},listItems:function(){var e,o=document.getElementById("items-modal"),t=(o.innerHTML="",JSON.parse(localStorage.getItem("dataAcceptCookiesEcuavisa"))||this.opciones),a="";for(e in this.opciones=t){var i=t[e];a+=this.optionsHTML(i)}o.innerHTML+=a},init:function(){return modalCookieNotice.innerHTML+=this.HTMLConfig(),this.listItems(),document.getElementById("btn-cerrar").addEventListener("click",function(){var e=document.getElementById("modal-ec");e.classList.contains("hidden-modal")||e.classList.add("hidden-modal")}),document.getElementById("configurar").addEventListener("click",function(){var e=document.getElementById("modal-ec");e.classList.contains("hidden-modal")&&e.classList.remove("hidden-modal"),actionsCofigCookies.existeItem()?(document.querySelector(".block_btn_re_acep").style.display="none",document.querySelector("#aceptar-modal").style.display="block",document.querySelector("#aceptar-modal").classList.remove("disabled")):(document.querySelector(".block_btn_re_acep").style.display="flex",document.querySelector("#aceptar-modal").style.display="none",document.querySelector("#aceptar-modal").classList.add("disabled"))}),document.getElementById("aceptar-todos").addEventListener("click",function(){actionsCofigCookies.editarItems("accept",!0),document.querySelector("#aceptar-modal").classList.remove("disabled"),document.getElementById("modal-ec").classList.add("hidden-modal"),actionsCofigCookies.guardarItems(),acceptCookieConsent()}),document.getElementById("aceptarcookies").addEventListener("click",function(){actionsCofigCookies.editarItems("accept",!0),actionsCofigCookies.guardarItems()}),document.getElementById("rechazar_todo").addEventListener("click",function(){actionsCofigCookies.editarItemsIndex("accept",!0,0),document.querySelector("#aceptar-modal").classList.remove("disabled"),document.getElementById("modal-ec").classList.add("hidden-modal"),actionsCofigCookies.guardarItems(),acceptCookieConsent()}),document.getElementById("aceptar-modal").addEventListener("click",function(){document.getElementById("modal-ec").classList.add("hidden-modal"),actionsCofigCookies.guardarItems(),acceptCookieConsent()}),document.querySelector(".table-panel-items").addEventListener("click",function(t){setTimeout(()=>{var e,o;t.target.matches(".option-check")&&(o=!1,(e=JSON.parse(t.target.getAttribute("data-json"))).accept||(o=!0),e.accept=o,t.target.setAttribute("data-json",JSON.stringify(e)),actionsCofigCookies.editarItem(e.id,"accept",o),actionsCofigCookies.existeItem()?(document.querySelector(".block_btn_re_acep").style.display="none",document.querySelector("#aceptar-modal").style.display="block",document.querySelector("#aceptar-modal").classList.remove("disabled")):(document.querySelector("#aceptar-modal").classList.add("disabled"),document.querySelector("#aceptar-modal").style.display="none",document.querySelector(".block_btn_re_acep").style.display="flex"))},0)}),!0}};actionsCofigCookies.init();