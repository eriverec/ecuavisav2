/*******************************************************************
  @VARIABLES GLOBALES ECUAVISA_EC: REVISAR ARCHIVO main_ecuavisa.js
*******************************************************************/

/*******ESCUECHAR EVENTO DESDE GLOBAL A MI PERFIL - end-event-rdMiperfil-temas******/
document.addEventListener("end-event-rdMiperfil-temas", function(e) {
  //console.log(e.detail); // Prints "Example of an event"
});
/*******FIN ESCUCHAR EVENTO DESDE GLOBAL A MI PERFIL - end-event-rdMiperfil-temas******/
logoutBtn = document.querySelector('.button_cerrar_sesion a');
logoutBtn.addEventListener("click", function () {
  localStorage.clear();
  window.location.href = ECUAVISA_EC.URL_login();;
});

var URL_principal_G = ECUAVISA_EC.URL_principal();
var URL_login_G = ECUAVISA_EC.URL_login();

// if(!ECUAVISA_EC.login()){
  /*SI NO ESTÁ INICIADO SESIÓN MANDA LA FUNCIÓN DE TOKEN()*/
  // Token();
// }

//NUEVO MODAL 2023

//declaramos el valor de la trivia primeramente
localStorage.setItem("trivia1","false");

const getTriviaone =  localStorage.getItem("trivia1");

//redirigir y cambiar el valor del localstorage 
function pathPage() {
  localStorage.setItem("trivia1", "false"); // cambia el valor del LocalStorage
  window.location.href = "https://www.ecuavisa.com/compania593/click-boom/la-emocionante-transformacion-de-mare-cevallos-a-victoria-en-compania-593-DF4986489"; // redirige a otra página web
}

//funcion para mostrar el modal 
function modalHTML() {

  var tituloModal = document.querySelector("#modal_parent #modal_parent_titulo");
  var textModal = document.querySelector("#modal_parent #modaparent_l_body");

  textModal.innerHTML = `
  <div class="contenido-modal">
    <p class="parrafo-modal"> Gracias por ser parte de la comunidad de Ecuavisa. !Te invitamos a participar!</p>
  </div>
  <div class="text-center">
    <button onclick="pathPage();" class="btn btn-default btn-sm btn-modal-seguir"style="background-color: #2927b9;color: #ffffff">Haz clic aquí</button>
  </div>
  `

  tituloModal.textContent = "Bienvenido"

  console.log("mostrar el modal");
  $('#modal_parent').modal('show');
}

//validacion 
getTriviaone === "true" ?  modalHTML() : console.log("no mostrar el modal");

