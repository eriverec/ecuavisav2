<script setup>
import { parseISO } from 'date-fns';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import 'vue3-form-wizard/dist/style.css';
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const currentStep = ref(0);
const steps = [
  {
    title: 'Crear curso',
    icon: 'tabler-certificate',
    //subtitle: 'Setup account details',
  },
  {
    title: 'Crear video',
    icon: 'tabler-video',
    //subtitle: 'Add social links',
  },
  {
    title: 'Crear módulo',
    icon: 'tabler-file',
    //subtitle: 'Add personal info',
  },
  {
    title: 'Crear cuestionario',
    icon: 'tabler-clipboard-text',
    //subtitle: 'Add social links',
  }
]    
// --------------------------------------- CURSOS ------------------------------------------
// -----------------------------------------------------------------------------------------
const isDialogVisibleAddModulo = ref(false)

const categoriaModelLoading = ref(false);
const etiquetasModelLoading = ref(false);

const fechaHoy = moment().format("YYYY-MM-DD");
const fechaIFModel = ref({
  fechasModel: [parseISO(fechaHoy), parseISO(fechaHoy)],
  fechasVModel: [parseISO(fechaHoy)],
  fechasVConfig: {
      position: 'auto right',
      mode: 'single',
      minDate: parseISO(fechaHoy),
      altFormat: 'd F j, Y',
      dateFormat: 'l, j \\d\\e F \\d\\e Y',
      valueFormat: 'd-m-Y',
      reactive: true
  },
  fechai: fechaHoy,
  fechaV: fechaHoy,
  fechaf: fechaHoy
})


const dataModuloCursoModel = ref([]);
const dataModuloItems = ref([]);
const modulosSelectListCurso = ref([]);

const selectRefModuloCurso = ref(null);
const moduloModelLoading = ref(false);
const searchModuloModel = ref(null)
const moduloItemsCopy = ref([]);

const dataCuestionarioCursoModel = ref([]);
const dataCuestionarioItems = ref([]);

const selectRefCuestionarioCurso = ref(null);
const cuestionarioModelLoading = ref(false);
const searchCuestionarioModel = ref(null)
const cuestionarioItemsCopy = ref([]);

const idCursoRudoModel = ref('');
const duracionCursoModel = ref('');
const categoriaCursoModel = ref('');
const etiquetasCursoModel = ref('');

const tituloCursoModel = ref(null);
const descripcionCursoModel = ref(null);
const thumbnailCursoModel = ref(null);
const estadoCursoModel = ref(true);


const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

const etiquetasItems = ref([]);
const categoriasItems = ref([]);

onMounted(async ()=>{
  await getEtiquetas();
  await getCategorias();

  await getModulos();
  await getCuestionario();
  await getVideos();

  await getDesafioVideos();
})

async function getEtiquetas(){
  try {
      etiquetasModelLoading.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://estadisticas.ecuavisa.com/sites/gestor/Tools/elearning/etiqueta/listar.php`, requestOptions);
      const data = await response.json();
      etiquetasItems.value = data;
      etiquetasModelLoading.value = false;
  } catch (error) {
      return console.error(error.message);    
  }
}

async function getCategorias(){
  try {
      categoriaModelLoading.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://estadisticas.ecuavisa.com/sites/gestor/Tools/elearning/categoria/listar.php`, requestOptions);
      const data = await response.json();
      categoriasItems.value = data;
      categoriaModelLoading.value = false;
      
  } catch (error) {
      return console.error(error.message);    
  }
}

async function getModulos(){
  try {
      moduloModelLoading.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-elearning.vercel.app/modulo/select?limit=200&page=1`, requestOptions);
      const data = await response.json();

      modulosRaw.value = data.data.reduce((acumulador, actual) => {
        acumulador.push({
          title: `${actual.titulo}`,
          value: actual._id,
        });
        return acumulador;
      }, []);
      dataModuloItems.value = deepClone(modulosRaw.value);
      modulosFull.value = deepClone(data.data);
      moduloItemsCopy.value = dataModuloItems.value;
      moduloModelLoading.value = false;
      
  } catch (error) {
      return console.error(error.message);    
  }
}

async function getCuestionario(page = 1, limit= 10){
  try {
      cuestionarioModelLoading.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://e-learning-cuestionario.vercel.app/cuestionarios/all/get`, requestOptions);
      const data = await response.json();

      dataCuestionarioItems.value = data.data.reduce((acumulador, actual) => {
        acumulador.push({
          title: `${actual.titulo}`,
          value: actual._id,
        });
        return acumulador;
      }, []);
      cuestionarioItemsCopy.value = dataCuestionarioItems.value;
      cuestionarioModelLoading.value = false;
      
  } catch (error) {
      return console.error(error.message);    
  }
}

function resetForm(){
    tituloModel.value = "";
    idRudoModel.value = "";
    duracionModel.value = "";
    descripcionModel.value = "";
    thumbnailModel.value = "";
    duracionModel.value = "";
    etiquetasModel.value = "";
    categoriaModel.value = "";
    modulosSelectListCurso.value = [];
    dataModuloCursoModel.value = [];
    dataCuestionarioCursoModel.value = null;
    estadoModel.value = true;
    fechaIFModel.value = {
      fechasModel: [parseISO(fechaHoy), parseISO(fechaHoy)],
      fechasVModel: [parseISO(fechaHoy)],
      fechasVConfig: fechaIFModel.value.fechasVConfig,
      fechai: fechaHoy,
      fechaV: fechaHoy,
      fechaf: fechaHoy
    }
}

function obtenerListaOrdenada(listaA, listaB) {
    // Ordenar listaB por posición
    listaB.sort((a, b) => a.posicion - b.posicion);

    // Crear una lista vacía para almacenar el resultado
    let resultado = [];

    // Iterar sobre cada elemento de listaB
    for (let i = 0; i < listaB.length; i++) {
        // Encontrar el elemento correspondiente en listaA utilizando el _id
        let elementoListaA = listaA.find(item => item === listaB[i]._id);

        // Si se encuentra el elemento en listaA
        if (elementoListaA) {
            // Crear un nuevo objeto con el formato deseado y agregarlo a la lista resultado
            resultado.push({ title: listaB[i].titulo, value: elementoListaA });
        }
    }

    // Devolver la lista resultado
    return resultado;
}



