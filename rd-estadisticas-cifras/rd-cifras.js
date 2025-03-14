function createNav(activeTabId) {
  const tabs = [
    // { id: 'paris-2024', href: '/juegos-olimpicos-paris-2024-calendario-medallero', text: 'París 2024' },
    { id: 'ligapro', href: '/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador', text: 'LigaPro' },
    { id: 'eliminatorias', href: '/deportes/eliminatorias-conmebol/tablaposiciones', text: 'Eliminatorias' },
    { id: 'champions', href: '/deportes/champions/tablaposiciones', text: 'Champions League' },
    { id: 'copa-libertadores', href: '/deportes/copa-libertadores/tablaposiciones', text: 'Copa Libertadores' },
    { id: 'copa-sudamericana', href: '/deportes/copa-sudamericana/tablaposiciones', text: 'Copa Sudamericana' },
    { id: 'premierleague', href: '/deportes/premierleague/tablaposiciones', text: 'Premier League' },
    { id: 'liga-espanola', href: '/deportes/liga-espanola/tablaposiciones', text: 'Liga Española' },
    { id: 'mls', href: '/deportes/mls/tablaposiciones', text: 'MLS' },
    { id: 'copa-america', href: '/deportes/copa-america/tablaposiciones', text: 'Copa América' },
  ];

  const navHtml = `
      <ul class="nav nav-pills navCentral" id="myTab" role="tablist">
          ${tabs.map(tab => `
              <li class="nav-item" role="presentation">
                  <a class="nav-link ${tab.id === activeTabId ? 'active' : ''}" id="${tab.id}" href="${tab.href}">${tab.text}</a>
              </li>
          `).join('')}
      </ul>
  `;

  const navContainer = document.getElementById('nav-container');
  navContainer.innerHTML = navHtml;
}

//FUNCION PARA HACER SCROLL HORIZONTAL AUTOMATICO DE ACUERDO A LA CLASE ACTIVE
setTimeout(() => {
  var activeNavItem = document.querySelector("#nav-container .nav-link.active");
  if (activeNavItem) {
    var contTabs = document.querySelector("#nav-container #myTab");
    if (contTabs) {
      contTabs.scrollLeft = activeNavItem.offsetLeft - (contTabs.offsetWidth - activeNavItem.offsetWidth) / 2;
      console.log("si encontro la clase myTab");
      // for (const sst of contTabs){
      //   console.log('for ejecutado scroll horizontal');
      // }
    } else {
      console.log("no encontro la clase myTab");
    }
  } else {
    console.log("no se contro el #nav-container .nav-link.active");
  }

  
}, 500);


function iResizer (){
  var ifResizer = document.createElement("script");
  ifResizer.setAttribute('src', 'https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/assets/libs/iframeResizer/iframeResizer.min.js');
  document.head.appendChild(ifResizer);
  setTimeout(() => {
    iFrameResize({ "scrolling": false, "checkOrigin": false }, "iframe");
  }, 200);
}



function eventParis2024() {
  const urlsCifras = [
    {
      mainUrl: "/juegos-olimpicos-paris-2024-calendario-medallero",
      subUrl: {
        name: "Posiciones",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/jjoo/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3//minapp/page/page.html?channel=deportes.futbol.copaamerica&lang=es_LA&page=posiciones",
      },
    },
    /*
    {
      mainUrl: "/deportes/copa-america/calendario",
      subUrl: {
        name: "Calendario",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/copaamerica/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3//minapp/page/page.html?channel=deportes.futbol.copaamerica&lang=es_LA&page=fixture",
      },
    },
    {
      mainUrl: "/deportes/copa-america/goleadores",
      subUrl: {
        name: "Goleadores",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/copaamerica/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3//minapp/page/page.html?channel=deportes.futbol.copaamerica&lang=es_LA&page=goleadores",
      },
    },
    {
      mainUrl: "/deportes/copa-america/planteles",
      subUrl: {
        name: "Planteles",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/copaamerica/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3//minapp/page/page.html?channel=deportes.futbol.copaamerica&lang=es_LA&page=planteles",
      },
    },
    */
  ];

  const currentUrl = window.location.pathname;

  // Variable para almacenar el contenido HTML
  let htmlContent = "";

  setTimeout(() => {
    createNav('paris-2024');
  }, 200);

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string

      htmlContent = `
         <div id="nav-container"></div>
          <div class="tab-content" id="myTabContent">
              <div class="" id="ligapro" role="tabpanel" aria-labelledby="ligapro-tab">
                <section>
                  <section class="wrapper" id="main-content">
                    <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="1100px" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>        
                  </section>
                </section>
              </div>
          </div>
      `;

      break; // Detener el bucle una vez que se encuentra una coincidencia
    }
  }
  // Agregar el contenido HTML al cuerpo del documento
  const skk = document.querySelector(".contenido_dinamico__paris2024");
  if (skk) {
    skk.innerHTML = htmlContent;
  }
}

