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
    title: 'Crear cuestionario',
    icon: 'tabler-clipboard-text',
    //subtitle: 'Add social links',
  },
  {
    title: 'Crear módulo',
    icon: 'tabler-file',
    //subtitle: 'Add personal info',
  },
  {
    title: 'Cuestionario Final',
    icon: 'tabler-clipboard-text',
    //subtitle: 'Add social links',
  }
]    

function deepClone(o) {
  const output = Array.isArray(o) ? [] : {};
  
  for (let i in o) {
    const value = o[i];   
    output[i] = value !== null && typeof value === 'object' ? deepClone(value) : value;
  }
  return output;
}
// --------------------------------------- CURSOS ------------------------------------------
// -----------------------------------------------------------------------------------------

/*FILE INPUT*/
const editingImage = ref(false); // Modo de edición de imagen
const isEditing = ref(false); // Indica si estamos editando
var files = [];
const imageUrl = ref(''); // URL de la imagen existente (se llenará al editar)
const cambioImagen = ref(false); // URL de la imagen existente (se llenará al editar)
const fileInputRef = ref(null);// Referencia para el VFileInput
const fileInputIsValid = ref(true);
const rules = [fileList => !fileList || !fileList.length || fileList[0].size <= 1000000 || 'La imagen no debe superar a 1 MB!']
/*FILE INPUT*/

const isDialogVisibleAddModulo = ref(false)

const categoriaModelLoading = ref(false);
const etiquetasModelLoading = ref(false);

const fechaHoy = moment().format("YYYY-MM-DD");
const fechaHoyFormated = moment().format("DD-MM-YYYY");
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
  fechai: fechaHoyFormated,
  fechaV: fechaHoyFormated,
  fechaf: fechaHoyFormated
})


const dataModuloCursoModel = ref([]);
const dataModuloItems = ref([]);
const modulosSelectListCurso = ref([]);

const selectRefModuloCurso = ref(null);
const moduloModelLoading = ref(false);
const searchModuloModel = ref(null)
const moduloItemsCopy = ref([]);

const dataCuestionarioCursoModel = ref(null);
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
const thumbnailCursoModel = ref([]);
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

      var response = await fetch(`https://micuenta.ecuavisa.com/elearning/etiqueta/listar.php`, requestOptions);
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

      var response = await fetch(`https://micuenta.ecuavisa.com/elearning/categoria/listar.php`, requestOptions);
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

      
      cuestionariosRaw.value = data.data.reduce((acumulador, actual) => {
        acumulador.push({
          title: `${actual.titulo}`,
          value: actual._id,
        });
        return acumulador;
      }, []);

      dataCuestionarioItems.value = deepClone(cuestionariosRaw.value);
      cuestionariosFull.value = deepClone(data.data);

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
      fechai: fechaHoyFormated,
      fechaV: fechaHoyFormated,
      fechaf: fechaHoyFormated
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

/*FILE INPUT*/
// Función para cambiar a modo de edición de imagen
const editImage = () => {
  editingImage.value = true;
};

// Función para manejar la selección de archivos
const handleFileUpload = (event) => {
  const fileList = event.target.files;
  // Aplicar las reglas de validación
  fileInputIsValid.value = true;
  const maxSizeMB = 1; // Tamaño máximo en MB
  const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convertir a bytes

  // Verificar el tamaño de cada archivo
  for (let file of fileList) {
    if (file.size > maxSizeBytes) {
      configSnackbar.value = {
          message: `El archivo ${file.name} excede el tamaño máximo de ${maxSizeMB}MB.`,
          type: "error",
          model: true
      };
      thumbnailCursoModel.value = [];
      fileInputIsValid.value = false;
      return false; 
    }
    if(file.type !== 'image/jpeg'){
      configSnackbar.value = {
          message: `El archivo ${file.name} debe ser un JPG válido`,
          type: "error",
          model: true
      };
      thumbnailCursoModel.value = [];
      fileInputIsValid.value = false;
      return false; 
    }
  }

  files = Array.from(fileList);
  console.log(files);
  cambioImagen.value = true;

  // Actualizar la URL de la imagen para la previsualización
  // if (files.value.length > 0) {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     imageUrl.value = reader.result;
  //   };
  //   reader.readAsDataURL(files.value[0]);
  // }
};

// Función para inicializar el componente en modo de edición
const initializeEditMode = (existingImageUrl) => {
  imageUrl.value = existingImageUrl;
  isEditing.value = true;
  editingImage.value = false;
};
/*FILE INPUT*/

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
          console.log("elementosFaltantes ", elementosFaltantes);

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
const thumbnailVideoModel = ref("https://micuenta.ecuavisa.com/Recursos/ecuavisa.com.jpg");

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

function filtrarDesafios(listaDesafios, elementos) {
    const valoresDesafiosFiltrados = listaDesafios
        .filter(desafio => elementos.includes(desafio.value))
        .map(desafio => desafio.value);
    return valoresDesafiosFiltrados;
}

//-----------------------------------------------LOCAL------------------------------------------------
//----------------------------------------------------------------------------------------------------
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

function removeElementById(array, key, value) {
    if (!Array.isArray(array)) {
      console.error("El valor proporcionado no es un array.");
      return;
    }

    for (let i = array.length - 1; i >= 0; i--) {
      if (array[i][key] === value) {
        array.splice(i, 1);
        //console.log(`Elemento con ${key} = ${value} eliminado.`);
      }
    }
  }
// --------------------- Cuestionario Local --------------------
//--------------------------------------------------------------
const cuestionariosRaw = ref([]);

const cuestionariosFull = ref([]);
const cuestionariosGeneradosLocal = ref([]);

const accionCuestionarioLocal = ref('add');
const idToEditCuestionarioLocal = ref('');
const tituloCuestionarioOnEdit = ref('');
function resetFormCuestionario(){
  tituloCuestionario.value = '';
  descripcionCuestionario.value = '';
  tagsCuestionario.value = [];
  puntosNecesariosCuestionario.value = null;
  fechaLimiteCuestionario.value = '';
  limiteTiempoCuestionario.value = null;
  preguntasCuestionario.value = [
        {
            pregunta: '',
            puntaje: null,
            respuesta: '',
            opciones: ['','']
        }
  ]
  tag.value = '';    
}

