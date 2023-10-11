<script setup>
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
      const consulta = await fetch('https://ecuavisa-cupones.vercel.app/get/all');
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
    isLoading2.value = true;
    await getCupones();
    await getPaisesCiudades();
    isLoading2.value = false;
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

const ciudadesItems = ref([]);
const paisesItems = ref([]);

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
       let ciudadesNoRepetidos = [...new Set(ciudades)];
       ciudadesNoRepetidos.sort();
       paisesItems.value = paises;
       ciudadesItems.value = ciudadesNoRepetidos;
      
          
    } catch (error) {
        console.error(error.message);
    }
} 


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

const matchItems = [
    {
        title: "Coinciden todas",
        value: "all"
    },
    {
        title: "Coincide alguna",
        value: "some"
    }
]

const tipoCondicionItems = [
    
    {
        title: "Ciudad",
        value: "ciudad"
    },
    {
        title: "País",
        value: "pais"
    },
    {
        title: "Grupo de usuarios",
        value: "grupo_usuarios"
    },
    {
        title: "Proveedores",
        value: "proveedor"
    },
]

const condicionItems = [
    {
        title: "Incluir",
        value: "incluir"
    },
    {
        title: "Excluir",
        value: "excluir"
    }
]

const usuariosItems = [
    {
        title: "Todos",
        value: "todos"
    },
    {
        title: "Usuarios nuevos",
        value: "nuevos"
    },
    {
        title: "Suscritos",
        value: "suscritos"
    }
]

const proveedorItems = ["apple", "google", "facebook", "email"  ]

const ciudadOptionsItems = [
   
    {
        title: "Todas las ciudades",
        value: "full"
    },
    {
        title: "Personalizado",
        value: "personalizado"
    }
]

const paisesOptionsItems = [
   
    {
        title: "Todos los países",
        value: "full"
    },
    {
        title: "Personalizado",
        value: "personalizado"
    }
]

const tipoItems = [
    {
        title: "Cupón",
        value: "Cupon"
    },
    {
        title: "Regla",
        value: "Regla"
    }
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

const activo = ref(false);
const aplica = ref(false);
const condiciones = ref([]);
const match = ref('all');
const tipo = ref('Regla');
const codigo = ref('');

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});


    //------FUNCIONES

//const paisesFiltrados = ref([]);
//const ciudadesFiltradas = ref([]);

const searchCiudad = (index) => {
  if ( condiciones.value[index].search !== '') {
    let val = condiciones.value[index].search;
    const normalizedsearchQuery = val.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();;

    const filteredCiudad = ciudadesItems.value.filter((item) => {
      const normalizedItemName = item.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
      return normalizedItemName.includes(normalizedsearchQuery);
    });

    condiciones.value[index].items = filteredCiudad.slice(0,10);
    condiciones.value[index].asign = true;
  }
}

function resetSearchCiudad (index) {
    condiciones.value[index].search = '';
    condiciones.value[index].asign = false;
    condiciones.value[index].items = [];
    //ciudadesFiltradas.value = [];
}

const searchPais = (index) => {
  if ( condiciones.value[index].search !== '') {
    let val = condiciones.value[index].search;
    const normalizedsearchQuery = val.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();;

    const filteredPais = paisesItems.value.filter((item) => {
      const normalizedItemName = item.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
      return normalizedItemName.includes(normalizedsearchQuery);
    });

    condiciones.value[index].items = filteredPais.slice(0,10);
    condiciones.value[index].asign = true;
  }
}

function resetSearchPais (index) {
    condiciones.value[index].search = '';
    condiciones.value[index].asign = false;
    condiciones.value[index].items = [];
    //paisesFiltrados.value = [];
}

const tipoCondicion = ref('');

function resolveCiudadPaisOptions(index){
    if(condiciones.value[index].opcion == "personalizado"){
        condiciones.value[index].valor = [];
    }else{
        condiciones.value[index].valor = "full";
    }   
}

function resolveAñadirTipoCondicion(val){
    tipoCondicion.value = val;
    //console.log("select" , tipoCondicion.value);
    let nuevaCondicion;
    if(val == "grupo_usuarios" ){
        nuevaCondicion = {
            tipo: val,
            condicion: "incluir",    
            valor: "",
            opcion: "full",
            search: "",
            items: [],
            asign: false
        }
    }else{
        nuevaCondicion = {
            tipo: val,
            condicion: "incluir",    
            valor: [],
            opcion: "full",
            search: "",
            items: [],
            asign: false
        }
    }
    
    condiciones.value.push(nuevaCondicion);
}

