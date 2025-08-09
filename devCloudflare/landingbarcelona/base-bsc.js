const contenidoSocio = document.querySelector('.contenido-socio');
const contenidoSocioMobile = document.querySelector('.contenido-socio-mobile');


function iniciarContenidoSocio() {

    try {
        if (!contenidoSocio) {
            console.error('No se encontró el elemento desktop');
            return false;
        }

        const contertHTML = `
     <section class="bsc-portada">
    <img class="bsc-portada" width="100%" fetchpriority="high" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/portada.webp" alt="ecuavisa">

    <img class="bsc-beneficios" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/beneficiossc.webp" alt="ecuavisa">
    
  </section>

  <div class="parent-bsc container">

    <section class="bsc-brochure">
      <img width="100%" class="img-brochure" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/BROCHURE1.webp" alt="ecuavisa">
      <img width="100%" class="img-brochure-2" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/BROCHURE2.webp" alt="ecuavisa">
  
    </section>
  
  
    <section class="bsc-tarj-socio">
      <img width="100%" loading="lazy" class="img-brochure" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/cen-amarillo.webp" alt="ecuavisa">
      <img width="100%" loading="lazy" class="img-brochure" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/cen-bronce.webp" alt="ecuavisa">
  
      <img width="100%" loading="lazy" class="img-brochure" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/cen-plata.webp" alt="ecuavisa">
      <img width="100%" loading="lazy" class="img-brochure" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/cen-oro.webp" alt="ecuavisa">
  
  
  
    </section>

    <section class="bsc-final">
    
      <div class="bscf-izq">
        <img width="100%" class="img-top" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/comomeopuedo.webp" alt="ecuavisa">
        <img width="100%" class="img-center" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/visitabsc.webp" alt="ecuavisa">
        <a href="https://sociosbsc.com.ec/" target="_blank">
          <img width="100%" class="img-bottom" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/codigoqr.webp" alt="ecuavisa">
        </a>

      </div>
  
      <img width="100%" class="img-per-desk" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/personaje.webp" alt="ecuavisa">
  
  
  
    </section>

    <section class="bsc-footer">
      <img src="https://ecuavisav2.pages.dev/landingbarcelona/assets/ecuavisa-barcelona.webp" width="200px" alt="ecuavisa">
    </section>
  </div>


  
        `;


        contenidoSocio.innerHTML = contertHTML;
    } catch (error) {
        console.log("Error", e);
        return "";
    }

}

function iniciarContenidoSocioMobile() {

  try {
      if (!contenidoSocioMobile) {
          console.error('No se encontró el elemento mobile');
          return false;
      }

      const contertHTML = `
   <section class="bsc-portada">
  <img class="bsc-portada" width="100%" fetchpriority="high" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/mobile/portadamobile.webp" alt="ecuavisa">

  <img class="bsc-beneficios" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/mobile/bene-mobile.webp" alt="ecuavisa">
  
</section>

<div class="parent-bsc container">

  <section class="bsc-brochure">
    <img width="100%" class="img-brochure" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/mobile/bro-global.webp" alt="ecuavisa">
  </section>

  <section class="bsc-tarj-socio">
    <img width="100%" loading="lazy" class="img-brochure" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/cen-amarillo.webp" alt="ecuavisa">
    <img width="100%" loading="lazy" class="img-brochure" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/cen-bronce.webp" alt="ecuavisa">
    <img width="100%" loading="lazy" class="img-brochure" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/cen-plata.webp" alt="ecuavisa">
    <img width="100%" loading="lazy" class="img-brochure" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/cen-oro.webp" alt="ecuavisa">
  </section>

  <section class="bsc-final">
    <img width="100%" loading="lazy" class="img-per-mobile" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/mobile/felipe21.webp" alt="ecuavisa">

    <div class="bscf-izq">
      <img width="100%" class="img-top" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/mobile/como-me-puedo.webp" alt="ecuavisa">
      <img width="100%" class="img-center" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/mobile/visita-nuestra-web.webp" alt="ecuavisa">
      <a href="https://sociosbsc.com.ec/" target="_blank">
        <img width="100%" class="img-bottom" src="https://ecuavisav2.pages.dev/landingbarcelona/assets/mobile/codigoQRm.webp" alt="ecuavisa">
      </a>
    </div>

  </section>

  <section class="bsc-footer">
    <img src="https://ecuavisav2.pages.dev/landingbarcelona/assets/ecuavisa-barcelona.webp" width="200px" alt="ecuavisa">
  </section>
</div>
      `;


      contenidoSocioMobile.innerHTML = contertHTML;
  } catch (error) {
      console.log("Error", e);
      return "";
  }

}

function getPrincipal() {
    try {
        if (contenidoSocio) {
            iniciarContenidoSocio();
        }

        if (contenidoSocioMobile) {
            iniciarContenidoSocioMobile();
        }

    } catch (e) {
        console.log("Error", e);
        return "";
    }
}

getPrincipal();