function eventCopaAmerica() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/copa-america/tablaposiciones",
      subUrl: {
        name: "Posiciones",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/copaamerica/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3//minapp/page/page.html?channel=deportes.futbol.copaamerica&lang=es_LA&page=posiciones",
      },
    },
    {
      mainUrl: "/deportes/copa-america/calendario",
      subUrl: {
        name: "Calendario",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/copaamerica/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3//minapp/page/page.html?channel=deportes.futbol.copaamerica&lang=es_LA&page=fixture",
      },
    },
    {
      mainUrl: "/deportes/copa-america/goleadores",
      subUrl: {
        name: "Goleadores",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/copaamerica/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3//minapp/page/page.html?channel=deportes.futbol.copaamerica&lang=es_LA&page=goleadores",
      },
    },
    {
      mainUrl: "/deportes/copa-america/planteles",
      subUrl: {
        name: "Planteles",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/copaamerica/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3//minapp/page/page.html?channel=deportes.futbol.copaamerica&lang=es_LA&page=planteles",
      },
    },
  ];

  const currentUrl = window.location.pathname;

  // Variable para almacenar el contenido HTML
  let htmlContent = "";

  const uCopaAmericaTabla = "/deportes/copa-america/tablaposiciones";
  const uCopaAmericaCalendario = "/deportes/copa-america/calendario";
  const uCopaAmericaGoleadores = "/deportes/copa-america/goleadores";
  const uCopaAmericaPlanteles = "/deportes/copa-america/planteles";

  setTimeout(() => {
    createNav('copa-america');
  }, 200);

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = `

         <div id="nav-container"></div>
          <div class="tab-content" id="myTabContent">
              <div class="" id="ligapro" role="tabpanel" aria-labelledby="ligapro-tab">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                  <li class="nav-item" role="presentation">
                      <a href="/deportes/copa-america/tablaposiciones" class="nav-link ${currentUrl === uCopaAmericaTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
                  </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-america/calendario" class="nav-link ${currentUrl === uCopaAmericaCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-america/goleadores" class="nav-link ${currentUrl === uCopaAmericaGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-america/planteles" class="nav-link ${currentUrl === uCopaAmericaPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                  </ul>
                  <div class="tab-content" id="myTabContent">
                      <div class="" id="Posiciones" role="tabpanel" aria-labelledby="Posiciones-tab">
                          <iframe title="iframe_libertadores_calendario"
                              src="${urlObj.subUrl.iframe}"
                              width="100%" height="700" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;"
                              class=""></iframe>
                      </div>
                  </div>
              </div>
          </div>
        `;
      break; // Detener el bucle una vez que se encuentra una coincidencia
    }
  }
  // Agregar el contenido HTML al cuerpo del documento
  const skk = document.querySelector(".contenido_dinamico__copaamerica");
  if (skk) {
    skk.innerHTML = htmlContent;
  }
}


