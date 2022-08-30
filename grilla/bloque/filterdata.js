// ##### Estructurado de Datos obtenidos de la tabla

function filterData(){

    // #### Construcción de Json de programas - build json structure
    // var _table = document.getElementsByClassName("puredata")[0];
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

    localStorage.setItem('programas', JSON.stringify(_jsonProgramas)); //agregamos a localStorage los datos convertidos
    // mainRender.innerHTML = (JSON.stringify(_jsonProgramas)) // pintamos en un div los datos de _jsonProgramas  (test)
    console.log('Datos convertidos con exito');
    // #### Fin Construción de Json de programas - END build json structure

    var programaItems= _jsonProgramas.length;
    for (programIndex = 0; programIndex < programaItems; programIndex++) {
        var programName = _jsonProgramas[programIndex].programa;
        mainRender.innerHTML = (programName+'<br><br>');
        // console.log(programName);
    }
 setTimeout(location.reload(), 100);
} // end filter data function
// ##### Fin de estructurado de datos obtenidos