async function Token(){
  
    
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var myHeaders = new Headers();
  const tk = urlParams.get('tk')
  myHeaders.append("Authorization", "JWT "+tk);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };
  //servicio Luis
  await fetch(`${ECUAVISA_EC.api.loginService}tasks`, requestOptions)
    .then(response => response.json())
    .then (async (result) => {
      if(result.message!='Usuario No Autorizado'){
        localStorage.wylexUserAlertView    = true;
        localStorage.wylexUserId    = result.userId;
        localStorage.wylexFirstName = result.first_name;
        localStorage.wylexLastName  = result.last_name;
        localStorage.wylexEmail     = result.email;
        localStorage.wylexStatusPerfil  =result.user_new;

        /*Añade el ícono de perfil si no existe con el || CR https://estadisticas.ecuavisa.com/sites/gestor/Recursos/usuario.png*/
        localStorage.wylexAvatar=result.avatar  || 'https://estadisticas.ecuavisa.com/sites/gestor/Recursos/user-perfil.png'
        /*if(result.avatar){
          localStorage.wylexAvatar=result.avatar;
        }*/

        window.location = ECUAVISA_EC.URL_perfil();
      
    //   let email = result.email;
    //   let pass = result.password;
    //   let _id = result._id;
    //   await fetch("https://micuenta.ecuavisa.com/loginservice/encrypt", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    //   body: new URLSearchParams({
    //     email: email,
    //     password: pass,
    //     _id: _id
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then(async (result) => {
    //     console.log(result);
       
    //      let redirect = "https://www.ecuavisa.com/servicios/perfil";
    //       console.log("url","https://www.ecuavisa.com/user-portlet/refreshuserentitlements?redirect=" + redirect + "&ssodata=" + result.url);
    //     window.location = "https://www.ecuavisa.com/user-portlet/refreshuserentitlements?redirect=" + redirect + "&ssodata=" + result.url;
          
    //   })
    //   .catch((error) => {
    //     console.log("error", error); /*; window.location = URL_login_G*/
    //   });


      }
      //     var UserId = localStorage.getItem('wylexUserId'); //variable de id de usuario
      // if (!UserId){
      //     /*Si no existe sesión lo 
      //     va a redireccionar al login */
      //     window.location = URL_login_G;
      // }
    })
    .catch(error => {
      console.log('error', error); 
      window.location = URL_login_G // comentar para modificar el modelo web
    });
}

    var urlParamsGET = new URLSearchParams(window.location.search);
    if (!ECUAVISA_EC.login() && urlParamsGET.get('tk')==null){
        /*Si no existe sesión lo 
        va a redireccionar al login */
        window.location = URL_login_G; // comentar para modificar el modelo web
    }

    function collapse() {
      var coll = document.getElementsByClassName("collapsible_mp");
      var i;
    
      for (i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
          this.classList.toggle("active_mp");
          var content = this.nextElementSibling;
          if (content.style.maxHeight) {
            content.style.maxHeight = null;
          } else {
            //content.style.maxHeight = content.scrollHeight + "px";
            content.style.maxHeight = "200em";
          }
        });
      }
    }
    
    function DataEntrada() {
      /***********ECUAVISA_EC.USER_data(): OBTIENE LA DATA DEL USUARIO DEL LOCALSTORAGE - main_ecuavisa.js*************/
      var dataUser = ECUAVISA_EC.USER_data();
      /***********ECUAVISA_EC.USER_data(): OBTIENE LA DATA DEL USUARIO DEL LOCALSTORAGE - main_ecuavisa.js*************/
      
      const getFirstName = dataUser.name;
      var firstNameUpperCase = getFirstName.charAt(0).toUpperCase() + getFirstName.slice(1);
      var getAvatar = dataUser.avatar;
      var selectImg = document.querySelector('.imgAvatar');
      selectImg.innerHTML = `<img width="512px" height="512px" src="${getAvatar}" alt="${getFirstName}">`;
      //Pintar el primer nombre del usuario
      var selectName = document.querySelector('.infoName');
      selectName.innerHTML = `Hola, ${firstNameUpperCase}`;
    }
    
    function DatosPersonales() {
      /***********ECUAVISA_EC.USER_data(): OBTIENE LA DATA DEL USUARIO DEL LOCALSTORAGE - main_ecuavisa.js*************/
      var dataUser = ECUAVISA_EC.USER_data();
      /***********ECUAVISA_EC.USER_data(): OBTIENE LA DATA DEL USUARIO DEL LOCALSTORAGE - main_ecuavisa.js*************/

      const getFirstName = dataUser.name;
      const getLastName = dataUser.lastname;
      const getEmail = dataUser.email;
    
      var firstNameUpperCase = getFirstName.charAt(0).toUpperCase() + getFirstName.slice(1);
      var lastNameUpperCase = getLastName.charAt(0).toUpperCase() + getLastName.slice(1);
    
      var nombreApellido = `${firstNameUpperCase} ${lastNameUpperCase}`;
    
      var selectValue = document.querySelector('.outsidetName .insideValue');
      selectValue.innerHTML = `${nombreApellido}`;
    
      var selectValueEmail = document.querySelector('.outsideEmail .insideValue');
      var emailcorreo = getEmail;
      selectValueEmail.innerHTML = `${emailcorreo}`;
    }
    
    function swiperNotificaciones() {
      var classListaNotification = document.querySelector('.notificationBox');
      var classListaNotificationNot = document.querySelector('.notificationBox .noticias');
      var classListaNotificationNotArt = document.querySelectorAll('.notificationBox .noticias .article');
    
      classListaNotification.classList.add('swiper');
      classListaNotificationNot.classList.add('swiper-wrapper');
    
      for (const swiperSlideNotification of classListaNotificationNotArt) {
        swiperSlideNotification.classList.add('swiper-slide');
      }
    
      var dpagination = document.createElement("div");
      dpagination.classList = "swiper-pagination";
      classListaNotification.append(dpagination);
    
      var swiperNoti = new Swiper(".notificationBox", {
        slidesPerView: 1,
        spaceBetween: 20,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true
        },
        breakpoints: {
          600: {
            slidesPerView: 1,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
        },
      });
    }
    
    function eyesPass() {
      /*Verifica si es un usuario por primera, vez que no sabe donde está su contraseña generada*/
      var esNuevo = ECUAVISA_EC.USER_data('isnewuser') == '0';
      var etiquetaAviso = `<label class="col-form-label text-danger" style="font-size:12px">Si eres nuevo usuario, tu contraseña fue enviada a tu correo, revisa tu bandeja de entrada.</label>`;

      $("input[type='password'][data-eye]").each(function (i) {
        var $this = $(this),
          id = 'eye-password-' + i,
          el = $('#' + id);
    
        $this.wrap($("<div/>", {
          style: 'position:relative',
          id: id
        }));
    
        $this.after($("<p/>", {
          html: 'Las constraseñas no coinciden',
          id: `error-${i}`,
          class: 'text-danger error d-none'
        }));
    
        $this.css({
          paddingRight: 60
        });
        $this.after($("<div/>", {
          html: '<svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.1445 6.962C20.6185 7.582 20.6185 8.419 20.1445 9.038C18.6515 10.987 15.0695 15 10.8875 15C6.70546 15 3.12346 10.987 1.63046 9.038C1.39985 8.74113 1.27466 8.37592 1.27466 8C1.27466 7.62408 1.39985 7.25887 1.63046 6.962C3.12346 5.013 6.70546 1 10.8875 1C15.0695 1 18.6515 5.013 20.1445 6.962V6.962Z" stroke="#2927B9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.8875 11C12.5443 11 13.8875 9.65685 13.8875 8C13.8875 6.34315 12.5443 5 10.8875 5C9.2306 5 7.88745 6.34315 7.88745 8C7.88745 9.65685 9.2306 11 10.8875 11Z" stroke="#2927B9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
          class: 'btn btn-default btn-sm btn-eyes',
          id: 'passeye-toggle-' + i,
        }).css({
          position: 'absolute',
          right: 10,
          //top: ($this.outerHeight() / 2) + 3,
          //padding: '2px 7px',
          //fontSize: 12,
          cursor: 'pointer',
        }));
    
        $this.after($("<input/>", {
          type: 'hidden',
          id: 'passeye-' + i
        }));
    
        var invalid_feedback = $this.parent().parent().find('.invalid-feedback');
    
        if (invalid_feedback.length) {
          $this.after(invalid_feedback.clone());
        }
    
        $this.on("keyup paste", function () {
          $("#passeye-" + i).val($(this).val());
        });
        $("#passeye-toggle-" + i).on("click", function () {
          if ($this.hasClass("show")) {
            $this.attr('type', 'password');
            $this.removeClass("show");
            $(this).html(`<svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20.1445 6.962C20.6185 7.582 20.6185 8.419 20.1445 9.038C18.6515 10.987 15.0695 15 10.8875 15C6.70546 15 3.12346 10.987 1.63046 9.038C1.39985 8.74113 1.27466 8.37592 1.27466 8C1.27466 7.62408 1.39985 7.25887 1.63046 6.962C3.12346 5.013 6.70546 1 10.8875 1C15.0695 1 18.6515 5.013 20.1445 6.962V6.962Z" stroke="#2927B9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M10.8875 11C12.5443 11 13.8875 9.65685 13.8875 8C13.8875 6.34315 12.5443 5 10.8875 5C9.2306 5 7.88745 6.34315 7.88745 8C7.88745 9.65685 9.2306 11 10.8875 11Z" stroke="#2927B9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
            
            // $(this).addClass("btn-primary");
          } else {
            //$this.val($("#passeye-"+i).val());  
            $this.attr('type', 'text');
            $this.addClass("show");
            $(this).html(`<svg width="22" height="18" viewBox="0 0 22 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.2601 14.129C4.4151 12.819 2.9551 11.115 2.1301 10.039C1.8994 9.74198 1.77417 9.37659 1.77417 9.0005C1.77417 8.62441 1.8994 8.25902 2.1301 7.962C3.6231 6.013 7.2051 2 11.3871 2C13.2631 2 15.0171 2.807 16.5171 3.874" stroke="#2927B9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13.0175 6.887C12.7397 6.60467 12.4089 6.38011 12.044 6.22629C11.679 6.07246 11.2873 5.99241 10.8912 5.99075C10.4952 5.98909 10.1028 6.06586 9.7366 6.21662C9.3704 6.36738 9.03767 6.58916 8.75761 6.86915C8.47755 7.14915 8.25569 7.48183 8.10484 7.84799C7.954 8.21416 7.87714 8.60657 7.8787 9.00259C7.88027 9.3986 7.96023 9.79039 8.11397 10.1554C8.26771 10.5203 8.49218 10.8512 8.77445 11.129M2.88745 17L18.8875 1M8.88745 15.704C9.53666 15.8972 10.2101 15.9969 10.8875 16C15.0695 16 18.6515 11.987 20.1445 10.038C20.3751 9.74071 20.5002 9.37509 20.5 8.99883C20.4998 8.62256 20.3744 8.25707 20.1435 7.96C19.6187 7.27549 19.0559 6.62112 18.4575 6" stroke="#2927B9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
            
          }
        });
      });

      if(esNuevo){
        // $('#cambiopass > div:nth-child(1)').append(etiquetaAviso);
      }
    
      $('#pass').on('input', function () {
        var pass = $(this).val();
        var passrepeat = $('#passrepeat').val();
        if (passrepeat != '') {
          perfil.contrasenia.validarPass();
        }
      });
      $('#passrepeat').on('input', function () {
        var passrepeat = $(this).val();
        var pass = $('#pass').val();
        if (pass != '') {
          perfil.contrasenia.validarPass();
        }
      });

      var mensajeCambioContrasenia = function(resp, mensaje){
        /*if(!document.querySelector('#modal-resp')){
          $("#cambiopass .modal-body").append(`<div id="modal-resp"></div>`);
        }*/
        var respuesta = (resp?'success':'danger');
        $('#modal-resp').html(`
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
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`);
        return true;
      }

      $('#btnSaveM').click(function (e) {
        var btn = $(this);
        var pass = $('#pass').val();
        var passrepeat = $('#passrepeat').val();
        var passOld = $('#passold').val();
        if(passOld == '' || passOld.length < 1){
          alert('Debe escribir su contraseña antigua.');
          return false;
        }
        if (perfil.contrasenia.validarPass() && pass != '' && passrepeat != '') {
          btn.prop('disabled', true);

          fetch(`${ECUAVISA_EC.api.loginService}resetPasswordPerfil`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
              password: pass,
              password2: passrepeat,
              password_old: passOld,
              email: ECUAVISA_EC.USER_data('email'),
            }),
          }).then((response) => response.json())
            .then(async (result) => {
              mensajeCambioContrasenia(result.resp, result.mensaje);
              var posicion = $("#modal-resp").offset().top - 100;
              $("html, body").animate({
                  scrollTop: posicion
              }, 1000); 
              if (result.resp) {
                $('#pass').val('');
                $('#passrepeat').val('');
                $('#passold').val('');
              }
              btn.prop('disabled', false);
              return true;
            })
            .catch((error) => {
              console.log("error", error); /*; window.location = URL_login_G*/
            });
          return true;
        } else {
          alert('Contraseñas no coinciden o están vacías');
          return false;
        }
      })
    }
    
    /************MODAL DE SEGUIMIENTO DE INTERESES************/

    var activarIter = async function(){
      ECUAVISA_EC.initVariable('ITER', 10).then((existe) => {
        if (existe) {
          return modalUserNew.load();
        }
        //  else {
        //   console.log('La VARIABLE no existe o el tiempo de espera ha expirado');
        // }
      });

      // setTimeout(function () {
      //   if (typeof ITER !== 'undefined') {
      //     return modalUserNew.load();
      //   } else {
      //     activarIter();
      //   }
      // }, 400) ;
      return false;
    }

    var modalUserNew = {
      modalAlert:function(){
        var alert = document.querySelector('#alert-mensaje-1');
        if(ECUAVISA_EC.USER_data('wylexUserAlertView') == 'true' && ECUAVISA_EC.USER_data('isnewuser') == 0){
          if(alert.classList.contains('d-none')){
            alert.classList.remove("d-none");
          }
        }
        document.querySelector(`#alert-mensaje-1 button[aria-label="Close"]`).addEventListener("click", function(e){
          ECUAVISA_EC.SET_user('wylexUserAlertView', false);
        });
      },
      title:function(){
        document.querySelector('#modal_titulo_seguimiento_tema').innerHTML = `Cuéntanos sobre ti`;
      },
      load:function(){
        ECUAVISA_EC.initVariable('ITER', 10).then((existe) => {
          if (existe) {
            setTimeout(function(){
                ITER.FAVORITE.TOPICS.onLoad(function(){
                  // TOPICS
                  $(".template-meta-favorite-action").each(function(){
                    if (ITER.FAVORITE.TOPICS.isFavorite($(this).attr("id"))){
                      jQryIter(this).addClass("remove");
                    } else {
                      jQryIter(this).addClass("add");
                    }
                  });
                  var classListaTemas = document.querySelector('#listado-temas');
                  classListaTemas.classList.remove("isDisabled");
                });
            }, 1000);
          }
        });
        return true;
      },
      body:function(){
        var temasSeguir = ``;
        for(var i in modalUserNew.temas){
          var ins = modalUserNew.temas[i];
          temasSeguir += `<p class="mis-intereses-modal py-1 m-0" style="width:100%">
            ${ins.interes}
           </p>`;

           for(var j in ins.data){
            var dat = ins.data[j];
              temasSeguir+= `<div class="item_tema t_${dat.id}">
                   <div class="keywords font-2 fs13">
                      <div class="color_${ generarNumeroAleatorioNoRepetido(1, 15) } template-meta-favorite-action" value="${dat.name}" id="${dat.id}" title="Seguir tema" onclick="if (!window.__cfRLUnblockHandlers) return false; meta_favorite_action('${dat.id}')" style="/* display:none; */">
                         <button type="button" class="button_seguir btn btn-default btn-sm btn-modal-seguir">

                            <small>${dat.name}</small>

                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M2 2v4.586l7 7L13.586 9l-7-7H2zM1 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2z"></path>
                              <path fill-rule="evenodd" d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                            </svg>
                            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                              <path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                            </svg>
                         </button> 
                      </div>
                   </div>
               </div>`;
           }
          
        }

        document.querySelector('#modal_body_seguimiento_tema').innerHTML = `
        <div class="contenido-modal">
           <p class="parrafo-modal">
            Para ofrecerte una mejor experiencia elige los intereses que se ajusten a ti.
           </p>
           <p class="mis-intereses-modal fw-bold">
            Mis intereses
           </p>
           <hr>
           <div class="listado-temas isDisabled" id="listado-temas" style=" overflow: auto; max-height: 350px; ">
              ${temasSeguir}
           </div>
        </div>`;
      },
      existeTemaSeguimiento:function(){
        var num = 0;
        var highlightedItemss = document.querySelectorAll(".template-meta-favorite-action");
        highlightedItemss.forEach((userItem) => {
          if(userItem.classList.contains('remove')){
            num ++;
          }
        });

        return {
          existe: num > 0,
          num : num
        };
      },
      init:function(){
        this.title();
        this.body();
        /*Activa iter con el modal*/
        activarIter();
        /*Activa iter con el modal*/
        var existemodal = setInterval(function () {
            if ((typeof $().modal == 'function')) {
                $('#modal_seguimiento_temas').modal('show');

                $('#btn_enviar_seguimiento_tema').click(function(){
                  if(!modalUserNew.existeTemaSeguimiento().existe){
                    alert('Debe seleccionar al menos 1');
                    return false;
                  }
                  ECUAVISA_EC.SET_user('wylexStatusPerfil', 1);
                  ECUAVISA_EC.SET_user('wylexUserAlertView', false);
                  /*CAMBIA EL ESTADO DEL MODAL CUANDO EL USUARIO TIENE SELECCIONADO YA SUS INTERESES, Y YA NO MUESTRA EL ALERT*/
                  $('#modal_seguimiento_temas').modal('hide');

                  /*FETCH*/
                  fetch(`${ECUAVISA_EC.api.loginService}updatestatususer`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: new URLSearchParams({
                      id: ECUAVISA_EC.USER_data('id'),
                      user_new: 1,
                    }),
                  }).then((response) => response.json()).then(async (result) => {
                      if(!result.error){
                        console.log(result);
                      }else{
                        console.log(result);
                      }
                    }).catch((error) => {
                      console.log("error", error); /*; window.location = URL_login_G*/
                    });
                    /*FETCH FIN*/
                });
                clearInterval(existemodal);
            }
        }, 500);
      },
      temas:[
        {
          "interes":"Noticias",
          "data":[
            {id:'58812355', name:'elecciones 2023'},
            {id:'18465', name:'Ecuador'},
            {id:'18819', name:'Quito'},
            {id:'18537', name:'Guayaquil'},
            {id:'17519', name:'Economía'},
            {id:'17555', name:'Política'},
          ]
        },
        {
          "interes":"Estadio",
          "data":[
            {id:'6223630', name:'fútbol ecuatoriano'},
            {id:'5906044', name:'Copa Libertadores'},
            {id:'5350596', name:'Conmebol'},
            {id:'37204544', name:'El Nacional'},
          ]
        },
        {
          "interes":"Entretenimiento",
          "data":[
            {id:'17525', name:'Entretenimiento'},
            {id:'9333452', name:'Premios Oscar'},
            {id:'22433745', name:'novela Ecuavisa'},
            {id:'5991024', name:'producción'},
            {id:'154098771', name:'Equipo ideal'},
          ]
        },
        {
          "interes":"Estilo",
          "data":[
            {id:'198495015', name:'ganadores BAFTA 2023'},
            {id:'4351120', name:'redes sociales'},
            {id:'9627274', name:'feminismo'},
            {id:'30647250', name:'personas'},
            {id:'17587', name:'Tecnología'},
            {id:'11122250', name:'negocios'},
            {id:'71599306', name:'Especial Ecuaterra'},
          ]
        }
      ]
    }
    /************FIN MODAL DE SEGUIMIENTO DE INTERESES************/