function eventLigaPro() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador",
      subUrl: {
        name: "Posiciones Fase 1",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/ecuador/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/minapp/page/page.html?channel=deportes.futbol.ecuador&lang=es_LA&page=posiciones",
      },
    },
    {
      mainUrl: "/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador/etapa-2",
      subUrl: {
        name: "Posiciones Fase 2",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/ecuador/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.ecuador.posiciones&lang=es_LA&page=Fase_2",
      },
    },
    {
      mainUrl: "/deportes/tabla-acumulada/liga-pro/serie-a-ecuador",
      subUrl: {
        name: "Tabla Acumulada",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/ecuador/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.ecuador.posiciones&lang=es_LA&page=Acumulada",
      },
    },
    {
      mainUrl: "/deportes/liga-pro-serie-a-ecuador/calendario",
      subUrl: {
        name: "Calendario",
        agenda:
          "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/ecuador/pages/es/agenda.html",
        iframe:
          "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.ecuador&lang=es_LA&page=fixture",
      },
    },
    {
      mainUrl: "/deportes/liga-pro-serie-a-ecuador/goleadores",
      subUrl: {
        name: "Goleadores",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/ecuador/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.ecuador&lang=es_LA&page=goleadores",
      },
    },
    {
      mainUrl: "/deportes/liga-pro-serie-a-ecuador/planteles",
      subUrl: {
        name: "Planteles",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/ecuador/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.ecuador&lang=es_LA&page=planteles",
      },
    },

  ];

  const currentUrl = window.location.pathname;

  // Variable para almacenar el contenido HTML
  let htmlContent = "";

  const uLigaProTabla = "/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador";
  const uLigaProTablaFase2 = "/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador/etapa-2";
  const uLigaProAcumulada = "/deportes/tabla-acumulada/liga-pro/serie-a-ecuador";
  const uLigaProCalendario = "/deportes/liga-pro-serie-a-ecuador/calendario";
  const uLigaProGoleadores = "/deportes/liga-pro-serie-a-ecuador/goleadores";
  const uLigaProPlanteles = "/deportes/liga-pro-serie-a-ecuador/planteles";

  setTimeout(() => {
    createNav('ligapro');
  }, 200);

  // const uee = document.querySelector('.cintillo-rd h1');
  // if(currentUrl === uLigaProCalendario){
  //   uee.innerHTML = "LigaPro - Calendario"
  // } else if(currentUrl === uLigaProGoleadores){
  //   uee.innerHTML = "LigaPro - Goleadores"
  // } else if(currentUrl === uLigaProPlanteles){
  //   uee.innerHTML = "LigaPro - Planteles"
  // } else if(currentUrl === uLigaProAcumulada){
  //   uee.innerHTML = "LigaPro - T. Acumulada"
  // } else {}

  const acumulada = /*html*/`<ul class="nav nav-pills navChilds s_acumulada __cvamos" id="myTab" role="tablist">
  <li class="nav-item" role="presentation">
      <a href="/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador" class="nav-link ${currentUrl === uLigaProTabla ? "active" : ""}" id="etapa-tab" >Etapa 1</a>
  </li>
  <li class="nav-item" role="presentation">
      <a href="/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador/etapa-2" class="nav-link ${currentUrl === uLigaProTablaFase2 ? "active" : ""}" id="etapa-tab" >Etapa 2</a>
  </li>
  <li class="nav-item" role="presentation">
      <a href="/deportes/tabla-acumulada/liga-pro/serie-a-ecuador" class="nav-link ${currentUrl === uLigaProAcumulada ? "active" : ""}" id="acumulada-tab">Acumulada</a>
  </li>
</ul>`;

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
         <div id="nav-container"></div>
          <div class="tab-content" id="myTabContent">
              <div class="" id="ligapro" role="tabpanel" aria-labelledby="ligapro-tab">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador" class="nav-link ${currentUrl === uLigaProTabla ? "active" : currentUrl === uLigaProAcumulada ? "active" : currentUrl === uLigaProTablaFase2 ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/liga-pro-serie-a-ecuador/calendario" class="nav-link ${currentUrl === uLigaProCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/liga-pro-serie-a-ecuador/goleadores" class="nav-link ${currentUrl === uLigaProGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/liga-pro-serie-a-ecuador/planteles" class="nav-link ${currentUrl === uLigaProPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                  </ul>
                  <div class="tab-content" id="myTabContent">
                      <div id="Posiciones" role="tabpanel" aria-labelledby="Posiciones-tab">
                       
                          <iframe title="ifr_Posiciones"
                              src="${urlObj.subUrl.iframe}"
                              width="100%" height="700" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;"
                              class=""></iframe>
                      </div>
                  </div>
              </div>
          </div>
        `;
      break; // Detener el bucle una vez que se encuentra una coincidencia
    }
  }
  // Agregar el contenido HTML al cuerpo del documento

  const skk = document.querySelector(".contenido_dinamico__ligapro");
  if (skk) {
    skk.innerHTML = htmlContent;
  }
}

function eventLibertadores() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/copa-libertadores/tablaposiciones",
      subUrl: {
        name: "Posiciones",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/libertadores/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.libertadores&lang=es_LA&page=posiciones",
      },
    },
    {
      mainUrl: "/deportes/copa-libertadores/calendario",
      subUrl: {
        name: "Calendario",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/libertadores/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.libertadores&lang=es_LA&page=fixture",
      },
    },
    {
      mainUrl: "/deportes/copa-libertadores/goleadores",
      subUrl: {
        name: "Goleadores",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/libertadores/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.libertadores&lang=es_LA&page=goleadores",
      },
    },
    {
      mainUrl: "/deportes/copa-libertadores/planteles",
      subUrl: {
        name: "Planteles",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/libertadores/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.libertadores&lang=es_LA&page=planteles",
      },
    },
  ];

  const currentUrl = window.location.pathname;

  // Variable para almacenar el contenido HTML
  let htmlContent = "";

  const uLibertadoresTabla = "/deportes/copa-libertadores/tablaposiciones";
  const uLibertadoresCalendario = "/deportes/copa-libertadores/calendario";
  const uLibertadoresGoleadores = "/deportes/copa-libertadores/goleadores";
  const uLibertadoresPlanteles = "/deportes/copa-libertadores/planteles";

  setTimeout(() => {
    createNav('copa-libertadores');
  }, 200);

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          <div id="nav-container"></div>
          <div class="tab-content" id="myTabContent">
              <div class="" id="ligapro" role="tabpanel" aria-labelledby="ligapro-tab">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                  <li class="nav-item" role="presentation">
                      <a href="/deportes/copa-libertadores/tablaposiciones" class="nav-link ${currentUrl === uLibertadoresTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
                  </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-libertadores/calendario" class="nav-link ${currentUrl === uLibertadoresCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-libertadores/goleadores" class="nav-link ${currentUrl === uLibertadoresGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-libertadores/planteles" class="nav-link ${currentUrl === uLibertadoresPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                  </ul>
                  <div class="tab-content" id="myTabContent">
                      <div class="" id="Posiciones" role="tabpanel" aria-labelledby="Posiciones-tab">
                          <iframe title="iframe_libertadores_calendario"
                              src="${urlObj.subUrl.iframe}"
                              width="100%" height="700" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;"
                              class=""></iframe>
                      </div>
                  </div>
              </div>
          </div>
        `;
      break; // Detener el bucle una vez que se encuentra una coincidencia
    }
  }
  // Agregar el contenido HTML al cuerpo del documento
  const skk = document.querySelector(".contenido_dinamico__libertadores");
  if (skk) {
    skk.innerHTML = htmlContent;
  }
}

function eventSudamericana() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/copa-sudamericana/tablaposiciones",
      subUrl: {
        name: "Posiciones",
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
    },
    {
      mainUrl: "/deportes/copa-sudamericana/goleadores",
      subUrl: {
        name: "Goleadores",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/sudamericana/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.sudamericana&lang=es_LA&page=goleadores",
      },
    },
    {
      mainUrl: "/deportes/copa-sudamericana/planteles",
      subUrl: {
        name: "Planteles",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/sudamericana/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.sudamericana&lang=es_LA&page=planteles",
      },
    },
  ];

  const currentUrl = window.location.pathname;

  // Variable para almacenar el contenido HTML
  let htmlContent = "";

  const usudamericanaTabla = "/deportes/copa-sudamericana/tablaposiciones";
  const usudamericanaCalendario = "/deportes/copa-sudamericana/calendario";
  const usudamericanaGoleadores = "/deportes/copa-sudamericana/goleadores";
  const usudamericanaPlanteles = "/deportes/copa-sudamericana/planteles";

  setTimeout(() => {
    createNav('copa-sudamericana');
  }, 200);

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
      <div id="nav-container"></div>
          <div class="tab-content" id="myTabContent">
              <div class="" id="ligapro" role="tabpanel" aria-labelledby="ligapro-tab">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                    
                  <li class="nav-item" role="presentation">
                      <a href="/deportes/copa-sudamericana/tablaposiciones" class="nav-link ${currentUrl === usudamericanaTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
                  </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-sudamericana/calendario" class="nav-link ${currentUrl === usudamericanaCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-sudamericana/goleadores" class="nav-link ${currentUrl === usudamericanaGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-sudamericana/planteles" class="nav-link ${currentUrl === usudamericanaPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                  </ul>
                  <div class="tab-content" id="myTabContent">
                      <div class="" id="Posiciones" role="tabpanel" aria-labelledby="Posiciones-tab">
                          <iframe title="iframe_sudamericana_calendario"
                              src="${urlObj.subUrl.iframe}"
                              width="100%" height="700" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;"
                              class=""></iframe>
                      </div>
                  </div>
              </div>
          </div>
        `;
      break; // Detener el bucle una vez que se encuentra una coincidencia
    }
  }
  // Agregar el contenido HTML al cuerpo del documento
  const skk = document.querySelector(".contenido_dinamico__sudamericana");
  if (skk) {
    skk.innerHTML = htmlContent;
  }
}

function eventPremierLeague() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/premierleague/tablaposiciones",
      subUrl: {
        name: "Posiciones",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/premierleague/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.premierleague&lang=es_LA&page=posiciones",
      },
    },
    {
      mainUrl: "/deportes/premierleague/calendario",
      subUrl: {
        name: "Calendario",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/premierleague/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.premierleague&lang=es_LA&page=fixture",
      },
    },
    {
      mainUrl: "/deportes/premierleague/goleadores",
      subUrl: {
        name: "Goleadores",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/premierleague/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.premierleague&lang=es_LA&page=goleadores",
      },
    },
    {
      mainUrl: "/deportes/premierleague/planteles",
      subUrl: {
        name: "Planteles",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/premierleague/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.premierleague&lang=es_LA&page=planteles",
      },
    },
  ];

  const currentUrl = window.location.pathname;

  // Variable para almacenar el contenido HTML
  let htmlContent = "";

  const upremierleagueTabla = "/deportes/premierleague/tablaposiciones";
  const upremierleagueCalendario = "/deportes/premierleague/calendario";
  const upremierleagueGoleadores = "/deportes/premierleague/goleadores";
  const upremierleaguePlanteles = "/deportes/premierleague/planteles";

  setTimeout(() => {
    createNav('premierleague');
  }, 200);

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          <div id="nav-container"></div>
          <div class="tab-content" id="myTabContent">
              <div class="" id="ligapro" role="tabpanel">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                  <li class="nav-item" role="presentation">
                      <a href="/deportes/premierleague/tablaposiciones" class="nav-link ${currentUrl === upremierleagueTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
                  </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/premierleague/calendario" class="nav-link ${currentUrl === upremierleagueCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/premierleague/goleadores" class="nav-link ${currentUrl === upremierleagueGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/premierleague/planteles" class="nav-link ${currentUrl === upremierleaguePlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                  </ul>
                  <div class="tab-content" id="myTabContent">
                      <div class="" id="Posiciones" role="tabpanel" aria-labelledby="Posiciones-tab">
                          <iframe title="ifr_Posiciones" src="${urlObj.subUrl.iframe}" width="100%" height="700" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;"class=""></iframe>
                      </div>
                  </div>
              </div>
          </div>
        `;
      break; // Detener el bucle una vez que se encuentra una coincidencia
    }
  }
  // Agregar el contenido HTML al cuerpo del documento
  const skk = document.querySelector(".contenido_dinamico__premierleague");
  if (skk) {
    skk.innerHTML = htmlContent;
  }
}

