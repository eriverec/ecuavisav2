function eventoEnvivoManager() {
  // const apiUrl = "https://api-configuracion.vercel.app/web/horarioEnvivo";
  const apiUrl = "https://estadisticas.ecuavisa.com/sites/gestor/Tools/envivo/config.php?api=web&key=horarioEnvivo";
  const enVivoRedy = document.querySelector('.enVivoRedy');
  const textIndicador = document.querySelector('.enVivoRedy .liveIndicator .enVivoText');
  const btnTelcomunidad = document.querySelector('#btnTelcomunidad');
  const title_programa = document.querySelector('.title_programa');
  const playerembed = document.querySelector('#playerembed');
  const fondito__ = document.querySelector('#fondito__');

  var iframeIndividual = '';
  function newValueIframe(x) {
    iframeIndividual = x;
  }

  function fetchHorarioEnvivo() {
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
        fechaActual.setUTCHours(fechaActual.getUTCHours() - 5); // Ajustar a la zona horaria de UTC-5 (Ecuador).
        const diaSemana = fechaActual.getUTCDay();
        const horaActual = (fechaActual.getUTCHours());
        const minutosActuales = (fechaActual.getUTCMinutes());
        const forzado = data.forzado.estado;
        const htmlIframe = data.html.value;
        
        // console.log(`${horaActual}:${minutosActuales} gye`);

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
                    
                    var iframeIndividual2 = hora.iframe;
                    
                    if (iframeIndividual2) {
                      newValueIframe(iframeIndividual2);
                    }

                    // newValueIframe(iframeIndividual2);
                    console.log("yaaa-arriba", iframeIndividual);

                    if (horaActual > inicioHora || (horaActual === inicioHora && minutosActuales >= inicioMinutos)) {
                      if (horaActual < finHora || (horaActual === finHora && minutosActuales < finMinutos)) {
                        programasHoy.push(hora.tituloPrograma);
                      }
                    }
                  }

                }
                
                
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

                          iframeIndividual = iframeIndividual
                          // console.log("yaaa-abajo", iframeIndividual);
                          if (iframeIndividual != '') {
                            console.log("si hay iframe individual", iframeIndividual);

                            setTimeout(() => {
                              playerembed.innerHTML = iframeIndividual;
                            }, 1000);

                          } else {
                            console.log("no hay iframe individual");
                            playerembed.innerHTML = htmlIframe;
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
      })
      .catch(error => {
        console.error("Error al obtener los datos:", error);
      });

    setTimeout(fetchHorarioEnvivo, 5000); //comentado 23/octubre/2023 - 11:50AM
  }

  // Llamar a la función para obtener y procesar los datos inicialmente
  fetchHorarioEnvivo();
}


eventoEnvivoManager();