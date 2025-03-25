/*const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  var myHeaders = new Headers();
  const tk = urlParams.get('tk')
myHeaders.append("Authorization", "JWT "+tk);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  redirect: 'follow'
};
// servicio render Luis 
await fetch("https://micuenta.ecuavisa.com/loginservice/tasks", requestOptions)
  .then(response => response.json())
  .then (async (result) => {console.log(result); 
    localStorage.wylexUserId=result.userId;
    localStorage.wylexFirstName=result.first_name;
    localStorage.wylexLastName=result.last_name;
    localStorage.wylexEmail=result.email;
    if(result.wylexAvatar){
      localStorage.wylexAvatar=result.avatar;
    }
//     var UserId = localStorage.getItem('wylexUserId'); //variable de id de usuario
// if (!UserId){
//     Si no existe sesión lo va a redireccionar al login
//     window.location = URL_login_G;
// }
  }).catch(error => {
    console.log('error', error)
  });*/