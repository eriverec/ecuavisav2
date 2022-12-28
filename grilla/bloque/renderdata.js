// ##### tabs de días de la semana
let tabsContainer = document.querySelector("#tabs");
let tabTogglers = tabsContainer.querySelectorAll("a");
tabTogglers.forEach(function (toggler) {
    toggler.addEventListener("click", function (e) {
        e.preventDefault();
        let tabName = this.getAttribute("href");
        let tabContents = document.querySelector("#tab-contents");

        for (let i = 0; i < tabContents.children.length; i++) {
            tabTogglers[i].parentElement.classList.remove("border-blue-400", "bg-blue-600", "-mb-px", "text-zinc-50");
            tabContents.children[i].classList.remove("hidden");
            if ("#" + tabContents.children[i].id === tabName) {
                continue;
            }
            tabContents.children[i].classList.add("hidden");
        }
        e.target.parentElement.classList.add("border-blue-400", "bg-blue-600", "-mb-px", "text-zinc-50");
    });
});
// Obtenemos el día actual
tercer_mas = getFecha(-2);
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
// console.log('test dias: ' + tercermenos);
//console.log('tercer mas es: '+getFecha(+3));
document.querySelector("." + actualDay + 'Tab').click(); // seteamos por defecto el día actual
var buttonQuito = document.querySelector('.btn-quito');
var buttonGye = document.querySelector('.btn-gye');
buttonGye.classList.add("div__hide");
buttonQuito.classList.add("div__hide");
// ##### FIN tab de días de la semana
console.log("Dia actual: ", fechahoy('fecha'));
var d = new Date();
timeOfDay = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
console.log("Hora actual: ", timeOfDay)
//funcion del dia actual
function activeDay(clase) {
    // i = document.getElementsByClassName(clase)[0];
    // i.classList.add('activeRedy');
    var titleProgram = document.querySelector('.t_prog .nameP');
    var titleHorarios = document.querySelector('.t_prog .nameH');
    var liveSignal = document.querySelector('.senal_active');

    var getTitulo = localStorage.getItem('pA');
    var getHor = localStorage.getItem('hIF');

    setTimeout(function () {
        $('.' + clase).addClass('activo');
        titleHorarios.append(getHor);
        titleProgram.append(getTitulo);
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
    // console.log('Se añadio el estilo activo a la siguiente clase: ' + clase);
}

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

var swiperComponente = document.querySelectorAll('.componente');
var swiperWrapperClass = document.querySelectorAll('.componente .programList');
var swiperSlideClass = document.querySelectorAll('.componente .programList .programaItem');

for (const swiperSli of swiperComponente) {
    swiperSli.classList.add('swiper');
}
for (const swiperWra of swiperWrapperClass) {
    swiperWra.classList.add('swiper-wrapper');
}

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
    // liveSignal.classList.add("div__hide");

    var _jsonDiaActual = [];
    var contador = 1;
    // Inicio de recorrido de cada elemento 
    for (programIndex = 0; programIndex < programaItems; programIndex++) {
        // variables de programas
        var horahoy = fechahoy('hora');
        var programName = _jsonProgramas[programIndex].programa;
        var region = _jsonProgramas[programIndex].region; //3 costa - 2 sierra - 5 internacional
        var programDate = _jsonProgramas[programIndex].fecha //.replace('-0', '-'); //revisar si presenta problemas en horario
        var programTimeIni = _jsonProgramas[programIndex].hora_inicio.replace(_jsonProgramas[programIndex].fecha, '');
        var programTimeEnd = _jsonProgramas[programIndex].hora_fin.replace(_jsonProgramas[programIndex].fecha, '');
        var hiddenInactive = 'hidden';
        // var ActualClass = 'px-4 py-4 text-zinc-50 bg-white text-sm flex items-center';
        var imgs = 'https://via.placeholder.com/70';
        var activeState = ' ';

        // console.log('inicio:',programTimeIni.slice(0, -3))

        var programas = $(`
            <div class="programaItem el-${contador} ${activeState}" data-inicio="${programTimeIni.slice(0, -3)}" data-name="${programName}" data-item="${programTimeIni.slice(0, -3)} -${programTimeEnd.slice(0, -3)}">
                <div class="">
                    <p>${programTimeIni.slice(0, -3)} - ${programTimeEnd.slice(0, -3)}</p>
                    <p>${programName}</p>
                </div>
            </div>       
        `);

        if (region === '3') { // validamos que sea region costa

            // dia de hoy
            if (fechahoy('fecha') === (programDate)) {
                var contador = (contador) + 1; //subimos el valor de contador para la clase unica
                var programaData = { //objeto del programa
                    "nombrePrograma": programName,
                    "HoradeFin": programTimeEnd,
                    "HoradeInicio": programTimeIni,
                    "Fecha": programDate
                }
                _jsonDiaActual.push(programaData);

                // console.log(horahoy)
                // console.log(programTimeIni)
                // var div1 = document.querySelectorAll("programaItem");

                //obtenemos formateada la hora actual 
                var d = new Date();
                timeOfDay = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;

                // console.log('DATA-INICIO', programTimeIni.slice(0, -3));
                // console.log(timeOfDay);

                /* Convertir la hora del programa en datos */
                var regExp = /(\d{1,2})\:(\d{1,2})\:(\d{1,2})/;

                var hini = parseInt(programTimeIni.replace(regExp, "$1$2$3"));
                var hfin = parseInt(programTimeEnd.replace(regExp, "$1$2$3"));
                var timeAc = parseInt(timeOfDay.replace(regExp, "$1$2$3"));

                var contador = contador;
                /* Validacion del programa de la hora actual */
                if (hini <= timeAc && timeAc <= hfin) {
                    var elemento = 'el-' + (contador - 1);
                    var numeroSwiper = (contador - 1);
                    var pA = programName;
                    var hIF = programTimeIni.slice(0, -3) + ' -' + programTimeEnd.slice(0, -3);

                    // Setiamos los datos al localstorage para despues recuperarlo en el html
                    localStorage.setItem('programaActual', elemento);
                    localStorage.setItem('nItem', numeroSwiper);
                    localStorage.setItem('pA', pA);
                    localStorage.setItem('hIF', hIF);

                    console.log("Programa actual: " + programName);
                    itemtored = localStorage.getItem('programaActual');
                    activeDay(itemtored);
                } else {}

                //   console.log(programaData);
                // console.log('La hora del momento es :'+horahoy)
                // console.log('La hora del progra  es :'+programTimeIni);
                var fixitem = $('.programaItem').data('item');

                programas.appendTo('.' + actualDay); //metemos al dom el programa
                // console.log('la fecha de hoy es '+fechahoy('fecha')+' y coincide con '+programDate);
            } else {
                /*console.log('la fecha de hoy es '+fechahoy('fecha')+' y no coincide con '+programDate);*/
            }

            // ayer
            if (getFecha(-1) === (programDate)) {
                programas.appendTo('.' + ayer); //metemos al dom el programa
                /*console.log( 'Ayer fue: '+ getFecha(-1) +' y coincide con: '+programDate )*/
            } else {
                /*console.log('Ayer fue: '+ getFecha(-1) +' y no coincide con: '+programDate) */
            }
            // anteayer
            if (getFecha(-2) === (programDate)) {
                // var fixitem = $('.programaItem').data('item');
                // if (fixitem === (`${programName}${programTimeIni}`) ){ $(fixitem).remove() }else{};
                // programas.appendTo('.'+anteayer.toLowerCase());
                programas.appendTo('.' + anteayer);
                // console.log('Anteayer fue: '+ getFecha(-2) +' coincide con: '+programDate) 
            } else {
                /*console.log('Anteayer fue: '+ getFecha(-2) +' y no coincide con: '+programDate) */
            }
            // tercermenos
            if (getFecha(-3) === (programDate)) {
                var fixitem = $('.programaItem').data('item');
                if (fixitem === (`${programName}${programTimeIni}`)) {
                    $(fixitem).remove()
                } else {};
                programas.appendTo('.' + tercermenos);
                // programas.appendTo('.'+tercermenos.toLowerCase());
            } else {}
            // manana
            if (getFecha(+1) === (programDate)) {
                var fixitem = $('.programaItem').data('item');
                if (fixitem === (`${programName}${programTimeIni}`)) {
                    $(fixitem).remove()
                } else {};
                // programas.appendTo('.'+manana.toLowerCase());
                programas.appendTo('.' + manana);
            } else {}
            // pasadomanana
            if (getFecha(+2) === (programDate)) {
                var fixitem = $('.programaItem').data('item');
                if (fixitem === (`${programName}${programTimeIni}`)) {
                    $(fixitem).remove()
                } else {};
                programas.appendTo('.' + pasadomanana);
                // console.log('Pasadomañana es: '+ getFecha(+2) +' coincide con: '+programDate); 
            } else {
                /*console.log('Pasadomañana es: '+ getFecha(+2) +' y no coincide con: '+programDate) */
            }
            // tercermas
            if (getFecha(+3) === (programDate)) {
                var fixitem = $('.programaItem').data('item');
                if (fixitem === (`${programName}${programTimeIni}`)) {
                    $(fixitem).remove()
                } else {};
                // console.log('tercer mas es '+pasadomanana)
                programas.appendTo('.' + tercermas);
            } else {}

        } else {};

    }
    //console.log(_jsonDiaActual);
    localStorage.setItem('programasHoy', JSON.stringify(_jsonDiaActual));

    //dumbDataEri
    getProgramasHoy = localStorage.getItem('programasHoy');
    JsonProgramasHoy = JSON.parse(getProgramasHoy);


}