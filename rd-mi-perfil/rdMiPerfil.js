setTimeout(function () {
  DataInfoUser();
}, 300);


function DataInfoUser () {
  const getFirstName = localStorage.getItem('wylexFirstName');
  var firstNameUpperCase = getFirstName.charAt(0).toUpperCase() + getFirstName.slice(1);

  const getAvatar = localStorage.getItem('wylexAvatar');

  //Pintar el avatar del usuario
  var selectImg = document.querySelector('.imgAvatar');
  selectImg.innerHTML = `<img src="${getAvatar}" alt="${getFirstName}">`;

  //Pintar el primer nombre del usuario
  var selectImg = document.querySelector('.infoName');
  selectImg.innerHTML = `Hola, ${firstNameUpperCase}`;

  // console.log(getFirstName);

}