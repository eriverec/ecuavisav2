// Función para leer una matriz de valores de texto usando SpeechSynthesisUtterance
// var te = localStorage.getItem('textValues');
// console.log(te);

let mensaje = null;
let pausado = false;

function leerContenido() {
  // Seleccionar el elemento div que contiene el texto a leer
  // const divTexto = document.querySelector('.text');

  // Obtener el texto del elemento div
  // const texto = divTexto.textContent.trim();

  // Crear un objeto SpeechSynthesisUtterance con el texto a leer
  mensaje = new SpeechSynthesisUtterance(te);

  // Establecer la voz y el idioma del mensaje (opcional)
  mensaje.voice = window.speechSynthesis.getVoices()[0];
  mensaje.lang = 'es-EC';

  // Reproducir el mensaje de voz y activar bandera de pausa
  window.speechSynthesis.speak(mensaje);
  // document.querySelector(".btn-play").style.display = "none";
  // document.querySelector(".btn-pausa").style.display = "";
  pausado = false;
}

// var getIdArticle = "5134589"
var getIdArticle = ITER.CONTEXT.articleId;
console.log(getIdArticle); // Devuelve "5134589"

fetch('https://estadisticas.ecuavisa.com/sites/services/global/mirrorGetVoice.php?idarticulo=' + getIdArticle)
  .then(response => response.json())
  .then(data => {
    const components = data.article.content.component;
    const textValues = [];
    // console.log(ddd)
    for (let component of components) {
      if (component.name === 'Text') {
        const __text = component.__text;
        textValues.push(__text);
      }
    }


    var ddd = JSON.stringify(textValues);
    // localStorage.setItem('textValues', JSON.stringify(textValues)); // aquí guardamos la matriz en el localStorage
    console.log("textAPI:", ddd); // aquí obtendría todos los valores de textos dentro del objeto JSON


    let message;
    let paused = false;

    function speakText(textArray) {
      message = new SpeechSynthesisUtterance();
      message.volume = 1;
      message.rate = 1;
      message.pitch = 1;
      message.text = textArray.join('.');
      message.onend = () => {
        paused = false;
        playButton.disabled = false;
        pauseButton.disabled = true;
        stopButton.disabled = true;
      };
      speechSynthesis.speak(message);
      paused = false;
      playButton.disabled = true;
      pauseButton.disabled = false;
      stopButton.disabled = false;
    }

    playButton.addEventListener('click', () => {
      const components = data.article.content.component;
      const textValues = [];
      for (let component of components) {
        if (component.name === 'Text') {
          textValues.push(component.__text);
        }
      }
      speakText(textValues);
    });

    pauseButton.addEventListener('click', () => {
      if (!paused) {
        paused = true;
        speechSynthesis.pause();
        pauseButton.textContent = "Reanudar lectura"
      } else {
        paused = false;
        speechSynthesis.resume();
        pauseButton.textContent = "Pausar lectura"
      }
    });

    stopButton.addEventListener('click', () => {
      speechSynthesis.cancel();
      playButton.disabled = false;
      pauseButton.disabled = true;
      stopButton.disabled = true;
    });
  })
  .catch(error => console.error(error));

