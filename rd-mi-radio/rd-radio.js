const programacionLunes_a_Viernes = [
  { inicio: "05:55", fin: "06:55", titulo: "Televistazo en la comunidad" },
  { inicio: "06:55", fin: "07:30", titulo: "Contacto Directo" },
  { inicio: "07:30:00", fin: "09:00:00", titulo: "Televistazo en la comunidad" },
  // { inicio: "10:30:00", fin: "13:00:00", titulo: "En Contacto" },
  { inicio: "13:00:00", fin: "14:00:00", titulo: "Televistazo 13h00" },
  // { inicio: "14:00:00", fin: "15:30:00", titulo: "Los hackers de la farándula" },//hachers
  { inicio: "19:00:00", fin: "20:30:00", titulo: "Televistazo 19h00" }
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
  const textApagado = document.querySelector("#no_transmision__");

  if (enProgramacion) {
    h1Titulo.innerText = tituloPrograma;
    // h1Titulo.style.display = "block";
    // tituloEstasEscu.display = "block";
    tituloEstasEscu.innerText = "Estás escuchando";
    embedPlayer.style.display = "block";
    textApagado.style.display = "none";
    textApagado.innerText = "";
  } else {
    h1Titulo.innerText = "";
    // h1Titulo.style.display = "none";
    tituloEstasEscu.innerText = "";
    embedPlayer.style.display = "none";
    textApagado.style.display = "block";
    textApagado.innerText = "Aquí encontrarás una opción para acceder a toda la programación informativa Audio En vivo: Contacto Directo (6:55), Televistazo en la Comunidad (5:55-7:30), Televistazo (13:00-19:00)."

  }

  // Llamar a la función de nuevo cada medio minuto
  setTimeout(mostrarProgramacion, 30000);
}

// Iniciar el ciclo de verificación
// mostrarProgramacion();

function onPageLoad(callback) {
  if (document.readyState === 'complete') {
      // La página ya está cargada
      callback();
  } else {
      // Espera a que la carga termine
      window.addEventListener('load', callback);
  }
}

onPageLoad(() => {
  setTimeout(() => {
      
      document.querySelectorAll('.signed-out #iter-content-wrapper')?.forEach(article => {
          article.style.visibility = 'visible';
      });

  }, 500);

  setTimeout(() => {
      const elementvrudo = document.querySelectorAll('.vrudo');
      if (elementvrudo.length > 0) {
          elementvrudo.forEach(el => {
              el.removeAttribute('style');
          });
      }
  }, 2000);
});