/************ BLOQUE SEGUIMIENTO DE INTERESES ************/

// ECUAVISA_EC.initVariable('ITER', 10).then((existe) => {
//   if (existe) {
//     modalUserNew.load();
//   }
// });

// var activarIterPerfil = async function(){
//   setTimeout(function () {
//     if (typeof ITER !== 'undefined') {
//       return modalUserNew.load();
//     } else {
//       activarIterPerfil();
//     }
//   }, 400) ;
//   return false;
// }

var activarIterPerfil_2 = async function(){
  ECUAVISA_EC.initVariable('ITER', 10).then((existe) => {
    if (existe) {
      return modalUserNewPerfil.load();
    }
  });
  // setTimeout(function () {
  //   if (typeof ITER !== 'undefined') {
  //     return modalUserNewPerfil.load();
  //   } else {
  //     activarIterPerfil();
  //   }
  // }, 400) ;
  return false;
}

var modalUserNewPerfil = {
  modalAlert:function(){
    var alert = document.querySelector('#alert-mensaje-1');
    if(ECUAVISA_EC.USER_data('wylexUserAlertView') == 'true' && ECUAVISA_EC.USER_data('isnewuser') == 0){
      if(alert.classList.contains('d-none')){
        alert.classList.remove("d-none");
      }
    }
    document.querySelector(`#alert-mensaje-1 button[aria-label="Close"]`).addEventListener("click", function(e){
      ECUAVISA_EC.SET_user('wylexUserAlertView', false);
    });
  },
  title:function(){
    document.querySelector('#modal_titulo_seguimiento_tema').innerHTML = `Cuéntanos sobre ti`;
  },
  load:function(){
    ECUAVISA_EC.initVariable('ITER', 10).then((existe) => {
      if (existe) {
        ITER.FAVORITE.TOPICS.onLoad(function(){
          // TOPICS
          $(".template-meta-favorite-action").each(function(){
            if (ITER.FAVORITE.TOPICS.isFavorite($(this).attr("id"))){
              jQryIter(this).find("button.btn-modal-seguir").attr("data-follow", "0");
              jQryIter(this).addClass("remove");
            } else {
              jQryIter(this).find("button.btn-modal-seguir").attr("data-follow", "1");
              jQryIter(this).addClass("add");
            }
          });
          // var classListaTemas = document.querySelector('#listado-temas');
          // classListaTemas.classList.remove("isDisabled");
        });
      }
    });
    return true;
  },
  body:function(){
    var temasSeguir = ``;
    for(var i in modalUserNewPerfil.temas){
      var ins = modalUserNewPerfil.temas[i];
      temasSeguir += `<p class="mis-intereses-modal py-1 m-0" style="width:100%">
        ${ins.interes}
       </p>`;

       for(var j in ins.data){
        var dat = ins.data[j];
          temasSeguir+= `<div class="item_tema t_${dat.id}">
               <div class="keywords font-2 fs13 keywords-btn-click">
                  <div class="template-meta-favorite-action" value="${dat.name}" id="${dat.id}" title="Seguir tema" onclick="if (!window.__cfRLUnblockHandlers) return false; meta_favorite_action('${dat.id}')" style="/* display:none; */">
                     <button type="button" class="button_seguir btn btn-default btn-sm btn-modal-seguir" data-section="${ins.interes}" data-feedUrl="${dat.feedUrl}" data-idMeta="${dat.id}" data-name="${dat.name}">

                        <small>${dat.name}</small>

                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" d="M2 2v4.586l7 7L13.586 9l-7-7H2zM1 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2z"></path>
                          <path fill-rule="evenodd" d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                        </svg>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                        </svg>
                     </button> 
                  </div>
               </div>
           </div>`;
       }
      
    }

    document.querySelector('#segTemasPerfil').innerHTML = `
    <div class="contenido-modal">
      <button class="collapsible_mp active_mp mp_title">También te puede interesar</button>
      <div class="listado-temas content_mp" id="listado-temas" style="overflow: auto;max-height: max-content;">
          ${temasSeguir}
      </div>
    </div>`;
  },
  existeTemaSeguimiento:function(){
    var num = 0;
    var highlightedItemss = document.querySelectorAll(".template-meta-favorite-action");
    highlightedItemss.forEach((userItem) => {
      if(userItem.classList.contains('remove')){
        num ++;
      }
    });

    return {
      existe: num > 0,
      num : num
    };
  },
  init:function(){
    this.title();
    this.body();
    /*Activa iter con el modal*/
    activarIterPerfil_2();
    /*Activa iter con el modal*/

    //var existemodal = setInterval(function () {
        //if ((typeof $().modal == 'function')) {
            // $('#segTemasPerfil').modal('show');
            /*$('#btn_enviar_seguimiento_tema').click(function(){
              if(!modalUserNewPerfil.existeTemaSeguimiento().existe){
                alert('Debe seleccionar al menos 1');
                return false;
              }
              ECUAVISA_EC.SET_user('wylexStatusPerfil', 1);
              ECUAVISA_EC.SET_user('wylexUserAlertView', false);
              // $('#segTemasPerfil').modal('hide');

              fetch(`${ECUAVISA_EC.api.loginService}updatestatususer`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                  id: ECUAVISA_EC.USER_data('id'),
                  user_new: 1,
                }),
              }).then((response) => response.json()).then(async (result) => {
                  if(!result.error){
                    console.log(result);
                  }else{
                    console.log(result);
                  }
                }).catch((error) => {
                  console.log("error", error); 
                });
            });*/
            //clearInterval(existemodal);
       // }
    //}, 500);

    setTimeout(function(){
      document.querySelectorAll('button.btn-modal-seguir').forEach(function(elemento) {
        elemento.addEventListener('click', function(e) {
          var btn = null;
          if (e.target.nodeName === "BUTTON") {
            btn = e.target;
          } else {
            btn = e.target.parentElement;
          }
          var usuario = ECUAVISA_EC.USER_data();
          var nombreUsuario = `${usuario.name} ${usuario.lastname}`;
          var id = usuario.id;
          var temaData = {
              "name": btn.getAttribute("data-name"),
              "idMeta": btn.getAttribute("data-idMeta"),
              "section": btn.getAttribute("data-section"),
              "feedUrl": btn.getAttribute("data-feedurl"),
              "follow": (btn.getAttribute("data-follow") == "0"?false:true)
          };
          var settings = {
              "url": ECUAVISA_EC.api.seguimientoTema,
              "method": "POST",
              "timeout": 0,
              "headers": {
                  "Content-Type": "application/json"
              },
              "data": JSON.stringify({
                  "id": id,
                  "nombre": nombreUsuario,
                  "tema": temaData
              }),
          };
          
          setTimeout(function(){
            $.ajax(settings).done(function (response) {
                localStorage.setItem('resultTemas',JSON.stringify(response));
            });
          }, 700);
          
        });
      });
    }, 1000)
  },
  temas:[
    {
      "interes":"Noticias",
      "data":[
        {id:'58812355', name:'elecciones 2023',feedUrl:"#"},
        {id:'18465', name:'Ecuador',feedUrl:"#"},
        {id:'18819', name:'Quito',feedUrl:"#"},
        {id:'18537', name:'Guayaquil',feedUrl:"#"},
        {id:'17519', name:'Economía',feedUrl:"#"},
        {id:'17555', name:'Política',feedUrl:"#"},
      ]
    },
    {
      "interes":"Estadio",
      "data":[
        {id:'6223630', name:'fútbol ecuatoriano',feedUrl:"#"},
        {id:'5906044', name:'Copa Libertadores',feedUrl:"#"},
        {id:'5350596', name:'Conmebol',feedUrl:"#"},
        {id:'37204544', name:'El Nacional',feedUrl:"#"},
      ]
    },
    {
      "interes":"Entretenimiento",
      "data":[
        {id:'17525', name:'Entretenimiento',feedUrl:"#"},
        {id:'9333452', name:'Premios Oscar',feedUrl:"#"},
        {id:'22433745', name:'novela Ecuavisa',feedUrl:"#"},
        {id:'5991024', name:'producción',feedUrl:"#"},
        {id:'154098771', name:'Equipo ideal',feedUrl:"#"},
      ]
    },
    {
      "interes":"Estilo",
      "data":[
        {id:'198495015', name:'ganadores BAFTA 2023',feedUrl:"#"},
        {id:'4351120', name:'redes sociales',feedUrl:"#"},
        {id:'9627274', name:'feminismo',feedUrl:"#"},
        {id:'30647250', name:'personas',feedUrl:"#"},
        {id:'17587', name:'Tecnología',feedUrl:"#"},
        {id:'11122250', name:'negocios',feedUrl:"#"},
        {id:'71599306', name:'Especial Ecuaterra',feedUrl:"#"},
      ]
    },
    {
      "interes":"Mundo",
      "data":[
        {id:'25591315', name:'mundo',feedUrl:"#"}
      ]
    }
  ]
}
// modalUserNewPerfil.init()
/************BLOQUE SEGUIMIENTO DE INTERESES************/


