<script setup>
  import { useCategoriasListStore } from "@/views/apps/categorias/useCategoriasListStore";
import { parseISO } from 'date-fns';
import debounce from 'lodash/debounce';
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import esLocale from "moment/locale/es";
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import 'vue3-form-wizard/dist/style.css';
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);
moment.tz.setDefault('America/Guayaquil');

  const userModalOpen = ref(false)

  const router = useRouter();
  const route = useRoute();
  // const currentTab = ref('tab-lista');
  // const checkbox = ref(false);
  const loadingWizard = ref(false);
  const loadingPanel = ref(false);
  const loadingPanelDialog = ref(false);
  const textLoadingPanelDialog = ref("Procesando..");
  // const dataCampaigns = ref([]);
  const dataCountry = ref([]);
  const cityList = ref([]);
  const countryList = ref([]);

  const modoPersonalizado = ref(false);

  const timeoutId = ref(null);
  const timeoutSegundos = 3000;

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

  //CAMPOS VISIBILIDAD EN WEB
  const selectedVisibilityOptions = ref([]);
  const specificUrl = ref('');
  const showSectionOptions = ref(false);
  const otherSectionUrl = ref('');


  // Función para manejar el cambio de sección
  const handleSectionChange = (value) => {

    showSectionOptions.value = value && !['all', 'other', 'Home'].includes(value);
    
    // Resetear valores cuando se cambia la sección
    selectedVisibilityOptions.value = [];
    specificUrl.value = '';
    if (value !== 'other') {
      otherSectionUrl.value = '';
    }
  };
    

  // Función para manejar el cambio en la opción de URL específica
  const handleUrlOptionChange = (checked) => {
    if (checked) {
      // Si se selecciona opcion URL, deseleccionaa las demás
      selectedVisibilityOptions.value = ['enabled'];
    } else {
      // Si se deselecciona opcion URL
      selectedVisibilityOptions.value = selectedVisibilityOptions.value.filter(option => option !== 'enabled');
      specificUrl.value = '';
    }
  };

  //FIN CAMPOS

  const descripcionCampania = ref('');

  const selectItemVisibilidad = ref([]);
  // const selectItemsListVisibilidad = ref([
  //   { title:'Todo el sitio', value: 'all', avatar:"" },
  //   { title:'Lo-ultimo', value: 'Lo-ultimo', avatar:"" },
  //   { title:'Noticias', value: 'Noticias', avatar:"" },
  //   { title:'Mundo', value: 'Mundo', avatar:"" },
  //   { title:'Estadio', value: 'Mundo', avatar:"" },
  //   { title:'Entretenimiento', value: 'Entretenimiento', avatar:"" },
  //   { title:'Programas', value: 'Programas', avatar:"" },
  //   { title:'Tendencias', value: 'Tendencias', avatar:"" },
  //   { title:'Home', value: 'Home', avatar:"" },
  // ]);

  const selectItemsListVisibilidad = ref([
    { title: 'Todo el sitio', value: 'all', avatar: '' },
    { title: 'Lo-ultimo', value: 'Lo-ultimo', avatar: '' },
    { title: 'Noticias', value: 'Noticias', avatar: '' },
    { title: 'Mundo', value: 'Mundo', avatar: '' },
    { title: 'Estadio', value: 'Estadio', avatar: '' },
    { title: 'Entretenimiento', value: 'Entretenimiento', avatar: '' },
    { title: 'Programas', value: 'Programas', avatar: '' },
    { title: 'Tendencias', value: 'Tendencias', avatar: '' },
    { title: 'La Noticia a Fondo', value: 'la-noticia-a-fondo', avatar: '' },
    { title: 'Home', value: 'Home', avatar: '' },
    { title: 'Otro', value: 'other', avatar: '' },
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

  ];

  const posicionList = [
    'RDTop1',
    'RDTop2',
    'RDTop3',
    'RDFloating',
  ]

  watch(posicion, value => {
    if (value.length > 1)
      nextTick(() => posicion.value.pop())
  })

  watch(metadatos, value => {
    if (value.length > 5)
      nextTick(() => metadatos.value.pop())
  })

  onMounted(async () => {
    await getCountries();
    await getMetadatos();
  });

  async function getCountries() {
    try {
      loadingPanel.value = true;
      const response = await fetch('https://ecuavisa-suscripciones.vercel.app/otros/obtener-paises-ciudades', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Error al obtener países');
      }

      const data = await response.json();
      dataCountry.value = data;
      
      // Procesar países para el select
      const paises = data.map(item => item.country);
      countryList.value = paises;
      
      console.log('Países cargados:', countryList.value);
    } catch (error) {
      console.error('Error al cargar países:', error);
      alert('Error al cargar la lista de países');
    } finally {
      loadingPanel.value = false;
    }
  }

  function handleAddUser() {
    searchQuery.value = '' // Limpiar búsqueda anterior
    searchResults.value = [] // Limpiar resultados anteriores
    userModalOpen.value = true
  }

  // Función para verificar si un usuario ya está agregado
  function isUserAdded(user) {
    return filteredUsers.value.some(u => u.wylexId === user.wylexId);
  }

  // Función para descargar el CSV de ejemplo
  function downloadExample() {
    const csvContent = `id,firstname,last_name,email
  107407,monica del rocio,torres guallpa,torresguallpa.1234@gmail.com
  100931,Amanda,Alvarado,electroautosgye@gmail.com
  76804,Sergio,Chacon,juvenalchacon72@gmail.com`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ejemplo_usuarios.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
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
    // loadingPanel.value=false;
    // dataUsuarios.value = 0;
    // return null;
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
      ciudad = (ciudad=="Todas las ciudades"?-1:ciudad);
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
      dataUsuarios.value =respuesta;
      console.log('data total',dataUsuarios.value);
      loadingPanel.value=false;
    
  }

  // actualizar numero de usuarios
  const formattedUserCount = computed(() => {
    const total = dataUsuarios.value?.total || 0
    return new Intl.NumberFormat('es-ES').format(total)
  })


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

  function validarFormulario() {
    try{
      if (!nombreCampania.value) {
        alert("El nombre de la campaña es obligatorio");
        return false;
      }
      
      if (!descripcionCampania.value) {
        alert("La descripción de la campaña es obligatoria");
        return false;
      }

      if (!languages.value) {
        alert("El tipo de contenido es obligatorio");
        return false;
      }

      if (!posicion.value?.length) {
        alert("Debe seleccionar al menos una posición");
        return false;
      }

      if (!criterio.value?.length) {
        // alert("Debe seleccionar al menos un criterio");
        return true;
      }

      if(modoPersonalizado.value && userIds.value.length < 1){
        alert("No hay usuarios que guardar, suba un archivo");
        return false;
      }

      return true;
    }catch(error){
      console.error(error);
      return null;
    }
  }

  function dividirEnLotes(array, batchSize) {
    const lotes = [];
    for (let i = 0; i < array.length; i += batchSize) {
      const lote = array.slice(i, i + batchSize);
      lotes.push(lote);
    }
    return lotes;
  }

  async function createCampaign(jsonEnviar){
    try {
      const response = await fetch('https://ads-service.vercel.app/campaign/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonEnviar)
      });

      if(!response.ok){
        return null;
      }

      const data = await response.json();
      return data;

    } catch (error) {
      console.error("Error al crear la campaña:", error);
      return null;
      // snackbar.value = {
      //   show: true,
      //   text: "Error al crear la campaña",
      //   color: 'error'
      // };
    }
  }

  //RANGO FECHAS

  const fechaInicio = ref(Moment().startOf('month').format('YYYY-MM-DD'))
  const fechaFin = ref(Moment().format('YYYY-MM-DD'))

  const fechaIFModel = ref([parseISO(fechaInicio.value), parseISO(fechaFin.value)])

  // Para el rango de fechas
  const dateRange = ref({
    start: fechaInicio.value,
    end: fechaFin.value
  })

  // Para manejar el cambio de fechas
  const handleDateRangeChange = (dates) => {
    if (dates && dates.length === 2) {
      dateRange.value = {
        start: Moment(dates[0]).format('YYYY-MM-DD'),
        end: Moment(dates[1]).format('YYYY-MM-DD')
      }
    }
  }

  //FIN RANGO FECHAS

  async function onComplete() {

    if (!validarFormulario()) {
      return;
    }
    try{
      loadingPanelDialog.value = true;
      textLoadingPanelDialog.value = `Procesando..`;

      let visibilitySection;

      if (selectItemVisibilidad.value === 'other') {
        visibilitySection = {
          name: 'other',
          params: {},
          specificUrl: {
            enabled: true,
            url: otherSectionUrl.value
          }
        };
      } else if (selectItemVisibilidad.value === 'Home') {
        visibilitySection = {
          name: 'Home',
          params: {},
          specificUrl: {
            enabled: true,
            url: 'https://www.ecuavisa.com'  // URL predefinida para Home
          }
        };
      } else if (selectItemVisibilidad.value === 'all') {
        visibilitySection = 'all';
      } else {
        visibilitySection = {
          name: selectItemVisibilidad.value,
          params: {
            landing: selectedVisibilityOptions.value.includes('landing'),
            root: selectedVisibilityOptions.value.includes('root'),
            subsection: selectedVisibilityOptions.value.includes('subsection'),
            all: selectedVisibilityOptions.value.includes('all')
          },
          specificUrl: {
            enabled: selectedVisibilityOptions.value.includes('enabled'),
            url: selectedVisibilityOptions.value.includes('enabled') ? specificUrl.value : ''
          }
        };
      }

      const jsonEnviar = {
        "campaignTitle": nombreCampania.value,
        "description": descripcionCampania.value,
        "fechai": dateRange.value.start, 
        "fechaf": dateRange.value.end,   
        "type": languages.value,
        "criterial": {
          "visibilitySection": visibilitySection,
          "country": selectedItem.value || -1,
          "city": selectedItemCiudad.value?.includes('Todas las ciudades') ? 
            -1 : 
            selectedItemCiudad.value?.length > 0 ? selectedItemCiudad.value.join(',') : -1,
          "so": selectItemSO.value?.length > 0 ? selectItemSO.value.join(',') : null,
          "dispositivo": selectItemDispositivos.value?.length > 0 ? selectItemDispositivos.value.join(',') : null,
          "metadato": metadatos.value?.length > 0 ? metadatos.value.join(',') : null,
          "navegador": selectItemNavegador.value?.length > 0 ? selectItemNavegador.value.join(',') : null
        },
        "coleccion": criterio.value.join(','),
        "position": posicion.value.join(","),
        "participantes": modoPersonalizado.value ? "personalizado" : "filtrado",
        "otroValor": dataUsuarios.value?.total || 0,
        // "userId": modoPersonalizado.value ? 
        //   (filteredUsers.value?.map(user => user.wylexId) || []) : 
        //   (dataUsuarios.value?.userIds || []),
        "userId": modoPersonalizado.value ? userIds.value : (dataUsuarios.value?.userIds || []),
        "userIdRemove": [],
        "userIdAdd": [],
        "statusCampaign": true,
        "urls": {
          "url": linkAds.value || "#",
          "img": {
            "escritorio": linkImageEscritorio.value || "",
            "mobile": linkImageMobile.value || ""
          },
          "html": codigoExternoModel.value || ""
        },
        "campaignSlug": slugify(nombreCampania.value),
        // "tempCampaignId": tempCampaignId.value // Incluimos el ID temporal
      };

      const userIdsLocal = modoPersonalizado.value ? userIds.value : ( dataUsuarios.value?.userIds || [] );

      if(
        (modoPersonalizado.value && !itemsModificados.value) || 
        (modoPersonalizado.value && itemsModificados.value) || 
        (!modoPersonalizado.value && !itemsModificados.value))
      {

        const lotesUsuarios = dividirEnLotes(userIdsLocal, 7000); // dividimos en lotes el array de usuarios
        const tamanioUsers = userIdsLocal.length;
        jsonEnviar["userId"] = [];
        jsonEnviar["userIdCompress"] = compressList( lotesUsuarios[0] ); // convertimos el array en string y obtenemos el primer lote
        var respCampaign = await createCampaign(jsonEnviar); // creamos la campaña para que nos retorne el objectId
        var indiceTemp = 1;
        var totalTemp = lotesUsuarios[0].length;

        if(respCampaign){
          while ( indiceTemp <  lotesUsuarios.length){
          
            if(respCampaign){
              const usersTempLote = lotesUsuarios[ indiceTemp ];
              const jsonEnviar_Temp = {
                _id: respCampaign._id, // el servicio cuando detecta 
                userId: [],
                userIdCompress : !modoPersonalizado.value ? compressList( usersTempLote ) : ""
              }

              totalTemp += usersTempLote.length;

              respCampaign = await createCampaign(jsonEnviar_Temp);

              textLoadingPanelDialog.value = `Procesando ${totalTemp} de ${tamanioUsers} usuarios..`;

            }else{
              snackbar.value = {
                show: true,
                text: "Error al crear la campaña",
                color: 'error'
              };
            }

            indiceTemp++;
          }

        }else{
          snackbar.value = {
            show: true,
            text: "Error al crear la campaña.",
            color: 'error'
          };
        }
        // console.log(dataUsuarios.value?.userIds)
      }else{
        jsonEnviar["userId"] = [];
        jsonEnviar["userIdCompress"] = "";
        var respCampaign = await createCampaign(jsonEnviar);
      }

      snackbar.value = {
        show: true,
        text: 'Campaña creada exitosamente',
        color: 'success'
      };

      deleteRecord();//Eliminar localstorage

      setTimeout(() => {
        router.push('/apps/campaigns/list');
        loadingPanelDialog.value = false;
      }, 1000);

      return true;
    }catch(error){
      console.error(error);
      return null;
    }
  }

  const errorMessages = computed(() => numeroRules.map(rule => rule(numeroOtroUsuarios.value)).filter(Boolean));
  // const hasErrors = computed(() => errorMessages.value.length > 0);

  function compareByTitle(a, b) {
    if (a.title === "Todas las ciudades") {
      return -1; // El elemento "Todas las ciudes" se mantiene en el primer lugar
    } else if (b.title === "Todas las ciudades") {
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

  function getCiudades(newValue){
    selectedItemCiudad.value = [];
    selectItemParticipantes.value = [];
    var ciudades = [];
    ciudades.push({ title: "Todas las ciudades", value: "0" });
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
  }

  var inicioWatchItemsSelected = true;
  const itemsModificados = ref(false);

  // para mejorar la carga de ciudades
  // watch(() => selectedItem.value, async (newValue) => {
  //   if (newValue) {
  //     selectedItemCiudad.value = [];
  //     selectItemParticipantes.value = [];
      
  //     const ciudades = [];
  //     ciudades.push({ title: "Todas las ciudades", value: "0" });
      
  //     const paisSeleccionado = dataCountry.value.find(pais => pais.country === newValue);
  //     if (paisSeleccionado && paisSeleccionado.data) {
  //       paisSeleccionado.data.forEach(ciudad => {
  //         ciudades.push({ title: ciudad.city, value: ciudad.city });
  //       });
  //     }

  //     ciudades.sort(compareByTitle);
      
  //     const ciudadesUnicas = [...new Set(ciudades.map(ciudad => ciudad.title))];
  //     cityList.value = ciudadesUnicas;
      
  //     console.log('Ciudades cargadas:', cityList.value);
  //   } else {
  //     cityList.value = [];
  //     selectItemParticipantes.value = [];
  //   }
  // });

  watch(modoPersonalizado, (newValue, oldValue) =>{
    itemsModificados.value = true;
  });

  watch(() => selectedItem.value, (newValue, oldValue) => {
    if(inicioWatchItemsSelected) return true;
    // alert(1)
    itemsModificados.value = true;

    if(selectedItem.value != null){

      getCiudades(newValue);

      console.log(cityList.value)
    }else{
      cityList.value = [];
      selectItemParticipantes.value = [];
    }
  });

  watch(async () => selectedItemCiudad.value,async  (newValue, oldValue) => {
    if(inicioWatchItemsSelected) return true;
    // alert(2)
    itemsModificados.value = true;
    if(cityList.value.length > 1){
      if(selectedItemCiudad.value != null){
        loadingPanel.value=true;
        clearTimeout(timeoutId.value);
        timeoutId.value = setTimeout(async () => {
          await getUsuarios();
          // loadingPanel.value=false;
        }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada
        await generarOtrosValores();
      }else{
        dataUsuarios.value = {};
      }
    }
    // selectItemsList.value = [100, 200, 1000, "Otro"];
  });

  watch(async () => selectItemDispositivos.value,async  (newValue, oldValue) => {
    if(inicioWatchItemsSelected) return true;
    // alert(3)
    itemsModificados.value = true;
    if(selectItemDispositivos.value != null){
      loadingPanel.value=true;
      clearTimeout(timeoutId.value);
      timeoutId.value = setTimeout(async () => {
        await getUsuarios();
        // loadingPanel.value=false;
      }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada
      await generarOtrosValores();
    }else{
      dataUsuarios.value = {};
    }

    // selectItemsList.value = [100, 200, 1000, "Otro"];
  });

  watch(async () => selectItemSO.value,async  (newValue, oldValue) => {
    if(inicioWatchItemsSelected) return true;
    // alert(4)
    // console.log('Nuevo valor seleccionado:', newValue);
    // console.log('Valor anterior:', oldValue);
    itemsModificados.value = true;
    loadingPanel.value=true;
      clearTimeout(timeoutId.value);
      timeoutId.value = setTimeout(async () => {
        await getUsuarios();
        // loadingPanel.value=false;
      }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada
      await generarOtrosValores();

    // selectItemsList.value = [100, 200, 1000, "Otro"];
  });


  watch(async () => selectItemNavegador.value,async  (newValue, oldValue) => {
    if(inicioWatchItemsSelected) return true;
    // alert(5)
    itemsModificados.value = true;
    if(selectItemNavegador.value != null){
      loadingPanel.value=true;
      clearTimeout(timeoutId.value);
      timeoutId.value = setTimeout(async () => {
        await getUsuarios();
        // loadingPanel.value=false;
      }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada
      await generarOtrosValores();
    }else{
      dataUsuarios.value = {};
    }

  });

  watch(async () => metadatos.value,async  (newValue, oldValue) => {
    if(inicioWatchItemsSelected) return true;
    // alert(6)
    itemsModificados.value = true;
    if(metadatos.value != null){
      loadingPanel.value=true;
      clearTimeout(timeoutId.value);
      timeoutId.value = setTimeout(async () => {
        await getUsuarios();
        // loadingPanel.value=false;
      }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada
      await generarOtrosValores();
    }else{
      dataUsuarios.value = {};
    }

  });


  const filterLocal = ref('');
const currentPageLocal = ref(1);
// const timeoutId = ref(null);
const filteredUsers = ref([]);
const userIds = ref([]); // Nuevo array para guardar solo los IDs

const showSearchDialog = ref(false);
const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const searchTimeout = ref(null);
const loadingAdd = ref(false);
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

const isUploading = ref(false);
const fileInput = ref(null);

// Función para la búsqueda
// async function handleSearch() {
//   if (searchQuery.value.length < 4) return

//   isSearching.value = true
//   try {
//     const response = await fetch(`https://ads-service.vercel.app/busqueda/user/?s=${encodeURIComponent(searchQuery.value)}`)
//     const data = await response.json()
    
//     if (data.resp) {
//       searchResults.value = data.data
//     } else {
//       searchResults.value = []
//     }
//   } catch (error) {
//     console.error('Error en búsqueda:', error)
//     searchResults.value = []
//   } finally {
//     isSearching.value = false
//   }
// }

async function handleSearch(query) {
  if (query.length < 4) return

  loadingPanel.value = true
  try {
    const response = await fetch(`https://ads-service.vercel.app/busqueda/user/?s=${encodeURIComponent(query)}`)
    const data = await response.json()
    
    if (data.resp) {
      searchResults.value = data.data
      snackbar.value = {
        show: true,
        text: `Se encontraron ${data.data.length} resultados`,
        color: 'info'
      }
    } else {
      searchResults.value = []
      snackbar.value = {
        show: true,
        text: 'No se encontraron resultados',
        color: 'warning'
      }
    }
  } catch (error) {
    console.error('Error en búsqueda:', error)
    searchResults.value = []
    snackbar.value = {
      show: true,
      text: 'Error al realizar la búsqueda',
      color: 'error'
    }
  } finally {
    loadingPanel.value = false
  }
}

// Función para realizar la consulta
const buscarUsuarios = async () => {
  try {
    const query = searchQuery.value?.toLowerCase();
    await handleSearch(query); // Pasamos el término de búsqueda
  } catch (error) {
    console.error("Error en buscarUsuarios:", error);
    return null;
  }
};

// Crear una función con debounce
const buscarUsuariosDebounced = debounce(buscarUsuarios, 500); // 500ms de retraso

// Función para agregar usuario desde la búsqueda
function handleAddSpecificUser(user) {
  // Verificar si ya existe
  if (!filteredUsers.value.some(u => u.wylexId === user.wylexId)) {
    filteredUsers.value.push(user)
    userIds.value.push(user.wylexId)
    
    snackbar.value = {
      show: true,
      text: 'Usuario agregado exitosamente',
      color: 'success'
    }
  }
}

// computed properties
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / 10); // 10 usuarios por página
});

const currentUsers = computed(() => {
  const search = filterLocal.value.toLowerCase()
  let filtered = filteredUsers.value
  
  if (search) {
    filtered = filtered.filter(user => {
      const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase()
      const email = (user.email || '').toLowerCase()
      return fullName.includes(search) || email.includes(search)
    })
  }
  
  const start = (currentPageLocal.value - 1) * 10
  return filtered.slice(start, start + 10)
})

// para controlar la visibilidad de elementos
const hasUsers = computed(() => {
  return filteredUsers.value && filteredUsers.value.length > 0;
});

// Función para manejar el click en el botón de importar
function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

// Función actualizada para manejar el CSV
async function handleFileChange(event) {
  const file = event.target.files[0]
  if (!file) return

  if (!file.name.endsWith('.csv')) {
    snackbar.value = {
      show: true,
      text: 'Por favor, selecciona un archivo CSV',
      color: 'error'
    }
    event.target.value = ''
    return
  }

  loadingPanel.value = true
  try {
    const Papa = (await import('papaparse')).default;

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        try {
          if (!results.data || !results.data.length) {
            throw new Error('El archivo está vacío')
          }

          const validUsers = results.data
            .filter(row => row.id && row.id.trim() !== '')
            .map(row => ({
              wylexId: parseInt(row.id),
              firstname: row.firstname || '',
              last_name: row.last_name || '',
              email: row.email || ''
            }))
            .filter(user => !isNaN(user.wylexId))

          if (validUsers.length === 0) {
            throw new Error('No se encontraron usuarios válidos')
          }

          filteredUsers.value = validUsers
          userIds.value = validUsers.map(user => user.wylexId)

          snackbar.value = {
            show: true,
            text: `${validUsers.length} usuarios cargados exitosamente`,
            color: 'success'
          }
        } catch (error) {
          snackbar.value = {
            show: true,
            text: error.message,
            color: 'error'
          }
        }
      }
    })
  } catch (error) {
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: 'error'
    }
  } finally {
    loadingPanel.value = false
    event.target.value = ''
  }
}
// Función de exportación actualizada
async function handleExport() {
  if (!hasUsers.value) return;

  try {
    loadingPanel.value = true;
    const Papa = (await import('papaparse')).default;
    
    const csvData = Papa.unparse({
      fields: ['id', 'firstname', 'last_name', 'email'],
      data: filteredUsers.value.map(user => ({
        id: user.wylexId,
        firstname: user.firstname || user.first_name || '',
        last_name: user.lastname || user.last_name || '',
        email: user.email || ''
      }))
    });

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_campana_${slugify(nombreCampania.value)}_${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    snackbar.value = {
      show: true,
      text: 'Usuarios exportados exitosamente',
      color: 'success'
    };
  } catch (error) {
    snackbar.value = {
      show: true,
      text: 'Error al exportar usuarios',
      color: 'error'
    };
  } finally {
    loadingPanel.value = false;
  }
}

  /****************************************************************/
  /****************************************************************/
  // INICIO CRUD EN LOCALSTORAGE PARA EL DUPLICADO
  /****************************************************************/
  /****************************************************************/
  const isDialogVisibleClone = ref(false);

  const localStorageKey = "crudCampaign";

  // Leer todos los registros
  async function readRecord() {
    const customIndex = route.params.id;
    const nameLocalStorage = `${localStorageKey}|${customIndex}`;
    const data = JSON.parse(localStorage.getItem(nameLocalStorage)) || {};
    if (data) {
      return data;
    } else {
      return null;
    }
  }

  // Actualizar un registro existente por su índice
  function updateRecord(key, updatedValue) {
    const customIndex = route.params.id;
    const nameLocalStorage = `${localStorageKey}|${customIndex}`;
    const data = JSON.parse(localStorage.getItem(nameLocalStorage)) || {};
    if (data) {
      data[key] = updatedValue;
      localStorage.setItem(nameLocalStorage, JSON.stringify(data));
      return true;
    } else {
      return null;
    }
  }

  // Eliminar un registro por su índice
  async function deleteRecord() {
    const customIndex = route.params.id;
    const nameLocalStorage = `${localStorageKey}|${customIndex}`;
    if (localStorage.getItem( nameLocalStorage )) {
      localStorage.removeItem( nameLocalStorage );
    }
    return true;
  }

  function iniciarCicloCondicion(periodoSegundos = 50, condicion) {
    const intervalo = 1000; // Tiempo en milisegundos (1 segundo)
    
    return new Promise((resolve) => {
      let contador = 0;

      const ciclo = setInterval(() => {
        contador++;

        console.log(`Segundo ${contador}: Verificando condición...`);

        // Verificar la condición
        if (condicion) {
          console.log('Condición cumplida. Ciclo detenido.');
          clearInterval(ciclo);
          resolve(true); // Resuelve la promesa como verdadera
          return;
        }

        // Si se supera el tiempo límite
        if (contador >= periodoSegundos) {
          console.log('Tiempo agotado. Ciclo detenido.');
          clearInterval(ciclo);
          resolve(false); // Resuelve la promesa como falsa
        }
      }, intervalo);
    });
  }

  function isObject(variable) {
    return variable instanceof Object && variable.constructor === Object;
  }

  const compressList = (list) => list.join(','); // Comprimir a una cadena separada por comas
  const decompressList = (compressed) => compressed.split(',').map(Number); // Restaurar a array

  onMounted(async () => {
    const cloneCampaign = await readRecord();
    nombreCampania.value = cloneCampaign?.campaignTitle; //Nombre de campaña
    languages.value = cloneCampaign?.type; //Tipo de campaña
    descripcionCampania.value = cloneCampaign?.description; //Descripción de campaña
    if(cloneCampaign?.type == "html" || cloneCampaign?.type == "script"){
      codigoExternoModel.value = cloneCampaign?.urls?.html; //Configuración de Contenido - inserte código
    }

    if(cloneCampaign?.type == "imagen"){
      linkAds.value = cloneCampaign?.urls?.url;
      linkImageEscritorio.value = cloneCampaign?.urls?.img.escritorio;
      linkImageMobile.value = cloneCampaign?.urls?.img.mobile;
    }

    if(cloneCampaign?.fechai){
      fechaIFModel.value = [parseISO(moment(cloneCampaign?.fechai, "YYYY-MM-DD HH:mm:ss").format('YYYY-MM-DD')), parseISO(moment(cloneCampaign?.fechaf, "YYYY-MM-DD HH:mm:ss").format('YYYY-MM-DD'))]
      dateRange.value = {
        start: Moment(cloneCampaign?.fechai, "YYYY-MM-DD HH:mm:ss").format('YYYY-MM-DD'),
        end: Moment(cloneCampaign?.fechaf, "YYYY-MM-DD HH:mm:ss").format('YYYY-MM-DD')
      }
    }

    // selectItemVisibilidad.value = cloneCampaign?.criterial?.visibilitySection;
    if(isObject(cloneCampaign?.criterial?.visibilitySection)){
      selectItemVisibilidad.value = cloneCampaign?.criterial?.visibilitySection?.name;
      handleSectionChange(selectItemVisibilidad.value)
      selectedVisibilityOptions.value.push(cloneCampaign?.criterial?.visibilitySection?.params.landing ? 'landing' : '');
      selectedVisibilityOptions.value.push(cloneCampaign?.criterial?.visibilitySection?.params.root ? 'root' : '');
      selectedVisibilityOptions.value.push(cloneCampaign?.criterial?.visibilitySection?.params.subsection ? 'subsection' : '');
      selectedVisibilityOptions.value.push(cloneCampaign?.criterial?.visibilitySection?.params.all ? 'all' : '');
      selectedVisibilityOptions.value.push(cloneCampaign?.criterial?.visibilitySection?.specificUrl.enabled ? 'enabled' : '');

      if(selectedVisibilityOptions.value.includes('enabled')){
        specificUrl.value = cloneCampaign?.criterial?.visibilitySection?.specificUrl.url;
      }
    }
    posicion.value = cloneCampaign.position ? cloneCampaign?.position.split(',') : [];
    modoPersonalizado.value = cloneCampaign?.participantes == "personalizado";
    
    if(modoPersonalizado.value){
        const validUsers = decompressList(cloneCampaign?.userId).filter(row => row).map(row => ({
          wylexId: parseInt(row),
          firstname: 'UserId: ' + row,
          last_name: '',
          email: ''
        })).filter(user => !isNaN(user.wylexId))

        if (validUsers.length === 0) {
          throw new Error('No se encontraron usuarios válidos')
        }

        filteredUsers.value = validUsers
        userIds.value = validUsers.map(user => user.wylexId)
    }else{
      dataUsuarios.value = {total:decompressList(cloneCampaign?.userId).length, userIds: decompressList(cloneCampaign?.userId)};
    }

    criterio.value =  cloneCampaign?.coleccion?.split(',') || []
    
    if(criterio.value.includes('metadatos')){
      metadatos.value = cloneCampaign?.criterial?.metadato.split(',') || []
    }

    if(criterio.value.includes('trazabilidads')){
      selectedItem.value = cloneCampaign?.criterial?.country || ""

      const resultadoPaises = await iniciarCicloCondicion(50, (() => dataCountry.value.length > 1)); // Espera hasta que exista datos en dataCountry
      if(resultadoPaises){
        //Busca las ciudades dependiendo del país
        getCiudades(selectedItem.value);
      }

      const resultado = await iniciarCicloCondicion(50, (() => cityList.value.length > 1)); // Espera hasta que exista datos en cityList
      if(resultado){
        if(cloneCampaign?.criterial?.city){
          if(cloneCampaign?.criterial?.city == -1){
            selectedItemCiudad.value = "Todas las ciudades";
          }else{
            selectedItemCiudad.value = cloneCampaign?.criterial?.city.split(',');
          }
        }else{
          selectedItemCiudad.value = "Todas las ciudades";
        }
      }
      // console.log(selectedItemCiudad.value)
    }

    if(criterio.value.includes('dispositivos')){
      selectItemDispositivos.value = cloneCampaign?.criterial?.dispositivo.split(',') || []
    }

    if(criterio.value.includes('plataforma')){
      selectItemSO.value = cloneCampaign?.criterial?.so.split(',') || []
      selectItemNavegador.value = cloneCampaign?.criterial?.navegador.split(',') || []
    }
    
    setTimeout(function(){
      inicioWatchItemsSelected = false; // Variable que realiza un stop a los watch
    }, 1000);

    // inicioWatchItemsSelected = false;
  });

  /****************************************************************/
  /****************************************************************/
  // FIN CRUD EN LOCALSTORAGE PARA EL DUPLICADO
  /****************************************************************/
  /****************************************************************/

</script>

<template>
  <div class="position-relative">
    <VOverlay 
      v-model="loadingPanel" 
      class="align-center justify-center"
      persistent
      :opacity="0.8"
    >
      <VProgressCircular
        indeterminate
        color="primary"
        size="64"
      />
    </VOverlay>

    <!-- Dialog -->
    <VDialog
      persistent
      v-model="loadingPanelDialog"
      width="300"
    >
      <VCard
        color="primary"
        width="300"
      >
        <VCardText class="pt-3">
          <div class="text-center mb-2" style="line-height: 1.2;">
            No cierre la pestaña, espere por favor
          </div>
          <VProgressLinear
            indeterminate
            color="white"
            class="mb-0"
          />
          <div class="text-center mt-2" style="line-height: 1.2;font-size: 10px;">
            {{textLoadingPanelDialog}}
          </div>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Snackbar -->
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2000"
      :location="snackbar.location || 'top'"
    >
      {{ snackbar.text }}
      <template v-slot:actions>
        <VBtn
          color="white"
          text
          @click="snackbar.show = false"
        >
          Cerrar
        </VBtn>
      </template>
    </VSnackbar>

      <VRow>
        <!-- Detalles de campaña-->
        <VCol cols="12" md="6">
          <VCard class="h-100">
            <VCardTitle class="pa-4">
              <VChip
                color="primary"
                label
                size="large"
                class="px-4 py-2 text-uppercase"
              >
                Detalles de Campaña
              </VChip>
            </VCardTitle>
          <VCardText>
            <VRow>
              <!-- Nombre de la campaña -->
              <VCol cols="6">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label for="nombreCampania">Nombre de la campaña</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <VTextField
                      id="nombreCampania"
                      v-model="nombreCampania"
                      placeholder="Nombre de la campaña"
                      persistent-placeholder
                    />
                  </VCol>
                </VRow>
              </VCol>
  
              <!-- Tipo de contenido -->
              <VCol cols="6">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label for="tipocontenido">Tipo de contenido</label>
                  </VCol>
                  <VCol cols="12" md="12">
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

              <!-- Rango de fechas de campaña -->
              <VCol cols="12">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label class="mb-2 d-block">Período de la campaña</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <AppDateTimePicker
                      prepend-inner-icon="tabler-calendar"
                      density="compact"
                      :show-current="true"
                      v-model="fechaIFModel"
                      @on-change="handleDateRangeChange"
                      :config="{
                        position: 'auto right',
                        mode: 'range',
                        altFormat: 'F j, Y',
                        dateFormat: 'Y-m-d',
                        defaultDate: [
                          dateRange.start,
                          dateRange.end
                        ],
                        maxDate: '2025-12-31',
                        showMonths: 2,
                        locale: {
                          rangeSeparator: ' al ',
                          firstDayOfWeek: 1,
                          months: {
                            shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                            longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
                          }
                        },
                        noCalendar: false,
                        enableTime: false,
                        wrap: true
                      }"
                    />
                  </VCol>
                </VRow>
              </VCol>
  
              <!-- Campo de descripción -->
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
                    />
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
  
      <VCol cols="12" md="6">
        <VCard class="h-100">
          <VCardTitle class="pa-4">
            <VChip
              color="primary"
              label
              size="large"
              class="px-4 py-2 text-uppercase"
            >
              Configuración de Contenido
            </VChip>
          </VCardTitle>
          <VCardText>
            <VRow class="pb-5">
              <!-- <VCol cols="6">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label for="tipocontenido">Tipo de contenido</label>
                  </VCol>
                  <VCol cols="12" md="12">
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
              </VCol> -->
  
              <!-- Campo de código (visible cuando no es imagen) -->
              <VCol cols="12" :class="(languages=='imagen'?'d-none':'')">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label for="nombreCampania">Inserte el código</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <VTextarea 
                      label="Código" 
                      v-model="codigoExternoModel" 
                    />
                  </VCol>
                </VRow>
              </VCol>
  
              <!-- Campo de link (visible solo cuando es imagen) -->
              <VCol cols="12" :class="(languages!='imagen'?'d-none':'')">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label for="nombreCampania">Link del ads</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <VTextField
                      id="link"
                      v-model="linkAds"
                      placeholder="Link del ads"
                      persistent-placeholder
                    />
                  </VCol>
                </VRow>
              </VCol>
  
              <!-- URL imagen escritorio (visible solo cuando es imagen) -->
              <VCol cols="6" :class="(languages!='imagen'?'d-none':'')">
                <VRow no-gutters>
                  <VCol cols="6" md="12">
                    <label for="">URL imagen de escritorio</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <VTextField
                      id="linkImageEscritorio"
                      v-model="linkImageEscritorio"
                      placeholder="Link imagen de escritorio"
                      persistent-placeholder
                    />
                  </VCol>
                </VRow>
              </VCol>
  
              <!-- URL imagen móvil (visible solo cuando es imagen) -->
              <VCol cols="6" :class="(languages!='imagen'?'d-none':'')">
                <VRow no-gutters>
                  <VCol cols="6" md="12">
                    <label for="">URL imagen de móvil</label>
                  </VCol>
                  <VCol cols="12" md="12">
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
          </VCardText>
        </VCard>
      </VCol>
  
      <!-- Visibilidad en la web -->
      <VCol cols="12">
        <VCard>
          <VCardTitle class="pa-4">
            <VChip color="primary" label size="large" class="px-4 py-2 text-uppercase">
              Visibilidad en la web
            </VChip>
          </VCardTitle>
          <!-- <VCardSubtitle>
            <VIcon size="20" icon="mdi-info" /> Cambiar la posición puede afectar la lectura de las métricas en una campaña ya existente.
          </VCardSubtitle> -->
          <VCardText>
            <VRow>
              <!-- Escoge sección -->
              <VCol cols="6">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label for="tipocontenido">Escoge una sección</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <VSelect
                      v-model="selectItemVisibilidad"
                      :items="selectItemsListVisibilidad"
                      chips
                      clearable
                      label=""
                      @update:model-value="handleSectionChange"
                    />
                  </VCol>
                  <!-- Campo para URL cuando se selecciona "Otro" -->
                  <VCol v-if="selectItemVisibilidad === 'other'" cols="12" md="12" class="mt-2">
                    <VTextField
                      v-model="otherSectionUrl"
                      label="URL específico"
                      placeholder="https://www.ecuavisa.com/mi-url"
                      hide-details
                    />
                  </VCol>
                </VRow>
              </VCol>

              <!-- Posición -->
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

              <!-- Opciones condicionales -->
              <VCol v-if="showSectionOptions" cols="12">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label>Tipo de visualización</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <div class="d-flex flex-column gap-2">
                      <VCheckbox
                        v-model="selectedVisibilityOptions"
                        label="Solo página de categoría"
                        value="landing"
                        :disabled="urlEnabled"
                      />
                      <VCheckbox
                        v-model="selectedVisibilityOptions"
                        label="Notas en raíz"
                        value="root"
                        :disabled="urlEnabled"
                      />
                      <VCheckbox
                        v-model="selectedVisibilityOptions"
                        label="Notas con subsección"
                        value="subsection"
                        :disabled="urlEnabled"
                      />
                      <VCheckbox
                        v-model="selectedVisibilityOptions"
                        label="Toda la categoría"
                        value="all"
                        :disabled="urlEnabled"
                      />
                      <div class="d-flex align-center gap-4">
                        <VCheckbox
                          v-model="urlEnabled"
                          label="URL específica"
                          @update:model-value="handleUrlOptionChange"
                        />
                        <VTextField
                          v-if="urlEnabled"
                          v-model="specificUrl"
                          label="URL específica"
                          placeholder="https://ejemplo.com/seccion/subseccion"
                          class="flex-grow-1"
                          hide-details
                        />
                      </div>
                    </div>
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
      <!-- Tarjeta de Target/Usuarios -->
      <VCol cols="12">
          <VCard>
            <VCardTitle class="pa-4">
              <VChip color="primary" label size="large" class="px-4 py-2 text-uppercase">
                Target / Usuarios
              </VChip>
            </VCardTitle>
            <VCardText>
              <div class="d-flex justify-start mb-4">
                <VSwitch
                  v-model="modoPersonalizado"
                  color="primary"
                  label="Modo Personalizado"
                  hide-details
                />
              </div>

              <!-- Contenido que cambia según el switch -->
              <VRow v-if="!modoPersonalizado">
                <!-- Columna izquierda para filtros -->
                <VCol cols="9">
                  <h3 class="text-h5">Filtrar en la plataforma</h3>
                  <p class="mb-5">usuarios registrados en ecuavisa.com</p>

                  <!-- Tabla de criterios -->
                  <VTable density="compact" class="border-transparent mb-4">
                    <tbody>
                      <tr>
                        <td class="border-transparent">
                          <VCheckbox
                            v-model="criterio"
                            :label="criterioList[0].title"
                            :value="criterioList[0].value"
                          />
                        </td>
                        <td class="border-transparent">
                          <VCheckbox
                            v-model="criterio"
                            :label="criterioList[1].title"
                            :value="criterioList[1].value"
                          />
                        </td>
                      </tr>
                      <tr>
                        <td class="border-transparent">
                          <VCheckbox
                            v-model="criterio"
                            :label="criterioList[2].title"
                            :value="criterioList[2].value"
                          />
                        </td>
                        <td class="border-transparent">
                          <VCheckbox
                            v-model="criterio"
                            :label="criterioList[3].title"
                            :value="criterioList[3].value"
                          />
                        </td>
                      </tr>
                    </tbody>
                  </VTable>

                      <!-- Campos condicionales -->
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
                                              :menu-props="{ maxHeight: '300' }"
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
                                              :disabled="loadingPanel"
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

                </VCol>

                    
            <!-- Columna derecha para estadísticas -->
            <VCol cols="3">
                  <VCard class="bg-light-success">
                    <VCardText>
                      <h3 class="text-h6 mb-4">Total de usuarios</h3>
                      <div class="d-flex align-center">
                        <VIcon
                          size="32"
                          icon="mdi-account-group"
                          color="success"
                          class="me-2"
                        />
                        <div>
                          <div class="text-h4 font-weight-bold text-center">
                            {{ formattedUserCount }}
                          </div>
                        </div>
                      </div>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>

            <!-- Vista de modo personalizado -->
            <VRow v-else>
              <VCol cols="12">
                <VSnackbar
                  v-model="snackbar.show"
                  :color="snackbar.color"
                  :timeout="2000"
                  location="top"
                >
                  {{ snackbar.text }}
                </VSnackbar>

                <!-- Campo de búsqueda y botones -->
                <VRow justify="space-between" class="mb-4">
                  <VCol cols="4">
                    <VTextField 
                      append-inner-icon="tabler-user-search" 
                      @input="filtrarUsuarios" 
                      v-model="filterLocal" 
                      label="Buscar usuarios dentro del listado"
                      density="compact"
                      :disabled="!hasUsers"
                    />
                  </VCol>
                  <VCol cols="auto">
                    <div class="d-flex gap-3 flex-wrap">
                      <VBtn 
                        color="info" 
                        @click="handleExport" 
                        size="small"
                        :disabled="!hasUsers"
                      >
                        Descargar Usuarios<VIcon end icon="tabler-download" />
                      </VBtn>
                      <VBtn 
                        color="success" 
                        @click="handleAddUser" 
                        size="small"
                        
                      >
                        Añadir usuarios<VIcon end icon="mdi-account-plus" />
                      </VBtn>
                      <VBtn 
                        color="primary" 
                        @click="triggerFileInput" 
                        size="small"
                        :loading="isUploading"
                      >
                        Importar CSV<VIcon end icon="mdi-file-upload" />
                      </VBtn>
                      <input
                        ref="fileInput"
                        type="file"
                        accept=".csv"
                        style="display: none"
                        @change="handleFileChange"
                      />
                    </div>
                  </VCol>
                </VRow>

                <!-- Lista de usuarios (visible solo cuando hay usuarios) -->
                <div v-if="hasUsers">
                  <VList lines="two">
                    <VListItem
                      v-for="user in currentUsers"
                      :key="user.wylexId"
                      border
                    >
                      <VListItemTitle>
                        {{ user.firstname || user.first_name }} {{ user.lastname || user.last_name }}
                      </VListItemTitle>
                      <VListItemSubtitle class="mt-1">
                        <span class="text-xs text-disabled">{{ user.email }}</span>
                      </VListItemSubtitle>
                      <template #append>
                        <VBtn
                          icon
                          size="x-small"
                          color="error"
                          variant="text"
                          @click="handleDeleteUser(user.wylexId)"
                        >
                          <VIcon size="22" icon="tabler-trash" />
                        </VBtn>
                      </template>
                    </VListItem>
                  </VList>

                  <!-- Paginación -->
                  <div class="d-flex justify-center mt-4">
                    <VBtn 
                      variant="tonal" 
                      @click="currentPageLocal--" 
                      :disabled="currentPageLocal <= 1" 
                      size="small" 
                      color="primary"
                    >
                      <VIcon start icon="tabler-arrow-left" /> Anterior
                    </VBtn>
                    <VBtn 
                      variant="tonal" 
                      @click="currentPageLocal++" 
                      :disabled="currentPageLocal >= totalPages" 
                      size="small" 
                      color="primary" 
                      class="ms-3"
                    >
                      Siguiente <VIcon end icon="tabler-arrow-right" />
                    </VBtn>
                  </div>
                </div>

                <!-- Mensaje cuando no hay usuarios -->
                <div v-else class="text-center pa-4">
                  <p class="text-medium-emphasis mb-4">No hay usuarios cargados. Por favor, importa un archivo CSV para comenzar.</p>
                  <VBtn
                    color="info"
                    variant="outlined"
                    size="small"
                    @click="downloadExample"
                    prepend-icon="mdi-file-download"
                  >
                    Descargar CSV de ejemplo
                  </VBtn>
                </div>

                <!-- Modal de búsqueda -->
                <VDialog v-model="showSearchDialog" max-width="800px">
                  <VCard>
                    <VCardTitle>Buscar Usuarios</VCardTitle>
                    <VCardText>
                      <VTextField
                        v-model="searchQuery"
                        :disabled="loadingPanel"
                        @input="buscarUsuariosDebounced"
                        @click:clear="buscarUsuariosDebounced"
                        label="Buscar por nombre, correo o teléfono (mínimo 4 caracteres)."
                        append-inner-icon="tabler-search"
                        :loading="isSearching"
                      />
                      
                      <VTable v-if="searchResults.length > 0">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="user in searchResults" :key="user.wylexId">
                            <td>{{ user.first_name }} {{ user.last_name }}</td>
                            <td>{{ user.email }}</td>
                            <td>
                              <VBtn
                                size="small"
                                color="primary"
                                @click="handleAddSpecificUser(user)"
                                :loading="loadingAdd"
                              >
                                Agregar
                              </VBtn>
                            </td>
                          </tr>
                        </tbody>
                      </VTable>
                    </VCardText>
                    <VCardActions>
                      <VSpacer />
                      <VBtn
                        color="primary"
                        text
                        @click="closeSearchDialog"
                      >
                        Cerrar
                      </VBtn>
                    </VCardActions>
                  </VCard>
                </VDialog>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>

      </VCol>

    </VRow>

  
   <!-- Botón flotante para guardar -->
   <VBtn
      class="save-button"
      color="success"
      icon="mdi-check"
      size="large"
      @click="onComplete"
      style="position: fixed; bottom: 2rem; right: 2rem;"
    >
      <VIcon icon="tabler-device-floppy" />
    </VBtn>

    <!-- Modal único para agregar usuarios -->
    <VDialog 
      v-model="userModalOpen" 
      max-width="800"
      :persistent="false"
      @update:model-value="$event === false && (searchQuery = '', searchResults = [])"
    >
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center pa-4">
          Buscar usuarios
          <VBtn icon="mdi-close" variant="text" @click="userModalOpen = false" />
        </VCardTitle>

        <VCardText>
          <!-- <VTextField
            v-model="searchQuery"
            label="Buscar por nombre o email (mínimo 4 caracteres)"
            prepend-inner-icon="mdi-magnify"
            :loading="isSearching"
            clearable
            class="mb-4"
            @input="handleSearch"
          /> -->

          
          <VTextField
            clearable
            v-model="searchQuery"
            :disabled="loadingPanel"
            @input="buscarUsuariosDebounced"
            @click:clear="buscarUsuariosDebounced"
            label="Buscar por nombre o email (mínimo 4 caracteres)"
            append-inner-icon="tabler-search"
            :loading="isSearching"
          />

          <VList lines="two" v-if="searchResults.length > 0">
            <VListItem
              v-for="user in searchResults"
              :key="user.wylexId"
              border
            >
              <VListItemTitle>
                {{ user.first_name }} {{ user.last_name }}
                <VIcon
                  v-if="isUserAdded(user)"
                  color="success"
                  class="ms-2"
                  icon="mdi-check-circle"
                  size="small"
                />
              </VListItemTitle>
              <VListItemSubtitle class="mt-1">
                <span class="text-xs text-disabled">{{ user.email }}</span>
              </VListItemSubtitle>
              <template #append>
                <VBtn
                  color="primary"
                  size="small"
                  @click="handleAddSpecificUser(user)"
                  :disabled="isUserAdded(user)"
                >
                  {{ isUserAdded(user) ? 'Agregado' : 'Agregar' }}
                </VBtn>
              </template>
            </VListItem>
          </VList>

          <VAlert
            v-else-if="searchQuery && !isSearching && searchQuery.length >= 4"
            type="info"
            class="mt-4"
          >
            No se encontraron resultados
          </VAlert>
          
          <VAlert
            v-else-if="searchQuery && searchQuery.length < 4"
            type="info"
            class="mt-4"
          >
            Ingresa al menos 4 caracteres para buscar
          </VAlert>
        </VCardText>
      </VCard>
    </VDialog>

    <!-- Input oculto para importar archivo -->
    <input
      ref="fileInput"
      type="file"
      accept=".csv"
      style="display: none"
      @change="handleFileChange"
    />

    <!-- Snackbar para notificaciones -->
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2000"
      location="top"
    >
      {{ snackbar.text }}
    </VSnackbar>
  </div>
</template>
  