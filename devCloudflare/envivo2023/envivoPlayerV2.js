const programacionLunes_a_Viernes = [

  //LUNES A VIERNES
  { inicio: "00:00:00", fin: "05:55:00", titulo: "En Vivo" },
  { inicio: "05:55:00", fin: "06:55:00", titulo: "Televistazo en la comunidad" },
  { inicio: "06:55:00", fin: "07:30:00", titulo: "Contacto Directo" },
  { inicio: "07:30:00", fin: "09:00:00", titulo: "Televistazo en la comunidad" },
  { inicio: "10:30:00", fin: "13:00:00", titulo: "En Contacto" },
  { inicio: "13:00:00", fin: "14:00:00", titulo: "Televistazo 13h00" },
  { inicio: "14:00:00", fin: "16:20:00", titulo: "En Vivo" },
  { inicio: "16:20:00", fin: "17:00:00", titulo: "En Vivo" },
  { inicio: "17:00:00", fin: "18:00:00", titulo: "En Vivo" },
  { inicio: "18:00:00", fin: "19:00:00", titulo: "En Vivo" },
  { inicio: "19:00:00", fin: "20:30:00", titulo: "Televistazo 19h00" },
  { inicio: "20:30:00", fin: "22:30:00", titulo: "En Vivo" },
  { inicio: "23:30:00", fin: "23:59:59", titulo: "En Vivo" },


];

const programacionSabado = [
  { inicio: "19:00:00", fin: "19:30:00", titulo: "Televistazo 19h00" }
];

const programacionDomingo = [
  { inicio: "10:30:00", fin: "11:30:00", titulo: "Políticamente Correcto" },
  { inicio: "19:00:00", fin: "22:00:00", titulo: "Debate Presidencial" },
  
  // { inicio: "19:00:00", fin: "20:00:00", titulo: "Televistazo 19h00" },
  // { inicio: "20:00:00", fin: "21:00:00", titulo: "Políticamente Correcto" },
];



function TVforzado(titulo, status) {
  //seleccionamos el div del player 
  var playerEnvivo = document.querySelector("#programacion_forzado");
  var playerProg = document.querySelector("#programacion");
  playerProg.remove();

  //variable del html a pintar
  let tvforzadoenvivo = `
    <div class="title_programa">${titulo}</div>
    <div id="playerembed-forzado" style="display:block!important;margin:auto;text-align:center;"></div>
  `;

  //creamos el html nuevo dentro de la clase player-envivo
  playerEnvivo.innerHTML = tvforzadoenvivo;

  var player = new MediastreamPlayer("playerembed-forzado", playerOptions);
  player.videoPlay();
  console.log("RD TV FORZADO");

}

function showTelevistazoComunidad() {
  var btnLives = document.getElementById("btnTelcomunidad");
  // console.log("si es comunidad");
  if (btnLives) {
    // btnLives.removeClass("d-none");
    btnLives.style.display = "block";
  }
}

function mostrarProgramacion() {
  const ahora = new Date();
  const dia = ahora.getDay();
  const hora = ahora.getHours().toString().padStart(2, "0") + ':' + ahora.getMinutes().toString().padStart(2, "0") + ':' + ahora.getSeconds().toString().padStart(2, "0");
  // console.log(dia,hora)

  let programacion = [];

  // Elegir programación según día de la semana
  switch (dia) {
    case 0:
      programacion = programacionDomingo;
      break;
    case 6:
      programacion = programacionSabado;
      break;
    default:
      programacion = programacionLunes_a_Viernes;
      break;
  }

  let enProgramacion = false;
  let tituloPrograma = "";
  // let fuenteVideo = "";

  //Verificar si estamos dentro del horario de programación
  for (let i = 0; i < programacion.length; i++) {
    const programa = programacion[i];
    if (hora >= programa.inicio && hora <= programa.fin) {
      enProgramacion = true;
      tituloPrograma = programa.titulo;
      if (tituloPrograma === "Televistazo en la comunidad") {
        showTelevistazoComunidad();
      } else {
        // console.log("no es comunidad")
      }
      // fuenteVideo = "https://www.youtube.com/embed/<ID_DEL_VIDEO>?autoplay=1&controls=0";
      break;
    }
  }

  // Mostrar u ocultar elementos según corresponda
  const divProgramacion = document.getElementById("programacion");
  const h1Titulo = divProgramacion.querySelector(".title_programa");
  const videoPlayer = divProgramacion.querySelector("#playerembed");
  const videoPlayerIframe = document.querySelector("#playerembed iframe");
  const imagenApagado = divProgramacion.querySelector("#programacion #fondito__");
  var btnLives = document.getElementById("btnTelcomunidad");
  // videoPlayerIframe ? videoPlayerIframe.setAttribute("hidden","") : "";

  let forzadoEvent = localStorage.getItem("playerForzado");
  // console.log("forzadoEvent:", forzadoEvent)

  if (forzadoEvent != "true") {
    if (enProgramacion) {
      h1Titulo.innerText = tituloPrograma;
      // videoPlayer.src = fuenteVideo;
      h1Titulo.style.display = "block";
      videoPlayer.style.display = "block";
      imagenApagado.style.display = "none";
      videoPlayerIframe ? videoPlayerIframe.removeAttribute("hidden") : "";
    } else {
      h1Titulo.innerText = "";
      h1Titulo.style.display = "none";
      videoPlayer.style.display = "none";
      videoPlayerIframe ? videoPlayerIframe.setAttribute("hidden","") : "";
      imagenApagado.style.display = "block";
      btnLives ? btnLives.style.display = "none" : '';
    }

  } else { }


  // Llamar a la función de nuevo cada medio minuto
  setTimeout(mostrarProgramacion, 30000);
}

// Iniciar el ciclo de verificación
mostrarProgramacion();