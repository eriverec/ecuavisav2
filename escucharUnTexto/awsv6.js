var getIdArticle = "5134589";
// var getIdArticle = "5168524";
// var getIdArticle = "5154428";
// var getIdArticle = ITER.CONTEXT.articleId;

// const audioElement = document.createElement('audio');

const audioElement = document.createElement('audio');
const playPauseButton = document.querySelector('#play-pause-btn');
const botonPlay = document.querySelector('.boton-play');
let isPlaying = false;
let isLoaded = false;

const playAudio = () => {
  audioElement.play();
  playPauseButton.innerHTML = ` 
  <div class="waveform">
    <div class="waveform__bar"></div>
    <div class="waveform__bar"></div>
    <div class="waveform__bar"></div>
    <div class="waveform__bar"></div>
  </div>
      `;
  isPlaying = true;
};

const pauseAudio = () => {
  audioElement.pause();
  playPauseButton.innerHTML = ` 
  
    <svg style="width: 20px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M4 12H7C8.10457 12 9 12.8954 9 14V19C9 20.1046 8.10457 21 7 21H4C2.89543 21 2 20.1046 2 19V12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V19C22 20.1046 21.1046 21 20 21H17C15.8954 21 15 20.1046 15 19V14C15 12.8954 15.8954 12 17 12H20C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z" fill="rgba(0,0,0,1)"></path></svg>
  
      `;
  isPlaying = false;
};

const handleVisibilityChange = () => {
  if (document.hidden && isPlaying) {
    pauseAudio();
  }
};

const handleClick = () => {
  if (isLoaded) { // Sólo carga la solicitud API una vez
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  } else {

    playPauseButton.innerHTML = `<svg class="ring" viewBox="25 25 50 50" stroke-width="5"><circle cx="50" cy="50" r="20" /></svg>`;

    // Hacer una solicitud a la ruta /audio en Express para obtener el audio en base64
    fetch(`https://aws-polly-ecuavisa.vercel.app/speechsynthesis_3?idArticle=${getIdArticle}`)
      .then(response => response.text())
      .then(audioBase64 => {
        // Decodificar el audio base64 en un blob
        const audioBlob = base64toBlob(audioBase64, 'audio/mp3');

        // Crear una URL del blob para reproducir el audio
        const audioUrl = URL.createObjectURL(audioBlob);

        // Reproducir el audio en una etiqueta <audio>
        audioElement.src = audioUrl;
        audioElement.controls = true;

        // botonPlay.appendChild(audioElement);
        playPauseButton.style.display = 'flex';
        isLoaded = true; // Cambia el estado a verdadero cuando se completa la solicitud satisfactoriamente

        playAudio();

      })
      .catch(err => {
        console.error('Error al obtener el audio:', err);
      });
  }
};

playPauseButton.addEventListener('click', handleClick);

playPauseButton.innerHTML = `

  <svg style="width: 20px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M4 12H7C8.10457 12 9 12.8954 9 14V19C9 20.1046 8.10457 21 7 21H4C2.89543 21 2 20.1046 2 19V12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V19C22 20.1046 21.1046 21 20 21H17C15.8954 21 15 20.1046 15 19V14C15 12.8954 15.8954 12 17 12H20C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z" fill="rgba(0,0,0,1)"></path></svg>

`;
botonPlay.appendChild(playPauseButton);

document.addEventListener('visibilitychange', handleVisibilityChange);

// Función para convertir una cadena base64 en un blob
function base64toBlob(base64, contentType) {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: contentType });
}