
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
tercer_mas = getFecha(+3);
var undia = new Date();
let tercermenos = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][(undia.getDay()-3)]
let anteayer = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][(undia.getDay()-2)]
let ayer = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][(undia.getDay()-1)]
let actualDay = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][(undia.getDay())]
let manana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][(undia.getDay()+1)]
let pasadomanana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][(undia.getDay()+2)]
let tercermas = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado','Domingo'][((undia.getDay()+3))]
// document.write('hoy es '+ actualDay)
console.log('test dias: '+tercermas);
console.log('tercer mas es: '+getFecha(+3));
document.querySelector("."+actualDay+'Tab').click(); // seteamos por defecto el día actual

// ##### FIN tab de días de la semana

// selectores del dom
var mainRender = document.getElementsByClassName("jsondata")[0];
var _table = document.getElementsByClassName("puredata")[0];

//validamos si estan cargados los programas
jsonProgramas = [];
if(localStorage.getItem('programas')){ jsonProgramas = localStorage.getItem('programas'); renderProgramas(); console.log('existen programas') }
else{ /* variable para loader */ console.log('no existen programas'); }


function renderProgramas(){
    var _jsonProgramas = JSON.parse(jsonProgramas); // convertiomos el json.stringify  de localstorage en json normal
    var programaItems= _jsonProgramas.length;
    // console.log(programaItems);
    // mainRender.innerHTML = (jsonProgramas);

    for (programIndex = 0; programIndex < programaItems; programIndex++) {
        // variables de programas
        var horahoy= fechahoy('hora');
        var programName= _jsonProgramas[programIndex].programa;
        var programDate= _jsonProgramas[programIndex].fecha//.replace('-0', '-'); //revisar si presenta problemas en horario
        var programTimeIni= _jsonProgramas[programIndex].hora_inicio.replace(_jsonProgramas[programIndex].fecha, '');

        var ActualClass= 'px-4 py-4 text-zinc-50 bg-white text-sm flex items-center'
        var imgs= 'https://via.placeholder.com/70'
        var programas= $(`
            <tr>
                <td class="border-b border-gray-100 bg-white text-sm flex items-center">
                    <img src="${imgs}" alt="">
                    <p class="p-2 ml-3 text-gray-900 whitespace-no-wrap"> ${programName} - ${programTimeIni} </p>
                </td>
                <td class="px-4 py-4 border-b border-gray-100 bg-white text-sm hidden">
                    <span class="bg-green-200">Activo</span>
                </td>
            </tr>       
        `);
        // dia de hoy
        if (fechahoy('fecha') === (programDate) ){
            // console.log('La hora del momento es :'+horahoy)
            // console.log('La hora del progra  es :'+programTimeIni);

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

        // console.log('la fecha de hoy es '+fechahoy('fecha')+' y coincide con '+programDate);
        programas.appendTo('.'+actualDay);
        }else{ /*console.log('la fecha de hoy es '+fechahoy('fecha')+' y no coincide con '+programDate);*/ }

        // ayer
        if (getFecha(-1) === (programDate) ){
             /*console.log( 'Ayer fue: '+ getFecha(-1) +' y coincide con: '+programDate )*/
        programas.appendTo('.'+ayer);
        }else{ /*console.log('Ayer fue: '+ getFecha(-1) +' y no coincide con: '+programDate) */}
        // anteayer
        if (getFecha(-2) === (programDate) ){
            programas.appendTo('.'+anteayer);
        // programas.appendTo('.'+anteayer.toLowerCase());
        // console.log('Anteayer fue: '+ getFecha(-2) +' coincide con: '+programDate) 
        }else{ }
        // tercermenos
        if (getFecha(-3) === (programDate) ){
            programas.appendTo('.'+tercermenos);
        // programas.appendTo('.'+tercermenos.toLowerCase());
        }else{ }
        // manana
        if (getFecha(+1) === (programDate) ){
        // programas.appendTo('.'+manana.toLowerCase());
        programas.appendTo('.'+manana);
        }else{ }
        // pasadomanana
        if (getFecha(+2) === (programDate) ){
        programas.appendTo('.'+pasadomanana);
        }else{ }
        // tercermas
        if (getFecha(+3) === (programDate) ){
            // console.log('tercer mas es '+pasadomanana)
        programas.appendTo('.'+tercermas);
        }else{ }

    //     /* para navegar entre elementos dentro se usa otro for como el ejemplo 
    //     for (noteIndex = 0; noteIndex < notesLength; noteIndex++) {
    //         console.log(JSON.infos.info[infoIndex].note.notes[noteIndex].title);
    //     } */
    }

    // _table.classList.add('hidden');
}
