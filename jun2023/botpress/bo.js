const jd = document.querySelector(".txt__");
if(jd){
  jd.style.color = "red";
}

// ad floating de campaña
 _html3 = document.createElement('div'); // creamos el elemento
// agregamos el maping unico del nuevo floating
window.googletag = window.googletag || {cmd: []};
googletag.cmd.push(function() {
  googletag.defineSlot('/49542283/Ecuavisa/Registro_Floating', [1, 1],'floating_ad').addService(googletag.pubads());
  googletag.pubads().setTargeting('EC_Seccion','');
  googletag.pubads().setTargeting('EC_Subseccion',''); 
  googletag.pubads().setTargeting('EC_Tipo','');
  googletag.pubads().setTargeting('EC_Articulo','');
  googletag.pubads().setTargeting('EC_backoffice','all-Users-gye');
  // googletag.pubads().setTargeting('EC_Demo',dfp_demo);
  googletag.pubads().collapseEmptyDivs();
  googletag.pubads().setCentering(true);
  googletag.enableServices();
});
// agregamos el contenido y atributos al elemento creado
_html3.innerHTML = '<div id="floating_ad" data-ads="floating_ad"> <script> googletag.cmd.push(function() { googletag.display("floating_ad"); }); </script></div>';
document.body.appendChild(_html3); // agregamos al body el espacio
setTimeout(() => {
  // console.log(runAdContainer("floating_ad"));// Corremos Floating
}, "1000");

console.log("ad ejecutado con exito") // si el espaciocorre todo ok