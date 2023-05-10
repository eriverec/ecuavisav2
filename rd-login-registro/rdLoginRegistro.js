var URL_principal_G = "https://www.ecuavisa.com/";
var URL_login_G = "https://www.ecuavisa.com/servicios/login";
var URL_perfil_G = "https://www.ecuavisa.com/servicios/perfil";
var UserId = localStorage.getItem("wylexUserId");

window.onload = () => {
  document.getElementById("forgetButton").disabled = false;
  let btnLogGoogle = document.getElementById("aLogGoogle");
  btnLogGoogle.setAttribute("href", "#");
  btnLogGoogle.setAttribute("onclick", "validateLogSocials();");
  let btnLogFacebook = document.getElementById("aLogFacebook");
  btnLogFacebook.setAttribute("href", "#");
  btnLogFacebook.setAttribute("onclick", "validateLogSocials();");
};
if (UserId) {
  /*Si existe sesión lo 
   va a redireccionar al perfil */
  window.location = URL_perfil_G;
}

//Animacion de cambio de tabs
const toggleForm = () => {
  const container_lr = document.querySelector(".container-lr");
  container_lr.classList.toggle("active");
};

//Google Platform
// function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
// }

window.handleCredentialResponse = (response) => {
  const sData = response.credential.split(".");
  console.log("sData:", sData);
  const gData = JSON.parse(atob(sData[1]));
  console.log("gData:", gData);
  console.log("Email: " + gData.email);
  console.log("Email-verified: " + gData.email_verified);
  console.log("Firstname: " + gData.given_name);
  console.log("Lastname: " + gData.family_name);
  console.log("IMG-url: " + gData.picture);
};

//Facebook init
// window.fbAsyncInit = function () {
//   FB.init({
//     appId: '7328523993885687',
//     xfbml: true,
//     version: 'v15.0'
//   });
//   FB.AppEvents.logPageView();
// };

// (function (d, s, id) {
//   var js, fjs = d.getElementsByTagName(s)[0];
//   if (d.getElementById(id)) {
//     return;
//   }
//   js = d.createElement(s);
//   js.id = id;
//   js.src = "https://connect.facebook.net/en_US/sdk.js";
//   fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));

//Login facebook
// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
  console.log("statusChangeCallback");
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === "connected") {
    // Logged into your app and Facebook.
    testAPI();
  } else {
    // The person is not logged into your app or we are unable to tell.
    // document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
  }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function () {
  FB.init({
    appId: "617025596888772",
    cookie: true, // enable cookies to allow the server to access
    // the session
    xfbml: true, // parse social plugins on this page
    version: "v15.0", // Specify the Graph API version to use
  });

  // Now that we've initialized the JavaScript SDK, we call
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });
};

// Load the SDK asynchronously
(function (d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/es_ES/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
})(document, "script", "facebook-jssdk");

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
  console.log("Welcome!  Fetching your information.... ");
  FB.api("/me?fields=id,name,email,picture", function (response) {
    console.log("Successful login ID: " + response.id);
    console.log("Email: " + response.email);
    console.log("Avatar: " + response.picture.data.url);
    console.log("Name: " + response.name);
    // document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
  });
}

function fb_login() {
  FB.login(
    function (response) {
      if (response.authResponse) {
        console.log("Welcome!  Fetching your information.... ");
        //console.log(response); // dump complete info
        access_token = response.authResponse.accessToken; //get access token
        user_id = response.authResponse.userID; //get FB UID

        FB.api("/me?fields=id,name,email,picture", function (response) {
          user_email = response.email; //get user email
          console.log("Successful login ID: " + response.id);
          console.log("Email: " + user_email);
          console.log("Avatar: " + response.picture.data.url);
          console.log("Name: " + response.name);
          // you can store this data into your database
        });
      } else {
        //user hit cancel button
        console.log("User cancelled login or did not fully authorize.");
      }
    },
    {
      scope: "public_profile,email",
    }
  );
}

