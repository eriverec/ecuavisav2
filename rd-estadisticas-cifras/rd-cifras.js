'use strict';

function Tabs() {
  var bindAll = function() {
    var menuElements = document.querySelectorAll('[data-tab]');
    for(var i = 0; i < menuElements.length ; i++) {
      menuElements[i].addEventListener('click', change, false);
    }
  }

  var clear = function() {
    var menuElements = document.querySelectorAll('[data-tab]');
    for(var i = 0; i < menuElements.length ; i++) {
      menuElements[i].classList.remove('active');
      var id = menuElements[i].getAttribute('data-tab');
      document.getElementById(id).classList.remove('active');
    }
  }

  var change = function(e) {
    clear();
    e.target.classList.add('active');
    var id = e.currentTarget.getAttribute('data-tab');
    document.getElementById(id).classList.add('active');
  }

  bindAll();
}

var connectTabs = new Tabs();

const navLinksTemplate = /*html*/ `
<ul class="nav nav-pills navCentral" id="myTab" role="tablist">
    <li class="nav-item" role="presentation">
        <a class="nav-link ${window.location.pathname === "/deportes/tabla-de-posiciones" ? "active" : ""}" id="ligapro-tab" href="/deportes/tabla-de-posiciones">LigaPro</a>
    </li>
    <li class="nav-item" role="presentation">
        <a class="nav-link ${window.location.pathname === "/deportes/copa-libertadores/calendario" ? "active" : ""}" id="copali-tab" href="/deportes/copa-libertadores/calendario">Copa Libertadores</a>
    </li>
    <li class="nav-item" role="presentation">
        <a class="nav-link ${window.location.pathname === "/deportes/copa-sudamericana/calendario" ? "active" : ""}" id="copaSudamericana-tab" href="/deportes/copa-sudamericana/calendario">Copa Sudamericana</a>
    </li>
    <li class="nav-item" role="presentation">
        <a class="nav-link ${window.location.pathname === "/deportes/premierleague/calendario" ? "active" : ""}" id="" href="/deportes/premierleague/calendario">Premier League</a>
    </li>
    <li class="nav-item" role="presentation">
        <a class="nav-link ${window.location.pathname === "/deportes/liga-espanola/calendario" ? "active" : ""}" id="" href="/deportes/liga-espanola/calendario">Liga Española</a>
    </li>
</ul>
`;

