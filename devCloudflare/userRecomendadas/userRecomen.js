
/* --------------------------- RECOMENDADAS POR NAVEGACION --------------------------- */
function recomendadasNavegacion(){
  function eliminarEtiquetasHTML(texto) {
    // Eliminar todas las etiquetas HTML
    const textoSinEtiquetas = texto.replace(/<[^>]*>/g, '');
    // Eliminar las imágenes
    const textoSinImagenes = textoSinEtiquetas.replace(/\bhttps?:\/\/\S+\.(?:png|jpe?g|gif)\b/gi, '');
    return textoSinImagenes;
  }
  
  function eventoRecomendadasUser() {
    // Obtener la referencia al elemento contenedor
    // const wUserId = localStorage.getItem("wylexUserId");
    const wUserId = ECUAVISA_EC.USER_data("id");
    // const wUserId = "81408";
  
    if (wUserId) {
      const htmlContainer = document.querySelector(".htmlRecomen");
      // htmlContainer.textContent = "Cargando...";

      if(htmlContainer){
        htmlContainer.innerHTML = '<svg class="ring" viewBox="25 25 50 50" stroke-width="5"> <circle cx="50" cy="50" r="20"/></svg>';
    
        fetch("https://servicio-de-actividad.vercel.app/recomendadasv2/"+wUserId)
          .then((response) => response.json())
          .then((data) => {
            // Obtener el contenido de la API
            const apiData = data.data;
    
            if (data.resp === true) {
              console.log("si has navegado lo suficiente");
              // const randomItems = getRandomItems(apiData, 5);
              const randomItems = apiData;
              htmlContainer.textContent = "";
    
              // Declarar e inicializar el contador
              let contadorRec = 1;
              //swiper
              //featured
              //grid
              // Fetch the configTemplate from the API
              fetch("https://api-configuracion.vercel.app/web/foryou-conf")
                .then((response) => response.json())
                .then((configData) => {
                  const configTemplate = configData;
                  const conStyle = configTemplate.style;
                  const conTitulo = configTemplate.titulo;
                  const conNotas = configTemplate.notas;
                  const conColor = configTemplate.color;
                  const conBase = document.querySelector(".htmlRecomen");
    
                  // Add the title above the items with an <h1> element
                  const divTitle = document.createElement("div");
                  divTitle.classList.add("text_recomendadas");
                  conBase.appendChild(divTitle);
    
                  const textRec = document.querySelector(".text_recomendadas");
    
                  const cintilloImg = /*html*/ `
                <h2 class="t_recom" style="color:${conColor};">${conTitulo}</h2>
                <div class="c_azul_celeste_Desktop mb-4"><img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2FVector19.svg" alt="line_bloque" width="100%" height="auto" title="Cintillo"></div>
                <div class="c_azul_celeste_Mobile mb-4"><img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2FVector19.svg" alt="line_bloque" width="100%" height="25px" title="Cintillo"></div>`;
    
                  textRec.innerHTML = cintilloImg;
    
                  // console.log(conStyle);
                  if (conStyle === "grid") {
                    console.log("si es grid");
                    const div_grid = document.createElement("div");
                    div_grid.classList.add("parent_" + conStyle);
    
                    // Recorrer los elementos de la matriz 'data'
                    for (let i = 0; i < conNotas && i < randomItems.length; i++) {
                      const item = randomItems[i];
                      const content = item.content[0];
    
                      // Obtener los valores que deseas mostrar
                      const imageUrl = content.url;
                      const link = item.link;
                      const section = item.section;
                      const title = item.title;
    
                      const htCont = /*html*/ `
                    <article class="article-rec element-rec-${contadorRec}">
                      <div class="media_block">
                        <div class="textBlock">
                          <p class="sectionRec"> ${section}</p>
                          <div class="headlineRec">
                            <a href="${link}">${title}</a> 
                          </div>
                        </div>
                        <div class="multimediaRec">
                          <a href="${link}">
                            <img src="${imageUrl}" alt="${title}"/>
                          </a>
                        </div>
                      <div>
                    </article>`;
                      // Incrementar el contadorRec
                      contadorRec++;
    
                      div_grid.innerHTML += htCont;
                    }
                    htmlContainer.appendChild(div_grid);
                  } else if (conStyle === "featured") {
                    console.log("si es featured");
                    const div_featured = document.createElement("div");
                    div_featured.classList.add("parent_" + conStyle);
                    for (let i = 0; i < conNotas && i < randomItems.length; i++) {
                      const item = randomItems[i];
                      const content = item.content[0];
                      const imageUrl = content.url;
                      const link = item.link;
                      const section = item.section;
                      const title = item.title;
                      const texto = item.description.__text;
    
                      const htCont = /*html*/ `
                    <article class="article-rec style-${conStyle} element-rec-${contadorRec}">
                      <div class="media_block">
                        <div class="textBlock">
                          <p class="sectionRec"> ${section}</p>
                          <div class="headlineRec">
                            <a href="${link}">${title}</a> 
                          </div>
                         <div class="text-wrapper"><p>${eliminarEtiquetasHTML(texto).substring(0, 200) + '...'}</p> </div>
                        </div>
                        <div class="multimediaRec">
                          <a href="${link}">
                            <img src="${imageUrl}" width="100%" alt="${title}"/>
                          </a>
                        </div>
                      <div>
                    </article>`;
                      // Incrementar el contadorRec
                      contadorRec++;
    
                      div_featured.innerHTML += htCont;
                    }
    
                    htmlContainer.appendChild(div_featured);
                  } else if (conStyle === "swiper") {
                    //ESTO ES SWIPER
                    const div_grid = document.createElement("div");
                    div_grid.classList.add("parent_" + conStyle);
                    // Recorrer los elementos de la matriz 'data'
                    for (let i = 0; i < conNotas && i < randomItems.length; i++) {
                      const item = randomItems[i];
                      const content = item.content[0];
    
                      // Obtener los valores que deseas mostrar
                      const imageUrl = content.url;
                      const link = item.link;
                      const section = item.section;
                      const title = item.title;
    
                      const htCont = /*html*/ `
                    <article class="article-rec element-rec-${contadorRec}">
                      <div class="media_block">
                        <div class="multimediaRec">
                          <a href="${link}">
                            <img src="${imageUrl}" width="100%" alt="${title}"/>
                          </a>
                        </div>
                        <div class="textBlock">
                          <p class="sectionRec"> ${section}</p>
                          <div class="headlineRec">
                            <a href="${link}">${title}</a> 
                          </div>
                        </div>
                        
                      <div>
                    </article>`;
                      // Incrementar el contadorRec
                      contadorRec++;
    
                      function swiperReco() {
                        const sw = document.querySelector(".htmlRecomen");
                        const wra = document.querySelector(
                          ".htmlRecomen .parent_swiper"
                        );
                        const slide = document.querySelectorAll(
                          ".htmlRecomen .parent_swiper .article-rec"
                        );
    
                        sw.classList.add("swiper");
                        wra.classList.add("swiper-wrapper");
    
                        var dnext = document.createElement("div");
                        dnext.classList = "swiper-button-next";
    
                        var dprev = document.createElement("div");
                        dprev.classList = "swiper-button-prev";
    
                        var dpag = document.createElement("div");
                        dpag.classList = "swiper-pagination";
    
                        // sw.append(dprev);
                        // sw.append(dnext);
                        sw.append(dpag);
    
                        for (const slides of slide) {
                          slides.classList.add("swiper-slide");
                        }
    
                        var swiper = new Swiper(".htmlRecomen", {
                          slidesPerView: 1.5,
                          spaceBetween: 20,
                          // navigation: {
                          //   nextEl: ".swiper-button-next",
                          //   prevEl: ".swiper-button-prev",
                          // },
                          pagination: {
                            el: ".swiper-pagination",
                            dynamicBullets: true,
                            clickable: true,
                          },
                          breakpoints: {
                            600: {
                              slidesPerView: 1.5,
                              spaceBetween: 20,
                            },
                            768: {
                              slidesPerView: 3,
                              spaceBetween: 30,
                            },
                            1024: {
                              slidesPerView: 3,
                              spaceBetween: 30,
                            },
                            1200: {
                              slidesPerView: 4,
                              spaceBetween: 30,
                            },
                          },
                        });
                      }
    
                      function sGoHReco() {
                        setTimeout(function () {
                          if (typeof Swiper === "undefined") {
                            sGoHReco();
                          } else {
                            swiperReco();
                          }
                        }, 50);
                      }
    
                      $(document).ready(function () {
                        sGoHReco();
                      });
    
                      div_grid.innerHTML += htCont;
                    }
                    htmlContainer.appendChild(div_grid);
                    console.log("si es swipper");
                  } else {
                    console.log("no esta en ningun style");
                  }
    
                  // htmlContainer.appendChild(div_grid);
                })
                .catch((error) => console.log(error));
            } else {
              setTimeout(() => {
                console.log("no has navegado lo suficiente");
                document.querySelector('.htmlRecomen .ring').remove();
                // htmlContainer.innerHTML = `<div class="alert alert-primary text-uppercase" role="alert">No ha navegado lo suficiente para generar este contenido!</div>`;
              }, 300);
              return false;
            }
    
    
          })
          .catch((error) => console.log(error));
      }
  
    }
  }
  
  // Function to get 'count' random items from an array
  function getRandomItems(array, count) {
    const randomItems = [];
    const length = array.length;
    const selectedIndexes = new Set();
  
    while (selectedIndexes.size < count && selectedIndexes.size < length) {
      const randomIndex = Math.floor(Math.random() * length);
      if (!selectedIndexes.has(randomIndex)) {
        selectedIndexes.add(randomIndex);
        randomItems.push(array[randomIndex]);
      }
    }
  
    return randomItems;
  }
  
  eventoRecomendadasUser();

}

