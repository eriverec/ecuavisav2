<script setup>
import { useCategoriasListStore } from "@/views/apps/categorias/useCategoriasListStore";
// import { useRouter } from 'vue-router';
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FormWizard, TabContent } from "vue3-form-wizard";
import 'vue3-form-wizard/dist/style.css';
import UserList from './modal-usuarios.vue';
const router = useRouter();
const route = useRoute();
const currentTab = ref('tab-lista');
const checkbox = ref(false);
const loadingWizard = ref(false);
const loadingPanel = ref(false);
const dataCampaigns = ref([]);
const dataCountry = ref([]);
const loadComponent = ref(true);
// const modelPaises = ref(null);
const cityList = ref([]);
const countryList = ref([]);
// const FormWizard = ref(false);
// const TabContent = ref(false);

const nombreCampania = ref('')
const descripcionCampania = ref('')
const codigoExternoModel = ref('')
const linkAds = ref('')
const linkImageEscritorio = ref('')
const timeoutId = ref(null);
const timeoutSegundos = 3000;
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


const search = ref(null)


const metadatos = ref([]);
const metadatosItems = ref([]);
const searchMetadatos = ref([]);
const searchCiudades = ref([]);
const selectMetadatos = ref(null);
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
  { title:'Lo-ultimo', value: 'Lo-ultimo', avatar:"" },
  { title:'Noticias', value: 'Noticias', avatar:"" },
  { title:'Mundo', value: 'Mundo', avatar:"" },
  { title:'Estadio', value: 'Mundo', avatar:"" },
  { title:'Entretenimiento', value: 'Entretenimiento', avatar:"" },
  { title:'Programas', value: 'Programas', avatar:"" },
  { title:'Tendencias', value: 'Tendencias', avatar:"" },
  { title:'Home', value: 'Home', avatar:"" },
]);

const selectItemDispositivos = ref([]);
const selectItemsListDispositivos = ref([
  // { title:'Todos', value: '0', avatar:"mdi-cellphone-link" },
  { title:'Escritorio', value: 'desktop', avatar:"mdi-laptop-chromebook" },
  { title:'Móvil', value: 'movil', avatar:"mdi-cellphone-android" },
  ]);

const selectItemNavegador = ref([]);
const selectItemsListNavegador = ref([
  // { title:'Todos', value: '0', avatar:"" },
  { title:'Chrome', value: 'Chrome', avatar:"" },
  { title:'Safari', value: 'Safari', avatar:"" },
  { title:'Firefox', value: 'Firefox', avatar:""},
  { title:'Otro', value: 'Otro', avatar:"" } ,
  ]);

const selectItemSO = ref([]);
const selectItemsListSO = ref([
  // { title:'Todos', value: '0', avatar:"", navegador: [] },
  { title:'Windows', value: 'Windows', avatar:"tabler-brand-windows", navegador: [{ title:'Chrome', value: 'Chrome' },{ title:'Firefox', value: 'Firefox' }] },
  { title:'Mac OS', value: 'Mac OS', avatar:"tabler-brand-apple", navegador: [{ title:'Safari', value: 'Safari' },{ title:'Chrome', value: 'Chrome' }] },
  { title:'Android', value: 'Android', avatar:"tabler-brand-android", navegador: [{ title:'Chrome', value: 'Chrome' },{ title:'Firefox', value: 'Firefox' }] },
  { title:'Linux', value: 'Linux', avatar:"mdi-linux", navegador: [{ title:'Chrome', value: 'Chrome' }] } ,
  { title:'Otro', value: 'Otro', avatar:"mdi-account", navegador: [{ title:'Chrome', value: 'Chrome' }] } ,
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
  title:'Código HTML',
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
  'RDTop1',
  'RDTop2',
  'RDTop3',
  'RDFloating',
]

// const showUserModal = ref(false);
const selectedUsers = ref([]);
const participantes = ref('');
const otroValor = ref('');

// const campaignUsers = ref([])  // Para almacenar la lista de usuarios
const usersPerPage = ref(10)   // Users por página

const isFlatSnackRespUserAddAndDelete = ref(false)
const isFlatSnackRespUserDelete = ref(false)
const isLoadingDialogUser = ref(false)


const showUserModal = ref(false)
const campaignUsers = ref([])

// Funciones para el modal
const openModal = () => {
  console.log('Abriendo modal')
  showUserModal.value = true
}

const closeModal = () => {
  showUserModal.value = false
}


watch(posicion, value => {
  if (value.length > 1)
    nextTick(() => posicion.value.pop())
})

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});