function onEditCuestionarioLocal(id){
  accionCuestionarioLocal.value = 'edit';
  idToEditCuestionarioLocal.value = id;
  const cuestionario = cuestionariosFull.value.find(cuestionario => cuestionario._id == id);

  tituloCuestionarioOnEdit.value = cuestionario.titulo;

  tituloCuestionario.value = cuestionario.titulo;
  tagsCuestionario.value = cuestionario.tags;
  descripcionCuestionario.value = cuestionario.descripcion;
  puntosNecesariosCuestionario.value = cuestionario.puntosNecesarios;
  preguntasCuestionario.value = cuestionario.preguntas;
  fechaLimiteCuestionario.value = cuestionario.fechaLimite;
  limiteTiempoCuestionario.value = cuestionario.limiteTiempo;
}

function cancelarEditCuestionarioLocal(){
  accionCuestionarioLocal.value = 'add';
  idToEditCuestionarioLocal.value = '';
  tituloCuestionarioOnEdit.value = '';
  resetFormCuestionario();
}

function onDeleteCuestionarioLocal(id){

  if(dataCuestionarioModuloModel.value == id){
    dataCuestionarioModuloModel.value = null;
  }
  if(dataCuestionarioCursoModel.value == id){
    dataCuestionarioCursoModel.value = null;
  }
  removeElementById(cuestionariosFull.value, '_id', id);
  removeElementById(dataCuestionarioItems.value, 'value', id);
  removeElementById(cuestionariosGeneradosLocal.value, '_id', id);
  console.log('cuestionariosFull on elim',cuestionariosFull.value);
  console.log('cuestionariosGeneradosLocal on elim',cuestionariosGeneradosLocal.value);
  console.log('dataCuestionarioItems on elim',dataCuestionarioItems.value);
}

function guardarLocalCuestionario (){

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

  var preguntasFormated = preguntasEnviar.map(item => ({
    ...item, 
    puntaje: parseInt(item.puntaje) 
  })); 


  if(accionVideoLocal.value == 'add'){
    var id = generarCodigoAleatorioUnico(10);  
    cuestionariosFull.value.push({
      _id: id,
      titulo: tituloCuestionario.value,
      descripcion: descripcionCuestionario.value,
      tags: tagsCuestionario.value,
      puntosNecesarios: puntosNecesariosCuestionario.value,
      preguntas: preguntasFormated,
      fechaLimite: fechaLimiteCuestionario.value,
      limiteTiempo: limiteTiempoCuestionario.value 
    });

    dataCuestionarioItems.value.push({
      title: tituloCuestionario.value,
      value: id
    });

    cuestionariosGeneradosLocal.value.push({
      _id: id,
      titulo: tituloCuestionario.value,
      descripcion: descripcionCuestionario.value,
      tags: tagsCuestionario.value,
      puntosNecesarios: puntosNecesariosCuestionario.value,
      preguntas: preguntasFormated,
      fechaLimite: fechaLimiteCuestionario.value,
      limiteTiempo: limiteTiempoCuestionario.value    
    });
  }else{
    const cuestionarioFull = cuestionariosFull.value.find(cuestionario => cuestionario._id == idToEditCuestionarioLocal.value);
    cuestionarioFull.titulo = tituloCuestionario.value;
    cuestionarioFull.descripcion = descripcionCuestionario.value;
    cuestionarioFull.tags = tagsCuestionario.value;
    cuestionarioFull.puntosNecesarios = puntosNecesariosCuestionario.value;
    cuestionarioFull.preguntas = preguntasFormated;
    cuestionarioFull.fechaLimite = fechaLimiteCuestionario.value;
    cuestionarioFull.limiteTiempo = limiteTiempoCuestionario.value;

    const cuestionarioItem = dataCuestionarioItems.value.find(cuestionario => cuestionario.value == idToEditCuestionarioLocal.value);
    cuestionarioItem.title = tituloCuestionario.value;

    const cuestionarioLocal = cuestionariosGeneradosLocal.value.find(cuestionario => cuestionario._id == idToEditCuestionarioLocal.value);
    cuestionarioLocal.titulo = tituloCuestionario.value;
    cuestionarioLocal.descripcion = descripcionCuestionario.value;
    cuestionarioLocal.tags = tagsCuestionario.value;
    cuestionarioLocal.puntosNecesarios = puntosNecesariosCuestionario.value;
    cuestionarioLocal.preguntas = preguntasFormated;
    cuestionarioLocal.fechaLimite = fechaLimiteCuestionario.value;
    cuestionarioLocal.limiteTiempo = limiteTiempoCuestionario.value;

  }
  accionCuestionarioLocal.value = 'add';  

  console.log("cuestionariosFull", cuestionariosFull.value);
  console.log("cuestionariosGeneradosLocal", cuestionariosGeneradosLocal.value);
  console.log("cuestionarioItems", dataCuestionarioItems.value);
  
  resetFormCuestionario();
}

// Funciones para manejar el cambio de paginación
const itemsPerPageCuestionarioLocal = 5;
const currentPageCuestionarioLocal = ref(1);

const paginatedCuestionariosLocal = computed(() => {
  const start = (currentPageCuestionarioLocal.value - 1) * itemsPerPageCuestionarioLocal;
  const end = start + itemsPerPageCuestionarioLocal;

  return cuestionariosGeneradosLocal.value.slice(start, end);
});

const nextPageCuestionarioLocal = () => {
  if (currentPageCuestionarioLocal.value * itemsPerPageCuestionarioLocal < cuestionariosGeneradosLocal.value.length) currentPageCuestionarioLocal.value++;
};

const prevPageCuestionarioLocal = () => {
  if (currentPageCuestionarioLocal.value > 1) currentPageCuestionarioLocal.value--;
};


//----------------------- Fin cuestionario local ---------------
//---------------------------------------------------------------


// --------------------- Video Local --------------------
//-------------------------------------------------------
const videosRaw = ref([]);

const videosFull = ref([]);
const videosGeneradosLocal = ref([]);

const accionVideoLocal = ref('add');
const idToEditVideoLocal = ref('');
const tituloVideoOnEdit = ref('');
function resetFormVideo(){
  idVideoRudoModel.value = null;
  duracionVideoModel.value = null;
  categoriaVideoModel.value = '';
  etiquetasVideoModel.value = '';
  tituloVideoModel.value = null;
  descripcionVideoModel.value = null;
}