function eventLaLigaEspañola() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/liga-espanola/tablaposiciones",
      subUrl: {
        name: "Posiciones",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/espana/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.espana&lang=es_LA&page=posiciones",
      },
    },
    {
      mainUrl: "/deportes/liga-espanola/calendario",
      subUrl: {
        name: "Calendario",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/espana/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.espana&lang=es_LA&page=fixture",
      },
    },
    {
      mainUrl: "/deportes/liga-espanola/goleadores",
      subUrl: {
        name: "Goleadores",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/espana/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.espana&lang=es_LA&page=goleadores",
      },
    },
    {
      mainUrl: "/deportes/liga-espanola/planteles",
      subUrl: {
        name: "Planteles",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/espana/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.espana&lang=es_LA&page=planteles",
      },
    },
  ];

  const currentUrl = window.location.pathname;

  // Variable para almacenar el contenido HTML
  let htmlContent = "";

  const uligaespanolaTabla = "/deportes/liga-espanola/tablaposiciones";
  const uligaespanolaCalendario = "/deportes/liga-espanola/calendario";
  const uligaespanolaGoleadores = "/deportes/liga-espanola/goleadores";
  const uligaespanolaPlanteles = "/deportes/liga-espanola/planteles";

  setTimeout(() => {
    createNav('liga-espanola');
  }, 200);

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
     <div id="nav-container"></div>
          <div class="tab-content" id="myTabContent">
              <div class="" id="ligapro" role="tabpanel">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/liga-espanola/tablaposiciones" class="nav-link ${currentUrl === uligaespanolaTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/liga-espanola/calendario" class="nav-link ${currentUrl === uligaespanolaCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/liga-espanola/goleadores" class="nav-link ${currentUrl === uligaespanolaGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/liga-espanola/planteles" class="nav-link ${currentUrl === uligaespanolaPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                      
                  </ul>
                  <div class="tab-content" id="myTabContent">
                      <div class="" id="Posiciones" role="tabpanel" aria-labelledby="Posiciones-tab">
                          <iframe title="ifr_Posiciones" src="${urlObj.subUrl.iframe}" width="100%" height="700" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;"class=""></iframe>
                      </div>
                  </div>
              </div>
          </div>
        `;
      break; // Detener el bucle una vez que se encuentra una coincidencia
    }
  }
  // Agregar el contenido HTML al cuerpo del documento
  const skk = document.querySelector(".contenido_dinamico__espana");
  if (skk) {
    skk.innerHTML = htmlContent;
  }
}

function eventMLS() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/mls/tablaposiciones",
      subUrl: {
        name: "Posiciones",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/mls/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.mls&lang=es_LA&page=posiciones",
      },
    },
    {
      mainUrl: "/deportes/mls/calendario",
      subUrl: {
        name: "Calendario",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/mls/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.mls&lang=es_LA&page=fixture",
      },
    },
    {
      mainUrl: "/deportes/mls/goleadores",
      subUrl: {
        name: "Goleadores",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/mls/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.mls&lang=es_LA&page=goleadores",
      },
    },
    {
      mainUrl: "/deportes/mls/planteles",
      subUrl: {
        name: "Planteles",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/mls/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.mls&lang=es_LA&page=planteles",
      },
    },
  ];

  const currentUrl = window.location.pathname;

  // Variable para almacenar el contenido HTML
  let htmlContent = "";

  const uMLSTabla = "/deportes/mls/tablaposiciones";
  const uMLSCalendario = "/deportes/mls/calendario";
  const uMLSGoleadores = "/deportes/mls/goleadores";
  const uMLSPlanteles = "/deportes/mls/planteles";

  setTimeout(() => {
    createNav('mls');
  }, 200);

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          <div id="nav-container"></div>
          <div class="tab-content" id="myTabContent">
              <div role="tabpanel">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/mls/tablaposiciones" class="nav-link ${currentUrl === uMLSTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/mls/calendario" class="nav-link ${currentUrl === uMLSCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/mls/goleadores" class="nav-link ${currentUrl === uMLSGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/mls/planteles" class="nav-link ${currentUrl === uMLSPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                      
                  </ul>
                  <div class="tab-content" id="myTabContent">
                      <div class="" id="Posiciones" role="tabpanel" aria-labelledby="Posiciones-tab">
                          <iframe title="ifr_Posiciones" src="${urlObj.subUrl.iframe}" width="100%" height="700" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;"class=""></iframe>
                      </div>
                  </div>
              </div>
          </div>
        `;
      break; // Detener el bucle una vez que se encuentra una coincidencia
    }
  }
  // Agregar el contenido HTML al cuerpo del documento
  const skk = document.querySelector(".contenido_dinamico__mls");
  if (skk) {
    skk.innerHTML = htmlContent;
  }
}

function eventLeaguesCup() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/leaguescup/tablaposiciones",
      subUrl: {
        name: "Posiciones",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/leaguescup/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.leaguescup&lang=es_LA&page=posiciones",
      },
    },
    {
      mainUrl: "/deportes/leaguescup/calendario",
      subUrl: {
        name: "Calendario",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/leaguescup/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.leaguescup&lang=es_LA&page=fixture",
      },
    },
    {
      mainUrl: "/deportes/leaguescup/goleadores",
      subUrl: {
        name: "Goleadores",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/leaguescup/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.leaguescup&lang=es_LA&page=goleadores",
      },
    },
    {
      mainUrl: "/deportes/leaguescup/planteles",
      subUrl: {
        name: "Planteles",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/leaguescup/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.leaguescup&lang=es_LA&page=planteles",
      },
    },
  ];

  const currentUrl = window.location.pathname;

  // Variable para almacenar el contenido HTML
  let htmlContent = "";

  const uleaguescupTabla = "/deportes/leaguescup/tablaposiciones";
  const uleaguescupCalendario = "/deportes/leaguescup/calendario";
  const uleaguescupGoleadores = "/deportes/leaguescup/goleadores";
  const uleaguescupPlanteles = "/deportes/leaguescup/planteles";

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
      <ul class="nav nav-pills navCentral" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
      <a class="nav-link" id="ligapro-tab" href="/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador">LigaPro</a>
      </li>
      <li class="nav-item" role="presentation">
          <a class="nav-link " id="" href="/deportes/eliminatorias-conmebol/tablaposiciones">Eliminatorias</a>
      </li>
      <li class="nav-item" role="presentation">
        <a class="nav-link" id="ligapro-tab" href="/deportes/champions/tablaposiciones">Champions League</a>
      </li> 
      <li class="nav-item" role="presentation">
          <a class="nav-link " id="copali-tab" href="/deportes/copa-libertadores/tablaposiciones">Copa Libertadores</a>
      </li>
      <li class="nav-item" role="presentation">
          <a class="nav-link " id="copaSudamericana-tab" href="/deportes/copa-sudamericana/tablaposiciones" >Copa Sudamericana</a>
      </li>
      <li class="nav-item" role="presentation">
          <a class="nav-link" id="" href="/deportes/premierleague/tablaposiciones" >Premier League</a>
      </li>
      <li class="nav-item" role="presentation">
          <a class="nav-link" id="" href="/deportes/liga-espanola/tablaposiciones">Liga Española</a>
      </li>
      <li class="nav-item" role="presentation">
          <a class="nav-link" id="" href="/deportes/mls/tablaposiciones">MLS</a>
      </li>
      
  </ul>
          <div class="tab-content" id="myTabContent">
              <div role="tabpanel">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                  <li class="nav-item" role="presentation">
                      <a href="/deportes/leaguescup/tablaposiciones" class="nav-link ${currentUrl === uleaguescupTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
                  </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/leaguescup/calendario" class="nav-link ${currentUrl === uleaguescupCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/leaguescup/goleadores" class="nav-link ${currentUrl === uleaguescupGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/leaguescup/planteles" class="nav-link ${currentUrl === uleaguescupPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                  </ul>
                  <div class="tab-content" id="myTabContent">
                      <div class="" id="Posiciones" role="tabpanel" aria-labelledby="Posiciones-tab">
                          <iframe title="ifr_Posiciones" src="${urlObj.subUrl.iframe}" width="100%" height="700" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;"class=""></iframe>
                      </div>
                  </div>
              </div>
          </div>
        `;
      break; // Detener el bucle una vez que se encuentra una coincidencia
    }
  }
  // Agregar el contenido HTML al cuerpo del documento
  const skk = document.querySelector(".contenido_dinamico__leaguescup");
  if (skk) {
    skk.innerHTML = htmlContent;
  }
}

function eventEliminatorios() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/eliminatorias-conmebol/tablaposiciones",
      subUrl: {
        name: "Posiciones",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/eliminatorias/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.eliminatorias&lang=es_LA&page=posiciones",
      },
    },
    {
      mainUrl: "/deportes/eliminatorias-conmebol/calendario",
      subUrl: {
        name: "Calendario",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/eliminatorias/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.eliminatorias&lang=es_LA&page=fixture",
      },
    },
    {
      mainUrl: "/deportes/eliminatorias-conmebol/goleadores",
      subUrl: {
        name: "Goleadores",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/eliminatorias/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.eliminatorias&lang=es_LA&page=goleadores",
      },
    },
    {
      mainUrl: "/deportes/eliminatorias-conmebol/planteles",
      subUrl: {
        name: "Planteles",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/eliminatorias/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.eliminatorias&lang=es_LA&page=planteles",
      },
    },
  ];

  const currentUrl = window.location.pathname;

  // Variable para almacenar el contenido HTML
  let htmlContent = "";

  const ueliminatoriasConmebolTabla = "/deportes/eliminatorias-conmebol/tablaposiciones";
  const ueliminatoriasConmebolCalendario = "/deportes/eliminatorias-conmebol/calendario";
  const ueliminatoriasConmebolGoleadores = "/deportes/eliminatorias-conmebol/goleadores";
  const ueliminatoriasConmebolPlanteles = "/deportes/eliminatorias-conmebol/planteles";

  setTimeout(() => {
    createNav('eliminatorias');
  }, 200);

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          <div id="nav-container"></div>

          <div class="tab-content" id="myTabContent">
              <div role="tabpanel">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                      
                  <li class="nav-item" role="presentation">
                      <a href="/deportes/eliminatorias-conmebol/tablaposiciones" class="nav-link ${currentUrl === ueliminatoriasConmebolTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
                  </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/eliminatorias-conmebol/calendario" class="nav-link ${currentUrl === ueliminatoriasConmebolCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/eliminatorias-conmebol/goleadores" class="nav-link ${currentUrl === ueliminatoriasConmebolGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/eliminatorias-conmebol/planteles" class="nav-link ${currentUrl === ueliminatoriasConmebolPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                      
                  </ul>
                  <div class="tab-content" id="myTabContent">
                      <div class="" id="Posiciones" role="tabpanel" aria-labelledby="Posiciones-tab">
                          <iframe title="iframe_eliminatorias_calendario" src="${urlObj.subUrl.iframe}" width="100%" height="700" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;"class=""></iframe>
                      </div>
                  </div>
              </div>
          </div>
        `;
      break; // Detener el bucle una vez que se encuentra una coincidencia
    }
  }
  // Agregar el contenido HTML al cuerpo del documento
  const skk = document.querySelector(".contenido_dinamico__eliminatorias");
  if (skk) {
    skk.innerHTML = htmlContent;
  }
}

