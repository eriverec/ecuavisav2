

function btnDarseBaja() {
  fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php')
    .then(function (response) {
      return response.text();
    })
    .then(function (token) {
      const emailUser = ECUAVISA_EC.USER_data().email;
      document.querySelector('.seca_darse').style.opacity = "0.5";

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
            fetch(`https://api.sendpulse.com/addressbooks/565083/emails`, {
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
                console.log(result);
                document.querySelector('.seca_mensaje_exito').classList.remove('d-none');
                document.querySelector('.seca_darse').classList.add('d-none');
              })
              .catch(error => console.log('error', error));
          } else {
            console.log('emails no existe en la lista de sendpulse.');
            document.querySelector('.seca_darse').classList.add('d-none');
            document.querySelector('.seca_mensaje_exito').classList.remove('d-none');
            document.querySelector('.seca_mensaje_exito').textContent = 'Ya te has dado de baja';
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


