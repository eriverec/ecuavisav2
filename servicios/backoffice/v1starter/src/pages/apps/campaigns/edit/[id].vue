<script setup>
import { useCategoriasListStore } from "@/views/apps/categorias/useCategoriasListStore";
import { useRouter } from 'vue-router';
import { FormWizard, TabContent } from "vue3-form-wizard";
import 'vue3-form-wizard/dist/style.css';
const router = useRouter();
const currentTab = ref('tab-lista');
const checkbox = ref(false);
const loadingWizard = ref(false);
const loadingPanel = ref(false);
const dataCampaigns = ref([]);
const dataCountry = ref([]);
// const modelPaises = ref(null);
const cityList = ref([]);
const countryList = ref([]);
// const FormWizard = ref(false);
// const TabContent = ref(false);

const nombreCampania = ref('')
const codigoExternoModel = ref('')
const linkAds = ref('')
const linkImageEscritorio = ref('')
const linkImageMobile = ref('');
const numeroOtroUsuarios = ref('');
const languages = ref([]);
const criterio = ref([]);
const posicion = ref([]);
const selectedItem = ref([]);
const selectedItemCiudad = ref([]);
const dataUsuarios = ref({});
const selectItemParticipantes = ref(null);
const selectItemsList = ref([{ title:'Otro', value: 'Otro' },{ title:'100', value: '100' }]);
const minValue = ref(1); // Valor mínimo permitido
const maxValue = ref(100); // Valor máximo permitido
const route = useRoute();
const tamanioUsuarios = ref(0)

const search = ref(null)

