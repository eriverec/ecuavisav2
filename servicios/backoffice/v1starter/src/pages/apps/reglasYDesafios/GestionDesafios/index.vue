<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const currentTab = ref('tab-lista');
const checkbox = ref(1);
const dataDesafio = ref([]);
const totalRegistros = ref(1);
const totalRegistrosHtml = ref(1);
const idCampaign = ref("");
const disabledPagination = ref(false);
const disabledViewList = ref(false);
const switchOnDisabled = ref(false);


const isDialogActive = ref(false);
const accionForm = ref('');

const nombre = ref('');

const frecuenciaDesafio = ref('');
const frecuenciaValor = ref(null);
const tituloDesafio = ref('');
const descripcionDesafio = ref('');
const statusDesafio = ref(true);
const tituloSticker = ref('');
const URLSticker = ref('');
const categoriaDesafio = ref('');
const tipoModel = ref('');
const fecha = ref('');

const idToEdit = ref('');

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});


onMounted(getDesafio)

async function getDesafio(page = 1, limit= 10){
  try {
      currentPage.value = 1;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-desafios.vercel.app/desafios`, requestOptions);
      const data = await response.json();

      dataDesafio.value = data.data;
      
      totalRegistros.value = Math.ceil(data.total / data.limit);
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

  return dataDesafio.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataDesafio.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// Función para manejar el cambio de paginación
/*
const eliminarRegistro = async (id) => {
  isDialogVisibleDelete.value = true;
  idDesafio.value = id;
  // console.log(id)
};

const eliminarRegistroSi = async () => {
  try {
      isDialogVisibleDelete.value = false;
      disabledViewList.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`https://servicio-desafios.vercel.app/desafios/${idDesafio.value}`, requestOptions);
      const data = await response.json();

      disabledViewList.value = false;
      await getDesafio(currentPage.value);

  } catch (error) {
      return console.error(error.message);    
  }
};
*/
const handleSwitchChange = async (index) => {
  const desafio = dataDesafio.value[index];
  
  const id = desafio._id;
  const estado = desafio.statusDesafio;
  switchOnDisabled.value = true;
  var jsonEnviar = {
      statusDesafio: estado
  }

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  var requestOptions = {
    method: 'PUT',
    headers: myHeaders,
    body: JSON.stringify(jsonEnviar),
    redirect: 'follow'
  };

  var response = await fetch(`https://servicio-desafios.vercel.app/desafios/${id}`, requestOptions);
  const data = await response.json();
  if(data.resp){
    // alert("Desafío editado correctamente");
  }else{
    alert("Un error se presentó: "+data.error);
    desafio.statusDesafio = !desafio.statusDesafio;
  };
  switchOnDisabled.value = false;
  // Realiza las operaciones necesarias con el ID y el estado
};

