setTimeout(function () {
  DataEntrada();
  DatosPersonales();
}, 300);


function DataEntrada () {
  const getFirstName = localStorage.getItem('wylexFirstName');
  var firstNameUpperCase = getFirstName.charAt(0).toUpperCase() + getFirstName.slice(1);
  const getAvatar = localStorage.getItem('wylexAvatar');
  //Pintar el avatar del usuario
  var selectImg = document.querySelector('.imgAvatar');
  var getAvatarDefault = 'https://redyman.netlify.app/header2022/img/user.png';

  selectImg.innerHTML = `<img src="${typeof(getAvatar) !== 'undefined' ? getAvatar : getAvatarDefault}" alt="${getFirstName}">`;

  console.log("WYLEX IMAGEN",getAvatar);

  //Pintar el primer nombre del usuario
  var selectImg = document.querySelector('.infoName');
  selectImg.innerHTML = `Hola, ${firstNameUpperCase}`;
}

function DatosPersonales () {
  const getFirstName = localStorage.getItem('wylexFirstName');
  const getLastName = localStorage.getItem('wylexLastName');

  var firstNameUpperCase = getFirstName.charAt(0).toUpperCase() + getFirstName.slice(1);
  var lastNameUpperCase = getLastName.charAt(0).toUpperCase() + getLastName.slice(1);

  var nombreApellido = `${firstNameUpperCase} ${lastNameUpperCase}`;

  var selectValue = document.querySelector('.outsidetName .insideValue');

  selectValue.innerHTML = `${nombreApellido}`;

}