function inicializarVideosSelectListCurso() {
    const modulosItemsLocal = dataModuloItems.value;
    const dataModuloItemsID = dataModuloCursoModel.value;
    if (dataModuloItemsID) {
        //Si se selecciona nuevos elementos del select
        if(modulosSelectListCurso.value.length < dataModuloItemsID.length){
          for(var j in modulosItemsLocal){
            if(dataModuloItemsID[dataModuloItemsID.length - 1] == modulosItemsLocal[j].value){
              modulosSelectListCurso.value.push(modulosItemsLocal[j]);
            }
          }
        }

        //Si se elimina elementos del select
        if(modulosSelectListCurso.value.length > dataModuloItemsID.length){
          // Filtrar los elementos de modulosSelectList.value que no están presentes en listaB
          const elementosFaltantes = modulosSelectListCurso.value.filter(itemA => !dataModuloItemsID.includes(itemA.value));

          for(var i in elementosFaltantes){
            for(var j in modulosSelectListCurso.value){
              if(elementosFaltantes[i].value == modulosSelectListCurso.value[j].value){
                modulosSelectListCurso.value.splice(j, 1); // Eliminar el elemento en la posición j
                break; // Salir del bucle una vez que se elimina el elemento
              }
            }
          }
        }
    }
}

watch(async () => dataModuloCursoModel.value, async () => {
  if(dataModuloCursoModel.value){
    inicializarVideosSelectListCurso()
  }
});

function cambiarPosicion(valor, direccion) {
    const lista = modulosSelectListCurso.value;
    // Buscar el índice del elemento con el valor especificado
    const index = lista.findIndex(item => item.value === valor);
    // Si no se encuentra el valor en la lista, salir de la función
    if (index === -1) {
        console.log("El valor especificado no se encontró en la lista.");
        return;
    }

    // Si la dirección es "arriba" y el elemento no está en la primera posición, intercambiarlo con el elemento anterior
    if (direccion === "arriba" && index > 0) {
        [lista[index], lista[index - 1]] = [lista[index - 1], lista[index]];
    } 
    // Si la dirección es "abajo" y el elemento no está en la última posición, intercambiarlo con el elemento siguiente
    else if (direccion === "abajo" && index < lista.length - 1) {
        [lista[index], lista[index + 1]] = [lista[index + 1], lista[index]];
    }
    // Si la dirección es inválida, mostrar un mensaje de error
    else {
        console.log("La dirección especificada es inválida o el elemento está en el extremo de la lista.");
        return;
    }
}

function obtenerFechas(selectedDates, dateStr, instance) {
    if (selectedDates.length > 1) {
      fechaIFModel.value.fechai = moment(selectedDates[0]).format('DD-MM-YYYY');
      fechaIFModel.value.fechaf = moment(selectedDates[1]).format('DD-MM-YYYY'); 
    }

    if(selectedDates.length == 2){
      fechaIFModel.value.fechasVConfig["minDate"] = selectedDates[1];
      fechaIFModel.value.fechasVModel = [selectedDates[1]];
    }
}

function obtenerFechaVencimiento(selectedDates, dateStr, instance) {
    if (selectedDates.length > 0) {
      fechaIFModel.value.fechaV = moment(selectedDates[0]).format('DD-MM-YYYY');
    }
}

//Cuestionario
watch(async () => searchCuestionarioModel.value, async () => {
  if (!searchCuestionarioModel.value) {
    dataCuestionarioItems.value = cuestionarioItemsCopy.value;
  }else{
    dataCuestionarioItems.value = cuestionarioItemsCopy.value.filter((video) => {
      return (video.title.toLowerCase().indexOf(searchCuestionarioModel.value.toLowerCase()) > -1) || video.value.indexOf(searchCuestionarioModel.value) > -1;
    });
  }
});

watch(selectRefCuestionarioCurso, (active) => {
  if(!active){
    setTimeout(()=>{
      searchCuestionarioModel.value = "";
    }, 1000)
  }
});

//Módulo
watch(async () => searchModuloModel.value, async () => {
  if (!searchModuloModel.value) {
    dataModuloItems.value = moduloItemsCopy.value;
  }else{
    dataModuloItems.value = moduloItemsCopy.value.filter((video) => {
      return (video.title.toLowerCase().indexOf(searchModuloModel.value.toLowerCase()) > -1) || video.value.indexOf(searchModuloModel.value) > -1;
    });
  }
});

watch(selectRefModuloCurso, (active) => {
  if(!active){
    setTimeout(()=>{
      searchModuloModel.value = "";
    }, 1000)
  }
});

function obtenerValorYPosicionCurso() {
    const lista = modulosSelectListCurso.value;
    // Crear un nuevo array para almacenar los objetos con el valor y la posición
    const resultado = [];
    // Iterar sobre la lista y agregar cada elemento al resultado con su valor y posición
    lista.forEach((item, index) => {
        resultado.push({ value: item.value, posicion: index });
    });
    // Devolver el array de objetos con el valor y la posición de cada elemento
    return resultado;
}

// --------------------------------------- MODULOS ------------------------------------------
// -----------------------------------------------------------------------------------------
const searchVideoModel = ref(null)

const selectRefVideoModulo = ref(null);

const dataCuestionarioModuloModel = ref([]);

const duracionModel = ref('');
const categoriaModel = ref('');
const videosModuloModel = ref([]);
const videosModelLoading = ref(false);

const tituloModuloModel = ref(null);
const videosSelectListModulo = ref([]);
const descripcionModuloModel = ref(null);
const thumbnailModel = ref(null);

const videosItems = ref([]);
const videosItemsCopy = ref([]);

function deepClone(o) {
  const output = Array.isArray(o) ? [] : {};
  
  for (let i in o) {
    const value = o[i];   
    output[i] = value !== null && typeof value === 'object' ? deepClone(value) : value;
  }
  return output;
}

