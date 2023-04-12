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

if(!ECUAVISA_EC.login()){
  /*SI NO ESTÁ INICIADO SESIÓN MANDA LA FUNCIÓN DE TOKEN()*/
  Token();
}

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

        /*Añade el ícono de perfil si no existe con el || CR*/
        localStorage.wylexAvatar=result.avatar  || 'https://estadisticas.ecuavisa.com/sites/gestor/Recursos/usuario.png'
        /*if(result.avatar){
          localStorage.wylexAvatar=result.avatar;
        }*/

        window.location = ECUAVISA_EC.URL_perfil();
      
    //   let email = result.email;
    //   let pass = result.password;
    //   let _id = result._id;
    //   await fetch("https://ecuavisa-login-service.onrender.com/encrypt", {
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
          html: 'Ver',
          class: 'btn btn-primary btn-sm btn-eyes',
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
            $(this).removeClass("btn-outline-primary");
            $(this).addClass("btn-primary");
          } else {
            //$this.val($("#passeye-"+i).val());  
            $this.attr('type', 'text');
            $this.addClass("show");
            $(this).addClass("btn-outline-primary");
            $(this).removeClass("btn-primary");
          }
        });
      });

      if(esNuevo){
        $('#cambiopass > div.modal-body > div:nth-child(1)').append(etiquetaAviso);
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
        if(!document.querySelector('#modal-resp')){
          $("#cambiopass .modal-body").prepend(`<div id="modal-resp"></div>`);
        }
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
      setTimeout(function () {
        if (typeof ITER !== 'undefined') {
          return modalUserNew.load();
        } else {
          activarIter();
        }
      }, 400) ;
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
                      <div class="template-meta-favorite-action" value="${dat.name}" id="${dat.id}" title="Seguir tema" onclick="if (!window.__cfRLUnblockHandlers) return false; meta_favorite_action('${dat.id}')" style="/* display:none; */">
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

var activarIterPerfil = async function(){
  setTimeout(function () {
    if (typeof ITER !== 'undefined') {
      return modalUserNew.load();
    } else {
      activarIterPerfil();
    }
  }, 400) ;
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
    ITER.FAVORITE.TOPICS.onLoad(function(){
      // TOPICS
      $(".template-meta-favorite-action").each(function(){
        if (ITER.FAVORITE.TOPICS.isFavorite($(this).attr("id"))){
          jQryIter(this).addClass("remove");
        } else {
          jQryIter(this).addClass("add");
        }
      });
      // var classListaTemas = document.querySelector('#listado-temas');
      // classListaTemas.classList.remove("isDisabled");
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
               <div class="keywords font-2 fs13">
                  <div class="template-meta-favorite-action" value="${dat.name}" id="${dat.id}" title="Seguir tema" onclick="if (!window.__cfRLUnblockHandlers) return false; meta_favorite_action('${dat.id}')" style="/* display:none; */">
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

    document.querySelector('#segTemasPerfil').innerHTML = `
    <div class="contenido-modal">
      <button class="collapsible_mp active_mp mp_title">También te puede interesar</button>
      <div class="listado-temas " id="listado-temas" style=" overflow: auto;">
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
    activarIterPerfil();
    /*Activa iter con el modal*/
    var existemodal = setInterval(function () {
        if ((typeof $().modal == 'function')) {
            // $('#segTemasPerfil').modal('show');

            $('#btn_enviar_seguimiento_tema').click(function(){
              if(!modalUserNewPerfil.existeTemaSeguimiento().existe){
                alert('Debe seleccionar al menos 1');
                return false;
              }
              ECUAVISA_EC.SET_user('wylexStatusPerfil', 1);
              ECUAVISA_EC.SET_user('wylexUserAlertView', false);
              /*CAMBIA EL ESTADO DEL MODAL CUANDO EL USUARIO TIENE SELECCIONADO YA SUS INTERESES, Y YA NO MUESTRA EL ALERT*/
              // $('#segTemasPerfil').modal('hide');

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
// modalUserNewPerfil.init()
/************BLOQUE SEGUIMIENTO DE INTERESES************/




    var perfil = {
      init: () => {
        eyesPass();
        perfil.notificaciones.listar();
        perfil.noticias.listar();

        modalUserNew.modalAlert();
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
                swiperNotificaciones();
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
              swiperNotificaciones();
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
      }
      else{
        window.location.assign("/servicios/perfil/");
      }	
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

// ##############BUENAS PRACTICAS##################
if (!ECUAVISA_EC.login() && urlParamsGET.get('tk')==null){ /*Si no existe sesión lo va a redireccionar al login */
}else{  DataEntrada();  DatosPersonales();   }
// ################################################

    
    //suscriptionDymanic();
    /*#Notificaciones: iniciar loader*/
    let $article = document.querySelector('.notificationBox .noticias');
    $article.innerHTML = perfil.notificaciones.loader();
    
    
    let $articleNoticiasSave = document.querySelector('.NoticiasGuardadasBox .noticias');
    $articleNoticiasSave.innerHTML = perfil.noticias.loader();
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

moverContenidoAyuda();

/*============================FIN AYUDA=================================== */


/*================================REDIRECCION EMERGENTE=================================== */

// setTimeout(function () {
//     window.location.href = 'https://www.ecuavisa.com/compania593';
// }, 1860);

/*============================FIN REDIRECCION EMERGENTE=================================== */