/**********************BLOQUE MODAL DE SUGERENCIAS**********************/
var modalUsuarioSugerencia = {
      modalAlert:function(){
        var alert = document.querySelector('#alert-mensaje-1');
        if(ECUAVISA_EC.USER_data('wylexUserAlertView') == 'true' && ECUAVISA_EC.USER_data('isnewuser') == 0){
          if(alert.classList.contains('d-none')){
            alert.classList.remove("d-none");
          }
        }
        document.querySelector(`#alert-mensaje-1 button[aria-label="Close"]`).addEventListener("click", function(e){
          ECUAVISA_EC.SET_user('wylexUserAlertView', false);
        });
      },
      title:function(){
        document.querySelector('#modal_titulo_seguimiento_tema').innerHTML = `Cuéntanos sobre ti`;
      },
      load:function(){
        var classListaTemas = document.querySelector('#listado-temas-modal');
        classListaTemas.classList.remove("isDisabled");
        return true;
      },
      btn_click:function(id, title){
        var getUser = ECUAVISA_EC.USER_data();
        var template = document.getElementById(`template_${id}`);
        var btn = document.getElementById(`btn_${id}`);
        var estado = 0;
        btn.setAttribute('disabled', true);
        if (template.classList.contains('remove')) {
          template.classList.remove('remove');
          estado = 0;
        } else {
          template.classList.add('remove');
          estado = 1;
        }
        btn.removeAttribute('disabled');

        var resp = fetch("https://sugerencias-ecuavisa.vercel.app/addsugerencia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "userId": getUser.id,
            "sugerenciaId": id,
            "estado": estado
          }),
        }).then( (response) => response.json())
        .then( (result) => {
          console.log(result)
          return true;
        })
        .catch((error) => {
          console.log("error", error);
        });
      },
      existeSugerencia:function(sugerenciaId, data){
        for(var i in data){
          if(data[i].sugerenciaId == sugerenciaId && data[i].meta_existe == true){
            return true;
          }
        }
        return false;
      },
      initComponent:function(){
        var contador = 0;
        var existemodal = setInterval(function () {
            if ((typeof $().modal == 'function')) {
                $('#modal_seguimiento_temas').modal('show');
                clearInterval(existemodal);
            }
        }, 500);
      },
      body:function(){
        document.querySelector('#modal_body_seguimiento_tema').innerHTML=`<div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>`;
        var getUser = ECUAVISA_EC.USER_data();
        var fun = this;
        /*FETCH*/
        var myHeaders = new Headers();
        var urlSugerencia = "https://sugerencias-ecuavisa.vercel.app/all?userId="+getUser.id;
        var requestOptions = {
          method: 'GET',
          headers: myHeaders
        };
        fetch(urlSugerencia, requestOptions).then(response => {
          return response.json();
        }).then(jsondata => {
          if (jsondata.resp) {
            /*FETCH FIN*/
            fun.temas = [ { "interes":"Sugerencias", "data":jsondata.data } ];
            var temasSeguir = ``;
            for(var i in fun.temas){
              var ins = fun.temas[i];
              temasSeguir += `<p class="mis-intereses-modal py-1 m-0" style="width:100%">
                ${ins.interes}
               </p>`;

               for(var j in ins.data){
                var dat = ins.data[j];
                  dat["id"] = dat._id;
                  dat["name"] = dat.title;
                  if(dat.estado){
                    temasSeguir+= `<div class="item_tema t_${dat.id}">
                       <div class="keywords font-2 fs13">
                          <div class="template-meta-favorite-action ${fun.existeSugerencia(dat.id, jsondata.dataSugerenciasSeguido)?'remove':''}" value="${dat.name}" id="template_${dat.id}" title="Seguir sugerencia" onclick="modalUsuarioSugerencia.btn_click('${dat.id}', '${dat.name}')" style="/* display:none; */">
                             <button type="button" class="button_seguir btn btn-default btn-sm btn-modal-seguir" id="btn_${dat.id}">

                                <small>${dat.name}</small>

                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M2 2v4.586l7 7L13.586 9l-7-7H2zM1 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2z"></path>
                                  <path fill-rule="evenodd" d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                                </svg>
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                                </svg>
                             </button> 
                          </div>
                       </div>
                   </div>`;
                  }
               }
              
            }

            document.querySelector('#modal_body_seguimiento_tema').innerHTML = `
            <div class="contenido-modal">
               <p class="parrafo-modal">
                Para ofrecerte una mejor experiencia elige los intereses que se ajusten a ti.
               </p>
               <p class="mis-intereses-modal fw-bold">
                Mis intereses
               </p>
               <hr>
               <div class="listado-temas isDisabled" id="listado-temas-modal" style=" overflow: auto; max-height: 350px; ">
                  ${temasSeguir}
               </div>
            </div>`;

            fun.load();
          }
        });
      },
      existeTemaSeguimiento:function(){
        var num = 0;
        var highlightedItemss = document.querySelectorAll(".template-meta-favorite-action");
        highlightedItemss.forEach((userItem) => {
          if(userItem.classList.contains('remove')){
            num ++;
          }
        });

        return {
          existe: num > 0,
          num : num
        };
      },
      init:function(){
        var numIter = 1;
        var ins = this;
        ins.title();
        ins.body();
        ins.initComponent();
      },
      temas:[
        {
          "interes":"Noticias",
          "data":[
            {id:'', name:''},
          ]
        }
      ]
    }
