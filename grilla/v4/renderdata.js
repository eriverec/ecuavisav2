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
onload = fetch("files/parrilla_ecuavisa2.csv").then(res => {
    return res.text()
}).then(data => { //\r?\n|\r
    let result = data.split(/\r?\n|\r/).map(e => { return e.split(",") })
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