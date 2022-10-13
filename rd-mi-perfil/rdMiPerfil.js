function DataEntrada() {
  const getFirstName = localStorage.getItem('wylexFirstName');
  var firstNameUpperCase = getFirstName.charAt(0).toUpperCase() + getFirstName.slice(1);
  var getAvatar = localStorage.getItem('wylexAvatar');
  //Pintar el avatar del usuario
  var selectImg = document.querySelector('.imgAvatar');
  var getAvatarDefault = 'https://redyman.netlify.app/header2022/img/user.png';

  selectImg.innerHTML = `<img src="${getAvatar !== 'null' ? getAvatar : getAvatarDefault}" alt="${getFirstName}">`;

  //Pintar el primer nombre del usuario
  var selectName = document.querySelector('.infoName');
  selectName.innerHTML = `Hola, ${firstNameUpperCase}`;
}

function DatosPersonales() {
  const getFirstName = localStorage.getItem('wylexFirstName');
  const getLastName = localStorage.getItem('wylexLastName');
  const getEmail = localStorage.getItem('wylexEmail');
  
  var firstNameUpperCase = getFirstName.charAt(0).toUpperCase() + getFirstName.slice(1);
  var lastNameUpperCase = getLastName.charAt(0).toUpperCase() + getLastName.slice(1);
  
  var nombreApellido = `${firstNameUpperCase} ${lastNameUpperCase}`;
  
  var selectValue = document.querySelector('.outsidetName .insideValue');
  selectValue.innerHTML = `${nombreApellido}`;

  var selectValueEmail = document.querySelector('.outsideEmail .insideValue');
  var emailcorreo = getEmail;
  selectValueEmail.innerHTML = `${emailcorreo}`;
  
}


setTimeout(function () {
  DataEntrada();
  DatosPersonales();
}, 300);