function onEditVideoLocal(id){
  accionVideoLocal.value = 'edit';
  idToEditVideoLocal.value = id;
  const video = videosFull.value.find(video => video._id == id);

  tituloVideoOnEdit.value = video.titulo;

  idVideoRudoModel.value = video.idRudo;
  duracionVideoModel.value = video.duracion;
  categoriaVideoModel.value = video.categoria;
  etiquetasVideoModel.value = video.etiquetas;
  tituloVideoModel.value = video.titulo;
  thumbnailVideoModel.value = video.thumbnail;
  descripcionVideoModel.value = video.descripcion;
}

function cancelarEditVideoLocal(){
  accionVideoLocal.value = 'add';
  idToEditVideoLocal.value = '';
  tituloVideoOnEdit.value = '';
  resetFormVideo();
}

function onDeleteVideoLocal(id){
  removeElementById(videosFull.value, '_id', id);
  removeElementById(videosItems.value, 'value', id);
  removeElementById(videosGeneradosLocal.value, '_id', id);
  videosModuloModel.value = [];
  videosSelectListModulo.value = [];	
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
    if(accionVideoLocal.value == 'add'){
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
        _id: id,
        titulo: tituloVideoModel.value,
        descripcion: descripcionVideoModel.value,
        idRudo: idVideoRudoModel.value,
        thumbnail: thumbnailVideoModel.value,
        duracion: duracionVideoModel.value,
        categoria: categoriaVideoModel.value,
        etiquetas: etiquetasVideoModel.value    
      });
    }else{
      const videoFull = videosFull.value.find(video => video._id == idToEditVideoLocal.value);
      videoFull.titulo = tituloVideoModel.value;
      videoFull.descripcion = descripcionVideoModel.value;
      videoFull.idRudo = idVideoRudoModel.value;
      videoFull.thumbnail = thumbnailVideoModel.value;
      videoFull.duracion = duracionVideoModel.value;
      videoFull.categoria = categoriaVideoModel.value;
      videoFull.etiquetas = etiquetasVideoModel.value;

      const videoItem = videosItems.value.find(video => video.value == idToEditVideoLocal.value);
      videoItem.title = tituloVideoModel.value;

      const videoLocal = videosGeneradosLocal.value.find(video => video._id == idToEditVideoLocal.value);
      videoLocal.titulo = tituloVideoModel.value;
      videoLocal.descripcion = descripcionVideoModel.value;
      videoLocal.idRudo = idVideoRudoModel.value;
      videoLocal.thumbnail = thumbnailVideoModel.value;
      videoLocal.duracion = duracionVideoModel.value;
      videoLocal.categoria = categoriaVideoModel.value;
      videoLocal.etiquetas = etiquetasVideoModel.value;

      
    }
  accionVideoLocal.value = 'add';  

  //console.log("videosFull", videosFull.value);
  //console.log("videosGeneradosLocal", videosGeneradosLocal.value);
  //console.log("videosItems", videosItems.value);
  
  resetFormVideo();
}

// Funciones para manejar el cambio de paginación
const itemsPerPageVideoLocal = 5;
const currentPageVideoLocal = ref(1);

const paginatedVideosLocal = computed(() => {
  const start = (currentPageVideoLocal.value - 1) * itemsPerPageVideoLocal;
  const end = start + itemsPerPageVideoLocal;

  return videosGeneradosLocal.value.slice(start, end);
});

const nextPageVideoLocal = () => {
  if (currentPageVideoLocal.value * itemsPerPageVideoLocal < videosGeneradosLocal.value.length) currentPageVideoLocal.value++;
};

const prevPageVideoLocal = () => {
  if (currentPageVideoLocal.value > 1) currentPageVideoLocal.value--;
};
//------------------------ Fin Video Local -----------------------
//----------------------------------------------------------------

//------------------------- Módulo local -------------------------
//----------------------------------------------------------------
const modulosRaw = ref([]);

const modulosFull = ref([]);
const modulosGeneradosLocal = ref([]);

const accionModuloLocal = ref('add');
const idToEditModuloLocal = ref('');
const tituloModuloOnEdit = ref('');
function resetFormModulo(){
  tituloModuloModel.value = null;
  dataCuestionarioModuloModel.value = null;
  descripcionModuloModel.value = null;
  videosModuloModel.value = [];
  videosSelectListModulo.value = [];	
}

function onEditModuloLocal(id){
  accionModuloLocal.value = 'edit';
  idToEditModuloLocal.value = id;
  const modulo = modulosFull.value.find(modulo => modulo._id === id);

  tituloModuloOnEdit.value = modulo.titulo;

  tituloModuloModel.value = modulo.titulo;
  dataCuestionarioModuloModel.value = modulo.idCuestionario;
  descripcionModuloModel.value = modulo.descripcion;
  //console.log('modulo.videos ',modulo.videos);
  videosModuloModel.value = filtrarDesafios(videosItems.value, modulo.videos.reduce((acumulador, actual) => {
        acumulador.push(actual.value);
        return acumulador;
  }, []));
  //console.log("videosModuloModelOnEdit", videosModuloModel.value);
  videosSelectListModulo.value = obtenerListaOrdenada(videosModuloModel.value, modulo.videos);
  //console.log("videosSelectListModuloOnEdit", videosSelectListModulo.value);
  
}

function cancelarEditModuloLocal(){
  accionModuloLocal.value = 'add';
  idToEditModuloLocal.value = '';
  tituloModuloOnEdit.value = '';
  resetFormModulo();
}

function onDeleteModuloLocal(id){

  removeElementById(modulosFull.value, '_id', id);
  removeElementById(modulosGeneradosLocal.value, '_id', id);
  removeElementById(dataModuloItems.value, 'value', id);
  
  dataModuloCursoModel.value = [];
  modulosSelectListCurso.value = [];	
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
    if(accionModuloLocal.value == 'add'){
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
        _id: id,
        titulo: tituloModuloModel.value,
        descripcion: descripcionModuloModel.value,
        idCuestionario: dataCuestionarioModuloModel.value || null,
        videos: obtenerValorYPosicionModulo()
      });
    }else{
      const moduloFull = modulosFull.value.find(modulo => modulo._id == idToEditModuloLocal.value);
      moduloFull.titulo = tituloModuloModel.value;
      moduloFull.descripcion = descripcionModuloModel.value;
      moduloFull.idCuestionario = dataCuestionarioModuloModel.value || null;
      moduloFull.videos = obtenerValorYPosicionModulo();

      const moduloItem = dataModuloItems.value.find(modulo => modulo.value == idToEditModuloLocal.value);
      moduloItem.title = tituloModuloModel.value;

      const moduloLocal = modulosGeneradosLocal.value.find(modulo => modulo._id == idToEditModuloLocal.value);
      moduloLocal.titulo = tituloModuloModel.value;
      moduloLocal.descripcion = descripcionModuloModel.value;
      moduloLocal.idCuestionario = dataCuestionarioModuloModel.value || null;
      moduloLocal.videos = obtenerValorYPosicionModulo();
    }
    accionModuloLocal.value = 'add';

    //console.log("modulosFull", modulosFull.value);
    //console.log("modulosGeneradosLocal", modulosGeneradosLocal.value);
    //console.log("modulosItems", dataModuloItems.value);
    resetFormModulo();
}
// Funciones para manejar el cambio de paginación módulos

