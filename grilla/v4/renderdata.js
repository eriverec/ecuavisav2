
// ##### tabs de días de la semana
let tabsContainer = document.querySelector("#tabs");
let tabTogglers = tabsContainer.querySelectorAll("a");
tabTogglers.forEach(function(toggler) {
    toggler.addEventListener("click", function(e) {
        e.preventDefault();
        let tabName = this.getAttribute("href");
        let tabContents = document.querySelector("#tab-contents");

        for (let i = 0; i < tabContents.children.length; i++) {
            tabTogglers[i].parentElement.classList.remove("border-blue-400", "bg-blue-600",  "-mb-px", "text-zinc-50");  tabContents.children[i].classList.remove("hidden");
            if ("#" + tabContents.children[i].id === tabName) { continue; }
            tabContents.children[i].classList.add("hidden");
        }
        e.target.parentElement.classList.add("border-blue-400", "bg-blue-600", "-mb-px", "text-zinc-50");
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
console.log('test dias: '+anteayer);
//console.log('tercer mas es: '+getFecha(+3));
document.querySelector("."+actualDay+'Tab').click(); // seteamos por defecto el día actual

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


function renderProgramas(){
    var _jsonProgramas = JSON.parse(jsonProgramas); // convertiomos el json.stringify  de localstorage en json normal
    var programaItems= _jsonProgramas.length;
    // console.log(programaItems);
    // mainRender.innerHTML = (jsonProgramas);
    var _jsonDiaActual = [];
    var contador = 1;
    // Inicio de recorrido de cada elemento 
    for (programIndex = 0; programIndex < programaItems; programIndex++) {
        // variables de programas
        var horahoy= fechahoy('hora');
        var programName= _jsonProgramas[programIndex].programa;
        var region= _jsonProgramas[programIndex].region; //3 costa - 2 sierra - 5 internacional
        var programDate= _jsonProgramas[programIndex].fecha//.replace('-0', '-'); //revisar si presenta problemas en horario
        var programTimeIni= _jsonProgramas[programIndex].hora_inicio.replace(_jsonProgramas[programIndex].fecha, '');
        var programTimeEnd= _jsonProgramas[programIndex].hora_fin.replace(_jsonProgramas[programIndex].fecha, '');
        
        var ActualClass= 'px-4 py-4 text-zinc-50 bg-white text-sm flex items-center'
        var imgs= 'https://via.placeholder.com/70'
        var programas= $(`
            <tr class="programaItem el-${contador}" data-item="${programName}${programTimeIni}">
                <td class="border-b border-gray-100 bg-white text-sm flex items-center">
                    <img src="${imgs}" alt="">
                    <p class="p-2 ml-3 text-gray-900 whitespace-no-wrap"> ${programName} - ${programTimeIni} - -${contador}</p>
                </td>
                <td class="px-4 py-4 border-b border-gray-100 bg-white text-sm hidden">
                    <span class="bg-green-200">Activo</span>
                </td>
            </tr>       
        `);

        if (region === '3' ){ // validamos que sea region costa
        

            // var jsonDiaActual = function(index){
            //     programaData = { //objeto del programa
            //         "nombrePrograma" : programName,
            //         "HoradeInicio" : programTimeIni,
            //         "Fecha" : programDate,
            //         "Region": region}    
            //     _jsonDiaActual.push(programaData); //creamos listado de programas en json
            // };

            // dia de hoy
            if (fechahoy('fecha') === (programDate) ){
                var contador = (contador)+1;
                // jsonDiaActual(programIndex); 
                var programaData = { //objeto del programa
                    "nombrePrograma" : programName,
                    "HoradeFin" : programTimeEnd,
                    "HoradeInicio" : programTimeIni,
                    "Fecha" : programDate}   
                    _jsonDiaActual.push(programaData); 
                 //   console.log(programaData);
                // console.log('La hora del momento es :'+horahoy)
                // console.log('La hora del progra  es :'+programTimeIni);
                var fixitem = $('.programaItem').data('item');
                    // if(horahoy < programTimeIni){
                    //   console.log("Fecha actual es mayor");
                    // }else{
                    //   console.log("Fecha actual es menorrrrrrrrrrrrrrr ######");
                    // }
                    // console.log(horahoy,programTimeIni);

                    // var fecha2 = new Date('1/1/1990 06:07'); 
                    // var fecha1 = new Date('1/1/1990 05:12');
                     
                    // if(fecha2 <= fecha1) {return [false,'Hora final debe ser mayor a hora inicial']; }
                    //  else {return [true,'']; }

                    programas.appendTo('.'+actualDay); //metemos al dom el programa
            // console.log('la fecha de hoy es '+fechahoy('fecha')+' y coincide con '+programDate);
            }else{ /*console.log('la fecha de hoy es '+fechahoy('fecha')+' y no coincide con '+programDate);*/ }

            // ayer
            if (getFecha(-1) === (programDate) ){
                    programas.appendTo('.'+ayer); //metemos al dom el programa
                 /*console.log( 'Ayer fue: '+ getFecha(-1) +' y coincide con: '+programDate )*/
            }else{ /*console.log('Ayer fue: '+ getFecha(-1) +' y no coincide con: '+programDate) */}
            // anteayer
            if (getFecha(-2) === (programDate) ){
                // var fixitem = $('.programaItem').data('item');
                // if (fixitem === (`${programName}${programTimeIni}`) ){ $(fixitem).remove() }else{};
            // programas.appendTo('.'+anteayer.toLowerCase());
                programas.appendTo('.'+anteayer);
            // console.log('Anteayer fue: '+ getFecha(-2) +' coincide con: '+programDate) 
            }else{ /*console.log('Anteayer fue: '+ getFecha(-2) +' y no coincide con: '+programDate) */ }
            // tercermenos
            if (getFecha(-3) === (programDate) ){
                var fixitem = $('.programaItem').data('item');
                if (fixitem === (`${programName}${programTimeIni}`) ){ $(fixitem).remove() }else{};
                programas.appendTo('.'+tercermenos);
            // programas.appendTo('.'+tercermenos.toLowerCase());
            }else{ }
            // manana
            if (getFecha(+1) === (programDate) ){
                var fixitem = $('.programaItem').data('item');
                if (fixitem === (`${programName}${programTimeIni}`) ){ $(fixitem).remove() }else{};
            // programas.appendTo('.'+manana.toLowerCase());
            programas.appendTo('.'+manana);
            }else{ }
            // pasadomanana
            if (getFecha(+2) === (programDate) ){
                var fixitem = $('.programaItem').data('item');
                if (fixitem === (`${programName}${programTimeIni}`) ){ $(fixitem).remove() }else{};
            programas.appendTo('.'+pasadomanana);
            // console.log('Pasadomañana es: '+ getFecha(+2) +' coincide con: '+programDate); 
            }else{/*console.log('Pasadomañana es: '+ getFecha(+2) +' y no coincide con: '+programDate) */  }
            // tercermas
            if (getFecha(+3) === (programDate) ){
                var fixitem = $('.programaItem').data('item');
                if (fixitem === (`${programName}${programTimeIni}`) ){ $(fixitem).remove() }else{};
                // console.log('tercer mas es '+pasadomanana)
            programas.appendTo('.'+tercermas);
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
    console.log('Su programa elegido es: '+JsonProgramasHoy[1].nombrePrograma);
    // _table.classList.add('hidden');
}
