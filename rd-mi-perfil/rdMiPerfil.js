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


function suscriptionDymanic() {
  $(".categoryListItemPosition").css("display", "none");
  $(".categoryListItem").prepend('<div class="metaTitle"> Tema</div>');
  $(".categoryListItemLink").append(`
  <div class="botones__">
    <div class="button_siguiendo">
      <a class="follow" href="#">
        <span>Siguiendo</span>
        <img src="https://ecuavisadev.netlify.app/rd-podcast/assets/Vector26.svg" alt="check">
      </a>
    </div>
    
    <div class="button_seguir">
      <a class="follow" href="#">
        <span>Seguir</span>
        <img src="https://ecuavisadev.netlify.app/rd-mi-perfil/assets/Add.svg" alt="check">
      </a>
    </div>
  </div>`);
}

function DataEntrada() {
  const getFirstName = localStorage.getItem('wylexFirstName');
  var firstNameUpperCase = getFirstName.charAt(0).toUpperCase() + getFirstName.slice(1);
  var getAvatar = localStorage.getItem('wylexAvatar');
  //Pintar el avatar del usuario
  var selectImg = document.querySelector('.imgAvatar');
  var getAvatarDefault = 'https://redyman.netlify.app/header2022/img/user.png';

  selectImg.innerHTML = `<img src="${getAvatar !== 'null' ? getAvatar : getAvatarDefault}" alt="${getFirstName}">`;

  //Pintar el primer nombre del usuario
  var selectName = document.querySelector('.infoName');
  selectName.innerHTML = `Hola, ${firstNameUpperCase}`;
}

function DatosPersonales() {
  const getFirstName = localStorage.getItem('wylexFirstName');
  const getLastName = localStorage.getItem('wylexLastName');
  const getEmail = localStorage.getItem('wylexEmail');

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

let perfil = {
  init: () => {
    eyesPass();
    perfil.notificaciones.listar();
    perfil.noticias.listar();
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
      userId = localStorage.getItem('wylexUserId');
      var raw = JSON.stringify({
        "id": userId
      });
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
      };

      let $articles = '';
      let $idusuario = localStorage.getItem('wylexUserId') || 0;
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
               <div class="multimedia"> <a href="${data.url}"><img src="${data.img}" alt="${data.title}"></a> </div>
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
      let $idusuario = localStorage.getItem('wylexUserId') || 0;
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
      userId = localStorage.getItem('wylexUserId');
      var raw = JSON.stringify({
        "id": userId
      });
      var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw
      };

      let $articles = '';
      let $idusuario = localStorage.getItem('wylexUserId') || 0;
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
collapse();
DataEntrada();
DatosPersonales();
suscriptionDymanic();
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