function login() {
  let cboxTerm = document.getElementById("checkTerms");
  if (cboxTerm.checked == true) {
    var btn = document.querySelector('#acceder');
    btn.setAttribute("disabled", true); 
    var URL_login_G = "https://www.ecuavisa.com/servicios/login";
    document.getElementById("logEmail").required = true;
    document.getElementById("logPass").required = true;

    let email = document.getElementById("logEmail").value;
    let password = document.getElementById("logPass").value;

    if(email == '' || password =='' || email.length == 0 || password.length == 0){
      alert('El correo y la contraseña no deben estar vacíos');
      btn.removeAttribute('disabled');
      return false;
    }

    //servicio render Luis
    fetch("https://ecuavisa-login-service.onrender.com/signIn", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        email: email,
        password: password,
      }),
    }).then((response) => response.json())
      .then(async (result) => {
        console.log(result);
        if (result.token) {
          localStorageSetUsuarioNew(result.user);
          //cambiar url destino
          let redirect = "https://www.ecuavisa.com/compania593/click-boom/que-esconde-la-cartera-de-victoria-KL4951862?tk=" + result.token;
          //console.log("https://www.ecuavisa.com/user-portlet/refreshuserentitlements?redirect=" + redirect + "&ssodata=" + result.url);
          let urlTk = "https://www.ecuavisa.com/user-portlet/refreshuserentitlements?redirect=" + redirect + "&ssodata=" + result.url;
          window.location = "https://www.ecuavisa.com/user-portlet/refreshuserentitlements?redirect=" + redirect + "&ssodata=" + result.url;
          localStorage.setItem('urlTk',urlTk);
          btn.removeAttribute('disabled');  
        } else {
          alert("Nombre de usuario o contraseña incorrecto");
          btn.removeAttribute('disabled');
        }
      })
      .catch((error) => {
        btn.removeAttribute('disabled');
        console.log("error", error); /*; window.location = URL_login_G*/
      });
  } else {
    alert("Acepte los términos y condiciones antes de continuar");
    return false;
  }
}

function register() {
  let cboxTermReg = document.getElementById("checkTermsReg");
  if (cboxTermReg.checked == true) {
    var btn = document.querySelector('#registrar');
    btn.setAttribute("disabled", true); 
    document.getElementById("regName").required = true;
    document.getElementById("regEmail").required = true;
    document.getElementById("regPass").required = true;
    document.getElementById("regConf").required = true;

    let name = document.getElementById("regName").value.trim().split(" ");
    let email = document.getElementById("regEmail").value.trim();
    let password = document.getElementById("regPass").value;
    let passwordConf = document.getElementById("regConf").value;
    let token;

    if(passwordConf == '' || password =='' || name =='' || email =='' || passwordConf.length == 0 || password.length == 0 || name.length == 0 || email.length == 0){
      alert('Todos los campos son requeridos, se deben llenar');
      btn.removeAttribute('disabled');
      return false;
    }

    if (password !== passwordConf) {
      alert("Las contraseñas no coinciden")
      console.log("Las contraseñas no coinciden");
    } else {
      //servicio render Luis
      fetch("https://ecuavisa-login-service.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          email: email,
          nombre: name[0],
          apellido: name[1],
          password: password,
        }),
      }).then((response) => response.json())
        .then(async (result) => {
          if(typeof result.message !== 'undefined'){
            btn.removeAttribute('disabled');
            alert(result.message+' o su correo ya existe');
          }else{
            token = result.token;
            console.log('token registro',result);
            if (result.token) {
                localStorageSetUsuarioNew(result.user);
                btn.removeAttribute('disabled');
                // cambiar url destino
                window.location = "https://www.ecuavisa.com/compania593/click-boom/que-esconde-la-cartera-de-victoria-KL4951862?tk="+ result.token;
            }
          }
        })
        .catch((error) => {
          btn.removeAttribute('disabled');
          alert(error)
          console.log("error", error); /*; window.location = URL_login_G*/
        });
    }
  } else {
    alert("Acepte los términos y condiciones antes de continuar");
    return false;
  }
}

function sendEmailPassReset() {
  var btn = document.querySelector('#forgetButton');
  btn.setAttribute("disabled", true); 
  let email = document.getElementById("forgetEmail").value.trim() || '';
  
  if(!IsEmail()){
    alert('El correo no es el correcto');
    btn.removeAttribute('disabled');
    return false;
  }

  if(email == '' || email.length == 0){
    alert('El correo no es el correcto');
    btn.removeAttribute('disabled');
    return false;
  }
  //servicio render Luis
  fetch("https://ecuavisa-login-service.onrender.com/forgotPassword", {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      email: email,
    }),
  }).then((response) => response.json())
    .then(async (result) => {
      if (!result.error) {
        alert(result.mensaje);
        $("#exampleModal").modal("hide");
      } else {
        alert("Email inválido");
      }
      btn.removeAttribute('disabled');
    })
    .catch((error) => {
      btn.removeAttribute('disabled');
      console.log("error", error); /*; window.location = URL_login_G*/
    });
}

function IsEmail() {
  var input = document.querySelector('#forgetEmail');
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}

function validateLogSocials() {
  let check = document.getElementById("checkTerms");
  if (check.checked == true) {
    let btnGoogle = document.getElementById("aLogGoogle");
    btnGoogle.setAttribute(
      "href",
      "https://ecuavisa-login-service.onrender.com/auth/google"
    ); //servicio render Luis

    let btnFacebook = document.getElementById("aLogFacebook");
    btnFacebook.setAttribute(
      "href",
      "https://ecuavisa-login-service.onrender.com/auth/facebook"
    ); //servicio render Luis
  } else {
    alert("Acepte los términos y condiciones para continuar");
  }
}

function localStorageSetUsuarioNew(user){
  //estado:0 VERIFICA QUE EL USUARIO ES NUEVO

  /*localStorage.wylexStatusPerfil=user.user_new;*/
  
  return true;
}
