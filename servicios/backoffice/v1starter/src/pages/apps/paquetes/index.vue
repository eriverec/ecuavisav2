<script setup>
import { onMounted } from 'vue';
import { FormWizard, TabContent } from "vue3-form-wizard";
import 'vue3-form-wizard/dist/style.css';

const dataPaquetes = ref([]);
const dataCaracteristicas = ref([]);
const isLoading = ref(false);

async function getPaquetes (){
    try {
      isLoading.value = true;  
      const consulta = await fetch('https://ecuavisa-modulos.vercel.app/paquete');
      const consultaJson = await consulta.json();
      dataPaquetes.value = consultaJson.data;             
      isLoading.value = false; 
    } catch (error) {
        console.error(error.message);
    }
} 

async function getCaracteristicas (){
    try {  
      
      const consulta = await fetch('https://ecuavisa-modulos.vercel.app/caracteristica');
      const consultaJson = await consulta.json();
      dataCaracteristicas.value = consultaJson.data;     
             
    } catch (error) {
        console.error(error.message);
    }
} 

onMounted(async()=>{
    await getPaquetes();
})

const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedPaquetes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataPaquetes.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataPaquetes.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};



// -------------------------------ACCIONES------------------------------------------
const isDialogActive = ref(false);
const accionForm = ref('');
    //-----DATOS FORM----
const nombre = ref('');
const codigoInterno = ref('');
const tipoPago = ref('');
const precio = ref(0);
const periodicidad = ref('');
const ciclosPromocion = ref(0);
const precioPromocional = ref(0);
const descripcionPrecios = ref('');
const grupo = ref('');
const sitio = ref('');
const activoDesde = ref('');
const activoHasta = ref('');
const color = ref('');
const destaque = ref('');
const clasesCss = ref('');
//const caracteristicas = ref([]);

const caracteristicasSelected = ref([]);

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});
const loadingWizard = ref(false);

const caracteristicasItems = ref([]);
    //------FUNCIONES
function resolveCaracteristicasItems(){
    
    let caracteristicasRaw = Array.from(dataCaracteristicas.value);
    let items = [];
    for(const item of caracteristicasRaw){
        let data = {
            title: item.nombre,
            value: item._id
        }
        items.push(data);
    }
    caracteristicasItems.value = items;
    
}

function resetForm(){
    nombre.value = '';
    codigoInterno.value = '';
    tipoPago.value = '';
    precio.value = null;
    periodicidad.value = '';
    ciclosPromocion.value = null;
    precioPromocional.value = null;
    descripcionPrecios.value = '';
    grupo.value = '';
    sitio.value = '';
    activoDesde.value = '';
    activoHasta.value = '';
    color.value = '';
    destaque.value = '';
    clasesCss.value = '';
    caracteristicasSelected.value = [];
}

async function handleValidation(isValid, tabIndex) {
  if(tabIndex == 0 && isValid == true && caracteristicasItems.value.length < 1 ){
    if(dataCaracteristicas.value.length < 1){
        await getCaracteristicas();
    }
    resolveCaracteristicasItems();
  }
   //console.log('Tab: '+tabIndex+ ' valid: '+isValid)
  return false;
}

async function handleValidationChange(prevIndex, nextIndex) {
  // console.log('prevIndex: '+prevIndex+ ' nextIndex: '+nextIndex)
  return false;
}

async function setLoading(value) {
  loadingWizard.value = value
}

async function validateAsync() {
  let nombreValid = nombre.value;
  var codigoInternoValid = codigoInterno.value;

  if(!nombreValid || nombreValid == ""){
    configSnackbar.value = {
                message: "Debe añadir un nombre",
                type: "error",
                model: true
            };
    return false;
  }

  if(!codigoInternoValid || codigoInternoValid == ""){
    configSnackbar.value = {
                message: "Debe añadir un código interno",
                type: "error",
                model: true
            };
    return false;
  }

  return true;
}

function closeDiag(){
    resetForm(); 
    isDialogActive.value = false;
}
// ----------ADD-------------
async function onAddPaquete(){
    resetForm(); 
    accionForm.value = 'add';
    await getCaracteristicas();
    isDialogActive.value = true;
}

// ----------EDIT-------------
const idToEdit = ref('');

