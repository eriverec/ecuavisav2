setTimeout(function () {
  getNameTag();
  hideBlock();
}, 300)

function getNameTag() {
  var selec = document.querySelector('.categoryListItemLink span');
  var metaSelec = selec.textContent;
  var cintillo = document.querySelector('.cintillo-single h2');
  var dataAuthor = document.querySelector('.author_card .text_block .name_autor');
  if(dataAuthor){
    dataAuthor.append(`${metaSelec}`);
  }
  cintillo.append(`Recopilación de todo lo publicado en Ecuavisa sobre ${metaSelec}.`);
}


function hideBlock() {
  if (typeof authorSlug === !'undefined') {
    console.log(true);
    document.querySelector('.categoryGroup').style.display = "none";
    document.querySelector('.c_azul_global div').style.display = "none";
    document.querySelector('.name_tema .cintillo-rd').style.display = "none";
    document.querySelector('.cintillo-single').style.display = "none";
  } else {
    console.log(false);
  }
}