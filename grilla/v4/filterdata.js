// ##### Estructurado de Datos obtenidos de la tabla

function filterData(){

    // #### Construcción de Json de programas -  build json structure
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

    // console.log("html to JSON",_jsonProgramas);
    localStorage.setItem('programas', JSON.stringify(_jsonProgramas));
    // var testa = document.getElementsByClassName("jsondata")[0];
    // testa.innerHTML = (JSON.stringify(_jsonProgramas))
    console.log('cargado programas en JSON');
    // #### END Construción de Json de programas-  build json structure


    var programaItems= _jsonProgramas.length;
    for (programIndex = 0; programIndex < programaItems; programIndex++) {
        // testa.write()
        var programName= _jsonProgramas[programIndex].programa;
        mainRender.innerHTML = (programName+'<br><br>');
        console.log(programName);
        /* para navegar entre elementos dentro se usa otro for como el ejemplo 
        for (noteIndex = 0; noteIndex < notesLength; noteIndex++) {
            console.log(JSON.infos.info[infoIndex].note.notes[noteIndex].title);
        } */
    }
} // end filter data function
// ##### Fin de estructurado de datos obtenidos