/**********************BLOQUE MODAL DE SUGERENCIAS**********************/

    var perfil = {
      init: () => {
        eyesPass();
        //perfil.notificaciones.listar();
        //perfil.noticias.listar();

        modalUserNew.modalAlert();
        //modalUsuarioSugerencia.init();
        if(ECUAVISA_EC.USER_data('isnewuser') == 0){
          /*****MOSTRAMOS EL MODAL SI EL USUARIO ES NUEVO******/
          /*modalUserNew.init();*/
        }
        //ITER.FAVORITE.TOPICS.onLoad(function(){});
        setTimeout(function () {
          $('body').append(`<style>
            .init-page-js .content_mp .temas-hot .botones__, 
            .init-page-js .content_mp .temas-quemado .botones__{
              display: initial;
            }
            </style>`);
        }, 700);
        
        $('.NoticiasGuardadasBox').on('click', 'button', function(){
          var idnota = $(this).val();
          var btn = $(this);
          perfil.noticias.delete(idnota, btn);
        });
      },
      contrasenia: {
        validarPass: function () {
          // Ontenemos los valores de los campos de contraseñas 
          pass1 = document.getElementById('pass');
          pass2 = document.getElementById('passrepeat');
          // Verificamos si las constraseñas no coinciden 
          if (pass1.value != pass2.value) {
            // Si las constraseñas no coinciden mostramos un mensaje  
            document.getElementById("error-1").classList.remove("d-none");
            document.getElementById("error-1").classList.add("d-block");
            return false;
          } else {
            // Si las contraseñas coinciden ocultamos el mensaje de error
            document.getElementById("error-1").classList.remove("d-block");
            // Mostramos un mensaje mencionando que las Contraseñas coinciden 
            document.getElementById("error-1").classList.add("d-none");
            // Desabilitamos el botón de login 
            return true;
          }
        }
      },
      notificaciones: {
        listar: function () {
          var myHeaders = new Headers();
          var idUsuario = ECUAVISA_EC.USER_data('id');
          var urlGetNotificaciones = ECUAVISA_EC.api.notificacion.obtener;
          var urlFormateada = urlGetNotificaciones + idUsuario;
          var requestOptions = {
            method: 'GET',
            headers: myHeaders
          };
          let $articles = '';
          fetch(urlFormateada, requestOptions).then(response => {
            return response.json();
          }).then(jsondata => {
            if (!jsondata.resp) {
              perfil.notificaciones.listarUltimas();
            } else {
              var existeN = false;
              var notificaciones = jsondata.data.usuario.Notificaciones;
              for (var i in notificaciones) {
                const d = notificaciones[i];
                const iduser = jsondata.data.usuario.id;
                $articles += perfil.notificaciones.html_(d);
                existeN = true;
              }
              if(!existeN){
                perfil.notificaciones.listarUltimas();
              }else{
                $article.innerHTML = $articles;
                // swiperNotificaciones();
              }
            }
          });
        },
        html_: function (data) {
          return `<article class="article">
                   <div class="text_block">
                      <div class="section">${data.category}</div>
                      <a href="${data.url}"><h3>${data.title}</h3></a>
                   </div>
                   <div class="multimedia"> <a href="${data.url}"><img title="${data.title}" width="100px" height="97px" src="${ ( data.img == '' ? 'https://estadisticas.ecuavisa.com/sites/gestor/Recursos/Image_not_available.png' : data.img) }" alt="${data.title}"></a> </div>
                </article>`;
        },
        loader: function (data) {
          return `<div class="container_loader">
            <div class="loader">
          </div>`;
        },
        listarUltimas: function (num = 4) {
          var myHeaders = new Headers();
          let $articles = '';
          let $idusuario = ECUAVISA_EC.USER_data('wylexUserId') || 0;
          fetch("https://www.ecuavisa.com/rss/data-noticia.json").then((response) => response.json())
            .then((jsondata) => {
              let items = jsondata.rss.channel.item;
              let newItems = items.slice(0, num);
              let json = [];
              newItems.forEach(function (item, index) {
                var img = Array.isArray(item.content) ? item.content[0] : item.content;
                //console.log(JSON.stringify(img))
                var jsonData = {
                  "title": item.title,
                  "img": img.url,
                  "category": item.category[0]['__text'],
                  "autor": item.pubDate,
                  "fecha": item.pubDate,
                  "url": item.link
                };
                $articles += perfil.notificaciones.html_(jsonData);
              });
              $article.innerHTML = $articles;
              // swiperNotificaciones();
            });
        },
      },
      noticias: {
        delete:function(idnota, btn){
          btn.prop('disabled', true);
          /*Se obtiene la data del usuario desde main_ecuavisa.js*/
          var idusuario = ECUAVISA_EC.USER_data('id');
          /*Se obtiene la data del usuario desde main_ecuavisa.js*/
          fetch(`${ECUAVISA_EC.api.notificacion.delete}${idusuario}/${idnota}`, {
            method: 'DELETE'
          }).then(response => response.json())
          .then(result => {
            perfil.noticias.listar();
            perfil.notificaciones.listar();
            btn.prop('disabled', false);
            return true;
          }).catch(err => {
            console.error(err);
            btn.prop('disabled', false);
          });
        },
        listar: function () {
          var myHeaders = new Headers();
          var idUsuario = ECUAVISA_EC.USER_data('id');
          var urlGetNotificaciones = ECUAVISA_EC.api.notificacion.obtener;
          var urlFormateada = urlGetNotificaciones + idUsuario;
          var requestOptions = {
            method: 'GET',
            headers: myHeaders
          };
          let $articles = '';
          fetch(urlFormateada, requestOptions).then(response => {
            return response.json();
          }).then(jsondata => {
            if (!jsondata.resp) {
              $articles += 'No tienes notas guardadas';
            } else {
              var existeN = false;
              var notificaciones = jsondata.data.usuario.Notificaciones;
              for (var i in notificaciones) {
                const d = notificaciones[i];
                const iduser = jsondata.data.usuario.id;
                $articles += perfil.noticias.html_(d, i);
                var existeN = true;
              }
              if(!existeN){
                $articles += 'No tienes notas guardadas';
              }
            }
            $articleNoticiasSave.innerHTML = $articles;
          });
        },
        html_: function (data) {
          return `<article class="article">
                    <div class="text_block">
                      <div class="section">${data.category}</div>
                      <a href="${data.url}"><h3>${data.title}</h3></a>
                    </div>
                    <div class="multimedia">
                      <a href="${data.url}"><img src="${ ( data.img == '' ? 'https://estadisticas.ecuavisa.com/sites/gestor/Recursos/Image_not_available.png' : data.img) }" alt="${data.title}"></a>
                    </div>
                    <div class="buttons_right">
                      <button value="${data._id}" class="btn btn-ecuavisa-noticia active" title="Haz clic para quitar la noticia">
                        <img src="https://ecuavisadev.netlify.app/rd-mi-perfil/assets/saved.svg" width="20" height="20" alt="${data.title}">
                      </button>
                      <a class="btn btn-ecuavisa-noticia active" rel="external" href="http://twitter.com/share?url=${data.url}&text=${data.title}" target="_blank" title="Twitter" > 
                          <img src="https://ecuavisadev.netlify.app/rd-mi-perfil/assets/share-fill.svg" width="20" height="20" alt="${data.title}">
                      </a>
                    </div>
                </article>
                `;
        },
        loader: function (data) {
          return `<div class="container_loader">
            <div class="loader blue">
          </div>`;
        }
      }
    }

    /*----favoritos-on----*/
    jQryIter.enableFavoriteArticles();
    jQryIter.enableFavoriteTopics();

    /*----seguirmetas----*/
    function meta_favorite_action(id) {
      ECUAVISA_EC.initVariable('ITER', 10).then((existe) => {
        if (existe) {
          var user=jQryIter.u;
          if(user!=""){
            if (ITER.FAVORITE.TOPICS.isFavorite(id)){
              ITER.FAVORITE.TOPICS.remove(id, del_fav_t(), nodel_fav_t());
              jQryIter("#"+id).removeClass("remove");
              jQryIter("#"+id).addClass("add");
              jQryIter("#"+id).attr("title","Seguir este tema");
            }
            else{
              ITER.FAVORITE.TOPICS.add(id, ok_fav_t(), ko_fav_t());
              jQryIter("#"+id).addClass("remove");
              jQryIter("#"+id).removeClass("add");
              jQryIter("#"+id).attr("title","Dejar de seguir este tema");
              //$("#favorite_topic_alert").show(300);
              //$("#favorite_topic_alert").delay(2000).hide(300);
            }
          }else{
            window.location.assign("/servicios/perfil/");
          }
        }
      });	
    }
    function ok_fav_t() {
      //alert("Tema añadido a favoritos");
    }
    function ko_fav_t() {
      //alert("ERROR. El Tema no se ha podido añadir a favoritos");
    }
    function del_fav_t() {
      //alert("Tema eliminado de favoritos");
    }
    function nodel_fav_t() {
      //alert("ERROR. El Tema no se ha podido eliminar de favoritos");
    }
    

    collapse();

/**********************BLOQUE MODAL DE SUGERENCIAS**********************/
function generarNumeroAleatorioNoRepetido(min, max) {
  if (!generarNumeroAleatorioNoRepetido.numeros) {
    generarNumeroAleatorioNoRepetido.numeros = [];
    
    for (var i = min; i <= max; i++) {
      generarNumeroAleatorioNoRepetido.numeros.push(i);
    }
  }
  
  if (generarNumeroAleatorioNoRepetido.numeros.length === 0) {
    generarNumeroAleatorioNoRepetido.numeros = null;
    return 1;
  }
  
  var indiceAleatorio = Math.floor(Math.random() * generarNumeroAleatorioNoRepetido.numeros.length);
  var numeroAleatorio = generarNumeroAleatorioNoRepetido.numeros.splice(indiceAleatorio, 1)[0];
  
  return numeroAleatorio;
}

