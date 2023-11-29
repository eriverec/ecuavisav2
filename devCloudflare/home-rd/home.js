function lnf() {
  var getSeccion = $('.HOME_MENU_RD .destacada__5 .noticias .article .media_block .article-section a').attr(
    'data-seccion');
  if (getSeccion === 'La noticia a fondo') {
    $('.HOME_MENU_RD .destacada__5 .noticias .article .media_block .article-section').css('display', 'block')
  } else {
    console.log('no es la noticia a fondo');
  }
}
setTimeout(() => {
  lnf();
}, 200);