const metadatos = ref([]);
const metadatosItems = ref([]);
const searchMetadatos = ref([]);
const selectMetadatos = ref(null);
const loadComponent = ref(true);
const categoriasListStore = useCategoriasListStore();
const fetchCategorias = async () => {
  try {
    const response = await categoriasListStore.fetchCategorias();
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const selectItemVisibilidad = ref([]);
const selectItemsListVisibilidad = ref([
  { title:'Todo el sitio', value: 'all', avatar:"" },
  { title:'Noticias', value: 'noticias', avatar:"" }
]);

const selectItemDispositivos = ref([]);
const selectItemsListDispositivos = ref([
  { title:'Todos', value: '0', avatar:"mdi-cellphone-link" },
  { title:'Escritorio', value: 'desktop', avatar:"mdi-laptop-chromebook" },
  { title:'Móvil', value: 'movil', avatar:"mdi-cellphone-android" },
  ]);

const selectItemNavegador = ref([]);
const selectItemsListNavegador = ref([
  { title:'Todos', value: '0', avatar:"" },
  { title:'Chrome', value: 'Chrome', avatar:"" },
  { title:'Safari', value: 'Safari', avatar:"" },
  { title:'Firefox', value: 'Firefox', avatar:""},
  { title:'Otro', value: 'Otro', avatar:"" } ,
  ]);

const selectItemSO = ref([]);
const selectItemsListSO = ref([
  { title:'Todos', value: '0', avatar:"", navegador: [] },
  { title:'Windows', value: 'Windows', avatar:"tabler-brand-windows", navegador: [{ title:'Chrome', value: 'Chrome' },{ title:'Firefox', value: 'Firefox' }] },
  { title:'Mac OS', value: 'Mac OS', avatar:"tabler-brand-apple", navegador: [{ title:'Safari', value: 'Safari' },{ title:'Chrome', value: 'Chrome' }] },
  { title:'Android', value: 'Android', avatar:"tabler-brand-android", navegador: [{ title:'Chrome', value: 'Chrome' },{ title:'Firefox', value: 'Firefox' }] },
  { title:'Linux', value: 'Linux', avatar:"mdi-linux", navegador: [{ title:'Chrome', value: 'Chrome' }] } ,
  { title:'Otro', value: 'Otro', avatar:"", navegador: [{ title:'Chrome', value: 'Chrome' }] } ,
  ]);

const numeroRules = [
  (v) => !!v || 'El número es requerido', // Verifica que no esté vacío
  (v) => /^\d+$/.test(v) || 'Ingrese solo números', // Verifica que solo sean números
  (v) => v >= minValue.value && v <= maxValue.value || 'Ingrese un número entre '+minValue.value+' y '+maxValue.value // Verifica el rango de valores
];

const languageList = [{
  title:'Imágenes locales',
  value:'imagen'
},{
  title:'Códigos externos',
  value:'html'
},{
  title:'Códigos ADS',
  value:'script'
}]

const criterioList = [
  { title:'Geolocalización', value:'trazabilidads' },
  { title:'Dispositivos', value:'dispositivos' },
  { title:'Metadatos', value:'metadatos' },
  { title:'Plataforma', value:'plataforma' },
  // { title:'Navegador', value:'navegador' },
];//, { title:'Metadatos', value:'metadato' }

const posicionList = [
  'floating_ad',
  'RDTop1',
  'RDTop2',
  'RDTop3',
  'RDRDFloating',
]

watch(posicion, value => {
  if(Array.isArray(value)){
    if (value.length > 1)
      nextTick(() => posicion.value.pop())
  }
})

watch(metadatos, value => {
  if(Array.isArray(value)){
    if (value.length > 5)
      nextTick(() => metadatos.value.pop())
  }
})

onMounted(async()=>{
  loadComponent.value = true;
  await getCampaignToEdit();
  await getMetadatos();
  loadComponent.value = false;
  // await getCampaigns();
})


async function getCampaignToEdit(){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  var response = await fetch(`https://ads-service.vercel.app/campaign/`+ route.params.id+ `/`, requestOptions);
  const data = await response.json();
  const dataCampaignToEdit = data[0];
  console.log('campaña a editar ',dataCampaignToEdit );
  await getCountries();
  
  nombreCampania.value = dataCampaignToEdit.campaignTitle;
  languages.value = dataCampaignToEdit.type;
  criterio.value = dataCampaignToEdit.coleccion.split(',');
  posicion.value = dataCampaignToEdit.position.split(',');

  if(dataCampaignToEdit.criterial.metadato){
    metadatos.value = dataCampaignToEdit.criterial.metadato.split(',');
  }
  
  codigoExternoModel.value = dataCampaignToEdit.urls.html || "";
  linkAds.value = dataCampaignToEdit.urls.url || "#";
  linkImageEscritorio.value = dataCampaignToEdit.urls.img.escritorio || "";
  linkImageMobile.value = dataCampaignToEdit.urls.img.mobile || "";
  selectedItem.value = dataCampaignToEdit.criterial.country;
  // console.log(dataCampaignToEdit.criterial.city.split(',') ,"Ciudad")
  selectItemVisibilidad.value = dataCampaignToEdit.criterial.visibilitySection || "all";
  // console.log(dataCampaignToEdit)
  tamanioUsuarios.value = dataCampaignToEdit.userId.length;

  // alert(tamanioUsuarios.value)

  setTimeout(function(){
      if(dataCampaignToEdit.criterial.city != null && dataCampaignToEdit.criterial.city != -1){
        selectedItemCiudad.value = dataCampaignToEdit.criterial.city.split(',');
      }
  }, 2000);

  // selectedItemCiudad.value = dataCampaignToEdit.criterial.city.split(',');

  setTimeout(function(){
      selectItemParticipantes.value = dataCampaignToEdit.participantes;
      numeroOtroUsuarios.value = dataCampaignToEdit.otroValor;
  }, 2000);
  
  if(dataCampaignToEdit.criterial.dispositivo){
    selectItemDispositivos.value = dataCampaignToEdit.criterial.dispositivo.split(',');
  }

  if(dataCampaignToEdit.criterial.navegador){
    selectItemNavegador.value = dataCampaignToEdit.criterial.navegador.split(',');
  }else{
    // selectItemNavegador.value = [{ title:'Todos', value: '0', avatar:"", navegador: [] }]
  }

  if(dataCampaignToEdit.criterial.so){
    selectItemSO.value = dataCampaignToEdit.criterial.so.split(',');
  }else{
    // selectItemSO.value = [{ title:'Todos', value: '0', avatar:"", navegador: [] }]
  }
  
}

// async function getCampaigns(){
//   var myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");
//   var requestOptions = {
//     method: 'GET',
//     headers: myHeaders,
//     redirect: 'follow'
//   };
//   var response = await fetch(`https://ads-service.vercel.app/campaign/get/all`, requestOptions);
//   const data = await response.json();
//   dataCampaigns.value = data.data;

// }

async function getCountries(){
  
  var myHeaders = new Headers();
  loadingPanel.value=true;
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  var response = await fetch(`https://ads-service.vercel.app/campaign/get/all/paisesyciudad`, requestOptions);
  const data = await response.json();
  
  dataCountry.value = data;
  loadingPanel.value=false;
}

async function getMetadatos(){
  try {
    var metadatosTemp = await fetchCategorias();

    var metadatosList = [];
    var metadatosListItems = [];
    for(var i in metadatosTemp){
      metadatosList.push({ title:metadatosTemp[i].__text, value:metadatosTemp[i].__text });
      metadatosListItems.push(metadatosTemp[i].__text);
    }
    selectMetadatos.value = metadatosList;

    metadatosListItems.slice().sort();

    const arraySinDuplicados = metadatosListItems.filter((valor, indice, arreglo) => arreglo.indexOf(valor) === indice);

    metadatosItems.value = arraySinDuplicados;

  } catch (error) {
      console.error("Error al listar todos los metadatos")
  }
}

async function getUsuarios(){
  var ciudad = -1;
  var pais = -1;
  var criterioTemp = criterio.value;

  var so_temp = null;
  var dispositivo_temp = null;
  var navegador_temp = null;
  var metadato = null;

  if(criterioTemp.includes("metadatos") || criterioTemp.includes("trazabilidads")){
    pais = (selectedItem.value).length > 0 ? selectedItem.value : -1;
    ciudad = (selectedItemCiudad.value).length > 0 ? selectedItemCiudad.value : -1;
  }

  if(criterioTemp.includes("metadatos")){
    metadato = metadatos.value || null;
  }

  if(criterioTemp.includes("dispositivos")){
    dispositivo_temp = selectItemDispositivos.value || null;
  }

  if(criterioTemp.includes("plataforma")){
    so_temp = selectItemSO.value || null;
    navegador_temp = selectItemNavegador.value.join(',') || null;
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };
  // console.log(pais || "-1")
  // alert(pais.length)
  var response = await fetch(`https://ads-service.vercel.app/campaign/get/user/total/${pais}/${ciudad}?${ new URLSearchParams({ 
    so: so_temp, 
    dispositivo: dispositivo_temp,
    metadato: metadato,
    criterio: criterioTemp.join(','),
    navegador: navegador_temp
  }) }`, requestOptions);
  const data = await response.json();
  dataUsuarios.value = data;
}

const consentimiento = ref(false);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[áàâä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôö]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\-]+/g, '-') // Remover caracteres no alfanuméricos ni guiones
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones bajos
    .replace(/\-\-+/g, '-') // Remover múltiples guiones bajos
    .replace(/^-+/, '') // Remover guiones bajos al inicio
    .replace(/-+$/, ''); // Remover guiones bajos al final
}

