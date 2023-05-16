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
    // speechSynthesis.onvoiceschanged = () => {
    //   const voices = speechSynthesis.getVoices();
    //   console.log(voices);
    // };

    /*
      Microsoft Pablo - Spanish (Spain)
      Microsoft Helena - Spanish (Spain)
      Microsoft Laura - Spanish (Spain)
    */

    let message;
    let paused = false;

    function speakText(textArray) {
      message = new SpeechSynthesisUtterance();
      speechSynthesis.onvoiceschanged = () => {
        const voices = speechSynthesis.getVoices();
        message.voice = voices.find(voice => voice.name === 'Microsoft Pablo - Spanish (Spain)');
        if (message.voice) {
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
          console.log(message)
        } else {
          console.error('No se puede encontrar la voz');
        }
      };
      paused = false;
      playButton.disabled = true;
      pauseButton.disabled = false;
      stopButton.disabled = false;
      speechSynthesis.resume();
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