
function addDivTabNav() {
  $(".menu-movil .nav-dropdown .parent-nav").prepend(`<li class='lst-item tabnavBuscador'></li>`);
}

function addSearchMobile(){
  $(".basic-search-rd-mobile").detach().appendTo('.nav-dropdown.nav.noSubNav .parent-nav .tabnavBuscador');
  $('.basic-search-rd-mobile').removeClass('d-none');
  $('.basic-search-rd-mobile').css('display','flex');
  $(".basic-search-rd-mobile .iter-field.iter-field-text .iter-field-element input").attr("placeholder", "Buscar...");
}

var devicesearch;
var btest=navigator.userAgent.toLowerCase();

if ( /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(btest) ) {
  console.log("tablet");
  devicesearch = "Tablet";
} else if( /(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/i.test(btest) ) {
  console.log("Mobil");
  devicesearch = "Mobile";
  setTimeout(() => {
  addDivTabNav();
}, 400);

setTimeout(() => { 
  addSearchMobile();
}, 700);
} else {
  console.log("desktop");
  devicesearch = "PC";
}