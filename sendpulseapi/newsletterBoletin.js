function templateHtml(section) {
  return /*html*/ `
  <div class="section-items " data-name="${section.titulo}">
    <div class="block_img">
      <img src="${section.img}" alt="${section.titulo}" />
    </div>
    <div class="bloc_chil">
      <h2>${section.titulo}</h2>
      <h3>${section.descripcion}</h3>
      <button id="list-btn" class="seguir" data-idname="${section.titulo}" data-listid="${section.listid}" onclick="btnSendEmails(this)">
        seguir <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="6.11146" y1="11.0001" x2="6.11146" y2="0.99987" stroke="#2927B9" stroke-width="1.99974" stroke-linecap="round"/><path d="M12 6H1" stroke="#2927B9" stroke-width="1.99974" stroke-linecap="round"/></svg>
      </button>
      <button id="list-btn" class="siguiendo" data-idname="${section.titulo}" data-listid="${section.listid}" onclick="btnDeleteEmails(this)" style="display:none">
        siguiendo <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5.65643L3.95397 8.28218L10.8466 1.71781" stroke="#2927B9" stroke-width="1.96931" stroke-linecap="round" stroke-linejoin="round"/></svg> 
      </button>
    </div>
  </div>
  `;
}


fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/mirrorAutores.php', {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
})
  .then(response => response.json())
  .then(data => {
    // Trabaja con los datos obtenidos de la API
    console.log(data);
    // Ordenar los elementos por título
    data.sort((a, b) => a.titulo.localeCompare(b.titulo));

    // console.log("data:", data);
    var recordItems = "";
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      // console.log(element);
      recordItems += templateHtml(element)
    }

    function buscarTemas(temas, name) {
      for (let i = 0; i < temas.length; i++) {
        // console.log(i);
        if (temas[i].name === name) {
          return temas[i]
        }
      }
      return null
    }

    function fetchPintarBotones() {
      // var idUser = "76521";
      const idUser = ECUAVISA_EC.USER_data().id;

      return fetch("https://ecuavisa-temas.vercel.app/" + idUser)
        .then(response => response.json())
        .then(result => {

          const selectDivParent = document.querySelector('.parent_block');
          selectDivParent.innerHTML = recordItems;

          const res = result;

          // console.log(resItems);
          const resItems = res.data.usuario.Temas;
          const seletItems = document.querySelectorAll('.section-items');

          seletItems.forEach((items) => {
            const selectDataAt = items.dataset.name;
            const searchTemas = buscarTemas(resItems, selectDataAt);
            if (searchTemas) {
              // console.log(searchTemas);
              if (searchTemas.follow) {
                items.querySelector('.seguir').style.display = "none";
                items.querySelector('.siguiendo').style.display = "block";
              } else {
                items.querySelector('.seguir').style.display = "block";
                items.querySelector('.siguiendo').style.display = "none";
              }
            }
            // buscarTemas(resItems, selectDataAt);
            // console.log(searchTemas);
          });
        })
        .catch(error => {
          // console.log('error', error);
          console.log('no exite el usuario');
        });
    }

    fetchPintarBotones();
  });


// const emailUser = ECUAVISA_EC.USER_data().id;

function btnSendEmails(element) {
  // Agregar la clase "loading" al botón
  element.classList.add('loading');
  fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php')
    .then(function (response) {
      return response.text();
    })
    .then(function (token) {

      // console.log(idListaSendpulse);
      const emailUser = ECUAVISA_EC.USER_data().email;
      // const emailUser = "caru8ip@test333.com";
      const idListaSendpulse = element.dataset.listid;
      const listEmails = idListaSendpulse;

      fetch(`https://api.sendpulse.com/addressbooks/${listEmails}/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          "emails": [{ "email": emailUser }]
        }),
        redirect: 'follow'
      })
        .then(response => response.text())
        .then(result => {
          // Remover la clase "loading" del botón
          element.classList.remove('loading');

          const idUser = ECUAVISA_EC.USER_data().id;
          // var idUser = "76572";
          // var article = document.querySelector("#list-btn");
          var seletItems = document.querySelectorAll('.section-items');

          var nameSection = element.dataset.idname;
          // console.log(nameSection);

          document.querySelector(`.section-items[data-name="${nameSection}"] .seguir`).style.display = "none";
          document.querySelector(`.section-items[data-name="${nameSection}"] .siguiendo`).style.display = "block";

          fetch("https://ecuavisa-temas.vercel.app", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "id": idUser,
              "nombre": "Newsletter",
              "tema": {
                "name": nameSection,
                "feedUrl": "#",
                "follow": true,
                "idMeta": listEmails
              }
            }),
            redirect: 'follow'
          })
            .then(response => response.json())
            .then(result => {
              console.log(result)
            })
            .catch(error => console.log('error', error));

          console.log(result);
        })
        .catch(error => console.log('error', error));

    })
    .catch(function (error) {
      console.log(error);
    });

}


function btnDeleteEmails(element) {
  // Agregar la clase "loading" al botón
  element.classList.add('loading');
  fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php')
    .then(function (response) {
      return response.text();
    })
    .then(function (token) {

      // const article = document.querySelector("#list-btn");
      const listEmails = element.dataset.listid;
      // const emailUser = "caru8ip@test333.com";
      const emailUser = ECUAVISA_EC.USER_data().email;

      //validacion si el user email existe

      /*GET VALIDACION DE EMAIL*/
      fetch(`https://api.sendpulse.com/addressbooks/565083/emails`, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer ' + token,
          'Content-Type': 'application/json'
        },
        redirect: 'follow'
      })
        .then(response => response.json())
        .then(resultget => {
          console.log('lista de corros sendpulse:', resultget)
          // const emailUser = "eriveraec@gmail.com";
          const foundEmail = resultget.find(email => email.email === emailUser);
          if (foundEmail) {
            console.log('existe en la lista.');
            fetch(`https://api.sendpulse.com/addressbooks/${listEmails}/emails`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              },
              body: JSON.stringify({
                "emails": [emailUser]
              }),
              redirect: 'follow'
            })
              .then(response => response.text())
              .then(result => {
                console.log(result)
                // Remover la clase "loading" del botón
                element.classList.remove('loading');

                const idUser = ECUAVISA_EC.USER_data().id;
                // var idUser = "76572";
                // var article = document.querySelector("#list-btn");
                var seletItems = document.querySelectorAll('.section-items');
                var nameSection = element.dataset.idname;
                console.log(nameSection);

                document.querySelector(`.section-items[data-name="${nameSection}"] .seguir`).style.display = "block";
                document.querySelector(`.section-items[data-name="${nameSection}"] .siguiendo`).style.display = "none";

                fetch("https://ecuavisa-temas.vercel.app", {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    "id": idUser,
                    "nombre": "Newsletter",
                    "tema": {
                      "name": nameSection,
                      "feedUrl": "#",
                      "follow": true,
                      "idMeta": listEmails
                    }
                  }),
                  redirect: 'follow'
                })
                  .then(response => response.json())
                  .then(result => {
                    console.log(result)
                  })
                  .catch(error => console.log('error', error));

              })
              .catch(error => console.log('error', error));
          } else {
            console.log('emails no existe en la lista de sendpulse.');
          }
          // console.log(valemail);
        })
        .catch(error => console.log('error', error));

      /*GET VALIDACION DE EMAIL*/

    })
    .catch(function (error) {
      console.log(error);
    });
}

