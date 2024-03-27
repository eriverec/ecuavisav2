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
      const consulta = await fetch('https://ecuavisa-desafio-trivias.vercel.app/trivia/all/get');
      const consultaJson = await consulta.json();

      let dataRaw = Array.from(consultaJson.data); 

      dataSemanas.value = dataRaw.map(item => ({
            ...item,
            fecha_inicio: moment(item.fecha_inicio).format("DD/MM/YYYY"),
            fecha_fin: moment(item.fecha_fin).format("DD/MM/YYYY")
      }));
      
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

  return listaDesafios.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < listaDesafios.value.length) currentPage.value++;
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
const fechasRaw = ref([fecha_inicio, fecha_fin]);

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
    fechasRaw.value = [];  
} 
function closeDiag(){
    resetForm(); 
    isDialogActive.value = false;
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

async function onEdit(id){
    isLoading2.value = true;
    resetForm();     
    accionForm.value = 'edit';
    const consulta = await fetch('https://ecuavisa-desafio-trivias.vercel.app/trivia/get/' + id);
    const consultaJson = await consulta.json();
    const data = consultaJson.data;
    //console.log(paquete);
    tituloSelected.value = data.titulo;
    idToEdit.value = data._id;
    titulo.value = data.titulo;
    descripcion.value = data.descripcion;
    imagen_descriptiva.value = data.imagen_descriptiva;
    desafios.value = data.desafios;
    fecha_inicio.value = data.fecha_inicio;
    fecha_fin.value = data.fecha_fin;
    fechasRaw.value = [data.fecha_inicio,data.fecha_fin ];  

    isLoading2.value = false;
    isDialogActive.value = true;  
}

// ------------SEND--------------

async function onComplete(){

    let preguntasEnviar = preguntas.value;
           
    //console.log('data a enviar',dataEnviar);  
    let nombreValid = nombre.value;

    if (!validarArreglo(preguntasEnviar) || !nombreValid || nombreValid == "" || !idRegla.value || idRegla.value == "") {
        configSnackbar.value = {
                    message: "Debe llenar todos los campos",
                    type: "error",
                    model: true
                };
        return false;
    } 

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (accionForm.value === 'add') {

        let jsonEnviar ={
            "idRegla": idRegla.value,
            "nombre": nombre.value,
            "preguntas": preguntasEnviar  
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const send = await fetch('https://ecuavisa-desafio-trivias.vercel.app/trivia/create', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Trivia creada correctamente",
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
            "_id": idToEdit.value,
            "idRegla": idRegla.value,
            "nombre": nombre.value,
            "nombreOld": nombreOld.value,
            "preguntas": preguntasEnviar  
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://ecuavisa-desafio-trivias.vercel.app/trivia/update', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Trivia actualizada correctamente",
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
    await getTrivias();
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

    const deleted = await fetch('https://ecuavisa-desafio-trivias.vercel.app/trivia/delete/' + idToDelete.value, requestOptions);
    const respuesta = await deleted.json();
    if (respuesta.resp) {
        configSnackbar.value = {
            message: "Trivia eliminada correctamente",
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
    await getTrivias();
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
                        :disabled="(currentPage * itemsPerPage) >= listaDesafios.length">
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
                            {{ accionForm === "add" || accionForm === "duplicate" ? "Nueva trivia" : "Editar " + tituloSelected }}
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

                                    <VCol cols="6" >
                                        <VSelect v-model="idRegla" label="Id de regla" :items="idReglas" />
                                    </VCol>
                                    
                                    <VCol cols="6" class="d-flex">
                                                           
                                        <VBtn class="mr-auto" color="primary" prepend-icon="tabler-plus" variant="tonal" @click="addRegla" >
                                        Crear regla
                                        </VBtn>                                                                     
                                        
                                    </VCol>

                                    
                                    <VDivider v-if="reglaFormVisible"/>  

                                    <VRow v-if="reglaFormVisible" class="d-flex my-4">
                                    <VCol cols="12" >
                                        <h4>Crear regla</h4>
                                    </VCol>    

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

                                    <VDivider class="mt-4" v-if="reglaFormVisible"/>  
                                        <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
                                        <VBtn @click="crearRegla"> Crear regla </VBtn>

                                        <VBtn color="secondary" variant="tonal" @click="closeReglaForm">
                                            Cancelar
                                        </VBtn>
                                        </VCol>
                                    </VRow>
                                    <VCol cols="12" class="d-flex">
                                        <div class="d-flex align-content-end flex-wrap"><h4>Preguntas</h4></div>
                                                             
                                        <VBtn class="ml-auto" color="primary" prepend-icon="tabler-plus" variant="tonal" @click="resolveAñadirPregunta" >
                                        Añadir pregunta
                                        </VBtn>                                                                     
                                        
                                    </VCol>    
                                    <VDivider/>
                                    <div v-for="(p, index) in preguntas" cols="12" class="w-100 my-4 item-cards"> 
                                        <VBtn v-if="preguntas.length > 1" class="ml-auto boton-eleminar-itemsCards" size="38" color="error" @click="eliminarPregunta(index)"><VIcon icon="tabler-x" size="22" /></VBtn>
                                        
                                        <VCardText>
                                            <VCol cols="12">
                                                <VTextField class="mt-2" v-model="p.pregunta" label="Pregunta" placeholder="Escriba la pregunta" />
                                            </VCol>     
                                            
                                            <VCol cols="12" >
                                                <VSelect class="mt-2" v-model="p.tipo" label="Tipo" :items="tipoItems" @update:model-value="resolveOpciones(index, p.tipo)" />        
                                            </VCol> 

                                            <VCol cols="12" v-if= "p.tipo != 'votacion'">
                                                <VTextField  :class="p.tipo== 'opciones'?'mt-2':'my-2'" v-model="p.respuesta" label="Respuesta" placeholder="Escriba la respuesta" />
                                            </VCol>

                                            <VCol v-if="p.tipo == 'opciones'|| p.tipo == 'votacion'" cols="12" class="d-flex">
                                            <div class="d-flex align-content-end flex-wrap"><h4>Opciones</h4></div>
                                                                
                                            <VBtn class="ml-auto" color="primary" prepend-icon="tabler-plus" variant="tonal" @click="resolveAñadirOpcion(index)" >
                                            Añadir opción
                                            </VBtn>                                                                     
                                          
                                            </VCol>    
                                            <VDivider v-if="(p.tipo == 'opciones' || p.tipo == 'votacion') && p.opciones.length > 0" />

                                            <div v-if="p.tipo == 'opciones'|| p.tipo == 'votacion'" v-for="(o, index1) in p.opciones" cols="12" > 
                                                                              
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