async function onComplete() {
  var name = nombreCampania.value;
  var tipoContenido = languages.value;
  var cri = criterio.value;
  var po = posicion.value;
  var script = codigoExternoModel.value || "";
  var linksWeb = linkAds.value || "#";
  var urlImagen_1 = linkImageEscritorio.value || "";
  var urlImagen_2 = linkImageMobile.value || "";
  var paises_temp = selectedItem.value;

  var ciudad = -1;
  var pais = -1;

  var so_temp = null;
  var dispositivo_temp = null;
  var metadato_temp = null;
  var navegador_temp = null;


  var ciudades_temp = selectedItemCiudad.value;
  var participantes_temp = selectItemParticipantes.value;
  var otroValor_temp = numeroOtroUsuarios.value;

  var visibilidad = selectItemVisibilidad.value;

  if(cri.includes("metadatos") || cri.includes("trazabilidads")){
    pais = (selectedItem.value).length > 0 ? selectedItem.value : -1;
    ciudad = (selectedItemCiudad.value).length > 0 ? (selectedItemCiudad.value).join(',') : -1;
  }

  if(cri.includes("metadatos")){
    metadato_temp = (metadatos.value).join(',') || null;
  }

  if(cri.includes("dispositivos")){
    so_temp = (selectItemSO.value).join(',') || null;
    dispositivo_temp = (selectItemDispositivos.value).join(',') || null;
    navegador_temp = (selectItemNavegador.value).join(',') || null;
  }

  // var so_temp = selectItemSO.value;
  // var dispositivo_temp = selectItemDispositivos.value;
  // var navegador_temp = selectItemNavegador.value;

  var jsonEnviar = {
        "campaignTitle": name,
        "type": tipoContenido,
        "criterial": {
            "visibilitySection": visibilidad,
            "country": pais,
            "city": ciudad || -1,
            "so": so_temp || null,
            "dispositivo": dispositivo_temp || null,
            "metadato": metadato_temp || null,
            "navegador": navegador_temp || null
        },
        "coleccion": cri.join(','),
        "position": po.join(','),
        "participantes": participantes_temp,
        "otroValor": otroValor_temp,
        "urls": {
            "url": linksWeb,
            "img": {
                "escritorio": urlImagen_1,
                "mobile": urlImagen_2
            },
            "html": script
        },
        "campaignSlug" : slugify(name)
    }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(jsonEnviar),
    redirect: 'follow'
  };
  loadingPanel.value=true;
  
  var response = await fetch(`https://ads-service.vercel.app/campaign/update/`+route.params.id, requestOptions);
  const data = await response.json();
  if(data.resp){
    router.push('/apps/campaigns/list');
  }else{
    alert("Un error se presentó: "+data.error)
  };
  
  loadingPanel.value=false;
}

async function handleValidation(isValid, tabIndex) {
   // alert(isValid+" "+tabIndex+" "+countryList.value.length)
   // console.log(dataCountry.value)
  if(tabIndex == 1 && isValid == true && (dataCountry.value.length < 2 || countryList.value.length < 1)){

    await getCountries();

    var paises = [];
    for(var i in dataCountry.value){
      var ins = dataCountry.value[i];
      paises.push({ title:ins.country, value:ins.country });
    }

    // console.log(paises)
    countryList.value = paises;

  }
  // console.log('Tab: '+tabIndex+ ' valid: '+isValid)
  return false;
}

async function handleValidationChange(prevIndex, nextIndex) {
  // console.log('prevIndex: '+prevIndex+ ' nextIndex: '+nextIndex)
  return false;
}

