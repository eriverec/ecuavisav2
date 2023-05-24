const programacionLunes_a_Viernes = [
  { inicio: "05:55", fin: "06:55", titulo: "Televistazo en la comunidad" },
  { inicio: "06:55", fin: "07:30", titulo: "Contacto Directo" },
  { inicio: "07:30:00", fin: "12:00:00", titulo: "Televistazo en la comunidad" },
  // { inicio: "10:43:00", fin: "10:45:00", titulo: "En Contacto" },
  { inicio: "13:00:00", fin: "14:00:00", titulo: "Televistazo 13h00" },
  { inicio: "19:00:00", fin: "20:00:00", titulo: "Televistazo 19h00" }
];

const programacionSabado = [
  { inicio: "19:00:00", fin: "19:30:00", titulo: "Televistazo 19h00" }
];

const programacionDomingo = [
  { inicio: "10:30:00", fin: "11:30:00", titulo: "Políticamente Correcto" },
  { inicio: "19:00:00", fin: "20:00:00", titulo: "Televistazo 19h00" }

];


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

  // Verificar si estamos dentro del horario de programación
  for (let i = 0; i < programacion.length; i++) {
    const programa = programacion[i];
    if (hora >= programa.inicio && hora <= programa.fin) {
      enProgramacion = true;
      tituloPrograma = programa.titulo;
      // fuenteVideo = "https://www.youtube.com/embed/<ID_DEL_VIDEO>?autoplay=1&controls=0";
      break;
    }
  }

  // Mostrar u ocultar elementos según corresponda
  // const divProgramacion = document.getElementById("programacion");
  const h1Titulo = document.querySelector(".title_programa_text");
  const tituloEstasEscu = document.querySelector(".title_estas_escuchando");
  const embedPlayer = document.querySelector(".contenedor_embed_radio");
  const imagenApagado = document.querySelector("#no_transmision__");

  if (enProgramacion) {
    h1Titulo.innerText = tituloPrograma;
    // h1Titulo.style.display = "block";
    // tituloEstasEscu.display = "block";
    tituloEstasEscu.innerText = "Estas escuchando";
    embedPlayer.style.display = "block";
    imagenApagado.style.display = "none";
  } else {
    h1Titulo.innerText = "";
    // h1Titulo.style.display = "none";
    tituloEstasEscu.innerText = "";
    embedPlayer.style.display = "none";
    imagenApagado.style.display = "block";
  }

  // Llamar a la función de nuevo cada medio minuto
  setTimeout(mostrarProgramacion, 3000);
}

// Iniciar el ciclo de verificación
mostrarProgramacion();