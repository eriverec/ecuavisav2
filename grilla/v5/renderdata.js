
// ##### tabs de días de la semana
let tabsContainer = document.querySelector("#tabs");
let tabTogglers = tabsContainer.querySelectorAll("a");
tabTogglers.forEach(function(toggler) {
    toggler.addEventListener("click", function(e) {
        e.preventDefault();
        let tabName = this.getAttribute("href");
        let tabContents = document.querySelector("#tab-contents");

        for (let i = 0; i < tabContents.children.length; i++) {
            tabTogglers[i].parentElement.classList.remove("border-blue-400", "text-zinc-100", "bg-blue-700");  
            tabTogglers[i].parentElement.classList.add("next-days");
            tabContents.children[i].classList.remove("hidden");
            if ("#" + tabContents.children[i].id === tabName) { continue; }
            tabContents.children[i].classList.add("hidden");
        }

        e.target.parentElement.classList.add("border-blue-400", "bg-blue-700", "text-zinc-100");
    });
});
// Obtenemos el día actual
tercer_mas = getFecha(-2);
var undia = new Date();
let tercermenos = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay()-3)]
let anteayer = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay()-2)]
let ayer = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay()-1)]
let actualDay = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay())]
let manana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay()+1)]
let pasadomanana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay()+2)]
let tercermas = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][((undia.getDay()+3))]
// document.write('hoy es '+ actualDay)
if (ayer === 'Domingo') { anteayer = 'Sabado'; tercermenos = 'Viernes';}else{};
if (ayer === 'Lunes') { tercermenos = 'Sabado';}else{};
if (ayer === 'Viernes') { tercermas = 'Martes';}else{};
console.log('test dias: '+ayer);
//console.log('tercer mas es: '+getFecha(+3));
// document.querySelector("."+actualDay+'Tab').click(); // seteamos por defecto el día actual
document.querySelector(".Tab4").click();
// ##### FIN tab de días de la semana

// selectores del dom
var mainRender = document.getElementsByClassName("jsondata")[0];
var _table = document.getElementsByClassName("puredata")[0];

//validamos si estan cargados los programas
jsonProgramas = []; //declaramos un array vacío
if(localStorage.getItem('programas')){ //evaluamos si se encuentra la key programas
    jsonProgramas = localStorage.getItem('programas'); //si se encuentra, encapsulamos su contenido en esta variable
     renderProgramas(); //corremos la funcion que ordena los programas en el dom
     console.log('existen programas') 
 }else{ /* variable para loader */ console.log('no existen programas'); }

function activeDay(data){
    // $('div[data-item=' + slide + ']').addClass("selected");
    setTimeout(function(){
        el = $('.programaItem.el-'+ data);
        $(el).find('p.bg-indigo-700.datafont').addClass("bg-blue-800");
        console.log(el);
    } , 700);
}