async function setLoading(value) {
  loadingWizard.value = value
}

async function validateAsync() {
  var nombre = nombreCampania.value;
  var tipoC = languages.value;
  var crit = criterio.value;
  var pos = posicion.value;

  var visibilidad = selectItemVisibilidad.value;

  if(nombre.length < 1 || nombre.trim() == ""){
    alert("Debes añadir un nombre de campaña");
    return false;
  }

  if(tipoC.length < 1){
    alert("Debes añadir un tipo de contenido");
    return false;
  }

  if(crit.length < 1){
    alert("Debes añadir al menos un criterio");
    return false;
  }

  if(pos.length < 1){
    alert("Debes añadir la posicion del ads");
    return false;
  }

  if(visibilidad.length < 1){
    alert("Debes añadir la La visibilidad en el sitio web");
    return false;
  }

  return true;
}

async function validateAsyncInsercion() {
  var nombre = nombreCampania.value;
  var tipoC = languages.value;
  var crit = criterio.value;
  var pos = posicion.value;
  var codigoExterno = codigoExternoModel.value;
  var linkAdsL = linkAds.value;
  var linkImageEscritorioL = linkImageEscritorio.value;
  var linkImageMobileL = linkImageMobile.value;

  if(tipoC != "imagen"){
    if(codigoExterno.length < 1 || codigoExterno == ""){
      alert("Debe ingresar el código");
      return false;
    }
  }else{
    if(linkAdsL.length < 1 || linkAdsL == ""){
      alert("Debe ingresar el link");
      return false;
    }
    if(linkImageEscritorioL.length < 1 || linkImageEscritorioL == ""){
      alert("Debe ingresar el link de la imagen para dispositivos de escritorio");
      return false;
    }
    if(linkImageMobileL.length < 1 || linkImageMobileL == ""){
      alert("Debe ingresar el link de la imagen para dispositivos responsive");
      return false;
    }
  }

  return true;
}

async function validateAsyncCriterio() {
  var nombre = nombreCampania.value;
  var tipoC = languages.value;
  var crit = criterio.value;
  var pos = posicion.value;
  var codigoExterno = codigoExternoModel.value;
  var linkAdsL = linkAds.value;
  var linkImageEscritorioL = linkImageEscritorio.value;
  var linkImageMobileL = linkImageMobile.value;

  if(tipoC != "Local"){
    if(codigoExterno.length < 1 || codigoExterno == ""){
      alert("Debe ingresar el código");
      return false;
    }
  }else{
    if(linkAdsL.length < 1 || linkAdsL == ""){
      alert("Debe ingresar el link");
      return false;
    }
    if(linkImageEscritorioL.length < 1 || linkImageEscritorioL == ""){
      alert("Debe ingresar el link de la imagen para dispositivos de escritorio");
      return false;
    }
    if(linkImageMobileL.length < 1 || linkImageMobileL == ""){
      alert("Debe ingresar el link de la imagen para dispositivos responsive");
      return false;
    }
  }

  return true;
}


const errorMessages = computed(() => numeroRules.map(rule => rule(numeroOtroUsuarios.value)).filter(Boolean));
const hasErrors = computed(() => errorMessages.value.length > 0);

async function validateAsyncUsuarios() {
  var pais = selectedItem.value;
  var ciudad = selectedItemCiudad.value;

  // console.log(ciudad)
  var crit = criterio.value;
  var participantes = selectItemParticipantes.value;
  var numeroOtrosUsuarios = numeroOtroUsuarios.value;
  var dispositivos_temp = selectItemDispositivos.value;
  var metadatos_temp = metadatos.value;
  var selectItemSO_temp = selectItemSO.value;
  var selectItemNavegador_temp = selectItemNavegador.value;
  var selectedItem_temp = selectedItem.value;
  var selectedItemCiudad_temp = selectedItemCiudad.value;

// console.log(dispositivos_temp)

  // if(pais.length < 1 || pais == ""){
  //   alert("Debe ingresar el país");
  //   return false;
  // }

  // if(ciudad.length < 1 || ciudad == ""){
  //   alert("Debes ingresar la ciudad");
  //   return false;
  // }

  if(crit.includes("dispositivos")){
    if(dispositivos_temp.length < 1 || dispositivos_temp == ""){
      alert("Debe seleccionar un dispositivo");
      return false;
    }
  }

  if(crit.includes("metadatos")){
    if(metadatos_temp.length < 1 || metadatos_temp == ""){
      alert("Debe seleccionar al menos 1 metadato");
      return false;
    }
  }

  if(crit.includes("plataforma")){
    if(selectItemSO_temp.length < 1 || selectItemSO_temp == ""){
      alert("Debe seleccionar al menos 1 SO");
      return false;
    }

    if(selectItemNavegador_temp.length < 1 || selectItemNavegador_temp == ""){
      alert("Debe seleccionar al menos 1 Navegador");
      return false;
    }
  }

  if(crit.includes("trazabilidads")){
    if(selectedItem_temp.length < 1 || selectedItem_temp == ""){
      alert("Debe seleccionar al menos 1 país");
      return false;
    }

    if(selectedItemCiudad_temp.length < 1 || selectedItemCiudad_temp == ""){
      alert("Debe seleccionar al menos 1 ciudad");
      return false;
    }

  }

  if(crit.length < 1 || crit == ""){
    alert("Debes ingresar el criterio");
    return false;
  }

  if(participantes.length < 1 || participantes == ""){
    alert("Debes ingresar el número de participantes");
    return false;
  }

  if(participantes == 'Otro'){
    if(numeroOtrosUsuarios < 1 || numeroOtrosUsuarios == ""){
      alert("Debes ingresar el valor correspondiente para el número de participantes");
      return false;
    }

    // if(hasErrors){
    //   return false;
    // }

  }

  if(participantes == ''){
    alert("Debes seleccionar la cantidad de usuarios");
    return false;
  }
  return true;
}

