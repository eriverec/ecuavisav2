

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

let perfil = {
  notificaciones:{
    listar:function(){
      console.log('Entrando leer json');
      /**/
      $.ajax({
          url: 'https://estadisticas.ecuavisa.com/sites/gestor/zonaPrivada/getNotifications/index.php',
          type: 'GET',
          dataType: 'JSON',
          beforeSend: function() {}
      }).done(function(data) {
          console.log(data);
          return;
      }).fail(function(jqXHR, textStatus, errorThrown) {
          if (jqXHR.status === 0) {
            alert('Not connect: Verify Network.');
          } else if (jqXHR.status == 404) {
            alert('Requested page not found [404]');
          } else if (jqXHR.status == 500) {
            alert('Internal Server Error [500].');
          } else if (textStatus === 'parsererror') {
            alert('Requested JSON parse failed.');
          } else if (textStatus === 'timeout') {
            alert('Time out error.');
          } else if (textStatus === 'abort') {
            alert('Ajax request aborted.');
          } else {
            alert('Uncaught Error: ' + jqXHR.responseText);
          }
      });
    }
  }
}
collapse();
DataEntrada();
DatosPersonales();

var time_jquery = setInterval(function() {
    if (window.jQuery) {
      if(typeof Swiper !== 'undefined'){
          swiperNotificaciones();
          perfil.notificaciones.listar();

          clearInterval(time_jquery);
        }
    }
}, 500);