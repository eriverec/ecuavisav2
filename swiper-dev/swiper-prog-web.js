/*
1.- swipper mySwiper
2.- swiper-wrapper
3.- swiper-slide

swiper-pagination
swiper-button-prev
swiper-button-next
swiper-scrollbar
*/

$(document).ready(function () {
  var d = new Date();
  var day = d.getDay();
  var hour = d.getHours();
  var min = d.getMinutes();
  var t = d.getTime();
  var name = "";

  // console.log(playerOptions.id);
  $(".sect-81d0c9805a5bf069ec4be1a657699d8b").hide();
  $(".HOME_MENU_RD .img-header-prog .mediaBlock .icon_player_prog").hide();
  $(".HOME_MENU_RD .img-header-prog .mediaBlock .senal_active").hide();
  $(".HOME_MENU_RD .img-header-prog .mediaBlock #rd_cont_botones .btn-gye").hide();
  $('.HOME_MENU_RD .img-header-prog .mediaBlock #rd_cont_botones .btn-quito').hide();

  console.log("dia " + day, "hora " + hour, "minuto " + min);

  timeOfDay = d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
  console.log(timeOfDay);

  function showTelevistazoAmanecerComunidad() {
    $(".HOME_MENU_RD .img-header-prog .mediaBlock #rd_cont_botones .btn-quito").show();
  }

  function activeBlock(val) {
    $(".sect-81d0c9805a5bf069ec4be1a657699d8b").show();
    $(".sect-81d0c9805a5bf069ec4be1a657699d8b").addClass("active_envivo");
    $(`.lista-programacion-bloque .noticias .article .BLOQUE_PROG_TIT_TXT.n${val} .text_block .text .text-wrapper`).addClass("activeBG");
    var res = $(".text-wrapper.activeBG p:eq(1)").text();
    $(".t_prog p").append(res);
    $(".HOME_MENU_RD .img-header-prog .mediaBlock #rd_cont_botones .btn-gye").show();
    $(".HOME_MENU_RD .img-header-prog .mediaBlock .senal_active").show();

    localStorage.setItem("nItem", val);
    console.log("no es nulo, valor:", val);

    $(".lista-programacion-bloque").addClass("swiper");
    $(".lista-programacion-bloque .noticias").addClass("swiper-wrapper");
    $(".lista-programacion-bloque .noticias .article").addClass("swiper-slide");

    var dpagination = document.createElement("div");
    dpagination.classList = "swiper-scrollbar";
    $(".lista-programacion-bloque").append(dpagination);

    var getNItem = localStorage.getItem("nItem");
    // console.log("numero desde swiper prog: ",getNItem);
    var numSlider = getNItem - 1;
    // console.log(numSlider);

    var swiperProgramacionWeb = new Swiper(".lista-programacion-bloque", {
      slidesPerView: 1.5,
      spaceBetween: 10,
      initialSlide: numSlider,
      scrollbar: {
        el: ".swiper-scrollbar",
        hide: true,
      },
      breakpoints: {
        600: {
          slidesPerView: 1.5,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 2.5,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 3.5,
          spaceBetween: 10,
        },
      },
    });
  }

  function desactiveBlock() {
    localStorage.setItem("nItem", '');
    $(".lista-programacion-bloque").addClass("swiper");
    $(".lista-programacion-bloque .noticias").addClass("swiper-wrapper");
    $(".lista-programacion-bloque .noticias .article").addClass("swiper-slide");

    var dpagination = document.createElement("div");
    dpagination.classList = "swiper-scrollbar";
    $(".lista-programacion-bloque").append(dpagination);

    var swiperProgramacionWeb = new Swiper(".lista-programacion-bloque", {
      slidesPerView: 1.5,
      spaceBetween: 10,
      initialSlide: 0,
      scrollbar: {
        el: ".swiper-scrollbar",
        hide: true,
      },
      breakpoints: {
        600: {
          slidesPerView: 1.5,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 2.5,
          spaceBetween: 10,
        },
        1024: {
          slidesPerView: 3.5,
          spaceBetween: 10,
        },
      },
    });
  }


  // prueba si timeOfDay está dentro de un marco de tiempo determinado
  if (day > 0 && day <= 5) {
    //validacion de lunes a viernes
    if ("05:55" <= timeOfDay && timeOfDay <= "06:55") {
      activeBlock(1);
      showTelevistazoAmanecerComunidad();
    } else if ("06:55" <= timeOfDay && timeOfDay <= "07:30") {
      activeBlock(2);
    } else if ("07:30" <= timeOfDay && timeOfDay <= "09:00") {
      activeBlock(3);
      showTelevistazoAmanecerComunidad();
    } else if ("10:30" <= timeOfDay && timeOfDay <= "13:00") {
      activeBlock(4);
    } else if ("13:00" <= timeOfDay && timeOfDay <= "14:00") {
      activeBlock(5);
    } else if ("14:00" <= timeOfDay && timeOfDay <= "15:00") {
      activeBlock(6);
    } else if ("15:00" <= timeOfDay && timeOfDay <= "16:00") {
      activeBlock(6);
    } else if ("18:00" <= timeOfDay && timeOfDay <= "19:00") {
      activeBlock(7);
    } else if ("19:00" <= timeOfDay && timeOfDay <= "19:59") {
      activeBlock(8);
    } else if ("20:00" <= timeOfDay && timeOfDay <= "21:00") {
      activeBlock(9);
    } else if ("21:00" <= timeOfDay && timeOfDay <= "22:00") {
      activeBlock(9);
    } else if ("22:00" <= timeOfDay && timeOfDay <= "23:00") {
      activeBlock(9);
    } else {
      desactiveBlock();
    }
  } else if (day === 6) {
    //validacion de sabado
    console.log("Sábado");
    if ("19:00" <= timeOfDay && timeOfDay <= "19:30") {
      activeBlock(10);
    } else {
      desactiveBlock();
    }
  } else {
    //validacion de domingo
    console.log("Domingo");
    if ("10:30" <= timeOfDay && timeOfDay <= "11:30") {
      activeBlock(11);
    } else if ("19:00" <= timeOfDay && timeOfDay <= "20:00") {
      activeBlock(12);
    } else {
      desactiveBlock();
    }
  }
});