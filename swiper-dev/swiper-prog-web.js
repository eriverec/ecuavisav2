
  var d = new Date();
  var day = d.getDay();
  var hour = d.getHours();
  var min = d.getMinutes();
  var t = d.getTime();
  var name = "";

  // Crear variables de los elementos a ocultar
  const hideMenuEnvivo = document.querySelector('.sect-81d0c9805a5bf069ec4be1a657699d8b');
  const liveSignal = document.querySelector('.senal_active');
  const buttonGye = document.querySelector('.btn-gye');
  const buttonQuito = document.querySelector('.btn-quito');

  // Ocultar los div si ya no hay transmision
  hideMenuEnvivo.classList.add("div__hide");
  liveSignal.classList.add("div__hide");
  buttonGye.classList.add("div__hide");
  buttonQuito.classList.add("div__hide");
  
  console.log("dia " + day, "hora " + hour, "minuto " + min);

  timeOfDay = d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
  console.log(timeOfDay);

  function showTelevistazoAmanecerComunidad() {
    buttonQuito.classList.remove("div__hide");
  }

  function activeBlock(val) {
    hideMenuEnvivo.classList.remove("div__hide");
    hideMenuEnvivo.classList.add("active_envivo");
    liveSignal.classList.remove("div__hide");
    buttonGye.classList.remove("div__hide");
    
    var valDynamic = document.querySelector('.lista-programacion-bloque .noticias .article .BLOQUE_PROG_TIT_TXT.n' + val + ' .text_block .text .text-wrapper');
    valDynamic.classList.add('activeBG');
    var dataParrafo = document.querySelector('.text-wrapper.activeBG');
    var secondParagraph = dataParrafo.getElementsByTagName("p")[1].innerText;
    var titleProgram = document.querySelector('.t_prog p');

    titleProgram.append(secondParagraph);
    localStorage.setItem("nItem", val);

    var swiperClass = document.querySelector('.lista-programacion-bloque');
    var swiperWrapperClass = document.querySelector('.lista-programacion-bloque .noticias');
    var swiperSlideClass = document.querySelectorAll('.lista-programacion-bloque .noticias article');

    swiperClass.classList.add('swiper');
    swiperWrapperClass.classList.add('swiper-wrapper');
    
    for (const box of swiperSlideClass) {      
      box.classList.add('swiper-slide');    
    }
  
    var dpagination = document.createElement("div");
    dpagination.classList = "swiper-scrollbar";
    swiperClass.append(dpagination);

    var getNItem = localStorage.getItem("nItem");    
    var numSlider = getNItem - 1;
   

    var swiperProgramacionWeb = new Swiper(swiperClass, {
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
    var swiperClass = document.querySelector('.lista-programacion-bloque');
    var swiperWrapperClass = document.querySelector('.lista-programacion-bloque .noticias');
    var swiperSlideClass = document.querySelectorAll('.lista-programacion-bloque .noticias article');

    swiperClass.classList.add('swiper');
    swiperWrapperClass.classList.add('swiper-wrapper');
    for (const box of swiperSlideClass) {      
      box.classList.add('swiper-slide');    
    }

    var dpagination = document.createElement("div");
    dpagination.classList = "swiper-scrollbar";
    swiperClass.append(dpagination);

    var swiperProgramacionWeb = new Swiper(swiperClass, {
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