function eliminarTipoCondicion (index){
    condiciones.value.splice(index, 1);
}

const paquetesOptions = ref('Todos los productos');
const asignPaquetesVisible = ref(false);
const paquetesOptionsItems = ['Personalizado', 'Todos los productos'];

function resolvePaquetesOptions(){
    
    excepciones.value = [];
    if(paquetesOptions.value === 'Personalizado' ){
        paquetes.value = [];
        asignPaquetesVisible.value = true;
    }else if(paquetesOptions.value === 'Todos los productos'){
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
    tipo.value = 'Regla';
    codigo.value = '';
    activo.value = false;
    aplica.value = false;
    condiciones.value = [];
    match.value = 'all';
    paquetesOptions.value = 'Todos los productos';
}


function closeDiag(){
    resetForm(); 
    isDialogActive.value = false;
}

async function switchActive(id, val){
    let jsonEnviar = {
        "id": id,
        "activo": val
    }
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://ecuavisa-cupones.vercel.app/update', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Cupón editado correctamente",
                type: "success",
                model: true
            };

            isLoading2.value = true;
            await getCupones();     
            isLoading2.value = false;
        } else {
            configSnackbar.value = {
                message: respuesta.mensaje,
                type: "error",
                model: true
            };
        }
        
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
    const consulta = await fetch('https://ecuavisa-cupones.vercel.app/get/id/' + id);
    const consultaJson = await consulta.json();
    const data = consultaJson.data;
    //console.log(paquete);
    idToEdit.value = data._id;
    nombre.value = data.nombre;
    tipo.value = data.tipo;
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

    
    if(paquetesOptions.value == 'Todos los productos'){
        paquetes.value = 'full';
    }

    for(let cond of condiciones.value){
        if((cond.tipo== "pais" || cond.tipo== "ciudad") && cond.opcion == "full"){
            cond.valor = "full";
        }
    }

    let condicionesReduced = condiciones.value.map(objeto => ({
    tipo: objeto.tipo,
    condicion: objeto.condicion,
    valor: objeto.valor
    }));
    //console.log("condicionesReduced", condicionesReduced);

    
    if (accionForm.value === 'add') {

        let jsonEnviar ={
        "nombre": nombre.value,
        "tipo": tipo.value,
        "codigo": codigo.value,
        "paquetes": paquetes.value,
        "excepciones": excepciones.value,
        "discount": discount.value,
        "type": type.value,
        "helper": helper.value,
        "dateIni": dateIni.value,
        "dateEnd": dateEnd.value,
        "condiciones": condicionesReduced,
        "activo" : activo.value,
        "aplica" : aplica.value,
        "match" : match.value
        }
        
        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://ecuavisa-cupones.vercel.app/create', requestOptions);
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
        "tipo": tipo.value,
        "codigo": codigo.value,
        "paquetes": paquetes.value,
        "excepciones": excepciones.value,
        "discount": discount.value,
        "type": type.value,
        "helper": helper.value,
        "dateIni": dateIni.value,
        "dateEnd": dateEnd.value,
        "condiciones": condicionesReduced,
        "activo" : activo.value,
        "aplica" : aplica.value,
        "match" : match.value     
        }

        
        var raw = JSON.stringify(jsonEnviar);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://ecuavisa-cupones.vercel.app/update', requestOptions);
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

    }else if(accionForm.value === 'duplicate'){
        let jsonEnviar ={
        "nombre": nombre.value,
        "tipo": tipo.value,
        "codigo": codigo.value,
        "paquetes": paquetes.value,
        "excepciones": excepciones.value,
        "discount": discount.value,
        "type": type.value,
        "helper": helper.value,
        "dateIni": dateIni.value,
        "dateEnd": dateEnd.value,
        "condiciones": condicionesReduced,
        "activo" : activo.value,
        "aplica" : aplica.value,
        "match" : match.value
        }
        
        var raw = JSON.stringify(jsonEnviar);
        console.log(jsonEnviar);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://ecuavisa-cupones.vercel.app/create', requestOptions);
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
    }
    
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

    const deleted = await fetch('https://ecuavisa-cupones.vercel.app/delete/' + idToDelete.value, requestOptions);
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
        
        
           

            <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :color="configSnackbar.type">
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
                    <VCardTitle class="pt-4 pl-6">Reglas de descuento</VCardTitle>   
                    
                    <VCardText style="margin-bottom: -2rem;">
                            <div class="d-flex flex-wrap gap-4 mt-10">
                                <VBtn prepend-icon="tabler-user-plus" color="success" variant="tonal" class="ml-auto" @click="onAdd">
                                    Nueva regla
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
                            <th scope="col">Tipo</th>
                            <th scope="col">Título</th>                             
                            <th scope="col">Tipo de descuento</th>
                            <th scope="col">Fecha inicio</th>    
                            <th scope="col">Fecha fin</th>   
                            <th scope="col">Estado</th>
                            <th scope="col">Acciones</th>   
                            </tr>
                        </thead>

                        <tbody>
                            <tr v-for="item in paginatedCupones" @click="" class="clickable">
                            <td class="text-medium-emphasis">
                                {{ item.tipo}}
                            </td>     
                            <td class="text-medium-emphasis">
                                {{ item.nombre}}
                            </td>      
                            <td class="text-medium-emphasis">
                                {{ item.type == "percent"? "Porcentaje de descuento": "Descuento fijo"}}
                            </td>
                            <td class="text-medium-emphasis">
                                {{ item.dateIni}}
                            </td>
                            <td class="text-medium-emphasis">
                                {{ item.dateEnd}}
                            </td>
                            <td class="text-medium-emphasis">
                                <VSwitch
                                    v-model="item.activo"
                                    color="success"
                                    :label="item.activo == true ? 'Activo' : 'Inactivo'"
                                    @update:model-value="switchActive(item._id, item.activo)"
                                />
                            </td>
                            <td class="text-medium-emphasis">
                                <VBtn color="success" variant="text" icon  @click="onEdit(item._id)">
                                    <VIcon size="22" icon="tabler-edit" />
                                </VBtn>

                                <VBtn color="primary" variant="text" icon  @click="onDuplicate(item._id)">
                                    <VIcon size="22" icon="tabler-copy" />
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
                            {{ accionForm === "add" || accionForm === "duplicate" ? "Nueva regla de descuento" : "Editar " + nombre }}
                        </VCardTitle>
                    </VCardItem>

                    <VCardText>

                        <!-- 👉 Form -->
                        <VForm class="mt-6" @submit.prevent="onComplete">
                            <VRow class="d-flex flex-wrap justify-center gap-4">
                                <VRow>

                                    <VCol cols="6" >                         
                                        <VSwitch
                                            v-model="activo"
                                            color="success"
                                            label="Estado de publicación"                           
                                        />
                                    </VCol>
                                    <VCol cols="6">
                                        <VSwitch
                                    v-model="tipo"
                                    color="success"
                                    label="El descuento es un cupón?"
                                    true-value="Cupon"
                                    false-value="Regla"
                                     />
                                    </VCol>
                                    
                                    
                                    <VCol cols="6" >
                                        <VTextField v-model="nombre" label="Título descriptivo" :placeholder="tipo == 'Cupon'? 'Título del cupón':'Título de la regla'" />
                                    </VCol>
                                    
                                    
                                    <VCol cols="6" class="d-flex">
                                        <div>
                                        <VCheckbox
                                        v-model="aplica"                                                
                                        >
                                        </VCheckbox>
                                        </div>
                                        <div>
                                        <p>Activa esta regla si coincide<br>
                                         e ignora todas las demás</p>
                                        </div>
                                    </VCol>

                                    <VCol cols="12" style="margin-top: -1.5rem;" v-if="tipo == 'Cupon'">
                                        <VTextField v-model="codigo" label="Código del cupón" placeholder="Escriba el código con el que canjeará el cupón" />
                                    </VCol>

                                    <VCol cols="12" >
                                        <VTextField v-model="discount" label="Descuento" typer="number" />
                                    </VCol>
                                    
                                    <VCol cols="12">
                                        <VSelect v-model="type" label="Tipo" :items="typeItems" />
                                    </VCol>
                                    
                                    <VCol cols="12">
                                        <VSelect class="mb-6" v-model="paquetesOptions" label="Escoge productos" :items="paquetesOptionsItems"  @update:model-value="resolvePaquetesOptions"/>                              
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
                                    <VCol cols="12" class="d-flex">
                                        <div class="d-flex align-content-end flex-wrap">Condiciones</div>
                                        <VMenu location="bottom"  >
                                            <template #activator="{ props }">
                                            <VBtn class="ml-auto" color="primary" prepend-icon="tabler-plus" variant="tonal" v-bind="props" >
                                            Añadir condición
                                            </VBtn>
                                            </template>
                                            <VList >                                                                 
                                            <VListItem   
                                                v-for="(item, iT) in tipoCondicionItems"
                                                :key="iT"
                                                :value="item.value"
                                                :title="item.title"
                                                @click="resolveAñadirTipoCondicion(item.value)"
                                                />
                                            
                                            </VList>           
                                        </VMenu>
                                    </VCol>                                
                                    <VDivider/>
                                    <VCol v-for="m in matchItems" cols="4">
                                        <VCheckbox 
                                        v-model="match" 
                                        :label="m.title"   
                                        :value="m.value"                                             
                                        />                            
                                    </VCol>  
                                    <div v-for="(c, index) in condiciones" cols="12" class="w-100 my-4 item-cards"> 
                                        <VBtn class="ml-auto boton-eleminar-itemsCards" size="38" color="error" @click="eliminarTipoCondicion(index)"><VIcon icon="tabler-x" size="22" /></VBtn>
                                        
                                        <VCardText>
                                            <VCol cols="12" v-if=" c.tipo=='ciudad' "> 
                                                <VRow>  
                                                <VCol cols="8">
                                                    <VSelect class="mb-6" v-model="c.opcion" label="Asignar ciudades" :items="ciudadOptionsItems"  @update:model-value="resolveCiudadPaisOptions(index)"/>
                                                </VCol>
                                              
                                                </VRow>                                    
                                                <VRow v-if=" c.opcion!=='full' ">
                                                    <VCol cols="3" style="margin-right: -1rem;">
                                                        <VTextField value="Ciudad" readonly />        
                                                    </VCol>    
                                                    <VCol cols="3" style="margin-right: -1rem;">
                                                        <VSelect class="mb-6" v-model="c.condicion" label="Condición" :items="condicionItems" />        
                                                    </VCol>                                       
                                                    <VCol cols="4" style="margin-right: -1rem;">                                                                             
                                                        <VTextField v-model="c.search" placeholder="Buscar ciudad..." density="compact" />
                                                    </VCol>    
                                                    <VCol cols="2" style="margin-right: -1rem;" class="d-flex gap-1">   
                                                        <VBtn @click="searchCiudad(index)" size="38">
                                                            <VIcon
                                                                icon="tabler-search"
                                                                size="22"
                                                            />
                                                        </VBtn>   
                                                        <VBtn @click="resetSearchCiudad(index)" size="38">
                                                            <VIcon
                                                                icon="tabler-refresh"
                                                                size="22"
                                                            />
                                                        </VBtn>  
                                                    </VCol>  
                                                    <div style="margin-top: -1.5rem;" v-if="c.valor.length > 0">
                                                    <VCol cols="12">
                                                        <span>Ciudades seleccionadas: </span>
                                                    </VCol>
                                                    <VCol cols="12" style="margin-top: -1rem;">
                                                        <VChip v-for="cV in c.valor" color="primary"> {{ cV}}</VChip>
                                                    </VCol>
                                                    </div>
                                                    <VCol v-if="c.asign" cols="12">
                                                    <span >Ciudades</span>  
                                                    <div style="margin-top: -0.5rem;" v-for="ciudad in c.items">                                      
                                                    <VCheckbox
                                                    v-model="c.valor"
                                                    :label="ciudad"
                                                    :value="ciudad"
                                                    />                                       
                                                    </div>
                                                    </VCol>
                                                                                    
                                                </VRow>
                                            </VCol>     
                                            <VCol cols="12" v-if=" c.tipo=='pais' "> 
                                                <VRow>  
                                                <VCol cols="8">
                                                    <VSelect class="mb-6" v-model="c.opcion" label="Asignar países" :items="paisesOptionsItems"  @update:model-value="resolveCiudadPaisOptions(index)"/>
                                                </VCol>
                                                <VCol cols="4">
                                                   
                                                </VCol>
                                                </VRow>                                    
                                                <VRow v-if=" c.opcion!=='full' ">
                                                    <VCol cols="3" style="margin-right: -1rem;">
                                                        <VTextField value="País" readonly />        
                                                    </VCol>    
                                                    <VCol cols="3" style="margin-right: -1rem;">
                                                        <VSelect class="mb-6" v-model="c.condicion" label="Condición" :items="condicionItems" />        
                                                    </VCol>                                       
                                                    <VCol cols="4" style="margin-right: -1rem;">                                                                             
                                                        <VTextField v-model="c.search" placeholder="Buscar país..." density="compact" />
                                                    </VCol>    
                                                    <VCol cols="2" style="margin-right: -1rem;" class="d-flex gap-1">   
                                                        <VBtn @click="searchPais(index)" size="38">
                                                            <VIcon
                                                                icon="tabler-search"
                                                                size="22"
                                                            />
                                                        </VBtn>   
                                                        <VBtn @click="resetSearchPais(index)" size="38">
                                                            <VIcon
                                                                icon="tabler-refresh"
                                                                size="22"
                                                            />
                                                        </VBtn>  
                                                    </VCol>  
                                                    <div style="margin-top: -1.5rem;" v-if="c.valor.length > 0">
                                                    <VCol cols="12">
                                                        <span>Países seleccionadas: </span>
                                                    </VCol>
                                                    <VCol cols="12" style="margin-top: -1rem;">
                                                        <VChip v-for="cV in c.valor" color="primary"> {{ cV}}</VChip>
                                                    </VCol>
                                                    </div>
                                                    <VCol v-if="c.asign" cols="12">
                                                    <span >Países</span>  
                                                    <div style="margin-top: -0.5rem;" v-for="pais in c.items">                                      
                                                    <VCheckbox
                                                    v-model="c.valor"
                                                    :label="pais"
                                                    :value="pais"
                                                    />                                       
                                                    </div>
                                                    </VCol>
                                                                                    
                                                </VRow>
                                            </VCol>    
                                            <VCol cols="12" v-if=" c.tipo=='grupo_usuarios' "> 
                                                <VRow>  
                                                <VCol cols="12">Escoge grupo de usuarios</VCol>    
                                                <VCol cols="8" class="d-flex gap-4">                                                                 
                                                    <VCheckbox
                                                    v-for="gUsers in usuariosItems"
                                                    v-model="c.valor"
                                                    :label="gUsers.title"
                                                    :value="gUsers.value"
                                                    />                                       
                                                    
                                                </VCol>
                                                </VRow>
                                            </VCol>   
                                            <VCol cols="12" v-if=" c.tipo=='proveedor' "> 
                                                                                  
                                                <VRow>
                                                    <VCol cols="12">Escoge proveedor(es)</VCol>
                                                    <VCol cols="3" style="margin-right: -1rem;">
                                                        <VTextField value="Proveedor" readonly />        
                                                    </VCol>    
                                                    <VCol cols="3" style="margin-right: -1rem;">
                                                        <VSelect class="mb-6" v-model="c.condicion" label="Condición" :items="condicionItems" />        
                                                    </VCol>                                       
                                                    <VCol cols="4" style="margin-right: -1rem;">                                                                                                                              
                                                        <VCombobox
                                                            v-model="c.valor"
                                                            :items="proveedorItems"       
                                                            label="Proveedores"                                               
                                                            multiple
                                                            chips
                                                        />
                                                    </VCol>
                                                                                                                            
                                                </VRow>
                                            </VCol>                                   

                                        </VCardText>   
                                    </div>
                                                       
                                    <VCol cols="12">
                                        <span>Validez de regla</span>
                                        
                                    </VCol>
                                    <VDivider/>
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
      
             
             
    </section>
</template>

<style>  
 
.clickable {
  cursor: pointer;
}

.item-cards {
  background:  rgba(var(--v-border-color), var(--v-hover-opacity));
  box-shadow: none !important;
  border-radius: 6px;
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