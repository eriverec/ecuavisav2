function eventoRecomendadasUser() {
  // Obtener la referencia al elemento contenedor
  const wUserId = localStorage.getItem("wylexUserId");
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

        // Recorrer los elementos de la matriz 'data'
        for (let i = 0; i < 6 && i < apiData.length; i++) {
          const item = apiData[i];
          const content = item.content[0];

          // Obtener los valores que deseas mostrar
          const imageUrl = content.url;
          const link = item.link;
          const section = item.section;
          const title = item.title;



          const configTemplate = [
            {
              notas: 4,
              style: "grid",
              color: "#345345",
              titulo: "Notas recomendadas para tí",
              notacustom: [
                {
                  titulo: "cualquier titular",
                  descripcion: "description",
                  seccion: "la seccion",
                  urlImg: "linkdeimagen.jpg",
                  urlNota: "linkdeNota",
                },
                {
                  titulo: "cualquier titular",
                  descripcion: "description",
                  seccion: "la seccion",
                  urlImg: "linkdeimagen.jpg",
                  urlNota: "linkdeNota",
                },
              ],
            },
          ];


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

     

          // Agregar el contenedor al elemento contenedor principal
          htmlContainer.innerHTML += htCont;
        }
      })
      .catch((error) => console.log(error));
  }
}

eventoRecomendadasUser();
