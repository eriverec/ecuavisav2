if(localStorage.getItem('programas')){ console.log('parrilla previamente cargada') }
else{ //realizar carga de csv

    // ##### carga de la grilla en dom
    console.log('cargando parrilla...')
    onload = fetch("files/parrilla_ecuavisa.csv").then(res => {
        return res.text()
    }).then(data => { //\r?\n|\r
        let result1 = data.replace //funcion avanzada de reemplazo de datos, si descripción trae errores en comas, se las repara aquí
        (/Eco,|Barriales ,| , |Entretenimiento,|, |os,Su/gi,
            function (x) {
          return x.replace(',','..');
        }) 
        let result2 = result1.replace //funcion avanzada que filtra y soluciona acentos
        (/As�|d�n|en�|A�o|m�ri|dem�s|r�a/gi,
            function (x) {
            r1 = x.replace('As�','Así');        r2 = r1.replace('d�n','dón');
            r3 = r2.replace('en�','enó');       r4 = r3.replace('A�o','Año');
            r5 = r4.replace('dem�s','demás');   r6 = r5.replace('r�a','ría');
            r7 = r6.replace('m�ri','méri');
          return r7.replace('ue�o','ueño');
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

            filterData(); //luego de cargar datos vamos a estructurarlos en esta funcion, se encuentra en filterdata.js
    })
    // ##### Fin carga de la grilla en dom

} // fin carga de csv