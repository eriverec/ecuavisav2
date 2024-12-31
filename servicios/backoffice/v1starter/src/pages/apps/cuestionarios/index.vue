<script setup>
import { onMounted } from 'vue';
import 'vue3-form-wizard/dist/style.css';

const dataCuestionarios = ref([]);
const isLoading = ref(false);
const isLoading2 = ref(false);
const reglasLoading = ref(false);
const idReglas = ref([]);

async function getCuestionarios (){
    try {
      isLoading.value = true;  
      const consulta = await fetch('https://e-learning-cuestionario.vercel.app/cuestionarios/all/get');
      const consultaJson = await consulta.json();
      dataCuestionarios.value = consultaJson.data;             
      isLoading.value = false; 
    } catch (error) {
        console.error(error.message);
    }
} 

onMounted(async()=>{
    isLoading2.value = true;
    await getCuestionarios();
    isLoading2.value = false;
})

const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedCuestionarios = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataCuestionarios.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataCuestionarios.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// -------------------------------ACCIONES------------------------------------------
const isDialogActive = ref(false);
const accionForm = ref('');
    //-----DATOS FORM----

const titulo = ref('');
const descripcion = ref('');
const tags = ref([]);
const puntosNecesarios = ref(null);
const fechaLimite = ref('');
const limiteTiempo = ref(null);
const preguntas  = ref([
    {
        pregunta: '',
        puntaje: null,
        respuesta: '',
        opciones: ['','']
    }
]);

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

    //------FUNCIONES
const tag = ref('');

function addTag() {
    tags.value.push(tag.value);
    tag.value = '';
}

function eliminarTag(index) {
    tags.value.splice(index, 1);
    tag.value = '';
}

function resetTag() {
    tags.value = [];
    tag.value = '';
}

function copyUrl(id){
    navigator.clipboard.writeText('https://e-learning-cuestionario.vercel.app/cuestionarios/get/' + id); 

    configSnackbar.value = {
    message: "Enlace copiado en el portapapeles",
    timeout: 1000,
    type: "success",
    model: true
    };  
}    

function copyUrlRespuesta(id){
    navigator.clipboard.writeText('https://servicio-desafio-trivias.vercel.app/triviaUsuario/create/idTrivia/' + id); 

    configSnackbar.value = {
    message: "Enlace copiado en el portapapeles",
    timeout: 1000,
    type: "success",
    model: true
    };  
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
       
    preguntas.value.push(nuevaPregunta);
}    
function resolveAñadirOpcion(index){
    
    //console.log("select" , tipoCondicion.value);
    let nuevaOpcion = '';
       
    preguntas.value[index].opciones.push(nuevaOpcion);
}

function eliminarPregunta (index){
    preguntas.value.splice(index, 1);
}

function eliminarOpcion (index, index1){
    preguntas.value[index].opciones.splice(index1, 1);
}


function resetForm(){
    
    titulo.value = '';
    descripcion.value = '';
    tags.value = [];
    puntosNecesarios.value = null;
    fechaLimite.value = '';
    limiteTiempo.value = null;
    preguntas.value = [
        {
            pregunta: '',
            puntaje: null,
            respuesta: '',
            opciones: ['','']
        }
    ]
    tag.value = '';    
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
    const consulta = await fetch('https://e-learning-cuestionario.vercel.app/cuestionarios/get/' + id);
    const consultaJson = await consulta.json();
    const data = consultaJson.data;
    //console.log(paquete);
    idToEdit.value = data._id;
    titulo.value = data.titulo;
    tags.value = data.tags;
    descripcion.value = data.descripcion;
    puntosNecesarios.value = data.puntosNecesarios;
    preguntas.value = data.preguntas;
    fechaLimite.value = data.fechaLimite;
    limiteTiempo.value = data.limiteTiempo;

    isLoading2.value = false;
    isDialogActive.value = true;  
}

    // ------------SEND--------------

