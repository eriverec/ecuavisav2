function btnDarseBaja() {
  fetch(
    "https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php"
  )
    .then(function (response) {
      return response.text();
    })
    .then(function (token) {
      const emailUser = ECUAVISA_EC.USER_data().email;
      // Obtenemos el URL actual
      const urlActualHref = window.location.href;
      const urlObj = new URL(urlActualHref);
      const idBoletin = urlObj.searchParams.get("nlid");
      document.querySelector('._darsedebaja').style.opacity = "0.5";

      // Verificamos si se encontró el parámetro 'correo' en el URL

      /*GET VALIDACION DE EMAIL*/
      fetch(`https://api.sendpulse.com/addressbooks/${idBoletin}/emails`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        redirect: "follow",
      })
        .then((response) => response.json())
        .then((resultget) => {
          console.log("lista de corros sendpulse:", resultget);
          // const emailUser = "eriveraec@gmail.com";
          const foundEmail = resultget.find((email) => email.email === emailUser);
          if (foundEmail) {
            console.log("existe en la lista.");
            fetch(
              `https://api.sendpulse.com/addressbooks/${idBoletin}/emails`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + token,
                },
                body: JSON.stringify({
                  emails: [emailUser],
                }),
                redirect: "follow",
              }
            )
              .then((response) => response.text())
              .then((result) => {
                console.log(result);
                document.querySelector('.seca_mensaje_exito').classList.remove('d-none');
                document.querySelector('._darsedebaja').classList.add('d-none');
              })
              .catch((error) => console.log("error", error));
          } else {
            console.log("emails no existe en la lista de sendpulse.");
            document.querySelector('._darsedebaja').classList.add('d-none');
            document.querySelector('.seca_mensaje_exito').classList.remove('d-none');
            document.querySelector(".seca_mensaje_exito").textContent =
              "Te has dado de baja con éxito";
          }
          // console.log(valemail);
        })
        .catch((error) => console.log("error", error));
    })
    .catch(function (error) {
      console.log(error);
    });
}

function valIdNewsletter()  {
  const userLoginRD = localStorage.getItem('wylexUserId') || 0;
  if (userLoginRD === 0) {
    setTimeout(() => {
      redireccionAlLogin();
    }, 300);
  } else { 
    // btnDarseBaja();
  }
}

valIdNewsletter();

var estadoDarseDeBaja = true;

function habilitarDeshabilitarBtn(resp = true){
  var btn_motivo = document.querySelector("#enviarMotivo");
  if(!resp){
    btn_motivo.style.opacity = "0.5";
    btn_motivo.setAttribute("disabled", true);
  }else{
    btn_motivo.style.opacity = "1";
    btn_motivo.removeAttribute("disabled");
  }
}

function btnSuscribirse() {
  var btn_suscribir = document.querySelector(".se_btn._suscribir");
  btn_suscribir.style.opacity = "0.5";
  btn_suscribir.setAttribute("disabled", true);
  fetch(
    "https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php"
  )
    .then(function (response) {
      return response.text();
    })
    .then(function (token) {
      // console.log(idListaSendpulse);
      const emailUser = ECUAVISA_EC.USER_data().email;
      const urlActualHref = window.location.href;
      const urlObj = new URL(urlActualHref);
      const idBoletin = urlObj.searchParams.get("nlid");

      fetch(`https://api.sendpulse.com/addressbooks/${idBoletin}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          emails: [{ email: emailUser }],
        }),
        redirect: "follow",
      })
        .then((response) => response.text())
        .then((result) => {
          btn_suscribir.style.opacity = "1";
          btn_suscribir.removeAttribute("disabled");
          habilitarDeshabilitarBtn(false);
          estadoDarseDeBaja = false;

          document.querySelector(".seca_mensaje_exito_susc").classList.remove("d-none");
        })
        .catch((error) => console.log("error", error));
    })
    .catch(function (error) {
      console.log(error);
    });
}

function enviarMotivo() {
  const dataID = parseInt(ECUAVISA_EC.USER_data("id"));
  const uMotivo = window.location.href;
  const urlObj = new URL(uMotivo);
  const idMID = urlObj.searchParams.get("nlid");
  const idMName = urlObj.searchParams.get("name");
  const selectElement = document.querySelector(".motivo_option select");
  const valorSeleccionado = selectElement.value;

  if(!estadoDarseDeBaja){
    alert("Para poder enviar el motivo no debe estar suscrito.");
    return false;
  }

  if(valorSeleccionado != '0'){
    fetch("https://abandonos.vercel.app/motivo/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        motivo: valorSeleccionado,
        idusuario: dataID,
        idlista: idMID,
        titulo: idMName,
      }),
      redirect: "follow",
    })
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  } else{
    alert("Por favor seleccione una razón.")
  }
  
}