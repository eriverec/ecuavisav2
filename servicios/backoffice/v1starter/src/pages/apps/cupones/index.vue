<script setup>
import tabDescuentos from "@/pages/apps/cupones/tabs/descuentos.vue";
import { onMounted } from 'vue';
import 'vue3-form-wizard/dist/style.css';

const dataCupones = ref([]);
const isLoading = ref(false);
const isLoading2 = ref(false);
const paquetesCupon = ref([]);
const excepcionesCupon = ref([]);
const Card2Visible = ref(false);
const selectedCupon = ref('');
const dataPaquetes = ref([]);
const currentTab = ref('tab-cupones');

async function getCupones (){
    try {
      isLoading.value = true;  
      const consulta = await fetch('https://ecuavisa-cupones.vercel.app/cupon/get/all');
      const consultaJson = await consulta.json();
      dataCupones.value = consultaJson.data;             
      isLoading.value = false; 
    } catch (error) {
        console.error(error.message);
    }
} 

async function resolveSelectedCupon (id, nombre){
    try {
      isLoading2.value = true;  
      selectedCupon.value = nombre;
      const consulta = await fetch('https://ecuavisa-cupones.vercel.app/cupon/paquetes/full/'+id);
      const consultaJson = await consulta.json();
      paquetesCupon.value = consultaJson.data;        
      
      const consulta2 = await fetch('https://ecuavisa-cupones.vercel.app/cupon/excepcion/full/'+id);
      const consultaJson2 = await consulta2.json();
      excepcionesCupon.value = consultaJson2.data; 
      Card2Visible.value = true;  
      isLoading2.value = false; 
    } catch (error) {
        console.error(error.message);
    }
} 

async function getPaquetes (){
    try {  
      
      const consulta = await fetch('https://ecuavisa-modulos.vercel.app/paquete');
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
      //dataPaquetesRaw.value = consultaJson.data;
          
    } catch (error) {
        console.error(error.message);
    }
} 

onMounted(async()=>{
    await getCupones();
})

const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedCupones = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataCupones.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataCupones.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const typeItems = [
    {
        title: "Porcentaje",
        value: "percent"
    },
    {
        title: "Dólares",
        value: "dollars"
    },
]



// -------------------------------ACCIONES------------------------------------------
const isDialogActive = ref(false);
const accionForm = ref('');
    //-----DATOS FORM----
const nombre = ref('');
const paquetes = ref([]);
const excepciones = ref([]);
const discount = ref(0);
const type = ref('');
const helper = ref('');
const dateIni = ref('');
const dateEnd = ref('');


const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});


    //------FUNCIONES
const paquetesOptions = ref('Full');
const asignPaquetesVisible = ref(false);
const paquetesOptionsItems = ['Personalizado', 'Full'];

function resolvePaquetesOptions(){
    
    excepciones.value = [];
    if(paquetesOptions.value === 'Personalizado' ){
        paquetes.value = [];
        asignPaquetesVisible.value = true;
    }else if(paquetesOptions.value === 'Full'){
        paquetes.value = 'full';
        asignPaquetesVisible.value = false;
    }
}

function resetForm(){
    nombre.value = '';
    paquetes.value = [];
    excepciones.value = [];
    discount.value = 0;
    type.value = '';
    helper.value = '';
    dateIni.value = '';
    dateEnd.value = '';
    paquetesOptions.value = 'Full';
}


function closeDiag(){
    resetForm(); 
    isDialogActive.value = false;
}
// ----------ADD-------------
async function onAdd(){
    isLoading2.value = true;
    resetForm(); 
    await getPaquetes();
    accionForm.value = 'add';
    isDialogActive.value = true;
    isLoading2.value = false;
}

// ----------EDIT-------------
const idToEdit = ref('');

async function onEdit(id){
    isLoading2.value = true;
    resetForm(); 
    await getPaquetes();
    accionForm.value = 'edit';
    const consulta = await fetch('https://ecuavisa-cupones.vercel.app/cupon/get/id/' + id);
    const consultaJson = await consulta.json();
    const data = consultaJson.data;
    //console.log(paquete);
    idToEdit.value = data._id;
    nombre.value = data.nombre;
    if(data.paquetes !== 'full' && data.paquetes.length >0 ){
        paquetesOptions.value = 'Personalizado';
    }else if(data.paquetes == 'full'){
        paquetesOptions.value = 'Full';
    }
    paquetes.value = data.paquetes;
    excepciones.value = data.excepciones;
    discount.value = data.discount;
    type.value = data.type;
    helper.value = data.helper;
    dateIni.value = data.dateIni;
    dateEnd.value = data.dateEnd;
    
    isLoading2.value = false;
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

    
    if(paquetesOptions.value == 'Full'){
        paquetes.value = 'full';
    }
    isLoading2.value = true;
    if (accionForm.value === 'add') {

        let jsonEnviar ={
        "nombre": nombre.value,
        "paquetes": paquetes.value,
        "excepciones": excepciones.value,
        "discount": discount.value,
        "type": type.value,
        "helper": helper.value,
        "dateIni": dateIni.value,
        "dateEnd": dateEnd.value 
        }
        console.log(jsonEnviar);
        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://ecuavisa-cupones.vercel.app/cupon/create', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Cupón creado correctamente",
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
        "id": idToEdit.value,
        "nombre": nombre.value,
        "paquetes": paquetes.value,
        "excepciones": excepciones.value,
        "discount": discount.value,
        "type": type.value,
        "helper": helper.value,
        "dateIni": dateIni.value,
        "dateEnd": dateEnd.value     
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://ecuavisa-cupones.vercel.app/cupon/update', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Cupón editado correctamente",
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
    isLoading2.value = false;
    await getCupones();
    Card2Visible.value = false;
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

    const deleted = await fetch('https://ecuavisa-cupones.vercel.app/cupon/delete/' + idToDelete.value, requestOptions);
    const respuesta = await deleted.json();
    if (respuesta.resp) {
        configSnackbar.value = {
            message: "Cupón eliminado correctamente",
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
    await getCupones();
    Card2Visible.value = false;
    isDialogVisibleDelete.value = false;
    isLoading2.value = false;
}

</script>

<template>
    <section>
    
        <VTabs v-model="currentTab" class="v-tabs-pill">
          <VTab value="tab-cupones">Cupones</VTab>
          <VTab value="tab-descuentos">Descuentos</VTab>
          <!-- <VTab>Tab Three</VTab> -->
        </VTabs>
        
            <VWindow class="mt-4" v-model="currentTab">
              <VWindowItem value="tab-cupones">

            <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :color="configSnackbar.type">
                {{ configSnackbar.message }}
            </VSnackbar>

            <VDialog v-model="isLoading2" width="300">
                <VCardText class="pt-3 text-center">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                </VCardText>
            </VDialog>

            <VRow>
                <VCol cols="12" sm="12" lg="12">
                    <VCard>
                    <VCardTitle class="pt-4 pl-6">Lista de cupones</VCardTitle>   
                    
                    <VCardText style="margin-bottom: -2rem;">
                            <div class="d-flex flex-wrap gap-4 mt-10">
                                <VBtn prepend-icon="tabler-user-plus" color="success" variant="tonal" class="ml-auto" @click="onAdd">
                                    Crear cupón
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
                            <th scope="col">Nombre</th>                             
                            <th scope="col">Valor</th>
                            <th scope="col">Fecha inicio</th>    
                            <th scope="col">Fecha fin</th>   
                            <th scope="col">Acciones</th>   
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="item in paginatedCupones" @click="resolveSelectedCupon(item._id, item.nombre)" class="clickable">
                            <td class="text-medium-emphasis">
                                {{ item.nombre}}
                            </td>      
                            <td class="text-medium-emphasis">
                                {{ item.helper}}
                            </td>
                            <td class="text-medium-emphasis">
                                {{ item.dateIni}}
                            </td>
                            <td class="text-medium-emphasis">
                                {{ item.dateEnd}}
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
                        :disabled="(currentPage * itemsPerPage) >= dataCupones.length">
                    </VBtn>
                    </div>
                    </VCardItem>  
                    
                    </VCard>
                </VCol>

                <VCol v-if="Card2Visible" cols="6" sm="12" lg="6" class="container">
                    <VCard>
                    <VCardTitle class="pt-4 pl-6">Paquetes de {{ selectedCupon }}</VCardTitle>   
                        
                    <VCardItem>
                    <VTable class="text-no-wrap tableNavegacion mb-5">
                        <thead>
                            <tr>   
                            <th scope="col">Id</th>                             
                            <th scope="col">Nombre</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="paquete in paquetesCupon">
                            <td class="text-medium-emphasis">
                                {{ paquete._id}}
                            </td>      
                            <td class="text-medium-emphasis">
                                {{ paquete.nombre}}
                            </td>            
                            </tr>
                        </tbody>
                    </VTable>            
                    </VCardItem>  
                    
                    </VCard>
                </VCol>

                <VCol v-if="Card2Visible" cols="6" sm="12" lg="6" class="container">
                    <VCard>
                    <VCardTitle class="pt-4 pl-6">Excepciones de {{ selectedCupon }}</VCardTitle>   
                        
                    <VCardItem v-if="excepcionesCupon.length === 0">
                    No existen excepciones para mostrar.          
                    </VCardItem>  
                    
                    <VCardItem v-else>
                    <VTable class="text-no-wrap tableNavegacion mb-5">
                        <thead>
                            <tr>   
                            <th scope="col">Id</th>                             
                            <th scope="col">Nombre</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="excepcion in excepcionesCupon">
                            <td class="text-medium-emphasis">
                                {{ excepcion._id}}
                            </td>      
                            <td class="text-medium-emphasis">
                                {{ excepcion.nombre}}
                            </td>            
                            </tr>
                        </tbody>
                    </VTable>            
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
                            {{ accionForm === "add" ? "Crear un cupón" : "Editar " + nombre }}
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
                                    <VCol cols="6">
                                        <VTextField v-model="discount" label="Descuento" typer="number" />
                                    </VCol>
                                    <VCol cols="6">
                                        <VTextField v-model="helper" label="Helper" />
                                    </VCol>
                                    <VCol cols="12">
                                        <VSelect v-model="type" label="Tipo" :items="typeItems" />
                                    </VCol>
                                    <VCol cols="6">
                                        <AppDateTimePicker  prepend-inner-icon="tabler-calendar" density="compact" v-model="dateIni"
                                        show-current=true label="Fecha inicio" :config="{
                                            position: 'auto right',                
                                            altFormat: 'F j, Y',
                                            dateFormat: 'm-d-Y',
                                            //maxDate: new Date(),
                                            reactive: true
                                        }" />
                                    </VCol>
                                    <VCol cols="6">                                  
                                        <AppDateTimePicker  prepend-inner-icon="tabler-calendar" density="compact" v-model="dateEnd"
                                        show-current=true label="Fecha fin" :config="{
                                            position: 'auto right',                
                                            altFormat: 'F j, Y',
                                            dateFormat: 'm-d-Y',
                                            //maxDate: new Date(),
                                            reactive: true
                                        }" />
                                    </VCol>
                                    <VCol cols="12">
                                        <VSelect class="mb-6" v-model="paquetesOptions" label="Asignar paquetes" :items="paquetesOptionsItems"  @update:model-value="resolvePaquetesOptions"/>                              
                                        <VCol v-if="paquetesOptions == 'Personalizado'" style="margin-top: -1.5rem;" v-for="item in dataPaquetes" cols="6">                  
                                        <VCheckbox
                                        v-model="paquetes"
                                        :label="item.title"
                                        :value="item.value"
                                        />
                                        
                                    </VCol>
                                    </VCol>

                                    <VCol style="margin-top: -2rem;" v-if="paquetesOptions == 'Full'" cols="12">                                 
                                        <div class="mb-6">Asignar excepciones</div>           
                                        <VCol  style="margin-top: -1.5rem;" v-for="item in dataPaquetes" cols="6">                  
                                        <VCheckbox
                                        v-model="excepciones"
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
                        ¿Desea eliminar el cupón?
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
      
              </VWindowItem>

              <VWindowItem value="tab-descuentos">
                <tabDescuentos/>              
              </VWindowItem>

             
            </VWindow>
          

        
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
  .mdContainer {
    min-width: 100px;  
  }
}
.open.flatpickr-calendar {
    z-index: 100000;
}

</style>