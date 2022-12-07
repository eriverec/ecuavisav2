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
  console.log(response);
}