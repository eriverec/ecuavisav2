<script setup>
import { onMounted } from 'vue';
import 'vue3-form-wizard/dist/style.css';

const dataProductos = ref([]);
const isLoading = ref(false);

async function getProductos (){
    try {
      isLoading.value = true;  
      const consulta = await fetch('https://ecuavisa-pricing.vercel.app/pricing/get/all/producto');
      const consultaJson = await consulta.json();
      dataProductos.value = consultaJson.data;             
      isLoading.value = false; 
    } catch (error) {
        console.error(error.message);
    }
} 

onMounted(async()=>{
    await getProductos();
})

const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedProductos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataProductos.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataProductos.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const frecuenciaItems = [
    {
     title: "Mensual",
     value: "mensual"
    },
    {
     title: "Anual",
     value: "anual"
    }
]


// ------------------------------MOSTRAR PLANES-----------------------------------
const planesToShow = ref([]);
const planesVisible = ref(false);
const productoSelected = ref('');
const idProductoSelected = ref('')

function viewPlanes(id = '', nombre){
    //console.log('id',id);
    let productoRaw = dataProductos.value.find(item => item._id == id); 
    planesToShow.value = productoRaw.planes;
    idProductoSelected.value = id;
    productoSelected.value = nombre;
    planesVisible.value = true;
}

// -------------------------------ACCIONES------------------------------------------
const isDialogActive = ref(false);
const accionForm = ref('');
    //-----DATOS FORM----
const nombre = ref('');
const planes = ref([]);


const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});


    //------FUNCIONES

function addPlan(){
    let item = {
        nombre_plan: "",
        precio: 0,
        url_imagen:"",
        descripcion: [],
        condiciones: "",
        frecuencia: ""
    }
    planes.value.push(item);
}

const eliminarPlan = (index) =>{
    planes.value.splice(index, 1);
};

function addDesc(index){   
    planes.value[index].descripcion.push('');
}

const eliminarDesc = (index, index2) =>{
    planes.value[index].descripcion.splice(index2, 1);
};

function resetForm(){
    nombre.value = '';
    planes.value = [];
}


function closeDiag(){
    resetForm(); 
    isDialogActive.value = false;
}
// ----------ADD-------------
async function onAddProducto(){
    resetForm(); 
    accionForm.value = 'add';
    let item = {
        nombre_plan: "",
        precio: 0,
        url_imagen:"",
        descripcion: [],
        condiciones: "",
        frecuencia: ""
    }
    planes.value.push(item);
    isDialogActive.value = true;
}

// ----------EDIT-------------
const idToEdit = ref('');

async function onEditProducto(id){
    resetForm(); 
    accionForm.value = 'edit';
    const consulta = await fetch('https://ecuavisa-pricing.vercel.app/pricing/get/producto/' + id);
    const consultaJson = await consulta.json();
    const producto = consultaJson.data;
    //console.log(paquete);
    idToEdit.value = producto._id;
    nombre.value = producto.nombre;
    planes.value = producto.planes;
   
    isDialogActive.value = true;
}

