  // Función para manejar el cambio de tab
  // document.addEventListener('DOMContentLoaded', () => {
  //   const tabLinks = document.querySelectorAll('.nav-link');
  //   const contents = {
  //     "home": {
  //       "url": "https://rudo.video/live/ecuavisa",
  //       "type": "iframe"
  //     },
  //     "profile": {
  //       "url": "https://rudo.video/live/ecuavisaqo",
  //       "type": "iframe"
  //     },
  //     "contact": {
  //       "url": "https://rudo.video/live/ecuavisa2",
  //       "type": "iframe"
  //     }
  //   };

  //   tabLinks.forEach(tabLink => {
  //     tabLink.addEventListener('click', (event) => {
  //       const tabId = event.currentTarget.getAttribute('data-bs-target').substring(1);
  //       handleTabContent(tabId);
  //     });
  //   });

  //   // Función para manejar la generación y eliminación del contenido del tab
  //   function handleTabContent(tabId) {
  //     // Eliminar todos los iframes o imágenes de los tabs
  //     Object.keys(contents).forEach(key => {
  //       const container = document.getElementById(`${key}-content`);
  //       container.innerHTML = '';
  //     });

  //     // Crear nuevo iframe o imagen en el tab seleccionado
  //     const selectedTabContent = contents[tabId];
  //     const container = document.getElementById(`${tabId}-content`);
  //     const loadingText = `<p class="cargandop"> <svg
  //         class="containersvg"
  //         viewBox="0 0 40 40"
  //         height="40"
  //         width="40"
  //       >
  //         <circle 
  //           class="track"
  //           cx="20" 
  //           cy="20" 
  //           r="17.5" 
  //           pathlength="100" 
  //           stroke-width="5px" 
  //           fill="none" 
  //         />
  //         <circle 
  //           class="car"
  //           cx="20" 
  //           cy="20" 
  //           r="17.5" 
  //           pathlength="100" 
  //           stroke-width="5px" 
  //           fill="none" 
  //         />
  //       </svg></p>`;
  //     container.innerHTML = loadingText;

  //     // container.appendChild(loadingText);

  //     setTimeout(() => {
  //       // loadingText.remove();
  //       container.innerHTML = ''; // Elimina el texto de carga
  //       if (selectedTabContent.type === "iframe") {
  //         const iframe = `
  //                         <iframe width="100%" height="400" src="${selectedTabContent.url}" frameborder="0" title="player">Player </iframe>
  //                     `;
  //         container.innerHTML = iframe;
  //       } else if (selectedTabContent.type === "image") {
  //         const img = `
  //                         <img src="${selectedTabContent.url}" alt="Imagen de ${tabId}" width="100%" height="400">
  //                     `;
  //         container.innerHTML = img;
  //       }
  //     }, 1000); // 1 segundo de retardo para mostrar el texto "Cargando..."
  //   }

  //   // Iniciar con el contenido del primer tab
  //   handleTabContent('home');
  // });