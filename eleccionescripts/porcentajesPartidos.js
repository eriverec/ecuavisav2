// URL de la API
const apiUrl = 'https://script.googleusercontent.com/macros/echo?user_content_key=w92iEBKC8vQwmMSRBggfuX6IRXfWB9rqYkL6QSL4EYMVx97aNDVDT4NXKNlkXXUxFjP1cyojhJ3nehxLAHvBkHUCSuCpCVZam5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnNj6mStLV91FQ3L_-tYZFguE8mxVUlGxd4f7-KIqBZWZQ7yZc7utjIJY31GS_HzzPc0IwYdTPPDCQ74Sjkwr5njVLW7j7cYDrdz9Jw9Md8uu&lib=MgH1N6f4vGPDTfW1kGEEmVr4ZcExjOBYo';

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
            const votoEscrutado = voto.escrutado;



            const votoElementNulo = `
            <div class="parent_votos"> 
                <span>Escrutado: <b>${votoEscrutado}</b>%</span>
                <span>Votos Nulos: <b>${votoNulos}</b>%</span>
                <span>Votos en Blanco: <b>${votoBlancos}</b>%  </span>
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

            /*DESCOMENTAR A LAS 5PM*/
            const porcentajeElement = `<div class="porcentaje-item ${claseCSS}" style="width: ${porcentajeFormateado}%"><span class="contador">${porcentajeFormateado}%</span></div>`;

            /*NO COMENTARLO ANTES DE LAS 5PM*/
            // const porcentajeElement = `<div class="porcentaje-item ${claseCSS}" style="width: 50%">// <span class="contador">0</span>%</div>`;


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
        // startCounterAnimation();
        // startBarAnimation();

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
        const animationDuration = 1000; // Duración de la animación en milisegundos
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




function eventoCharPie() {

    // Llamada a la API
    fetch('https://script.googleusercontent.com/macros/echo?user_content_key=w92iEBKC8vQwmMSRBggfuX6IRXfWB9rqYkL6QSL4EYMVx97aNDVDT4NXKNlkXXUxFjP1cyojhJ3nehxLAHvBkHUCSuCpCVZam5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnNj6mStLV91FQ3L_-tYZFguE8mxVUlGxd4f7-KIqBZWZQ7yZc7utjIJY31GS_HzzPc0IwYdTPPDCQ74Sjkwr5njVLW7j7cYDrdz9Jw9Md8uu&lib=MgH1N6f4vGPDTfW1kGEEmVr4ZcExjOBYo')
        .then(response => response.json())
        .then(data => {
            // Obtener los datos del objeto "porcentaje"
            const porcentajeData = data.porcentaje;

            // Crear un array para los datos del gráfico
            const chartData = porcentajeData.map(item => ({
                name: item.name,
                y: parseFloat(item.value.toFixed(2)),
                hoverName: item.partido // Nombre para el hover
            }));

            // Definir una paleta de colores personalizada
            const customColors = {
                'Luisa González': '#1e96d4', // Color para Luisa
                'Daniel Noboa': '#672893' // Color para Novoa
            };
            // Asignar colores según el nombre del partido
            chartData.forEach(item => {
                item.color = customColors[item.name];
            });

            // Configurar el gráfico con Highcharts
            Highcharts.chart('chart-container-pie', {
                chart: {
                    type: 'pie'
                },
                title: {
                    text: 'Resultados Electorales (Pie)'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.y:.2f}%'
                        }
                    }
                },
                tooltip: {
                    pointFormat: '{point.hoverName}: <b>{point.y:.2f}%</b>'
                },
                exporting: {
                    enabled: false // Esto oculta el botón de menú de exportación
                },
                credits: {
                    enabled: false // Esto oculta el crédito de Highcharts
                },
                series: [{
                    name: 'Porcentaje de Votos',
                    data: chartData
                }]
            });
        });
}

function eventoCharColumn() {

    // Llamada a la API
    fetch('https://script.googleusercontent.com/macros/echo?user_content_key=w92iEBKC8vQwmMSRBggfuX6IRXfWB9rqYkL6QSL4EYMVx97aNDVDT4NXKNlkXXUxFjP1cyojhJ3nehxLAHvBkHUCSuCpCVZam5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnNj6mStLV91FQ3L_-tYZFguE8mxVUlGxd4f7-KIqBZWZQ7yZc7utjIJY31GS_HzzPc0IwYdTPPDCQ74Sjkwr5njVLW7j7cYDrdz9Jw9Md8uu&lib=MgH1N6f4vGPDTfW1kGEEmVr4ZcExjOBYo')
        .then(response => response.json())
        .then(data => {
            // Obtener los datos del objeto "porcentaje"
            const porcentajeData = data.porcentaje;

            // Crear un array para los datos del gráfico
            const chartData = porcentajeData.map(item => ({
                name: item.name,
                y: parseFloat(item.value.toFixed(2)),
                hoverName: item.partido // Nombre para el hover
            }));

            // Definir una paleta de colores personalizada
            const customColors = {
                'Luisa González': '#1e96d4', // Color para Luisa
                'Daniel Noboa': '#672893' // Color para Novoa
            };
            // Asignar colores según el nombre del partido
            chartData.forEach(item => {
                item.color = customColors[item.name];
            });

            // Configurar el gráfico con Highcharts
            Highcharts.chart('chart-container-column', {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Resultados Electorales (Barras)'
                },
                xAxis: {
                    type: 'category',
                    title: {
                        // text: 'Partidos'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Porcentaje de Votos (%)'
                    }
                },
                plotOptions: {
                    column: {
                        colorByPoint: true,
                        dataLabels: {
                            enabled: true,
                            format: '{point.y:.2f}%'
                        }
                    }
                },
                tooltip: {
                    pointFormat: '{point.hoverName}: <b>{point.y:.2f}%</b>'
                },
                exporting: {
                    enabled: false // Esto oculta el botón de menú de exportación
                },
                credits: {
                    enabled: false // Esto oculta el crédito de Highcharts
                },
                series: [{
                    name: 'Porcentaje de Votos',
                    data: chartData
                }]
            });
        });
}

eventoCharColumn();
eventoCharPie();