function renderProgramas(){
    var _jsonProgramas = JSON.parse(jsonProgramas); // convertiomos el json.stringify  de localstorage en json normal
    var programaItems= _jsonProgramas.length;
    // console.log(programaItems);
    // mainRender.innerHTML = (jsonProgramas);
    var _jsonDiaActual = [];
    var contador = 1;
    var obtenerDia = { weekday: 'long' };
    var obtenerDiaMes = { month: 'short', day: 'numeric' };

    // Inicio de recorrido de cada elemento 
    for (programIndex = 0; programIndex < programaItems; programIndex++) {
        // variables de programas
        var horahoy= fechahoy('hora');
        var programName= _jsonProgramas[programIndex].programa;
        var region= _jsonProgramas[programIndex].region; //3 costa - 2 sierra - 5 internacional
        var programDate= _jsonProgramas[programIndex].fecha//.replace('-0', '-'); //revisar si presenta problemas en horario
        var programTimeIni= _jsonProgramas[programIndex].hora_inicio.replace(_jsonProgramas[programIndex].fecha, '');
        var programTimeEnd= _jsonProgramas[programIndex].hora_fin.replace(_jsonProgramas[programIndex].fecha, '');
        var showActive= 'bg-indigo-700';
        var ActualClass= 'px-4 py-4 text-zinc-50 bg-ecuavisa text-sm flex items-center'
        var imgs= 'https://via.placeholder.com/70'
        var programas= $(`
            <tr class=" programaItem el-${contador}" data-item="${programName}${programTimeIni}">
                
                <td class="px-0 pl-3 py-3 text-center border-0 bg-ecuavisa text-sm w-1/4 items-center text-zinc-300">
                    <p class=" border-b-4 border-zinc-500 py-5 text-center whitespace-no-wrap datafont">
                        <b>${programTimeIni}</b> <br>
                        mins
                    </p>
                </td>
                <td class="px-0 pr-3 py-3 border-0 bg-ecuavisa text-sm  w-3/4 items-center">
                    <p class=" border-b-4 border-zinc-500 py-5 px-3 border-0 text-zinc-300 ${showActive} whitespace-no-wrap datafont">
                    <b>${programName}</b> <br> ${programTimeIni}
                    </p>
                </td>
                
            </tr>       
        `);

        if (region === '3' ){ // validamos que sea region costa
        

            // var jsonDiaActual = function(index){ //creacion de objeto de programa por funcion
            //     programaData = { //objeto del programa
            //         "nombrePrograma" : programName,
            //         "HoradeInicio" : programTimeIni,
            //         "Fecha" : programDate,
            //         "Region": region}    
            //     _jsonDiaActual.push(programaData); //creamos listado de programas en json
            // };
            // jsonDiaActual(programIndex); 

            // ################dia de hoy
            if (fechahoy('fecha') === (programDate) ){
                var contador = (contador)+1; //subimos el valor de contador para la clase unica
                var programaData = { //objeto del programa
                    "nombrePrograma" : programName,
                    "HoradeFin" : programTimeEnd,
                    "HoradeInicio" : programTimeIni,
                    "Fecha" : programDate}   
                    _jsonDiaActual.push(programaData);
                 //   console.log(programaData);

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

                    var showActive= 'bg-blue-800';
                    console.log("Programa actualLLLL: " + programName);
                    itemtored = localStorage.getItem('programaActual');
                    activeDay(itemtored);
                } else {}






                    programas.appendTo('.Tab4data');
            
                    var todayx  = new Date().toLocaleDateString("es-ES", obtenerDiaMes);
                    // var hoyes  = new Date().toLocaleDateString("es-ES", obtenerDia);
                    $('.Tab4').html(`HOY<div class="fecha-hoy">${todayx}</div>`);
                     //metemos al dom el programa
            // console.log('la fecha de hoy es '+fechahoy('fecha')+' y coincide con '+programDate);
            }else{ /*console.log('la fecha de hoy es '+fechahoy('fecha')+' y no coincide con '+programDate);*/ }

            // ################### ayer
            if (getFecha(-1) === (programDate) ){
                var ayer  = new Date(getFecha(-0)).toLocaleDateString("es-ES", obtenerDia);
                    programas.appendTo('.Tab3data'); //metemos al dom el programa
                    $('.Tab3').html('<h3>Ayer</h3><br><p'+ayer+'</p');
                    $('.Tab3').parent('li').addClass('hidden');
                /* console.log( 'Ayer fue: '+ getFecha(-1) +' y coincide con: '+ayer )*/
            }else{ /*console.log('Ayer fue: '+ getFecha(-1) +' y no coincide con: '+programDate) */}
            // ################### anteayer
            if (getFecha(-2) === (programDate) ){
                // var fixitem = $('.programaItem').data('item');
                // if (fixitem === (`${programName}${programTimeIni}`) ){ $(fixitem).remove() }else{};
                // programas.appendTo('.'+anteayer.toLowerCase());
                var anteayer  = new Date(getFecha(-1)).toLocaleDateString("es-ES", obtenerDia);
                programas.appendTo('.Tab2data'); //metemos al dom el programa
                $('.Tab2').html('<h3>'+anteayer+'</h3><p>'+programDate+'</p>');
                $('.Tab2').parent('li').addClass('hidden');
                // programas.appendTo('.Tab2data');
            // console.log('Anteayer fue: '+ getFecha(-2) +' coincide con: '+programDate) 
            }else{ /*console.log('Anteayer fue: '+ getFecha(-2) +' y no coincide con: '+programDate) */ }
            // ###################  tercermenos
            if (getFecha(-3) === (programDate) ){
                var tercermenos  = new Date(getFecha(-2)).toLocaleDateString("es-ES", obtenerDia);
                programas.appendTo('.Tab1data'); //metemos al dom el programa
                $('.Tab1').html('<h3>'+tercermenos+'</h3><h3>'+programDate+'</h3>');
                $('.Tab1').parent('li').addClass('hidden');
            }else{ }
            // ###################  manana
            if (getFecha(+1) === (programDate) ){
                var mananaDate  = new Date(getFecha(+2)).toLocaleDateString("es-ES", obtenerDiaMes);
                var manana  = new Date(getFecha(+2)).toLocaleDateString("es-ES", obtenerDia);
                programas.appendTo('.Tab5data'); //metemos al dom el programa
                $('.Tab5').html('MAÑANA<br>'+mananaDate+' ');
                // $('.Tab1').parent('li').addClass('hidden');

            }else{ }
            // ###################  pasadomanana
            if (getFecha(+2) === (programDate) ){
                var pmananaDate  = new Date(getFecha(+3)).toLocaleDateString("es-ES", obtenerDiaMes);
                var pmanana  = new Date(getFecha(+3)).toLocaleDateString("es-ES", obtenerDia);
                programas.appendTo('.Tab6data'); //metemos al dom el programa
                $('.Tab6').html(''+pmanana+'<br>'+pmananaDate+'');
            
            }else{/*console.log('Pasadomañana es: '+ getFecha(+2) +' y no coincide con: '+programDate) */  }
            // ###################  tercermas
            if (getFecha(+3) === (programDate) ){
                var tercermasDate  = new Date(getFecha(+4)).toLocaleDateString("es-ES", obtenerDiaMes);
                var tercermas  = new Date(getFecha(+4)).toLocaleDateString("es-ES", obtenerDia);
                programas.appendTo('.Tab7data'); //metemos al dom el programa
                $('.Tab7').html('<h3>'+tercermas+'</h3><br><h3>'+tercermasDate+'</h3>');
                $('.Tab7').parent('li').addClass('hidden');
            }else{ }

        }else{};
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
