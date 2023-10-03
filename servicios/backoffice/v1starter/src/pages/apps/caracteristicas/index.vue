<script setup>
import { onMounted } from 'vue';
import 'vue3-form-wizard/dist/style.css';

const dataCaracteristicas = ref([]);
const isLoading = ref(false);
const urlDom = "https://ecuavisa-suscripciones.vercel.app";

async function getCaracteristicas (){
    try {
      isLoading.value = true;  
      const consulta = await fetch(urlDom + '/caracteristica');
      const consultaJson = await consulta.json();
      dataCaracteristicas.value = consultaJson.data;             
      isLoading.value = false; 
    } catch (error) {
        console.error(error.message);
    }
} 



onMounted(async()=>{
    await getCaracteristicas();
})

const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedCaracteristicas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataCaracteristicas.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataCaracteristicas.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};



// -------------------------------ACCIONES------------------------------------------
const isDialogActive = ref(false);
const accionForm = ref('');
    //-----DATOS FORM----
const nombre = ref('');


const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});


    //------FUNCIONES

function resetForm(){
    nombre.value = '';
}


function closeDiag(){
    resetForm(); 
    isDialogActive.value = false;
}
// ----------ADD-------------
async function onAddCaracteristica(){
    resetForm(); 
    accionForm.value = 'add';
    isDialogActive.value = true;
}

// ----------EDIT-------------
const idToEdit = ref('');

async function onEditCaracteristica(id){
    resetForm(); 
    accionForm.value = 'edit';
    const consulta = await fetch(urlDom + '/caracteristica/' + id);
    const consultaJson = await consulta.json();
    const caracteristica = consultaJson.data;
    //console.log(paquete);
    idToEdit.value = caracteristica._id;
    nombre.value = caracteristica.nombre;
   
    isDialogActive.value = true;
}

// ------------SEND--------------
async function onComplete(){

    let nombreValid = nombre.value;
    
    if(!nombreValid || nombreValid == ""){
        configSnackbar.value = {
                    message: "Debe añadir un nombre",
                    type: "error",
                    model: true
                };
        return false;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (accionForm.value === 'add') {

        let jsonEnviar ={
        "nombre": nombre.value,
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch(urlDom + '/caracteristica', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Característica creada correctamente",
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
        "nombre": nombre.value
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch(urlDom + '/caracteristica', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Característica editada correctamente",
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
    await getCaracteristicas();
    isDialogActive.value = false;
    
}

// -------------------------------DELETE-----------------------------------//
const isDialogVisibleDelete = ref(false);
const idToDelete = ref('');

function onDelete(id) {
    isDialogVisibleDelete.value = true;
    idToDelete.value = id;
}

async function deletePaquete() {
    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    const deleted = await fetch(urlDom + '/caracteristica/' + idToDelete.value, requestOptions);
    const respuesta = await deleted.json();
    if (respuesta.resp) {
        configSnackbar.value = {
            message: "Característica eliminado correctamente",
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
    await getCaracteristicas();
    isDialogVisibleDelete.value = false;
}


</script>

<template>
    <section>
    
        <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :color="configSnackbar.type">
            {{ configSnackbar.message }}
        </VSnackbar>

        <VRow>
            <VCol cols="12" sm="12" lg="12">
                <VCard>
                <VCardTitle class="pt-4 pl-6">Lista de características</VCardTitle>   
                 
                <VCardText style="margin-bottom: -2rem;">
                        <div class="d-flex flex-wrap gap-4 mt-10">
                            <VBtn prepend-icon="tabler-user-plus" color="success" variant="tonal" class="ml-auto" @click="onAddCaracteristica">
                                Crear característica
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
                        <th scope="col">Id</th>                             
                        <th scope="col">Nombre</th>
                        <th scope="col">Acciones</th>    
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in paginatedCaracteristicas">
                        <td class="text-medium-emphasis">
                            {{ item._id}}
                        </td>      
                        <td class="text-medium-emphasis">
                            {{ item.nombre}}
                        </td>
                        <td class="text-medium-emphasis">
                            <VBtn color="success" variant="text" icon  @click="onEditCaracteristica(item._id)">
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
                    :disabled="(currentPage * itemsPerPage) >= dataCaracteristicas.length">
                </VBtn>
                </div>
                </VCardItem>  
                   
                </VCard>
            </VCol>
        </VRow>

        <VDialog v-model="isDialogActive" persistent max-width="600">

            <!-- Dialog close btn -->
            <DialogCloseBtn @click="closeDiag" />

            <VCard  class="pa-sm-14 pa-5">
                <VCardItem class="text-center">
                    <VCardTitle class="text-h5 mb-3">
                        {{ accionForm === "add" ? "Crear una característica" : "Editar " + nombre }}
                    </VCardTitle>
                </VCardItem>

                <VCardText>

                    <!-- 👉 Form -->
                    <VForm class="mt-6" @submit.prevent="onComplete">
                        <VRow class="d-flex flex-wrap justify-center gap-4">
                            <VRow>
                                
                                <VCol cols="12">
                                    <VTextField v-model="nombre" label="Nombre" />
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
                    ¿Desea eliminar la característica?
                </VCardText>

                <VCardText class="d-flex justify-end gap-3 flex-wrap">
                    <VBtn color="secondary" variant="tonal" @click="isDialogVisibleDelete = false">
                        No, Cerrar
                    </VBtn>
                    <VBtn @click="deletePaquete">
                        Si, eliminar
                    </VBtn>
                </VCardText>
            </VCard>
        </VDialog>

    </section>
</template>

<style>  

</style>