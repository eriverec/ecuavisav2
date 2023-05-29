let reproduciendo = true; // esta variable controla si el audio se está reproduciendo o está pausado

const audioReproducir = document.getElementById("div_reproducir");
const audioPausarReanudar = document.getElementById("div_pausar_reanudar");

let isPlaying = false;
let isLoaded = false;

async function obtenerAudios() {

  if (isLoaded) { // Sólo carga la solicitud API una vez
    // if (isPlaying) {
    //   pauseAudio();
    // } else {
    //   playAudio();
    // }
  } else {

    audioReproducir.innerHTML = `<svg class="ring" viewBox="25 25 50 50" stroke-width="5"><circle cx="50" cy="50" r="20" /></svg>`;

    // var getIdArticle = "5233399";
    // var getIdArticle = "5168524";
    // var getIdArticle = "5154428";
    var getIdArticle = ITER.CONTEXT.articleId;
    // Realizar un primer fetch para obtener tamanioTotal
    const respTotal = await fetch(`https://text-to-audio-mu.vercel.app/audio/base64?idArticle=${getIdArticle}`);
    const dataTotal = await respTotal.json();
    const tamanioTotal = dataTotal.tamanioTotal;
    audioPausarReanudar.style.display = "block";
    audioReproducir.style.display = "none"
    // console.log(tamanioTotal);

    // Configurar audio tag para reproducir el primer audio
    let i = 0;
    const audioPlayer = document.getElementById("audioPlayer");
    const url = `https://text-to-audio-mu.vercel.app/audio/base64?idArticle=${getIdArticle}&part=${i}`;
    const respPart = await fetch(url);
    const dataPart = await respPart.json();
    audioPlayer.src = "data:audio/mp3;base64," + dataPart.base64;
    audioPlayer.play();

    // Actualizar audio tag cuando termina la reproducción del audio actual
    let timeoutId = null;
    audioPlayer.onended = async function () {
      i++;
      if (i <= tamanioTotal) {
        const nextUrl = `https://text-to-audio-mu.vercel.app/audio/base64?idArticle=${getIdArticle}&part=${i}`;
        const nextRespPart = await fetch(nextUrl);
        const nextDataPart = await nextRespPart.json();

        console.log(audioPlayer.duration);
        isLoaded = true;

        // Iniciar la carga de la siguiente parte 5 segundos antes de que finalice el audio actual
        timeoutId = setTimeout(() => {
          audioPlayer.src = "data:audio/mp3;base64," + nextDataPart.base64;
          audioPlayer.play();
        }, audioPlayer.duration - 5.014667);
      }
    }

    // Cancelar temporizador si el usuario decide avanzar manualmente al siguiente audio
    audioPlayer.onseeking = function () {
      clearTimeout(timeoutId);
    }
  }
}

audioReproducir.addEventListener('click', obtenerAudios);

const divWave = `
<div class="waveform">
  <div class="waveform__bar"></div>
  <div class="waveform__bar"></div>
  <div class="waveform__bar"></div>
  <div class="waveform__bar"></div>
</div>`;

const divReanudar = `
<svg style="width: 20px;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <path d="M4 12H7C8.10457 12 9 12.8954 9 14V19C9 20.1046 8.10457 21 7 21H4C2.89543 21 2 20.1046 2 19V12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12V19C22 20.1046 21.1046 21 20 21H17C15.8954 21 15 20.1046 15 19V14C15 12.8954 15.8954 12 17 12H20C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z" fill="rgba(0,0,0,1)"></path>
</svg>`;

function pausarReanudarAudio() {
  if (reproduciendo) {
    audioPlayer.pause(); // si se está reproduciendo, pausar
    reproduciendo = false;
  } else {
    audioPlayer.play(); // si se está pausado, reanudar
    reproduciendo = true;
  }
  audioPausarReanudar.innerHTML = reproduciendo ? divWave : divReanudar; // cambiar texto del botón según se esté reproduciendo o pausado
}