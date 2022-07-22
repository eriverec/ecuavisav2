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
    //creamos cabeceras
    let th = document.createElement("thead");
    let thc = `<tr>
    <th>0</th>
    <th>1programa</th>
    <th>2descripción</th>
    <th>3</th><th>4</th><th>5</th><th>6</th><th>7</th>
    <th>8día</th>
    <th>9mes</th>
    <th>10año</th><th>11</th>
    <th>12hora inicio</th>
    <th>13hora fin</th>
    <th>14</th><th>15</th><th>16</th><th>17</th>
    <th>18fecha</th>
    <th>19</th><th>20</th><th>21</th><th>22</th>
    <th>23id</th>
    </tr>`;
    th.innerHTML = thc;
    if (th.innerText != "") { document.querySelector("table").appendChild(th); }
    // creamos tbody
    let ctb = document.createElement("tbody");
    document.querySelector('table').appendChild(ctb);
    result.forEach(e => { //recorremos cada dato y creamos las filas
        let m = e.map(e => { return `<td>${e}</td>`; }).join("")
        // let m = m1.replace('""','');
        let ce = document.createElement("tr");
        // ce.id = m.slice(-1)[0]
        ce.innerHTML = m;
        if (ce.innerText != "") { document.querySelector("tbody").appendChild(ce); }
    })

        getTableData();
})
// ##### Fin carga de la grilla en dom
// let formul = document.getElementsByClassName("formulario")[0];
// let acordeoncito = ($('.titulo-form').find('li'))[0]; console.log(acordeoncito);

// ##### Estructurado de Datos obtenidos de la tabla
function getTableData(){
    // var tb = $('.puredata');
    // var size = tb.find("tr").length;
    // // console.log("Number of rows : " + size);
    // tb.find("tr").each(function(index, element) {
    // var colSize = $(element).find('td').length;
    // var tdId = $(element).find('td').text();
    // // console.log(tdId[-1]);
    // // console.log(tdId);
    // // console.log("  Number of cols in row " + (index + 1) + " : " + colSize);
    // // $(element).find('td').each(function(index, element) {
    //   // var colVal = $(element).text();
    //   // console.log("    Value in col " + (index + 1) + " : " + colVal.trim());
    // // });
    // });      


    // #### Construcción de Json de programas -  build json structure
    var _table = document.getElementsByClassName("puredata")[0];
    var _trLength = _table.getElementsByTagName("tr").length;
    var _jsonProgramas = [];
    var _obj = {};

    var _htmlToJSON = function(index){
        var _tr = _table.getElementsByTagName("tr")[index];
        var _td = _tr.getElementsByTagName("td");
        var _arr = [].map.call( _td, function( td ) {
            return td.innerHTML;
        }).join( ',' );
        var _data = _arr.split(",");
        
        _obj = { //datos de programa y quitamos comillas extras
            id     : parseInt(_data[23].replace(`\"`,''))
            ,programa     : _data[1].replace(/['"]+/g, '')
            ,descripción     : _data[2].replace(/['"]+/g, '')
            ,día     : _data[8].replace(/['"]+/g, '')
            ,mes     : _data[9].replace(/['"]+/g, '')
            ,hora_inicio     : _data[12].replace(/['"]+/g, '')
            ,hora_fin     : _data[13].replace(/['"]+/g, '')
            ,fecha     : _data[18].replace(/['"]+/g, '')
        };
        
        _jsonProgramas.push(_obj); //creamos listado de programas en json
        
    };

    for(var i = 1; i < _trLength; i++){  _htmlToJSON(i); }
    console.log("html to JSON",_jsonProgramas);
    // #### END Construción de Json de programas-  build json structure

} // end get table data function