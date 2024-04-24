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

  function fetchHorarioEnvivo() {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {

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

    setTimeout(fetchHorarioEnvivo, 120000); //comentado 23/octubre/2023 - 11:50AM
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




// let scrollExecuted = false;
let mousemoveExecuted = false;

function bootstrapJS() {
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
    bootstrapJS();
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

