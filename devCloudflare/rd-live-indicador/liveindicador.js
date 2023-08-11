function actDIV() {
  // var indicador = document.querySelector('.enVivoRedy .liveIndicator');
  /*var indicadorEleciones = document.querySelector('.eleccionesEnvivoBanner');

  if(indicadorEleciones){
    indicadorEleciones.style.display= 'block';
    console.log('si hay banner elecciones')
  }else{
    console.log('no hay banner elecciones');
  }*/

  // var margtop = document.querySelector('.movil .hm-r02');
  // indicador.classList.add('pard__envivo');
  const envi_ = document.querySelector('.enVivoRedy');
  if(envi_){
    envi_.style.display= "flex";
  }

  var devicesearch;
  var btest=navigator.userAgent.toLowerCase();
  
  if ( /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(btest) ) {
 
    devicesearch = "Tablet";
  } else if( /(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/i.test(btest) ) {

    devicesearch = "Mobile";

    // if(margtop == undefined){
    //   console.log('no exite');
    // }else{
    //   margtop.style.marginTop= '50px';
    //   console.log('exite');
    // }

  } else {
   
    devicesearch = "PC";
  }



}
// function comunidadHeight(){ 
//     $('.HOME_MENU_RD .prog-web-container .iframe__ iframe').css('height', '365px');
//     console.log('height comunidad');
// }

var d = new Date();
var day = d.getDay();
var hour = d.getHours();
var min = d.getMinutes();
var t = d.getTime();

timeOfDay = d.getHours().toString().padStart(2, '0') + ":" + d.getMinutes().toString().padStart(2, '0');
if (day > 0 && day <= 5) {
  //validacion de lunes a viernes
  // if ("07:30" <= timeOfDay && timeOfDay <= "09:00") {
  //     comunidadHeight();
  // }
  // if ("00:00" <= timeOfDay && timeOfDay <= "09:00") {
  //   actDIV();      
  // } else if ("10:30" <= timeOfDay && timeOfDay <= "17:59") {
  //   actDIV();
  // } else if ("18:00" <= timeOfDay && timeOfDay <= "19:00") {
  //   actDIV();
  // } else 
  
  if ("19:00" <= timeOfDay && timeOfDay <= "22:30") {
    actDIV();
  }
  // else if ("23:30" <= timeOfDay && timeOfDay <= "00:00") {
  //   actDIV();
  // } 
  else {}
} 
else if (day === 6) {
  if ("19:00" <= timeOfDay && timeOfDay <= "19:30") {
      actDIV();
  } else {}
} 
else {
  if ("10:30" <= timeOfDay && timeOfDay <= "11:30") {
      actDIV();
  } else if ("19:00" <= timeOfDay && timeOfDay <= "20:00") {
      actDIV();
  } 
  else if ("20:00" <= timeOfDay && timeOfDay <= "21:00") {
    actDIV();
}
  else {}
}



function getConfigPlayerIndicador(){
  var xhr = new XMLHttpRequest();
  // var url = "url?data=" + encodeURIComponent(JSON.stringify({"email": "hey@mail.com", "password": "101010"}));
  var url = "https://estadisticas.ecuavisa.com/sites/gestor/Tools/envivo/getforcedplayer.php";
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
          var datoJson = JSON.parse(xhr.responseText);
          datoJson.estadoActivo ? actDIV() : console.log('player Inactivo Indicador');
          // console.log(datoJson.titulo + ", " + datoJson.estadoActivo);
      }
  };
  xhr.send();
}
getConfigPlayerIndicador();