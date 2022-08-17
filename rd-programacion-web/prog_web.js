console.log("first");


function activeBlock(val) {
  $(`.lista-programacion-bloque .noticias .article .BLOQUE_PROG_TIT_TXT.n${val} .text_block .text .text-wrapper`
  ).addClass("activeBG");
}

activeBlock(3);