var bloqueUsuarioSugerencia = {
      idBloque:"bloque_body_seguimiento_tema",
      idListadoTema:"listado-temas-modal",
      diBloqueSeguiT:"bloque_titulo_seguimiento_tema",
      title:function(){
        //document.querySelector('#'+this.diBloqueSeguiT).innerHTML = `Cuéntanos sobre ti`;
      },
      load:function(){
        var classListaTemas = document.querySelector('#'+this.idListadoTema);
        classListaTemas.classList.remove("isDisabled");
        return true;
      },
      btn_click:function(id, title){
        var getUser = ECUAVISA_EC.USER_data();
        var template = document.getElementById(`b_template_${id}`);
        var btn = document.getElementById(`b_btn_${id}`);
        var estado = 0;
        btn.setAttribute('disabled', true);
        if (template.classList.contains('remove')) {
          template.classList.remove('remove');
          estado = 0;
        } else {
          template.classList.add('remove');
          estado = 1;
        }
        btn.removeAttribute('disabled');

        var resp = fetch("https://sugerencias-ecuavisa.vercel.app/addsugerencia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            "userId": getUser.id,
            "sugerenciaId": id,
            "estado": estado
          }),
        }).then( (response) => response.json())
        .then( (result) => {
          console.log(result)
          return true;
        })
        .catch((error) => {
          console.log("error", error);
        });
      },
      existeSugerencia:function(sugerenciaId, data){
        for(var i in data){
          if(data[i].sugerenciaId == sugerenciaId && data[i].meta_existe == true){
            return true;
          }
        }
        return false;
      },
      initComponent:function(){
        var classListalistDrivers = document.querySelector('.MODAL_SEGUIMIENTO_TEMA');
        var dpagination = document.createElement("div");
        dpagination.setAttribute("id", "bloque_body_seguimiento_tema");
        classListalistDrivers.append(dpagination);
      },
      body:function(){
        /*document.querySelector('#'+this.idBloque).innerHTML=`<div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>`;*/
        var getUser = ECUAVISA_EC.USER_data();
        var fun = this;
        /*FETCH*/
        var myHeaders = new Headers();
        var urlSugerencia = "https://sugerencias-ecuavisa.vercel.app/all?userId="+getUser.id;
        var requestOptions = {
          method: 'GET',
          headers: myHeaders
        };
        fetch(urlSugerencia, requestOptions).then(response => {
          return response.json();
        }).then(jsondata => {
          if (jsondata.resp) {
            /*FETCH FIN*/
            fun.temas = [ { "interes":"Sugerencias", "data":jsondata.data } ];
            var temasSeguir = ``;
            for(var i in fun.temas){
              var ins = fun.temas[i];
              temasSeguir += `<p class="mis-intereses-modal py-1 m-0" style="width:100%">
                ${ins.interes}
               </p>`;

               for(var j in ins.data){
                var dat = ins.data[j];
                  dat["id"] = dat._id;
                  dat["name"] = dat.title;
                  if(dat.estado){
                    temasSeguir+= `<div class="item_tema t_${dat.id}">
                       <div class="keywords font-2 fs13">
                          <div class="color_${ generarNumeroAleatorioNoRepetido(1, 15) } template-meta-favorite-action ${fun.existeSugerencia(dat.id, jsondata.dataSugerenciasSeguido)?'remove':''}" value="${dat.name}" id="b_template_${dat.id}" title="Seguir sugerencia" onclick="bloqueUsuarioSugerencia.btn_click('${dat.id}', '${dat.name}')" style="/* display:none; */" >
                             <button type="button" class="button_seguir btn btn-default btn-sm btn-modal-seguir" id="b_btn_${dat.id}">

                                <small>${dat.name}</small>

                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M2 2v4.586l7 7L13.586 9l-7-7H2zM1 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2z"></path>
                                  <path fill-rule="evenodd" d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                                </svg>
                                <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                                </svg>
                             </button> 
                          </div>
                       </div>
                   </div>`;
                  }
               }
              
            }

            document.querySelector('#'+this.idBloque).innerHTML = `
            <div class="contenido-modal">
               <p class="parrafo-modal"></p>
               <p class="mis-intereses-modal fw-bold"></p>
               <!--<hr>-->
               <div class="listado-temas isDisabled" id="${this.idListadoTema}" style=" overflow: auto; max-height: 350px; ">
                  ${temasSeguir}
               </div>
            </div>`;

            fun.load();
          }
        });
      },
      existeTemaSeguimiento:function(){
        var num = 0;
        var highlightedItemss = document.querySelectorAll(".template-meta-favorite-action");
        highlightedItemss.forEach((userItem) => {
          if(userItem.classList.contains('remove')){
            num ++;
          }
        });

        return {
          existe: num > 0,
          num : num
        };
      },
      init:function(){
        var numIter = 1;
        var ins = this;
        ins.title();
        ins.initComponent();
        ins.body();
      },
      temas:[
        {
          "interes":"Noticias",
          "data":[
            {id:'', name:''},
          ]
        }
      ]
    }
    // comentar para apagar bloque de sugerencias 
    // bloqueUsuarioSugerencia.init();
/**********************BLOQUE MODAL DE SUGERENCIAS**********************/


// ##############BUENAS PRACTICAS##################
if (!ECUAVISA_EC.login() && urlParamsGET.get('tk')==null){
  /*Si no existe sesión lo va a redireccionar al login */
  if(ECUAVISA_EC.isPageProduccion()){
    window.location = URL_login_G;
  }
  
}else{  
  if(ECUAVISA_EC.login()){
    DataEntrada();  
    DatosPersonales();   
  }else{
    setTimeout(function(){
        if(ECUAVISA_EC.login()){
          location.reload();
        }
    }, 2000);
  }
}
// ################################################

    
    //suscriptionDymanic();
    /*#Notificaciones: iniciar loader*/
    // let $article = document.querySelector('.notificationBox .noticias');
    // $article.innerHTML = perfil.notificaciones.loader();
    
    
    // let $articleNoticiasSave = document.querySelector('.NoticiasGuardadasBox .noticias');
    // $articleNoticiasSave.innerHTML = perfil.noticias.loader();
    /*#Fin notificaciones: iniciar loader*/

    
    let init_jQuery_Swiper = function () {
      setTimeout(function () {
        return ((window.jQuery && (typeof Swiper !== 'undefined')) ? perfil.init() : init_jQuery_Swiper());
      }, 400);
    }
    init_jQuery_Swiper();



/*================================AYUDA=================================== */

var moverContenidoAyuda = () =>{
  // Obtener el contenido del bloque origen
  var contenidoOrigen = document.querySelector(".faq_ecu .noticias").innerHTML;
  var formulario = document.querySelector(".faq_form_ecu").innerHTML;
  // Establecer el contenido en el bloque destino
  document.querySelector("#faq").innerHTML += `<div class="noticias">${contenidoOrigen}</div>`;
  document.querySelector("#faq_form").innerHTML += `<div class="c_002_001 form-portlet">${formulario}</div>`;
  return true;
}

// moverContenidoAyuda();

/*============================FIN AYUDA=================================== */


/*================================REDIRECCION EMERGENTE=================================== */

// setTimeout(function () {
//     window.location.href = 'https://www.ecuavisa.com/compania593';
// }, 1860);

/*============================FIN REDIRECCION EMERGENTE=================================== */


function swiperListDrivers() {
  var classListalistDrivers = document.querySelector('.list_article_drivers');
  var classListalistDriversNot = document.querySelector('.list_article_drivers .noticias');
  var classListalistDriversNotArt = document.querySelectorAll('.list_article_drivers .noticias article');


  var dpagination = document.createElement("div");
  dpagination.classList = "swiper-pagination";
  classListalistDrivers.append(dpagination);

  classListalistDrivers.classList.add('swiper');
  classListalistDriversNot.classList.add('swiper-wrapper');

  for (const SlideProg of classListalistDriversNotArt) {
    SlideProg.classList.add('swiper-slide');
  }

  var swiperLisDriv = new Swiper(".list_article_drivers", {
    slidesPerView: 1.5,
    spaceBetween: 20,
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
      clickable: true,
    },
    breakpoints: {
      600: {
        slidesPerView: 1.5,
        spaceBetween: 20,
      },
      768: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
      1200: {
        slidesPerView: 3,
        spaceBetween: 30,
      },
    },
  });
}


function sGoListDrivers() {
  setTimeout(function () {
    if (typeof Swiper === "undefined") {
      sGoListDrivers();
    } else {
      // swiperListDrivers();
    }
  }, 400);
}

$(document).ready(function () {
  sGoListDrivers();
});

// var bloqueUsuarioIntereses = {
//       idBloque:"bloque_body_intereses_tema",
//       idListadoTemaSugerencia:"listado-temas-intereses-modal",
//       diBloqueSeguiT:"bloque_titulo_intereses_tema",
//       title:function(){
//         //document.querySelector('#'+this.diBloqueSeguiT).innerHTML = `Cuéntanos sobre ti`;
//       },
//       load:function(){
//         var classListaTemas = document.querySelector('#'+this.idListadoTemaSugerencia);
//         classListaTemas.classList.remove("isDisabled");
//         return true;
//       },
//       btn_click:function(id, title, feedUrl){
//         var getUser = ECUAVISA_EC.USER_data();
//         var ins = this;

//         var template = document.getElementById(`b_template_${id}`);
//         var btn = document.getElementById(`b_btn_${id}`);
//         var estado = 0;
//         btn.setAttribute('disabled', true);
//         if (template.classList.contains('remove')) {
//           template.classList.remove('remove');
//           estado = 0;
//         } else {
//           template.classList.add('remove');
//           estado = 1;
//         }
//         btn.removeAttribute('disabled');