async function getVideos(){
  try {
      videosModelLoading.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-elearning.vercel.app/video/all?limit=200&page=1`, requestOptions);
      const data = await response.json();

      videosRaw.value = data.data.reduce((acumulador, actual) => {
        acumulador.push({
          title: `${actual.titulo}`,
          value: actual._id,
        });
        return acumulador;
      }, []);

      videosItems.value = deepClone(videosRaw.value);
      videosFull.value = deepClone(data.data);
      videosItemsCopy.value = videosItems.value;
      videosModelLoading.value = false;
  } catch (error) {
      return console.error(error.message);    
  }
}

// Función para inicializar la lista de videos seleccionados
function inicializarVideosSelectListModulo() {
    const videosItemsLocal = videosItems.value;
    const videosItemsID = videosModuloModel.value;
    //console.log("videosModuloModel", videosModuloModel.value);
    if (videosItemsID && videosItemsID.length > 0) {
        //Si se selecciona nuevos elementos del select
        if(videosSelectListModulo.value.length < videosItemsID.length){
          for(var j in videosItemsLocal){
            if(videosItemsID[videosItemsID.length - 1] == videosItemsLocal[j].value){
              videosSelectListModulo.value.push(videosItemsLocal[j]);
            }
          }
        }

        //Si se elimina elementos del select
        if(videosSelectListModulo.value.length > videosItemsID.length){
          // Filtrar los elementos de videosSelectList.value que no están presentes en listaB
          const elementosFaltantes = videosSelectListModulo.value.filter(itemA => !videosItemsID.includes(itemA.value));

          for(var i in elementosFaltantes){
            for(var j in videosSelectListModulo.value){
              if(elementosFaltantes[i].value == videosSelectListModulo.value[j].value){
                videosSelectListModulo.value.splice(j, 1); // Eliminar el elemento en la posición j
                break; // Salir del bucle una vez que se elimina el elemento
              }
            }
          }
        }
    }
}

watch(async () => videosModuloModel.value, async () => {
  if(videosModuloModel.value){
    inicializarVideosSelectListModulo()
  }
});

function cambiarPosicionModulo(valor, direccion) {
    const lista = videosSelectListModulo.value;
    // Buscar el índice del elemento con el valor especificado
    const index = lista.findIndex(item => item.value === valor);
    // Si no se encuentra el valor en la lista, salir de la función
    if (index === -1) {
        console.log("El valor especificado no se encontró en la lista.");
        return;
    }

    // Si la dirección es "arriba" y el elemento no está en la primera posición, intercambiarlo con el elemento anterior
    if (direccion === "arriba" && index > 0) {
        [lista[index], lista[index - 1]] = [lista[index - 1], lista[index]];
    } 
    // Si la dirección es "abajo" y el elemento no está en la última posición, intercambiarlo con el elemento siguiente
    else if (direccion === "abajo" && index < lista.length - 1) {
        [lista[index], lista[index + 1]] = [lista[index + 1], lista[index]];
    }
    // Si la dirección es inválida, mostrar un mensaje de error
    else {
        console.log("La dirección especificada es inválida o el elemento está en el extremo de la lista.");
        return;
    }
}

function obtenerValorYPosicionModulo() {
    const lista = videosSelectListModulo.value;
    // Crear un nuevo array para almacenar los objetos con el valor y la posición
    const resultado = [];
    // Iterar sobre la lista y agregar cada elemento al resultado con su valor y posición
    lista.forEach((item, index) => {
        resultado.push({ value: item.value, posicion: index });
    });
    // Devolver el array de objetos con el valor y la posición de cada elemento
    return resultado;
}


//-----------------------------------------------VIDEOS-----------------------------------------------
//----------------------------------------------------------------------------------------------------
const idVideoRudoModel = ref('');
const duracionVideoModel = ref('');
const categoriaVideoModel = ref('');
const etiquetasVideoModel = ref('');

const tituloVideoModel = ref(null);
const descripcionVideoModel = ref(null);
const thumbnailVideoModel = ref("https://estadisticas.ecuavisa.com/sites/gestor/Recursos/ecuavisa.com.jpg");

async function getDesafioVideos(){
  try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-elearning.vercel.app/video/all?limit=200&page=1`, requestOptions);
      const data = await response.json();

      //dataVideoList.value = data.data;
      
  } catch (error) {
      return console.error(error.message);    
  }
}
//-------------------------------------------CUESTIONARIO---------------------------------------------
//----------------------------------------------------------------------------------------------------
const tituloCuestionario = ref('');
const descripcionCuestionario = ref('');
const tagsCuestionario = ref([]);
const puntosNecesariosCuestionario = ref(null);
const fechaLimiteCuestionario = ref('');
const limiteTiempoCuestionario = ref(null);
const preguntasCuestionario  = ref([
    {
        pregunta: '',
        puntaje: null,
        respuesta: '',
        opciones: ['','']
    }
]);

//------FUNCIONES
const tag = ref('');

function addTag() {
    tagsCuestionario.value.push(tag.value);
    tag.value = '';
}

function eliminarTag(index) {
    tagsCuestionario.value.splice(index, 1);
    tag.value = '';
}

function resetTag() {
    tagsCuestionario.value = [];
    tag.value = '';
}

function validarArreglo(arreglo) {
    if (arreglo.length === 0) {
        return false;
    }

    for (let i = 0; i < arreglo.length; i++) {
        const pregunta = arreglo[i];
        
        // Verificar si cada campo está lleno y no es null
        if (!pregunta.pregunta || pregunta.pregunta.trim() === '' ||
            pregunta.puntaje === null ||
            !pregunta.respuesta || pregunta.respuesta.trim() === '' ||
            !pregunta.opciones || pregunta.opciones.length < 2) {
            return false;
        }

        // Verificar si el arreglo de opciones tiene al menos 2 elementos no vacíos
        const opcionesLlenas = pregunta.opciones.filter(opcion => opcion && opcion.trim() !== '');
        if (opcionesLlenas.length < 2) {
            return false;
        }
    }

    return true;
}
function resolveAddPregunta(){   
    //console.log("select" , tipoCondicion.value);
    let nuevaPregunta = {
        pregunta: '',
        puntaje: null,
        respuesta: '',
        opciones: ['','']
    };
       
    preguntasCuestionario.value.push(nuevaPregunta);
}    
function resolveAñadirOpcion(index){
    
    //console.log("select" , tipoCondicion.value);
    let nuevaOpcion = '';
       
    preguntasCuestionario.value[index].opciones.push(nuevaOpcion);
}

function eliminarPregunta (index){
    preguntasCuestionario.value.splice(index, 1);
}

function eliminarOpcion (index, index1){
    preguntasCuestionario.value[index].opciones.splice(index1, 1);
}
//-----------------------------------------------LOCAL------------------------------------------------
//----------------------------------------------------------------------------------------------------


const modulosRaw = ref([]);

const modulosFull = ref([]);
const modulosGeneradosLocal = ref([]);
const modulosGeneradosLocalFull = ref([]);

const videosRaw = ref([]);

const videosFull = ref([]);
const videosGeneradosLocal = ref([]);
const videosGeneradosLocalFull = ref([]);

const cursoLocal = ref({});


const codigosGenerados = new Set();
function generarCodigoAleatorioUnico(longitud) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const caracteresLength = caracteres.length;

    let codigo;
    do {
        let resultado = '';
        for (let i = 0; i < longitud; i++) {
            resultado += caracteres.charAt(Math.floor(Math.random() * caracteresLength));
        }
        codigo = resultado;
    } while (codigosGenerados.has(codigo));

    codigosGenerados.add(codigo);
    return codigo;
}

function obtenerValorYPosicionLocal(lista) {
    //const lista = modulosSelectListCurso.value;
    // Crear un nuevo array para almacenar los objetos con el valor y la posición
    const resultado = [];
    // Iterar sobre la lista y agregar cada elemento al resultado con su valor y posición
    lista.forEach((item, index) => {
        resultado.push({ value: item.value, posicion: index });
    });
    // Devolver el array de objetos con el valor y la posición de cada elemento
    return resultado;
}

function resetFormVideo(){
  idVideoRudoModel.value = null;
  duracionVideoModel.value = null;
  categoriaVideoModel.value = '';
  etiquetasVideoModel.value = '';
  tituloVideoModel.value = null;
  descripcionVideoModel.value = null;
}

