//obtenermos el iduser del localsotage
const userIdXRadio = localStorage.getItem('wylexUserId') || 0;
if (userIdXRadio == 0) {
  console.warn("LiveRadio - no estas logueado");
} else {
  console.info("LiveRadio - Si estas logueado");

  const eventLun_Vie = [
    { inicio: "05:55", fin: "06:55", titulo: "Televistazo en la comunidad" },
    { inicio: "06:55", fin: "07:30", titulo: "Contacto Directo" },
    { inicio: "07:30:00", fin: "09:00:00", titulo: "Televistazo en la comunidad" },
    // { inicio: "10:30:00", fin: "13:00:00", titulo: "En Contacto" },
    { inicio: "13:00:00", fin: "14:00:00", titulo: "Televistazo 13h00" },
    // { inicio: "14:00:00", fin: "15:30:00", titulo: "Los hackers de la farándula" },//hachers
    { inicio: "19:00:00", fin: "20:00:00", titulo: "Televistazo 19h00" }
  ];

  const eventSab = [
    { inicio: "19:00:00", fin: "19:30:00", titulo: "Televistazo 19h00" }
  ];

  const eventDom = [
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
        programacion = eventDom;
        break;
      case 6:
        programacion = eventSab;
        break;
      default:
        programacion = eventLun_Vie;
        break;
    }

    let enProg = false;

    // Verificar si estamos dentro del horario de programación
    for (let i = 0; i < programacion.length; i++) {
      const programa = programacion[i];
      if (hora >= programa.inicio && hora <= programa.fin) {
        enProg = true;
        tituloPrograma = programa.titulo;
        break;
      }
    }

    // Mostrar u ocultar elementos según corresponda
    const selectDivRad = document.getElementById("parent_radio");

    // let forzadoEvent = localStorage.getItem("playerForzado");
    // console.log("forzadoEvent:", forzadoEvent)

    // if (forzadoEvent != "true") {
    if (enProg) {
      //aqui va el display block
      selectDivRad.style.display = "block";
    } else {
      //aqui va el display none
      selectDivRad.style.display = "none";
    }
    // } else { }

    // Llamar a la función de nuevo cada medio minuto
    setTimeout(mostrarProgramacion, 2000);
  }

  // Iniciar el ciclo de verificación
  mostrarProgramacion();

}