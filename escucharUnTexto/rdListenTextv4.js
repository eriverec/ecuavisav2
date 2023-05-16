// var getIdArticle = "5134589";
var playButton = document.getElementById('playButton_2');
var pauseButton = document.getElementById('pauseButton_2');
var stopButton = document.getElementById('stopButton_2');

var pauseBtn = false;

function stripHtmlTags(text) {
  return text.replace(/<[^>]+>/g, '');
}
var getIdArticle = ITER.CONTEXT.articleId;
async function getJsonArticle() {
  try {
    var resp = await fetch(`https://estadisticas.ecuavisa.com/sites/services/global/mirrorGetVoice.php?idarticulo=${getIdArticle}`); 
    var obtener = await resp.json();
    const components = obtener.article.content.component;
    var textValues = "";
    for (let component of components) {
      if (component.name === 'Text') {
        textValues += component.__text;
      }
    }
    var plainText = stripHtmlTags(textValues);
    playButton.addEventListener('click', () => {
      if(responsiveVoice.voiceSupport()) {
        playButton.classList.add("disabled");
        playButton.setAttribute("disabled", true);

        responsiveVoice.speak(plainText, 'Spanish Male', {
          onend: function() {
            pauseBtn = false;
            pauseButton.innerHTML = "Pausar";
            playButton.classList.remove("disabled");
            playButton.removeAttribute("disabled");

            // pauseButton.classList.add("disabled");
            pauseButton.setAttribute("disabled", true);
            stopButton.setAttribute("disabled", true);

          }
        });

        // pauseButton.classList.remove("disabled");
        pauseButton.removeAttribute("disabled");
        stopButton.removeAttribute("disabled");

      }else{
        console.log("El traductor no es compatible")
      }
    });

    pauseButton.addEventListener('click', () => {
      if(!pauseBtn){
        pauseBtn = true;
        pauseButton.innerHTML = "Reanudar";
        responsiveVoice.pause();
      }else{
        pauseBtn = false;
        pauseButton.innerHTML = "Pausar";
        responsiveVoice.resume();
      }
    });

    stopButton.addEventListener('click', () => {
      speechSynthesis.cancel();
      playButton.disabled = false;
      pauseButton.disabled = true;
      stopButton.disabled = true;
    });

    return true;
  } catch (error) {
    console.log('Error:', error);
  }
}


getJsonArticle();