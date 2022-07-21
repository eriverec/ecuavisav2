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
// ##### tab de días de la semana



// ##### carga de la grilla en dom
onload = fetch("files/parrilla_ecuavisa.csv").then(res => {
    return res.text()
}).then(data => { //\r?\n|\r
    let result1 = data.replace //funcion avanzada de reemplazo de datos
    (/Eco,|Barriales ,| , |Entretenimiento,|, |os,Su/gi,
        function (x) {
      return x.replace(',','..');
    }) 
    let result2 = result1.replace //funcion avanzada de acentos
    (/As�|d�n|en�|A�o|dem�s|r�a/gi,
        function (x) {
        r1 = x.replace('As�','Así');        r2 = r1.replace('d�n','dón');
        r3 = r2.replace('en�','enó');       r4 = r3.replace('A�o','Año');
        r5 = r4.replace('dem�s','demás');   r6 = r5.replace('r�a','ría');
      return r6.replace('ue�o','ueño');
    })     
    let result = result2.split(/\r?\n|\r/).map(e => { return e.split(",") })
    result.forEach(e => {
        let m = e.map(e => { return `<td>${e}</td>`; }).join("")
        let ce = document.createElement("tr");
        // ce.id = m.slice(-1)[0]
        ce.innerHTML = m;
        if (ce.innerText != "") { document.querySelector("table").appendChild(ce); }
        getTableData();
    })
})
// ##### Fin carga de la grilla en dom