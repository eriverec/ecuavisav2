
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
let tercermenos = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay()-3)]
let anteayer = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay()-2)]
let ayer = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay()-1)]
let actualDay = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay())]
let manana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay()+1)]
let pasadomanana = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][(undia.getDay()+2)]
let tercermas = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo', 'Lunes'][((undia.getDay()+3))]
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

timeOfDay = d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");
console.log(timeOfDay);

// prueba si timeOfDay está dentro de un marco de tiempo determinado
if (day > 0 && day <= 5) {
    //validacion de lunes a viernes
    if ("05:55" <= timeOfDay && timeOfDay <= "06:55") {
      activeBlock(1);
      showTelevistazoAmanecerComunidad();
    } else if ("16:10" <= timeOfDay && timeOfDay <= "17:00") {
      
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

function renderProgramas(){
    var _jsonProgramas = JSON.parse(jsonProgramas); // convertiomos el json.stringify  de localstorage en json normal
    var programaItems= _jsonProgramas.length;
    // console.log(programaItems);
    // mainRender.innerHTML = (jsonProgramas);

    var lists = [];

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
                    <p class="p-2 ml-3 text-gray-900 whitespace-no-wrap"> ${programName} - ${programTimeIni} ----- ${[programIndex+1]} </p>
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
