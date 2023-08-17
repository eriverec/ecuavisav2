function actDIV() {
  const envi_ = document.querySelector(".enVivoRedy");
  if (envi_) {
    envi_.style.display = "flex";
  }
}

const selectDivRad = document.getElementById("parent_radio");
selectDivRad.setAttribute("style", "display: none");
function acRadio() {
  if (ECUAVISA_EC.login()) {
    if (selectDivRad) {
      selectDivRad.setAttribute("style", "display: block");
    }
  }
}

var d = new Date();
var day = d.getDay();
var hour = d.getHours();
var min = d.getMinutes();
var t = d.getTime();

timeOfDay =
  d.getHours().toString().padStart(2, "0") +
  ":" +
  d.getMinutes().toString().padStart(2, "0");
if (day > 0 && day <= 5) {
  //validacion de lunes a viernes
  // if ("07:30" <= timeOfDay && timeOfDay <= "09:00") {
  //     comunidadHeight();
  // }

  if ("00:00" <= timeOfDay && timeOfDay <= "05:55") {
    actDIV();
  } else if ("05:55" <= timeOfDay && timeOfDay <= "09:00") {
    actDIV();
    acRadio();
  } else if ("10:30" <= timeOfDay && timeOfDay <= "13:00") {
    actDIV();
  } else if ("13:00" <= timeOfDay && timeOfDay <= "14:00") {
    actDIV();
    acRadio();
  } else if ("14:00" <= timeOfDay && timeOfDay <= "19:00") {
    actDIV();
    acRadio();
  } else if ("19:00" <= timeOfDay && timeOfDay <= "20:30") {
    actDIV();
    acRadio();
  } else if ("20:30" <= timeOfDay && timeOfDay <= "22:30") {
    actDIV();
  } else if ("23:30" <= timeOfDay && timeOfDay <= "00:00") {
    actDIV();
  } else {
  }
} else if (day === 6) {
  if ("19:00" <= timeOfDay && timeOfDay <= "19:30") {
    actDIV();
    acRadio();
  } else {
  }
} else {
  if ("10:30" <= timeOfDay && timeOfDay <= "11:30") {
    actDIV();
    acRadio();
  } else if ("19:00" <= timeOfDay && timeOfDay <= "20:00") {
    actDIV();
    acRadio();
  } else if ("20:00" <= timeOfDay && timeOfDay <= "21:00") {
    actDIV();
  } else {
  }
}

function getConfigPlayerIndicador() {
  var xhr = new XMLHttpRequest();
  // var url = "url?data=" + encodeURIComponent(JSON.stringify({"email": "hey@mail.com", "password": "101010"}));
  var url =
    "https://estadisticas.ecuavisa.com/sites/gestor/Tools/envivo/getforcedplayer.php";
  xhr.open("GET", url, true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var datoJson = JSON.parse(xhr.responseText);
      datoJson.estadoActivo
        ? actDIV()
        : console.log("player Inactivo Indicador");
      // console.log(datoJson.titulo + ", " + datoJson.estadoActivo);
    }
  };
  xhr.send();
}
getConfigPlayerIndicador();