function compareByTitle(a, b) {
  if (a.title === "Todas las ciudes") {
    return -1; // El elemento "Todas las ciudes" se mantiene en el primer lugar
  } else if (b.title === "Todas las ciudes") {
    return 1;
  } else {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  }
}

function groupByTitleWithAttributes(arr) {
  const grouped = {};

  for (const item of arr) {
    const title = item.title;
    if (!grouped[title]) {
      grouped[title] = [];
    }
    grouped[title].push(item.value);
  }

  const result = [];
  for (const title in grouped) {
    if (grouped.hasOwnProperty(title)) {
      result.push({
        title: title,
        value: grouped[title][0]
      });
    }
  }

  return result;
}

watch(() => selectedItem.value, (newValue, oldValue) => {
  // console.log('Nuevo valor seleccionado:', newValue);
  // console.log('Valor anterior:', oldValue);
  if(selectedItem.value != null){

    selectedItemCiudad.value = [];
    selectItemParticipantes.value = [];
    var ciudades = [];
    ciudades.push({ title: "Todas las ciudes", value: "0" });
    for(var i in dataCountry.value){
      var ins = dataCountry.value[i];
      if(ins.country == newValue){
        for(var j in ins.data){
          var ins2 = ins.data[j];
          ciudades.push({ title:ins2.city, value:ins2.city });
        }
      }
    }

    ciudades.sort(compareByTitle);
    // console.log(Object.values(groupByTitle(ciudades)))
    var ciudadesTemp_2 = Object.values(groupByTitleWithAttributes(ciudades));
    var ciudadesSi = [];
    for(var i in ciudadesTemp_2){
      ciudadesSi.push(ciudadesTemp_2[i].title);
    }
    cityList.value = ciudadesSi;

    console.log(cityList.value)
  }else{
    // selectedItemCiudad.value = [];
    cityList.value = [];
    selectItemParticipantes.value = [];
  }
});

function generateRandomIntegers(min, max, count) {
  const randomIntegers = [];

  for (let i = 0; i < count; i++) {
    let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Asegurarse de que el número termine en 0
    if (randomInt % 10 !== 0) {
      randomInt += 10 - (randomInt % 10);
    }

    randomIntegers.push(randomInt);
  }

  return randomIntegers;
}

async function generarOtrosValores(){
  maxValue.value = dataUsuarios.value.total;
  minValue.value = 1;
  if(dataUsuarios.value.total < 100){
    selectItemsList.value = [{ title:'Todos', value: 'Todos' },{ title:'Otro valor', value: 'Otro' }];
  }else{
    var numeros = generateRandomIntegers(100, dataUsuarios.value.total, 3);
    var items = [];
    items.push({ title:'Otro valor', value: 'Otro' });
    if(dataUsuarios.value.total > 110){
      for(var i in numeros){
        items.push({ title:numeros[i], value: numeros[i] });
      }
    }
    items.push({ title:'Todos', value: 'Todos' });
    selectItemsList.value = items;
  }

  return true;
}


watch(async () => selectedItemCiudad.value,async  (newValue, oldValue) => {
  // console.log('Nuevo valor seleccionado:', newValue);
  // console.log('Valor anterior:', oldValue);
  if(!loadComponent.value){
    if(selectedItemCiudad.value != null){
      loadingPanel.value=true;
      await getUsuarios();
      loadingPanel.value=false;
      await generarOtrosValores();
    }else{
      dataUsuarios.value = {};
    }
  }
  

  // selectItemsList.value = [100, 200, 1000, "Otro"];
});

watch(async () => selectItemDispositivos.value,async  (newValue, oldValue) => {
  // console.log('Nuevo valor seleccionado:', newValue);
  // console.log('Valor anterior:', oldValue);
  if(!loadComponent.value){
    if(selectItemDispositivos.value != null){
      loadingPanel.value=true;
      await getUsuarios();
      loadingPanel.value=false;
      await generarOtrosValores();
    }else{
      dataUsuarios.value = {};
    }
  }
  

  // selectItemsList.value = [100, 200, 1000, "Otro"];
});

