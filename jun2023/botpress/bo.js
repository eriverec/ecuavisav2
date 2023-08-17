const jd = document.querySelector(".txt__");
if(jd){
  jd.style.color = "red";
}


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

setTimeout(() => {
  // console.log(runAdContainer("floating_ad"));// Corremos Floating
}, "1000");

console.log("ad ejecutado con exito") // si el espaciocorre todo ok