function guardarLocalVideo (){
  if (
        !categoriaVideoModel.value || 
        !idVideoRudoModel.value || 
        !descripcionVideoModel.value || 
        !thumbnailVideoModel.value || 
        !duracionVideoModel.value
      ){
        configSnackbar.value = {
            message: "Llenar todos los campos para crear el video",
            type: "error",
            model: true
        };
        return false;
    }  
  var id = generarCodigoAleatorioUnico(10);  
  videosFull.value.push({
    _id: id,
    titulo: tituloVideoModel.value,
    descripcion: descripcionVideoModel.value,
    idRudo: idVideoRudoModel.value,
    thumbnail: thumbnailVideoModel.value,
    duracion: duracionVideoModel.value,
    categoria: categoriaVideoModel.value,
    etiquetas: etiquetasVideoModel.value
  });

  videosItems.value.push({
    title: tituloVideoModel.value,
    value: id
  });

  videosGeneradosLocal.value.push({
    titulo: tituloVideoModel.value,
    descripcion: descripcionVideoModel.value,
    idRudo: idVideoRudoModel.value,
    thumbnail: thumbnailVideoModel.value,
    duracion: duracionVideoModel.value,
    categoria: categoriaVideoModel.value,
    etiquetas: etiquetasVideoModel.value    
  });

  console.log("videosGeneradosLocal", videosGeneradosLocal.value);
  resetFormVideo()
}
function resetFormModulo(){
  tituloModuloModel.value = null;
  dataCuestionarioModuloModel.value = null;
  descripcionModuloModel.value = null;
  videosModuloModel.value = [];
  videosSelectListModulo.value = [];	
}
function guardarLocalModulo (){
  if (
        !tituloModuloModel.value || 
        !descripcionModuloModel.value || 
        !videosModuloModel.value
      ){
        configSnackbar.value = {
            message: "Llenar todos los campos para crear el módulo",
            type: "error",
            model: true
        };
        return false;
    }
    var id = generarCodigoAleatorioUnico(10);
    modulosFull.value.push({
      _id: id,
      titulo: tituloModuloModel.value,
      descripcion: descripcionModuloModel.value,
      idCuestionario: dataCuestionarioModuloModel.value || null,
      videos: obtenerValorYPosicionModulo()
    });

    dataModuloItems.value.push({
      title: tituloModuloModel.value,
      value: id
    });

    modulosGeneradosLocal.value.push({
      titulo: tituloModuloModel.value,
      descripcion: descripcionModuloModel.value,
      idCuestionario: dataCuestionarioModuloModel.value || null,
      videos: obtenerValorYPosicionModulo()
    });

    console.log("modulosGeneradosLocal", modulosGeneradosLocal.value);
    resetFormModulo();
}

async function onApply() {
  //Validar curso
  if (
        !categoriaCursoModel.value || 
        !idCursoRudoModel.value || 
        !descripcionCursoModel.value || 
        !thumbnailCursoModel.value || 
        !dataCuestionarioCursoModel.value || 
        !duracionCursoModel.value
      ){
        configSnackbar.value = {
            message: "Llenar todos los campos del curso para crear el registro",
            type: "error",
            model: true
        };
        return false;
    }

    console.log("modulosFull" , modulosFull.value);
    console.log("videosFull" , videosFull.value);
    var modulosSelected = obtenerValorYPosicionCurso();
    console.log("modulosSelected" , modulosSelected);
    var modulosResult = modulosFull.value.filter(fullItem => 
      modulosSelected.some(selectedItem => selectedItem.value === fullItem._id)
    );

    var videosSelected =  modulosResult.map(item => item.videos.map(video => video.value));
    console.log("videosSelected" , videosSelected);
    var videosResult = videosFull.value.filter(fullItem =>
      videosSelected.some(selectedItem => selectedItem.value === fullItem._id)
    );

    console.log("videosResult" , videosResult);

    modulosResult.videos = videosResult;


    let curso = {
          titulo: tituloCursoModel.value,
          descripcion: descripcionCursoModel.value,
          idRudo: idCursoRudoModel.value,
          thumbnail: thumbnailCursoModel.value,
          duracion: duracionCursoModel.value,
          categoria: categoriaCursoModel.value,
          etiquetas: etiquetasCursoModel.value,
          idCuestionario: dataCuestionarioCursoModel.value,
          fechai: fechaIFModel.value.fechai,
          fechaf: fechaIFModel.value.fechaf,
          fechaVencimiento: fechaIFModel.value.fechaV,
          estado: estadoCursoModel.value,
          modulos: modulosResult
    }  

    cursoLocal.value = curso;   
    console.log("curso" , cursoLocal.value);
}


