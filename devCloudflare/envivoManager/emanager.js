/*codigo-manager*/
function eventRadioManager() {
  // const apiUrl = "https://api-configuracion.vercel.app/web/horarioRadio";
  const apiUrl = "https://estadisticas.ecuavisa.com/sites/gestor/Tools/envivo/config.php?api=web&key=horarioRadio";
  // const fechaActual = new Date();
  // const diaSemana = fechaActual.getDay();
  // const horaActual = fechaActual.getHours();
  // const minutosActuales = fechaActual.getMinutes();
  const diasSemanaTexto = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  const fechaActual = new Date();
  fechaActual.setUTCHours(fechaActual.getUTCHours() - 5); // Ajustar a la zona horaria de UTC-5 (Ecuador).
  const diaSemana = fechaActual.getUTCDay();
  const horaActual = (fechaActual.getUTCHours());
  const minutosActuales = (fechaActual.getUTCMinutes());

  // console.log(`${horaActual}:${minutosActuales} audio`);

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

                  if (divdataid) {
                    // Obtener el elemento <script> dentro del <div>
                    var scriptElement = divdataid.querySelector('script');
                    var scriptSrc = scriptElement.getAttribute('src');
                    var resultElement = document.createElement('script');
                    resultElement.setAttribute('src', scriptSrc);
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

          if (divdataid) {
            // Obtener el elemento <script> dentro del <div>
            var scriptElement = divdataid.querySelector('script');
            var scriptSrc = scriptElement.getAttribute('src');
            var resultElement = document.createElement('script');
            resultElement.setAttribute('src', scriptSrc);
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

function eventoEnvivoManager() {
  // const apiUrl = "https://api-configuracion.vercel.app/web/horarioEnvivo";
  const apiUrl = "https://estadisticas.ecuavisa.com/sites/gestor/Tools/envivo/config.php?api=web&key=horarioEnvivo";
  const enVivoRedy = document.querySelector('.enVivoRedy');
  const textIndicador = document.querySelector('.enVivoRedy .liveIndicator .enVivoText');
  const btnTelcomunidad = document.querySelector('#btnTelcomunidad');
  const btnTelevistazo7pm = document.querySelector('#btnTelevistazo7pm');
  const title_programa = document.querySelector('.title_programa');
  const playerembed = document.querySelector('#playerembed');
  const fondito__ = document.querySelector('#fondito__');

  var iframeIndividual = '';
  function newValueIframe(x) {
    iframeIndividual = x;
  }

  //nueva funcion envivo 2024
  function paramUserVideo() {
    const iframe = document.getElementById("vrudo");
    const src = iframe.src;
    const separator = src.indexOf("?") > -1 ? "&" : "?";
    const valUser = ECUAVISA_EC.USER_data('id');
    // Concatenar el valor del usuario y convertir todo a base64
    var base64Params = btoa("user=" + valUser);
    iframe.src = src + separator + base64Params;
  }

  async function fetchHorarioEnvivoRespaldo() {
    try{
      // const response = await fetch(apiUrl, {
      //   method: 'GET',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   timeout: 8000 // 8 segundos (en milisegundos)
      // });

      // if (!response.ok) {
      //     console.error(`Error: Código de estado ${response.status}`);
      //     return null;
      // }
      // const data = await response.json();
      return {"html":{"value":"<iframe id=\"vrudo\" class=\"vrudo\" src=\"//rudo.video/live/ecuavisa\" width=\"600\" height=\"338\" allowfullscreen=\"true\" frameborder=\"0\" scrolling=\"no\" allow=\"autoplay; fullscreen\"></iframe>"},"forzado":{"estado":false,"titulo":"En Vivo","label":"En Vivo"},"horarios":[{"dia":0,"estadoDia":true,"horas":[{"tituloPrograma":"Hacia un nuevo estilo de vida","estadoHorario":true,"inicio":"08:30","fin":"09:30"},{"tituloPrograma":"Políticamente Correcto","estadoHorario":true,"inicio":"10:30","fin":"11:30"},{"tituloPrograma":"Tortugas Ninja 1","estadoHorario":true,"inicio":"15:00","fin":"17:00"},{"tituloPrograma":" Armageddon","estadoHorario":false,"inicio":"17:00","fin":"19:00"},{"tituloPrograma":"Televistazo 19h00","estadoHorario":true,"inicio":"19:00","fin":"20:00"},{"tituloPrograma":"Políticamente Correcto","estadoHorario":false,"inicio":"20:00","fin":"20:50"},{"tituloPrograma":"Tarzan","estadoHorario":true,"inicio":"20:00","fin":"22:00"},{"tituloPrograma":"La Garciamanía","estadoHorario":true,"inicio":"22:00","fin":"23:59"}]},{"dia":1,"estadoDia":true,"horas":[{"tituloPrograma":"En vivo","estadoHorario":true,"inicio":"00:00","fin":"01:00"},{"tituloPrograma":"Televistazo en la comunidad","estadoHorario":true,"inicio":"05:55","fin":"06:55"},{"tituloPrograma":"Contacto Directo","estadoHorario":true,"inicio":"06:55","fin":"07:30"},{"tituloPrograma":"Televistazo en la comunidad","estadoHorario":true,"inicio":"07:30","fin":"09:00"},{"tituloPrograma":"Carita de Ángel","estadoHorario":true,"inicio":"09:00","fin":"10:30"},{"tituloPrograma":"En Contacto","estadoHorario":true,"inicio":"10:30","fin":"13:00"},{"tituloPrograma":"Televistazo 13h00","estadoHorario":true,"inicio":"13:00","fin":"14:00"},{"tituloPrograma":"Los Hackers del Espectáculo","estadoHorario":true,"inicio":"14:00","fin":"15:30"},{"tituloPrograma":"Como dice el dicho","estadoHorario":true,"inicio":"15:30","fin":"16:30","iframe":""},{"tituloPrograma":"Historias de la Virgen Morena","estadoHorario":true,"inicio":"16:30","fin":"17:30","iframe":""},{"tituloPrograma":"Soy tu dueña","estadoHorario":true,"inicio":"17:30","fin":"18:15","iframe":""},{"tituloPrograma":"Teresa","estadoHorario":true,"inicio":"18:15","fin":"19:00"},{"tituloPrograma":"Televistazo 19h00","estadoHorario":true,"inicio":"19:00","fin":"20:30"},{"tituloPrograma":"Golden Boy ","estadoHorario":true,"inicio":"20:30","fin":"21:00"},{"tituloPrograma":"Los García","estadoHorario":true,"inicio":"21:00","fin":"23:00"},{"tituloPrograma":"Pasión de Gavilanes","estadoHorario":true,"inicio":"23:00","fin":"23:59"}]},{"dia":2,"estadoDia":true,"horas":[{"tituloPrograma":"En vivo","estadoHorario":true,"inicio":"00:00","fin":"01:00"},{"tituloPrograma":"Televistazo en la comunidad","estadoHorario":true,"inicio":"05:55","fin":"06:55"},{"tituloPrograma":"Contacto Directo","estadoHorario":true,"inicio":"06:55","fin":"07:30","iframe":""},{"tituloPrograma":"Televistazo en la comunidad","estadoHorario":true,"inicio":"07:30","fin":"09:00","iframe":""},{"tituloPrograma":"Carita de Ángel","estadoHorario":true,"inicio":"09:00","fin":"10:30"},{"tituloPrograma":"En Contacto","estadoHorario":true,"inicio":"10:30","fin":"13:00","iframe":""},{"tituloPrograma":"Televistazo 13h00","estadoHorario":true,"inicio":"13:00","fin":"14:00","iframe":""},{"tituloPrograma":"Los Hackers del Espectáculo","estadoHorario":true,"inicio":"14:00","fin":"15:30"},{"tituloPrograma":"Como dice el dicho","estadoHorario":true,"inicio":"15:30","fin":"16:30","iframe":""},{"tituloPrograma":"Historias de la Virgen Morena","estadoHorario":true,"inicio":"16:30","fin":"17:30"},{"tituloPrograma":"Soy tu dueña","estadoHorario":true,"inicio":"17:30","fin":"18:15","iframe":""},{"tituloPrograma":"Teresa","estadoHorario":true,"inicio":"18:15","fin":"19:00"},{"tituloPrograma":"Televistazo 19h00","estadoHorario":true,"inicio":"19:00","fin":"20:30"},{"tituloPrograma":"Golden Boy","estadoHorario":true,"inicio":"20:30","fin":"21:00"},{"tituloPrograma":"Los García","estadoHorario":true,"inicio":"21:00","fin":"23:00"},{"tituloPrograma":"Pasión de Gavilanes","estadoHorario":true,"inicio":"23:00","fin":"23:59"}]},{"dia":3,"estadoDia":true,"horas":[{"tituloPrograma":"En vivo","estadoHorario":true,"inicio":"00:00","fin":"01:00"},{"tituloPrograma":"Televistazo en la comunidad","estadoHorario":true,"inicio":"05:55","fin":"06:55"},{"tituloPrograma":"Contacto Directo","estadoHorario":true,"inicio":"06:55","fin":"07:30"},{"tituloPrograma":"Televistazo en la comunidad","estadoHorario":true,"inicio":"07:30","fin":"09:00"},{"tituloPrograma":"Carita de Ángel","estadoHorario":true,"inicio":"09:00","fin":"10:30"},{"tituloPrograma":"En Contacto","estadoHorario":true,"inicio":"10:30","fin":"13:00","iframe":""},{"tituloPrograma":"Televistazo 13h00","estadoHorario":true,"inicio":"13:00","fin":"14:00"},{"tituloPrograma":"Los Hackers del Espectáculo","estadoHorario":true,"inicio":"14:00","fin":"15:30"},{"tituloPrograma":"Como dice el Dicho","estadoHorario":true,"inicio":"15:30","fin":"16:30","iframe":""},{"tituloPrograma":"Historias de la Virgen Morena","estadoHorario":true,"inicio":"16:30","fin":"17:30"},{"tituloPrograma":"Soy tu Dueña","estadoHorario":true,"inicio":"17:30","fin":"18:15","iframe":""},{"tituloPrograma":"Teresa","estadoHorario":true,"inicio":"18:15","fin":"19:00"},{"tituloPrograma":"Televistazo 19h00","estadoHorario":true,"inicio":"19:00","fin":"20:30"},{"tituloPrograma":"Golden Boy ","estadoHorario":true,"inicio":"20:30","fin":"21:00"},{"tituloPrograma":"Los García","estadoHorario":true,"inicio":"21:00","fin":"23:00"},{"tituloPrograma":"Pasión de Gavilanes","estadoHorario":true,"inicio":"23:00","fin":"23:59"}]},{"dia":4,"estadoDia":true,"horas":[{"tituloPrograma":"En vivo","estadoHorario":true,"inicio":"00:00","fin":"01:00"},{"tituloPrograma":"Televistazo en la comunidad","estadoHorario":true,"inicio":"05:55","fin":"06:55"},{"tituloPrograma":"Contacto Directo","estadoHorario":true,"inicio":"06:55","fin":"07:30"},{"tituloPrograma":"Televistazo en la comunidad","estadoHorario":true,"inicio":"07:30","fin":"09:00"},{"tituloPrograma":"Carita de Ángel","estadoHorario":true,"inicio":"09:00","fin":"10:30"},{"tituloPrograma":"En Contacto","estadoHorario":true,"inicio":"10:30","fin":"13:00"},{"tituloPrograma":"Televistazo 13h00","estadoHorario":true,"inicio":"13:00","fin":"14:00"},{"tituloPrograma":"Los Hackers del Espectáculo","estadoHorario":true,"inicio":"14:00","fin":"15:30"},{"tituloPrograma":"Como dice el Dicho","estadoHorario":true,"inicio":"15:30","fin":"16:30","iframe":""},{"tituloPrograma":"Historias de la Virgen Morena","estadoHorario":true,"inicio":"16:30","fin":"17:30"},{"tituloPrograma":"Soy tu Dueña","estadoHorario":true,"inicio":"17:30","fin":"18:15","iframe":""},{"tituloPrograma":"Teresa","estadoHorario":true,"inicio":"18:15","fin":"19:00"},{"tituloPrograma":"Televistazo 19h00","estadoHorario":true,"inicio":"19:00","fin":"20:30"},{"tituloPrograma":"Golden Boy","estadoHorario":true,"inicio":"20:30","fin":"21:00"},{"tituloPrograma":"Los García","estadoHorario":true,"inicio":"21:00","fin":"23:00"},{"tituloPrograma":"Pasión de Gavilanes","estadoHorario":true,"inicio":"23:00","fin":"23:59"}]},{"dia":5,"estadoDia":true,"horas":[{"tituloPrograma":"En vivo","estadoHorario":true,"inicio":"00:00","fin":"01:00"},{"tituloPrograma":"Televistazo en la comunidad","estadoHorario":true,"inicio":"05:55","fin":"06:55"},{"tituloPrograma":"Contacto Directo","estadoHorario":true,"inicio":"06:55","fin":"07:30"},{"tituloPrograma":"Televistazo en la comunidad","estadoHorario":true,"inicio":"07:30","fin":"09:00"},{"tituloPrograma":"Carita de Ángel","estadoHorario":true,"inicio":"09:00","fin":"10:30"},{"tituloPrograma":"En contacto","estadoHorario":true,"inicio":"10:30","fin":"13:00"},{"tituloPrograma":"Televistazo 13h00","estadoHorario":true,"inicio":"13:00","fin":"14:00"},{"tituloPrograma":"Los Hackers del Espectáculo","estadoHorario":true,"inicio":"14:00","fin":"15:30"},{"tituloPrograma":"Como dice el Dicho","estadoHorario":true,"inicio":"15:30","fin":"16:30","iframe":""},{"tituloPrograma":"Historias de la Virgen Morena","estadoHorario":true,"inicio":"16:30","fin":"17:30"},{"tituloPrograma":"Soy tu Dueña","estadoHorario":true,"inicio":"17:30","fin":"18:15","iframe":""},{"tituloPrograma":"Teresa","estadoHorario":true,"inicio":"18:15","fin":"19:00"},{"tituloPrograma":"Televistazo 19h00","estadoHorario":true,"inicio":"19:00","fin":"20:30"},{"tituloPrograma":"GOLDEN BOY","estadoHorario":true,"inicio":"20:30","fin":"21:00"},{"tituloPrograma":"LOS GARCÍA","estadoHorario":true,"inicio":"21:00","fin":"23:00"},{"tituloPrograma":"Pasión de Gavilanes","estadoHorario":true,"inicio":"23:00","fin":"23:59"}]},{"dia":6,"estadoDia":true,"horas":[{"tituloPrograma":"Especial Papa Francisco","estadoHorario":true,"inicio":"09:30","fin":"10:00"},{"tituloPrograma":"Misa de Acción de Gracias","estadoHorario":true,"inicio":"10:00","fin":"12:00"},{"tituloPrograma":"Little Rascals 2","estadoHorario":true,"inicio":"17:00","fin":"19:00"},{"tituloPrograma":"Televistazo 19h00","estadoHorario":true,"inicio":"19:00","fin":"19:30"},{"tituloPrograma":"Bad Boys For Life","estadoHorario":true,"inicio":"19:30","fin":"21:30"},{"tituloPrograma":"Detonator","estadoHorario":true,"inicio":"21:30","fin":"23:30"},{"tituloPrograma":"Lo invisible","estadoHorario":true,"inicio":"23:30","fin":"23:59"}]}]};
    }catch(error){
      console.log(error);
      return null;
    }
  }

  async function fetchHorarioEnvivo() {
    try{
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 8000 // 8 segundos (en milisegundos)
      });

      if (!response.ok) {
          console.error(`Error: Código de estado ${response.status}`);
          const responseRespaldoData = await fetchHorarioEnvivoRespaldo();
          procesosHorarioEnvivo(responseRespaldoData);

          setTimeout(fetchHorarioEnvivo, 120000); //comentado 23/octubre/2023 - 11:50AM
          return null;
      }

      const data = await response.json();
      procesosHorarioEnvivo(data);

      setTimeout(fetchHorarioEnvivo, 120000); //comentado 23/octubre/2023 - 11:50AM
      return true;
    }catch(error){
      const responseRespaldoData = await fetchHorarioEnvivoRespaldo();
      console.log(responseRespaldoData)
      procesosHorarioEnvivo(responseRespaldoData);

      console.log(error);
      setTimeout(fetchHorarioEnvivo, 120000); //comentado 23/octubre/2023 - 11:50AM
      return null;
    }
  }

  function procesosHorarioEnvivo(data){
    try{
      console.log("Entró", data)
      const fechaActual = new Date();
        fechaActual.setUTCHours(fechaActual.getUTCHours() - 5); // Ajustar a la zona horaria de UTC-5 (Ecuador).
        const diaSemana = fechaActual.getUTCDay();
        const horaActual = (fechaActual.getUTCHours());
        const minutosActuales = (fechaActual.getUTCMinutes());
        const forzado = data.forzado.estado;
        const htmlIframe = data.html.value;

        if (!forzado) {
          for (const dia of data.horarios) {
            if (dia.estadoDia) {
              if (dia.dia === diaSemana) {
                let programasHoy = [];
                for (const hora of dia.horas) {
                  if (hora.estadoHorario) {
                    const inicioHora = parseInt(hora.inicio.split(":")[0]);
                    const inicioMinutos = parseInt(hora.inicio.split(":")[1]);
                    const finHora = parseInt(hora.fin.split(":")[0]);
                    const finMinutos = parseInt(hora.fin.split(":")[1]);


                    if (horaActual > inicioHora || (horaActual === inicioHora && minutosActuales >= inicioMinutos)) {
                      if (horaActual < finHora || (horaActual === finHora && minutosActuales < finMinutos)) {
                        programasHoy.push(hora.tituloPrograma);
                        var iframeIndividual2 = hora.iframe;
                        if (iframeIndividual2) {
                          newValueIframe(iframeIndividual2);
                        }
                        // console.log("yaaa-arriba", iframeIndividual);
                      }
                    }
                  }
                }
                console.log("programasHoy", programasHoy)
                if (programasHoy.length > 0) {
                  programasHoy.forEach(programa => {
                    if (title_programa) {
                      title_programa.innerHTML = programa;
                      title_programa.style.display = 'block';
                    }
                    if (fondito__) {
                      fondito__.style.display = "none";
                    }
                    if (playerembed) {
                      playerembed.style.display = 'block';
                      if (!document.querySelector('#playerembed iframe')) {
                        if (playerembed) {
                          // playerembed.innerHTML = htmlIframe;

                          // iframeIndividual = iframeIndividual
                          // console.log("yaaa-abajo", iframeIndividual);
                          if (iframeIndividual != '') {
                            console.log("si hay iframe individual", iframeIndividual);
                            setTimeout(() => {
                              playerembed.innerHTML = iframeIndividual;
                              paramUserVideo();
                            }, 1000);

                          } else {
                            console.log("no hay iframe individual");
                            playerembed.innerHTML = htmlIframe;
                            paramUserVideo();
                            console.log(htmlIframe);
                          }
                        }
                      }
                    }
                    if (enVivoRedy) {
                      enVivoRedy.style.display = 'flex';
                    }
                    if (programa === "Televistazo en la comunidad") {
                      if (btnTelcomunidad) {
                        btnTelcomunidad.style.display = "block";
                      }
                    }

                    //Televistazo 7PM - nuevo requerimiento.
                    if (programa === "Televistazo 7PM") {
                      if (btnTelevistazo7pm) {
                        btnTelevistazo7pm.style.display = "block";
                      }
                    }
                  });
                } else {
                  if (title_programa) {
                    title_programa.innerHTML = '';
                    title_programa.style.display = 'none';
                  }
                  if (fondito__) {
                    fondito__.style.display = "block";
                  }
                  if (playerembed) {
                    playerembed.style.display = 'none';
                    if (document.querySelector('#playerembed iframe')) {
                      document.querySelector('#playerembed iframe').remove();
                    }
                  }
                  if (enVivoRedy) {
                    enVivoRedy.style.display = 'none';
                  }
                  if (btnTelcomunidad) {
                    btnTelcomunidad.style.display = "none";
                  }

                  if (btnTelevistazo7pm) {
                    btnTelevistazo7pm.style.display = "none";
                  }
                }
              } else { }
            } else {
              if (fondito__) { fondito__.style.display = "block"; }
              if (title_programa) {
                title_programa.innerHTML = '';
                title_programa.style.display = 'none';
              }
              if (playerembed) {
                playerembed.style.display = 'none';
                if (document.querySelector('#playerembed iframe')) {
                  document.querySelector('#playerembed iframe').remove();
                }

              }
              if (enVivoRedy) { enVivoRedy.style.display = 'none'; }
            }
          }
        } else {
          const dataTitulo = data.forzado.titulo;
          const datalabel = data.forzado.label;

          if (title_programa) {
            title_programa.innerHTML = dataTitulo;
          }

          if (!document.querySelector('#playerembed iframe')) {
            if (playerembed) {
              playerembed.innerHTML = htmlIframe;
            }
          }

          if (playerembed && fondito__) {
            textIndicador.innerHTML = datalabel;
            playerembed.style.display = 'block';
            fondito__.style.display = "none";
          }
          if (enVivoRedy) { enVivoRedy.style.display = 'flex'; }

          console.log("Forzado:", forzado);
        }
    }catch(error){
      console.log(error)
      return null;
    }
  }

  // Llamar a la función para obtener y procesar los datos inicialmente
  fetchHorarioEnvivo();
}

function eventoEnvivoManagerQuito() {
  // const apiUrl = "https://api-configuracion.vercel.app/web/horarioEnvivoQuito";
  const apiUrl = "https://estadisticas.ecuavisa.com/sites/gestor/Tools/envivo/config.php?api=web&key=horarioEnvivoQuito";
  const btnTelcomunidad_quito = document.querySelector('#btnTelcomunidad_quito');
  const title_programa_quito = document.querySelector('.title_programa_quito');
  const playerembed_quito = document.querySelector('#playerembed_quito');
  const fondito__quito = document.querySelector('#fondito__quito');

  function fetchHorarioEnvivoQuito() {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // const fechaActual = new Date();
        // const diaSemana = fechaActual.getDay();
        // const horaActual = fechaActual.getHours();
        // const minutosActuales = fechaActual.getMinutes();
        // const forzado = data.forzado.estado;
        // const htmlIframe = data.html.value;

        const fechaActual = new Date();
        fechaActual.setUTCHours(fechaActual.getUTCHours() - 5);
        const diaSemana = fechaActual.getUTCDay();
        const horaActual = (fechaActual.getUTCHours());
        const minutosActuales = (fechaActual.getUTCMinutes());
        const forzado = data.forzado.estado;
        const htmlIframe = data.html.value;

        // console.log(`${horaActual}:${minutosActuales} uio`);

        // console.log(data.horarios); // imprimir los horarios en la consola

        if (!forzado) {
          for (const dia of data.horarios) {
            if (dia.estadoDia === true) {
              // console.log("dia.estadoDia",dia.estadoDia);
              if (dia.dia === diaSemana) {
                // console.log(dia.dia);
                let programasHoy = [];
                for (const hora of dia.horas) {
                  if (hora.estadoHorario) {
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
                if (programasHoy.length > 0) {
                  programasHoy.forEach(programa => {
                    if (title_programa_quito) {
                      title_programa_quito.innerHTML = programa;
                      title_programa_quito.style.display = 'block';
                    }
                    if (fondito__quito) {
                      fondito__quito.style.display = "none";
                    }
                    if (playerembed_quito) {
                      playerembed_quito.style.display = 'block';
                      if (!document.querySelector('#playerembed_quito iframe')) {
                        if (playerembed_quito) {
                          playerembed_quito.innerHTML = htmlIframe;
                        }
                      }
                    }
                    if (programa === "Televistazo en la comunidad") {
                      if (btnTelcomunidad_quito) {
                        btnTelcomunidad_quito.style.display = "block";
                      }
                    }
                  });
                } else {
                  if (title_programa_quito) {
                    title_programa_quito.innerHTML = '';
                    title_programa_quito.style.display = 'none';
                  }
                  if (fondito__quito) {
                    fondito__quito.style.display = "block";
                  }
                  if (playerembed_quito) {
                    playerembed_quito.style.display = 'none';
                    if (document.querySelector('#playerembed_quito iframe')) {
                      document.querySelector('#playerembed_quito iframe').remove();
                    }
                  }
                  if (btnTelcomunidad_quito) {
                    btnTelcomunidad_quito.style.display = "none";
                  }

                }
              }
            }

            if (dia.estadoDia === false) {
              if (dia.dia === diaSemana) {
                if (title_programa_quito) {
                  title_programa_quito.innerHTML = '';
                  title_programa_quito.style.display = 'none';
                }
                if (fondito__quito) {
                  fondito__quito.style.display = "block";
                }
                if (playerembed_quito) {
                  playerembed_quito.style.display = 'none';
                  if (document.querySelector('#playerembed_quito iframe')) {
                    document.querySelector('#playerembed_quito iframe').remove();
                  }
                }
                if (btnTelcomunidad_quito) {
                  btnTelcomunidad_quito.style.display = "none";
                }
              }
            }

          }
        } else {
          const dataTitulo = data.forzado.titulo;

          if (title_programa_quito) {
            title_programa_quito.innerHTML = dataTitulo;
          }
          if (!document.querySelector('#playerembed_quito iframe')) {
            if (playerembed_quito) {
              playerembed_quito.innerHTML = htmlIframe;
            }
          }
          if (fondito__quito) {
            fondito__quito.style.display = "none";
          }

          if (playerembed_quito) {
            playerembed_quito.style.display = 'block';
          }

          if (btnTelcomunidad_quito) {
            btnTelcomunidad_quito.style.display = "block";
          }

          console.log("Forzado:", forzado);
        }
      })
      .catch(error => {
        console.error("Error al obtener los datos:", error);
      });

    setTimeout(fetchHorarioEnvivoQuito, 120000); //cada 2 minutos se actualiza
  }

  // Llamar a la función para obtener y procesar los datos inicialmente
  fetchHorarioEnvivoQuito();
}

setTimeout(() => {
  eventoEnvivoManagerQuito();
}, 300);

eventoEnvivoManager();

if (ECUAVISA_EC.login()) {
  eventRadioManager();
} else {
  const txtBase = document.querySelector('#no_transmision__');
  if (txtBase) {
    txtBase.style.display = "block";
    txtBase.innerHTML = `Aquí encontrarás una opción para acceder a toda la programación informativa Audio En vivo: Contacto Directo (6:55), Televistazo en la Comunidad (5:55-7:30), Televistazo (13:00-19:00).`;
  }
}

// eventRadioManager();



/* +++++++++++++++++++++
 +++++ INIOIO//HORARIO NUEVO PARA EL REPRESISE DE TELEVISTAZO 7PM - ENVIVO++++ 
+++++++++++++++++++++ */
function verificarHorarioEnvivo() {
  var horarios = [
      { iniHor: "22:00", finHor: "23:59" },
      { iniHor: "00:00", finHor: "01:00" }
  ];

  var btnTelevistazo = document.getElementById('btnTelevistazo7pm');
  var ahora = new Date();
  var horaActual = ahora.toLocaleTimeString('es-EC', { hour12: false, hour: '2-digit', minute: '2-digit' });

  var dentroDelRango = false;

  horarios.forEach(function(rango) {
      var iniHor = rango.iniHor;
      var finHor = rango.finHor;

      if (iniHor <= finHor) {
          // Rango normal (no cruza la medianoche)
          if (horaActual >= iniHor && horaActual <= finHor) {
              dentroDelRango = true;
          }
      } else {
          // Rango que cruza la medianoche
          if (horaActual >= iniHor || horaActual <= finHor) {
              dentroDelRango = true;
          }
      }
  });

  if (dentroDelRango) {
    btnTelevistazo ? btnTelevistazo.style.display = 'block' : '' ;
  } else {
    btnTelevistazo ? btnTelevistazo.style.display = 'none': '';
  }
}

// Verificar el horario al cargar la página
setTimeout(() => {
  verificarHorarioEnvivo();
}, 500);


/* +++++++++++++++++++++
 +++++ FIN //HORARIO NUEVO PARA EL REPRESISE DE TELEVISTAZO 7PM - ENVIVO++++ 
+++++++++++++++++++++ */



/* +++++++++++++++++++++
 +++++ INICIO//HORARIO NUEVO PARA EL REPRESISE DE TELEVISTAZO 7PM - REPRISE LANDING++++ 
+++++++++++++++++++++ */



function verificarHorario() {
  var horarios = [
      { iniHor: "21:00", finHor: "23:59" },
      { iniHor: "00:00", finHor: "01:00" }, // Rango59 que cruza la medianoche
      // Agrega más rangos horarios si es necesario
  ];
  // Obtener la hora actual en Ecuador
  const horaEcuador = new Date().toLocaleString("en-US", {timeZone: "America/Guayaquil"});
  const hora = new Date(horaEcuador);
  console.log("horario actual", hora);
  
  // Obtener hora y minutos actuales
  const horaActual = hora.getHours();
  const minutosActual = hora.getMinutes();
  
  // Convertir la hora actual a minutos
  const tiempoActualEnMinutos = horaActual * 60 + minutosActual;
  
  // Obtener los elementos del DOM
  const contenido_visible_player = document.querySelector('.contenido_visible_player');
  const fondito = document.querySelector('#fondito__reprise');
  
  // Verificar si estamos dentro de alguno de los rangos horarios
  let dentroDeRango = false;
  
  for (let i = 0; i < horarios.length; i++) {
      const { iniHor, finHor } = horarios[i];
      
      // Convertir las variables de horario a horas y minutos
      const [horaInicio, minutoInicio] = iniHor.split(":").map(Number);
      const [horaFin, minutoFin] = finHor.split(":").map(Number);
      
      // Convertir todo a minutos para comparar
      const inicioEnMinutos = horaInicio * 60 + minutoInicio;
      const finEnMinutos = horaFin * 60 + minutoFin;
      
      // Verificar si el rango cruza la medianoche
      if (inicioEnMinutos > finEnMinutos) {
          // Rango que cruza la medianoche
          if (tiempoActualEnMinutos >= inicioEnMinutos || tiempoActualEnMinutos <= finEnMinutos) {
              dentroDeRango = true;
              break;
          }
      } else {
          // Rango normal
          if (tiempoActualEnMinutos >= inicioEnMinutos && tiempoActualEnMinutos <= finEnMinutos) {
              dentroDeRango = true;
              break;
          }
      }
  }
  
    if (dentroDeRango) {
        // Dentro de alguno de los rangos horarios
        contenido_visible_player ? contenido_visible_player.style.display = 'block' : '';
        fondito ? fondito.style.display = 'none' : ''; 
    } else {
        // Fuera de todos los rangos horarios
        contenido_visible_player ? contenido_visible_player.style.display = 'none' : '' ;
        fondito ? fondito.style.display = 'block' : '' ;
    }
}

if (window.location.pathname === '/envivo/televistazo7pm') {
  // Ejecutar la función inmediatamente
  setTimeout(() => {
    verificarHorario();
  }, 1000);

}

/* +++++++++++++++++++++
 +++++FIN//HORARIO NUEVO PARA EL REPRESISE DE TELEVISTAZO 7PM - REPRISE LANDING++++ 
+++++++++++++++++++++ */



/* +++++++++++++++++++++
 +++++EVENTO MODAL++++ 
+++++++++++++++++++++ */




// Crear un elemento div para contener el modal
function pintarModalDOM() {
  const modalTelefono = ECUAVISA_EC.USER_data("phone_number")
  const modalTempForm = `
    <div class="modal fade modalDinamGlobal" id="modalContent" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Formulario</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="telefono_form" class="form-label">Telefono</label>
            <input type="number" value="${modalTelefono != null ? modalTelefono : ''}" class="form-control" id="telefono_form" placeholder="0978665419">
          </div>
        
          <div class="mb-3">
            <label for="genero_form" class="form-label">Genero</label>
            <select class="form-select" aria-label="Default select example">
              <option selected>...</option>
              <option value="1">Masculino</option>
              <option value="2">Femenino</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="fnacimiento_form" class="form-label">Fecha de nacimiento</label>
            <input type="date" class="form-control" id="fnacimiento_form" placeholder="DD/MM/YYYY">
          </div>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button> -->
          <button type="button" id="sendform" class="btn btn-primary">Enviar</button>
        </div>
      </div>
    </div>
    </div>
  `;
  const modalContainer = document.createElement('div');
  modalContainer.innerHTML = modalTempForm;
  document.body.appendChild(modalContainer);

}


/*
CODIGO FONDITO BANNER COPA AMERICA - INICIO - 21-06-2024
*/


/*
 CODIGO FONDITO BANNER COPA AMERICA - FIN - 21-06-2024
 */

// let scrollExecuted = false;
let mousemoveExecuted = false;

function bootstrapJS() {
  if (ECUAVISA_EC) {
    //No queremos que bootstrap js se agregue en mi perfil, por que ya se está agregando en esa página, con esto se bloquea el script solo en mi perfil
    const bloquearUrl_2 = ECUAVISA_EC.verificarURLActual({ url: "https://www.ecuavisa.com/servicios/perfil" });//Verifica si la url actual corresponde a la mandada como parámetro
    const bloquearUrl = ECUAVISA_EC.verificarURLActual({ url: "https://www.ecuavisa.com/servicios/perfil/" });//Verifica si la url actual corresponde a la mandada como parámetro

    if (bloquearUrl || bloquearUrl_2) {
      return true;
    }
    //No queremos que bootstrap js se agregue en mi perfil, por que ya se está agregando en esa página, con esto se bloquea el script solo en mi perfil
  }

  const scriptBoostrap = document.createElement("script");
  scriptBoostrap.setAttribute('src', `https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js`);
  document.body.appendChild(scriptBoostrap);
}

function eventModal() {
  const modalContent = new bootstrap.Modal(document.getElementById('modalContent'));
  modalContent.show();
}

function onEvent() {
  if (!mousemoveExecuted) {
    pintarModalDOM();
    // bootstrapJS();
    // console.log("Se movio el mouse");
    mousemoveExecuted = true;
  }

}
bootstrapJS();
//el usuario debe de estar logueado
if (ECUAVISA_EC.login()) {
  // window.addEventListener('scroll', onEvent);
  window.addEventListener('mousemove', onEvent);
}




setTimeout(() => {
  // eventModal();
}, 300);

// document.getElementById('mostrarModal').addEventListener('click', function () {
//   eventModal();
// });

