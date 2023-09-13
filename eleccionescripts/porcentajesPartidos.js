// URL de la API
const apiUrl = 'https://api-configuracion.vercel.app/web/data-sv';

// Obtener referencia al elemento div
const dataPorcentajeDiv = document.getElementById('dataPorcentaje');
const dataPorcentajeFotos = document.getElementById('dataFotos');

// Realizar una solicitud GET a la API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // Acceder a los datos de porcentaje
        const porcentajeData = data.porcentaje;

        // Crear una cadena para almacenar los elementos de porcentaje formateados
        let porcentajeHTML = '';
        let porcentajeHTMLFoto = '';


        // Iterar a través de los datos de porcentaje
        porcentajeData.forEach(item => {
            // Formatear el porcentaje a dos decimales
            const porcentajeFormateado = item.value.toFixed(2);
            const imgFoto = item.img;
            const imgName = item.name;
            const imgPartido = item.partido;

            // Establecer una clase CSS en función del valor del porcentaje
            // const claseCSS = item.value > 50 ? 'high' : 'low';
             // Establecer una clase CSS en función del valor del porcentaje
            const claseCSS = item.name === 'Daniel Noboa' ? 'daniel-noboa' : (item.name === 'Luisa González' ? 'luisa-gonzalez' : (item.value > 50 ? 'high' : 'low'));


            // Crear el elemento de porcentaje
            const porcentajeElement = `<div class="porcentaje-item ${claseCSS}" style="width: ${porcentajeFormateado}%">
           ${porcentajeFormateado}%</div>`;

            const porcentajeElementFoto = `
          <div class="itemsFoto"><img src="${imgFoto}" width="180px" alt="Ecuavisa"/>
            <div class="block-text">
              <span class="fotoName"> ${imgName} </span>
              <span class="fotoPartido"> ${imgPartido} </span>
            </div>
          </div> `;

            // Agregar el elemento de porcentaje al HTML
            porcentajeHTML += porcentajeElement;
            porcentajeHTMLFoto += porcentajeElementFoto;

        });

        // Asignar el HTML al elemento div
        dataPorcentajeDiv.innerHTML = porcentajeHTML;
        dataPorcentajeFotos.innerHTML = porcentajeHTMLFoto;

    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });
