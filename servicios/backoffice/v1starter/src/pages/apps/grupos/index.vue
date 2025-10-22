<script setup>
import { onMounted } from 'vue';
import 'vue3-form-wizard/dist/style.css';

const dataPaquetes = ref([]);
const dataPaquetesRaw = ref([]);
const dataGrupos = ref([]);
const isLoading = ref(false);
const urlDom = "https://ecuavisa-suscripciones.vercel.app";

async function getGrupos (){
    try {
      isLoading.value = true;  
      const consulta = await fetch(urlDom + '/grupo');
      const consultaJson = await consulta.json();
      dataGrupos.value = consultaJson.data;             
      isLoading.value = false; 
    } catch (error) {
        console.error(error.message);
    }
} 

async function getPaquetes (){
    try {  
      
      const consulta = await fetch(urlDom + '/paquete');
      const consultaJson = await consulta.json();

      let paquetesRaw = Array.from(consultaJson.data);
      let items = [];
      for(const item of paquetesRaw){
            let data = {
                title: item.nombre,
                value: item._id
            }
            items.push(data);
       }
      dataPaquetes.value = items;  
      dataPaquetesRaw.value = consultaJson.data;
          
    } catch (error) {
        console.error(error.message);
    }
} 

onMounted(async()=>{
    await getGrupos();
})

const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedGrupos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataGrupos.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataGrupos.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};



// -------------------------------ACCIONES------------------------------------------
const isDialogActive = ref(false);
const accionForm = ref('');
    //-----DATOS FORM----
const nombre = ref('');

const paquetesSelected = ref([]);

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});
const loadingWizard = ref(false);

const caracteristicasItems = ref([]);
    //------FUNCIONES

function resetForm(){
    nombre.value = '';
    paquetesSelected.value = [];
}


function closeDiag(){
    resetForm(); 
    isDialogActive.value = false;
}
// ----------ADD-------------
async function onAddPaquete(){
    resetForm(); 
    accionForm.value = 'add';
    await getPaquetes();
    isDialogActive.value = true;
}

// ----------EDIT-------------
const idToEdit = ref('');

async function onEditGrupo(id){
    resetForm(); 
    accionForm.value = 'edit';
    await getPaquetes();
    const consulta = await fetch(urlDom + '/grupo/' + id);
    const consultaJson = await consulta.json();
    const grupo = consultaJson.data;
    //console.log(paquete);
    idToEdit.value = grupo._id;
    nombre.value = grupo.nombre;
    paquetesSelected.value = grupo.paquetes;
    
    isDialogActive.value = true;
}

// ------------SEND--------------
async function onComplete(){
    let nombreValid = nombre.value;
    let grupoPaquetes = paquetesSelected.value;

    if(!nombreValid || nombreValid == ""){
        configSnackbar.value = {
                    message: "Debe añadir un nombre",
                    type: "error",
                    model: true
                };
        return false;
    }

    if(grupoPaquetes.length < 1){
        configSnackbar.value = {
                    message: "Debe seleccionar almenos 1 paquete",
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
        "paquetes": paquetesSelected.value
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch(urlDom + '/grupo', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Grupo creado correctamente",
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
        "paquetes": paquetesSelected.value
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch(urlDom + '/grupo', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Grupo editado correctamente",
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
    await getGrupos();
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

    const deleted = await fetch(urlDom + '/grupo/' + idToDelete.value, requestOptions);
    const respuesta = await deleted.json();
    if (respuesta.resp) {
        configSnackbar.value = {
            message: "Grupo eliminado correctamente",
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
    await getGrupos();
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
                <VCardTitle class="pt-4 pl-6">Grupos de paquetes</VCardTitle>   
                 
                <VCardText style="margin-bottom: -2rem;">
                        <div class="d-flex flex-wrap gap-4 mt-10">
                            <VBtn prepend-icon="tabler-user-plus" color="success" variant="tonal" class="ml-auto" @click="onAddPaquete">
                                Crear grupo
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
                        <tr v-for="item in paginatedGrupos">
                        <td class="text-medium-emphasis">
                            {{ item._id}}
                        </td>      
                        <td class="text-medium-emphasis">
                            {{ item.nombre}}
                        </td>
                        <td class="text-medium-emphasis">
                            <VBtn color="success" variant="text" icon  @click="onEditGrupo(item._id)">
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
                    :disabled="(currentPage * itemsPerPage) >= dataGrupos.length">
                </VBtn>
                </div>
                </VCardItem>  
                   
                </VCard>
            </VCol>
        </VRow>

        <VDialog v-model="isDialogActive" persistent max-width="800">

            <!-- Dialog close btn -->
            <DialogCloseBtn @click="closeDiag" />

            <VCard  class="pa-sm-14 pa-5">
                <VCardItem class="text-center">
                    <VCardTitle class="text-h5 mb-3">
                        {{ accionForm === "add" ? "Crear un grupo de paquetes" : "Editar " + nombre }}
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

                                <span class="mt-4">Asignar paquetes</span>
                                <VDivider class="my-2"/>

                                <VCol cols="12">
                                    <VCol style="margin-top: -1.5rem;" v-for="item in dataPaquetes" cols="6">
                                        <VCheckbox
                                        v-model="paquetesSelected"
                                        :label="item.title"
                                        :value="item.value"
                                        />
                                    </VCol>
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
                    ¿Desea eliminar el grupo?
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