<script setup>
import { onMounted } from 'vue';

const dataDescuentos = ref([]);
const isLoading = ref(false);
const isLoading2 = ref(false);
const datosSelectedDesc = ref({
    paises:[],
    ciudades:[]
});
const excepcionesSelectedDesc = ref({
    paises:[],
    ciudades:[]
});
const Card2Visible = ref(false);
const selectedDescuento = ref('');

const paisesItems = ref([]);
const ciudadesItems = ref([]);


async function getDescuentos (){
    try {
      isLoading.value = true;  
      const consulta = await fetch('https://ecuavisa-cupones.vercel.app/descuento/get/all');
      const consultaJson = await consulta.json();
      dataDescuentos.value = consultaJson.data;             
      isLoading.value = false; 
    } catch (error) {
        console.error(error.message);
    }
} 

async function resolveSelectedDescuento (id, nombre){
    try {
      isLoading2.value = true;  
      selectedDescuento.value = nombre;
      const consulta = await fetch('https://ecuavisa-cupones.vercel.app/descuento/get/id/'+id);
      const consultaJson = await consulta.json();

      datosSelectedDesc.value.paises = consultaJson.data.paises;     
      datosSelectedDesc.value.ciudades = consultaJson.data.ciudades;     
      
      excepcionesSelectedDesc.value =  consultaJson.data.excepciones;

      Card2Visible.value = true;  
      isLoading2.value = false; 
    } catch (error) {
        console.error(error.message);
    }
} 

async function getPaisesCiudades (){
    try {  
      
      const consulta = await fetch('https://ads-service.vercel.app/campaign/get/all/paisesyciudad');
      const consultaJson = await consulta.json();

      let paises = [];
      let ciudades = [];

      for (let i = 0; i < consultaJson.length; i++) {
        let pais = consultaJson[i].country;
        paises.push(pais);

        let ciudadesPais = consultaJson[i].data.map(function(ciudad) {
            return ciudad.city;
        });

        ciudades = ciudades.concat(ciudadesPais);
       }
       ciudades.sort();
       paisesItems.value = paises;
       ciudadesItems.value = ciudades;
      
          
    } catch (error) {
        console.error(error.message);
    }
} 

onMounted(async()=>{
    await getDescuentos();
})

const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedDescuentos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataDescuentos.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataDescuentos.value.length) currentPage.value++;
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
const paises = ref([]);
const ciudades = ref([]);
const excepciones = ref({
    paises: [],
    ciudades: []
});
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
//const searchPaquetesVisible = ref(false);
const paquetesOptionsItems = ['Personalizado', 'Full'];

const paisesFiltrados = ref([]);
const ciudadesFiltradas = ref([]);

const searchQuery = ref('');

const search = () => {
  if (searchQuery.value !== '') {
    
    const normalizedsearchQuery = searchQuery.value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();;

    const filteredPais = paisesItems.value.filter((item) => {
      const normalizedItemName = item.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
      return normalizedItemName.includes(normalizedsearchQuery);
    });

    const filteredCiudad = ciudadesItems.value.filter((item) => {
      const normalizedItemName = item.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
      return normalizedItemName.includes(normalizedsearchQuery);
    });

    paisesFiltrados.value = filteredPais.slice(0,10);
    ciudadesFiltradas.value = filteredCiudad.slice(0,10);
    asignPaquetesVisible.value = true;
  }
};

function resetSearch () {
    searchQuery.value = '';
    paises.value = [];
    ciudades.value = [];
    excepciones.value = {
        paises: [],
        ciudades: []
    };
    asignPaquetesVisible.value = false;
}

function resolvePaquetesOptions(){
    
    excepciones.value = {
        paises: [],
        ciudades: []
    };

    if(paquetesOptions.value === 'Personalizado' ){
        paises.value = [];
        ciudades.value = [];
        searchQuery.value = '';
        asignPaquetesVisible.value = false;
       
    }else if(paquetesOptions.value === 'Full'){
        paises.value = paisesItems.value;
        ciudades.value = ciudadesItems.value
        searchQuery.value = '';
        asignPaquetesVisible.value = false;
    }
}

function resetForm(){
    searchQuery.value = '';
    nombre.value = '';
    paises.value = [];
    ciudades.value = [];
    excepciones.value = {
        paises: [],
        ciudades: []
    };
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
    await getPaisesCiudades();
    accionForm.value = 'add';
    isDialogActive.value = true;
    isLoading2.value = false;
}

// ----------EDIT-------------
const idToEdit = ref('');

