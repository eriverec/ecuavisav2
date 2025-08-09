const contenidoSocio = document.querySelector('.contenido-socio');

function iniciarContenidoSocio() {

    try {
        if (!contenidoSocio) {
            console.error('No se encontró el elemento');
            return false;
        }

        const contertHTML = `
     <section class="bsc-portada">
    <img class="bsc-portada" width="100%"  src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/portada.webp" alt="ecuavisa">

    <img class="bsc-beneficios" src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/beneficiossc.webp" alt="ecuavisa">
    
  </section>

  <div class="parent-bsc container">

    <section class="bsc-brochure">
      <img width="100%" class="img-brochure" src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/BROCHURE1.webp" alt="ecuavisa">
      <img width="100%" class="img-brochure-2" src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/BROCHURE2.webp" alt="ecuavisa">
  
    </section>
  
  
    <section class="bsc-tarj-socio">
      <img width="100%" class="img-brochure" src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/cen-amarillo.webp" alt="ecuavisa">
      <img width="100%" class="img-brochure" src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/cen-bronce.webp" alt="ecuavisa">
  
      <img width="100%" class="img-brochure" src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/cen-plata.webp" alt="ecuavisa">
      <img width="100%" class="img-brochure" src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/cen-oro.webp" alt="ecuavisa">
  
  
  
    </section>

    <section class="bsc-final">
      <img width="100%" class="img-per-mobile" src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/felipe-mobile.webp" alt="ecuavisa">

      <div class="bscf-izq">
        <img width="100%" class="img-top" src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/comomeopuedo.webp" alt="ecuavisa">
        <img width="100%" class="img-center" src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/visitabsc.webp" alt="ecuavisa">
        <a href="https://sociosbsc.com.ec/" target="_blank">
          <img width="100%" class="img-bottom" src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/codigoqr.webp" alt="ecuavisa">
        </a>

      </div>
  
      <img width="100%" class="img-per-desk" src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/personaje.webp" alt="ecuavisa">
  
  
  
    </section>

    <section class="bsc-footer">
      <img src="https://cdn-ecv-2025.pages.dev/landingbarcelona/assets/ecuavisa-barcelona.webp" width="200px" alt="ecuavisa">
    </section>
  </div>


  
        `;


        contenidoSocio.innerHTML = contertHTML;
    } catch (error) {
        console.log("Error", e);
        return "";
    }

}

function getPrincipal() {
    try {
        if (!contenidoSocio) {
            console.error('No se encontró el elemento');
            return false;
        }

        iniciarContenidoSocio();

    } catch (e) {
        console.log("Error", e);
        return "";
    }
}

setInterval(() => {
    getPrincipal();
}, 500);