async function onComplete(){

    let preguntasEnviar = preguntas.value; 
    let tituloValid = titulo.value;

    if(!Array.isArray(tags.value) && tags.value != null && tags.value != ""){
        tags.value = [tags.value];
    }

    if (!validarArreglo(preguntasEnviar) || !tituloValid || tituloValid == "" || !descripcion.value || tags.value.length == 0 || puntosNecesarios.value == null || fechaLimite.value == '' || limiteTiempo.value == null) {
        configSnackbar.value = {
                    message: "Debe llenar todos los campos",
                    type: "error",
                    model: true
                };
        return false;
    } 

    puntosNecesarios.value = parseFloat(puntosNecesarios.value).toFixed(2);

    let preguntasFormated = preguntasEnviar.map(item => ({
    ...item, 
    puntaje: parseFloat(item.puntaje).toFixed(2)
    })); 

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (accionForm.value === 'add') {

        let jsonEnviar ={
            "titulo": titulo.value,
            "descripcion": descripcion.value,
            "tags": tags.value,
            "puntosNecesarios": puntosNecesarios.value,
            "preguntas": preguntasFormated,
            "fechaLimite": fechaLimite.value,
            "limiteTiempo": limiteTiempo.value 
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        console.log('Enviando ',jsonEnviar);

        const send = await fetch('https://e-learning-cuestionario.vercel.app/cuestionarios/create', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Cuestionario creado correctamente",
                type: "success",
                model: true
            };
            await getCuestionarios();
            isDialogActive.value = false;
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
            "titulo": titulo.value,
            "descripcion": descripcion.value,
            "tags": tags.value,
            "puntosNecesarios": puntosNecesarios.value,
            "preguntas": preguntasFormated,
            "fechaLimite": fechaLimite.value,
            "limiteTiempo": limiteTiempo.value    
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://e-learning-cuestionario.vercel.app/cuestionarios/update', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Cuestionario actualizado correctamente",
                type: "success",
                model: true
            };
            await getCuestionarios();
            isDialogActive.value = false;
        } else {
            configSnackbar.value = {
                message: respuesta.mensaje,
                type: "error",
                model: true
            };
        }
    }
    
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

    const deleted = await fetch('https://e-learning-cuestionario.vercel.app/cuestionarios/delete/' + idToDelete.value, requestOptions);
    const respuesta = await deleted.json();
    if (respuesta.resp) {
        configSnackbar.value = {
            message: "Cuestionario eliminado correctamente",
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
    await getCuestionarios();
    isDialogVisibleDelete.value = false;
    isLoading2.value = false;
}

// ----------RESPUESTAS DE USUARIOS-------------

const respuestasUsuarios = ref([]);
const respuestasUsuariosVisible = ref(false);
const nombreTriviaSelected = ref('');
const nombreUsuarioVisible = ref([]);

async function mostrarRespuestasUsuarios (idTrivia, nombre){
    isLoading2.value = true;
    nombreUsuarioVisible.value = [];
    nombreTriviaSelected.value = nombre;
    const consulta = await fetch('https://servicio-desafio-trivias.vercel.app/triviaUsuario/get/trivia/' + idTrivia);
    const consultaJson = await consulta.json();
    respuestasUsuarios.value = consultaJson.data;   
    respuestasUsuariosVisible.value = true;
    isLoading2.value = false;
}


async function mostrarNombreUsuario(id, index){
    if(!id){
        return null;
    }
    const dataUser = await fetch('https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/id?id=' + id);
    const dataUserJson = await dataUser.json();
    respuestasUsuarios.value[index].nombre = dataUserJson.first_name + ' ' + dataUserJson.last_name;
    nombreUsuarioVisible.value.push(index);
}


</script>

<template>
    <section>
        
        
           

            <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :timeout="configSnackbar.timeout || 2500" :color="configSnackbar.type">
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
                    <VCardTitle class="pt-4 pl-6">Listado de cuestionarios</VCardTitle>   
                    
                    <VCardText style="margin-bottom: -2rem;">
                            <div class="d-flex flex-wrap gap-4 mt-10">
                                <VBtn prepend-icon="tabler-plus" color="success" variant="tonal" class="ml-auto" @click="onAdd">
                                    Nuevo Cuestionario
                                </VBtn>
                            </div>
        
                    </VCardText>

                    <VCardItem v-if="isLoading">
                    Cargando datos... 
                    </VCardItem>   
                    <VCardItem v-else>
                    <VTable class="text-no-wrap tableNavegacion mb-5">
                        <thead>
                            <tr>   
                            <th scope="col">Título</th>
                            <th scope="col" style="width: 200px;">Descripción</th>  
                            <th scope="col">Endpoint</th>  
                            <th scope="col">Enviar respuesta</th>
                            <th scope="col">Respuestas</th>
                            <th scope="col">Acciones</th>                                                   
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="item in paginatedCuestionarios">
                            <td class="text-medium-emphasis">
                                {{ item.titulo}}
                            </td>     
                            <td class="text-medium-emphasis" style="min-width: 200px;">
                                {{ item.descripcion}}
                            </td>    
                            <td class="text-medium-emphasis">
                                <VBtn variant="text" icon  @click="copyUrl(item._id)">
                                    <VIcon size="22" icon="tabler-clipboard" />
                                </VBtn>
                            </td>    
                            <td class="text-medium-emphasis">
                                <VBtn variant="text" icon  @click="">
                                    <VIcon size="22" icon="tabler-clipboard" />
                                </VBtn>
                            </td>     
                            <td class="text-medium-emphasis">
                                <VBtn variant="text" icon  @click="">
                                    <VIcon size="22" icon="tabler-eye" />
                                </VBtn>
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
                        :disabled="(currentPage * itemsPerPage) >= dataCuestionarios.length">
                    </VBtn>
                    </div>
                    </VCardItem>  
                    
                    </VCard>
                </VCol>

                <VCol v-if="respuestasUsuariosVisible" cols="12" sm="12" lg="12">
                    <VCard>
                    <VCardTitle class="pt-4 pl-6">Respuestas de {{ nombreTriviaSelected }}</VCardTitle>   

                    <VCardItem v-if="respuestasUsuarios.length > 0">
                        <div class="respuesta-card mb-4 w-100" v-for="(item, index) in respuestasUsuarios">
                            <div class="d-flex align-center gap-4 mt-6 ml-4 mb-2">                      
                                <div><h4>Id del Usuario:</h4></div>                    
                                <div>
                                    <h4>{{ item.idUsuario }}</h4>
                                </div>               
                                <div>
                                    <VBtn v-if="!nombreUsuarioVisible.includes(index)" variant="text" icon  @click="mostrarNombreUsuario(item.idUsuario, index)">
                                        <VIcon size="22" icon="tabler-eye" />
                                    </VBtn>
                                    
                                        <h4 v-if="item.nombre" class="ml-3"> Nombre: &nbsp;&nbsp; {{item.nombre}}</h4>
                                    
                                </div>              
                            </div>
                                
                            <VTable class="text-no-wrap tableNavegacion mb-5">
                                    <thead>
                                        <tr>   
                                        <th scope="col">Pregunta</th>                      
                                        <th scope="col">Respuesta</th>  
                                                                                        
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="(r, index) in item.respuesta">
                                        <td class="text-medium-emphasis">
                                            {{ r.pregunta}}                              
                                        </td>                           
                                        <td class="text-medium-emphasis">
                                            {{ r.respuesta}}
                                        </td> 
                                            
                                        </tr>
                                    </tbody>
                            </VTable>

                        </div>
                        
                    </VCardItem>
                   <!--
                    <VCardItem v-if="respuestasUsuarios.length > 0">
                    <VTable class="text-no-wrap tableNavegacion mb-5">
                        <thead>
                            <tr>   
                            <th scope="col">Id</th>                      
                            <th scope="col">Respuesta</th>  
                                                                            
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="(item, index) in respuestasUsuarios">
                            <td class="text-medium-emphasis">
                                {{ item.idUsuario}}
                                
                                <VBtn v-if="!nombreUsuarioVisible.includes(index)" variant="text" icon  @click="mostrarNombreUsuario(item.idUsuario, index)">
                                    <VIcon size="22" icon="tabler-eye" />
                                </VBtn>
                                <span class="ml-3">{{ item.nombre}}</span>
                               
                            </td>                           
                            <td class="text-medium-emphasis">
                                <VTable class="text-no-wrap tableNavegacion mb-5">
                                    <thead>
                                        <tr>   
                                        <th scope="col">Pregunta</th>                      
                                        <th scope="col">Respuesta</th>  
                                                                                        
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr v-for="(r, index) in item.respuesta">
                                        <td class="text-medium-emphasis">
                                            {{ r.pregunta}}                              
                                        </td>                           
                                        <td class="text-medium-emphasis">
                                            {{ r.respuesta}}
                                        </td> 
                                            
                                        </tr>
                                    </tbody>
                                </VTable>
                                
                            </td> 
                                
                            </tr>
                        </tbody>
                    </VTable>
                    
                    </VCardItem> 
                    --> 

                    <VCardItem v-else-if="respuestasUsuarios.length == 0">
                    No se han encontrado datos                                
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
                            {{ accionForm === "add" ? "Nuevo cuestionario" : "Editar " + titulo }}
                        </VCardTitle>
                    </VCardItem>

                    <VCardText>

                        <!-- 👉 Form -->
                        <VForm class="mt-6" @submit.prevent="onComplete">
                            <VRow class="d-flex flex-wrap justify-center gap-4">
                                <VRow>
                                                                    
                                    <VCol cols="6" >
                                        <VTextField v-model="titulo" label="Título" placeholder="Título del cuestionario" />
                                    </VCol>

                                    <VCol cols="6" >
                                        <VTextField v-model="puntosNecesarios" label="Puntos necesarios" type="number"/>
                                    </VCol>

                                    <VCol cols="6" >
                                        <VTextField v-model="fechaLimite" label="Fecha límite" type="date"/>
                                    </VCol>

                                    <VCol cols="6" >
                                        <VTextField v-model="limiteTiempo" label="Límite de tiempo en segundos" type="number"/>
                                    </VCol>

                                    <VCol cols="12" >
                                        <VTextField v-model="descripcion" label="Descripción" placeholder="Descripción del cuestionario"/>
                                    </VCol>
                             
                                    <VCol cols="12" >
                                        <p><h4>Ingrese los Tags</h4></p>
                                        <div class="d-flex flex-wrap gap-1 items-center mb-2">
                                            <p class="my-1"><h5>Tags: </h5></p>
                                            <VChip v-for="(tag, index) in tags" :key="tag" class="custom-chip" title="Eliminar tag" color="success" closable @click:close="eliminarTag(index)">
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
                                    <div v-for="(p, index) in preguntas" cols="12" class="w-100 my-4 item-cards"> 
                                        <VBtn v-if="preguntas.length > 1" class="ml-auto boton-eleminar-itemsCards" size="38" color="error" @click="eliminarPregunta(index)"><VIcon icon="tabler-x" size="22" /></VBtn>
                                        
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