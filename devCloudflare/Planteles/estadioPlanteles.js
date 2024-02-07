
const urlsCifras = [
  {
    mainUrl: "/deportes/plantel/barcelonaww",
    subUrl: {
      name: "Barcelona",
      agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/sudamericana/pages/es/agenda.html",
      iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.sudamericana&lang=es_LA&page=posiciones",
    },
  },
  {
    mainUrl: "/deportes/copa-sudamericana/calendario",
    subUrl: {
      name: "Calendario",
      agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/sudamericana/pages/es/agenda.html",
      iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.sudamericana&lang=es_LA&page=fixture",
    },
  }
];

const currentUrl = window.location.pathname;

for (const urlObj of urlsCifras) {
  if (currentUrl === urlObj.mainUrl) {
    // Generar el contenido HTML usando un template string
    console.log("si es", urlObj.subUrl.agenda);

    const classItem = document.querySelector('.c_azul_celeste_Desktop');
    if (classItem) {
      classItem.innerHTML += `<iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>`
    }
    break; // Detener el bucle una vez que se encuentra una coincidencia
  } else {
    console.log("no es nada");
  }
}
