//var dHoy = fechahoy('hora'); //asignamos la fecha de hoy a una variable

var dHoy = new Date();


if(localStorage.getItem('dHoy')){// evaluamos si la key "dHoy" existe
    var otra = localStorage.getItem('dHoy');
    var difHora = Math.abs( (dHoy - new Date(otra)) / (60*60*1000));
    console.log("dHoy",new Date(dHoy));
    console.log("local storage", otra);
    console.log("Dif hora",difHora);
    if(difHora < 2){ //si existe verificamos que sea igual que el dia actual
        //si coincide cargamos la parrilla existente en la key "programas"
        console.log('fecha coincide - cargar parrilla precargada');
        //cargaParrilla();
        // filterData();
    }else{ // si no es igual al día actual cargamos la data de la parrilla actual
       cargaParrilla();
    }
}else{// si no existe también cargamos la data de la parrilla actual
    cargaParrilla2();
    cargaParrilla();
    // filterData();
    // localStorage.setItem('dHoy', dHoy);
}
// if(localStorage.getItem('programas')){ console.log('parrilla previamente cargada') }
// else{ //realizar carga de csv
    function cargaParrilla2(){ console.log('fecha no coincide');}
    async function cargaParrilla(){
        // ##### carga de la grilla en dom
        console.log('cargando parrilla...')
        localStorage.setItem('dHoy', dHoy);
        onload = await fetch("https://programacion-ecuavisa.vercel.app/0").then(res => {
            return res.json()
        }).then(data => { //\r?\n|\r
           
            //creamos cabeceras
            let th = document.createElement("thead");
            let thc = `<tr>
            <th>0</th>
            <th>1programa</th>
            <th>2descripción</th>
            <th>3</th><th>4</th><th>5</th><th>6</th>
            <th>7Region</th>
            <th>8día</th>
            <th>9mes</th>
            <th>10año</th><th>11</th>
            <th>12hora inicio</th>
            <th>13hora fin</th>
            <th>14</th><th>15</th><th>16</th><th>17</th>
            <th>18fecha</th>
            <th>19</th><th>20</th><th>21</th><th>22</th>
            <th>23id</th>
            <th>24imagen</th>
            </tr>`;
            th.innerHTML = thc;
            if (th.innerText != "") { document.querySelector("table").appendChild(th); }
            // creamos tbody
            let ctb = document.createElement("tbody");
            document.querySelector('table').appendChild(ctb);
            data.forEach(e => { //recorremos cada dato y creamos las filas
                
                let m = `<td></td><td>${e.programa}</td><td> </td><td></td><td></td><td></td><td></td>
                <td>${e.region}</td><td>${e.día}</td><td>${e.mes}</td><td></td><td></td><td>${e.hora_inicio}</td><td>${e.hora_fin}</td>
                <td></td><td></td><td></td><td></td><td>${e.fecha}</td><td></td><td></td><td></td><td></td><td>${e.id}</td><td>${e.imagen}</td>`;
                // let m = m1.replace('""','');
                let ce = document.createElement("tr");
                // ce.id = m.slice(-1)[0]
                ce.innerHTML = m;
                if (ce.innerText != "") { document.querySelector("tbody").appendChild(ce); }
            })

                 filterData(); //luego de cargar datos vamos a estructurarlos en esta funcion, se encuentra en filterdata.js
        })
        // ##### Fin carga de la grilla en dom
    }
// } // fin carga de csv