async function onEditPaquete(id){
    resetForm(); 
    accionForm.value = 'edit';
    await getCaracteristicas();
    const consulta = await fetch('https://ecuavisa-modulos.vercel.app/paquete/' + id);
    const consultaJson = await consulta.json();
    const paquete = consultaJson.data;
    //console.log(paquete);
    idToEdit.value = paquete._id;
    nombre.value = paquete.nombre;
    codigoInterno.value = paquete.codigoInterno;
    tipoPago.value = paquete.tipoPago;
    precio.value = paquete.precio;
    periodicidad.value = paquete.periodicidad;
    ciclosPromocion.value = paquete.ciclosPromocion;
    precioPromocional.value = paquete.precioPromocional;
    descripcionPrecios.value = paquete.descripcionPrecios;
    grupo.value = paquete.grupo;
    sitio.value = paquete.sitio;
    activoDesde.value = paquete.activoDesde;
    activoHasta.value = paquete.activoHasta;
    color.value = paquete.color;
    destaque.value = paquete.destaque;
    clasesCss.value = paquete.clasesCss;
    caracteristicasSelected.value = paquete.caracteristicas;
    
    isDialogActive.value = true;
}

// ------------SEND--------------
async function onComplete(){

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (accionForm.value === 'add') {

        let jsonEnviar ={
        "nombre": nombre.value,
        "codigoInterno": codigoInterno.value,
        "tipoPago": tipoPago.value,
        "precio": precio.value,
        "periodicidad": periodicidad.value,
        "ciclosPromocion": ciclosPromocion.value,
        "precioPromocional": precioPromocional.value,
        "descripcionPrecios": descripcionPrecios.value,
        "grupo": grupo.value,
        "sitio": sitio.value,
        "activoDesde": activoDesde.value,
        "activoHasta": activoHasta.value,
        "color": color.value,
        "destaque": destaque.value,
        "clasesCss":  clasesCss.value,
        "caracteristicas": caracteristicasSelected.value
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://ecuavisa-modulos.vercel.app/paquete', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Paquete creado correctamente",
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
        "codigoInterno": codigoInterno.value,
        "tipoPago": tipoPago.value,
        "precio": precio.value,
        "periodicidad": periodicidad.value,
        "ciclosPromocion": ciclosPromocion.value,
        "precioPromocional": precioPromocional.value,
        "descripcionPrecios": descripcionPrecios.value,
        "grupo": grupo.value,
        "sitio": sitio.value,
        "activoDesde": activoDesde.value,
        "activoHasta": activoHasta.value,
        "color": color.value,
        "destaque": destaque.value,
        "clasesCss":  clasesCss.value,
        "caracteristicas": caracteristicasSelected.value
        }

        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://ecuavisa-modulos.vercel.app/paquete', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Paquete editado correctamente",
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
    await getPaquetes();
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

    const deleted = await fetch('https://ecuavisa-modulos.vercel.app/paquete/' + idToDelete.value, requestOptions);
    const respuesta = await deleted.json();
    if (respuesta.resp) {
        configSnackbar.value = {
            message: "Paquete eliminado correctamente",
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
    await getPaquetes();
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
                <VCardTitle class="pt-4 pl-6">Lista de paquetes</VCardTitle>   
                 
                <VCardText style="margin-bottom: -2rem;">
                        <div class="d-flex flex-wrap gap-4 mt-10">
                            <VBtn prepend-icon="tabler-user-plus" color="success" variant="tonal" class="ml-auto" @click="onAddPaquete">
                                Crear paquete
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
                        <th scope="col">Código interno</th>
                        <th scope="col">Acciones</th>    
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-for="item in paginatedPaquetes">
                        <td class="text-medium-emphasis">
                            {{ item.nombre}}
                        </td>      
                        <td class="text-medium-emphasis">
                            {{ item.codigoInterno}}
                        </td>   
                        <td class="text-medium-emphasis">
                            <VBtn color="success" variant="text" icon  @click="onEditPaquete(item._id)">
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
                    :disabled="(currentPage * itemsPerPage) >= dataPaquetes.length">
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
                        {{ accionForm === "add" ? "Crear un paquete" : "Editar " + nombre }}
                    </VCardTitle>
                </VCardItem>

                <VCardText>

                     <!-- inicio lista de Módulos -->
                  
                <form-wizard 
                  :class="loadingPanel?'disabled':''"
                  @on-complete="onComplete" 
                  @on-loading="setLoading"
                  color="#7367F0" 
                  @on-validate="handleValidation"
                  @on-change="handleValidationChange"
                  validate-on-back="true"
                  nextButtonText="Siguiente"
                  backButtonText="Anterior"
                  finishButtonText="Guardar paquete"
                >
                  <tab-content title="Detalles del paquete" :before-change="validateAsync">
                   
                    <VRow class="pb-5">
                        <VCol cols="12">
                          <VRow >
                            
                            <VCol
                              cols="7"
                              md="7"
                            >
                              <VTextField                              
                                v-model="nombre"
                                label="Nombre"                                                   
                              />
                            </VCol>
                            <VCol
                              cols="5"
                              md="5"
                            >
                              <VTextField
                                v-model="codigoInterno"
                                label="Código interno"                                
                              />
                            </VCol>
                          </VRow>
                        </VCol>

                        <span class="mt-4">Pagos</span>
                        <VDivider class="my-2"/>
                        <VCol cols="12">
                            
                          
                          <VRow >
            
                            <VCol
                              cols="6"
                              md="6"
                            >
                            <VTextField
                                v-model="tipoPago"
                                label="Tipo de pago"                                
                              />
                            </VCol>
                            <VCol
                              cols="6"
                              md="6"
                            >
                            <VTextField
                                v-model="precio"
                                label="Precio"                                
                              />
                            </VCol>
                          </VRow>
                        </VCol>

                        <VCol cols="12">
                          <VRow >
                                
                            <VCol
                              cols="4"
                              md="4"
                            >
                            <VTextField
                                v-model="periodicidad"
                                label="Periodicidad"                                
                              />
                            </VCol>

                            <VCol
                              cols="4"
                              md="4"
                            >
                            <VTextField
                                v-model="ciclosPromocion"
                                label="Ciclos de Promoción"                                
                              />
                            </VCol>

                            <VCol
                              cols="4"
                              md="4"
                            >
                            <VTextField
                                v-model="precioPromocional"
                                label="Precio promocional"                                
                              />
                            </VCol>

                          </VRow>
                        </VCol>

                        <VCol cols="12">
                            <VTextField
                                v-model="descripcionPrecios"
                                label="Descripción de precios"                                
                              />
                        </VCol>
                        <span class="mt-4">Otras configuraciónes</span>
                        <VDivider class="my-2"/>
                        <VCol cols="12">

                          <VRow> 
                            <VCol
                              cols="6"
                              md="6"
                            >
                            <VTextField
                                v-model="grupo"
                                label="Grupo"                                
                              />
                            </VCol>

                            <VCol
                              cols="6"
                              md="6"
                            >
                            <VTextField
                                v-model="sitio"
                                label="Sitio"                                
                              />
                            </VCol>
                          </VRow>

                          <VRow > 
                            <VCol
                              cols="6"
                              md="6"
                            >
                            <VTextField
                                v-model="activoDesde"
                                label="Activo desde"                                
                              />
                            </VCol>

                            <VCol
                              cols="6"
                              md="6"
                            >
                            <VTextField
                                v-model="activoHasta"
                                label="Activo Hasta"                                
                              />
                            </VCol>
                          </VRow>

                          <VRow > 
                            <VCol
                              cols="2"
                              md="2"
                            >
                            <VTextField
                                v-model="color"
                                label="Color"                                
                              />
                            </VCol>

                            <VCol
                              cols="4"
                              md="4"
                            >
                            <VTextField
                                v-model="destaque"
                                label="Destaque"                                
                              />
                            </VCol>

                            <VCol
                              cols="6"
                              md="6"
                            >
                            <VTextField
                                v-model="clasesCss"
                                label="Clases CSS"                                
                              />
                            </VCol>
                          </VRow>


                        </VCol>
                      </VRow>
                  
                  </tab-content>
                  <tab-content title="Asignación de características" :before-change="validateAsyncInsercion">
                    
                    <VRow>
                        <VCol class="mb-1" cols="12">
                            <p>
                            Características
                            </p>
                        </VCol>
                        
                      <VCol cols="6">
                        <VCol style="margin-top: -1.5rem;" v-for="item in caracteristicasItems" cols="6">
                            <VCheckbox
                            v-model="caracteristicasSelected"
                            :label="item.title"
                            :value="item.value"
                            />
                        </VCol>
                      </VCol>
                    </VRow>
                  

                  </tab-content>               

                <div class="loader" v-if="loadingWizard"></div>
                </form-wizard>
                <!-- fin lista usuarios -->
                    
                </VCardText>
            </VCard>
        </VDialog>

        <VDialog v-model="isDialogVisibleDelete" persistent class="v-dialog-sm">

            <!-- Dialog close btn -->
            <DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

            <!-- Dialog Content -->
            <VCard title="Eliminar registro">
                <VCardText>
                    ¿Desea eliminar el paquete?
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
/* This is a css loader. It's not related to vue-form-wizard */
.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid #e74c3c;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

</style>