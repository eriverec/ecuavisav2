function eventoRecomendadasUser() {
  // Obtener la referencia al elemento contenedor
  const wUserId = localStorage.getItem("wylexUserId");
  // const wUserId = "81408";

  if (wUserId) {
    const htmlContainer = document.querySelector(".htmlRecomen");
    htmlContainer.textContent = "Cargando...";
    fetch("https://servicio-de-actividad.vercel.app/recomendadas/" + wUserId)
      .then((response) => response.json())
      .then((data) => {
        // Obtener el contenido de la API
        const apiData = data.data;
        console.log(apiData);
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
            const conColor = configTemplate.color
            const conBase = document.querySelector(".htmlRecomen");

            // Add the title above the items with an <h1> element
            const h1Title = document.createElement("h1");
            h1Title.textContent = conTitulo;
            h1Title.classList.add("text_recomendadas");
            h1Title.style.color = conColor;
            conBase.appendChild(h1Title);

            // console.log(conStyle);
            if (conStyle === "grid") {
              console.log("si es grid");
              const div_grid = document.createElement("div");
              div_grid.classList.add("parent_" + conStyle);

              // Recorrer los elementos de la matriz 'data'
              for (let i = 0; i < conNotas && i < apiData.length; i++) {
                const item = apiData[i];
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
              for (let i = 0; i < conNotas && i < apiData.length; i++) {
                const item = apiData[i];
                const content = item.content[0];

                // Obtener los valores que deseas mostrar
                const imageUrl = content.url;
                const link = item.link;
                const section = item.section;
                const title = item.title;

                const htCont = /*html*/ `
                <article class="article-rec style-${conStyle} element-rec-${contadorRec}">
                  <div class="media_block">
                    <div class="textBlock">
                      <p class="sectionRec"> ${section}</p>
                      <div class="headlineRec">
                        <a href="${link}">${title}</a> 
                      </div>
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
              for (let i = 0; i < conNotas && i < apiData.length; i++) {
                const item = apiData[i];
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

                  sw.append(dprev);
                  sw.append(dnext);

                  for (const slides of slide) {
                    slides.classList.add("swiper-slide");
                  }

                  var swiper = new Swiper(".htmlRecomen", {
                    slidesPerView: 3,
                    spaceBetween: 20,
                    navigation: {
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
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
                  }, 300);
                }

                $(document).ready(function () {
                  sGoHReco();
                });

                div_grid.innerHTML += htCont;
              }
              htmlContainer.appendChild(div_grid);
              console.log("si es swipper");
            }else{
              console.log("no esta en ningun style");
            }

            // htmlContainer.appendChild(div_grid);
          })
          .catch((error) => console.log(error));

        //https://api-configuracion.vercel.app/web/foryou-conf
      })
      .catch((error) => console.log(error));
  }
}

eventoRecomendadasUser();