function eventLigaPro() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/tabla-de-posiciones",
      subUrl: {
        name: "Posiciones",
        agenda:
          "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/htmlCenter/data/deportes/futbol/ecuador/pages/es/agenda.html",
        iframe:
          "https://estadisticas.ecuavisa.com/sites/services/datafactory/html/v3/page.html?channel=deportes.futbol.ecuador&lang=es_LA&page=posiciones",
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

  const uLigaProTabla = "/deportes/tabla-de-posiciones";
  const uLigaProCalendario = "/deportes/liga-pro-serie-a-ecuador/calendario";
  const uLigaProGoleadores = "/deportes/liga-pro-serie-a-ecuador/goleadores";
  const uLigaProPlanteles = "/deportes/liga-pro-serie-a-ecuador/planteles";

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          ${navLinksTemplate}
          <div class="tab-content" id="myTabContent">
              <div class="" id="ligapro" role="tabpanel" aria-labelledby="ligapro-tab">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/tabla-de-posiciones" class="nav-link ${currentUrl === uLigaProTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
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
                      <div class="" id="Posiciones" role="tabpanel" aria-labelledby="Posiciones-tab">
                          <ul class="nav nav-pills navChilds s_acumulada" id="myTab" role="tablist">
                              <li class="nav-item" role="presentation">
                                  <a href="/deportes/tabla-de-posiciones" class="nav-link active" id="fase2-tab" >Fase 2</a>
                              </li>
                              <li class="nav-item" role="presentation">
                                  <a href="/deportes/liga-pro-serie-a-ecuador/tabla-acumulada" class="nav-link " id="acumulada-tab">Acumulada</a>
                              </li>
                          </ul>
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
  if(skk){
    skk.innerHTML = htmlContent;
  }
}

function eventLibertadores() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/copa-libertadores",
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

  const uLibertadoresTabla = "/deportes/copa-libertadores";
  const uLibertadoresCalendario = "/deportes/copa-libertadores/calendario";
  const uLibertadoresGoleadores = "/deportes/copa-libertadores/goleadores";
  const uLibertadoresPlanteles = "/deportes/copa-libertadores/planteles";

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          ${navLinksTemplate}
          <div class="tab-content" id="myTabContent">
              <div class="" id="ligapro" role="tabpanel" aria-labelledby="ligapro-tab">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-libertadores/calendario" class="nav-link ${currentUrl === uLibertadoresCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-libertadores/goleadores" class="nav-link ${currentUrl === uLibertadoresGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-libertadores/planteles" class="nav-link ${currentUrl === uLibertadoresPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-libertadores" class="nav-link ${currentUrl === uLibertadoresTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
                      </li>
                  </ul>
                  <div class="tab-content" id="myTabContent">
                      <div class="" id="Posiciones" role="tabpanel" aria-labelledby="Posiciones-tab">
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
  const skk = document.querySelector(".contenido_dinamico__libertadores");
  if(skk){
    skk.innerHTML = htmlContent;
  }
}

function eventSudamericana() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/copa-sudamericana",
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

  const usudamericanaTabla = "/deportes/copa-sudamericana";
  const usudamericanaCalendario = "/deportes/copa-sudamericana/calendario";
  const usudamericanaGoleadores = "/deportes/copa-sudamericana/goleadores";
  const usudamericanaPlanteles = "/deportes/copa-sudamericana/planteles";

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          ${navLinksTemplate}
          <div class="tab-content" id="myTabContent">
              <div class="" id="ligapro" role="tabpanel" aria-labelledby="ligapro-tab">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                    
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-sudamericana/calendario" class="nav-link ${currentUrl === usudamericanaCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-sudamericana/goleadores" class="nav-link ${currentUrl === usudamericanaGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-sudamericana/planteles" class="nav-link ${currentUrl === usudamericanaPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/copa-sudamericana" class="nav-link ${currentUrl === usudamericanaTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
                      </li>
                  </ul>
                  <div class="tab-content" id="myTabContent">
                      <div class="" id="Posiciones" role="tabpanel" aria-labelledby="Posiciones-tab">
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
  const skk = document.querySelector(".contenido_dinamico__sudamericana");
  if(skk){
    skk.innerHTML = htmlContent;
  }
}

function eventPremierLeague() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/premierleague",
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

  const upremierleagueTabla = "/deportes/premierleague";
  const upremierleagueCalendario = "/deportes/premierleague/calendario";
  const upremierleagueGoleadores = "/deportes/premierleague/goleadores";
  const upremierleaguePlanteles = "/deportes/premierleague/planteles";

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          ${navLinksTemplate}
          <div class="tab-content" id="myTabContent">
              <div class="" id="ligapro" role="tabpanel">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/premierleague/calendario" class="nav-link ${currentUrl === upremierleagueCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/premierleague/goleadores" class="nav-link ${currentUrl === upremierleagueGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/premierleague/planteles" class="nav-link ${currentUrl === upremierleaguePlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/premierleague" class="nav-link ${currentUrl === upremierleagueTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
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
  if(skk){
    skk.innerHTML = htmlContent;
  }
}

function eventLaLigaEspañola() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/liga-espanola",
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

  const uligaespanolaTabla = "/deportes/liga-espanola";
  const uligaespanolaCalendario = "/deportes/liga-espanola/calendario";
  const uligaespanolaGoleadores = "/deportes/liga-espanola/goleadores";
  const uligaespanolaPlanteles = "/deportes/liga-espanola/planteles";

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          ${navLinksTemplate}
          <div class="tab-content" id="myTabContent">
              <div class="" id="ligapro" role="tabpanel">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                      
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/liga-espanola/calendario" class="nav-link ${currentUrl === uligaespanolaCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/liga-espanola/goleadores" class="nav-link ${currentUrl === uligaespanolaGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/liga-espanola/planteles" class="nav-link ${currentUrl === uligaespanolaPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/liga-espanola" class="nav-link ${currentUrl === uligaespanolaTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
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
  if(skk){
    skk.innerHTML = htmlContent;
  }
}

if (window.location.pathname === "/deportes/tabla-de-posiciones" || window.location.pathname === "/deportes/liga-pro-serie-a-ecuador/calendario" || window.location.pathname === "/deportes/liga-pro-serie-a-ecuador/goleadores" || window.location.pathname === "/deportes/liga-pro-serie-a-ecuador/planteles") {
  setTimeout(() => {
    eventLigaPro();
  }, 200);
} else if (window.location.pathname === "/deportes/copa-libertadores" || window.location.pathname === "/deportes/copa-libertadores/calendario" || window.location.pathname === "/deportes/copa-libertadores/goleadores" || window.location.pathname === "/deportes/copa-libertadores/planteles") {
  setTimeout(() => {
    eventLibertadores();
  }, 200);
} else if (window.location.pathname === "/deportes/copa-sudamericana" || window.location.pathname === "/deportes/copa-sudamericana/calendario" || window.location.pathname === "/deportes/copa-sudamericana/goleadores" || window.location.pathname === "/deportes/copa-sudamericana/planteles") {
  setTimeout(() => {
    eventSudamericana();
  }, 200);
} else if (window.location.pathname === "/deportes/premierleague" || window.location.pathname === "/deportes/premierleague/calendario" || window.location.pathname === "/deportes/premierleague/goleadores" || window.location.pathname === "/deportes/premierleague/planteles") {
  setTimeout(() => {
    eventPremierLeague();
  }, 200);
} else if (window.location.pathname === "/deportes/liga-espanola" || window.location.pathname === "/deportes/liga-espanola/calendario" || window.location.pathname === "/deportes/liga-espanola/goleadores" || window.location.pathname === "/deportes/liga-espanola/planteles") {
  setTimeout(() => {
    eventLaLigaEspañola();
  }, 200);
}else { console.log("no esta validado dicha url");}
