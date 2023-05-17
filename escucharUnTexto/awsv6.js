
var getIdArticle = "5134589";
// var getIdArticle = "5154428";
// var getIdArticle = ITER.CONTEXT.articleId;

// const audioElement = document.createElement('audio');

// Hacer una solicitud a la ruta /audio en Express para obtener el audio en base64
fetch(`https://aws-polly.vercel.app/speechsynthesis?idArticle=${getIdArticle}`)
  .then(response => response.text())
  .then(audioBase64 => {
    // Decodificar el audio base64 en un blob
    const audioBlob = base64toBlob(audioBase64, 'audio/mp3');

    // Crear una URL del blob para reproducir el audio
    const audioUrl = URL.createObjectURL(audioBlob);

    // Reproducir el audio en una etiqueta <audio>
    const audioElement = document.createElement('audio');
    audioElement.src = audioUrl;
    audioElement.controls = true;
    // document.body.appendChild(audioElement);

    const selecArea = document.querySelector('.boton-play');

    // const botonElement = document.createElement('button');
    // botonElement.setAttribute('id', 'play-pause-btn');
    // botonElement.textContent = 'Play';

    const ele = `
      <button id="play-pause-btn">
        <div style="display: flex; align-items: end; padding: 8px 104px 8px 8px; margin: -8px -104px -8px -8px;">
          <div class="event-pause wpds-c-iyKTdE-ijwIBRZ-css"></div>
          <div class="event-pause wpds-c-iyKTdE-ijwIBRZ-css"></div>
          <div class="event-pause wpds-c-iyKTdE-ijwIBRZ-css"></div>
          <div class="event-pause wpds-c-iyKTdE-ijwIBRZ-css"></div>
        </div>
        <span>Play</span>
      </button>
    `

    selecArea.innerHTML = ele;

    const playPauseButton = document.querySelector('#play-pause-btn');
    let isPlaying = false;

    const playAudio = () => {
      audioElement.play();
      playPauseButton.innerHTML =
        playPauseButton.innerHTML = ` 
      <div style="display: flex; align-items: end; padding: 8px 104px 8px 8px; margin: -8px -104px -8px -8px;">
        <div class="event-play event-play-irGthP-css"></div>
        <div class="event-play event-play-ieYnvbI-css"></div>
        <div class="event-play event-play-igThDMz-css"></div>
        <div class="event-play event-play-igxkfZF-css"></div>
      </div>
      <span>Pause</span>
      `;
      isPlaying = true;
    };

    const pauseAudio = () => {
      audioElement.pause();
      playPauseButton.innerHTML = ` 
        <div style="display: flex; align-items: end; padding: 8px 104px 8px 8px; margin: -8px -104px -8px -8px;">
          <div class="event-pause wpds-c-iyKTdE-ijwIBRZ-css"></div>
          <div class="event-pause wpds-c-iyKTdE-ijwIBRZ-css"></div>
          <div class="event-pause wpds-c-iyKTdE-ijwIBRZ-css"></div>
          <div class="event-pause wpds-c-iyKTdE-ijwIBRZ-css"></div>
        </div>
        <span>Play</span>
      `;
      isPlaying = false;
    };

    const handleVisibilityChange = () => {
      if (document.hidden && isPlaying) {
        pauseAudio();
      }
    };

    playPauseButton.addEventListener('click', () => {
      if (isPlaying) {
        pauseAudio();
      } else {
        playAudio();
      }
    });

    document.addEventListener('visibilitychange', handleVisibilityChange);

  })
  .catch(err => {
    console.error('Error al obtener el audio:', err);
  });

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