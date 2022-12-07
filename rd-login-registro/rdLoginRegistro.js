//Animacion de cambio de tabs
const toggleForm = () => {
  const container_lr = document.querySelector('.container-lr');
  container_lr.classList.toggle('active');
}

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
  console.log('sData:', sData);
  const gData = JSON.parse(atob(sData[1]));
  console.log('gData:', gData);
  console.log("Email: " + gData.email);
  console.log("Email-verified: " + gData.email_verified);
  console.log("Firstname: " + gData.given_name);
  console.log("Lastname: " + gData.family_name);
  console.log("IMG-url: " + gData.picture);
}



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
function statusChangeCallback(response) { // Called with the results from FB.getLoginStatus().
  console.log('statusChangeCallback');
  console.log(response); // The current login status of the person.
  if (response.status === 'connected') { // Logged into your webpage and Facebook.
    testAPI();
  } else { // Not logged into your webpage or we are unable to tell.
    document.getElementById('status').innerHTML = 'Please log ' +
      'into this webpage.';
  }
}


function checkLoginState() { // Called when a person is finished with the Login Button.
  FB.getLoginStatus(function (response) { // See the onlogin handler
    statusChangeCallback(response);
  });
}


window.fbAsyncInit = function () {
  FB.init({
    appId: '7328523993885687',
    cookie: true, // Enable cookies to allow the server to access the session.
    xfbml: true, // Parse social plugins on this webpage.
    version: 'v15.0' // Use this Graph API version for this call.
  });


  FB.getLoginStatus(function (response) { // Called after the JS SDK has been initialized.
    statusChangeCallback(response); // Returns the login status.
  });
};

function testAPI() { // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me?fields=id,name,email', function (response) {
    console.log('Successful login for: ' + response.name);
    document.getElementById('status').innerHTML =
      'Thanks for logging in, ' + response.name + '!';
  });
}