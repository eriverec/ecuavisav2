var selec = document.querySelector('.categoryListItemLink span');
var metaSelec = selec.textContent;
var cintillo = document.querySelector('.cintillo-single h2');
cintillo.append(`Recopilación de todo lo publicado en Ecuavisa sobre ${metaSelec}.`);