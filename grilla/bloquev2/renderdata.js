moment.locale('es');

var undia = new Date();
let tercermenos = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay() - 3)]
let anteayer = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay() - 2)]
let ayer = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay() - 1)]
let actualDay = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay())]
let manana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay() + 1)]
let pasadomanana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay() + 2)]
let tercermas = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][((undia.getDay() + 3))]
// document.write('hoy es '+ actualDay)
if (ayer === 'Domingo') {
  anteayer = 'Sabado';
  tercermenos = 'Viernes';
} else {};
if (ayer === 'Lunes') {
  tercermenos = 'Sabado';
} else {};
if (ayer === 'Viernes') {
  tercermas = 'Martes';
} else {};
console.log('test dias: ' + ayer);
//console.log('tercer mas es: '+getFecha(+3));
// document.querySelector("."+actualDay+'Tab').click(); // seteamos por defecto el día actual
// document.querySelector(".Tab4").click();
// ##### FIN tab de días de la semana

// selectores del dom
var mainRender = document.getElementsByClassName("jsondata")[0];
var _table = document.getElementsByClassName("puredata")[0];

//validamos si estan cargados los programas
jsonProgramas = []; //declaramos un array vacío
if (localStorage.getItem('programas')) { //evaluamos si se encuentra la key programas
  jsonProgramas = localStorage.getItem('programas'); //si se encuentra, encapsulamos su contenido en esta variable
  renderProgramas(); //corremos la funcion que ordena los programas en el dom
  console.log('existen programas')
} else {
  /* variable para loader */
  console.log('no existen programas');
}


function activeDay(data) {
  var titleProgram = document.querySelector('.t_prog .nameP');
  var titleHorarios = document.querySelector('.t_prog .nameH');
  var itemImage = document.querySelector('.mediaBlock__ .multimedia');
  var liveSignal = document.querySelector('.senal_active');

  var getTitulo = localStorage.getItem('pA');
  var getHor = localStorage.getItem('hIF');
  var getImagen = localStorage.getItem('pIm');
  var strim = `<img src="${getImagen}" alt="ecuavisa">`;



  setTimeout(function () {
    titleHorarios.append(getHor);
    titleProgram.append(getTitulo);
    itemImage.innerHTML= strim;
    // buttonGye.classList.remove("div__hide");
    if (getTitulo == "Tres Familias" ||
      getTitulo == "Asi Pasa" ||
      getTitulo == "Combo Amarillo" ||
      getTitulo == "Televistazo Comunidad Guayaquil Rr" ||
      getTitulo == "Televistazo Estelar Rr") {
      // buttonGye.classList.add("div__hide");
    } else {
      // console.log("no es tele comunidad");
    }
    if (getTitulo == "Televistazo  Al  Amanecer" || getTitulo == "Televistazo En La Comunidad") {
      console.log("si es tele comunidad");
      buttonQuito.classList.remove("div__hide");
      buttonGye.classList.remove("div__hide");
    } else {
      // console.log("no es tele comunidad");
    }
  }, 700);

  var d = new Date();
  var day = d.getDay();
  var hour = d.getHours();
  var min = d.getMinutes();
  var t = d.getTime();
  var name = "";
  let envivo = false;
  timeOfDay =
    d.getHours().toString().padStart(2, "0") +
    ":" +
    d.getMinutes().toString().padStart(2, "0");

  setTimeout(function () {
    console.log(data)
    var el = $(`tr.programaItem.${data}`).addClass('active-item');
  }, 700);
}



var swiperComponente = document.querySelector('.componente');
var swiperWrapperClass = document.querySelector('.componente .programList');
var swiperSlideClass = document.querySelectorAll('.componente .programList .programaItem');

swiperComponente.classList.add('swiper');
swiperWrapperClass.classList.add('swiper-wrapper');

for (const swiperSlideClas of swiperSlideClass) {
  swiperSlideClas.classList.add('swiper-slide');
}

var getNItem = localStorage.getItem("nItem");
var numSlider = getNItem - 1;

var swiperProgramacionWeb = new Swiper('.componente', {
  slidesPerView: 1.5,
  spaceBetween: 10,
  initialSlide: numSlider,
  scrollbar: {
    el: ".swiper-scrollbar",
    hide: true,
  },
  breakpoints: {
    425: {
      slidesPerView: 1.5,
      spaceBetween: 10,
    },
    600: {
      slidesPerView: 2.5,
      spaceBetween: 10,
    },
    768: {
      slidesPerView: 2.5,
      spaceBetween: 10,
    },
    1024: {
      slidesPerView: 4.5,
      spaceBetween: 10,
    },
  },
});



function renderProgramas() {
  var _jsonProgramas = JSON.parse(jsonProgramas); // convertiomos el json.stringify  de localstorage en json normal
  var programaItems = _jsonProgramas.length;
  // console.log(programaItems);
  // mainRender.innerHTML = (jsonProgramas);
  var _jsonDiaActual = [];
  var contador = 1;
  var obtenerDia = {
    weekday: 'long'
  };
  var obtenerDiaMes = {
    month: 'short',
    day: 'numeric'
  };

  // Inicio de recorrido de cada elemento 

  for (programIndex = 0; programIndex < programaItems; programIndex++) {
    // variables de programas
    // var horahoy= fechahoy('hora');
    var programName = _jsonProgramas[programIndex].programa;
    var region = _jsonProgramas[programIndex].region; //3 costa - 2 sierra - 5 internacional
    var programDate = _jsonProgramas[programIndex].fecha; //.replace('-0', '-'); //revisar si presenta problemas en horario
    var programImg = _jsonProgramas[programIndex].imagen;
    //console.log(moment(_jsonProgramas[programIndex].hora_inicio, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss"))
    //console.log(_jsonProgramas[programIndex].hora_inicio)
    var horai = _jsonProgramas[programIndex].hora_inicio; //moment(_jsonProgramas[programIndex].hora_inicio, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss");
    var horaf = _jsonProgramas[programIndex].hora_fin; //moment(_jsonProgramas[programIndex].hora_inicio, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss");

    var programTimeIni = moment(horai, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss");
    var programTimeEnd = moment(horaf, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss");

    if ((programIndex + 1) != programaItems) {
      programTimeEnd = moment(_jsonProgramas[programIndex + 1].hora_inicio, "YYYY-MM-DD HH:mm:ss").format("HH:mm:ss");
      //console.log(programIndex + ' - '+programaItems);
    }

    var ActualClass = 'px-4 py-4 text-zinc-50 bg-ecuavisa text-sm flex items-center'
    var imgs = 'https://via.placeholder.com/70'
    var programas = $(`
      <tr class=" programaItem el-${contador}" data-item="${programName}">                
          <td class="">
              <div class="">
                  <p>${programTimeIni.slice(0, -3)} - ${programTimeEnd.slice(0, -3)}</p>
                  <p class="">${programName}</p>                         
              </div>
          </td>                
      </tr>       
    `);

    if (region === '3') { // validamos que sea region costa


      // ################dia de hoy
      if (fechahoy('fecha') === (programDate)) {
        var contador = (contador) + 1; //subimos el valor de contador para la clase unica
        var programaData = { //objeto del programa
          "nombrePrograma": programName,
          "HoradeFin": programTimeEnd,
          "HoradeInicio": programTimeIni,
          "Fecha": programDate,
          "Imagen": programImg
        }
        _jsonDiaActual.push(programaData);
        //   console.log(programaData);

        programas.appendTo('.dataProg');

        //obtenemos formateada la hora actual 
        var d = new Date();
        timeOfDay = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;

        var currentTime = moment(timeOfDay, "HH:mm:ss");
        var startTime = moment(programTimeIni, "HH:mm:ss");
        var endTime = moment(programTimeEnd, "HH:mm:ss");


        var entra = false;

        if ((currentTime.isBetween(startTime, endTime)) && !entra) {

          /**/

          var entra = true;
          var elemento = 'el-' + (contador - 1);
          var numeroSwiper = (contador - 1);
          var pA = programName;
          var pIm = programImg;
          var hIF = programTimeIni.slice(0, -3) + ' -' + programTimeEnd.slice(0, -3);

          // Setiamos los datos al localstorage para despues recuperarlo en el html
          localStorage.setItem('programaActual', elemento);
          localStorage.setItem('nItem', numeroSwiper);
          localStorage.setItem('pA', pA);
          localStorage.setItem('hIF', hIF);
          localStorage.setItem('pIm', pIm);


          // var showActive = 'bg-blue-800';
          console.log("Programa actualLLLL: " + programName);
          itemtored = localStorage.getItem('programaActual');
          activeDay(itemtored);
        } else {}

        // programas.appendTo('.Tab4data');

        var todayx = new Date().toLocaleDateString("es-ES", obtenerDiaMes);
        // var hoyes  = new Date().toLocaleDateString("es-ES", obtenerDia);
        // $('.Tab4').html(`HOY<div class="fecha-text">${todayx}</div>`);
        //metemos al dom el programa
        // console.log('la fecha de hoy es '+fechahoy('fecha')+' y coincide con '+programDate);
      } else {
        /*console.log('la fecha de hoy es '+fechahoy('fecha')+' y no coincide con '+programDate);*/
      }



    } else {
      console.log("region diferente a costa")
    };
    //     /* para navegar entre elementos dentro se usa otro for como el ejemplo 
    //     for (noteIndex = 0; noteIndex < notesLength; noteIndex++) {
    //         console.log(JSON.infos.info[infoIndex].note.notes[noteIndex].title);
    //     } */
  }
  //console.log(_jsonDiaActual);
  localStorage.setItem('programasHoy', JSON.stringify(_jsonDiaActual));

  //dumbDataEri
  getProgramasHoy = localStorage.getItem('programasHoy');
  JsonProgramasHoy = JSON.parse(getProgramasHoy);
  // console.log('Su programa elegido es: '+JsonProgramasHoy[1].nombrePrograma);
  // _table.classList.add('hidden');
}