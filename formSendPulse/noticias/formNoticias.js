function armarFormulario (){
  const selecDiv = document.querySelector('.newsletter_rd_noticias');
  const htmlForm = `
  <div class="info-formulario">
    <div class="newsContenido">
      <div class="news_line_left">
        <img src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos%2FVector-vertical.svg" alt="line_left" width="33" height="400" title="separador vertical" />
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
        <h2>LO MEJOR DE ECUAVISA</h2>
        <p>Boletín diario y toda la programación con un solo click.</p>
        <!-- Subscription Form -->
        <div class="esendpulseNoticias"></div>
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
  embedsend.setAttribute('src', 'https://ecuavisadev.netlify.app/formSendPulse/noticias/formNoticias.html');
  embedsend.setAttribute('title', 'Formulario de suscripciones para noticias EcuavisaEC');
  embedsend.setAttribute('frameborder', '0');
  embedsend.setAttribute('scrolling', 'no');
  embedsend.setAttribute('width', '100%');
  embedsend.setAttribute('allowtransparency', 'true');
  var selecEmbed = document.querySelector('.esendpulseNoticias');
  selecEmbed.appendChild(embedsend);
  console.log("embed ejecutado");

}, 500);