//-----------------------------------------------SEND-------------------------------------------------
//----------------------------------------------------------------------------------------------------
async function onComplete() {
  //Validar curso
  if (
        !categoriaCursoModel.value || 
        !idCursoRudoModel.value || 
        !descripcionCursoModel.value || 
        !thumbnailCursoModel.value || 
        !dataCuestionarioCursoModel.value || 
        !duracionCursoModel.value
      ){
        configSnackbar.value = {
            message: "Llenar todos los campos del curso para crear el registro",
            type: "error",
            model: true
        };
        return false;
    }
  //Validar modulo  
  if (
        !tituloModuloModel.value || 
        !descripcionModuloModel.value || 
        !videosModuloModel.value
      ){
        configSnackbar.value = {
            message: "Llenar todos los campos del módulo para crear el registro",
            type: "error",
            model: true
        };
        return false;
    }
  //Validar video  
  if (
        !categoriaVideoModel.value || 
        !idVideoRudoModel.value || 
        !descripcionVideoModel.value || 
        !thumbnailVideoModel.value || 
        !duracionVideoModel.value
      ){
        configSnackbar.value = {
            message: "Llenar todos los campos del video para crear el registro",
            type: "error",
            model: true
        };
        return false;
    }  
    //Validar cuestionario
    let preguntasEnviar = preguntasCuestionario.value; 
    let tituloValid = tituloCuestionario.value;

    if(!Array.isArray(tagsCuestionario.value) && tagsCuestionario.value != null && tagsCuestionario.value != ""){
        tagsCuestionario.value = [tagsCuestionario.value];
    }

    if (!validarArreglo(preguntasEnviar) || !tituloValid || tituloValid == "" || !descripcionCuestionario.value || tagsCuestionario.value.length == 0
     || puntosNecesariosCuestionario.value == null || fechaLimiteCuestionario.value == '' || limiteTiempoCuestionario.value == null) {
        configSnackbar.value = {
                    message: "Debe llenar todos los campos del cuestionario",
                    type: "error",
                    model: true
                };
        return false;
    } 

    puntosNecesariosCuestionario.value = parseInt(puntosNecesariosCuestionario.value);

    let preguntasFormated = preguntasEnviar.map(item => ({
    ...item, 
    puntaje: parseInt(item.puntaje) 
    })); 

    //JSONS para crear registro
    let jsonEnviarCurso = {
          "titulo": tituloCursoModel.value,
          "descripcion": descripcionCursoModel.value,
          "idRudo": idCursoRudoModel.value,
          "thumbnail": thumbnailCursoModel.value,
          "duracion": duracionCursoModel.value,
          "categoria": categoriaCursoModel.value,
          "etiquetas": etiquetasCursoModel.value,
          "idCuestionario": dataCuestionarioCursoModel.value,
          "fechai": fechaIFModel.value.fechai,
          "fechaf": fechaIFModel.value.fechaf,
          "fechaVencimiento": fechaIFModel.value.fechaV,
          "estado": estadoCursoModel.value,
          "modulos": obtenerValorYPosicionCurso()
    }  

    let jsonEnviarModulo = {
          "titulo": tituloModuloModel.value,
          "descripcion": descripcionModuloModel.value,
          "idCuestionario": dataCuestionarioModuloModel.value || null,
          "videos": obtenerValorYPosicionModulo()
    }

    let jsonEnviarVideo = {
          "titulo": tituloVideoModel.value,
          "descripcion": descripcionVideoModel.value,
          "idRudo": idVideoRudoModel.value,
          "thumbnail": thumbnailVideoModel.value,
          "duracion": duracionVideoModel.value,
          "categoria": categoriaVideoModel.value,
          "etiquetas": etiquetasVideoModel.value
    }

    let jsonEnviarCuestionario ={
            "titulo": tituloCuestionario.value,
            "descripcion": descripcionCuestionario.value,
            "tags": tagsCuestionario.value,
            "puntosNecesarios": puntosNecesariosCuestionario.value,
            "preguntas": preguntasFormated,
            "fechaLimite": fechaLimiteCuestionario.value,
            "limiteTiempo": limiteTiempoCuestionario.value 
        }

    console.log('curso nuevo',jsonEnviarCurso);
    console.log('modulo nuevo',jsonEnviarModulo);
    console.log('video nuevo',jsonEnviarVideo);
    console.log('cuestionario nuevo',jsonEnviarCuestionario);
    //location.reload();
    //return;
    const sendCurso = await fetch('https://servicio-elearning.vercel.app/curso/create', {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify(jsonEnviarCurso),
              redirect: 'follow'
      });
    const sendModulo = await fetch('https://servicio-elearning.vercel.app/modulo/create', {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify(jsonEnviarModulo),
              redirect: 'follow'
      });
    const sendVideo = await fetch('https://servicio-elearning.vercel.app/video/create', {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify(jsonEnviarVideo),
              redirect: 'follow'
      });  
    const sendCuestionario = await fetch('https://e-learning-cuestionario.vercel.app/cuestionarios/create', {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify(jsonEnviarCuestionario),
              redirect: 'follow'
      });  

    const respuestaCurso = await sendCurso.json();  
    const respuestaModulo = await sendModulo.json();
    const respuestaVideo = await sendVideo.json(); 
    const respuestaCuestionario = await sendCuestionario.json();  

    
    if (respuestaCurso.resp && respuestaModulo.resp && respuestaVideo.resp && respuestaCuestionario.resp) {
            configSnackbar.value = {
                message: "Registros creados correctamente",
                type: "success",
                model: true
            };
            setTimeout(location.reload(), 1500);

    } else if(!respuestaCurso.resp) {
            configSnackbar.value = {
                message: respuestaCurso.mensaje,
                type: "error",
                model: true
            };
            console.error(respuestaCurso.error);
            return false;
    } else if(!respuestaModulo.resp) {
            configSnackbar.value = {
                message: respuestaModulo.mensaje,
                type: "error",
                model: true
            };
            console.error(respuestaModulo.error);
            return false;
    } else if(!respuestaVideo.resp) {
            configSnackbar.value = {
                message: respuestaVideo.mensaje,
                type: "error",
                model: true
            };
            console.error(respuestaVideo.error);
            return false;
    } else if(!respuestaCuestionario.resp) {
            configSnackbar.value = {
                message: respuestaCuestionario.mensaje,
                type: "error",
                model: true
            };
            console.error(respuestaCuestionario.error);
            return false;
    }
}
</script>

