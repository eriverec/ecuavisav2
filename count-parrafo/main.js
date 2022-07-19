function pubCenter1() {
  // var rel_center1 = jQuery(".adcontainer-portlet.publicidad-center1").html();
  rel_center1 =
    "<div align='center' class='my-2' data-ad='top-generico' id='center1' ><script type='text/javascript'>googletag.cmd.push(function() { googletag.display('center1'); });console.log('center1');</script></div>";

  // jQuery(".ly-detail .adcontainer-portlet.publicidad-center1").empty();

  var content = $(".DETAIL_TXT .text").find("p");
  var midLength = parseInt(content.length / 2);
  content.eq(midLength).after(rel_center1);
  console.log("pubCenter1-activo-after");
}




setTimeout(function () {
  pubCenter1();
}, 3000);