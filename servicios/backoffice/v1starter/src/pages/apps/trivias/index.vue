<script setup>
import { onMounted } from 'vue';
import 'vue3-form-wizard/dist/style.css';

const dataTrivias = ref([]);
const isLoading = ref(false);
const isLoading2 = ref(false);
const reglasLoading = ref(false);
const idReglas = ref([]);

async function getTrivias (){
    try {
      isLoading.value = true;  
      const consulta = await fetch('https://servicio-desafio-trivias.vercel.app/trivia/all/get?limit=100');
      const consultaJson = await consulta.json();
      dataTrivias.value = consultaJson.data;             
      isLoading.value = false; 
    } catch (error) {
        console.error(error.message);
    }
} 

async function getReglas(){
    try {      
      reglasLoading.value = true;  
      const consulta = await fetch('https://servicio-desafios.vercel.app/desafios');
      const consultaJson = await consulta.json();
      idReglas.value = consultaJson.data.map(({tituloDesafio, _id, descripcionDesafio})=>({
        title: tituloDesafio,
        value: _id,
        descripcionDesafio
      }));
         
      reglasLoading.value = false;                
    } catch (error) {
        console.error(error.message);
    }
} 


const tipoSelectorItems = [{
        title: 'Sin selector',   
        value: 'sinSelector'
    },
    {
        title: 'Perfil Selector Género',   
        value: 'PerfilSelectorGenero'
    },
    {
        title: 'Perfil selector Ciudad',
        value: 'PerfilselectorCiudad'
    },
    {
        title: 'Perfil selector Provincia',
        value: 'PerfilselectorProvincia'
    },
    {
        title: 'Perfil selector Deporte',
        value: 'PerfilselectorDeporte'
    },
    {
        title: 'Perfil selector Fecha de Nacimiento',
        value: 'PerfilselectorFechaNacimiento'
    }
];

const tipoItems = [
    {
        title: 'Texto',   
        value: 'texto'
    },
    {
        title: 'Opciones',
        value: 'opciones'
    },
    {
        title: 'Votación',
        value: 'votacion'
    }
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

const tipoItemsDesafio = [
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


onMounted(async()=>{
    isLoading2.value = true;
    await getTrivias();
    await getReglas();
    isLoading2.value = false;
})

const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedTrivias = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataTrivias.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataTrivias.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

// -------------------------------ACCIONES------------------------------------------
const isDialogActive = ref(false);
const accionForm = ref('');
    //-----DATOS FORM----

const nombre = ref('');
const nombreOld = ref('');
const idRegla = ref('');
const preguntas  = ref([
    {
        pregunta: '',
        tipo: 'texto',
        tipoSelector: 'sinSelector',
        respuesta: '',
        opciones: []
    }
]);




const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});


    //------FUNCIONES