const itemsPerPageModuloLocal = 5;
const currentPageModuloLocal = ref(1);

const paginatedModuloLocal = computed(() => {
  const start = (currentPageModuloLocal.value - 1) * itemsPerPageModuloLocal;
  const end = start + itemsPerPageModuloLocal;

  return modulosGeneradosLocal.value.slice(start, end);
});

const nextPageModuloLocal = () => {
  if (currentPageModuloLocal.value * itemsPerPageModuloLocal < modulosGeneradosLocal.value.length) currentPageModuloLocal.value++;
};

const prevPageModuloLocal = () => {
  if (currentPageModuloLocal.value > 1) currentPageModuloLocal.value--;
};
// ----------------------- Fin Módulo Local ----------------------
//----------------------------------------------------------------

// -------------------------- Aplicar cambios de curso en local --------------------------
//----------------------------------------------------------------------------------------
const cursoLocal = ref(null);
const cursoFormatedEnvio = ref(null);
async function onApply() {
  try {
    
    var modulos = obtenerValorYPosicionCurso();
    //Validar curso
    if (
          !tituloCursoModel.value ||
          !categoriaCursoModel.value || 
          !idCursoRudoModel.value || 
          !descripcionCursoModel.value || 
          !thumbnailCursoModel.value || 
          !dataCuestionarioCursoModel.value || 
          !duracionCursoModel.value || 
          modulos.length == 0
        ){
          configSnackbar.value = {
              message: "Llenar todos los campos del curso para ver el preview",
              type: "error",
              model: true
          };
          return false;
      }

      //console.log("modulosFull" , modulosFull.value);
      //console.log("videosFull" , videosFull.value);
      var modulosSelected = deepClone(modulos);
      //console.log("modulosSelected" , modulosSelected);
      var modulosFullClone = deepClone(modulosFull.value);
      var modulosResult = modulosFullClone.filter(fullItem => 
        modulosSelected.some(selectedItem => selectedItem.value === fullItem._id)
      );
      
      for (let modulo of modulosResult) {
        modulo.videos = modulo.videos.map(video => 
          videosFull.value.find(fullItem => fullItem._id === video.value)
        );

        modulo.idCuestionario = cuestionariosFull.value.find(fullItem => fullItem._id === modulo.idCuestionario);
      }

      let curso = {
            titulo: tituloCursoModel.value,
            descripcion: descripcionCursoModel.value,
            idRudo: idCursoRudoModel.value,
            //thumbnail: thumbnailCursoModel.value,
            duracion: duracionCursoModel.value,
            categoria: categoriaCursoModel.value,
            etiquetas: etiquetasCursoModel.value,
            idCuestionario: cuestionariosFull.value.find(fullItem => fullItem._id === dataCuestionarioCursoModel.value),
            fechai: fechaIFModel.value.fechai,
            fechaf: fechaIFModel.value.fechaf,
            fechaVencimiento: fechaIFModel.value.fechaV,
            estado: estadoCursoModel.value,
            modulos: modulosResult
      }  

      let cursoEnvio = {
            titulo: tituloCursoModel.value,
            descripcion: descripcionCursoModel.value,
            idRudo: idCursoRudoModel.value,
            //thumbnail: thumbnailCursoModel.value,
            duracion: duracionCursoModel.value,
            categoria: categoriaCursoModel.value,
            etiquetas: etiquetasCursoModel.value,
            idCuestionario: dataCuestionarioCursoModel.value,
            fechai: fechaIFModel.value.fechai,
            fechaf: fechaIFModel.value.fechaf,
            fechaVencimiento: fechaIFModel.value.fechaV,
            estado: estadoCursoModel.value,
            modulos: obtenerValorYPosicionCurso()
      }  

      cursoLocal.value = curso; 
      //cursoFormatedEnvio.value = cursoEnvio;
      //console.log("cursoLocal" , cursoLocal.value);
  } catch (error) {
    console.error(error.toString());
    configSnackbar.value = {
        message: 'Error al mostrar el preview',
        type: "error",
        model: true
    };
  }
}