//         var resp = fetch("https://sugerencias-ecuavisa.vercel.app/interes/add", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             "userId": getUser.id,
//             "interesId": id,
//             "description": "-",
//             "title": title,
//             "estado": estado,
//             "meta_existe": true,
//           }),
//         }).then( (response) => response.json())
//         .then( (result) => {
//           meta_favorite_action(id);
//           return true;
//         })
//         .catch((error) => {
//           console.log("error", error);
//         });
//       },
//       existeSugerencia:function(sugerenciaId, data){
//         return false;
//         for(var i in data){
//           if(data[i].sugerenciaId == sugerenciaId && data[i].meta_existe == true){
//             return true;
//           }
//         }
//         return false;
//       },
//       initComponent:function(){
//         var classListalistDrivers = document.querySelector('.MP_seg_temas');
//         classListalistDrivers.classList.add("MODAL_SEGUIMIENTO_TEMA");
//         var dpagination = document.createElement("div");
//         dpagination.setAttribute("id", "bloque_body_intereses_tema");
//         classListalistDrivers.append(dpagination);
//       },
//       body:function(){
//         /*document.querySelector('#'+this.idBloque).innerHTML=`<div class="spinner-border" role="status">
//           <span class="sr-only">Loading...</span>
//         </div>`;*/
//         var getUser = ECUAVISA_EC.USER_data();
//         var fun = this;
//         /*FETCH*/
//         var myHeaders = new Headers();
//         var urlSugerencia = "https://estadisticas.ecuavisa.com/sites/gestor/Tools/Intereses/datareader.php";
//         var requestOptions = {
//           method: 'GET',
//           headers: myHeaders
//         };
//         fetch(urlSugerencia, requestOptions).then(response => {
//           return response.json();
//         }).then(jsondata => {
//           if (jsondata.length > 0) {
//             /*FETCH FIN*/
//             fun.temas = [ { "interes":"Intereses", "data":jsondata } ];
//             var temasSeguir = ``;
//             for(var i in fun.temas){
//               var ins = fun.temas[i];
//               temasSeguir += `<p class="mis-intereses-modal py-1 m-0" style="width:100%">
//                 ${ins.interes}
//                </p>`;

//                for(var j in ins.data){
//                 var dat = ins.data[j];
//                   dat["id"] = dat.id;
//                   dat["name"] = dat.__text;

//                   if(dat.publicado){
//                     temasSeguir+= `<div class="item_tema t_${dat.id}">
//                        <div class="keywords font-2 fs13">
//                           <div class="color_${ generarNumeroAleatorioNoRepetido(1, 15) } template-meta-favorite-action ${ ITER.FAVORITE.TOPICS.isFavorite(dat.id) ?'remove':''}" value="${dat.name}" id="b_template_${dat.id}" title="Seguir intereses" onclick="bloqueUsuarioIntereses.btn_click('${dat.id}', '${dat.name}', '#')" style="/* display:none; */">
//                              <button type="button" class="button_seguir btn btn-default btn-sm btn-modal-seguir" id="b_btn_${dat.id}">

//                                 <small>${dat.name}</small>

//                                 <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                                   <path fill-rule="evenodd" d="M2 2v4.586l7 7L13.586 9l-7-7H2zM1 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2z"></path>
//                                   <path fill-rule="evenodd" d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
//                                 </svg>
//                                 <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
//                                   <path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
//                                 </svg>
//                              </button> 
//                           </div>
//                        </div>
//                    </div>`;
//                   }
//                }
//             }

//             document.querySelector('#'+this.idBloque).innerHTML = `
//             <style>
//               #bloque_body_intereses_tema{
//                 padding-top:0px;
//                 padding-bottom:0px;
//               }
//             </style>
//             <div class="contenido-modal">
//                <p class="parrafo-modal"></p>
//                <p class="mis-intereses-modal fw-bold"></p>
//                <!--<hr>-->
//                <div class="listado-temas isDisabled" id="${this.idListadoTemaSugerencia}" style=" overflow: auto; max-height: 350px; ">
//                   ${temasSeguir}
//                </div>
//             </div>`;

//             fun.load();
//           }
//         });
//       },
//       existeTemaSeguimiento:function(){
//         var num = 0;
//         var highlightedItemss = document.querySelectorAll(".template-meta-favorite-action");
//         highlightedItemss.forEach((userItem) => {
//           if(userItem.classList.contains('remove')){
//             num ++;
//           }
//         });

//         return {
//           existe: num > 0,
//           num : num
//         };
//       },
//       init:function(){
//         var numIter = 1;
//         var contador = 1;
//         var ins = this;
//         ECUAVISA_EC.initVariable('ITER', 10).then((existe) => {
//           if (existe) {
//             setTimeout(function(){
//                 ITER.FAVORITE.TOPICS.onLoad(function(){
//                   ins.initComponent();
//                   ins.body();
//                 });
//             }, 1000);
//           }
//         });
        
//         // var EXISTEiter = setInterval(function () {
//         // if (typeof ITER !== 'undefined') {
//             //   ITER.FAVORITE.TOPICS.onLoad(function(){
//             //   ins.initComponent();
//             //   ins.body();
//             // });
//         //     clearInterval(EXISTEiter);
//         // }else{
//         //   contador++;
//         // }
//         // if(contador == 100){
//         //     console.error("ITER no está definido");
//         //     clearInterval(EXISTEiter);
//         //   }
//         // }, 500);
//       },
//       temas:[
//         {
//           "interes":"Noticias",
//           "data":[
//             {id:'', name:''},
//           ]
//         }
//       ]
//     }