//FUNCIONES FORM
function resetForm(){
    frecuenciaDesafio.value = '';
    frecuenciaValor.value = null;
    tituloDesafio.value = '';
    descripcionDesafio.value = '';
    statusDesafio.value = true;
    tituloSticker.value = '';
    URLSticker.value = '';
    categoriaDesafio.value = '';
    tipoModel.value = '';
  
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

//EDIT
async function onEdit(id){
    
    resetForm();     
    accionForm.value = 'edit';
    const consulta = await fetch('https://servicio-desafios.vercel.app/desafios/' + id);
    const consultaJson = await consulta.json();
    const data = consultaJson.data;
    //console.log(paquete);
    idToEdit.value = data._id;
    nombre.value = data.tituloDesafio;
    frecuenciaDesafio.value = data.frecuenciaDesafio;
    frecuenciaValor.value = data.frecuenciaValor;
    tituloDesafio.value = data.tituloDesafio;
    descripcionDesafio.value = data.descripcionDesafio;
    statusDesafio.value = data.statusDesafio;
    tituloSticker.value = data.tituloSticker;
    URLSticker.value = data.URLSticker;
    categoriaDesafio.value = data.categoria;
    tipoModel.value = data.tipo;

    isDialogActive.value = true;  
}

//SEND

async function onComplete(){

  if ( !frecuenciaDesafio.value || frecuenciaValor.value == null || !tituloDesafio.value || !descripcionDesafio.value || 
    !tituloSticker.value || !URLSticker.value) {
        configSnackbar.value = {
                    message: "Llenar todos los campos para crear el desafío",
                    type: "error",
                    model: true
                };
        return false;
    }
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  if (accionForm.value === 'add') {

    let jsonEnviar ={
            "frecuenciaDesafio": frecuenciaDesafio.value,
            "frecuenciaValor": frecuenciaValor.value,
            "tituloDesafio": tituloDesafio.value,
            "descripcionDesafio": descripcionDesafio.value,
            "statusDesafio": statusDesafio.value,
            "tituloSticker": tituloSticker.value,
            "URLSticker": URLSticker.value,
            "tipo": tipoModel.value,
            "categoria": categoriaDesafio.value  
    }

    var raw = JSON.stringify(jsonEnviar);

    var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
    };

    const send = await fetch('https://servicio-desafios.vercel.app/add', requestOptions);
    const respuesta = await send.json();
    if (respuesta.resp) {
            configSnackbar.value = {
                message: "Desafío creada correctamente",
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

  let jsonEnviar ={
            "frecuenciaDesafio": frecuenciaDesafio.value,
            "frecuenciaValor": frecuenciaValor.value,
            "tituloDesafio": tituloDesafio.value,
            "descripcionDesafio": descripcionDesafio.value,
            "statusDesafio": statusDesafio.value,
            "tituloSticker": tituloSticker.value,
            "URLSticker": URLSticker.value,
            "categoria": categoriaDesafio.value,
            "tipo": tipoModel.value 

    }

    var raw = JSON.stringify(jsonEnviar);

    var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
    };

    const send = await fetch('https://servicio-desafios.vercel.app/desafios/' + idToEdit.value, requestOptions);
    const respuesta = await send.json();
    if (respuesta.resp) {
            configSnackbar.value = {
                message: "Desafío actualizado correctamente",
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
await getDesafio();
isDialogActive.value = false;

}

// DELETE

const isDialogVisibleDelete = ref(false);
const idToDelete = ref('');

function onDelete(id) {    
    isDialogVisibleDelete.value = true;
    idToDelete.value = id;   
}

async function deleteConfirmed() {
    
    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    const deleted = await fetch('https://servicio-desafios.vercel.app/desafios/' + idToDelete.value, requestOptions);
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
    await getDesafio();
    isDialogVisibleDelete.value = false;

}

// ---------------- HORARIOS -----------------

const diaSelected = ref(null);
const horarios = ref([]);
const horariosRaw = ref([]);
const isDialogVisibleHorario = ref(false);

const diasTotales = [
	{
		title: "Lunes",
		value: 1,
	},
	{
		title: "Martes",
		value: 2,
	},
	{
		title: "Miércoles",
		value: 3,
	},
	{
		title: "Jueves",
		value: 4,
	},
	{
		title: "Viernes",
		value: 5,
	},

	{
		title: "Sábado",
		value: 6,
	},
	{
		title: "Domingo",
		value: 0,
	},
];

const categoriaItems = [
  {
    title: "Trivia",
    value: "trivia",
  },
  {
    title: "Tiempo",
    value: "tiempo",
  },
  {
    title: "Sobre ti",
    value: "sobre_ti",
  },
  {
    title: "Comparte",
    value: "comparte",
  },
  {
    title: "En vivo",
    value: "en_vivo",
  }
]

const tipoItems = [
  {
    title: "Trivia",
    value: "Trivia",
  },
  {
    title: "SubirFoto",
    value: "SubirFoto",
  },
  {
    title: "VideoConsumo",
    value: "VideoConsumo",
  },
  {
    title: "PerfilDatos",
    value: "PerfilDatos",
  },
  {
    title: "Compartir",
    value: "Compartir",
  },
  {
    title: "TriviaCodigo",
    value: "TriviaCodigo",
  }
]

function onEditHorarios(horario = [], n, id, f = ""){
  
  idToEdit.value = id;
  horarios.value = horario.slice();
  horariosRaw.value = horario.slice(); 
  diaSelected.value = null;
  if (f) {
    fecha.value = f; // Asignar el valor de fecha si se proporciona
  }
  isDialogVisibleHorario.value = true;
  nombre.value = n;
}

function closeDiagHorarios(){
  isDialogVisibleHorario.value = false;
  resetDiagHorarios();
}
function resetDiagHorarios (){
  diaSelected.value = null;
  idToEdit.value = '';
  horarios.value = [];
  horariosRaw.value = [];
  nombre.value = '';
}

const diasDisponibles = computed(() => { 
  let diferencia = [];
	if (horarios.value.length > 0) {
		horarios.value = horarios.value.sort(function (a, b) {
			return a.dia - b.dia;
		});
		//console.log('horario sorted', horarios.value);
		const diasHorarios = horarios.value.map((item) => item.dia);
		diferencia = diasTotales.filter(
			(item) => !diasHorarios.includes(item.value)
		);
		//console.log('dif', diferencia);
    
	} else{
    diferencia = diasTotales;
  }
  //console.log('dif', diferencia);
  return diferencia;
 
});

function resolveDia(dia) {
	let diaSolved = diasTotales.filter((item) => dia === item.value);
	return diaSolved[0].title;
}

  // ---------------- DIA ------------------
const addDia = () => {
	if (diaSelected.value !== null) {
		let diaNuevo = {
			dia: diaSelected.value,
			estadoDia: true,
			horas: [
				{					
					inicio: "12:00",
					fin: "14:00",
				},
			],
		};
		horarios.value.push(diaNuevo);
		diaSelected.value = null;
	}
};

const elimDia = (index) => {
	horarios.value.splice(index, 1);
};

  // ---------------- HORA ------------------

const addHora = (index) => {
	let horaNuevo = {	
		inicio: "12:00",
		fin: "14:00",
	};
	horarios.value[index].horas.push(horaNuevo);
};

const elimHora = (index, indexHora) => {
	horarios.value[index].horas.splice(indexHora, 1);
};

  // ---------------- ENVIAR ------------------
async function onCompleteHorarios(){

  let jsonEnviar ={
            "horarios": horarios.value,
            "fecha": fecha.value
  }

  //return console.log('enviando ',jsonEnviar);
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");   
  
  var raw = JSON.stringify(jsonEnviar);

  var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
  };

  const send = await fetch('https://servicio-desafios.vercel.app/desafios/' + idToEdit.value, requestOptions);
  const respuesta = await send.json();
  if (respuesta.resp) {
            configSnackbar.value = {
                message: "Horario actualizado correctamente",
                type: "success",
                model: true
            };
            await getDesafio();
            isDialogVisibleHorario.value = false;
            
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

</script>

<template>
  <section>

    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
                {{ configSnackbar.message }}
    </VSnackbar>
    
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
          <VBtn @click="deleteConfirmed">
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
                      Listado de desafíos
                    </VCardTitle>
                    <VCardSubtitle> Elige el desafío del que necesites información </VCardSubtitle>
                  </div>
                </div>

                
                <!-- inicio lista de Módulos -->
                  
                <div class="px-4">
                  <VBtn color="primary" class="mb-4" @click="onAdd">
                    Nuevo desafío
                    <VIcon
                      :size="22"
                      icon="tabler-plus"
                    />
                  </VBtn>
                  <VList lines="two" border v-if="dataDesafio.length < 1">
                    <VListItem>
                      <VListItemTitle>
                        <div class="loading"></div>
                      </VListItemTitle>
                    </VListItem>
                  </VList>

                  <VList lines="two" border  v-if="dataDesafio.length > 0">
                  <template
                    v-for="(desafio, index) of paginatedDesafios"
                    :key="index"
                  >
                    <VListItem :disabled="disabledViewList">
                      <VListItemTitle>
                        <div class="nombre-desafio">
                          {{desafio.tituloDesafio }}
                          
                          
                        </div>
                      </VListItemTitle>
                      <VListItemSubtitle class="mt-1" title="Estado del Desafío">
                        <div class="switch-estatus" style="margin-bottom:-10px">
                          <VSwitch :disabled="switchOnDisabled" :loading="switchOnDisabled?'warning':false" :color="desafio.statusDesafio?'success':'error'" v-model="desafio.statusDesafio" size="x-small" class="custom-vswitch" @change="handleSwitchChange(index)" />
                          <VChip
                            title="Desafío desactivado"
                            v-if="desafio.statusDesafio != true"
                            size="x-small"
                            label
                            color="error"
                          >
                            <span style="font-weight:medium">{{ desafio.statusDesafio?'Activo':'Inactivo' }}</span>
                          </VChip>

                          <small title="Desafío activo" color="success" v-if="desafio.statusDesafio == true">
                            <span style="font-weight:medium">{{ desafio.statusDesafio?'Activo':'Inactivo' }}</span>
                          </small>
                        </div>

                      

                        
                      </VListItemSubtitle>

                      <template #append>
                        <div class="espacio-right-2">
                          
                          <VBtn variant="text" icon  @click="onEditHorarios(desafio.horarios, desafio.tituloDesafio, desafio._id, desafio.fecha)">
                                    <VIcon size="22" icon="tabler-calendar-time" />
                          </VBtn>
                          
                          <VBtn color="success" variant="text" icon  @click="onEdit(desafio._id)">
                                    <VIcon size="22" icon="tabler-edit" />
                          </VBtn>

                          <VBtn
                            icon
                            size="x-small"
                            color="error"
                            variant="text"
                            @click="onDelete(desafio._id)"
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
                            :to="{ name: 'apps-reglasYDesafios-GestionDesafios-view-id', params: { id: desafio._id } }"
                          >
                            <VIcon
                              :size="22"
                              icon="tabler-eye"
                            />
                          </VBtn>
                        </div>
                      </template>
                    </VListItem>
                    <VDivider v-if="index !== dataDesafio.length - 1" />
                  </template>
                </VList>
                
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                    <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                    Página {{ currentPage }}
                    <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                        :disabled="(currentPage * itemsPerPage) >= dataDesafio.length">
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
                              {{ accionForm === "add" || accionForm === "duplicate" ? "Nuevo desafío" : "Editar " + nombre }}
                          </VCardTitle>
                      </VCardItem>

                      <VCardText>

                          <!-- 👉 Form -->
                          <VForm class="mt-6" @submit.prevent="onComplete">
                              <VRow class="d-flex flex-wrap justify-center gap-4">
                                  <VRow>
                                                                                                         
                                      <VCol cols="6" >
                                          <VTextField v-model="frecuenciaDesafio" label="Frecuencia de desafio" />
                                      </VCol>

                                      <VCol cols="6" >
                                          <VTextField v-model="frecuenciaValor" label="Frecuencia de valor" type="number"  />
                                      </VCol>

                                      <VCol cols="12" >
                                          <VTextField v-model="tituloDesafio" label="Título del desafío" />
                                      </VCol>

                                      <VCol cols="12" >
                                          <VSelect v-model="categoriaDesafio" :items="categoriaItems" label="Categoría del desafío" />
                                      </VCol>

                                      <VCol cols="12" >
                                          <VSelect v-model="tipoModel" :items="tipoItems" label="Tipos del desafío" />
                                      </VCol>

                                      <VCol cols="12" >
                                          <VTextField v-model="descripcionDesafio" label="Descripción del desafío" />
                                      </VCol>

                                      <VCol cols="6" >
                                          <VSwitch v-model="statusDesafio" label="Estatus del desafío" />
                                      </VCol>

                                      <VCol cols="6" >
                                          <VTextField v-model="tituloSticker" label="Título del sticker" />
                                      </VCol>

                                      <VCol cols="12" >
                                          <VTextField v-model="URLSticker" label="URL del sticker" />
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
       
                  <!-- 👉 HORARIOS -->
                  <VDialog v-model="isDialogVisibleHorario" persistent no-click-animation max-width="1200">

                  <!-- Dialog close btn -->
                  <DialogCloseBtn @click="closeDiagHorarios" />

                  <VCard  class="pa-sm-14 pa-5">
                      <VCardItem class="text-center">
                          <VCardTitle class="text-h5">
                              {{ "Editar horarios de " + nombre }}
                          </VCardTitle>
                      </VCardItem>

                      <VCardText>

                          <!-- 👉 Form -->
                          <VForm v-if="isDialogVisibleHorario" class="mt-6" @submit.prevent="onCompleteHorarios">
                            <VRow>
                              <VCol
                                cols="12"
                                style="display: flex; flex-wrap: wrap; align-items: center"
                              >
                                <VCol cols="4">
                                  <VSelect
                                    v-model="diaSelected"
                                    :items="diasDisponibles"
                                    :disabled="diasDisponibles.length === 0"
                                    label="Día de la semana"
                                  />
                                </VCol>
                                <VCol cols="2" class="d-flex gap-4">
                                  <VBtn
                                    color="primary"
                                    @click="addDia()"
                                    :disabled="diasDisponibles.length === 0 || diaSelected == null"
                                  >
                                    Añadir día
                                  </VBtn>
                                  
                               
                                </VCol>
                                <VCol cols="4" class="ml-4">
                                  <AppDateTimePicker style="width: 300px;" 
                                        prepend-inner-icon="tabler-calendar" 
                                        density="compact" 
                                        v-model="fecha"
                                        show-current=true :config="{
                                            position: 'auto right',
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            reactive: true
                                        }" />
                                </VCol>
                              </VCol>
                              
                              <VCol cols="12">
                                <VList class="card-list">
                                  <VExpansionPanels variant="accordion" multiple>
                                    <VExpansionPanel
                                      v-for="(horario, index) in horarios"
                                      :key="index"
                                    >
                                      <VExpansionPanelTitle
                                        class="d-flex flex-wrap justify-space-between gap-4"
                                      >
                                        <h3>{{ resolveDia(horario.dia) }}</h3>
                                        <VChip
                                          :color="
                                            horario.estadoDia == true ? 'success' : 'warning'
                                          "
                                          class="mr-4"
                                          >{{
                                            horario.estadoDia == true ? "Activo" : "Inactivo"
                                          }}
                                        </VChip>
                                        <VSwitch
                                          v-model="horario.estadoDia"
                                          color="success"
                                          :label="
                                            horario.estadoDia == true
                                              ? 'Día activo'
                                              : 'Día inactivo'
                                          "
                                        />
                                      </VExpansionPanelTitle>
                                      <VExpansionPanelText
                                        class="d-flex flex-wrap justify-space-between"
                                      >
                                        <div
                                          style="
                                            padding: 1rem;
                                            border: 1px solid
                                              rgba(
                                                var(--v-theme-on-background),
                                                var(--v-disabled-opacity)
                                              );
                                            border-radius: 7px;
                                          "
                                        >
                                          <div class="d-flex ml-4 gap-4 pb-4">
                                                  <VBtn color="primary" @click="addHora(index)">
                                                    Añadir hora
                                                  </VBtn>

                                                  <VBtn
                                                    style="margin-left: 0.5rem"
                                                    color="error"
                                                    @click="elimDia(index)"
                                                  >
                                                    Eliminar día
                                                  </VBtn>
                                          </div>
                                          <VTable class="w-full">
                                            <thead>
                                             
                                              <tr>                                           
                                                <th scope="col" class="column-width">
                                                  Hora de inicio
                                                </th>
                                                <th scope="col" class="column-width">
                                                  Hora de fin
                                                </th>
                                                <th scope="col" class="column-width"></th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              <tr
                                                v-for="(hora, indexHora) in horario.horas.sort(
                                                  (b, a) => b.inicio.localeCompare(a.inicio)
                                                )"
                                                :key="indexHora"
                                              >
                                                
                                                <td class="py-4 column-width">  
                                                  <AppDateTimePicker 
                                                    class="date-picker-wrapper"       
                                                                      
                                                    v-model="hora.inicio"
                                                    label="Hora Inicio"
                                                    :config="{
                                                                                                        
                                                      enableTime: true,
                                                      noCalendar: true,
                                                      dateFormat: 'H:i',
                                                    }"
                                                  />                                                               
                                                </td>

                                                <td class="py-4 column-width" >
                                                  <AppDateTimePicker 
                                                   class="date-picker-wrapper"
                                                    
                                                    v-model="hora.fin"
                                                    label="Hora Fin"
                                                    :config="{
                                                      
                                                      enableTime: true,
                                                      noCalendar: true,
                                                      dateFormat: 'H:i',
                                                    }"
                                                  />
                                                </td>
                                                <td class="py-4 column-width">
                                                  <div class="d-flex align-center gap-4 py-4">

                                                    <VBtn
                                                      v-if="horario.horas.length > 1"
                                                      color="error"
                                                      @click="elimHora(index, indexHora)"
                                                      ><VIcon icon="tabler-trash"></VIcon
                                                    ></VBtn>
                                                    
                     
                                                  </div>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </VTable>
                                        </div>
                                      </VExpansionPanelText>
                                    </VExpansionPanel>
                                  </VExpansionPanels>
                                </VList>
                              </VCol>
                            </VRow>
                            <!-- 👉 Submit and Cancel -->
                            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
                                      <VBtn type="submit"> Guardar </VBtn>

                                      <VBtn color="secondary" variant="tonal" @click="closeDiagHorarios">
                                          Cancelar
                                      </VBtn>
                                  </VCol>
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
</style>