function recomendadasIntereses(){
  function eliminarEtiquetasHTMLIn(texto) {
    // Eliminar todas las etiquetas HTML
    const textoSinEtiquetas = texto.replace(/<[^>]*>/g, '');
    // Eliminar las imágenes
    const textoSinImagenes = textoSinEtiquetas.replace(/\bhttps?:\/\/\S+\.(?:png|jpe?g|gif)\b/gi, '');
    return textoSinImagenes;
  }
  
  function eventoRecomendadasUserIn() {
    // Obtener la referencia al elemento contenedor
    // const wUserIdInt = localStorage.getItem("wylexUserId");
    const wUserIdInt = ECUAVISA_EC.USER_data("id");
    // const wUserIdInt = "81408";
  
  
    if (wUserIdInt) {
      const htmlContainerInt = document.querySelector(".htmlRecomenIntereses");
      // htmlContainerInt.textContent = "Cargando...";
      if(htmlContainerInt){
        htmlContainerInt.innerHTML = '<svg class="ring" viewBox="25 25 50 50" stroke-width="5"> <circle cx="50" cy="50" r="20"/></svg>';
    
        fetch("https://servicio-de-actividad.vercel.app/recomendadasInteresesv2/"+wUserIdInt)
          .then((response) => response.json())
          .then((data) => {
            // Obtener el contenido de la API
            const apiData = data.data;
    
            if (data.resp === true) {
              console.log("si has navegado lo suficiente");
              const randomItems = apiData;
              htmlContainerInt.textContent = "";
    
              // Declarar e inicializar el contador
              let contadorRec = 1;
              //swiper
              //featured
              //grid
              // Fetch the configTemplate from the API
              fetch("https://api-configuracion.vercel.app/web/foryouinteres-conf")
                .then((response) => response.json())
                .then((configData) => {
                  const configTemplate = configData;
                  const conStyle = configTemplate.style;
                  const conTitulo = configTemplate.titulo;
                  const conNotas = configTemplate.notas;
                  const conColor = configTemplate.color;
                  const conBase = document.querySelector(".htmlRecomenIntereses");
    
                  // Add the title above the items with an <h1> element
                  const divTitle = document.createElement("div");
                  divTitle.classList.add("text_recomendadas_intereses");
                  conBase.appendChild(divTitle);
    
                  const textRec = document.querySelector(".text_recomendadas_intereses");
    
                  const cintilloImg = /*html*/ `
                <h2 class="t_recom" style="color:${conColor};">${conTitulo}</h2>
                <div class="c_azul_celeste_Desktop mb-4"><img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2FVector19.svg" alt="line_bloque" width="100%" height="auto" title="Cintillo"></div>
                <div class="c_azul_celeste_Mobile mb-4"><img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2FVector19.svg" alt="line_bloque" width="100%" height="25px" title="Cintillo"></div>`;

                textRec.innerHTML = cintilloImg;
    
    
                  // console.log(conStyle);
                  if (conStyle === "grid") {
                    console.log("si es grid");
                    const div_grid = document.createElement("div");
                    div_grid.classList.add("parent_" + conStyle);
    
                    // Recorrer los elementos de la matriz 'data'
                    for (let i = 0; i < conNotas && i < randomItems.length; i++) {
                      const item = randomItems[i];
                      const content = item.content[0];
    
                      // Obtener los valores que deseas mostrar
                      const imageUrl = content.url;
                      const link = item.link;
                      const section = item.section;
                      const title = item.title;
    
                      const htCont = /*html*/ `
                    <article class="article-rec element-rec-${contadorRec}">
                      <div class="media_block">
                        <div class="textBlock">
                          <p class="sectionRec"> ${section}</p>
                          <div class="headlineRec">
                            <a href="${link}">${title}</a> 
                          </div>
                        </div>
                        <div class="multimediaRec">
                          <a href="${link}">
                            <img src="${imageUrl}" alt="${title}"/>
                          </a>
                        </div>
                      <div>
                    </article>`;
                      // Incrementar el contadorRec
                      contadorRec++;
    
                      div_grid.innerHTML += htCont;
                    }
                    htmlContainerInt.appendChild(div_grid);
                  } else if (conStyle === "featured") {
                    console.log("si es featured");
                    const div_featured = document.createElement("div");
                    div_featured.classList.add("parent_" + conStyle);
                    for (let i = 0; i < conNotas && i < randomItems.length; i++) {
                      const item = randomItems[i];
                      const content = item.content[0];
                      const imageUrl = content.url;
                      const link = item.link;
                      const section = item.section;
                      const title = item.title;
                      const texto = item.description.__text;
    
                      const htCont = /*html*/ `
                    <article class="article-rec style-${conStyle} element-rec-${contadorRec}">
                      <div class="media_block">
                        <div class="textBlock">
                          <p class="sectionRec"> ${section}</p>
                          <div class="headlineRec">
                            <a href="${link}">${title}</a> 
                          </div>
                         <div class="text-wrapper"><p>${eliminarEtiquetasHTMLIn(texto).substring(0, 200) + '...'}</p> </div>
                        </div>
                        <div class="multimediaRec">
                          <a href="${link}">
                            <img src="${imageUrl}" width="100%" alt="${title}"/>
                          </a>
                        </div>
                      <div>
                    </article>`;
                      // Incrementar el contadorRec
                      contadorRec++;
    
                      div_featured.innerHTML += htCont;
                    }
    
                    htmlContainerInt.appendChild(div_featured);
                  } else if (conStyle === "swiper") {
                    //ESTO ES SWIPER
                    const div_grid = document.createElement("div");
                    div_grid.classList.add("parent_" + conStyle);
                    // Recorrer los elementos de la matriz 'data'
                    for (let i = 0; i < conNotas && i < randomItems.length; i++) {
                      const item = randomItems[i];
                      const content = item.content[0];
    
                      // Obtener los valores que deseas mostrar
                      const imageUrl = content.url;
                      const link = item.link;
                      const section = item.section;
                      const title = item.title;
    
                      const htCont = /*html*/ `
                    <article class="article-rec element-rec-${contadorRec}">
                      <div class="media_block">
                        <div class="multimediaRec">
                          <a href="${link}">
                            <img src="${imageUrl}" width="100%" alt="${title}"/>
                          </a>
                        </div>
                        <div class="textBlock">
                          <p class="sectionRec"> ${section}</p>
                          <div class="headlineRec">
                            <a href="${link}">${title}</a> 
                          </div>
                        </div>
                        
                      <div>
                    </article>`;
                      // Incrementar el contadorRec
                      contadorRec++;
    
                      function swiperReco() {
                        const sw = document.querySelector(".htmlRecomenIntereses");
                        const wra = document.querySelector(".htmlRecomenIntereses .parent_swiper");
                        const slide = document.querySelectorAll(".htmlRecomenIntereses .parent_swiper .article-rec");
    
                        sw.classList.add("swiper");
                        wra.classList.add("swiper-wrapper");
    
                        var dnext = document.createElement("div");
                        dnext.classList = "swiper-button-next";
    
                        var dprev = document.createElement("div");
                        dprev.classList = "swiper-button-prev";
    
                        var dpag = document.createElement("div");
                        dpag.classList = "swiper-pagination";
    
                        // sw.append(dprev);
                        // sw.append(dnext);
                        sw.append(dpag);
    
                        for (const slides of slide) {
                          slides.classList.add("swiper-slide");
                        }
    
                        var swiper = new Swiper(".htmlRecomenIntereses", {
                          slidesPerView: 1.5,
                          spaceBetween: 20,
                          // navigation: {
                          //   nextEl: ".swiper-button-next",
                          //   prevEl: ".swiper-button-prev",
                          // },
                          pagination: {
                            el: ".swiper-pagination",
                            dynamicBullets: true,
                            clickable: true,
                          },
                          breakpoints: {
                            600: {
                              slidesPerView: 1.5,
                              spaceBetween: 20,
                            },
                            768: {
                              slidesPerView: 3,
                              spaceBetween: 30,
                            },
                            1024: {
                              slidesPerView: 3,
                              spaceBetween: 30,
                            },
                            1200: {
                              slidesPerView: 4,
                              spaceBetween: 30,
                            },
                          },
                        });
                      }
    
                      function sGoHReco() {
                        setTimeout(function () {
                          if (typeof Swiper === "undefined") {
                            sGoHReco();
                          } else {
                            swiperReco();
                          }
                        }, 100);
                      }
    
                      $(document).ready(function () {
                        sGoHReco();
                      });
    
                      div_grid.innerHTML += htCont;
                    }
                    htmlContainerInt.appendChild(div_grid);
                    console.log("si es swipper");
                  } else {
                    console.log("no esta en ningun style");
                  }
    
                  // htmlContainerInt.appendChild(div_grid);
                })
                .catch((error) => console.log(error));
            } else {
              console.log("no has navegado lo suficiente");
              document.querySelector('.htmlRecomenIntereses .ring').remove();
            }
    
          })
          .catch((error) => console.log(error));
      } 
  
    }
  }
  
  // Function to get 'count' random items from an array
  function getRandomItemsIn(array, count) {
    const randomItems = [];
    const length = array.length;
    const selectedIndexes = new Set();
  
    while (selectedIndexes.size < count && selectedIndexes.size < length) {
      const randomIndex = Math.floor(Math.random() * length);
      if (!selectedIndexes.has(randomIndex)) {
        selectedIndexes.add(randomIndex);
        randomItems.push(array[randomIndex]);
      }
    }
  
    return randomItems;
  }
  
  eventoRecomendadasUserIn();

}  

//la funcion se ejetuca en global.js

// ECUAVISA_EC.ecuavisaScroll().then((e) => {
//   if(e){
//     recomendadasNavegacion();  
//     recomendadasIntereses();
//   }
// });


setTimeout(() => {
  recomendadasNavegacion();
}, 300);