function eventChampions() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/champions/tablaposiciones",
      subUrl: {
        name: "Posiciones",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/champions/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.champions&lang=es_LA&page=posiciones",
      },
    },
    {
      mainUrl: "/deportes/champions/calendario",
      subUrl: {
        name: "Calendario",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/champions/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.champions&lang=es_LA&page=fixture",
      },
    },
    {
      mainUrl: "/deportes/champions/goleadores",
      subUrl: {
        name: "Goleadores",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/champions/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.champions&lang=es_LA&page=goleadores",
      },
    },
    {
      mainUrl: "/deportes/champions/planteles",
      subUrl: {
        name: "Planteles",
        agenda: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/champions/pages/es/agenda.html",
        iframe: "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.champions&lang=es_LA&page=planteles",
      },
    },
  ];

  const currentUrl = window.location.pathname;

  // Variable para almacenar el contenido HTML
  let htmlContent = "";

  const uchampionsTabla = "/deportes/champions/tablaposiciones";
  const uchampionsCalendario = "/deportes/champions/calendario";
  const uchampionsGoleadores = "/deportes/champions/goleadores";
  const uchampionsPlanteles = "/deportes/champions/planteles";

  setTimeout(() => {
    createNav('champions');
  }, 200);

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          <div id="nav-container"></div>
          <div class="tab-content" id="myTabContent">
              <div role="tabpanel">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/champions/tablaposiciones" class="nav-link ${currentUrl === uchampionsTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/champions/calendario" class="nav-link ${currentUrl === uchampionsCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/champions/goleadores" class="nav-link ${currentUrl === uchampionsGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/champions/planteles" class="nav-link ${currentUrl === uchampionsPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                      
                  </ul>
                  <div class="tab-content" id="myTabContent">
                      <div class="" id="Posiciones" role="tabpanel" aria-labelledby="Posiciones-tab">
                          <iframe title="champions" src="${urlObj.subUrl.iframe}" width="100%" height="700" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;"class=""></iframe>
                      </div>
                  </div>
              </div>
          </div>
        `;
      break; // Detener el bucle una vez que se encuentra una coincidencia
    }
  }
  // Agregar el contenido HTML al cuerpo del documento
  const skk = document.querySelector(".contenido_dinamico__champions");
  if (skk) {
    skk.innerHTML = htmlContent;
  }
}

if (window.location.pathname === "/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador" ||
  window.location.pathname === "/deportes/liga-pro-serie-a-ecuador/calendario" ||
  window.location.pathname === "/deportes/liga-pro-serie-a-ecuador/goleadores" ||
  window.location.pathname === "/deportes/liga-pro-serie-a-ecuador/planteles" ||
  window.location.pathname === "/deportes/tabla-acumulada/liga-pro/serie-a-ecuador" ||
  window.location.pathname === "/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador/etapa-2") {
  setTimeout(() => {
    eventLigaPro();
  }, 200);


} else if (window.location.pathname === "/deportes/copa-libertadores/tablaposiciones" ||
  window.location.pathname === "/deportes/copa-libertadores/calendario" ||
  window.location.pathname === "/deportes/copa-libertadores/goleadores" ||
  window.location.pathname === "/deportes/copa-libertadores/planteles") {
  setTimeout(() => {
    eventLibertadores();
  }, 200);


} else if (window.location.pathname === "/deportes/copa-america/tablaposiciones" ||
  window.location.pathname === "/deportes/copa-america/calendario" ||
  window.location.pathname === "/deportes/copa-america/goleadores" ||
  window.location.pathname === "/deportes/copa-america/planteles") {
  setTimeout(() => {
    eventCopaAmerica();
  }, 200);

} else if (window.location.pathname === "/juegos-olimpicos-paris-2024-calendario-medallero") {
  setTimeout(() => {
    eventParis2024();
  }, 200);


} else if (window.location.pathname === "/deportes/copa-sudamericana/tablaposiciones" ||
  window.location.pathname === "/deportes/copa-sudamericana/calendario" ||
  window.location.pathname === "/deportes/copa-sudamericana/goleadores" ||
  window.location.pathname === "/deportes/copa-sudamericana/planteles") {
  setTimeout(() => {
    eventSudamericana();
  }, 200);


} else if (window.location.pathname === "/deportes/premierleague/tablaposiciones" ||
  window.location.pathname === "/deportes/premierleague/calendario" ||
  window.location.pathname === "/deportes/premierleague/goleadores" ||
  window.location.pathname === "/deportes/premierleague/planteles") {
  setTimeout(() => {
    eventPremierLeague();
  }, 200);


} else if (window.location.pathname === "/deportes/liga-espanola/tablaposiciones" ||
  window.location.pathname === "/deportes/liga-espanola/calendario" ||
  window.location.pathname === "/deportes/liga-espanola/goleadores" ||
  window.location.pathname === "/deportes/liga-espanola/planteles") {
  setTimeout(() => {
    eventLaLigaEspañola();
  }, 200);


} else if (window.location.pathname === "/deportes/mls/tablaposiciones" ||
  window.location.pathname === "/deportes/mls/calendario" ||
  window.location.pathname === "/deportes/mls/goleadores" ||
  window.location.pathname === "/deportes/mls/planteles") {
  setTimeout(() => {
    eventMLS();
  }, 200);


} else if (window.location.pathname === "/deportes/leaguescup/tablaposiciones" ||
  window.location.pathname === "/deportes/leaguescup/calendario" ||
  window.location.pathname === "/deportes/leaguescup/goleadores" ||
  window.location.pathname === "/deportes/leaguescup/planteles") {
  setTimeout(() => {
    // eventLeaguesCup();
  }, 200);


} else if (window.location.pathname === "/deportes/eliminatorias-conmebol/tablaposiciones" ||
  window.location.pathname === "/deportes/eliminatorias-conmebol/calendario" ||
  window.location.pathname === "/deportes/eliminatorias-conmebol/goleadores" ||
  window.location.pathname === "/deportes/eliminatorias-conmebol/planteles") {
  setTimeout(() => {
    eventEliminatorios();
  }, 200);

} else if (window.location.pathname === "/deportes/champions/tablaposiciones" ||
  window.location.pathname === "/deportes/champions/calendario" ||
  window.location.pathname === "/deportes/champions/goleadores" ||
  window.location.pathname === "/deportes/champions/planteles") {
  setTimeout(() => {
    eventChampions();
  }, 200);


} else { console.log("no esta validado dicha url"); }





/* ------------------- editar los height del segundo iframe de arriba oara abajo--------------------- */
if (window.location.pathname === "/deportes/copa-sudamericana/planteles") {
  setTimeout(() => {
    var iframe = document.querySelector('iframe[title="iframe_sudamericana_calendario"]');
    iframe.setAttribute('height', '400');
  }, 600);
}

if (window.location.pathname === "/deportes/eliminatorias-conmebol/calendario") {
  setTimeout(() => {
    var iframe = document.querySelector('iframe[title="iframe_eliminatorias_calendario"]');
    iframe.setAttribute('height', '400');
  }, 600);
}

if (window.location.pathname === "/deportes/copa-libertadores/calendario") {
  setTimeout(() => {
    var iframe = document.querySelector('iframe[title="iframe_libertadores_calendario"]');
    iframe.setAttribute('height', '400');
  }, 600);
}
