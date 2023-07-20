function btnDarseBaja() {
  fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php')
    .then(function (response) {
      return response.text();
    })
    .then(function (token) {
      const emailUser = ECUAVISA_EC.USER_data().email;
      // Obtenemos el URL actual
      const urlActualHref = window.location.href;
      const urlObj = new URL(urlActualHref);
      const idBoletin = urlObj.searchParams.get('nlid');
      // document.querySelector('.seca_darse').style.opacity = "0.5";

      // Verificamos si se encontró el parámetro 'correo' en el URL
     
      /*GET VALIDACION DE EMAIL*/
      fetch(`https://api.sendpulse.com/addressbooks/${idBoletin}/emails`, {
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
            fetch(`https://api.sendpulse.com/addressbooks/${idBoletin}/emails`, {
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
                // document.querySelector('.seca_mensaje_exito').classList.remove('d-none');
                // document.querySelector('.seca_darse').classList.add('d-none');
              })
              .catch(error => console.log('error', error));
          } else {
            console.log('emails no existe en la lista de sendpulse.');
            // document.querySelector('.seca_darse').classList.add('d-none');
            // document.querySelector('.seca_mensaje_exito').classList.remove('d-none');
            document.querySelector('.seca_mensaje_exito').textContent = 'Te has dado de baja con éxito de la newsletter Ecuavisa Informa';
          }
          // console.log(valemail);
        })
        .catch(error => console.log('error', error));
  
    })
    .catch(function (error) {
      console.log(error);
    });
}

btnDarseBaja();


function btnSuscribirse() {
  fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php')
    .then(function (response) {
      return response.text();
    })
    .then(function (token) {
      // console.log(idListaSendpulse);
      const emailUser = ECUAVISA_EC.USER_data().email;
      const urlActualHref = window.location.href;
      const urlObj = new URL(urlActualHref);
      const idBoletin = urlObj.searchParams.get('nlid');
      document.querySelector('.se_btn._suscribirse').style.opacity = "0.5";
 
      fetch(`https://api.sendpulse.com/addressbooks/${idBoletin}/emails`, {
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
          document.querySelector('.se_btn._suscribirse').style.opacity = "1";
          document.querySelector('.seca_mensaje_exito_susc').classList.remove('d-none');
        })
        .catch(error => console.log('error', error));

    })
    .catch(function (error) {
      console.log(error);
    });

}
