<script setup>
import moduloTemplate from "@/views/apps/elearning/gestion-modulos/moduloTemplate.vue";
import { parseISO } from 'date-fns';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const isDialogVisibleAddModulo = ref(false)
const eliminarDisabled = ref(false);

const categoriaModelLoading = ref(false);
const etiquetasModelLoading = ref(false);

const currentTab = ref('tab-lista');
const checkbox = ref(1);
const dataVideoList = ref([]);
const totalRegistros = ref(1);
const totalRegistrosHtml = ref(1);
const idCampaign = ref("");
const disabledPagination = ref(false);
const disabledViewList = ref(false);
const switchOnDisabled = ref(false);
const isDialogVisibleVistaPreviaVideo = ref(false)
const iframeOptions = ref(null)

const fechaHoy = moment().format("YYYY-MM-DD");
const yesterday = moment().subtract(1, 'days').format("YYYY-MM-DD");

const fechaIFModel = ref({
  fechasModel: [parseISO(yesterday), parseISO(fechaHoy)],
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

const isDialogActive = ref(false);
const accionForm = ref('');

const nombre = ref('');
const dataModuloModel = ref([]);
const dataModuloItems = ref([]);
const modulosSelectList = ref([]);

const selectRefModulo = ref(null);
const moduloModelLoading = ref(false);
const searchModuloModel = ref(null)
const moduloItemsCopy = ref([]);

const dataCuestionarioModel = ref([]);
const dataCuestionarioItems = ref([]);

const selectRefCuestionario = ref(null);
const cuestionarioModelLoading = ref(false);
const searchCuestionarioModel = ref(null)
const cuestionarioItemsCopy = ref([]);

const idRudoModel = ref('');
const duracionModel = ref('');
const descripcionDesafio = ref('');
const statusDesafio = ref(true);
const tituloSticker = ref('');
const URLSticker = ref('');
const categoriaModel = ref('');
const etiquetasModel = ref('');

const tituloModel = ref(null);
const descripcionModel = ref(null);
const thumbnailModel = ref(null);
const estadoModel = ref(true);


const idToEdit = ref('');

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
  await getGestionCursos();
  await getCuestionario();
})