<template>
    <section>
        
        <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 2500" :color="configSnackbar.type">
            {{ configSnackbar.message }}
        </VSnackbar>
        <VCard>
    <VRow class="mt-5">
      <VCol cols="12" md="4" :class="$vuetify.display.smAndDown ? 'border-b' : 'border-e'">
        <VCardText>
         <!-- Stepper Navigation -->
         <div>
            <div v-for="(step, index) in steps" :key="index" @click="currentStep = index" :class="['stepper-step', { active: currentStep === index }]">
              <VIcon :icon="step.icon" class="stepper-icon" />
              <div>
                <div class="stepper-title">{{ step.title }}</div>            
              </div>
            </div>
          </div>
        </VCardText>
      </VCol>
      <!-- Stepper Content -->
      <VCol class="pr-10" cols="12" md="8">
        <VCardText>
          <VForm @submit.prevent="onComplete">
            <div v-if="currentStep === 0">
              <!-- Curso -->
              <VRow>
                <VCol cols="12">
                  <h6 class="text-h6 font-weight-medium">Crear el curso</h6>
                </VCol>
                <VCol cols="12">
                  <AppDateTimePicker 
                    label="Fecha de inicio y fin del curso" 
                    prepend-inner-icon="tabler-calendar" 
                    density="compact" 
                    v-model="fechaIFModel.fechasModel"
                    show-current=true 
                    @on-change="obtenerFechas" 
                    :config="{
                      position: 'auto right',
                      mode: 'range',
                      altFormat: 'd F j, Y',
                      dateFormat: 'l, j \\d\\e F \\d\\e Y',
                      valueFormat: 'd-m-Y',
                      reactive: true
                    }" />
                </VCol>
                <VCol cols="6">
                  <AppDateTimePicker 
                    label="Fecha de vencimiento" 
                    prepend-inner-icon="tabler-calendar" 
                    density="compact" 
                    v-model="fechaIFModel.fechasVModel"
                    show-current=true 
                    @on-change="obtenerFechaVencimiento" 
                    :config="fechaIFModel.fechasVConfig" />
                </VCol>
                <VCol cols="6">
                  <VSwitch v-model="estadoCursoModel" label="Estado del curso" />
                </VCol>
                <VCol cols="6">
                  <VTextField v-model="tituloCursoModel" label="Título del curso" />
                </VCol>
                <VCol cols="6">
                  <VTextField v-model="descripcionCursoModel" label="Descripción" />
                </VCol>
                <VCol class="img-preview-container" cols="6">
                  <VTextField v-model="thumbnailCursoModel" label="Imagen principal" />
                  <img v-if="thumbnailCursoModel" class="img-preview" :src="thumbnailCursoModel">
                </VCol>
                <VCol cols="6">
                  <VTextField v-model="idCursoRudoModel" label="Id video de RUDO" />
                </VCol>
                <VCol cols="12">
                  <VTextField v-model="duracionCursoModel" label="Tiempo que dura el curso" suffix="minutos" append-inner-icon="tabler-clock" type="number" />
                </VCol>
                <VCol cols="12">
                  <VCombobox 
                    v-model="categoriaCursoModel" 
                    :items="categoriasItems" 
                    chips
                    label="Seleccione la categoría del curso"
                    :menu-props="{ maxHeight: '300' }" 
                    @keydown.enter.prevent="categoriaModel"
                    :disabled="categoriaModelLoading"
                    append-icon="mdi-refresh"
                    @click:append="getCategorias"
                  />
                </VCol>
                <VCol cols="12">
                  <VCombobox 
                    item-text="title"
                    item-value="value"
                    v-model="etiquetasCursoModel" 
                    :items="etiquetasItems"
                    chips
                    multiple
                    label="Etiquetas del curso" 
                    :menu-props="{ maxHeight: '300' }"
                    :disabled="etiquetasModelLoading"
                    append-icon="mdi-refresh"
                    @click:append="getEtiquetas"
                  />
                </VCol>
                <VCol cols="12">
                  <VSelect
                    v-model:menu="selectRefCuestionarioCurso"
                    no-data-text="No existen cuestionario que mostrar"
                    append-icon="mdi-refresh"
                    @click:append="getCuestionario"
                    :disabled="cuestionarioModelLoading"
                    item-text="title"
                    item-value="value"
                    v-model="dataCuestionarioCursoModel" 
                    :items="dataCuestionarioItems"
                    label="Cuestionario para al final del curso"
                    :menu-props="{ maxHeight: '400' }">
                    <template v-slot:prepend-item>
                      <VListItem>
                        <VListItemContent>
                          <VTextField v-model="searchCuestionarioModel" clearable placeholder="Buscar cuestionario"/>
                        </VListItemContent>
                      </VListItem>
                      <VDivider class="mt-2"></VDivider>
                    </template>
                    <template #selection="{ item }">
                      <div>
                        {{ item.title }} - {{ item.value }}
                      </div>
                    </template>
                    <template #item="{ item, props }">
                      <VListItem v-bind="props">
                        <VListItemContent>
                          <VListItemSubtitle>
                            <p>_id: {{ item.value }}</p>
                          </VListItemSubtitle>
                        </VListItemContent>
                      </VListItem>
                    </template>
                  </VSelect>
                </VCol>
                <VCol cols="12">
                  <VRow>
                    <VCol cols="12">
                      <VSelect
                        v-model:menu="selectRefModuloCurso"
                        no-data-text="No existen módulo que mostrar"
                        append-icon="mdi-refresh"
                        @click:append="getModulos"
                        :disabled="moduloModelLoading"
                        item-text="title"
                        item-value="value"
                        v-model="dataModuloCursoModel" 
                        :items="dataModuloItems"
                        chips
                        multiple
                        label="Módulos educativos"
                        :menu-props="{ maxHeight: '400' }">
                        <template v-slot:prepend-item>
                          <VListItem>
                            <VListItemContent>
                              <VTextField v-model="searchModuloModel" clearable placeholder="Buscar módulo"/>
                            </VListItemContent>
                          </VListItem>
                          <VDivider class="mt-2"></VDivider>
                        </template>
                        <template #selection="{ item }">
                          <div>
                            {{ item.title }} - {{ item.value }}
                          </div>
                        </template>
                        <template #item="{ item, props }">
                          <VListItem v-bind="props">
                            <VListItemContent>
                              <VListItemSubtitle>
                                <p>_id: {{ item.value }}</p>
                              </VListItemSubtitle>
                            </VListItemContent>
                          </VListItem>
                        </template>
                      </VSelect>
                    </VCol>
                    
                  </VRow>
                </VCol>
                <VCol cols="12" v-if="dataModuloCursoModel.length > 0">
                  <VList lines="two" border>
                    <template v-for="(videoSelect, index) of modulosSelectListCurso" :key="videoSelect.value">
                      <VListItem>
                        <template #prepend>
                          <VIcon :size="35" icon="mdi-sale" color="success" />
                        </template>
                        <VListItemTitle>
                          {{ videoSelect.title }}
                        </VListItemTitle>
                        <VListItemSubtitle class="mt-1">
                          <VBadge dot location="start center" offset-x="2" color="success" class="me-3">
                            <span class="ms-4">Módulo</span>
                          </VBadge>
                          <span class="text-xs text-disabled">{{ videoSelect.value }}</span>
                        </VListItemSubtitle>
                        <template #append>
                          <div class="btn-order" style="">
                            <VBtn size="x-small" :disabled="index == 0" variant="text" @click="cambiarPosicion(videoSelect.value, 'arriba')">
                              <VIcon :size="25" icon="mdi-arrow-up-bold-box" />
                            </VBtn>
                            <VBtn size="x-small" :disabled="index == modulosSelectListCurso.length - 1" variant="text" @click="cambiarPosicion(videoSelect.value, 'abajo')">
                              <VIcon :size="25" icon="mdi-arrow-down-bold-box" />
                            </VBtn>
                          </div>
                        </template>
                      </VListItem>
                      <VDivider v-if="index !== modulosSelectListCurso.length - 1" />
                    </template>
                  </VList>
                </VCol>
              </VRow>
            </div>
            <div v-if="currentStep === 1">
              <!-- Video -->
              <VRow>
                <VCol class="d-flex justify-space-between" cols="12">
                  <h6 class="text-h6 font-weight-medium">Crear el video</h6>
                  <VBtn @click="guardarLocalVideo">
                    Guardar
                  </VBtn>
                </VCol>
                                      <VCol cols="6">
                                        <VTextField v-model="tituloVideoModel" label="Título del video" />
                                      </VCol>

                                      <VCol cols="6">
                                        <VTextField v-model="descripcionVideoModel" label="Descripción" />
                                      </VCol>
                                      
                                      <!-- <VCol cols="12">
                                        <VTextField v-model="thumbnailModel" label="Imagen principal" />
                                      </VCol> -->

                                      <VCol cols="12" >
                                          <VTextField v-model="idVideoRudoModel" label="Id video de RUDO" />
                                      </VCol>

                                      <VCol cols="12">
                                        <VTextField v-model="duracionVideoModel" label="Tiempo en minutos del video" suffix="minutos" append-inner-icon="tabler-clock" type="number" />
                                      </VCol>

                                      <VCol cols="12" >
                                          <VCombobox 
                                          v-model="categoriaVideoModel" 
                                          :items="categoriasItems" 
                                          chips
                                          label="Seleccione la categoría del video"
                                          :menu-props="{ maxHeight: '300' }" 
                                          @keydown.enter.prevent="categoriaVideoModel"
                                          :disabled="categoriaModelLoading"
                                          append-icon="mdi-refresh"
                                          @click:append="getCategorias"
                                          />
                                      </VCol>

                                      <VCol cols="12" >
                                          <VCombobox 
                                            item-text="title"
                                            item-value="value"
                                            v-model="etiquetasVideoModel" 
                                            :items="etiquetasItems"
                                            chips
                                            multiple
                                            label="Etiquetas"
                                            :menu-props="{ maxHeight: '300' }"
                                            :disabled="etiquetasModelLoading"
                                            append-icon="mdi-refresh"
                                            @click:append="getEtiquetas" />
                                      </VCol>
         
                                
              </VRow>
            </div>
            <div v-if="currentStep === 2">
              <!-- Modulo -->
              <VRow>
                <VCol class="d-flex justify-space-between" cols="12">
                  <h6 class="text-h6 font-weight-medium">Crear el módulo</h6>
                  <VBtn @click="guardarLocalModulo">
                    Guardar
                  </VBtn>
                </VCol>
                                  <VRow>
                                      <VCol cols="6">
                                        <VTextField v-model="tituloModuloModel" label="Título del modulo" />
                                      </VCol>

                                      <VCol cols="6">
                                        <VTextField v-model="descripcionModuloModel" label="Descripción" />
                                      </VCol>

                                      <VCol cols="12" >
                                          <VSelect 
                                            v-model:menu="selectRefCuestionarioCurso"
                                            no-data-text="No existen cuestionario que mostrar"
                                            append-icon="mdi-refresh"
                                            item-text="title"
                                            item-value="value"
                                            v-model="dataCuestionarioModuloModel" 
                                            :items="dataCuestionarioItems"
                                            :disabled="cuestionarioModelLoading"
                                            label="Cuestionario para al final del módulo"
                                            clearable                                          
                                            @click:append="getCuestionario"
                                            :menu-props="{ maxHeight: '400' }">
                                            <template v-slot:prepend-item>
                                              <v-list-item>
                                                <v-list-item-content>
                                                  <VTextField v-model="searchCuestionarioModel" clearable placeholder="Buscar cuestionario"/>
                                                </v-list-item-content>
                                              </v-list-item>
                                              <v-divider class="mt-2"></v-divider>
                                            </template>
                                            <template #selection="{ item }">
                                                  <div>
                                                      {{ item.title }} - {{ item.value }}
                                                  </div>
                                              </template>
                                              <template #item="{ item, props }">
                                                  <v-list-item v-bind="props">
                                                      <v-list-item-content>
                                                          <v-list-item-subtitle>
                                                              <p>_id: {{ item.value }}</p>
                                                          </v-list-item-subtitle>
                                                      </v-list-item-content>
                                                  </v-list-item>
                                              </template>
                                          </VSelect>
                                      </VCol>

                                      <VCol cols="12">
                                        <VRow>
                                            <VCol cols="12" >
                                              <VSelect 
                                                v-model:menu="selectRefVideoModulo"
                                                item-text="title"
                                                item-value="value"
                                                v-model="videosModuloModel" 
                                                :items="videosItems"
                                                chips
                                                multiple
                                                attach
                                                label="Videos educativos"
                                                no-data-text="No existen videos que mostrar"
                                                append-icon="mdi-refresh"
                                                @click:append="getVideos"
                                                :disabled="videosModelLoading"
                                                :menu-props="{ maxHeight: '300' }">
                                                <template v-slot:prepend-item>
                                                  <v-list-item>
                                                    <v-list-item-content>
                                                      <VTextField v-model="searchVideoModel" clearable placeholder="Buscar video"/>
                                                    </v-list-item-content>
                                                  </v-list-item>
                                                  <v-divider class="mt-2"></v-divider>
                                                </template>
                                                <template #selection="{ item }">
                                                      <div>
                                                          {{ item.title }} - {{ item.value }}
                                                      </div>
                                                  </template>
                                                  <template #item="{ item, props }">
                                                      <v-list-item v-bind="props">
                                                          <v-list-item-content>
                                                              <v-list-item-subtitle>
                                                                  <p>_id: {{ item.value }}</p>
                                                              </v-list-item-subtitle>
                                                          </v-list-item-content>
                                                      </v-list-item>
                                                  </template>
                                              </VSelect>
                                            </VCol>                                      
                                          </VRow>
                                        
                                      </VCol>

                                      <VCol cols="12" v-if="videosModuloModel.length > 0">
                                        <VList
                                          lines="two"
                                          border
                                        >
                                          <template
                                            v-for="(videoSelect, index) of videosSelectListModulo"
                                            :key="videoSelect.value"
                                          >
                                            <VListItem>
                                              <template #prepend>
                                                <VIcon
                                                  :size="35"
                                                  icon="mdi-file-video"
                                                  color="success"
                                                />
                                              </template>
                                              <VListItemTitle>
                                                {{ videoSelect.title }}
                                              </VListItemTitle>
                                              <VListItemSubtitle class="mt-1">
                                                <VBadge
                                                  dot
                                                  location="start center"
                                                  offset-x="2"
                                                  color="success"
                                                  class="me-3"
                                                >
                                                  <span class="ms-4">Video</span>
                                                </VBadge>

                                                <span class="text-xs text-disabled">{{ videoSelect.value }}</span>
                                              </VListItemSubtitle>

                                              <template #append>
                                                <div class="btn-order" style="">
                                                  <VBtn size="x-small" :disabled="index == 0" variant="text" @click="cambiarPosicionModulo(videoSelect.value, 'arriba')">
                                                    <VIcon :size="25" icon="mdi-arrow-up-bold-box" />
                                                  </VBtn>
                                                  <VBtn size="x-small" :disabled="index == videosSelectListModulo.length - 1" variant="text" @click="cambiarPosicionModulo(videoSelect.value, 'abajo')">
                                                    <VIcon :size="25" icon="mdi-arrow-down-bold-box" />
                                                  </VBtn>
                                                </div>
                                              </template>
                                            </VListItem>
                                            <VDivider v-if="index !== videosSelectListModulo.length - 1" />
                                          </template>
                                        </VList>
                                      </VCol>
         
                                  </VRow>                         
                              </VRow>
            </div>
            <div v-if="currentStep === 3">
              <!-- Cuestionario -->
              <VRow>
                <VRow>
                  <VCol cols="12">
                  <h6 class="text-h6 font-weight-medium">Crear el cuestionario</h6>
                  </VCol>
                                                                    
                                                                    <VCol cols="6" >
                                                                        <VTextField v-model="tituloCuestionario" label="Título" placeholder="Título del cuestionario" />
                                                                    </VCol>
                                
                                                                    <VCol cols="6" >
                                                                        <VTextField v-model="puntosNecesariosCuestionario" label="Puntos necesarios" type="number"/>
                                                                    </VCol>
                                
                                                                    <VCol cols="6" >
                                                                        <VTextField v-model="fechaLimiteCuestionario" label="Fecha límite" type="date"/>
                                                                    </VCol>
                                
                                                                    <VCol cols="6" >
                                                                        <VTextField v-model="limiteTiempoCuestionario" label="Límite de tiempo" type="number"/>
                                                                    </VCol>
                                
                                                                    <VCol cols="12" >
                                                                        <VTextField v-model="descripcionCuestionario" label="Descripción" placeholder="Descripción del cuestionario"/>
                                                                    </VCol>
                                                             
                                                                    <VCol cols="12" >
                                                                        <p><h4>Ingrese los Tags</h4></p>
                                                                        <div class="d-flex flex-wrap gap-1 items-center mb-2">
                                                                            <p class="my-1"><h5>Tags: </h5></p>
                                                                            <VChip v-for="(tag, index) in tagsCuestionario" :key="tag" class="custom-chip" title="Eliminar tag" color="success" closable @click:close="eliminarTag(index)">
                                                                                {{ tag }}
                                                                            </VChip>
                                                                        </div>
                                                                        <div class="d-flex flex-nowrap gap-2 items-center mb-2">
                                                                            <VTextField v-model="tag" label="Ingrese un tag" /> 
                                                                            <VBtn class="ml-auto" color="primary" prepend-icon="tabler-plus" variant="tonal" @click="addTag" >
                                                                            Añadir tag
                                                                            </VBtn>
                                                                            <VBtn class="ml-auto" color="primary" variant="tonal" @click="resetTag" >
                                                                                <VIcon icon="tabler-refresh" size="22" />
                                                                            </VBtn>
                                                                        </div>
                                                                        
                                                                    </VCol>
                                                             
                                                                    <VCol cols="12" class="d-flex">
                                                                        <div class="d-flex align-content-end flex-wrap"><h4>Preguntas</h4></div>
                                                                                             
                                                                        <VBtn class="ml-auto" color="primary" prepend-icon="tabler-plus" variant="tonal" @click="resolveAddPregunta" >
                                                                        Añadir pregunta
                                                                        </VBtn>                                                                     
                                                                        
                                                                    </VCol>    
                                                                    <VDivider/>
                                                                    <div v-for="(p, index) in preguntasCuestionario" cols="12" class="w-100 my-4 item-cards"> 
                                                                        <VBtn v-if="preguntasCuestionario.length > 1" class="ml-auto boton-eleminar-itemsCards" size="38" color="error" @click="eliminarPregunta(index)"><VIcon icon="tabler-x" size="22" /></VBtn>
                                                                        
                                                                        <VCardText>
                                                                            <VCol cols="12">
                                                                                <VTextField class="mt-2" v-model="p.pregunta" label="Pregunta" placeholder="Escriba la pregunta" />
                                                                            </VCol>     
                                                                            
                                                                            <VCol cols="12" >
                                                                                <VTextField class="mt-2" v-model="p.puntaje" label="Puntaje" type="number"/>        
                                                                            </VCol>  
                                                                            
                                                                            <VCol cols="12" >
                                                                                <VTextField  v-model="p.respuesta" label="Respuesta" placeholder="Escriba la respuesta" />
                                                                            </VCol>
                                
                                                                            <VCol cols="12" class="d-flex">
                                                                                <div class="d-flex align-content-end flex-wrap"><h4>Opciones</h4></div>
                                                                                                    
                                                                                <VBtn class="ml-auto" color="primary" prepend-icon="tabler-plus" variant="tonal" @click="resolveAñadirOpcion(index)" >
                                                                                Añadir opción
                                                                                </VBtn>                                                                     
                                                                          
                                                                            </VCol>    
                                                                            <VDivider v-if="p.opciones.length > 0" />
                                
                                                                            <div v-for="(o, index1) in p.opciones" cols="12" > 
                                                                                                              
                                                                                <VCardText class="text-center ml-4 my-4">
                                                                                    <VRow>
                                                                                    <VCol cols="8">
                                                                                        <VTextField  v-model="p.opciones[index1]" :label="'Opción '+ (index1 + 1)" placeholder="Escriba la opción" />
                                                                                    </VCol>
                                                                                    <VCol cols="4" v-if="p.opciones.length > 2">
                                                                                        <VBtn  size="38" color="error" @click="eliminarOpcion(index, index1)"><VIcon icon="tabler-x" size="22" /></VBtn> 
                                                                                    </VCol>   
                                                                                    </VRow>    
                                                                                                                                      
                                                                                </VCardText>  
                                           
                                                                            </div>
                                
                                                                        </VCardText>   
                                                                    </div>
                                                                                       
                                                                </VRow>
              </VRow>
            </div>
            <!-- Add more steps here as needed -->
            <!-- Stepper Controls -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4 mt-8">
              <VBtn style="margin-left: auto;" @click="onApply">
                    Aplicar
              </VBtn>
              <VBtn color="secondary" :disabled="currentStep === 0" @click="currentStep--">
                <VIcon icon="tabler-arrow-left" start class="flip-in-rtl" /> Anterior
              </VBtn>
              <VBtn type="submit" v-if="currentStep === steps.length - 1" color="success">
                Enviar
              </VBtn>
              <VBtn v-else @click="currentStep++">
                Siguiente
                <VIcon icon="tabler-arrow-right" end class="flip-in-rtl" />
              </VBtn>
            </VCol>
          </VForm>
        </VCardText>
      </VCol>
    </VRow>
  </VCard>
                    
    </section>