var bloqueUsuarioIntereses = {
      idBloque:"bloque_body_intereses_tema",
      idListadoTemaSugerencia:"listado-temas-intereses-modal",
      diBloqueSeguiT:"bloque_titulo_intereses_tema",
      title:function(){
        //document.querySelector('#'+this.diBloqueSeguiT).innerHTML = `Cuéntanos sobre ti`;
      },
      generarSlug:function(texto) {
        // Reemplazar tildes y diacríticos
        const textoSinTildes = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Reemplazar caracteres especiales y espacios con guiones
        const slug = textoSinTildes
          .toLowerCase() // Convertir a minúsculas
          .replace(/[^a-z0-9]+/g, '-') // Reemplazar caracteres no alfanuméricos con guiones
          .replace(/^-+|-+$/g, ''); // Eliminar guiones al principio y al final

        return slug;
      },
      load:function(){
        var classListaTemas = document.querySelector('#'+this.idListadoTemaSugerencia);
        classListaTemas.classList.remove("isDisabled");
        return true;
      },
      btn_click:function(id, title, feedUrl){
        var getUser = ECUAVISA_EC.USER_data();
        var ins = this;

        var template = document.getElementById(`b_template_${id}`);
        var btn = document.getElementById(`b_btn_${id}`);
        var estado = 0;
        btn.setAttribute('disabled', true);
        if (template.classList.contains('remove')) {
          template.classList.remove('remove');
          estado = 0;
        } else {
          template.classList.add('remove');
          estado = 1;
        }
        btn.removeAttribute('disabled');

        var temaData = {
            "name": title,
            "feedUrl": `/metadatos/-/meta/${ins.generarSlug(title)}`,
            "follow": (estado == 1?true:false)
        };

        var settings = {
           "url": ECUAVISA_EC.api.seguimientoTema,
           "method": "POST",
           "timeout": 0,
           "headers": {
               "Content-Type": "application/json"
           },
           "data": JSON.stringify({
               "id": getUser.id,
               "nombre": `${getUser.name} ${getUser.lastname}`,
               "tema": temaData
           }),
        };

        $.ajax(settings).done(function (response) {
             var resp = fetch("https://sugerencias-ecuavisa.vercel.app/interes/add", {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify({
               "userId": getUser.id,
               "interesId": id,
               "description": "-",
               "title": title,
               "estado": estado,
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
        });
        
      },
      existeSugerencia:function(sugerenciaId, data){
        return false;
        for(var i in data){
          if(data[i].sugerenciaId == sugerenciaId && data[i].meta_existe == true){
            return true;
          }
        }
        return false;
      },
      initComponent:function(){
        var classListalistDrivers = document.querySelector('.MP_seg_temas');
        classListalistDrivers.classList.add("MODAL_SEGUIMIENTO_TEMA");
        var dpagination = document.createElement("div");
        dpagination.setAttribute("id", "bloque_body_intereses_tema");
        classListalistDrivers.append(dpagination);
      },
      buscarInteres(data, interesId){
        for(var i in data){
          if(data[i].interesId == interesId){
            return true;
          }
        }

        return false;
      },
      body:function(){
        /*document.querySelector('#'+this.idBloque).innerHTML=`<div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>`;*/
        var getUser = ECUAVISA_EC.USER_data();
        var fun = this;
        /*FETCH*/
        var myHeaders = new Headers();
        var urlSugerencia = "https://estadisticas.ecuavisa.com/sites/gestor/Tools/Intereses/datareader.php";
        var requestOptions = {
          method: 'GET',
          headers: myHeaders
        };
        fetch(urlSugerencia, requestOptions).then(response => {
          return response.json();
        }).then(jsondata => {
          if (jsondata.length > 0) {
            var myHeaders_2 = new Headers();
            var urlSugerencia_2 = "https://sugerencias-ecuavisa.vercel.app/interes/all?userId="+getUser.id;
            var requestOptions_2 = {
              method: 'GET',
              headers: myHeaders_2
            };
            fetch(urlSugerencia_2, requestOptions_2).then(response => {
              return response.json();
            }).then(jsondata_2 => {
              
              console.log(jsondata_2.dataInteresSeguido)

              /*FETCH FIN*/
              fun.temas = [ { "interes":"Intereses", "data":jsondata } ];
              var temasSeguir = ``;
              for(var i in fun.temas){
                var ins = fun.temas[i];
                temasSeguir += `<p class="mis-intereses-modal py-1 m-0" style="width:100%">
                  ${ins.interes}
                 </p>`;

                 for(var j in ins.data){
                  var dat = ins.data[j];
                    dat["id"] = dat.id;
                    dat["name"] = dat.__text;
                    if(dat.publicado){ //${ ITER.FAVORITE.TOPICS.isFavorite(dat.id) ?'remove':''}
                      // console.log(dat)
                      temasSeguir+= `<div class="item_tema t_${dat.id}">
                         <div class="keywords font-2 fs13">
                            <div class="color_${ generarNumeroAleatorioNoRepetido(1, 15) } template-meta-favorite-action ${ bloqueUsuarioIntereses.buscarInteres(jsondata_2.dataInteresSeguido, dat.id) ?'remove':''}" value="${dat.name}" id="b_template_${dat.id}" title="Seguir intereses" onclick="bloqueUsuarioIntereses.btn_click('${dat.id}', '${dat.name}', '#')" style="/* display:none; */">
                               <button type="button" class="button_seguir btn btn-default btn-sm btn-modal-seguir" id="b_btn_${dat.id}">

                                  <small>${dat.name}</small>

                                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M2 2v4.586l7 7L13.586 9l-7-7H2zM1 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 1 6.586V2z"></path>
                                    <path fill-rule="evenodd" d="M4.5 5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"></path>
                                  </svg>
                                  <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-tag-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" d="M2 1a1 1 0 0 0-1 1v4.586a1 1 0 0 0 .293.707l7 7a1 1 0 0 0 1.414 0l4.586-4.586a1 1 0 0 0 0-1.414l-7-7A1 1 0 0 0 6.586 1H2zm4 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"></path>
                                  </svg>
                               </button> 
                            </div>
                         </div>
                     </div>`;
                    }
                 }
              }

              document.querySelector('#'+this.idBloque).innerHTML = `
              <style>
                #bloque_body_intereses_tema{
                  padding-top:0px;
                  padding-bottom:0px;
                }
              </style>
              <div class="contenido-modal">
                 <p class="parrafo-modal"></p>
                 <p class="mis-intereses-modal fw-bold"></p>
                 <!--<hr>-->
                 <div class="listado-temas isDisabled" id="${this.idListadoTemaSugerencia}" style=" overflow: auto; max-height: 350px; ">
                    ${temasSeguir}
                 </div>
              </div>`;

              fun.load();



            });
            
          }
        });
      },
      existeTemaSeguimiento:function(){
        var num = 0;
        var highlightedItemss = document.querySelectorAll(".template-meta-favorite-action");
        highlightedItemss.forEach((userItem) => {
          if(userItem.classList.contains('remove')){
            num ++;
          }
        });

        return {
          existe: num > 0,
          num : num
        };
      },
      init:function(){
        var numIter = 1;
        var contador = 1;
        var ins = this;

        ins.initComponent();
        ins.body();
        
      },
      temas:[
        {
          "interes":"Noticias",
          "data":[
            {id:'', name:''},
          ]
        }
      ]
    }
bloqueUsuarioIntereses.init();

/*BLOQUE SECCION MI PERFIL*/
var miPerfil = function(){
    if(ECUAVISA_EC.login()){
        var usuario = ECUAVISA_EC.USER_data();
        if(document.querySelector('.u-img-user-me')){
          var imgUserMe = document.querySelector('.u-img-user-me');
          imgUserMe.src = usuario.avatar;

          var name = document.querySelector('.name-user-me');
          name.innerHTML = `${usuario.name} ${usuario.lastname}`;

          var descipcion = document.querySelector('.descripcion-user-me');
          descipcion.innerHTML = `¡Bienvenido(a) a tu Ecuavisa!`;
        }

    }else{
        console.error("El usuario no está logueado");
    }
}

miPerfil();
/*BLOQUE SECCION MI PERFIL*/


/*CAMBIAR EL NOMBRE DEL USUARIO*/
var cambionombre = document.querySelector('#cambionombre');
cambionombre.addEventListener("click", function () {
  cambiarNombre();
});

document.getElementById("cambioname").value = ECUAVISA_EC.USER_data().name
document.getElementById("cambionape").value = ECUAVISA_EC.USER_data().lastname

function cambiarNombre() {
  var btn = cambionombre
  btn.setAttribute("disabled", true); 

  let first_name = document.getElementById("cambioname").value.trim() || '';
  let last_name = document.getElementById("cambionape").value.trim() || '';
  
  //servicio render Luis
  fetch("https://micuenta.ecuavisa.com/loginservice/update/name", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      email: ECUAVISA_EC.USER_data().email,
      idUser: ECUAVISA_EC.USER_data().id,
      first_name: first_name,
      last_name: last_name,
    }),
  }).then((response) => response.json())
    .then(async (result) => {
      if (result.resp) {
        localStorage.wylexFirstName = first_name;
        localStorage.wylexLastName  = last_name;

        alert("Tados los datos fueron guardados");
        location.reload();
      } else {
        alert(result.msj);
      }
      btn.removeAttribute('disabled');
    })
    .catch((error) => {
      btn.removeAttribute('disabled');
      console.log("error", error); /*; window.location = URL_login_G*/
    });
}

// MODAL RECUPERAR CONTRASEÑA

function sendEmailPassReset() {
  var btn = document.querySelector('#forgetButton');
  btn.setAttribute("disabled", true); 
  let email = document.getElementById("forgetEmail").value.trim() || '';
  
  if(!IsEmail()){
    alert('El correo no es el correcto');
    btn.removeAttribute('disabled');
    return false;
  }

  if(email == '' || email.length == 0){
    alert('El correo no es el correcto');
    btn.removeAttribute('disabled');
    return false;
  }
  //servicio render Luis
  fetch("https://micuenta.ecuavisa.com/loginservice/forgotPassword", {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      email: email,
    }),
  }).then((response) => response.json())
    .then(async (result) => {
      if (!result.error) {
        alert(result.mensaje);
        $("#exampleModalRecuperar").modal("hide");
      } else {
        alert("Email inválido");
      }
      btn.removeAttribute('disabled');
    })
    .catch((error) => {
      btn.removeAttribute('disabled');
      console.log("error", error); /*; window.location = URL_login_G*/
    });
}

function IsEmail() {
  var input = document.querySelector('#forgetEmail');
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

$("#exampleModalRecuperar .modal-footer button").click(function () {
  var email = $('#forgetEmail').val();

  if (IsEmail_2(email) == false) {
    $('#invalid_email').show();
    return false;
  } else {
    console.log('correo: ', email);
    $('#invalid_email').hide();
    $('#exampleModalRecuperar .modal-footer').hide();
    $('#exampleModalRecuperar .modal-body').html(`
    <div class="alert alert-success" role="alert">
     Correo enviado con éxito
   </div>
   `);
  }

});

var checkInput = (e) => {
  const content = $("#forgetEmail").val().trim();
  $('#forgetButton').prop('disabled', content === '');
};

$(document).on('keyup', '#forgetEmail', checkInput);

/*function IsEmail_2(email) {
  var regex =
    /^([a-zA-Z0-9_.-+])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
  if (!regex.test(email)) {
    return false;
  } else {
    return true;
  }
}*/
function IsEmail_2() {
  var input = document.querySelector('#forgetEmail');
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

if(document.querySelector(".btn.si_eliminar")){
    var btnEliminar = document.querySelector(".btn.si_eliminar");
    var usuario = ECUAVISA_EC.USER_data();
    btnEliminar.addEventListener("click", function(e){
        btnEliminar.classList.add("disabled");
        const urlTemp_2 = `https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/delete/wylex?id=${usuario.id}`; // URL de la API
        const urlTemp_1 = `https://servicio-delete.vercel.app/delete?id=${usuario.id}`; // URL de la API
        const headers = new Headers();
        headers.append('Content-Type', 'application/json');
        // headers.append('Authorization', 'Bearer tu-token-de-autenticacion');
        const requestOptions = {
          method: 'DELETE',
          headers: headers,
        };
        fetch(urlTemp_1, requestOptions).then(response => response.json())
        .then(data => {
          // Manipula la respuesta de la API
          if(data.deletedCount != '0'){
            fetch(urlTemp_2, requestOptions).then(response_2 => response_2.json())
            .then(data_2 => {
              /*SE DEBE CERRAR LA SESION CON LA FUNCION QUE SE ENCUENTRA EN global.js*/
              clearSesion();
              /*SE DEBE CERRAR LA SESION CON LA FUNCION QUE SE ENCUENTRA EN global.js*/
            }).catch(error => {
              // Maneja el error en caso de que ocurra
              alert('Error al intentar eliminar:', error);
              btnEliminar.classList.remove("disabled");
            });
          }
        }).catch(error => {
          // Maneja el error en caso de que ocurra
          alert('Error al intentar eliminar:', error);
          btnEliminar.classList.remove("disabled");
        });
    });
}

function TabsResultados() {
  var vicularTodo = function() {
    var menuElementsRes = document.querySelectorAll('[data-tab]');
    for(var i = 0; i < menuElementsRes.length ; i++) {
      menuElementsRes[i].addEventListener('click', cambiarResultos);
    }
  }

  var limpiarResultados = function() {
    var menuElementsRes = document.querySelectorAll('[data-tab]');
    for(var i = 0; i < menuElementsRes.length ; i++) {
      menuElementsRes[i].classList.remove('active');
      var id = menuElementsRes[i].getAttribute('data-tab');
      if(document.querySelector(`#${id}`)){
        document.getElementById(id).classList.remove('active');
      }
    }
  }

  var cambiarResultos = function(e) {
    limpiarResultados();
    e.target.classList.add('active');
    var id = e.currentTarget.getAttribute('data-tab');
    console.log(id)
    document.getElementById(id).classList.add('active');
  }

  vicularTodo();
}

TabsResultados()

// setTimeout(function(){
//   if(!window.bootstrap){
//       var scriptBoostrap = document.createElement("script");
//       scriptBoostrap.setAttribute( 'src', `https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js` );
//       document.body.appendChild(scriptBoostrap);
//   }
// }, 1000);


// setTimeout(function(){
//   var connectTabsResultados = new TabsResultados();
// }, 1500);