async function getEtiquetas(page = 1, limit= 10){
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

async function getCategorias(page = 1, limit= 10){
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

async function getGestionCursos(page = 1, limit= 10){
  try {
      currentPage.value = 1;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-elearning.vercel.app/curso/all?limit=200&page=1`, requestOptions);
      const data = await response.json();

      dataVideoList.value = data.data;
      
      totalRegistros.value = Math.ceil(data.total / data.limit);
  } catch (error) {
      return console.error(error.message);    
  }
}

async function getModulos(page = 1, limit= 10){
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

      dataModuloItems.value = data.data.reduce((acumulador, actual) => {
        acumulador.push({
          title: `${actual.titulo}`,
          value: actual._id,
        });
        return acumulador;
      }, []);
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

// Funciones para manejar el cambio de paginación
const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedDesafios = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataVideoList.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataVideoList.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

//FUNCIONES FORM
function resetForm(){
    idToEdit.value = "";
    tituloModel.value = "";
    idRudoModel.value = "";
    duracionModel.value = "";
    descripcionModel.value = "";
    thumbnailModel.value = "";
    duracionModel.value = "";
    etiquetasModel.value = "";
    categoriaModel.value = "";
    modulosSelectList.value = [];
    dataModuloModel.value = [];
    dataCuestionarioModel.value = null;
    estadoModel.value = true;
    fechaIFModel.value = {
      fechasModel: [parseISO(yesterday), parseISO(fechaHoy)],
      fechasVModel: [parseISO(fechaHoy)],
      fechasVConfig: fechaIFModel.value.fechasVConfig,
      fechai: fechaHoy,
      fechaV: fechaHoy,
      fechaf: fechaHoy
    }
}
function closeDiag(){
    resetForm(); 
    isDialogActive.value = false;
}

//ADD
async function onAdd(){     
    resetForm(); 
    accionForm.value = 'add';
    isDialogActive.value = true;
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

function filtrarDesafios(listaDesafios, elementos) {
    const valoresDesafiosFiltrados = listaDesafios
        .filter(desafio => elementos.includes(desafio.value))
        .map(desafio => desafio.value);
    return valoresDesafiosFiltrados;
}

//EDIT
async function onEdit(id){
    resetForm();     
    accionForm.value = 'edit';
    const consulta = await fetch('https://servicio-elearning.vercel.app/curso/get/' + id);
    const consultaJson = await consulta.json();
    const data = consultaJson.data;

    idToEdit.value = data._id;

    tituloModel.value = data.titulo;
    idRudoModel.value = data.idRudo;
    duracionModel.value = data.duracion;
    descripcionModel.value = data.descripcion;
    thumbnailModel.value = data.thumbnail;
    etiquetasModel.value = data.etiquetas;
    categoriaModel.value = data.categoria;
    estadoModel.value = data.estado;
    if(data.cuestionario){
      dataCuestionarioModel.value = data.cuestionario._id;
    }

    dataModuloModel.value = filtrarDesafios(dataModuloItems.value, data.modulos.reduce((acumulador, actual) => {
        acumulador.push(actual._id);
        return acumulador;
      }, []));

    if(data.fechai){
      const fechasMongo = {
        fechai: moment(data.fechai, "DD-MM-YYYY").format("YYYY-MM-DD"),
        fechaf: moment(data.fechaf, "DD-MM-YYYY").format("YYYY-MM-DD"),
        fechav: moment(data.fechaVencimiento, "DD-MM-YYYY").format("YYYY-MM-DD"),
      }

      fechaIFModel.value = {
        fechasModel: [parseISO(fechasMongo.fechai), parseISO(fechasMongo.fechaf)],
        fechasVModel: [parseISO(fechasMongo.fechav)],
        fechasVConfig: fechaIFModel.value.fechasVConfig,
        fechai: data.fechai,
        fechaV: data.fechaVencimiento,
        fechaf: data.fechaf
      }

      fechaIFModel.value.fechasVConfig["minDate"] = parseISO(fechasMongo.fechav);
    }
    isDialogActive.value = true; 

    modulosSelectList.value= obtenerListaOrdenada(dataModuloModel.value, data.modulos);
}

//SEND

async function onComplete(){
  if (
        !categoriaModel.value || 
        !idRudoModel.value || 
        !descripcionModel.value || 
        !thumbnailModel.value || 
        !dataCuestionarioModel.value || 
        !duracionModel.value
      ){
        configSnackbar.value = {
            message: "Llenar todos los campos para crear el registro",
            type: "error",
            model: true
        };
        return false;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (accionForm.value === 'add') {
      let jsonEnviar = {
          "titulo": tituloModel.value,
          "descripcion": descripcionModel.value,
          "idRudo": idRudoModel.value,
          "thumbnail": thumbnailModel.value,
          "duracion": duracionModel.value,
          "categoria": categoriaModel.value,
          "etiquetas": etiquetasModel.value,
          "idCuestionario": dataCuestionarioModel.value,
          "fechai": fechaIFModel.value.fechai,
          "fechaf": fechaIFModel.value.fechaf,
          "fechaVencimiento": fechaIFModel.value.fechaV,
          "estado": estadoModel.value,
          "modulos": obtenerValorYPosicion()
      }
      var raw = JSON.stringify(jsonEnviar);

      var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow'
      };

      const send = await fetch('https://servicio-elearning.vercel.app/curso/create', requestOptions);
      const respuesta = await send.json();
      if (respuesta.resp) {
        configSnackbar.value = {
            message: "Registro creado correctamente",
            type: "success",
            model: true
        };
      } else {
        configSnackbar.value = {
            message: respuesta.mensaje,
            type: "error",
            model: true
        };
        console.error(respuesta.error);
        return false;
      }
    }else if(accionForm.value === 'edit'){
        let jsonEnviar = {
          "titulo": tituloModel.value,
          "descripcion": descripcionModel.value,
          "idRudo": idRudoModel.value,
          "thumbnail": thumbnailModel.value,
          "duracion": duracionModel.value,
          "idCuestionario": dataCuestionarioModel.value,
          "categoria": categoriaModel.value,
          "etiquetas": etiquetasModel.value,
          "fechai": fechaIFModel.value.fechai,
          "fechaf": fechaIFModel.value.fechaf,
          "fechaVencimiento": fechaIFModel.value.fechaV,
          "estado": estadoModel.value,
          "modulos": obtenerValorYPosicion()
        }
        var raw = JSON.stringify(jsonEnviar);
        var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
        };
        const send = await fetch('https://servicio-elearning.vercel.app/curso/update/' + idToEdit.value, requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
                configSnackbar.value = {
                    message: "Registro actualizado correctamente",
                    type: "success",
                    model: true
                };
                
        } else {
                configSnackbar.value = {
                    message: respuesta.mensaje,
                    type: "error",
                    model: true
                };
                console.error(respuesta.error);
                return false;

        }
    }
    await getGestionCursos();

    await getEtiquetas();
    await getCategorias();
  
    isDialogActive.value = false;
}

// DELETE

const isDialogVisibleDelete = ref(false);
const idToDelete = ref('');

function onDelete(id) {    
    isDialogVisibleDelete.value = true;
    idToDelete.value = id;   
}

function onView(data) {
    iframeOptions.value = {
      _id:data._id,
      idRudoModel: data.idRudo,
      urlContent: data.urlRudo,
    };
    isDialogVisibleVistaPreviaVideo.value = true;
}

// Función para inicializar la lista de videos seleccionados
function inicializarVideosSelectList() {
    const modulosItemsLocal = dataModuloItems.value;
    const dataModuloItemsID = dataModuloModel.value;
    if (dataModuloItemsID) {
        //Si se selecciona nuevos elementos del select
        if(modulosSelectList.value.length < dataModuloItemsID.length){
          for(var j in modulosItemsLocal){
            if(dataModuloItemsID[dataModuloItemsID.length - 1] == modulosItemsLocal[j].value){
              modulosSelectList.value.push(modulosItemsLocal[j]);
            }
          }
        }

        //Si se elimina elementos del select
        if(modulosSelectList.value.length > dataModuloItemsID.length){
          // Filtrar los elementos de modulosSelectList.value que no están presentes en listaB
          const elementosFaltantes = modulosSelectList.value.filter(itemA => !dataModuloItemsID.includes(itemA.value));

          for(var i in elementosFaltantes){
            for(var j in modulosSelectList.value){
              if(elementosFaltantes[i].value == modulosSelectList.value[j].value){
                modulosSelectList.value.splice(j, 1); // Eliminar el elemento en la posición j
                break; // Salir del bucle una vez que se elimina el elemento
              }
            }
          }
        }
    }
}

watch(async () => dataModuloModel.value, async () => {
  if(dataModuloModel.value){
    inicializarVideosSelectList()
  }
});

function obtenerValorYPosicion() {
    const lista = modulosSelectList.value;
    // Crear un nuevo array para almacenar los objetos con el valor y la posición
    const resultado = [];
    // Iterar sobre la lista y agregar cada elemento al resultado con su valor y posición
    lista.forEach((item, index) => {
        resultado.push({ value: item.value, posicion: index });
    });
    // Devolver el array de objetos con el valor y la posición de cada elemento
    return resultado;
}

function cambiarPosicion(valor, direccion) {
    const lista = modulosSelectList.value;
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

async function deleteConfirmed() {
    eliminarDisabled.value = true;
    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    const deleted = await fetch('https://servicio-elearning.vercel.app/curso/delete/' + idToDelete.value, requestOptions);
    const respuesta = await deleted.json();
    if (respuesta.resp) {
        configSnackbar.value = {
            message: "Desafío eliminado correctamente",
            type: "success",
            model: true
        };
    } else {
        configSnackbar.value = {
            message: respuesta.mensaje,
            type: "error",
            model: true
        };
    }
    await getGestionCursos();
    isDialogVisibleDelete.value = false;
    eliminarDisabled.value = false;
}

const receiveTime = async (data) => {
  if(data.action == "modal"){
    isDialogVisibleAddModulo.value = data.modalShow;
  }

  if(data.action == "add"){
    await getModulos();
    isDialogVisibleAddModulo.value = data.modalShow;
    dataModuloModel.value.push(data.id);
    inicializarVideosSelectList()
  }
};

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

watch(selectRefCuestionario, (active) => {
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

watch(selectRefModulo, (active) => {
  if(!active){
    setTimeout(()=>{
      searchModuloModel.value = "";
    }, 1000)
  }
});

</script>

<template>
  <section>

    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
                {{ configSnackbar.message }}
    </VSnackbar>


    <VDialog
      v-model="isDialogVisibleAddModulo"
      width="600"
      persistent
    >
      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleAddModulo = !isDialogVisibleAddModulo" />

      <VCard>
        <!-- Dialog Content -->
        <moduloTemplate @get:eventModalCR="receiveTime" />
      </VCard>
    </VDialog>

    <VDialog
      v-model="isDialogVisibleVistaPreviaVideo"
      width="500"
      persistent
    >
      <!-- Activator -->
      <template #activator="{ props }">
        <!-- <VBtn v-bind="props">
          Click Me
        </VBtn> -->
      </template>

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleVistaPreviaVideo = !isDialogVisibleVistaPreviaVideo" />

      <!-- Dialog Content -->
      <VCard :title="iframeOptions.idRudoModel">
        <iframe
          class="mt-3"
          :title="'Video '+ iframeOptions.idRudoModel"
          width="100%"
          height="300"
          :src="iframeOptions.urlContent"
        ></iframe>

        <VCardText class="d-flex justify-end">
          <VBtn @click="isDialogVisibleVistaPreviaVideo = false">
            Aceptar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    
    <VDialog
      v-model="isDialogVisibleDelete"
      persistent
      class="v-dialog-sm"
    >

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

      <!-- Dialog Content -->
      <VCard title="Eliminar registro">
        <VCardText>
          ¿Desea eliminar el registro?
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogVisibleDelete = false"
          >
            No, cerrar
          </VBtn>
          <VBtn :disabled="eliminarDisabled" @click="deleteConfirmed">
            Si, eliminar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>
    <VRow>
      <VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="12"
      >
    

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
                      Listado de cursos E-Learning
                    </VCardTitle>
                    <VCardSubtitle> Mantenimiento de cursos E-Learning </VCardSubtitle>
                  </div>
                </div>

                
                <!-- inicio lista de Módulos -->
                  
                <div class="px-4">
                  <VBtn color="primary" class="mb-4" @click="onAdd">
                    Crear registro
                    <VIcon
                      :size="22"
                      icon="tabler-plus"
                    />
                  </VBtn>
                  <VList lines="two" border v-if="dataVideoList.length < 1">
                    <VListItem>
                      <VListItemTitle>
                        <div class="loading"></div>
                      </VListItemTitle>
                    </VListItem>
                  </VList>

                  <VList lines="two" border  v-if="dataVideoList.length > 0">
                  <template
                    v-for="(curso, index) of paginatedDesafios"
                    :key="index"
                  >
                    <VListItem :disabled="disabledViewList">
                      <VListItemTitle>
                        <div class="nombre-desafio d-flex flex-column">
                          <div class="d-flex">
                            <small>Curso</small>
                            <small class="text-disabled"><code class="p-0"><b>_id:</b>{{ curso._id }}</code></small>
                          </div>
                          <label>{{ curso.titulo }}</label>
                          <div class="content-items d-flex">
                            <div class="content-curso">
                              <VIcon
                                size="20"
                                icon="tabler-video"
                              />
                              <a class="pl-2" target="_blank" :href="curso.urlRudo">{{ curso.idRudo }}</a>
                            </div>
                            <div class="content-time pl-3">
                              <VIcon
                                size="20"
                                icon="tabler-clock"
                              />
                              <b>Duración: </b> {{ curso.duracion }} min
                            </div>

                            <div class="content-time pl-3">
                              <VIcon
                                size="20"
                                icon="mdi-animation"
                              />
                              <b>Categoría: </b> {{ curso.categoria }}
                            </div>

                            <div class="d-flex flex-nowrap pl-3">     
                              <VIcon
                                size="20"
                                icon="tabler-power"
                              />                 
                              <b>Estado: </b>                           
                                <div class="ml-2" v-if="curso.estado">
                                  <VChip color="success">
                                    Activo
                                  </VChip>
                                </div>
                                <div class="ml-2" v-else>
                                  <VChip color="error">                              
                                    Inactivo                                
                                  </VChip>
                                </div>                            
                            </div>

                          </div>
                        </div>
                      </VListItemTitle>

                      <template #append>
                        <div class="espacio-right-2">
                          <VBtn
                            title="Ver vista previa del curso"
                            icon
                            size="x-small"
                            color="warning"
                            variant="text"
                            @click="onView(curso)"
                          >
                            <VIcon
                              size="22"
                              icon="tabler-movie"
                            />
                          </VBtn>

                          <VBtn 
                            title="Editar registro" color="success" variant="text" icon  @click="onEdit(curso._id)">
                            <VIcon size="22" icon="tabler-edit" />
                          </VBtn>

                          <VBtn
                            title="Eliminar el registro"
                            icon
                            size="x-small"
                            color="error"
                            variant="text"
                            @click="onDelete(curso._id)"
                          >
                            <VIcon
                              size="22"
                              icon="tabler-trash"
                            />
                          </VBtn>

                          <VBtn
                            icon
                            variant="text"
                            color="default"
                            size="x-small"
                            :to="{ name: 'apps-elearning-gestion-cursos-view-id', params: { id: curso._id } }"
                          >
                            <VIcon
                              :size="22"
                              icon="tabler-eye"
                            />
                          </VBtn>
                        </div>
                      </template>
                    </VListItem>
                    <VDivider v-if="index !== paginatedDesafios.length - 1" />
                  </template>
                </VList>
                
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                    <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                    Página {{ currentPage }}
                    <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                        :disabled="(currentPage * itemsPerPage) >= dataVideoList.length">
                    </VBtn>
                </div>
                </div>
                <!-- fin lista usuarios -->

                <VDialog v-model="isDialogActive" persistent no-click-animation max-width="800">

                  <!-- Dialog close btn -->
                  <DialogCloseBtn @click="closeDiag" />

                  <VCard  class="pa-sm-14 pa-5">
                      <VCardItem class="text-center">
                          <VCardTitle class="text-h5 mb-3">
                              {{ accionForm === "add" || accionForm === "duplicate" ? "Crear registro" : "Editar " + nombre }}
                          </VCardTitle>
                      </VCardItem>

                      <VCardText>

                          <!-- 👉 Form -->
                          <VForm class="mt-6" @submit.prevent="onComplete">
                              <VRow class="">
                                  <VRow>
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
                                        <VSwitch v-model="estadoModel" label="Estado del curso" />
                                      </VCol>

                                      <VCol cols="6">
                                        <VTextField v-model="tituloModel" label="Título del curso" />
                                      </VCol>

                                      <VCol cols="6">
                                        <VTextField v-model="descripcionModel" label="Descripción" />
                                      </VCol>
                                      
                                      <VCol class="img-preview-container" cols="6">
                                        <VTextField v-model="thumbnailModel" label="Imagen principal" />
                                        <img v-if="thumbnailModel" class="img-preview" :src="thumbnailModel">
                                      </VCol>     

                                      <VCol cols="6" >
                                          <VTextField v-model="idRudoModel" label="Id video de RUDO" />
                                      </VCol>

                                      <VCol cols="12">
                                        <VTextField v-model="duracionModel" label="Tiempo que dura el curso" suffix="minutos" append-inner-icon="tabler-clock" type="number" />
                                      </VCol>

                                      <VCol cols="12" >
                                        <VCombobox 
                                          v-model="categoriaModel" 
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

                                      <VCol cols="12" >
                                          <VCombobox 
                                          item-text="title"
                                          item-value="value"
                                          v-model="etiquetasModel" 
                                          :items="etiquetasItems"
                                          chips
                                          multiple
                                          label="Etiquetas del curso" 
                                          :menu-props="{ maxHeight: '300' }"
                                          :disabled="etiquetasModelLoading"
                                          append-icon="mdi-refresh"
                                          @click:append="getEtiquetas"/>
                                      </VCol>

                                      <VCol cols="12" >
                                          <VSelect
                                            v-model:menu="selectRefCuestionario"
                                            no-data-text="No existen cuestionario que mostrar"
                                            append-icon="mdi-refresh"
                                            @click:append="getCuestionario"
                                            :disabled="cuestionarioModelLoading"
                                            item-text="title"
                                            item-value="value"
                                            v-model="dataCuestionarioModel" 
                                            :items="dataCuestionarioItems"
                                            label="Cuestionario para al final del curso"
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

                                      <VCol cols="12" >
                                          <VRow>
                                            <VCol cols="9" >
                                              <VSelect
                                                v-model:menu="selectRefModulo"
                                                no-data-text="No existen módulo que mostrar"
                                                append-icon="mdi-refresh"
                                                @click:append="getModulos"
                                                :disabled="moduloModelLoading"
                                                item-text="title"
                                                item-value="value"
                                                v-model="dataModuloModel" 
                                                :items="dataModuloItems"
                                                chips
                                                multiple
                                                label="Módulos educativos"
                                                :menu-props="{ maxHeight: '400' }">
                                                <template v-slot:prepend-item>
                                                  <v-list-item>
                                                    <v-list-item-content>
                                                      <VTextField v-model="searchModuloModel" clearable placeholder="Buscar módulo"/>
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
                                            <VCol cols="3" >
                                              <VBtn title="Agregar módulo" block @click="isDialogVisibleAddModulo = true"> Agregar </VBtn>
                                            </VCol>
                                          </VRow>
                                      </VCol>

                                      <VCol cols="12" v-if="dataModuloModel.length > 0">
                                        <VList
                                          lines="two"
                                          border
                                        >
                                          <template
                                            v-for="(videoSelect, index) of modulosSelectList"
                                            :key="videoSelect.value"
                                          >
                                            <VListItem>
                                              <template #prepend>
                                                <VIcon
                                                  :size="35"
                                                  icon="mdi-sale"
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
                                                  <span class="ms-4">Módulo</span>
                                                </VBadge>

                                                <span class="text-xs text-disabled">{{ videoSelect.value }}</span>
                                              </VListItemSubtitle>

                                              <template #append>
                                                <div class="btn-order" style="">
                                                  <VBtn size="x-small" :disabled="index == 0" variant="text" @click="cambiarPosicion(videoSelect.value, 'arriba')">
                                                    <VIcon :size="25" icon="mdi-arrow-up-bold-box" />
                                                  </VBtn>
                                                  <VBtn size="x-small" :disabled="index == modulosSelectList.length - 1" variant="text" @click="cambiarPosicion(videoSelect.value, 'abajo')">
                                                    <VIcon :size="25" icon="mdi-arrow-down-bold-box" />
                                                  </VBtn>
                                                </div>
                                              </template>
                                            </VListItem>
                                            <VDivider v-if="index !== modulosSelectList.length - 1" />
                                          </template>
                                        </VList>
                                      </VCol>
         
                                  </VRow>
                                  <!-- 👉 Submit and Cancel -->
                                  <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
                                      <VBtn type="submit"> Guardar </VBtn>
                                      <VBtn color="secondary" variant="tonal" @click="closeDiag">
                                          Cancelar
                                      </VBtn>
                                  </VCol>
                              </VRow>
                          </VForm>
                      </VCardText>
                  </VCard>
                </VDialog>
              </VWindowItem>
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">

.flat-picker-custom-style {
  position: sticky;
}

.flatpickr-calendar{
  position: fixed;
  top: 0; 
}

.flatpickr-calendar.open {     
  z-index: 10000;
}
  .btn-order {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
}
</style>

<style scoped> 
 
  .loading{
    border:2px solid #7367F0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border-right-color: transparent;
    animation: rot 1s linear infinite;
  }

  @keyframes rot {
    100%{
      transform: rotate(360deg);
    }
  }
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
.column-width {
    max-width: 200px;
    min-width: 120px;
    text-align: left;
}

.nombre-campania,
.espacio-right-2 {
    gap: 10px;
    display: flex;
    align-items: center;
}
.v-avatar {
  border-radius: initial !important;
}

.ava {
  margin-inline-end: 16px;
}

.paginador-campaign{
  display: flex;
}

.custom-vswitch  {
  transform: scale(0.55); /* Ajusta el valor según tus necesidades */
  transform-origin: left center;
}

.switch-estatus {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 0;
    padding-left: 5px;
}
.img-preview {
  margin-top: 0.5rem;
  width: 100%;
  height: 100%;
}
.img-preview-container {
  height: fit-content;
}
</style>