</template>

<style>  
 
.clickable {
  cursor: pointer;
}

.respuesta-card {
    border: 3px solid rgba(var(--v-border-color), var(--v-hover-opacity));; 
    border-radius: 6px; 
    background-color: transparent; 
}

.item-cards {
  background:  rgba(var(--v-border-color), var(--v-hover-opacity));
  box-shadow: none !important;
  border-radius: 6px;
}

.item-cards-small {
  background:  rgba(var(--v-border-color), var(--v-hover-opacity));
  box-shadow: none !important;
  border-radius: 2px;
}

.boton-eleminar-itemsCards{
    height: 38px;
    width: 38px;
    display: block;
    margin: -11px;
}

.v-theme--light .item-cards{
   background:   #f2f2f2;
}

.v-theme--light.v-field{
    background: #fff;
}
.v-card-text{
    padding: 0px 10px;
}

@media screen and (max-width: 1000px) {
  .container {
   min-width: 90svw; 
  }
  .mdContainer {
    min-width: 100px;  
  }
}
.open.flatpickr-calendar {
    z-index: 100000;
}.stepper-nav {
  background-color: #2a2d3b;
  padding: 16px;
  border-radius: 8px;
}
.stepper-step {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 8px;
  transition: background-color 0.3s;
}
.stepper-step.active,
.stepper-step:hover {
  background-color: #3a3f51;
}
.stepper-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-right: 10px;
}
.stepper-title {
  font-size: 16px;
  font-weight: 500;
}
.stepper-description {
  font-size: 12px;
  color: #b0b0b0;
}

</style>