watch(metadatos, value => {
  if (value.length > 5)
    nextTick(() => metadatos.value.pop())
})


// onMounted(getMetadatos)
onMounted(async()=>{
  try {
    loadComponent.value = true;
    console.log("Iniciando carga de campaña...");
    
    const promises = [
      getCountries(),
      getCampaignToEdit(),
      getMetadatos()
    ];

    await Promise.all(promises);
    
    console.log("Carga completa");
  } catch (error) {
    console.error("Error en mounted:", error);
  } finally {
    loadComponent.value = false;
  }
})
async function getCampaignToEdit() {
  try {
    loadingPanel.value = true;
    
    const response = await fetch(`https://ads-service.vercel.app/campaign/get/edit/${route.params.id}/`, {
      headers: { "Content-Type": "application/json" }
    });
    
    if (!response.ok) throw new Error('Error al obtener datos de la campaña');
    
    const data = await response.json();
    if (!data || data.length === 0) {
      throw new Error('No se recibieron datos de la campaña');
    }

    const campania = data[0];
    
    // Asignaciones básicas
    nombreCampania.value = campania.campaignTitle || '';
    descripcionCampania.value = campania.description || '';
    languages.value = campania.type || '';
    criterio.value = campania.coleccion ? campania.coleccion.split(',') : [];
    posicion.value = campania.position ? campania.position.split(',') : [];
    
    // Asignar participantes y otroValor
    participantes.value = campania.participantes || '';
    otroValor.value = campania.otroValor || '';
    
    if(campania.criterial) {
      selectItemVisibilidad.value = campania.criterial.visibilitySection || "all";
      metadatos.value = campania.criterial.metadato ? campania.criterial.metadato.split(',') : [];
    }

    
    // Cargar URLs
    if(campania.urls) {
      codigoExternoModel.value = campania.urls.html || "";
      linkAds.value = campania.urls.url || "#";
      linkImageEscritorio.value = campania.urls.img?.escritorio || "";
      linkImageMobile.value = campania.urls.img?.mobile || "";
    }

    // Cargar datos de ubicación y participantes en paralelo
    await Promise.all([
      cargarDatosUbicacion(campania),
      cargarDatosParticipantes(campania)
    ]);
    
  // Cargar usuarios si es necesario
  if (campania.participantes === 'Usuarios específicos') {
      const usersResponse = await fetch(`https://ads-service.vercel.app/campaign/${route.params.id}/user`);
      const usersData = await usersResponse.json();
      if (usersData && usersData[0]) {
        campaignUsers.value = usersData[0].userId || [];
      }
    }

  } catch (error) {
    console.error("Error al obtener la campaña:", error);
  }
}

async function cargarDatosUbicacion(campania) {
  if(campania.criterial?.country) {
    selectedItem.value = campania.criterial.country;
    if(campania.criterial.city) {
      selectedItemCiudad.value = campania.criterial.city === -1 ? 
        campania.criterial.city : 
        campania.criterial.city.split(',');
    }
  }
}

