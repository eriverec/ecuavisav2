// 'use strict';

// function Tabs() {
//   var bindAll = function() {
//     var menuElements = document.querySelectorAll('[data-tab]');
//     for(var i = 0; i < menuElements.length ; i++) {
//       menuElements[i].addEventListener('click', change, false);
//     }
//   }

//   var clear = function() {
//     var menuElements = document.querySelectorAll('[data-tab]');
//     for(var i = 0; i < menuElements.length ; i++) {
//       menuElements[i].classList.remove('active');
//       var id = menuElements[i].getAttribute('data-tab');
//       document.getElementById(id).classList.remove('active');
//     }
//   }

//   var change = function(e) {
//     clear();
//     e.target.classList.add('active');
//     var id = e.currentTarget.getAttribute('data-tab');
//     document.getElementById(id).classList.add('active');
//   }

//   bindAll();
// }

// var connectTabs = new Tabs();


//FUNCION PARA HACER SCROLL HORIZONTAL AUTOMATICO DE ACUERDO A LA CLASE ACTIVE
setTimeout(() => {
  var activeNavItem = document.querySelector(".nav-link.active");
  if (activeNavItem) {
    var contTabs = document.querySelectorAll("#myTab");
    if(contTabs){
      for (const sst of contTabs){
        sst.scrollLeft = activeNavItem.offsetLeft - (sst.offsetWidth - activeNavItem.offsetWidth) / 2;
        console.log('for ejecutado scroll horizontal');
      }
    }
  }
}, 200);


