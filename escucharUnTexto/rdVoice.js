let mensaje = null;
let pausado = false;

function leerContenido() {
  // Seleccionar el elemento div que contiene el texto a leer
  const divTexto = document.querySelector('.text');

  // Obtener el texto del elemento div
  const texto = divTexto.textContent.trim();

  // Crear un objeto SpeechSynthesisUtterance con el texto a leer
  mensaje = new SpeechSynthesisUtterance(texto);

  // Establecer la voz y el idioma del mensaje (opcional)
  mensaje.voice = window.speechSynthesis.getVoices()[0];
  mensaje.lang = 'es-EC';

  // Reproducir el mensaje de voz y activar bandera de pausa
  window.speechSynthesis.speak(mensaje);
  document.querySelector(".btn-play").style.display = "none";
  document.querySelector(".btn-pausa").style.display = "";
  pausado = false;
}

function detenerLectura() {
  // Detener la reproducción del mensaje de voz si existe
  if (mensaje) {
    window.speechSynthesis.cancel();
    document.querySelector(".btn-play").style.display = "";
    document.querySelector(".btn-pausa").style.display = "none";
  }
}

function pausarLectura() {
  // Pausar o reanudar la reproducción del mensaje de voz si existe, según el estado actual
  if (mensaje) {
    if (!pausado) {
      window.speechSynthesis.pause();
      // document.querySelector(".btn-play").style.display = "";
      // document.querySelector(".btn-pausa").style.display = "none";
      document.querySelector('.btn-pausa span').innerHTML = `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm8.856-3.845A1.25 1.25 0 0 0 9 9.248v5.504a1.25 1.25 0 0 0 1.856 1.093l5.757-3.189a.75.75 0 0 0 0-1.312l-5.757-3.189Z" fill="#FFFFFF"/></svg>`
      pausado = true;
    } else {
      window.speechSynthesis.resume();
      // document.querySelector(".btn-pausa").style.display = "";
      // document.querySelector(".btn-play").style.display = "none";
      document.querySelector('.btn-pausa span').innerHTML = `<svg width="24" height="24" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2Zm-1.5 6.25v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 1.5 0Zm4.5 0v7.5a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 1.5 0Z" fill="#FFFFFF"/></svg>`

      pausado = false;
    }
  }
}