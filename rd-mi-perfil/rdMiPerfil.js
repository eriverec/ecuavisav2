

function collapse () {
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
      dynamicBullets:true
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

function eyesPass(){
  $("input[type='password'][data-eye]").each(function(i) {
      var $this = $(this),
        id = 'eye-password-' + i,
        el = $('#' + id);

      $this.wrap($("<div/>", {
        style: 'position:relative',
        id: id
      }));

      $this.css({
        paddingRight: 60
      });
      $this.after($("<div/>", {
        html: 'Ver',
        class: 'btn btn-primary btn-sm btn-eyes',
        id: 'passeye-toggle-'+i,
      }).css({
          position: 'absolute',
          right: 10,
          top: ($this.outerHeight() / 2) + 5,
          //padding: '2px 7px',
          //fontSize: 12,
          cursor: 'pointer',
      }));

      $this.after($("<input/>", {
        type: 'hidden',
        id: 'passeye-' + i
      }));

      var invalid_feedback = $this.parent().parent().find('.invalid-feedback');

      if(invalid_feedback.length) {
        $this.after(invalid_feedback.clone());
      }

      $this.on("keyup paste", function() {
        $("#passeye-"+i).val($(this).val());
      });
      $("#passeye-toggle-"+i).on("click", function() {
        if($this.hasClass("show")) {
          $this.attr('type', 'password');
          $this.removeClass("show");
          $(this).removeClass("btn-outline-primary");
          $(this).addClass("btn-primary");
        }else{
          $this.val($("#passeye-"+i).val());  
          $this.attr('type', 'text');      
          $this.addClass("show");
          $(this).addClass("btn-outline-primary");
          $(this).removeClass("btn-primary");
        }
      });
    });
}

let perfil = {
  notificaciones:{
    listar:function(){
      eyesPass();
      let $articles = '';
      let $idusuario = localStorage.getItem('wylexUserId') || 0;
      fetch("https://estadisticas.ecuavisa.com/sites/gestor/zonaPrivada/getNotifications/index.php").then(response => {
         return response.json();
      }).then(jsondata => {
        for(var i in jsondata.usuario.Notificaciones){
          const d = jsondata.usuario.Notificaciones[i];
          //if($idusuario == jsondata.usuario.id){
            $articles += perfil.notificaciones.html_(d);
          //}
        }
        $article.innerHTML = $articles;
        swiperNotificaciones();
      });
    },
    html_:function(data){
      return `<article class="article">
               <div class="text_block">
                  <div class="section">${data.category}</div>
                  <h3>${data.title}</h3>
               </div>
               <div class="multimedia"> <img src="${data.img}" alt="${data.title}"> </div>
            </article>`;
    },
    loader:function(data){
      return `<div class="container_loader">
        <div class="loader">
      </div>`;
    }
  }
}
collapse();
DataEntrada();
DatosPersonales();
/*#Notificaciones: iniciar loader*/
let $article = document.querySelector('.notificationBox .noticias');
$article.innerHTML = perfil.notificaciones.loader();
/*#Fin notificaciones: iniciar loader*/
let init_jQuery_Swiper = function(){
  setTimeout(function () {
    return ((window.jQuery && (typeof Swiper !== 'undefined')) ?perfil.notificaciones.listar():init_jQuery_Swiper());
  }, 400) ;
}
init_jQuery_Swiper();