/*codigo-manager*/
function eventRadioManager() {
  const apiUrl = "https://api-configuracion.vercel.app/web/horarioRadio";
  const fechaActual = new Date();
  const diaSemana = fechaActual.getDay();
  const horaActual = fechaActual.getHours();
  const minutosActuales = fechaActual.getMinutes();
  const diasSemanaTexto = ["Domingo","Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado" ];
  console.log(`Hoy es ${diasSemanaTexto[diaSemana]}`);

  async function fetchHorario() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const forzado = data.forzado.estado;
      const htmlIframe = data.html.value;

      if (!forzado) {
        console.log("forzado:", forzado);
        for (const dia of data.horarios) {
          // console.log('dia.dia:',dia.dia);
          if (dia.estadoDia && dia.dia === diaSemana) { //validamos si el dia esta activo
            console.log(`Día ${dia.dia} (${diasSemanaTexto[dia.dia]}):`);

            let programasHoy = [];

            for (const hora of dia.horas) {
              if (hora.estadoHorario) { //validamos si la hora esta activa
                const inicioHora = parseInt(hora.inicio.split(":")[0]);
                const inicioMinutos = parseInt(hora.inicio.split(":")[1]);

                const finHora = parseInt(hora.fin.split(":")[0]);
                const finMinutos = parseInt(hora.fin.split(":")[1]);

                if (horaActual > inicioHora || (horaActual === inicioHora && minutosActuales >= inicioMinutos)) {
                  if (horaActual < finHora || (horaActual === finHora && minutosActuales < finMinutos)) {
                    programasHoy.push(hora.tituloPrograma);
                  }
                }
              }
            }

            const txtEscuchando = document.querySelector('.title_estas_escuchando');
            const txtPrograma = document.querySelector('.title_programa_text');
            const txtBase = document.querySelector('#no_transmision__');
            const audio = document.querySelector('.contenedor_embed_radio');


            if (programasHoy.length > 0) {
              console.log("Programas activo:");
              const BO_par = document.querySelector('#parent_radio');
              if (BO_par) { BO_par.style.display = 'block'; }

              programasHoy.forEach(programa => {
                console.log(`  ${programa}`);

                if (txtEscuchando || txtPrograma) {
                  txtEscuchando.innerHTML = `Estás escuchando`;
                  txtPrograma.innerHTML = programa;
                }

                if (txtBase) {
                  txtBase.innerHTML = '';
                  txtBase.style.display = "none";
                }

                if (audio) {
                  audio.style.display = 'block';
                  audio.innerHTML = htmlIframe;
                  // Obtener el elemento <div> con el atributo data-id
                  var divdataid = document.querySelector('[data-id="643823bbf3b3410854ba942b"]');

                  if(divdataid){
                    // Obtener el elemento <script> dentro del <div>
                    var scriptElement = divdataid.querySelector('script');
                    var scriptSrc = scriptElement.getAttribute('src');
                    var resultElement = document.createElement('script');
                    resultElement.setAttribute('src',scriptSrc);
                    document.body.appendChild(resultElement);
                  } 

                }
              });
            } else {

              console.log("No hay programas activos en este momento.");
              if (txtEscuchando || txtPrograma) {
                txtEscuchando.innerHTML = '';
                txtPrograma.innerHTML = '';
              }

              if (txtBase) {
                txtBase.style.display = "block";
                txtBase.innerHTML = `Aquí encontrarás una opción para acceder a toda la programación informativa Audio En vivo: Contacto Directo (6:55), Televistazo en la Comunidad (5:55-7:30), Televistazo (13:00-19:00).`;
              }

              if (audio) {
                audio.style.display = 'none';
                audio.innerHTML = '';
              }
            }
          }
        }
      } else {
        const dataTitulo = data.forzado.titulo;
        const datalabel = data.forzado.label;
        const txtEscuchando = document.querySelector('.title_estas_escuchando');
        const txtPrograma = document.querySelector('.title_programa_text');
        const txtBase = document.querySelector('#no_transmision__');
        const audio = document.querySelector('.contenedor_embed_radio');

        const BO_par = document.querySelector('#parent_radio');
        const BO_parTxt = document.querySelector('#parent_radio .enVivoText');

        if (txtEscuchando || txtPrograma) {
          txtEscuchando.innerHTML = `Estás escuchando`;
          txtPrograma.innerHTML = dataTitulo;
        }

        if (txtBase) {
          txtBase.innerHTML = '';
          txtBase.style.display = "none";
        }

        // if (audio) { audio.style.display = 'block'; }

        if (audio) {
          audio.style.display = 'block';
          audio.innerHTML = htmlIframe;
          // Obtener el elemento <div> con el atributo data-id
          var divdataid = document.querySelector('[data-id="643823bbf3b3410854ba942b"]');

          if(divdataid){
            // Obtener el elemento <script> dentro del <div>
            var scriptElement = divdataid.querySelector('script');
            var scriptSrc = scriptElement.getAttribute('src');
            var resultElement = document.createElement('script');
            resultElement.setAttribute('src',scriptSrc);
            document.body.appendChild(resultElement);
          } 

        }

        if (BO_par) { BO_par.style.display = 'block' }
        if (BO_parTxt) { BO_parTxt.textContent = datalabel }

        console.log("forzado:", forzado);
      }
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    }
  }

  // Llamar a la función para obtener y procesar los datos
  fetchHorario();

}


if (ECUAVISA_EC.login()) {
  eventRadioManager();
}else{
  const txtBase = document.querySelector('#no_transmision__');
  if (txtBase) {
    txtBase.style.display = "block";
    txtBase.innerHTML = `Aquí encontrarás una opción para acceder a toda la programación informativa Audio En vivo: Contacto Directo (6:55), Televistazo en la Comunidad (5:55-7:30), Televistazo (13:00-19:00).`;
  }
}

// eventRadioManager();

