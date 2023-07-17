function eventoRecomendadasUser() {
  // Obtener la referencia al elemento contenedor
  const htmlContainer = document.querySelector(".htmlRecomen");
  htmlContainer.textContent = "Cargando...";
  fetch("https://servicio-de-actividad.vercel.app/recomendadas/81408")
    .then((response) => response.json())
    .then((data) => {
      // Obtener el contenido de la API
      const apiData = data.data;
      console.log(apiData);
      htmlContainer.textContent = "";

      // Declarar e inicializar el contador
      let contadorRec = 1;

      // Recorrer los elementos de la matriz 'data'
      for (let i = 0; i < 6 && i < apiData.length; i++) {
        const item = apiData[i];
        const content = item.content[0];

        // Obtener los valores que deseas mostrar
        const imageUrl = content.url;
        const link = item.link;
        const section = item.section;
        const title = item.title;

        // Crear elementos HTML para mostrar la información
        const container = document.createElement("div");
        const image = document.createElement("img");
        const sectionParagraph = document.createElement("p");
        const titleHeading = document.createElement("h2");
        const linkAnchor = document.createElement("a");

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

        // Agregar los elementos al contenedor
        container.appendChild(image);
        container.appendChild(sectionParagraph);
        container.appendChild(titleHeading);
        container.appendChild(linkAnchor);

        // Agregar el contenedor al elemento contenedor principal
        htmlContainer.innerHTML += htCont;
      }
    })
    .catch((error) => console.log(error));
}

eventoRecomendadasUser();
