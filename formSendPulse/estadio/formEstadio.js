function armarFormulario (){
  const selecDiv = document.querySelector('.newsletter_rd_noticias');
  const htmlForm = `
  <div class="info-formulario">
    <div class="newsContenido">
      <div class="news_line_left">
      <svg width="22px" width="24" height="418" viewBox="0 0 24 418" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.15918 415.555L2.15923 136.198C2.15923 135.849 2.34125 135.525 2.63947 135.343L21.1612 124.075C21.7941 123.69 21.8032 122.774 21.1781 122.377L2.62254 110.574C2.33398 110.391 2.15923 110.073 2.15923 109.731L2.15923 1.53141" stroke="#00C17C" stroke-width="3" stroke-linecap="round"/>
      </svg>
      
    </div>
    <div class="news_line_left mobile__">
        <img src="https://estadisticas.ecuavisa.com/sites/gestor/Newsletter%2FlineLeftNewsBlanco.svg" alt="line_left" width="22" height="473" title="separador blanco" />
    </div>

      <div class="news-texto-rd">
        <h2 class="newsletterh1">
          <div class="news-letter-1">
              news
          </div>
          <div class="news-letter-2">
              letter
          </div>
      </h2>
        <h2>LO MEJOR DE ESTADIO</h2>
        <p>Boletín diario y toda la programación con un solo click.</p>
        <!-- Subscription Form -->
        <div class="esendpulseEstadio"></div>
        <!-- /Subscription Form -->
      </div>
    </div>
  </div>
  `;
  selecDiv.innerHTML = htmlForm;
}
armarFormulario();

setTimeout(() => {
  const embedsend = document.createElement('iframe');
  embedsend.setAttribute('src', 'https://ecuavisadev.netlify.app/formSendPulse/estadio/formEstadio.html');
  embedsend.setAttribute('title', 'Formulario de suscripciones para estadio EcuavisaEC');
  embedsend.setAttribute('frameborder', '0');
  embedsend.setAttribute('scrolling', 'no');
  embedsend.setAttribute('width', '100%');
  embedsend.setAttribute('allowtransparency', 'true');
  var selecEmbed = document.querySelector('.esendpulseEstadio');
  selecEmbed.appendChild(embedsend);
  console.log("embed ejecutado");

}, 500);