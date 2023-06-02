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
  },
  {
    "titulo": "Andrea López",
    "descripcion": "Productora de Monetización",
    "listid": "568654",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/QBNG/andrea-l_786061_20230116140739.jpg"
  },
  {
    "titulo": "Gabriela Narváez",
    "descripcion": "Productora",
    "listid": "568655",
    "img": "https://www.ecuavisa.com/binrepository/600x600/1c0/600d600/none/11705/KJKW/gaby-narvaez_771420_20230105191056.jpg"
  },
  {
    "titulo": "Liz Rivera",
    "descripcion": "Productora",
    "listid": "568656",
    "img": "ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/SRNO/liz-rivera_748899_20221230104123.jpg"
  },
  {
    "titulo": "Alfredo Viteri",
    "descripcion": "Community Manager",
    "listid": "568657",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/MLKJ/alfredo_780483_20230112113038.jpg"
  },
  {
    "titulo": "Carlos Rojas",
    "descripcion": "Director de Contenido",
    "listid": "568653",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/TLLW/carlos-rojas_693226_20230105190803.jpg"
  },
  {
    "titulo": "Brian Criollo",
    "descripcion": "Productor",
    "listid": "568658",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/WFJX/brian_775191_20230112113540.jpg"
  },
  {
    "titulo": "Andrea Salas",
    "descripcion": "Community Manager",
    "listid": "568659",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/NPLQ/andrea_748916_20230109120705.jpg"
  },
  {
    "titulo": "Jorge André Hernández",
    "descripcion": "Community Manager",
    "listid": "568660",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/NNTW/jorge-andre-hernandez_762907_20221230122849.jpg"
  },

  {
    "titulo": "Nelson Dávalos",
    "descripcion": "Productor",
    "listid": "568648",
    "img": "https://www.ecuavisa.com/binrepository/600x600/1c0/600d600/none/11705/KILS/nelson-davalos_771443_20230105191547.jpg"
  },

  {
    "titulo": "Verónica Yépez",
    "descripcion": "Community Manager",
    "listid": "568649",
    "img": "https://www.ecuavisa.com/binrepository/601x601/0c0/600d600/none/11705/LCMS/veronica-yepez_771519_20230117163246.jpg"
  },

  {
    "titulo": "Camila Villacrés",
    "descripcion": "Community Manager",
    "listid": "568650",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/EMKG/camila-villacres_701773_20221230103244.jpg"
  },
  {
    "titulo": "María Fernanda De la Bastida",
    "descripcion": "Coordinadora",
    "listid": "568651",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/MWEV/fernanda-de-la-bastida_699988_20221230103823.jpg"
  },
  {
    "titulo": "Iván Maestre",
    "descripcion": "Director de Contenido",
    "listid": "568652",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/KHLW/ivan-maestre_700192_20230112212756.jpg"
  },
  {
    "titulo": "Gisella Rojas",
    "descripcion": "Periodista Profundidad",
    "listid": "568643",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/RHLW/gisellarojas_693044_20221221152651.jpg"
  },
  {
    "titulo": "Kevin Verdezoto",
    "descripcion": "Periodista Deportivo",
    "listid": "568644",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/NKJX/kevin_694612_20230109120736.jpg"
  },
  {
    "titulo": "Marco Carrasco",
    "descripcion": "Periodista Deportivo",
    "listid": "568645",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/URMS/marco-carrasco_693081_20230112213328.jpg"
  },
  {
    "titulo": "María del Cisne Guamán",
    "descripcion": "Periodista Digital",
    "listid": "568646",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/IIJX/cisne_692877_20230109120252.jpg"
  },

  {
    "titulo": "Marlene Astudillo",
    "descripcion": "Periodista Entretenimiento",
    "listid": "568647",
    "img": "https://www.ecuavisa.com/binrepository/600x600/0c0/600d600/none/11705/ITKJ/marlene_693197_20230109120335.jpg"
  }

];


// Ordenar los elementos por título asc
jsonDataHtml.sort((a, b) => a.titulo.localeCompare(b.titulo));

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

