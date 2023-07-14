
function btnSendApiEmails() {
  // Agregar la clase "loading" al botón
  // element.classList.add('loading');

  const apiUrl = "https://mongo-users-drab.vercel.app/usuario/sendpulse";

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const filteredUsers = data;
      const totalEmails = filteredUsers.length;
      const batchSize = 50; // Tamaño del lote

      // Dividir los usuarios filtrados en lotes de 1000
      for (let i = 0; i < totalEmails; i += batchSize) {
        const batch = filteredUsers.slice(i, i + batchSize);

        // Objeto para almacenar los emails y sus datos
        const objetBody = [];

        // Recorrer los usuarios del lote actual y agregar los datos al objeto
        batch.forEach(user => {
          const { email, first_name, last_name, created_at } = user;
          const userData = {
            email: email,
            variables: {
              Nombre: first_name,
              Apellido: last_name,
              created_at: created_at
            }
          };
          objetBody.push(userData);
        });

        // Imprimir el objeto en la consola
        console.log(objetBody);

        // Realizar el envío de correo del lote actual
        sendEmailsBatch(objetBody);
      }
    })
    .catch(error => {
      console.error("Error al obtener los datos:", error);
    });
}

function sendEmailsBatch(emails) {
  fetch("https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php")
    .then(function (response) {
      return response.text();
    })
    .then(function (token) {
      const idListaSendpulse = "574822";
      const listEmails = idListaSendpulse;

      fetch(`https://api.sendpulse.com/addressbooks/${listEmails}/emails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ emails: emails }),
        redirect: "follow",
      })
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
        })
        .catch((error) => console.log("error", error));
    })
    .catch(function (error) {
      console.log(error);
    });
}

btnSendApiEmails();
