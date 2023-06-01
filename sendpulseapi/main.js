
/* ************
Access Token  
*************** */
var myHeadersToken = new Headers();
myHeadersToken.append("Content-Type", "application/json");
myHeadersToken.append("Cookie", "PHPSESSID=yc872Ui82h2kwQcHr7dvo9RjQ8TXYsU7kArdxCMx; XDEBUG_SESSION=PHPSTORM");

var rawToken = JSON.stringify({
  "grant_type": "client_credentials",
  "client_id": "c79f7382012df0ea4c6fa37afec6374e",
  "client_secret": "164551af334e1ec93e1b3099afd93a88"
});

var requestOptionsToken = {
  method: 'POST',
  headers: myHeadersToken,
  body: rawToken,
  redirect: 'follow'
};

fetch("https://api.sendpulse.com/oauth/access_token", requestOptionsToken)
  .then(response => response.json())
  .then(result => {
    // enviar el token generado al localstorage
    // localStorage.setItem('access_token', result.access_token);
    return result.access_token;
  })
  .catch(error => console.log('error', error));

/* ************************************
Enviar correos al listado de sendpulse 
*************************************** */

//Obtener el token del localstorage
// var getToken = localStorage.getItem('access_token');

var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer " + requestOptionsToken);
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Cookie", "PHPSESSID=yc872Ui82h2kwQcHr7dvo9RjQ8TXYsU7kArdxCMx; XDEBUG_SESSION=PHPSTORM");

var raw = JSON.stringify({
  "emails": [
    {
      "email":"test98ds@test.com"
    },
    
  ]
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.sendpulse.com/addressbooks/403420/emails", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));