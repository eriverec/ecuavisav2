$(document).ready(function () {
  $(".modal-footer button").click(function () {
    var email = $('#forgetEmail').val();

    if (IsEmail(email) == false) {
      $('#invalid_email').show();
      return false;
    } else {
      console.log('correo: ', email);
      $('#invalid_email').hide();
      $('.modal-footer').hide();
      $('.modal-body').html(`
      <div class="alert alert-success" role="alert">
       Correo enviado con éxito
     </div>
     `);
    }

  });

  var checkInput = (e) => {
    const content = $("#forgetEmail").val().trim();
    $('#forgetButton').prop('disabled', content === '');
  };

  $(document).on('keyup', '#forgetEmail', checkInput);

  /*function IsEmail(email) {
    var regex =
      /^([a-zA-Z0-9_.-+])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;
    if (!regex.test(email)) {
      return false;
    } else {
      return true;
    }
  }*/
});


function IsEmail() {
  var input = document.querySelector('#forgetEmail');
  var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (input.value.match(validRegex)) {
    return true;
  } else {
    return false;
  }
}