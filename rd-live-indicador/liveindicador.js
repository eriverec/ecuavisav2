


function actDIV() {
  var indicador = document.querySelector('.enVivoRedy .liveIndicator');
  document.querySelector('.enVivoRedy').style.display= 'flex';
  // indicador.classList.add('pard__envivo');
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

  if ("05:55" <= timeOfDay && timeOfDay <= "09:00") {
      actDIV();      
  } else if ("10:30" <= timeOfDay && timeOfDay <= "16:00") {
      actDIV();
  } else if ("18:00" <= timeOfDay && timeOfDay <= "23:00") {
      actDIV();
  } else {}
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
  } else {}
}