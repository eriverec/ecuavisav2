function pubCenter1() {
  var rel_center1 = jQuery(".adcontainer-portlet.publicidad-center1").html();
  rel_center1 =
    "<div class='portlet-boundary portlet-static-end adcontainer-portlet pub-active'><div class='pub-center1-js c_002_001'>" + rel_center1 + "</div></div>";
  jQuery(".ly-detail .adcontainer-portlet.publicidad-center1").empty();

  var content = $(".DETAIL_TXT .text").find("p");
  var midLength = parseInt(content.length / 2);
  content.eq(midLength).after(rel_center1);
  console.log("pubCenter1-activo-after");
}




setTimeout(function () {
  pubCenter1();
}, 3000);