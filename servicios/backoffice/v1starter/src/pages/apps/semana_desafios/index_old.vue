<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { onMounted } from 'vue';
import 'vue3-form-wizard/dist/style.css';
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const dataSemanas = ref([]);
const isLoading = ref(false);
const isLoading2 = ref(false);
const reglasLoading = ref(false);
const listaDesafios = ref([]);

async function getSemanas_desafios (){
    try {
      isLoading.value = true;  
      const consulta = await fetch('https://servicio-desafios.vercel.app/semana/all/get');
      const consultaJson = await consulta.json();

      let dataRaw = Array.from(consultaJson.data); 

      dataSemanas.value = dataRaw.map(item => ({
            ...item,
            fecha_inicio: moment(item.fecha_inicio).utc().format("DD/MM/YYYY"),
            fecha_fin: moment(item.fecha_fin).utc().format("DD/MM/YYYY")
      }));
      //console.log(dataSemanas.value);
      isLoading.value = false; 
    } catch (error) {
        console.error(error.message);
    }
} 

async function getDesafios (){
    try {      
      reglasLoading.value = true;  
      const consulta = await fetch('https://servicio-desafios.vercel.app/desafios');
      const consultaJson = await consulta.json();
      listaDesafios.value = consultaJson.data.map(({tituloDesafio, _id})=>({
        title: tituloDesafio,
        value: _id
      }));
                      
    } catch (error) {
        console.error(error.message);
    }
} 

onMounted(async()=>{
    isLoading2.value = true;
    await getSemanas_desafios();
    await getDesafios();
    isLoading2.value = false;
})

const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedSemanas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataSemanas.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataSemanas.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};


// -------------------------------ACCIONES------------------------------------------
const isDialogActive = ref(false);
const accionForm = ref('');
    //-----DATOS FORM----

const tituloSelected = ref('');    
const titulo = ref('');
const descripcion = ref('');
const imagen_descriptiva = ref('');
const desafios = ref([]);
const fecha_inicio = ref('');
const fecha_fin = ref('');
const urlPremio = ref('');
const fechaDisplay = ref('');

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

    //------FUNCIONES
function resetForm(){
    titulo.value = '';
    descripcion.value = '';
    imagen_descriptiva.value = '';
    desafios.value = [];
    fecha_inicio.value = '';
    fecha_fin.value = '';
    urlPremio.value = '';
    fechaDisplay.value = '';
} 
function closeDiag(){
    resetForm(); 
    isDialogActive.value = false;
}

function obtenerFechas(selectedDates, dateStr, instance) {
    
    if (selectedDates.length > 1) {
      //console.log(selectedDates);  
      fecha_inicio.value = moment(selectedDates[0]).format('DD-MM-YYYY');
      fecha_fin.value = moment(selectedDates[1]).format('DD-MM-YYYY');     
      //console.log('format',fecha_inicio.value); 
      //console.log('format',fecha_fin.value); 
    }
}

// ----------ADD-------------
async function onAdd(){
    isLoading2.value = true;
    resetForm(); 
    accionForm.value = 'add';
    isDialogActive.value = true;
    isLoading2.value = false;
}

// ----------EDIT-------------
const idToEdit = ref('');

function filtrarDesafios(listaDesafios, elementos) {
    const valoresDesafiosFiltrados = listaDesafios
        .filter(desafio => elementos.includes(desafio.value))
        .map(desafio => desafio.value);
    return valoresDesafiosFiltrados;
}

async function onEdit(id){
    isLoading2.value = true;
    resetForm();     
    accionForm.value = 'edit';
    const consulta = await fetch('https://servicio-desafios.vercel.app/semana/get/' + id);
    const consultaJson = await consulta.json();
    const data = consultaJson.data;
    //console.log(paquete);

    // console.log(data)
    tituloSelected.value = data.titulo;
    idToEdit.value = data._id;
    titulo.value = data.titulo;
    descripcion.value = data.descripcion;
    imagen_descriptiva.value = data.imagen_descriptiva;
    urlPremio.value = data.urlPremio;

    desafios.value = filtrarDesafios(listaDesafios.value, data.desafios);

    fecha_inicio.value = moment(data.fecha_inicio).utc().format("DD/MM/YYYY");
    fecha_fin.value = moment(data.fecha_fin).utc().format("DD/MM/YYYY");
    fechaDisplay.value = String(fecha_inicio.value + ' a ' + fecha_fin.value);
     
    isLoading2.value = false;
    isDialogActive.value = true;  
}

