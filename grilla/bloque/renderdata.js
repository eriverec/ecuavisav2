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
console.log('test dias: ' + anteayer);
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


        var programName = _jsonProgramas[programIndex].programa;
        var region = _jsonProgramas[programIndex].region; //3 costa - 2 sierra - 5 internacional
        var programDate = _jsonProgramas[programIndex].fecha //.replace('-0', '-'); //revisar si presenta problemas en horario
        var programTimeIni = _jsonProgramas[programIndex].hora_inicio.replace(_jsonProgramas[programIndex].fecha, '');
        var programTimeEnd = _jsonProgramas[programIndex].hora_fin.replace(_jsonProgramas[programIndex].fecha, '');
        var hiddenInactive = 'hidden';
        var ActualClass = 'px-4 py-4 text-zinc-50 bg-white text-sm flex items-center'
        var imgs = 'https://via.placeholder.com/70'

        // console.log('HORA ACTUAL: ',horahoy);


        var programas = $(`
            <tr class="programaItem el-${contador}" data-item="${programTimeIni}">
                <td class="border-b border-gray-100 bg-white text-sm flex flex-wrap flex-col content-start items-center">
                    <div class="p-2 text-gray-900 whitespace-no-wrap">${programTimeIni} - ${programTimeEnd} </div>
                    <div class="p-2">${programName} </div>
                </td>
            </tr>       
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
    console.log('Su programa elegido es: ' + JsonProgramasHoy[1].Fecha);

    var horahoy = fechahoy('hora');

    var link = document.querySelectorAll('.programList.Martes .programaItem');
    var methodxx = link.getAttribute('data-item');
    
    for (const me of methodxx) {
        console.log(me);
    }

    // console.log(method)

    for (programas__ of JsonProgramasHoy) {
        let claseActiva = "";
        // console.log(programas__.Fecha);
        // console.log(programas__.HoradeInicio);
        // console.log(programas__.HoradeFin);
        // var act = document.querySelectorAll('.programList.Martes .el-8');
        // // console.log(act)
        // for (const actx of act) {
        //     actx.classList.add('activo');
        // }



        if (fechahoy('hora') >= programas__.HoradeInicio && fechahoy('hora') <= programas__.HoradeFin) {
            console.log('si activo')
        } else {
            console.log("no activo")
        }
    }

}