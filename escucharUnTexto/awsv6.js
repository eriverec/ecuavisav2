// var getIdArticle = "5134589";
// var getIdArticle = "5154428";
var getIdArticle = ITER.CONTEXT.articleId;

// const audioElement = document.createElement('audio');

const audioElement = document.createElement('audio');
const playPauseButton = document.querySelector('#play-pause-btn');
const botonPlay = document.querySelector('.boton-play');
let isPlaying = false;
let isLoaded = false;

const playAudio = () => {
  audioElement.play();
  playPauseButton.innerHTML = ` 
      <div style="display: flex; align-items: end; padding: 8px 104px 8px 8px; margin: -8px -104px -2px -8px;">
        <div class="event-play event-play-irGthP-css"></div>
        <div class="event-play event-play-ieYnvbI-css"></div>
        <div class="event-play event-play-igThDMz-css"></div>
        <div class="event-play event-play-igxkfZF-css"></div>
      </div>
      <span>Pausar</span>
      `;
  isPlaying = true;
};

const pauseAudio = () => {
  audioElement.pause();
  playPauseButton.innerHTML = ` 
        <div style="display: flex; align-items: end; padding: 8px 104px 8px 8px; margin: -8px -104px -2px -8px;">
          <div class="event-pause wpds-c-iyKTdE-ijwIBRZ-css"></div>
          <div class="event-pause wpds-c-iyKTdE-ijwIBRZ-css"></div>
          <div class="event-pause wpds-c-iyKTdE-ijwIBRZ-css"></div>
          <div class="event-pause wpds-c-iyKTdE-ijwIBRZ-css"></div>
        </div>
        <span>Reproducir</span>
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
    playPauseButton.innerHTML = ` <span>Cargando...</span>`;

    // Hacer una solicitud a la ruta /audio en Express para obtener el audio en base64
    fetch(`https://aws-polly.vercel.app/speechsynthesis?idArticle=${getIdArticle}`)
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
<div style="display: flex; align-items: end; padding: 8px 104px 8px 8px; margin: -8px -104px -8px -8px;">
  <svg style="width: 20px;" width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm8.856-3.845A1.25 1.25 0 0 0 9 9.248v5.504a1.25 1.25 0 0 0 1.856 1.093l5.757-3.189a.75.75 0 0 0 0-1.312l-5.757-3.189Z" fill="#212121"/></svg>
</div>
<span>Escuchar</span>
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