async function onEdit(id){
    isLoading2.value = true;
    resetForm(); 
    await getPaisesCiudades();
    accionForm.value = 'edit';
    const consulta = await fetch('https://ecuavisa-cupones.vercel.app/descuento/get/id/' + id);
    const consultaJson = await consulta.json();
    const data = consultaJson.data;
    //console.log(paquete);
    idToEdit.value = data._id;
    nombre.value = data.nombre;
    paises.value = data.paises;
    ciudades.value = data.ciudades;
    excepciones.value = data.excepciones;
    discount.value = data.discount;
    type.value = data.type;
    helper.value = data.helper;
    dateIni.value = data.dateIni;
    dateEnd.value = data.dateEnd;
    
    
    isDialogActive.value = true;
    isLoading2.value = false;
    
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
        paises.value = paisesItems.value;
        ciudades.value = ciudadesItems.value
    }
    isLoading2.value = true;
    if (accionForm.value === 'add') {

        let jsonEnviar ={
        "nombre": nombre.value,
        "paises": paises.value,
        "ciudades": ciudades.value,
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
        const send = await fetch('https://ecuavisa-cupones.vercel.app/descuento/create', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Descuento creado correctamente",
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
        "paises": paises.value,
        "ciudades": ciudades.value,
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
        const send = await fetch('https://ecuavisa-cupones.vercel.app/descuento/update', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Descuento editado correctamente",
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
    await getDescuentos();
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

    const deleted = await fetch('https://ecuavisa-cupones.vercel.app/descuento/delete/' + idToDelete.value, requestOptions);
    const respuesta = await deleted.json();
    if (respuesta.resp) {
        configSnackbar.value = {
            message: "Descuento eliminado correctamente",
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
    await getDescuentos();
    Card2Visible.value = false;
    isDialogVisibleDelete.value = false;
    isLoading2.value = false;
}
</script>
<template>
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
                    <VCardTitle class="pt-4 pl-6">Lista de descuentos</VCardTitle>   
                    
                    <VCardText style="margin-bottom: -2rem;">
                            <div class="d-flex flex-wrap gap-4 mt-10">
                                <VBtn prepend-icon="tabler-user-plus" color="success" variant="tonal" class="ml-auto" @click="onAdd">
                                    Crear descuento
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
                            <tr v-for="item in paginatedDescuentos" @click="resolveSelectedDescuento(item._id, item.nombre)" class="clickable">
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
                        :disabled="(currentPage * itemsPerPage) >= dataDescuentos.length">
                    </VBtn>
                    </div>
                    </VCardItem>  
                    
                    </VCard>
                </VCol>

                <VCol v-if="Card2Visible" cols="6" sm="12" lg="6" class="container">
                    <VCard>
                    <VCardTitle class="pt-4 pl-6">Datos de {{ selectedDescuento }}</VCardTitle>   
                        
                    <VCardItem>
                        <VCol cols="12">
                        <span>Países:</span>    
                        <div class="d-flex flex-wrap" style="max-width: 1000px;">                        
                                <VChip v-for="p in datosSelectedDesc.paises" color="primary"> {{ p }}</VChip>   
                        </div>    
                        </VCol> 
                        <VCol cols="12">
                        <span>Ciudades:</span> 
                        <div class="d-flex flex-wrap" style="max-width: 1000px;">                        
                            <VChip v-for="c in datosSelectedDesc.ciudades" color="primary"> {{ c }}</VChip>   
                        </div>    
                        </VCol> 
                    </VCardItem>  
                    
                    </VCard>
                </VCol>

                <VCol v-if="Card2Visible" cols="6" sm="12" lg="6" class="container">
                    <VCard>
                    <VCardTitle class="pt-4 pl-6">Excepciones de {{ selectedDescuento }}</VCardTitle>   
                        
                    <VCardItem v-if="excepcionesSelectedDesc.paises.length === 0 || excepcionesSelectedDesc.ciudades.length === 0">
                    No existen excepciones para mostrar.          
                    </VCardItem>  
                    
                    <VCardItem v-else>
                        <VCol cols="12">
                        <span>Países:</span>    
                        <div class="d-flex flex-wrap" style="max-width: 1000px;">                        
                            <VChip v-for="p in excepcionesSelectedDesc.paises" color="primary"> {{ p }}</VChip> 
                        </div>    
                        </VCol> 
                        <VCol cols="12">
                        <span>Ciudades:</span> 
                        <div class="d-flex flex-wrap" style="max-width: 1000px;">                        
                            <VChip v-for="c in excepcionesSelectedDesc.ciudades" color="primary"> {{ c }}</VChip>   
                        </div>    
                        </VCol>                      
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
                            {{ accionForm === "add" ? "Crear un descuento" : "Editar " + nombre }}
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
                                            reactive: true
                                        }" />
                                    </VCol>
                                    <VCol cols="6">                                  
                                        <AppDateTimePicker  prepend-inner-icon="tabler-calendar" density="compact" v-model="dateEnd"
                                        show-current=true label="Fecha fin" :config="{
                                            position: 'auto right',                
                                            altFormat: 'F j, Y',
                                            dateFormat: 'm-d-Y',                                        
                                            reactive: true
                                        }" />
                                    </VCol>
                                    <VCol cols="12">
                                        <VSelect class="mb-6" v-model="paquetesOptions" label="Asignar países y ciudades" :items="paquetesOptionsItems"  @update:model-value="resolvePaquetesOptions"/>   
                                        
                                        <VRow v-if="paquetesOptions == 'Personalizado'">
                                            <VCol cols="12" class="d-flex gap-2">
                                                
                                                <div class="w-100 mdContainer">
                                                <VTextField v-model="searchQuery" placeholder="Buscar país o ciudad..." density="compact" />
                                                </div>
                                                <!-- 👉 Search button -->
                                                <VBtn prepend-icon="tabler-search" @click="search"/>
                                                <VBtn @click="resetSearch">
                                                Reiniciar
                                                </VBtn>
                                                
                                            </VCol>
                                        </VRow>
                                        <VRow v-if="paquetesOptions == 'Personalizado'">
                                            <div v-if="paises.length > 0">
                                            <VCol cols="12">
                                                <span>Países seleccionados: </span>
                                            </VCol>
                                            <VCol cols="12" style="margin-top: -1rem;">
                                                <VChip v-for="p in paises" color="primary"> {{ p }}</VChip>
                                            </VCol>
                                            </div>
                                            <div v-if="ciudades.length > 0">
                                            <VCol cols="12">
                                                <span>Ciudades seleccionadas: </span>
                                            </VCol>
                                            <VCol cols="12" style="margin-top: -1rem;">
                                                <VChip v-for="c in ciudades" color="primary"> {{ c}}</VChip>
                                            </VCol>
                                            </div>
                                        </VRow>
                                        
                                        <VRow v-if="paquetesOptions == 'Personalizado' && asignPaquetesVisible">
                                            
                                        <VCol cols="6">    
                                        <span>Países</span> 
                                        <div  style="margin-top: -0.5rem;" v-for="pais in paisesFiltrados">                                  
                                        <VCheckbox
                                        v-model="paises"
                                        :label="pais"
                                        :value="pais"
                                        />                                       
                                        </div>
                                        </VCol>

                                        <VCol cols="6">
                                        <span >Ciudades</span>  
                                        <div style="margin-top: -0.5rem;" v-for="ciudad in ciudadesFiltradas">                                      
                                        <VCheckbox
                                        v-model="ciudades"
                                        :label="ciudad"
                                        :value="ciudad"
                                        />                                       
                                        </div>
                                        </VCol>

                                        </VRow>
                                    </VCol>

                                    <VCol cols="12">
                                    <VRow v-if="paquetesOptions == 'Full'" style="margin-top: -2rem;">
                                        <VCol>Asignar excepciones</VCol> 
                                        <VCol cols="12" class="d-flex gap-2">
                                                    
                                                <div class="w-100 mdContainer">                                         
                                                <VTextField v-model="searchQuery" placeholder="Buscar país o ciudad..." density="compact" />
                                                </div>
                                                <!-- 👉 Search button -->
                                                <VBtn prepend-icon="tabler-search" @click="search"/>
                                                <VBtn @click="resetSearch">
                                                Reiniciar
                                                </VBtn>
                                                
                                            </VCol>
                                        </VRow>

                                    <VRow v-if="paquetesOptions == 'Full'">
                                            <div v-if="excepciones.paises.length > 0">
                                            <VCol cols="12">
                                                <span>Países seleccionados: </span>
                                            </VCol>
                                            <VCol cols="12" style="margin-top: -1rem;">
                                                <VChip v-for="p in excepciones.paises" color="primary"> {{ p }}</VChip>
                                            </VCol>
                                            </div>
                                            <div v-if="excepciones.ciudades.length > 0">
                                            <VCol cols="12">
                                                <span>Ciudades seleccionadas: </span>
                                            </VCol>
                                            <VCol cols="12" style="margin-top: -1rem;">
                                                <VChip v-for="c in excepciones.ciudades" color="primary"> {{ c}}</VChip>
                                            </VCol>
                                            </div>
                                    </VRow>    

                                    <VCol v-if="paquetesOptions == 'Full' && asignPaquetesVisible" cols="12">                                 
                                                  
                                        <VRow>

                                        <VCol cols="6">    
                                        <span>Países</span> 
                                        <div  style="margin-top: -0.5rem;" v-for="pais in paisesFiltrados">                                  
                                        <VCheckbox
                                        v-model="excepciones.paises"
                                        :label="pais"
                                        :value="pais"
                                        />                                       
                                        </div>
                                        </VCol>

                                        <VCol cols="6">
                                        <span >Ciudades</span>  
                                        <div style="margin-top: -0.5rem;" v-for="ciudad in ciudadesFiltradas">                                      
                                        <VCheckbox
                                        v-model="excepciones.ciudades"
                                        :label="ciudad"
                                        :value="ciudad"
                                        />                                       
                                        </div>
                                        </VCol>

                                        </VRow>
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
                        ¿Desea eliminar el descuento?
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
</template>
<style>
.containerChip{
    max-width: 200px;
}
</style>