//-----------------------------------------------SEND-------------------------------------------------
//----------------------------------------------------------------------------------------------------
const creandoRegistros = ref(false);
function validarFecha(fecha) {
    // Define el formato de fecha esperado
    const formato = 'DD-MM-YYYY';
    
    // Intenta analizar la fecha en el formato especificado
    const fechaValida = moment(fecha, formato, true);

    // Verifica si la fecha analizada es válida y coincide exactamente con el formato especificado
    if (fechaValida.isValid() && fechaValida.format(formato) === fecha) {
        return true;
    } else {
        return false;
    }
}
async function onComplete() {
  
  //Validar archivos
  if (files.length == 0) {
    configSnackbar.value = {
            message: "Debe subir una imágen JPG",
            type: "error",
            model: true
    };
    return false;
  }
  //Validar curso
  var modulos = obtenerValorYPosicionCurso();
  if (
        !categoriaCursoModel.value || 
        !idCursoRudoModel.value || 
        !descripcionCursoModel.value || 
        !thumbnailCursoModel.value || 
        !dataCuestionarioCursoModel.value || 
        !duracionCursoModel.value ||
        modulos.length == 0
      ){
        configSnackbar.value = {
            message: "Debe llenar todos los campos del curso",
            type: "error",
            model: true
        };
        return false;
    }

    var cursoEnvio = {
          titulo: tituloCursoModel.value,
          descripcion: descripcionCursoModel.value,
          idRudo: idCursoRudoModel.value,
          //thumbnail: thumbnailCursoModel.value,
          duracion: duracionCursoModel.value,
          categoria: categoriaCursoModel.value,
          etiquetas: etiquetasCursoModel.value,
          idCuestionario: dataCuestionarioCursoModel.value,
          fechai: fechaIFModel.value.fechai,
          fechaf: fechaIFModel.value.fechaf,
          fechaVencimiento: fechaIFModel.value.fechaV,
          estado: estadoCursoModel.value,
          modulos: modulos
    }  
    cursoFormatedEnvio.value = cursoEnvio;

  //Fin de validaciones---------------------------------------------------
  
  creandoRegistros.value = true;
  configSnackbar.value = {
            message: "Creando los registros, espere por favor",
            type: "primary",
            model: true,
            location: "center",
            timeout: 3000
  };

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  try {
     
    //Paso 1: Crear videos------------------------------------------------
    var idsVideosCreados = [];
    var modulosGenerados; 

    if(videosGeneradosLocal.value.length > 0){
      for (let video of videosGeneradosLocal.value) {
      let jsonEnviarVideo = {
            "titulo": video.titulo,
            "descripcion": video.descripcion,
            "idRudo": video.idRudo,
            "thumbnail": video.thumbnail,
            "duracion": video.duracion,
            "categoria": video.categoria,
            "etiquetas": video.etiquetas
      }
      const sendVideo = await fetch('https://servicio-elearning.vercel.app/video/create', {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(jsonEnviarVideo),
                redirect: 'follow'
      }); 

      if (!sendVideo.ok) {
        const errorText = await sendVideo.text();
        throw new Error(`Error al crear video: ${sendVideo.status} ${sendVideo.statusText} - ${errorText}`);
      }
      const respuestaVideo = await sendVideo.json(); 
      
      idsVideosCreados.push({
        _id: respuestaVideo.id,
        idLocal: video._id
      });
    }
    console.log('idsVideosCreados', idsVideosCreados);
    //Fin de crear videos------------------------------------

    

    //Paso 2: Cuestionarios-----------------------------------
    var idsCuestionariosCreados = [];
    if(cuestionariosGeneradosLocal.value.length > 0){

      for(let cuestionario of cuestionariosGeneradosLocal.value){

        let jsonEnviarCuestionario ={
            "titulo": cuestionario.titulo,
            "descripcion": cuestionario.descripcion,
            "tags": cuestionario.tags,
            "puntosNecesarios": cuestionario.puntosNecesarios,
            "preguntas": cuestionario.preguntas,
            "fechaLimite": cuestionario.fechaLimite,
            "limiteTiempo": cuestionario.limiteTiempo 
        }

        const sendCuestionario = await fetch('https://e-learning-cuestionario.vercel.app/cuestionarios/create', {
              method: 'POST',
              headers: myHeaders,
              body: JSON.stringify(jsonEnviarCuestionario),
              redirect: 'follow'
        });
        if (!sendCuestionario.ok) {
          const errorText = await sendCuestionario.text();
          throw new Error(`Error al crear cuestionario: ${sendCuestionario.status} ${sendCuestionario.statusText} - ${errorText}`);
        }

        const respuestaCuestionario = await sendCuestionario.json();

        idsCuestionariosCreados.push({
        _id: respuestaCuestionario.id,
        idLocal: cuestionario._id
      });
      }
    }
    console.log('idsCuestionariosCreados', idsCuestionariosCreados);

    //Paso 3: Módulos-----------------------------------
    var idsModulosCreados = [];
    if(modulosGeneradosLocal.value.length > 0){

      //Paso 3.1: Reemplazar ids locales de videos en módulos
      modulosGenerados = deepClone(modulosGeneradosLocal.value);
      for(let modulo of modulosGenerados){
        for (let i = 0; i < modulo.videos.length; i++) {
          let videoEncontrado = idsVideosCreados.find(item => item.idLocal == modulo.videos[i].value);      
            if (videoEncontrado) {
              modulo.videos[i].value = videoEncontrado._id;          
            }
          
        }
      }
      //console.log('modulosGeneradosLocal', modulosGeneradosLocal.value);
      //console.log('modulosGenerados idsVideos reemplazados', modulosGenerados);

      //Fin de Reemplazar ids locales de videos en módulos

      //Paso 3.2: Reemplazar ids locales de cuestionarios en módulos
      for(let modulo of modulosGenerados){    
         
        let cuestionarioEncontrado = idsCuestionariosCreados.find(item => item.idLocal == modulo.idCuestionario);      
        if (cuestionarioEncontrado) {
          modulo.idCuestionario = cuestionarioEncontrado._id;          
        }
        
      }
      console.log('modulosGeneradosLocal raw', modulosGeneradosLocal.value);
      console.log('modulosGenerados ids reemplazados', modulosGenerados);

      //Fin de Reemplazar ids locales de cuestionarios en módulos

      //Paso 3.3: Crear módulos     
      for(let modulo of modulosGenerados){
        let jsonEnviarModulo = {
            "titulo": modulo.titulo,
            "descripcion": modulo.descripcion,
            "idCuestionario": modulo.idCuestionario || null,
            "videos": modulo.videos
        }
        const sendModulo = await fetch('https://servicio-elearning.vercel.app/modulo/create', {
                method: 'POST',
                headers: myHeaders,
                body: JSON.stringify(jsonEnviarModulo),
                redirect: 'follow'
        });
        if (!sendModulo.ok) {
          const errorText = await sendModulo.text();
          throw new Error(`Error al crear módulo: ${sendModulo.status} ${sendModulo.statusText} - ${errorText}`);
        }
        const respuestaModulo = await sendModulo.json();

        idsModulosCreados.push({
          _id: respuestaModulo.id,
          idLocal: modulo._id
        });
      }
      //console.log('idsModulosCreados', idsModulosCreados);

      //Fin de Crear módulos
      }
    }
    //Fin de Módulos-----------------------------------

    //Paso 4: Reemplazar ids locales de modulos en el curso

    var cursoFinal = deepClone(cursoFormatedEnvio.value);
    for (let i = 0; i < cursoFinal.modulos.length; i++) {
      let moduloEncontrado = idsModulosCreados.find(item => item.idLocal == cursoFinal.modulos[i].value);
      if (moduloEncontrado) {
        cursoFinal.modulos[i].value = moduloEncontrado._id;
      }
    }
    console.log('cursoAntes', cursoFormatedEnvio.value);
    console.log('cursoFinal', cursoFinal);

    //Fin de Reemplazar id locales de modulos en el curso

    console.log('cursoFinal raw', cursoFinal);  

    //Paso 5: Reemplazar id local de cuestionario en el curso
    let cuestionarioEncontradoCurso = idsCuestionariosCreados.find(item => item.idLocal == cursoFinal.idCuestionario);
    if (cuestionarioEncontradoCurso) {
      cursoFinal.idCuestionario = cuestionarioEncontradoCurso._id;          
    }
        
    
    console.log('cursoFinal id reemplazado', cursoFinal);
 
    //Fin de Reemplazar id local de cuestionario en el curso

    //Paso 6: Crear el curso

    let jsonEnviarCurso = {
          "titulo": cursoFinal.titulo,
          "descripcion": cursoFinal.descripcion,
          "idRudo": cursoFinal.idRudo,
          // "thumbnail": thumbnailCursoModel.value,
          "duracion": cursoFinal.duracion,
          "categoria": cursoFinal.categoria,
          "etiquetas": cursoFinal.etiquetas,
          "idCuestionario": cursoFinal.idCuestionario,
          "fechai": cursoFinal.fechai,
          "fechaf": cursoFinal.fechai,
          "fechaVencimiento": cursoFinal.fechaVencimiento,
          "estado": cursoFinal.estado,
          "modulos": cursoFinal.modulos
    }  
    var rawCurso = JSON.stringify(jsonEnviarCurso);
    const formDataCurso = new FormData();
    formDataCurso.append("raw", rawCurso);

    files.forEach(file => {
      formDataCurso.append('files', file);
    });
    const sendCurso = await fetch('https://servicio-elearning.vercel.app/curso/create/file', {
              method: 'POST',
              // headers: myHeaders,
              // body: JSON.stringify(jsonEnviarCurso),
              body: formDataCurso,
              // redirect: 'follow'
    });
    if (!sendCurso.ok) {
      const errorText = await sendCurso.text();
      throw new Error(`Error al crear curso: ${sendCurso.status} ${sendCurso.statusText} - ${errorText}`);
    }
    const respuestaCurso = await sendCurso.json();
    console.log('respuestaCurso', respuestaCurso);
    //Fin de Crear el curso
    
  } catch (error) {
    creandoRegistros.value = false;
    return console.error('Se ha producido un error al guardar los registros', error.toString());
  }
  creandoRegistros.value = false;
  configSnackbar.value = {
            message: "Se han creado los registros correctamente",
            type: "success",
            model: true,
  };
  
}

