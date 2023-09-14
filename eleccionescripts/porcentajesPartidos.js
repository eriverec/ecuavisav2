// URL de la API
const apiUrl = 'https://api-configuracion.vercel.app/web/data-sv';

// Obtener referencia al elemento div
const dataPorcentajeDiv = document.getElementById('dataPorcentaje');
const dataPorcentajeFotos = document.getElementById('dataFotos');
const dataVotosClass = document.getElementById('dataVotos');


// Realizar una solicitud GET a la API
fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        // Acceder a los datos de porcentaje
        const porcentajeData = data.porcentaje;
        let porcentajeHTML = '';
        let porcentajeHTMLFoto = '';
        let votoHTML = '';
        const votosData = data.votos;

        votosData.forEach(voto => {
            const votoNulos = voto.nulos;
            const votoBlancos = voto.blancos;


            const votoElementNulo = `
            <div class="parent_votos"> 
                <span>Votos Nulos: <b>${votoNulos}</b> </span>
                <span>Votos en Blanco: <b>${votoBlancos}</b>  </span>
            </div> `;

            votoHTML += votoElementNulo;
        });

        dataVotosClass.innerHTML = votoHTML;


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

            const porcentajeElement = `<div class="porcentaje-item ${claseCSS}" style="width: ${porcentajeFormateado}%">
            <span class="contador">${porcentajeFormateado}</span>%</div>`;


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
        // Iniciar la animación del contador
        startCounterAnimation();
        startBarAnimation();

    })
    .catch(error => {
        console.error('Error al obtener los datos:', error);
    });


// Función para iniciar la animación de la barra de colores
function startBarAnimation() {
    const barElements = document.querySelectorAll('.luisa-gonzalez');
    barElements.forEach(element => {
        const porcentaje = parseFloat(element.style.width);
        const animationDuration = 1000; // Duración de la animación en milisegundos
        const steps = 100; // Número de pasos de animación
        const stepWidth = porcentaje / steps;
        let currentWidth = 0;
        const updateBar = () => {
            if (currentWidth <= porcentaje) {
                element.style.width = currentWidth + stepWidth + '%';
                setTimeout(updateBar, animationDuration / steps);
                currentWidth += stepWidth;
            }
        };
        setTimeout(updateBar, 10); // Retrasa el inicio de la animación
    });
}

// Función para iniciar la animación del contador
function startCounterAnimation() {
    const contadorElements = document.querySelectorAll('.contador');
    contadorElements.forEach((element, index) => {
        const porcentaje = parseFloat(element.textContent);
        const animationDuration = 2000; // Duración de la animación en milisegundos
        const interval = 50; // Intervalo de actualización en milisegundos
        const steps = animationDuration / interval;
        const stepValue = porcentaje / steps;
        let currentValue = 0;
        const updateCounter = () => {
            if (currentValue <= porcentaje) {
                element.textContent = currentValue.toFixed(2);
                currentValue += stepValue;
                setTimeout(updateCounter, interval);
            }
        };
        setTimeout(updateCounter, index * 200); // Retrasar la animación de cada contador
    });
}