async function cargarDatosParticipantes(campania) {
  selectItemParticipantes.value = campania.participantes || null;
  numeroOtroUsuarios.value = campania.otroValor || '';

  if(campania.criterial?.dispositivo) {
    selectItemDispositivos.value = campania.criterial.dispositivo.split(',');
  }

  if(campania.criterial?.navegador) {
    selectItemNavegador.value = campania.criterial.navegador.split(',');
  }

  if(campania.criterial?.so) {
    selectItemSO.value = campania.criterial.so.split(',');
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
  var response = await fetch(`https://ecuavisa-suscripciones.vercel.app/otros/obtener-paises-ciudades`, requestOptions);
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

const fetchWithTimeout = (url, options, timeout = 10000) => {
    return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
    ]);
};

async function getUsuarios(){
  try {
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
      ciudad = (ciudad=="Todas las ciudes"?-1:ciudad);
    }

    if(criterioTemp.includes("metadatos")){
      metadato = metadatos.value || null;
    }

    if(criterioTemp.includes("dispositivos")){
      dispositivo_temp = selectItemDispositivos.value || null;
    }

    if(criterioTemp.includes("plataforma")){
      so_temp = selectItemSO.value || null;
      navegador_temp = selectItemNavegador.value || null;
    }
    
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      var raw = JSON.stringify({
        "metadato": metadato,
        "criterio": criterioTemp,
        "pais": pais,
        "ciudad": ciudad,
        "navegador": navegador_temp,
        "os": so_temp,
        "dispositivo": dispositivo_temp
      });

      var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
      };

      //console.log('data enviar ',raw);    
      const send = await fetch('https://ads-service.vercel.app/campaign/v2/usuarios/get/user/total', requestOptions);
      const respuesta = await send.json();    
      //console.log('resp',respuesta);    
      dataUsuarios.value = respuesta;
      //console.log('data total',dataUsuarios.value);
    
      
    /*  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    // console.log(pais || "-1")
    // alert(pais.length)
    // var response = await fetch(`https://ads-service.vercel.app/campaign/get/user/total/${pais}/${ciudad}?${ new URLSearchParams({ 
    //   so: so_temp, 
    //   dispositivo: dispositivo_temp,
    //   metadato: metadato,
    //   criterio: criterioTemp.join(','),
    //   navegador: navegador_temp
    // }) }`, requestOptions);
    // const data = await response.json();
    // dataUsuarios.value = data;

    const response = await fetchWithTimeout(`https://ads-service.vercel.app/campaign/get/user/total/${pais}/${ciudad}?${ new URLSearchParams({ 
        so: so_temp, 
        dispositivo: dispositivo_temp,
        metadato: metadato,
        criterio: criterioTemp.join(','),
        navegador: navegador_temp
    }) }`, requestOptions, 25000); // Aquí hemos establecido un tiempo de espera de 15 segundos (15000 milisegundos)

    if (response.status === 200) {
        const data = await response.json();
        dataUsuarios.value = data;
    } else {
        console.error("Error en la solicitud:", response.status);
        // Puedes manejar el error de acuerdo a tus necesidades
    }
    */
    
  } catch (error) {
      console.error(error);
      return false;
  }
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
  try {
    var name = nombreCampania.value;
    var description = descripcionCampania.value;
    var tipoContenido = languages.value;
    var cri = criterio.value;
    var po = posicion.value;
    
    console.log("Valores antes de enviar:", {
      name,
      description,
      posicion: po
    });

    var jsonEnviar = {
      "campaignTitle": name,
      "description": description,
      "type": tipoContenido,
      "criterial": {
        "visibilitySection": selectItemVisibilidad.value,
        "country": (selectedItem.value).length > 0 ? selectedItem.value : -1,
        "city": (selectedItemCiudad.value).length > 0 ? (selectedItemCiudad.value).join(',') : -1,
        "so": (selectItemSO.value)?.join(',') || null,
        "dispositivo": (selectItemDispositivos.value)?.join(',') || null,
        "metadato": (metadatos.value)?.join(',') || null,
        "navegador": (selectItemNavegador.value)?.join(',') || null
      },
      "coleccion": cri.join(','),
      "position": Array.isArray(po) ? po.join(",") : po, // Validamos si es array
      "participantes": selectItemParticipantes.value,
      "otroValor": numeroOtroUsuarios.value,
      "userId": selectedUsers.value, // Agregar el array de usuarios seleccionado
      "urls": {
        "url": linkAds.value || "#",
        "img": {
          "escritorio": linkImageEscritorio.value || "",
          "mobile": linkImageMobile.value || ""
        },
        "html": codigoExternoModel.value || ""
      },
      "campaignSlug": slugify(name),
      "statusCampaign": true
    };

    console.log("JSON a enviar:", jsonEnviar);

    loadingPanel.value = true;
    loadComponent.value = true;

    const response = await fetch(`https://ads-service.vercel.app/campaign/update/${route.params.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(jsonEnviar)
    });

    const data = await response.json();
    console.log("Respuesta del servidor:", data);

    if(data.resp){
      snackbar.value = {
        show: true,
        text: 'Campaña editada exitosamente',
        color: 'success'
      };

      setTimeout(() => {
        router.push('/apps/campaigns/list');
      }, 1500);
    } else {
      snackbar.value = {
        show: true,
        text: `Error: ${data.error || 'No se pudo actualizar la campaña'}`,
        color: 'error'
      };
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
    snackbar.value = {
      show: true,
      text: 'Ocurrió un error al actualizar la campaña',
      color: 'error'
    };
  } finally {
    loadingPanel.value = false;
    loadComponent.value = false;
  }
}

async function handleValidation(isValid, tabIndex) {
  if(tabIndex == 1 && isValid == true){
    await getCountries();

    var paises = [];
    for(var i in dataCountry.value){
      var ins = dataCountry.value[i];
      // paises.push({ title:ins.country, value:ins.country });
      paises.push(ins.country);
    }

    countryList.value = paises;

  }
  // console.log('Tab: '+tabIndex+ ' valid: '+isValid)
  return false;
}

async function handleValidationChange(prevIndex, nextIndex) {
  // console.log('prevIndex: '+prevIndex+ ' nextIndex: '+nextIndex)
  return false;
}


// Añadir estas referencias
const isDialogSearchUser = ref(false)

// Añade estas definiciones al inicio del script junto con los otros refs
const labelError = ref({
  mensaje: "",
  visible: false
});

const dataUsers = ref([]);

const handleAddUser = async () => {
    
  isDialogSearchUser.value = true
  isLoadingDialogUser.value = true
  
  try {
    const response = await fetch('https://ads-service.vercel.app/busqueda/user/')
    const data = await response.json()
    
    if (data.resp) {
      dataUsers.value = data.data
      labelError.value.visible = false
    } else {
      labelError.value.mensaje = data.error
      labelError.value.visible = true
    }
  } catch (error) {
    console.log('Error al cargar usuarios:', error)
    labelError.value.mensaje = 'Error al cargar usuarios'
    labelError.value.visible = true
  } finally {
    isLoadingDialogUser.value = false
  }
}

// Función para resolver la selección de un usuario
const resolveUsuario = async (usuario) => {
  try {
    isLoadingDialogUser.value = true
    const response = await fetch(`https://ads-service.vercel.app/campaign/add-user/${route.params.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: usuario.wylexId
      })
    })

    const data = await response.json()
    if (data.resp) {
      isFlatSnackRespUserAddAndDelete.value = true
      await getCampaignToEdit() // Recargar los datos
      isDialogSearchUser.value = false
    }
  } catch (error) {
    console.error('Error al añadir usuario:', error)
  } finally {
    isLoadingDialogUser.value = false
  }
}

