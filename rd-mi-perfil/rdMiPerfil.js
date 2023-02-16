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
  await fetch("https://ecuavisa-login-service.onrender.com/tasks", requestOptions)
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
            content.style.maxHeight = content.scrollHeight + "px";
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
      selectImg.innerHTML = `<img src="${getAvatar}" alt="${getFirstName}">`;
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
      $('#btnSaveM').click(function (e) {
        var pass = $('#pass').val();
        var passrepeat = $('#passrepeat').val();
        if (perfil.contrasenia.validarPass() && pass != '' && passrepeat != '') {
          alert('Enviado')
        } else {
          alert('Contraseñas no coinciden o están vacías')
        }
      })
    }
    
    /************MODAL DE SEGUIMIENTO DE INTERESES************/
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
        });
      },
      body:function(){
        var temasSeguir = ``;
        for(var i in modalUserNew.temas){
          var ins = modalUserNew.temas[i];
          temasSeguir+= `<div class="item_tema t_${ins.id}">
                           <div class="keywords font-2 fs13">
                              <div class="template-meta-favorite-action" value="${ins.name}" id="${ins.id}" title="Seguir tema" onclick="if (!window.__cfRLUnblockHandlers) return false; meta_favorite_action('${ins.id}')" style="/* display:none; */">
                                 <button type="button" class="button_seguir btn btn-default btn-sm btn-modal-seguir">

                                    <small>${ins.name}</small>

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
        document.querySelector('#modal_body_seguimiento_tema').innerHTML = `
        <div class="contenido-modal">
           <p class="parrafo-modal">
            Para ofrecerte una mejor experiencia elige los intereses que se ajusten a ti.
           </p>
           <p class="mis-intereses-modal">
            Mis intereses
           </p>
           <div class="listado-temas" id="listado-temas">
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
        this.load();
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
                  fetch("https://ecuavisa-login-service.onrender.com/updatestatususer", {
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
        {id:'58812355', name:'elecciones 2023'},
        {id:'18537', name:'Guayaquil'},
        {id:'7627344', name:'Colombia'},
        {id:'26853867', name:'RBD'},
        {id:'13941431', name:'Tour'},
      ]
    }
    /************FIN MODAL DE SEGUIMIENTO DE INTERESES************/

    var perfil = {
      init: () => {
        eyesPass();
        perfil.notificaciones.listar();
        perfil.noticias.listar();

        modalUserNew.modalAlert();
        if(ECUAVISA_EC.USER_data('isnewuser') == 0){
          /*****MOSTRAMOS EL MODAL SI EL USUARIO ES NUEVO******/
          modalUserNew.init();
        }
        ITER.FAVORITE.TOPICS.onLoad(function(){});
        setTimeout(function () {
          $('body').append(`<style>
            .init-page-js .content_mp .temas-hot .botones__, 
            .init-page-js .content_mp .temas-quemado .botones__{
              display: initial;
            }
            </style>`);
        }, 700);
        
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
          userId = ECUAVISA_EC.USER_data('wylexUserId');
          var raw = JSON.stringify({
            "id": userId
          });
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
          };
    
          let $articles = '';
          let $idusuario = ECUAVISA_EC.USER_data('wylexUserId') || 0;
          fetch("https://estadisticas.ecuavisa.com/sites/gestor/zonaPrivada/notificationsget.php", requestOptions).then(response => {
            return response.json();
          }).then(jsondata => {
            if (jsondata.error) {
              perfil.notificaciones.listarUltimas();
            } else {
              for (var i in jsondata.usuario.Notificaciones) {
                const d = jsondata.usuario.Notificaciones[i];
                const iduser = jsondata.usuario.id;
                $articles += perfil.notificaciones.html_(d);
              }
              $article.innerHTML = $articles;
              swiperNotificaciones();
            }
          });
        },
        html_: function (data) {
          return `<article class="article">
                   <div class="text_block">
                      <div class="section">${data.category}</div>
                      <a href="${data.url}"><h3>${data.title}</h3></a>
                   </div>
                   <div class="multimedia"> <a href="${data.url}"><img src="${ ( data.img == '' ? 'https://estadisticas.ecuavisa.com/sites/gestor/Recursos/Image_not_available.png' : data.img) }" alt="${data.title}"></a> </div>
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
        listar: function () {
          var myHeaders = new Headers();
          userId = ECUAVISA_EC.USER_data('wylexUserId');;
          var raw = JSON.stringify({
            "id": userId
          });
          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw
          };
    
          let $articles = '';
          let $idusuario = ECUAVISA_EC.USER_data('wylexUserId') || 0;
          fetch("https://estadisticas.ecuavisa.com/sites/gestor/zonaPrivada/notificationsget.php", requestOptions).then(response => {
            return response.json();
          }).then(jsondata => {
            if (jsondata.error) {
              $articles += 'No tienes notas guardadas';
            } else {
              for (var i in jsondata.usuario.Notificaciones) {
                const d = jsondata.usuario.Notificaciones[i];
                const iduser = jsondata.usuario.id;
                $articles += perfil.noticias.html_(d, i);
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
                      <a href="${data.url}"><img src="${data.img}" alt="${data.title}"></a>
                      <button value="${data.url}" class="btn btn-ecuavisa-noticia active" title="Haz clic para quitar la noticia">
                        <img src="https://ecuavisadev.netlify.app/rd-mi-perfil/assets/saved.svg" width="20" height="20" alt="${data.title}">
                      </button>
                   </div>
                </article>`;
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
    DataEntrada();
    DatosPersonales();
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



