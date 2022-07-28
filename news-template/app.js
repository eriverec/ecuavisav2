$(".newsletter-styles-form .newsletters_options .newsletters_check input").addClass("btn-check");
$(".newsletter-styles-form .newsletter_email .newsletter_email_div input").addClass("form-control");
$(".newsletter-styles-form .newsletter_email_div #newsletter_email_ctrl").attr("placeholder", "Email");
$(".newsletter-styles-form .boton-suscrib .btn-trans").after(`<img src="https://ecuavisadev.netlify.app/news-template/src-img-btn.png" alt="recurso">`);

function ClearFields() {
  document.getElementById("newsletter_email_ctrl").value = "";
}