async function onCompleteOld() {
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
          // "thumbnail": thumbnailCursoModel.value,
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
    var rawCurso = JSON.stringify(jsonEnviarCurso);
    const formDataCurso = new FormData();
    // Añadir los campos de jsonEnviar al FormData
    formDataCurso.append("raw", rawCurso);

    files.forEach(file => {
      formDataCurso.append('files', file);
    });

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
    const sendCurso = await fetch('https://servicio-elearning.vercel.app/curso/create/file', {
              method: 'POST',
              // headers: myHeaders,
              // body: JSON.stringify(jsonEnviarCurso),
              body: formDataCurso,
              // redirect: 'follow'
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
        <div v-if="creandoRegistros" id="overlay"></div>
        <VSnackbar v-model="configSnackbar.model" :location="configSnackbar.location ||'top end'" variant="flat" :timeout="configSnackbar.timeout || 2500" :color="configSnackbar.type">
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
                  <div v-if="isEditing && !editingImage">
                    <img :src="imageUrl" alt="Imagen actual" class="image-preview" />
                    <v-btn @click="editImage">Cambiar imagen</v-btn>
                  </div>
                  <VFileInput
                    v-else
                    ref="fileInputRef"
                    v-model="thumbnailCursoModel"
                    :rules="rules"
                    @change="handleFileUpload" 
                    required
                    label="Subir una imagen principal"
                    accept="image/png, image/jpeg, image/bmp"
                    placeholder="Pick an avatar"
                    prepend-icon="tabler-camera"
                  />
                  <small class="text-disabled">El tamaño máx de imagen es 1MB.</small>
                  <!-- <VTextField v-model="thumbnailCursoModel" label="Imagen principal" /> -->
                  <!-- <img v-if="thumbnailCursoModel" class="img-preview" :src="thumbnailCursoModel"> -->
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
                
                
              </VRow>
            </div>
            <div v-if="currentStep === 1">
              <!-- Video -->
              <div class="px-4 mb-6" v-if="videosGeneradosLocal.length > 0">
                 
                  <VList lines="two" border >
                  <template
                    v-for="(video, index) of paginatedVideosLocal"
                    :key="index"
                  >
                    <VListItem :disabled="disabledViewList">
                      <VListItemTitle>
                        <div class="nombre-desafio d-flex flex-column">
                          <div class="d-flex">
                            <small>Video</small>
                            <small class="text-disabled"><code class="p-0"><b>_id:</b>{{ video._id }}</code></small>
                          </div>
                          <label>{{ video.titulo }}</label>
                          <span class="text-xs text-disabled">{{ video.descripcion }}</span>
                          <div class="content-items d-flex">
                            <div class="content-video">
                              <VIcon
                                size="20"
                                icon="tabler-video"
                              />
                              <a class="pl-2" target="_blank" :href="video.url">{{ video.idRudo }}</a>
                            </div>
                            <div class="content-time pl-3">
                              <VIcon
                                size="20"
                                icon="tabler-clock"
                              />
                              <b>Duración: </b> {{ video.duracion }} min
                            </div>

                            <div class="content-time pl-3">
                              <VIcon
                                size="20"
                                icon="mdi-animation"
                              />
                              <b>Categoría: </b> {{ video.categoria }}
                            </div>
                       
                          </div>
                        </div>
                      </VListItemTitle>

                      <template #append>
                        <div class="espacio-right-2">
                          <!--
                          <VBtn
                            title="Ver vista previa del video"
                            icon
                            size="x-small"
                            color="warning"
                            variant="text"
                            @click="onView(video)"
                          >
                            <VIcon
                              size="22"
                              icon="tabler-movie"
                            />
                          </VBtn>
                          -->
                          <VBtn 
                            title="Editar registro" color="success" variant="text" icon  @click="onEditVideoLocal(video._id)">
                            <VIcon size="22" icon="tabler-edit" />
                          </VBtn>

                          <VBtn
                            title="Eliminar el registro"
                            icon
                            size="x-small"
                            color="error"
                            variant="text"
                            @click="onDeleteVideoLocal(video._id)"
                          >
                            <VIcon
                              size="22"
                              icon="tabler-trash"
                            />
                          </VBtn>
                          <!--
                          <VBtn
                            icon
                            variant="text"
                            color="default"
                            size="x-small"
                            :to="{ name: 'apps-elearning-gestion-videos-view-id', params: { id: video._id } }"
                          >
                            <VIcon
                              :size="22"
                              icon="tabler-eye"
                            />
                          </VBtn>
                          -->
                        </div>
                      </template>
                    </VListItem>
                    <VDivider v-if="index !== paginatedVideosLocal.length - 1" />
                  </template>
                </VList>
                
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                    <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageVideoLocal" :disabled="currentPageVideoLocal === 1"></VBtn>
                    Página {{ currentPageVideoLocal }}
                    <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageVideoLocal"
                        :disabled="(currentPageVideoLocal * itemsPerPageVideoLocal) >= videosGeneradosLocal.length">
                    </VBtn>
                </div>
                <VDivider/>
                </div>
              
              <VRow>
                <VCol class="d-flex justify-space-between" cols="12">
                  <h6 class="text-h6 font-weight-medium">{{accionVideoLocal == 'add'? 'Crear el video' : 'Editar '+tituloVideoOnEdit}}</h6>
                  <div class="d-flex gap-2">
                    <VBtn @click="guardarLocalVideo">
                      Guardar
                    </VBtn>
                    <VBtn v-if="accionVideoLocal != 'add'" color="error" @click="cancelarEditVideoLocal">
                      Cancelar
                    </VBtn>
                  </div>
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

              <!-- Cuestionario -->

              <div class="mb-2" v-if="cuestionariosGeneradosLocal.length > 0">
                <VTable class="text-no-wrap tableNavegacion mb-5">
                        <thead>
                            <tr>   
                            <th scope="col">Título</th>
                            <th scope="col">Descripción</th>             
                            <th scope="col">Acciones</th>                                                   
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="item in paginatedCuestionariosLocal">
                            <td class="text-medium-emphasis">
                                {{ item.titulo}}
                            </td>     
                            <td class="text-medium-emphasis">
                                {{ item.descripcion}}
                            </td>                 
                            <td class="text-medium-emphasis">
                                <VBtn color="success" variant="text" icon  @click="onEditCuestionarioLocal(item._id)">
                                    <VIcon size="22" icon="tabler-edit" />
                                </VBtn>

                                <VBtn icon  color="error" variant="text" @click="onDeleteCuestionarioLocal(item._id)">
                                    <VIcon size="22" icon="tabler-trash" />
                                </VBtn>
                            </td>             
                            </tr>
                        </tbody>
                    </VTable>
                    <div class="d-flex align-center justify-space-between botonescurrentPage">
                    <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageCuestionarioLocal" :disabled="currentPageCuestionarioLocal === 1"></VBtn>
                    Página {{ currentPageCuestionarioLocal }}
                    <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageCuestionarioLocal"
                        :disabled="(currentPageCuestionarioLocal * itemsPerPageCuestionarioLocal) >= cuestionariosGeneradosLocal.length">
                    </VBtn>
                    </div>
              </div>
              <VRow>
                <VRow>
                  <VCol class="d-flex justify-space-between ml-1" cols="12">
                  <h6 class="text-h6 font-weight-medium">{{ accionCuestionarioLocal == 'add'? 'Crear el cuestionario' : 'Editar '+tituloCuestionarioOnEdit }}</h6>
                  <div class="d-flex gap-2">
                    <VBtn @click="guardarLocalCuestionario">
                      Guardar
                    </VBtn>
                    <VBtn v-if="accionCuestionarioLocal != 'add'" color="error" @click="cancelarEditCuestionarioLocal">
                      Cancelar
                    </VBtn>
                  </div>
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
            <div v-if="currentStep === 3">
              <!-- Modulo -->
              <div class="px-2 mb-6" v-if="modulosGeneradosLocal.length > 0">
                 
                 <VList lines="two" border >
                 <template
                   v-for="(modulo, index) of paginatedModuloLocal"
                   :key="index"
                 >
                   <VListItem :disabled="disabledViewList">
                     <VListItemTitle>
                       <div class="nombre-desafio d-flex flex-column">
                         <div class="d-flex">
                           <small>Módulo</small>
                           <small class="text-disabled"><code class="p-0"><b>_id:</b>{{ modulo._id }}</code></small>
                         </div>
                         <label>{{ modulo.titulo }}</label>
                         <small class="mr-2">{{ modulo.descripcion }}</small> 
                       </div>
                     </VListItemTitle>

                     <template #append>
                       <div class="espacio-right-2">
                         <VBtn 
                           title="Editar registro" color="success" variant="text" icon  @click="onEditModuloLocal(modulo._id)">
                           <VIcon size="22" icon="tabler-edit" />
                         </VBtn>

                         <VBtn
                           title="Eliminar el registro"
                           icon
                           size="x-small"
                           color="error"
                           variant="text"
                           @click="onDeleteModuloLocal(modulo._id)"
                         >
                           <VIcon
                             size="22"
                             icon="tabler-trash"
                           />
                         </VBtn>
                         <!---
                         <VBtn
                           icon
                           variant="text"
                           color="default"
                           size="x-small"
                           :to="{ name: 'apps-elearning-gestion-modulos-view-id', params: { id: modulo._id } }"
                         >
                           <VIcon
                             :size="22"
                             icon="tabler-eye"
                           />
                         </VBtn>
                         -->
                       </div>
                     </template>
                   </VListItem>
                   <VDivider v-if="index !== modulosGeneradosLocal.length - 1" />
                 </template>
               </VList>
               
               <div class="d-flex align-center justify-space-between botonescurrentPage">
                   <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageModuloLocal" :disabled="currentPageModuloLocal === 1"></VBtn>
                   Página {{ currentPageModuloLocal }}
                   <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageModuloLocal"
                       :disabled="(currentPageModuloLocal * itemsPerPageModuloLocal) >= modulosGeneradosLocal.length">
                   </VBtn>
               </div>
               <VDivider/>
               </div>

               

              <!-- Form modulo -->

              <VRow >
                <VCol class="d-flex justify-space-between ml-1" cols="12">
                  <h6 class="text-h6 font-weight-medium">{{ accionModuloLocal == 'add'? 'Crear el módulo' : 'Editar '+tituloModuloOnEdit }}</h6>
                  <div class="d-flex gap-2">
                    <VBtn @click="guardarLocalModulo">
                      Guardar
                    </VBtn>
                    <VBtn v-if="accionModuloLocal != 'add'" color="error" @click="cancelarEditModuloLocal">
                      Cancelar
                    </VBtn>
                  </div>
                </VCol>
                                  <VRow class="ml-1">
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
                              <VDivider class="mt-10"/>
                              <!-- Selector modulo de curso -->

               <VRow class="mt-2">
                <VCol cols="12">
                  <h6 class="text-h6 font-weight-medium">Módulos educativos del curso</h6>
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
            <!-- Add more steps here as needed -->
            <div v-if="currentStep === 4">
              <!-- Cuestionario Final -->
              <VRow>
                <VCol cols="12">
                  <h6 class="text-h6 font-weight-medium">Cuestionario final del curso</h6>
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
                    label="Cuestionario para el final del curso"
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
              </VRow>
            </div>
            <!-- Stepper Controls -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4 mt-8">
              <VBtn v-if="currentStep === 4" style="margin-left: auto;" @click="onApply">
                Preview
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

  <VCard class="mt-4" v-if="cursoLocal != null">
    
    <VCardTitle class="mt-2">Vista previa del curso</VCardTitle>
    <VCardText>{{cursoLocal.title}}</VCardText>  
    <VCardItem>
      <span class="curso_titulo">{{ cursoLocal.titulo }}</span>
      <VExpansionPanels multiple class="paneles-modulos mt-4" style="padding-right: 0px; padding-left: 0px">
        <VExpansionPanel
          v-for="(modulo, indexModulo) in cursoLocal.modulos"
          :key="modulo"
        >
        <VDivider v-if="indexModulo !== 0"/>
          <VExpansionPanelTitle class="d-flex flex-column gap-2" style="padding-right: 0%; padding-left: 0%">
            <span class="modulo_titulo ml-4 mr-auto"><h3>{{ modulo.titulo }}</h3></span>
            <span class="modulo_descripcion ml-4 mr-auto texto-subtitulos">{{ modulo.descripcion }}</span>
            <VChip class="modulo-chip mr-4 ml-auto"><h5>Complete todos los items</h5></VChip>      
          </VExpansionPanelTitle>
          <VExpansionPanelText style="padding-right: 0%; padding-left: 0%">
            <VDivider />
            <div v-for="(video, index) in modulo.videos">
              <div class="d-flex flex-column gap-2 px-4 py-4 ">
                <div>
                  <VIcon icon="tabler-video" class="" />
                  <span class="ml-1"> {{ '- '+ video.titulo }}</span>
                </div>
                
                <span class="texto-descripcion">Ver</span>
              </div>      
              <VDivider style="margin-right: 0%; margin-left: 0%"/>
            </div>
            <div class="d-flex flex-column gap-2 px-4 py-2">
              <div class="d-flex">
                <div class="icon-svg-title svg-verde">
						    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M96 80c0-26.5 21.5-48 48-48H432c26.5 0 48 21.5 48 48V384H96V80zm313 47c-9.4-9.4-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L409 161c9.4-9.4 9.4-24.6 0-33.9zM0 336c0-26.5 21.5-48 48-48H64V416H512V288h16c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336z"/></svg>
                </div>
                <span class="ml-2"> {{ ' - '+modulo.idCuestionario.titulo }}</span>
              </div>  
              <div class="d-flex">
                <span class="texto-descripcion">Obtener al menos {{ modulo.idCuestionario.puntosNecesarios }} pts</span>
                <span class="ml-auto texto-descripcion">
                  {{ ( Math.floor(modulo.idCuestionario.limiteTiempo / 60)== 0? '': Math.floor(modulo.idCuestionario.limiteTiempo / 60) + 'm ') + (modulo.idCuestionario.limiteTiempo % 60 == 0? '': modulo.idCuestionario.limiteTiempo % 60+ 's ' )}}
                </span>
              </div>
            </div>

       
          </VExpansionPanelText>
        </VExpansionPanel>
      </VExpansionPanels>

      <div class="container-cuestionario-final mt-4">
        <div class="d-flex flex-column gap-2 px-4 pt-4 pb-6">
              <div class="d-flex">
                <div class="icon-svg-title svg-verde">
						    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M96 80c0-26.5 21.5-48 48-48H432c26.5 0 48 21.5 48 48V384H96V80zm313 47c-9.4-9.4-24.6-9.4-33.9 0l-111 111-47-47c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l64 64c9.4 9.4 24.6 9.4 33.9 0L409 161c9.4-9.4 9.4-24.6 0-33.9zM0 336c0-26.5 21.5-48 48-48H64V416H512V288h16c26.5 0 48 21.5 48 48v96c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V336z"/></svg>
                </div>
                <span class="ml-2"> {{ ' - '+cursoLocal.idCuestionario.titulo }}</span>
              </div>  
              <div class="d-flex">
                <span class="texto-descripcion">Obtener al menos {{ cursoLocal.idCuestionario.puntosNecesarios }} pts</span>
                <span class="ml-auto texto-descripcion">
                  {{ ( Math.floor(cursoLocal.idCuestionario.limiteTiempo / 60)== 0? '': Math.floor(cursoLocal.idCuestionario.limiteTiempo / 60) + 'm ') + (cursoLocal.idCuestionario.limiteTiempo % 60 == 0? '': cursoLocal.idCuestionario.limiteTiempo % 60+ 's ' )}}
                </span>
              </div>
        </div>     
      </div>
    </VCardItem>
  </VCard>

                    
    </section>
</template>

<style>  

  .image-preview {
  max-width: 100%;
  height: auto;
}
 
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
  background-color: rgb(var(--v-theme-primary));
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
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
.stepper-description {
  font-size: 12px;
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
.icon-svg-title.svg-verde{
	width: 22px;
	fill: #97B770;
}
.v-expansion-panel-text__wrapper {
  padding-left: 0px;
  padding-right: 0px;

}
.curso_titulo{
  font-size: 25px;
  font-weight: 600;
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
.texto-subtitulos{
  font-weight: 200;
  font-size: 14px;
  color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
}
.texto-descripcion {
  font-size: 12px;
  color: rgba(var(--v-theme-on-background), var(--v-disabled-opacity));
}
.v-expansion-panel__shadow {
  display: none;
}
.paneles-modulos {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); 
  border-radius: 4px; 
}
.container-cuestionario-final {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)); 
  border-radius: 4px;
}
#overlay {
    position: fixed;       
    top: 0;                
    left: 0;               
    width: 100%;           
    height: 100%;          
    background-color: rgba(0, 0, 0, 0.2); /* Color de fondo negro con transparencia del 20% */
    z-index: 1000;         
}

</style>