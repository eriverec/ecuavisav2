 /* PASSWORD */
 const togglePassword = document.querySelector("#togglePassword");
 const password = document.querySelector("#pass");
 
var tk;
window.onload = () => {
 const queryString = window.location.search;
 const urlParams = new URLSearchParams(queryString);
 tk = urlParams.get('tk');
 document.getElementById("create").removeAttribute('class');
 //localStorage.token = tk;
};
 

 togglePassword.addEventListener("click", function () {
   // toggle the type attribute
   const type = password.getAttribute("type") === "password" ? "text" : "password";
   password.setAttribute("type", type);

   // toggle the icon
   this.classList.toggle("bi-eye");
 });

 /* CONFIRMACION */
 const togglePasswordConfirm = document.querySelector("#togglePasswordConfirm");
 const confirm_pass = document.querySelector("#confirm_pass");

 togglePasswordConfirm.addEventListener("click", function () {
   // toggle the type attribute
   const type = confirm_pass.getAttribute("type") === "password" ? "text" : "password";
   confirm_pass.setAttribute("type", type);

   // toggle the icon
   this.classList.toggle("bi-eye");
 });

 //  prevent form submit
 //  const form = document.querySelector("form");
 //  form.addEventListener('submit', function (e) {
 //    e.preventDefault();
 //  });

 function validate_password() {
   var pass = document.getElementById('pass').value;
   var confirm_pass = document.getElementById('confirm_pass').value;
   if (pass != confirm_pass) {
     document.getElementById('wrong_pass_alert').style.color = 'red';
     document.getElementById('wrong_pass_alert').innerHTML = 'Usa la misma contraseña';
     document.getElementById('create').disabled = true;
     document.getElementById('create').style.opacity = (0.4);
   } else {
     document.getElementById('wrong_pass_alert').style.color = 'green';
     document.getElementById('wrong_pass_alert').innerHTML = 'Contraseña coincide';
     document.getElementById('create').disabled = false;
     document.getElementById('create').style.opacity = (1);
   }
 }

 function wrong_pass_alert() {
   if (document.getElementById('pass').value != "" && document.getElementById('confirm_pass').value != "") {
    //let token = localStorage.getItem('token');
    let pass = document.getElementById('pass').value;
    console.log(tk);

    
    fetch("https://ecuavisa-register.onrender.com/resetPassword", {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        token: tk,
        password: pass
      }),
    })
      .then((response) => response.json())
      .then(async (result) => {
        alert("Su contraseña se ha creado con exito!");
        console.log(result);
      })
      .catch((error) => {
        console.log("error", error); /*; window.location = URL_login_G*/
      });
     
     //console.log('password: ', document.getElementById('pass').value);
    // console.log('confirmación: ', document.getElementById('confirm_pass').value);
  } else {
     //  alert("Please fill all the fields");
    console.log('Por favor llene todos los campos')
  }
 }