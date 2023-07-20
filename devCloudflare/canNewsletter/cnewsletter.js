function btnDarseBaja() {
  fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php')
    .then(function (response) {
      return response.text();
    })
    .then(function (token) {
      // const emailUser = ECUAVISA_EC.USER_data().email;
      // Obtenemos el URL actual
      const urlActual = window.location.href;
      const urlObj = new URL(urlActual);
      const emailUser = urlObj.searchParams.get('nlcorreo');
      document.querySelector('.seca_darse').style.opacity = "0.5";

      // Verificamos si se encontró el parámetro 'correo' en el URL
      if (emailUser) {
        console.log('El correo recuperado es: ' + emailUser);
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

      } else {
        console.log('No se encontró el parámetro "correo" en el URL.');
      }
    })
    .catch(function (error) {
      console.log(error);
    });
}



function btnSuscribirse(element) {
  // Agregar la clase "loading" al botón
  element.classList.add('loading');
  fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php')
    .then(function (response) {
      return response.text();
    })
    .then(function (token) {

      // console.log(idListaSendpulse);
      const emailUser = ECUAVISA_EC.USER_data().email;

      fetch(`https://api.sendpulse.com/addressbooks/565083/emails`, {
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
          console.log(result);
        })
        .catch(error => console.log('error', error));

    })
    .catch(function (error) {
      console.log(error);
    });

}
