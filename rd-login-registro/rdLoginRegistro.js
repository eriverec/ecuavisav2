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
  const gData = JSON.parse(atob(sData[1]));
  //console.log(gData);
  console.log("Email: " + gData.email);
  console.log("Email-verified: " + gData.email_verified);
  console.log("Firstname: " + gData.given_name);
  console.log("Lastname: " + gData.family_name);
  console.log("IMG-url: " + gData.picture);
}