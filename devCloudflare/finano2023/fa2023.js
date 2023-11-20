// Agregar la clase "active" a los dos primeros elementos
var initialReveals = document.querySelectorAll(".bloque_list_finano .noticias article");
for (var i = 0; i < 2; i++) {
  initialReveals[i].classList.add("active");
}

function reveal() {
  var reveals = document.querySelectorAll(".bloque_list_finano .noticias article");

  for (var i = 2; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal);