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
console.log('test dias: ' + tercermenos);
//console.log('tercer mas es: '+getFecha(+3));
document.querySelector("." + actualDay + 'Tab').click(); // seteamos por defecto el día actual

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
            slidesPerView: 3.5,
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
        var ActualClass = 'px-4 py-4 text-zinc-50 bg-white text-sm flex items-center'
        var imgs = 'https://via.placeholder.com/70'

        // console.log('inicio:',programTimeIni.slice(0, -3))

        var programas = $(`
            <div class="programaItem el-${contador}" data-name="${programName}" data-item="${programTimeIni.slice(0, -3)} -${programTimeEnd.slice(0, -3)}">
                <div class="">
                    <p>${programName}</p>
                    <p>${programTimeIni.slice(0, -3)} - ${programTimeEnd.slice(0, -3)}</p>
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
                // console.log(horahoy)
                // console.log(programTimeIni)
                
                // console.log(programaData.nombrePrograma);

                if (horahoy >= programTimeIni && horahoy <= programTimeEnd) {
                    console.log(programTimeIni)
                }
                _jsonDiaActual.push(programaData);
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

    const liveSignal = document.querySelector('.senal_active');
    const buttonGye = document.querySelector('.btn-gye');
    const buttonQuito = document.querySelector('.btn-quito');

    liveSignal.classList.add("div__hide");
    buttonGye.classList.add("div__hide");
    buttonQuito.classList.add("div__hide");

    var d = new Date();
    var day = d.getDay();
    var hour = d.getHours();
    var min = d.getMinutes();
    var t = d.getTime();
    timeOfDay = `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
    console.log('NUEVA HORA ACTUAL:', timeOfDay);
    const horasWeb = (x) => {
        
        localStorage.setItem("nItem", x);
        document.querySelector(`.programaItem.el-${x}`).classList.add('activo');
        var getActivo = document.querySelector('.programaItem.activo');
        var getAttrNombre = getActivo.getAttribute('data-name');
        var getAttrHorarios = getActivo.getAttribute('data-item');
        var titleProgram = document.querySelector('.t_prog .nameP');
        var titleHorarios = document.querySelector('.t_prog .nameH');

        titleHorarios.append(getAttrHorarios);
        titleProgram.append(getAttrNombre);

        console.log(getAttrNombre);
    }

    const showBtnQuito = () => {
        buttonQuito.classList.remove("div__hide");
    }

    const showBtnGye = () => {
        liveSignal.classList.remove("div__hide");
        buttonGye.classList.remove("div__hide");
    }

    if (day > 0 && day <= 5) {
        //validacion de lunes a viernes
        if ("05:00" <= timeOfDay && timeOfDay <= "06:00") {
            horasWeb(1);
        } else if ("06:00" <= timeOfDay && timeOfDay <= "07:00") {
            horasWeb(2);
            showBtnGye();
            showBtnQuito();
        } else if ("07:00" <= timeOfDay && timeOfDay <= "07:30") {
            horasWeb(3);
            showBtnGye();
        } else if ("07:30" <= timeOfDay && timeOfDay <= "09:00") {
            horasWeb(4);
            showBtnGye();
            showBtnQuito();
        } else if ("09:00" <= timeOfDay && timeOfDay <= "10:30") {
            horasWeb(5);
        } else if ("10:30" <= timeOfDay && timeOfDay <= "13:00") {
            horasWeb(6);
            showBtnGye();
        } else if ("13:00" <= timeOfDay && timeOfDay <= "14:00") {
            horasWeb(7);
            showBtnGye();
        } else if ("14:00" <= timeOfDay && timeOfDay <= "15:00") {
            horasWeb(8);
            showBtnGye();
        } else if ("15:00" <= timeOfDay && timeOfDay <= "16:00") {
            horasWeb(9);
            showBtnGye();
        } else if ("16:00" <= timeOfDay && timeOfDay <= "17:00") {
            horasWeb(10);
        } else if ("17:00" <= timeOfDay && timeOfDay <= "18:00") {
            horasWeb(11);
        } else if ("18:00" <= timeOfDay && timeOfDay <= "19:00") {
            horasWeb(12);
            showBtnGye();
        } else if ("19:00" <= timeOfDay && timeOfDay <= "20:00") {
            horasWeb(13);
            showBtnGye();
        } else if ("20:00" <= timeOfDay && timeOfDay <= "21:00") {
            horasWeb(14);
            showBtnGye();
        } else if ("21:00" <= timeOfDay && timeOfDay <= "22:00") {
            horasWeb(15);
            showBtnGye();
        } else if ("22:00" <= timeOfDay && timeOfDay <= "23:00") {
            horasWeb(16);
            showBtnGye();
        } else if ("23:00" <= timeOfDay && timeOfDay <= "00:00") {
            horasWeb(17);
        } else if ("00:00" <= timeOfDay && timeOfDay <= "00:30") {
            horasWeb(18);
        } else if ("00:30" <= timeOfDay && timeOfDay <= "01:00") {
            horasWeb(19);
        } else if ("01:00" <= timeOfDay && timeOfDay <= "01:30") {
            horasWeb(20);
        } else if ("01:30" <= timeOfDay && timeOfDay <= "02:00") {
            horasWeb(21);
        } else if ("02:00" <= timeOfDay && timeOfDay <= "02:30") {
            horasWeb(22);
        } else if ("02:30" <= timeOfDay && timeOfDay <= "04:00") {
            horasWeb(23);
        } else if ("04:00" <= timeOfDay && timeOfDay <= "05:00") {
            horasWeb(24);
        } else {

        }
    } else if (day === 6) {
        //validacion de sabado
        console.log("es sábado");

        if ("19:00" <= timeOfDay && timeOfDay <= "19:30") {

        } else {

        }
    } else {
        //validacion de domingo
        console.log("es domingo");

        if ("10:30" <= timeOfDay && timeOfDay <= "11:30") {

        } else if ("19:00" <= timeOfDay && timeOfDay <= "19:59") {

        } else {

        }
    }

}