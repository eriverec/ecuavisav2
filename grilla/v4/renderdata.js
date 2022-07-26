// ##### tabs de días de la semana
let tabsContainer = document.querySelector("#tabs");
let tabTogglers = tabsContainer.querySelectorAll("a");
tabTogglers.forEach(function(toggler) {
    toggler.addEventListener("click", function(e) {
        e.preventDefault();
        let tabName = this.getAttribute("href");
        let tabContents = document.querySelector("#tab-contents");

        for (let i = 0; i < tabContents.children.length; i++) {
            tabTogglers[i].parentElement.classList.remove("border-blue-400", "border-b",  "-mb-px", "opacity-100");  tabContents.children[i].classList.remove("hidden");
            if ("#" + tabContents.children[i].id === tabName) { continue; }
            tabContents.children[i].classList.add("hidden");
        }
        e.target.parentElement.classList.add("border-blue-400", "border-b-4", "-mb-px", "opacity-100");
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
    // var programaItems= jsonProgramas.length;
    // console.log(programaItems);

    // for (programIndex = 0; programIndex < programaItems; programIndex++) {
    //     // testa.write()
    //     var programName= jsonProgramas[programIndex].programa;
    //     testa.innerHTML = (programName+'<br><br>');
    //     console.log(programName);
    //     /* para navegar entre elementos dentro se usa otro for como el ejemplo 
    //     for (noteIndex = 0; noteIndex < notesLength; noteIndex++) {
    //         console.log(JSON.infos.info[infoIndex].note.notes[noteIndex].title);
    //     } */
    // }

    _table.classList.add('hidden');
}