watch(async () => selectItemSO.value,async  (newValue, oldValue) => {
  // console.log('Nuevo valor seleccionado:', newValue);
  // console.log('Valor anterior:', oldValue);
  if(!loadComponent.value){
    if(selectItemSO.value != null){
      loadingPanel.value=true;
      await getUsuarios();
      loadingPanel.value=false;
      await generarOtrosValores();
    }else{
      dataUsuarios.value = {};
    }
  }
  

  // selectItemsList.value = [100, 200, 1000, "Otro"];
});


watch(async () => selectItemNavegador.value,async  (newValue, oldValue) => {
  // console.log('Nuevo valor seleccionado:', newValue);
  // console.log('Valor anterior:', oldValue);
  if(!loadComponent.value){
    if(selectItemNavegador.value != null){
      loadingPanel.value=true;
      await getUsuarios();
      loadingPanel.value=false;
      await generarOtrosValores();
    }else{
      dataUsuarios.value = {};
    }
  }
  

  // selectItemsList.value = [100, 200, 1000, "Otro"];
});

watch(async () => metadatos.value,async  (newValue, oldValue) => {
  // console.log('Nuevo valor seleccionado:', newValue);
  // console.log('Valor anterior:', oldValue);
  if(!loadComponent.value){
    if(metadatos.value != null){
      loadingPanel.value=true;
      await getUsuarios();
      loadingPanel.value=false;
      await generarOtrosValores();
    }else{
      dataUsuarios.value = {};
    }
  }
  

  // selectItemsList.value = [100, 200, 1000, "Otro"];
});


// watch(async () => criterio.value,async  (newValue, oldValue) => {
//   // console.log('Nuevo valor seleccionado:', newValue);
//   // console.log('Valor anterior:', oldValue);
//   if(!loadComponent.value){
//     if(criterio.value != null){
//       loadingPanel.value=true;
//       await getUsuarios();
//       loadingPanel.value=false;
//       await generarOtrosValores();
//     }else{
//       dataUsuarios.value = {};
//     }
//   }
  

//   // selectItemsList.value = [100, 200, 1000, "Otro"];
// });

</script>

<template>
  <section>
    <VRow>
      <VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="8"
      >
        <VTabs
          v-model="currentTab"
          class="v-tabs-pill d-none"
        >
          <VTab
            value="tab-lista"
            class=" d-none"
          >
            Listado
          </VTab>
          <VTab
            value="tab-agregar"
            class=" d-none"
          >
            Estadísticas
          </VTab>
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-lista">
                <div
                  class="d-flex flex-wrap py-4 gap-4 align-items-center"
                  style="justify-content: space-between;"
                >
                  <div>
                    <VCardTitle>
                      Editar la campaña: {{ nombreCampania }}
                    </VCardTitle>
                    <VCardSubtitle> 
                      Elige la campaña sobre la que necesites información  
                    </VCardSubtitle>
                  </div>
                </div>

                
                <!-- inicio lista de Módulos -->
                  
                <form-wizard 
                  :class="loadingPanel?'disabled':''"
                  @on-complete="onComplete" 
                  @on-loading="setLoading"
                  color="#7367F0" 
                  @on-validate="handleValidation"
                  @on-change="handleValidationChange"
                  validate-on-back="true"
                  nextButtonText="Siguiente"
                  backButtonText="Anterior"
                  finishButtonText="Editar campaña"
                >
                  <tab-content title="Detalles de la campaña" :before-change="validateAsync">
                   
                    <VRow class="pb-5">
                        <VCol cols="12">
                          <VRow no-gutters>
                            <!-- 👉 First Name -->
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="nombreCampania">Nombre de la campaña</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VTextField
                                id="nombreCampania"
                                v-model="nombreCampania"
                                placeholder="Nombre de la campaña"
                                persistent-placeholder
                              />
                            </VCol>
                          </VRow>
                        </VCol>

                        <VCol cols="6">
                          <VRow no-gutters>
                            <!-- 👉 Email -->
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="tipocontenido">Tipo de contenido</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VSelect
                                v-model="languages"
                                :items="languageList"
                                chips
                                clearable
                                label=""
                              />
                            </VCol>
                          </VRow>
                        </VCol>

                        <VCol cols="6">
                          <VRow no-gutters>
                            <!-- 👉 Email -->
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="email">Criterio</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VSelect
                                v-model="criterio"
                                :items="criterioList"
                                multiple
                                chips
                                clearable
                              />
                            </VCol>
                          </VRow>
                        </VCol>
                        <VCol cols="6">
                          <VRow no-gutters>
                            <!-- 👉 Email -->
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="tipocontenido">Visibilidad en la web</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VSelect
                                v-model="selectItemVisibilidad"
                                :items="selectItemsListVisibilidad"
                                chips
                                clearable
                                label=""
                              />
                            </VCol>
                          </VRow>
                        </VCol>
                        <VCol cols="6">
                          <VRow no-gutters>
                            <!-- 👉 Email -->
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="email">Posición</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VCombobox
                                v-model="posicion"
                                multiple
                                chips
                                :items="posicionList"
                                variant="outlined"
                                label=""
                                persistent-hint
                                v-model:search-input="search"
                                hide-selected
                                :hide-no-data="false"
                                hint=""
                              />
                            </VCol>
                          </VRow>
                        </VCol>
                      </VRow>
                  
                  </tab-content>
                  <tab-content title="Inserción de código"  :before-change="validateAsyncInsercion">
                    
                    <VRow class="pb-5">
                      <VCol cols="6">
                          <VRow no-gutters>
                            <!-- 👉 Email -->
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="tipocontenido">Tipo de contenido</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VSelect
                                v-model="languages"
                                :items="languageList"
                                chips
                                clearable
                                label=""
                              />

                            </VCol>
                          </VRow>
                        </VCol>
                        <VCol cols="12">
                          <hr>
                        </VCol>
                        <VCol cols="12" :class="(languages=='imagen'?'d-none':'')">
                          <VRow no-gutters>
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="nombreCampania">Inserte el código</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VTextarea label="Código" v-model="codigoExternoModel" />
                            </VCol>
                          </VRow>
                        </VCol>
                        <VCol cols="12" :class="(languages!='imagen'?'d-none':'')">
                          <VRow no-gutters>
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="nombreCampania">Link del ads</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VTextField
                                id="link"
                                v-model="linkAds"
                                placeholder="Link del ads"
                                persistent-placeholder
                              />
                            </VCol>
                          </VRow>
                        </VCol>
                        <VCol cols="6" :class="(languages!='imagen'?'d-none':'')">
                          <VRow no-gutters>
                            <VCol
                              cols="6"
                              md="12"
                            >
                              <label for="">URL imagen de escritorio</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VTextField
                                id="linkImageEscritorio"
                                v-model="linkImageEscritorio"
                                placeholder="Link imagen de escritorio"
                                persistent-placeholder
                              />
                            </VCol>
                          </VRow>
                        </VCol>
                        <VCol cols="6" :class="(languages!='imagen'?'d-none':'')">
                          <VRow no-gutters>
                            <VCol
                              cols="6"
                              md="12"
                            >
                              <label for="">URL imagen de móvil</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VTextField
                                id="linkImageEscritorio"
                                v-model="linkImageMobile"
                                placeholder="Link imagen de móvil"
                                persistent-placeholder
                              />
                            </VCol>
                          </VRow>
                        </VCol>
                    </VRow>
                  

                  </tab-content>
                  <tab-content title="Criterio de búsqueda"  :before-change="validateAsyncUsuarios">
                      

                      <VRow class="pb-5">
                        <VCol col="6">
                          
                          <VRow class="pb-5">
                            <VCol cols="12" >
                              <VRow no-gutters>
                                <!-- 👉 Email -->
                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <label for="email">Criterio</label>
                                </VCol>

                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <VSelect
                                    v-model="criterio"
                                    :items="criterioList"
                                    multiple
                                    chips
                                    clearable
                                  />
                                </VCol>
                              </VRow>
                            </VCol>
                            <VCol cols="12" :class="criterio.includes('metadatos')?'':'d-none'">
                              <VRow no-gutters >
                                <VCol cols="12">
                                  <VRow no-gutters>
                                    <!-- 👉 Email -->
                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <label for="metadatos">Metadatos</label>
                                    </VCol>

                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                    <VCombobox
                                        v-model="metadatos"
                                        multiple
                                        chips
                                        :items="metadatosItems"
                                        variant="outlined"
                                        label=""
                                        persistent-hint
                                        v-model:search-input="searchMetadatos"
                                        hide-selected
                                        :hide-no-data="false"
                                        hint=""
                                      />

                                    </VCol>
                                  </VRow>
                                </VCol>
                              </VRow>
                            </VCol>
                            <VCol cols="12" :class="criterio.includes('trazabilidads')?'':'d-none'">
                              <VRow no-gutters >
                                <VCol cols="6">
                                  <VRow no-gutters>
                                    <!-- 👉 Email -->
                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <label for="email">Países</label>
                                    </VCol>

                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <VSelect
                                        v-model="selectedItem"
                                        :items="countryList"
                                        class="pr-1"
                                        chips
                                        clearable
                                      />
                                    </VCol>
                                  </VRow>
                                </VCol>
                                <VCol cols="6">
                                  <VRow no-gutters>
                                    <!-- 👉 Email -->
                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <label for="email">Ciudades</label>
                                    </VCol>

                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <VSelect
                                        :items="cityList"
                                        v-model="selectedItemCiudad"
                                        multiple
                                        chips
                                        clearable
                                        class="pl-1"
                                      />
                                    </VCol>
                                  </VRow>
                                </VCol>
                              </VRow>
                            </VCol>
                            
                            <VCol cols="12" :class="criterio.includes('dispositivos')?'':'d-none'">
                              <VRow no-gutters >
                                <VCol cols="12">
                                  <VRow no-gutters>
                                    <!-- 👉 Email -->
                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <label for="email">Dispositivos</label>
                                    </VCol>

                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <VSelect
                                        v-model="selectItemDispositivos"
                                        :items="selectItemsListDispositivos"
                                        item-title="title"
                                        item-value="value"
                                        class="pr-1"
                                        
                                        multiple
                                        clearable
                                      >
                                        <template #selection="{ item }">
                                          <VChip>
                                            <VAvatar>
                                              <VIcon color="" :icon="item.raw.avatar" />
                                            </VAvatar>
                                            <span>{{ item.title }}</span>
                                          </VChip>
                                        </template>
                                      </VSelect>
                                    </VCol>
                                  </VRow>
                                </VCol>
                              </VRow>
                            </VCol>
                            <VCol cols="12" :class="criterio.includes('plataforma')?'':'d-none'">
                              <VRow no-gutters >
                                <VCol cols="6 pt-2">
                                  <VRow no-gutters>
                                    <!-- 👉 Email -->
                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <label for="navegador">Sistema operativo</label>
                                    </VCol>

                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <VSelect
                                        v-model="selectItemSO"
                                        :items="selectItemsListSO"
                                        item-title="title"
                                        item-value="value"
                                        class="pr-1"
                                        
                                        multiple
                                        clearable
                                      >
                                        <template #selection="{ item }">
                                          <VChip>
                                            <VAvatar>
                                              <VIcon color="" :icon="item.raw.avatar" />
                                            </VAvatar>
                                            <span>{{ item.title }}</span>
                                          </VChip>
                                        </template>
                                      </VSelect>
                                    </VCol>
                                  </VRow>
                                </VCol>
                                <VCol cols="6 pt-2">
                                  <VRow no-gutters>
                                    <!-- 👉 Email -->
                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <label for="navegador">Navegador</label>
                                    </VCol>

                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <VSelect
                                        v-model="selectItemNavegador"
                                        :items="selectItemsListNavegador"
                                        item-title="title"
                                        item-value="value"
                                        class="pr-1"
                                        chips
                                        multiple
                                        clearable
                                      />
                                      
                                    </VCol>
                                  </VRow>
                                </VCol>
                              </VRow>
                            </VCol>
                            <VCol cols="12">
                              <VRow no-gutters>
                                <!-- 👉 Email -->
                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <label for="email">Seleccionar participantes</label>
                                </VCol>

                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <VSelect
                                    :items="selectItemsList"
                                    v-model="selectItemParticipantes"
                                    chips
                                    clearable
                                  />
                                </VCol>
                              </VRow>
                            </VCol>

                            <VCol cols="12" :class="selectItemParticipantes!='Otro'?'d-none':''">
                              <VRow no-gutters>
                                <!-- 👉 Email -->
                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <label for="email">Escriba el número</label>
                                </VCol>

                                <VCol
                                  cols="12"
                                  md="12"
                                >
                                  <VTextField
                                    id="numero"
                                    v-model="numeroOtroUsuarios"
                                    placeholder="Escriba el número de participantes"
                                    persistent-placeholder
                                    :rules="numeroRules"
                                    :min="minValue"
                                    :max="maxValue"
                                  />
                                </VCol>
                              </VRow>
                            </VCol>
                          </VRow>

                        </VCol>
                        <VCol col="6">
                          <VCardText class="text-center pt-15">
                            <!-- 👉 Avatar -->
                            <VAvatar
                              rounded
                              :size="120"
                              color="primary"
                              variant="tonal"
                            >
                              
                              <VIcon
                                :size="62"
                                icon="tabler-users"
                              />
                            </VAvatar>

                            <!-- 👉 User fullName -->
                            <h6 class="text-h6 mt-4">
                              Usuarios participantes
                            </h6>

                            <!-- 👉 Role chip -->
                            <VChip
                              label
                              :color="'success'"
                              size="large"
                              class="text-capitalize mt-4"
                            >
                              <!-- {{tamanioUsuarios.value}} -->
                              {{ dataUsuarios.total || tamanioUsuarios }} 
                              
                            </VChip>
                            

                          </VCardText>
                        </VCol>
                      </VRow>
                  
                  </tab-content>

                <div class="loader" v-if="loadingWizard"></div>
                </form-wizard>
                <!-- fin lista usuarios -->
              </VWindowItem>

              

              
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>



<style scoped>  
.v-card.v-theme--dark .iframe-dark {
  display: block;
}

.v-card.v-theme--dark .iframe-light {
  display: none;
}

.v-card.v-theme--light .iframe-dark {
  display: none;
}

.v-card.v-theme--light .iframe-light {
  display: block;
}
/* This is a css loader. It's not related to vue-form-wizard */
.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid #e74c3c;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
