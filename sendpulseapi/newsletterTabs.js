function templateHtml(section) {
  return /*html*/ `
  <div class="section-items d-flex" data-name="${section.titulo}">
    <div class="">
      <img src="${section.img}" alt="" />
    </div>
    <div class="d-flex flex-column">
      <span>${section.titulo}</span>
      <span>${section.descripcion}</span>

      <button id="list-btn" class="seguir" data-idname="${section.titulo}" data-listid="${section.listid}" onclick="btnSendEmails(this)">
        seguir
      </button>
      <button id="list-btn" class="siguiendo" data-idname="${section.titulo}" data-listid="${section.listid}" onclick="btnDeleteEmails(this)" style="display:none">
        siguiendo
      </button>
    </div>
  </div>
  `;
}

const jsonDataHtml = [
  {
    "titulo": "Noticias",
    "descripcion": "Ecuavisa.com",
    "listid": "565081",
    "img": "https://placehold.co/80x80@2x.png"
  },
  {
    "titulo": "Estadio",
    "descripcion": "Ecuavisa.com",
    "listid": "565083",
    "img": "https://placehold.co/80x80@2x.png"
  },
  {
    "titulo": "Mundo",
    "descripcion": "Ecuavisa.com",
    "listid": "568629",
    "img": "https://placehold.co/80x80@2x.png"
  },
  {
    "titulo": "Entretenimiento",
    "descripcion": "Ecuavisa.com",
    "listid": "568630",
    "img": "https://placehold.co/80x80@2x.png"
  },
  {
    "titulo": "Estilo",
    "descripcion": "Ecuavisa.com",
    "listid": "568631",
    "img": "https://placehold.co/80x80@2x.png"
  },
  {
    "titulo": "Abdón Rodríguez",
    "descripcion": "Periodista Nacional",
    "listid": "568633",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/RSJX/abdon_692508_20230112131150.jpg"
  },
  {
    "titulo": "Claudia Roura",
    "descripcion": "Periodista Digital",
    "listid": "568634",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/POIX/claudia-roura_693183_20221230102842.jpg"
  },
  {
    "titulo": "Daniela Maggi",
    "descripcion": "Periodista Nacional",
    "listid": "568635",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/MQIX/daniela-maggi_702985_20221230105507.jpg"
  },
  {
    "titulo": "Diego Bravo",
    "descripcion": "Periodista Nacional",
    "listid": "568636",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/CBVU/diego-bravo_700751_20221230122757.jpg"
  },
  {
    "titulo": "Fernando Guevara",
    "descripcion": "Periodista Deportivo",
    "listid": "568637",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/0d0/none/11705/ITJQ/fernando_696583_20230323151009.jpg"
  }

]


// console.log("data:", data);
var recordItems = "";
for (let index = 0; index < jsonDataHtml.length; index++) {
  const element = jsonDataHtml[index];
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
  var idUser = ECUAVISA_EC.USER_data().id;

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
      console.log('no exite el user');

    });
}

fetchPintarBotones();

// const emailUser = ECUAVISA_EC.USER_data().id;

function btnSendEmails(element) {
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
                "follow": true
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
                      "follow": true
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