// ------------SEND--------------
async function onComplete(){

    let nombreValid = nombre.value;
    let planesValid = planes.value;
    
    if(!nombreValid || nombreValid == ""){
        configSnackbar.value = {
                    message: "Debe añadir un nombre",
                    type: "error",
                    model: true
                };
        return false;
    }

    if(planesValid.length == 0){
        configSnackbar.value = {
                    message: "Debe ingresar almenos 1 plan",
                    type: "error",
                    model: true
                };
        return false;
    }

    for(let item of planesValid){

        if(item.nombre_plan == "" || item.precio ==0 || item.url_imagen == "" || item.descripcion.length == 0 || item.condicion == "" || item.frecuencia ==""){
            configSnackbar.value = {
                        message: "Debe ingresar todos los datos del plan",
                        type: "error",
                        model: true
            };
            return false;
        }
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (accionForm.value === 'add') {

        let jsonEnviar ={
        "nombre": nombre.value,
        "planes": planes.value
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://ecuavisa-pricing.vercel.app/pricing/producto/insert', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Producto creado correctamente",
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
    }else if(accionForm.value === 'edit'){

        let jsonEnviar ={
        "id": idToEdit.value,
        "nombre": nombre.value,
        "planes": planes.value
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://ecuavisa-pricing.vercel.app/pricing/update', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Producto editado correctamente",
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
    await getProductos();
    isDialogActive.value = false;
    planesVisible.value = false;
    
}

// -------------------------------DELETE-----------------------------------//
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

    const deleted = await fetch('https://ecuavisa-pricing.vercel.app/pricing/delete?id=' + idToDelete.value, requestOptions);
    const respuesta = await deleted.json();
    if (respuesta.resp) {
        configSnackbar.value = {
            message: "Producto eliminado correctamente",
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
    await getProductos();
    isDialogVisibleDelete.value = false;
}


</script>

<template>
    <section>
    
        <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :color="configSnackbar.type">
            {{ configSnackbar.message }}
        </VSnackbar>

        <VRow>
            <VCol cols="5" sm="12" lg="5" class="container">
                <VCard>
                <VCardTitle class="pt-4 pl-6">Lista de productos</VCardTitle>   
                 
                <VCardText style="margin-bottom: -2rem;">
                        <div class="d-flex flex-wrap gap-4 mt-10">
                            <VBtn prepend-icon="tabler-plus" color="success" variant="tonal" class="ml-auto" @click="onAddProducto">
                                Crear producto
                            </VBtn>
                        </div>
    
                </VCardText>

                <VCardItem v-if="isLoading">
                Cargando datos...
                </VCardItem>   
                <VCardItem v-else>
                <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                    <thead>
                        <tr>   
                        <th scope="col">Id</th>                             
                        <th scope="col">Nombre</th>
                        <th scope="col">Acciones</th>    
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in paginatedProductos" @click="viewPlanes(item._id, item.nombre)" class="clickable">
                        <td class="text-medium-emphasis">
                            {{ item._id}}
                        </td>      
                        <td class="text-medium-emphasis">
                            {{ item.nombre}}
                        </td>
                        <td class="text-medium-emphasis">
                            <VBtn color="success" variant="text" icon  @click="onEditProducto(item._id)">
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
                    :disabled="(currentPage * itemsPerPage) >= dataProductos.length">
                </VBtn>
                </div>
                </VCardItem>  
                   
                </VCard>
            </VCol>

            <VCol cols="7" sm="12" lg="7" class="container">
                <VCard v-if="planesVisible">
                <VCardTitle class="pt-4 pl-6">Planes de {{ productoSelected }}</VCardTitle>   
                 
                <VCardItem v-if="planesToShow.length === 0">
                No existen datos para mostrar.
                </VCardItem>   
                <VCardItem v-else>
                <VTable class="text-no-wrap tableNavegacion mb-5">
                    <thead>
                        <tr>   
                        <th scope="col">Nombre</th>                             
                        <th scope="col">Precio</th>
                        <th scope="col">Imágen</th> 
                        <th scope="col">Descripción</th>   
                        <th scope="col">Condiciones</th> 
                        <th scope="col">Frecuencia</th>                     
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in planesToShow">
                        <td class="text-medium-emphasis">
                            {{ item.nombre_plan}}
                        </td>      
                        <td class="text-medium-emphasis">
                            {{ item.precio}}
                        </td>
                        <td class="text-medium-emphasis">
                            <VImg :width="200" aspect-ratio="1/1" :src=item.url_imagen />
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.descripcion}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.condiciones}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.frecuencia}}
                        </td>            
                        </tr>
                    </tbody>
                </VTable>        
                </VCardItem>  
                   
                </VCard>
            </VCol>
        </VRow>

        <VDialog v-model="isDialogActive" persistent max-width="900">

            <!-- Dialog close btn -->
            <DialogCloseBtn @click="closeDiag" />

            <VCard  class="pa-sm-14 pa-5">
                <VCardItem class="text-center">
                    <VCardTitle class="text-h5 mb-3">
                        {{ accionForm === "add" ? "Crear un producto" : "Editar " + nombre }}
                    </VCardTitle>
                </VCardItem>

                <VCardText>

                    <!-- 👉 Form -->
                    <VForm class="mt-6" @submit.prevent="onComplete">
                        <VRow class="d-flex flex-wrap justify-center gap-4">
                            <VRow>
                                
                                <VCol cols="12">
                                    <VTextField v-model="nombre" label="Nombre del producto" />
                                </VCol>
                                <VCol cols="12">
                                    <VCol class="d-flex" cols="12">
                                        <h4 class="mt-4">Planes</h4>
                                        <VBtn style="margin-left: auto;" prepend-icon="tabler-plus" @click="addPlan">Añadir Plan</VBtn>
                                    </VCol>
                                                           
                                <VDivider class="my-2"/>
                                </VCol>
                                

                                <VRow class="mt-2" v-for="item,index in planes">   
                                    <VDivider v-if="index !== 0" class="my-2"/> 
                                    <VCol cols="7">
                                        <VTextField v-model="item.nombre_plan" label="Nombre del plan" />
                                    </VCol> 
                                    
                                    <VCol cols="5">
                                        <VTextField v-model="item.precio" label="Precio" />
                                    </VCol>  

                                    <VCol cols="7">
                                        <VTextField v-model="item.url_imagen" label="Url de imágen"/>
                                    </VCol> 

                                    <VCol cols="5">
                                        <VSelect v-model="item.frecuencia" :items="frecuenciaItems" label="Frecuencia"/>
                                    </VCol> 
                                                                                                    
                                    <VCol cols="12">
                                        <VCol class="d-flex" cols="12">
                                            <span class="mt-4">Descripción</span>
                                            <VBtn style="margin-left: auto;" @click="addDesc(index)"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </VCol>   
                                        <VCol class="d-flex" v-for="(itemDesc, indexDesc) in item.descripcion" :key="indexDesc" cols="12">
                                            <VCol cols="10">
                                                <VTextarea rows="1" v-model="item.descripcion[indexDesc]" :label="'Descripción '+ (indexDesc+1) " auto-grow/>
                                            </VCol>
                                            <VCol cols="2">
                                                <VBtn color="error" @click="eliminarDesc(index, indexDesc)" >
                                                <VIcon icon="tabler-trash"></VIcon>
                                                </VBtn>
                                            </VCol>
                                            
                                        </VCol> 
                                        
                                    </VCol> 

                                    <VCol cols="12">
                                        <VTextarea rows="2" v-model="item.condiciones" label="Condiciones" auto-grow/>
                                    </VCol>
                                    <VCol style="position: relative;" class="my-4" cols="12">                                       
                                        <VBtn style="position: absolute; bottom: 0%; right: 0%;" class="mr-2" prepend-icon="tabler-trash" color="error" @click="eliminarPlan(index)" >
                                            Eliminar plan
                                        </VBtn>                
                                    </VCol>
                                   

                                </VRow>
                                
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
                    ¿Desea eliminar el producto?
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

@media screen and (max-width: 1000px) {
  .container {
   min-width: 90svw; 
  }
}
</style>