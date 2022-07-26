

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
let weekday = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'][new Date().getDay()]
// document.write('hoy es '+ weekday)
document.querySelector("."+weekday).click(); // seteamos por defecto el día actual

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
        var programName= _jsonProgramas[programIndex].programa;
        var programDate= _jsonProgramas[programIndex].fecha.replace('-0', '-'); //revisar si presenta problemas en horario
        var programTimeIni= _jsonProgramas[programIndex].hora_inicio.replace(_jsonProgramas[programIndex].fecha, ' ');

        if (fechahoy('fecha') === (programDate) ){
        $(`
            <tr>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm flex items-center">
                    <img src="" alt="">
                    <p class="ml-3 text-gray-900 whitespace-no-wrap"> ${programName} - ${programTimeIni} </p>
                </td>
                <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <span class="bg-green-200">Activo</span>
                </td>
            </tr>        <p></p>
        <p>${programDate}</p>

        `).appendTo('.programList');
        }else{ console.log('programas sin coincidencias: '+programName+' '+programDate); }
    //     /* para navegar entre elementos dentro se usa otro for como el ejemplo 
    //     for (noteIndex = 0; noteIndex < notesLength; noteIndex++) {
    //         console.log(JSON.infos.info[infoIndex].note.notes[noteIndex].title);
    //     } */
    }

    _table.classList.add('hidden');
}