// ------------SEND--------------

async function onComplete(){

    if(desafios.value.length == 0){
        configSnackbar.value = {
                message: "Debe ingresar almenos 1 desafío",
                type: "error",
                model: true
            };
    }


    //return console.log('datos enviar', jsonEnviar)
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (accionForm.value === 'add') {

        

        let jsonEnviar ={
            "titulo": titulo.value,
            "descripcion": descripcion.value,
            "imagen_descriptiva": imagen_descriptiva.value,
            "urlPremio": urlPremio.value,
            "desafios": desafios.value,
            "fecha_inicio": fecha_inicio.value,
            "fecha_fin": fecha_fin.value  
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const send = await fetch('https://servicio-desafios.vercel.app/semana/create', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Semana de desafíos creada correctamente",
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

        console.log(desafios.value)

        let jsonEnviar ={
            "_id": idToEdit.value,
            "titulo": titulo.value,
            "descripcion": descripcion.value,
            "imagen_descriptiva": imagen_descriptiva.value,
            "urlPremio": urlPremio.value,
            "desafios": desafios.value,
            "fecha_inicio": fecha_inicio.value,
            "fecha_fin": fecha_fin.value   
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://servicio-desafios.vercel.app/semana/update', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Semana de desafíos actualizada correctamente",
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
    }
    await getSemanas_desafios();
    isDialogActive.value = false;

}

// -------------------------------DELETE-----------------------------------//
const isDialogVisibleDelete = ref(false);
const idToDelete = ref('');

function onDelete(id) {
    isLoading2.value = true;
    isDialogVisibleDelete.value = true;
    idToDelete.value = id;
    isLoading2.value = false;
}

async function deleteConfirmed() {
    isLoading2.value = true;
    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    const deleted = await fetch('https://servicio-desafios.vercel.app/semana/delete/' + idToDelete.value, requestOptions);
    const respuesta = await deleted.json();
    if (respuesta.resp) {
        configSnackbar.value = {
            message: "Semana de desafío eliminada correctamente",
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
    await getSemanas_desafios();
    isDialogVisibleDelete.value = false;
    isLoading2.value = false;
}

</script>

<template>
    <section>
        
        
           

            <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
                {{ configSnackbar.message }}
            </VSnackbar>

            <VDialog v-model="isLoading2" persistent no-click-animation width="300">
                <VCardText class="pt-3 text-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </VCardText>
            </VDialog>

            <VRow>
                <VCol cols="12" sm="12" lg="12">
                    <VCard>
                    <VCardTitle class="pt-4 pl-6">Listado de semanas de desafíos</VCardTitle>   
                    
                    <VCardItem style="margin-bottom: -2rem;">
                            <div class="d-flex flex-wrap gap-4 mt-10">
                                <VBtn prepend-icon="tabler-plus" color="success" variant="tonal" class="ml-auto" @click="onAdd">
                                    Nueva semana
                                </VBtn>
                            </div>
        
                    </VCardItem>

                    <VCardItem v-if="isLoading">
                    Cargando datos... 
                    </VCardItem>   
                    <VCardItem v-else>
                    <VTable class="text-no-wrap tableNavegacion mb-5">
                        <thead>
                            <tr>   
                            <th scope="col">Título</th>
                            <th scope="col">Fecha de inicio</th>  
                            <th scope="col">Fecha de fin</th>  
                            <th scope="col">Acciones</th>                                                   
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="item in paginatedSemanas">
                            <td class="text-medium-emphasis">
                                {{ item.titulo}}
                            </td>     
                            <td class="text-medium-emphasis">
                                {{ item.fecha_inicio}}
                            </td>    
                            <td class="text-medium-emphasis">
                                {{ item.fecha_fin}}
                            </td>    
                                        
                            <td class="text-medium-emphasis">
                                <VBtn color="success" variant="text" icon  @click="onEdit(item._id)">
                                    <VIcon size="22" icon="tabler-edit" />
                                </VBtn>

                                <VBtn icon  color="error" variant="text" @click="onDelete(item._id)">
                                    <VIcon size="22" icon="tabler-trash" />
                                </VBtn>
                            </td>             
                            </tr>
                        </tbody>
                    </VTable>
                    <div class="d-flex align-center justify-space-between botonescurrentPage">
                    <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                    Página {{ currentPage }}
                    <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                        :disabled="(currentPage * itemsPerPage) >= dataSemanas.length">
                    </VBtn>
                    </div>
                    </VCardItem>  
                    
                    </VCard>
                </VCol>
           
            </VRow>

            <VDialog v-model="isDialogActive" persistent no-click-animation max-width="800">

                <!-- Dialog close btn -->
                <DialogCloseBtn @click="closeDiag" />

                <VCard  class="pa-sm-14 pa-5">
                    <VCardItem class="text-center">
                        <VCardTitle class="text-h5 mb-3">
                            {{ accionForm === "add" || accionForm === "duplicate" ? "Nueva semana" : "Editar " + tituloSelected }}
                        </VCardTitle>
                    </VCardItem>

                    <VCardText>

                        <!-- 👉 Form -->
                        <VForm class="mt-6" @submit.prevent="onComplete">
                            <VRow class="d-flex flex-wrap justify-center gap-4">
                                <VRow>
                                                                    
                                    <VCol cols="12" >
                                        <VTextField v-model="titulo" label="Título" placeholder="Nombre de la trivia" />
                                    </VCol>

                                    <VCol cols="12" >
                                        <VTextField v-model="descripcion" label="Descripción" placeholder="Descripción de la trivia" />
                                    </VCol>

                                    <VCol cols="12" >
                                        <VTextField v-model="imagen_descriptiva" label="Imágen descriptiva" placeholder="Imágen descriptiva" />
                                    </VCol>

                                    <VCol cols="12" >
                                        <VTextField v-model="urlPremio" label="Link del premio para la semana" placeholder="Link del premio para la semana" />
                                    </VCol>
                                    <VCol cols="12">
                                    <div class="mb-3">Seleccione el rango de fecha para la semana</div>    
                                    <div class="date-picker-wrapper" style="width: 100%;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaDisplay"
                                        show-current=true @on-change="obtenerFechas" :config="{
                                            position: 'auto right',
                                            mode: 'range',
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            reactive: true
                                        }" />
                                    </div>
                                    </VCol>
                                    <VCol class="mb-2" cols="12" >
                                    <span>Seleccione los desafíos para la semana</span> 
                                    </VCol>

                                    <VCol cols="12">

                                        <v-select clearable chips multiple v-model="desafios" :items="listaDesafios" label="Seleccione el desafío vinculado"
                                         :menu-props="{ maxHeight: '400' }"
                                        >
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
                                        </v-select>
                                    </VCol>

                                    <VCol style="margin-top: -1.5rem;" v-for="item in listaDesafios" cols="12">
                                        

                                        <VCheckbox
                                            v-model="desafios"
                                            :label="item.title"
                                            :value="item.value"
                                        />
                                        
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

            <VDialog v-model="isDialogVisibleDelete" persistent class="v-dialog-sm">

                <!-- Dialog close btn -->
                <DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

                <!-- Dialog Content -->
                <VCard title="Eliminar registro">
                    <VCardText>
                        ¿Desea eliminar la trivia?
                    </VCardText>

                    <VCardText class="d-flex justify-end gap-3 flex-wrap">
                        <VBtn color="secondary" variant="tonal" @click="isDialogVisibleDelete = false">
                            No, Cerrar
                        </VBtn>
                        <VBtn @click="deleteConfirmed">
                            Si, eliminar
                        </VBtn>
                    </VCardText>
                </VCard>
            </VDialog>
      
             
             
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
}

</style>