function copyUrl(id){
    navigator.clipboard.writeText('https://servicio-desafio-trivias.vercel.app/trivia/get/' + id); 

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
    for (let i = 0; i < arreglo.length; i++) {
        let objeto = arreglo[i];
        for (let propiedad in objeto) {
            if(!objeto.hasOwnProperty("tipoSelector")){
                console.log("Falta seleccionar el campo tipoSelector")
                return false;
            }
            if (objeto.hasOwnProperty(propiedad) && objeto.tipo != "votacion" && objeto.tipo != "texto") {
                // Verificar si la propiedad es opciones
                if (propiedad === 'opciones') {
                    if (!objeto[propiedad].every(opcion => opcion.trim() !== '')) {
                        return false;
                    }
                } else {
                    if (objeto[propiedad].trim() === '') {
                        // console.log(objeto)
                        // console.log(propiedad)
                        // console.log(objeto[propiedad].trim())
                        return false;
                    }
                }
            }
        }
    }
    return true;
}
function resolveAñadirPregunta(){   
    //console.log("select" , tipoCondicion.value);
    let nuevaPregunta = {
        pregunta: '',
        tipo: 'texto',
        tipoSelector: 'sinSelector',
        respuesta: '',
        opciones: []
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

function resolveOpciones(index, tipo){
    preguntas.value[index].opciones = [];
    if (!preguntas.value[index].hasOwnProperty('respuesta')) {
        preguntas.value[index].respuesta = "";
    }
    
    if(tipo == "opciones"){
        preguntas.value[index].opciones.push('', '');
    }else if(tipo == "votacion"){
        preguntas.value[index].opciones.push('', '');   
        delete preguntas.value[index].respuesta;     
    }
          
}

const paquetesOptions = ref('Todos los productos');

function resetForm(){
    closeReglaForm();
    nombre.value = '';
    idRegla.value = '';
    preguntas.value = [
        {
            pregunta: '',
            tipo: 'texto',
            tipoSelector: 'sinSelector',
            respuesta: '',
            opciones: []
        }
    ]
  
}

function closeDiag(){
    resetForm(); 
    closeReglaForm();
    isDialogActive.value = false;
}

const reglaFormVisible = ref(false);
const frecuenciaDesafio = ref('');
const frecuenciaValor = ref(null);
const tituloDesafio = ref('');
const categoriaDesafio = ref('');
const tipoModel = ref('');
const descripcionDesafio = ref('');
const statusDesafio = ref(true);
const tituloSticker = ref('');
const URLSticker = ref('');

function closeReglaForm(){
    reglaFormVisible.value = false;  
    frecuenciaDesafio.value = '';
    frecuenciaValor.value = null;
    tituloDesafio.value = '';
    categoriaDesafio.value = '';
    tipoModel.value = '';
    descripcionDesafio.value = '';
    statusDesafio.value = true;
    tituloSticker.value = '';
    URLSticker.value = '';
}
function addRegla(){
    reglaFormVisible.value = true;  
    frecuenciaDesafio.value = '';
    frecuenciaValor.value = null;
    tituloDesafio.value = '';
    categoriaDesafio.value = '';
    tipoModel.value = '';
    descripcionDesafio.value = '';
    statusDesafio.value = true;
    tituloSticker.value = '';
    URLSticker.value = '';
}

async function crearRegla(){
    if ( !frecuenciaDesafio.value || 
        frecuenciaValor.value == null || 
        !tituloDesafio.value || 
        !descripcionDesafio.value || 
        !tipoModel.value || 
        !categoriaDesafio.value || 
        !tituloSticker.value || !URLSticker.value) {
        configSnackbar.value = {
                    message: "Llenar todos los campos para crear la regla",
                    type: "error",
                    model: true
                };
        return false;
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    
    let jsonEnviar ={
            "frecuenciaDesafio": frecuenciaDesafio.value,
            "frecuenciaValor": frecuenciaValor.value,
            "tituloDesafio": tituloDesafio.value,
            "tipo": tipoModel.value,
            "categoria": categoriaDesafio.value,
            "descripcionDesafio": descripcionDesafio.value,
            "statusDesafio": statusDesafio.value,
            "tituloSticker": tituloSticker.value,
            "URLSticker": URLSticker.value  
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
                message: "Regla creada correctamente",
                type: "success",
                model: true
            };
            await getReglas();
            closeReglaForm();
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
    const dataUser = await fetch('https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/id?id=' + id);
    const dataUserJson = await dataUser.json();
    respuestasUsuarios.value[index].nombre = dataUserJson.first_name + ' ' + dataUserJson.last_name;
    nombreUsuarioVisible.value.push(index);
}
// ----------ADD-------------
async function onAdd(){
    isLoading2.value = true;
    closeReglaForm();
    resetForm(); 
    accionForm.value = 'add';
    isDialogActive.value = true;
    isLoading2.value = false;
}

// ----------EDIT-------------
const idToEdit = ref('');

async function onEdit(id){
    isLoading2.value = true;
    closeReglaForm();
    resetForm();     
    accionForm.value = 'edit';
    const consulta = await fetch('https://servicio-desafio-trivias.vercel.app/trivia/get/' + id);
    const consultaJson = await consulta.json();
    const data = consultaJson.data;
    //console.log(paquete);
    idToEdit.value = data._id;
    nombre.value = data.nombre;
    nombreOld.value = data.nombre;
    idRegla.value = data.idRegla;
    preguntas.value = data.preguntas;

    isLoading2.value = false;
    isDialogActive.value = true;  
}

async function onDuplicate(id){
    isLoading2.value = true;
    resetForm(); 
    await getPaquetes();
    accionForm.value = 'duplicate';
    const consulta = await fetch('https://ecuavisa-cupones.vercel.app/get/id/' + id);
    const consultaJson = await consulta.json();
    const data = consultaJson.data;
    //console.log(paquete);
    //idToEdit.value = data._id;
    nombre.value = data.nombre;
    tipo.value = data.tipo;
    codigo.value = data.codigo;
    if(data.paquetes !== 'full' && data.paquetes.length >0 ){
        paquetesOptions.value = 'Personalizado';
    }else if(data.paquetes == 'full'){
        paquetesOptions.value = 'Todos los productos';
    }
    paquetes.value = data.paquetes;
    excepciones.value = data.excepciones;
    
    for(let cond of data.condiciones){
        let add = {
            tipo: cond.tipo,
            condicion: cond.condicion,    
            valor: cond.valor,
            opcion: cond.valor == "full" ? "full" : "personalizado",
            search: "",
            items: [],
            asign: false
        }
        condiciones.value.push(add);
    }
      
    discount.value = data.discount;
    type.value = data.type;
    helper.value = data.helper;
    dateIni.value = data.dateIni;
    dateEnd.value = data.dateEnd;
    
    activo.value = data.activo;
    aplica.value = data.aplica;
    match.value = data.match;

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

        const send = await fetch('https://servicio-desafio-trivias.vercel.app/trivia/create', requestOptions);
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
        const send = await fetch('https://servicio-desafio-trivias.vercel.app/trivia/update', requestOptions);
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

    const deleted = await fetch('https://servicio-desafio-trivias.vercel.app/trivia/delete/' + idToDelete.value, requestOptions);
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
                    <VCardTitle class="pt-4 pl-6">Listado de trivias</VCardTitle>   
                    
                    <VCardText style="margin-bottom: -2rem;">
                            <div class="d-flex flex-wrap gap-4 mt-10">
                                <VBtn prepend-icon="tabler-plus" color="success" variant="tonal" class="ml-auto" @click="onAdd">
                                    Nueva trivia
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
                            <th scope="col">Nombre</th>
                            <th scope="col">Id de regla</th>  
                            <th scope="col">Endpoint</th>  
                            <th scope="col">Enviar respuesta</th>
                            <th scope="col">Respuestas</th>
                            <th scope="col">Acciones</th>                                                   
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="item in paginatedTrivias">
                            <td class="text-medium-emphasis">
                                {{ item.nombre}}
                            </td>     
                            <td class="text-medium-emphasis">
                                {{ item.idRegla}}
                            </td>    
                            <td class="text-medium-emphasis">
                                <VBtn variant="text" icon  @click="copyUrl(item._id)">
                                    <VIcon size="22" icon="tabler-clipboard" />
                                </VBtn>
                            </td>    
                            <td class="text-medium-emphasis">
                                <VBtn variant="text" icon  @click="copyUrlRespuesta(item._id)">
                                    <VIcon size="22" icon="tabler-clipboard" />
                                </VBtn>
                            </td>     
                            <td class="text-medium-emphasis">
                                <VBtn variant="text" icon  @click="mostrarRespuestasUsuarios(item._id, item.nombre)">
                                    <VIcon size="22" icon="tabler-eye" />
                                </VBtn>
                            </td>                  
                            <td class="text-medium-emphasis">
                                <VBtn color="success" variant="text" icon  @click="onEdit(item._id)">
                                    <VIcon size="22" icon="tabler-edit" />
                                </VBtn>

                                <!-- 
                                <VBtn color="primary" variant="text" icon  @click="onDuplicate(item._id)">
                                    <VIcon size="22" icon="tabler-copy" />
                                </VBtn>
                                -->

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
                        :disabled="(currentPage * itemsPerPage) >= dataTrivias.length">
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
                            {{ accionForm === "add" || accionForm === "duplicate" ? "Nueva trivia" : "Editar " + nombre }}
                        </VCardTitle>
                    </VCardItem>

                    <VCardText>

                        <!-- 👉 Form -->
                        <VForm class="mt-6" @submit.prevent="onComplete">
                            <VRow class="d-flex flex-wrap justify-center gap-4">
                                <VRow>
                                                                    
                                    <VCol cols="12" >
                                        <VTextField v-model="nombre" label="Nombre" placeholder="Nombre de la trivia" />
                                    </VCol>

                                    <VCol cols="6" >
                                        <VSelect
                                            no-data-text="No existen desafíos que mostrar"
                                            append-icon="mdi-refresh"
                                            @click:append="getReglas"
                                            item-text="title"
                                            item-value="value"
                                            v-model="idRegla" 
                                            :items="idReglas"
                                            label="Id regla/desafío"
                                            :menu-props="{ maxHeight: '400' }">
                                            <template #selection="{ item }">
                                                  <div>
                                                      {{ item.title }} - {{ item.value }}
                                                  </div>
                                              </template>
                                              <template #item="{ item, props }">
                                                  <v-list-item v-bind="props">
                                                      <v-list-item-content class="border-1">
                                                          <v-list-item-subtitle class="d-flex flex-column">
                                                              <div style="max-width: 300px;font-size: 13px;line-height: 1.2" class="py-0 my-0 mb-1">{{ item.raw.descripcionDesafio }}</div>
                                                              <p class="pb-0 mb-0" style="font-size: 10px;">_id: {{ item.value }}</p>
                                                          </v-list-item-subtitle>
                                                      </v-list-item-content>
                                                  </v-list-item>
                                              </template>
                                        </VSelect>

                                        <!-- <VSelect v-model="idRegla" label="Id de regla" :items="idReglas" /> -->
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
                                      <VSelect v-model="categoriaDesafio" :items="categoriaItems" label="Categoría del desafío" />
                                    </VCol>

                                    <VCol cols="12" >
                                        <VSelect v-model="tipoModel" :items="tipoItemsDesafio" label="Tipos del desafío" />
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
                                            
                                            <VCol cols="12" >
                                                <VSelect class="mt-2" v-model="p.tipoSelector" label="Tipo de selector" :items="tipoSelectorItems" />        
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

<style scoped>  
 
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