function eventLigaPro() {
  const urlsCifras = [
    {
      mainUrl: "/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador",
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

  const uLigaProTabla = "/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador";
  const uLigaProCalendario = "/deportes/liga-pro-serie-a-ecuador/calendario";
  const uLigaProGoleadores = "/deportes/liga-pro-serie-a-ecuador/goleadores";
  const uLigaProPlanteles = "/deportes/liga-pro-serie-a-ecuador/planteles";
  const uLigaProAcumulada = "/deportes/tabla-acumulada/liga-pro/serie-a-ecuador";

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
      <a href="/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador" class="nav-link active" id="fase2-tab" >Fase 2</a>
  </li>
  <li class="nav-item" role="presentation">
      <a href="/deportes/tabla-acumulada/liga-pro/serie-a-ecuador" class="nav-link " id="acumulada-tab">Acumulada</a>
  </li>
</ul>`;

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          <ul class="nav nav-pills navCentral" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                  <a class="nav-link active" id="ligapro-tab" href="/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador">LigaPro</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link " id="copali-tab" href="/deportes/copa-libertadores/calendario">Copa Libertadores</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link " id="copaSudamericana-tab" href="/deportes/copa-sudamericana/calendario" >Copa Sudamericana</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/premierleague/calendario" >Premier League</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/liga-espanola/calendario">Liga Española</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/mls/calendario">MLS</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link " id="" href="/deportes/leaguescup/calendario">Leagues Cup</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/eliminatorias-conmebol/calendario">Eliminatorias</a>
              </li>
          </ul>
          <div class="tab-content" id="myTabContent">
              <div class="" id="ligapro" role="tabpanel" aria-labelledby="ligapro-tab">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador" class="nav-link ${currentUrl === uLigaProTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
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
                          ${currentUrl === uLigaProTabla ? acumulada : currentUrl === uLigaProAcumulada ? acumulada : ''}
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

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          <ul class="nav nav-pills navCentral" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                  <a class="nav-link " id="ligapro-tab" href="/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador">LigaPro</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link active" id="copali-tab" href="/deportes/copa-libertadores/calendario">Copa Libertadores</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link " id="copaSudamericana-tab" href="/deportes/copa-sudamericana/calendario" >Copa Sudamericana</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/premierleague/calendario" >Premier League</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/liga-espanola/calendario">Liga Española</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/mls/calendario">MLS</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link " id="" href="/deportes/leaguescup/calendario">Leagues Cup</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/eliminatorias-conmebol/calendario">Eliminatorias</a>
              </li>
          </ul>
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
                          <a href="/deportes/copa-libertadores/tablaposiciones" class="nav-link ${currentUrl === uLibertadoresTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
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

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          <ul class="nav nav-pills navCentral" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                  <a class="nav-link " id="ligapro-tab" href="/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador">LigaPro</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link " id="copali-tab" href="/deportes/copa-libertadores/calendario">Copa Libertadores</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link active" id="copaSudamericana-tab" href="/deportes/copa-sudamericana/calendario" >Copa Sudamericana</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/premierleague/calendario" >Premier League</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link " id="" href="/deportes/liga-espanola/calendario">Liga Española</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/mls/calendario">MLS</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link " id="" href="/deportes/leaguescup/calendario">Leagues Cup</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/eliminatorias-conmebol/calendario">Eliminatorias</a>
              </li>
          </ul>
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
                          <a href="/deportes/copa-sudamericana/tablaposiciones" class="nav-link ${currentUrl === usudamericanaTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
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

  // Recorrer el objeto urlsCifras
  for (const urlObj of urlsCifras) {
    if (currentUrl === urlObj.mainUrl) {
      // Generar el contenido HTML usando un template string
      htmlContent = /*html*/ `        
          <ul class="nav nav-pills navCentral" id="myTab" role="tablist">
              <li class="nav-item" role="presentation">
                  <a class="nav-link " id="ligapro-tab" href="/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador">LigaPro</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link " id="copali-tab" href="/deportes/copa-libertadores/calendario">Copa Libertadores</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="copaSudamericana-tab" href="/deportes/copa-sudamericana/calendario" >Copa Sudamericana</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link active" id="" href="/deportes/premierleague/calendario" >Premier League</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/liga-espanola/calendario">Liga Española</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/mls/calendario">MLS</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/leaguescup/calendario">Leagues Cup</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/eliminatorias-conmebol/calendario">Eliminatorias</a>
              </li>
          </ul>
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
                          <a href="/deportes/premierleague/tablaposiciones" class="nav-link ${currentUrl === upremierleagueTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
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
                  <a class="nav-link" id="copali-tab" href="/deportes/copa-libertadores/calendario">Copa Libertadores</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="copaSudamericana-tab" href="/deportes/copa-sudamericana/calendario">Copa Sudamericana</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/premierleague/calendario">Premier League</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link active" id="" href="/deportes/liga-espanola/calendario">Liga Española</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/mls/calendario">MLS</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/leaguescup/calendario">Leagues Cup</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/eliminatorias-conmebol/calendario">Eliminatorias</a>
              </li>
          </ul>
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
                          <a href="/deportes/liga-espanola/tablaposiciones" class="nav-link ${currentUrl === uligaespanolaTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
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
                  <a class="nav-link" id="copali-tab" href="/deportes/copa-libertadores/calendario">Copa Libertadores</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="copaSudamericana-tab" href="/deportes/copa-sudamericana/calendario">Copa Sudamericana</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/premierleague/calendario">Premier League</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/liga-espanola/calendario">Liga Española</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link active" id="" href="/deportes/mls/calendario">MLS</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/leaguescup/calendario">Leagues Cup</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/eliminatorias-conmebol/calendario">Eliminatorias</a>
              </li>
          </ul>
          <div class="tab-content" id="myTabContent">
              <div role="tabpanel">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                      
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/mls/calendario" class="nav-link ${currentUrl === uMLSCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/mls/goleadores" class="nav-link ${currentUrl === uMLSGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/mls/planteles" class="nav-link ${currentUrl === uMLSPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/mls/tablaposiciones" class="nav-link ${currentUrl === uMLSTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
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
  if(skk){
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
                  <a class="nav-link" id="copali-tab" href="/deportes/copa-libertadores/calendario">Copa Libertadores</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="copaSudamericana-tab" href="/deportes/copa-sudamericana/calendario">Copa Sudamericana</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/premierleague/calendario">Premier League</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/liga-espanola/calendario">Liga Española</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/mls/calendario">MLS</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link active" id="" href="/deportes/leaguescup/calendario">Leagues Cup</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/eliminatorias-conmebol/calendario">Eliminatorias</a>
              </li>
          </ul>
          <div class="tab-content" id="myTabContent">
              <div role="tabpanel">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/leaguescup/calendario" class="nav-link ${currentUrl === uleaguescupCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/leaguescup/goleadores" class="nav-link ${currentUrl === uleaguescupGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/leaguescup/planteles" class="nav-link ${currentUrl === uleaguescupPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/leaguescup/tablaposiciones" class="nav-link ${currentUrl === uleaguescupTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
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
  if(skk){
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
                  <a class="nav-link" id="copali-tab" href="/deportes/copa-libertadores/calendario">Copa Libertadores</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="copaSudamericana-tab" href="/deportes/copa-sudamericana/calendario">Copa Sudamericana</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/premierleague/calendario">Premier League</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/liga-espanola/calendario">Liga Española</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/mls/calendario">MLS</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link" id="" href="/deportes/leaguescup/calendario">Leagues Cup</a>
              </li>
              <li class="nav-item" role="presentation">
                  <a class="nav-link active" id="" href="/deportes/eliminatorias-conmebol/calendario">Eliminatorias</a>
              </li>
          </ul>
          <div class="tab-content" id="myTabContent">
              <div role="tabpanel">
                  <iframe title="ifr_Posiciones" src="${urlObj.subUrl.agenda}" width="100%" height="180" scrolling="auto" style="width: 1px; min-width: 100%; *width: 100%;" class=""></iframe>                   
                  <ul class="nav nav-pills navChilds" id="myTab" role="tablist">
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/eliminatorias-conmebol/calendario" class="nav-link ${currentUrl === ueliminatoriasConmebolCalendario ? "active" : ""} " id="Fixture-tab">Calendario</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/eliminatorias-conmebol/goleadores" class="nav-link ${currentUrl === ueliminatoriasConmebolGoleadores ? "active" : ""} " id="Goleadores-tab" >Goleadores</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/eliminatorias-conmebol/planteles" class="nav-link ${currentUrl === ueliminatoriasConmebolPlanteles ? "active" : ""} " id="Planteles-tab" >Planteles</a>
                      </li>
                      <li class="nav-item" role="presentation">
                          <a href="/deportes/eliminatorias-conmebol/tablaposiciones" class="nav-link ${currentUrl === ueliminatoriasConmebolTabla ? "active" : ""}" id="Posiciones-tab" >Posiciones</a>
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
  const skk = document.querySelector(".contenido_dinamico__eliminatorias");
  if(skk){
    skk.innerHTML = htmlContent;
  }
}

if (window.location.pathname === "/deportes/tabla-de-posiciones/liga-pro/serie-a-ecuador" || window.location.pathname === "/deportes/liga-pro-serie-a-ecuador/calendario" || window.location.pathname === "/deportes/liga-pro-serie-a-ecuador/goleadores" || window.location.pathname === "/deportes/liga-pro-serie-a-ecuador/planteles") {
  setTimeout(() => {
    eventLigaPro();
  }, 200);
} else if (window.location.pathname === "/deportes/copa-libertadores/tablaposiciones" || window.location.pathname === "/deportes/copa-libertadores/calendario" || window.location.pathname === "/deportes/copa-libertadores/goleadores" || window.location.pathname === "/deportes/copa-libertadores/planteles") {
  setTimeout(() => {
    eventLibertadores();
  }, 200);
} else if (window.location.pathname === "/deportes/copa-sudamericana/tablaposiciones" || window.location.pathname === "/deportes/copa-sudamericana/calendario" || window.location.pathname === "/deportes/copa-sudamericana/goleadores" || window.location.pathname === "/deportes/copa-sudamericana/planteles") {
  setTimeout(() => {
    eventSudamericana();
  }, 200);
} else if (window.location.pathname === "/deportes/premierleague/tablaposiciones" || window.location.pathname === "/deportes/premierleague/calendario" || window.location.pathname === "/deportes/premierleague/goleadores" || window.location.pathname === "/deportes/premierleague/planteles") {
  setTimeout(() => {
    eventPremierLeague();
  }, 200);
} else if (window.location.pathname === "/deportes/liga-espanola/tablaposiciones" || window.location.pathname === "/deportes/liga-espanola/calendario" || window.location.pathname === "/deportes/liga-espanola/goleadores" || window.location.pathname === "/deportes/liga-espanola/planteles") {
  setTimeout(() => {
    eventLaLigaEspañola();
  }, 200);
} else if (window.location.pathname === "/deportes/mls/tablaposiciones" || window.location.pathname === "/deportes/mls/calendario" || window.location.pathname === "/deportes/mls/goleadores" || window.location.pathname === "/deportes/mls/planteles") {
  setTimeout(() => {
    eventMLS();
  }, 200);
} else if (window.location.pathname === "/deportes/leaguescup/tablaposiciones" || window.location.pathname === "/deportes/leaguescup/calendario" || window.location.pathname === "/deportes/leaguescup/goleadores" || window.location.pathname === "/deportes/leaguescup/planteles") {
  setTimeout(() => {
    eventLeaguesCup();
  }, 200);
} else if (window.location.pathname === "/deportes/eliminatorias-conmebol/tablaposiciones" || 
window.location.pathname === "/deportes/eliminatorias-conmebol/calendario" || 
window.location.pathname === "/deportes/eliminatorias-conmebol/goleadores" || 
window.location.pathname === "/deportes/eliminatorias-conmebol/planteles") {
  setTimeout(() => {
    eventEliminatorios();
  }, 200);
} else { console.log("no esta validado dicha url");}
