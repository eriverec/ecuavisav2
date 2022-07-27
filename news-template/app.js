$(".newsletters_options .newsletters_check input").addClass("btn-check");
$(".newsletter_email .newsletter_email_div input").addClass("form-control");
$(".newsletter_email_div #newsletter_email_ctrl").attr("placeholder", "Email");

function ClearFields() {
  document.getElementById("newsletter_email_ctrl").value = "";
}