// Función para filtrar usuarios en la búsqueda
const handleInput = (event) => {
  clearTimeout(timeoutId.value)
  timeoutId.value = setTimeout(async () => {
    try {
      isLoadingDialogUser.value = true
      const response = await fetch(`https://ads-service.vercel.app/busqueda/user/?s=${encodeURIComponent(event.target.value)}`)
      const data = await response.json()
      
      if (data.resp) {
        dataUsers.value = data.data
        labelError.value.visible = false
      } else {
        labelError.value.mensaje = data.error
        labelError.value.visible = true
      }
    } catch (error) {
      console.error('Error al buscar usuarios:', error)
    } finally {
      isLoadingDialogUser.value = false
    }
  }, 1000)
}

const handleDeleteUser = async (userId) => {
  try {
    loadingPanel.value = true
    const response = await fetch(`https://ads-service.vercel.app/campaign/delete-user/${route.params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId })
    })

    const data = await response.json()
    if (data.resp) {
      isFlatSnackRespUserDelete.value = true
      // Recargar los datos
      await getCampaignToEdit()
    }
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
  } finally {
    loadingPanel.value = false
  }
}

const handleExportUsers = () => {
  // Implementar la función de exportar
  const csvContent = "data:text/csv;charset=utf-8,"
    + [
        ["id", "firstname", "last_name", "email"].join(","),
        ...campaignUsers.value.map(user => 
          [user.wylexId, user.firstname, user.last_name, user.email].join(",")
        )
    ].join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", "usuarios.csv")
  document.body.appendChild(link)
  link.click()
}

async function setLoading(value) {
  loadingWizard.value = value
}

async function validateAsync() {
  var nombre = nombreCampania.value;
  var descripcion = descripcionCampania.value;
  var tipoC = languages.value;
  var pos = posicion.value;
  var visibilidad = selectItemVisibilidad.value;

  if(nombre.length < 1 || nombre.trim() == ""){
    alert("Debes añadir un nombre de campaña");
    return false;
  }

  if(descripcion.length < 1 || descripcion.trim() == ""){
    alert("Debes añadir una descripción de campaña");
    return false;
  }

  if(tipoC.length < 1){
    alert("Debes añadir un tipo de contenido");
    return false;
  }

  if(!pos){ // Cambiar la validación de posición
    alert("Debes añadir la posición del ads");
    return false;
  }

  if(visibilidad.length < 1){
    alert("Debes añadir la visibilidad en el sitio web");
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
  // alert(selectedItem.value)
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
  if(cityList.value.length > 1){
    if(selectedItemCiudad.value != null){
      loadingPanel.value=true;

      // console.log(1)

      clearTimeout(timeoutId.value);
      timeoutId.value = setTimeout(async () => {
        const resp = await getUsuarios();
        loadingPanel.value = false;
      }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada

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
  if(selectItemDispositivos.value != null){
    loadingPanel.value=true;
    
    // console.log(2)
    clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(async () => {
      await getUsuarios();
      loadingPanel.value=false;
    }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada

    await generarOtrosValores();
  }else{
    dataUsuarios.value = {};
  }

  // selectItemsList.value = [100, 200, 1000, "Otro"];
});

watch(async () => selectItemSO.value,async  (newValue, oldValue) => {
  // console.log('Nuevo valor seleccionado:', newValue);
  // console.log('Valor anterior:', oldValue);
  loadingPanel.value=true;
  
  // console.log(3)
  clearTimeout(timeoutId.value);
  timeoutId.value = setTimeout(async () => {
    await getUsuarios();
    loadingPanel.value=false;
  }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada

  await generarOtrosValores();

  // selectItemsList.value = [100, 200, 1000, "Otro"];
});


watch(async () => selectItemNavegador.value,async  (newValue, oldValue) => {
  // console.log('Nuevo valor seleccionado:', newValue);
  // console.log('Valor anterior:', oldValue);
  if(selectItemNavegador.value != null){
    loadingPanel.value=true;
    
    // console.log(4)
    clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(async () => {
      await getUsuarios();
      loadingPanel.value=false;
    }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada

    await generarOtrosValores();
  }else{
    dataUsuarios.value = {};
  }

  // selectItemsList.value = [100, 200, 1000, "Otro"];
});



watch(async () => metadatos.value,async  (newValue, oldValue) => {
  // console.log('Nuevo valor seleccionado:', newValue);
  // console.log('Valor anterior:', oldValue);
  if(metadatos.value != null){
    loadingPanel.value=true;
    
    // console.log(5)
    clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(async () => {
      await getUsuarios();
      loadingPanel.value=false;
    }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada

    await generarOtrosValores();
  }else{
    dataUsuarios.value = {};
  }

  // selectItemsList.value = [100, 200, 1000, "Otro"];
});

// watch(async () => criterio.value, async  (newValue, oldValue) => {
//   // console.log('Nuevo valor seleccionado:', newValue);
//   // console.log('Valor anterior:', oldValue);
//   if(criterio.value != null){
//     loadingPanel.value=true;
//     await getUsuarios();
//     loadingPanel.value=false;
//     await generarOtrosValores();
//   }else{
//     dataUsuarios.value = {};
//   }

//   // selectItemsList.value = [100, 200, 1000, "Otro"];
// });

</script>

<template>
  <section>
  <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2000"
      location="top"
      position="right"
    >
      {{ snackbar.text }}
    </VSnackbar>
    <VOverlay
      :model-value="loadingPanel"
      class="align-center justify-center"
    >
      <VProgressCircular
        indeterminate
        color="primary"
      />
    </VOverlay>
    <VRow>
      <VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="7"
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
          <VCardText class="px-0">
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-lista">
                <div
                  class="d-flex flex-wrap py-4 gap-4 align-items-center"
                  style="justify-content: space-between;"
                >
                  <div class="px-5">
                    <VCardTitle>
                      Edita campaña: {{ nombreCampania }}
                    </VCardTitle>
                    <VCardSubtitle> 
                      Edita datos sobre la campaña seleccionada
                    </VCardSubtitle>
                  </div>
                </div>

                
                <!-- inicio lista de Módulos -->
                  
                <form-wizard 
                  :class="loadComponent?'disabled':''"
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
                  <tab-content title="Detalles de la campaña" class="px-4" :before-change="validateAsync">
                   
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

                        

                        <VCol cols="12">
                          <VRow no-gutters>
                            <VCol cols="12" md="12">
                              <label for="descripcionCampania">Descripción de la campaña</label>
                            </VCol>
                            <VCol cols="12" md="12">
                              <VTextarea
                                  id="descripcionCampania"
                                  v-model="descripcionCampania"
                                  placeholder="Ingrese una descripción para la campaña"
                                  persistent-placeholder
                                  rows="3"
                                  :loading="loadComponent"
                                />
                            </VCol>
                          </VRow>
                        </VCol>

                        <VCol cols="6">
                          <VRow no-gutters>
                        
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
                              <label for="email">Criterio de búsqueda</label>
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
                            <VCol cols="12" md="12">
                              <label for="email">Posición</label>
                            </VCol>
                            <VCol cols="12" md="12">
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
                  <tab-content title="Inserción de código" class="px-4" :before-change="validateAsyncInsercion">
                    
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
                  <tab-content title="Criterio de búsqueda"  class="px-4" :before-change="validateAsyncUsuarios">
                      

                      <VRow class="pb-5">
                        <VCol col="6">
                          
                          <VRow class="pb-5">
                            <VCol cols="12" >
                              <VRow no-gutters>
                             
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

                                      <VCombobox
                                        v-model="selectedItem"
                                        :items="countryList"
                                        class="pr-1"
                                        chips
                                        clearable
                                        :menu-props="{ maxHeight: '300' }"
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

                                      <VCombobox
                                        v-model="selectedItemCiudad"
                                        multiple
                                        chips
                                        :items="cityList"
                                        v-model:search-input="searchCiudades"
                                        :hide-no-data="false"
                                        :menu-props="{ maxHeight: '300' }"
                                        class="custom-combobox-ciudad"
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
                          

                          </VRow>

                        </VCol>
                        <VCol col="6">
          <VCardText class="d-flex align-center gap-4">
            <div>
              <div class="d-flex align-center mb-2">
                <VIcon
                  class="me-2"
                  size="24"
                  icon="tabler-users"
                  color="primary"
                />
                <span class="text-h6 text-medium-emphasis">
                  Usuarios participantes
                </span>
              </div>

              <div class="d-flex align-center gap-4">
                <div class="text-h6 font-weight-medium text-success fondo-boton">
                  <span v-if="!loadingPanel">
                    {{ participantes === 'Usuarios específicos' 
                      ? otroValor || "0"
                      : dataUsuarios.total || "0" }}
                  </span>
                  <span v-if="loadingPanel">...</span>
                </div>

                <VBtn
                        v-if="participantes === 'Usuarios específicos'"
                        size="small"
                        variant="tonal"
                        color="secondary"
                        @click="openModal"
                        :disabled="loadingPanel"
                      >
                    Editar usuarios
                  </VBtn>
              </div>
            </div>
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

  <!-- modal para editar users -->

  <!-- Mantener el modal principal -->
<VDialog
  v-model="showUserModal"
  max-width="900px"
  persistent
>
  <VCard>
    <VCardText>
      <UserList
        :users="campaignUsers"
        :campaign-title="nombreCampania"
        :users-per-page="10"
        @delete-user="handleDeleteUser"
        @add-user="handleAddUser"
        @export="handleExportUsers"
      />
    </VCardText>
    <VCardActions>
      <VSpacer />
      <VBtn
        color="secondary"
        variant="tonal"
        @click="closeModal"
      >
        Cerrar
      </VBtn>
    </VCardActions>
  </VCard>
</VDialog>

<!-- Agregar el diálogo de búsqueda justo después -->
<VDialog
  v-model="isDialogSearchUser"
  persistent
  class="v-dialog-lg"
>
  <DialogCloseBtn @click="isDialogSearchUser = false" />
  <VCard title="Lista de usuarios">
    <VCardSubtitle class="pl-6 mb-3">
      Solo se obtendrá los 20 primeros registros de acuerdo a la búsqueda.
    </VCardSubtitle>
    <VCardText>
      <VTextField 
        :disabled="isLoadingDialogUser" 
        append-inner-icon="tabler-user-search" 
        type="text"  
        @input="handleInput" 
        label="Buscar por correo, teléfono o nombre" 
        placeholder="Buscar usuarios" 
      />
      <VChip color="error" v-if="labelError.visible" class="mt-2">
        Error: {{labelError.mensaje}}
      </VChip>
      <br>
      <VTable class="text-no-wrap tableNavegacion mb-5" hover>
        <thead>
          <tr>
            <th scope="col">Usuario</th>
            <th scope="col">Correo</th>
            <th scope="col">Agregar</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-if="dataUsers.length > 0"
            v-for="item in filteredDataUsers" 
            :key="item.userId"
          >
            <td>
              {{ (item.last_name+' '+item.first_name).length > 25 ? 
                  (item.last_name+' '+item.first_name).substring(0, 25) + "..." : 
                  (item.last_name+' '+item.first_name) }}
            </td>
            <td class="text-medium-emphasis">
              {{ item.email }}
            </td>
            <td class="text-medium-emphasis">
              <VBtn 
                :disabled="isLoadingDialogUser" 
                class="mt-4" 
                color="success" 
                @click="resolveUsuario(item)" 
                icon="mdi-plus-circle-outline" 
                variant="text"
              />
            </td>
          </tr>
          <tr v-else>
            <td colspan="3">No hay datos</td>
          </tr>
        </tbody>
      </VTable>
    </VCardText>
  </VCard>
</VDialog>
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

.v-menu .v-select__slot {
  max-height: 10px; /* Ajusta el valor según tus necesidades */
  overflow-y: auto;
}

.fondo-boton {
  background-color: #d4edda; 
  padding: 8px 16px;
  border-radius: 5px;
  line-height: 24px;
}

</style>
