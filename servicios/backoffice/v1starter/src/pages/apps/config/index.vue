<script setup>
import { requiredValidator } from '@validators';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { onMounted } from "vue";
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);
const router = useRouter();

const currentPage = ref(1);
const itemsPerPage = ref(10);
const configuraciones = ref([]);
const isLoading = ref(false);
const isConfiguracionAddActive = ref(false);
const formNuevo = ref();
const nuevaConfiguracion = ref({
    key: "",
    estructura: []
});
const seccionesForm = ref([]);
const tipoSeccion = ref('');
const tipoSeccionAnidado = ref({});
const tipoSeccionAnidado2 = ref({});
const tipoSeccionAnidado3 = ref({});

const isConfiguracionEditActive = ref(false);
const formEdit = ref();
const editConfiguracion = ref({
    key: "",
    estructura: []
});
const seccionesFormEdit = ref([]);
const tipoSeccionEdit = ref('');
const tipoSeccionAnidadoEdit = ref({});
const tipoSeccionAnidadoEdit2 = ref({});
const tipoSeccionAnidadoEdit3 = ref({});

const itemsSeccion = [
    "Texto",
    "Boolean",
    "Número",
    "Fecha",
    "Lista",
    "Objeto"
]

const itemsSeccionNoLista = [
    "Texto",
    "Boolean",
    "Número",
    "Fecha",
]

async function fetchConfiguraciones (){
    try {
        isLoading.value = true;
        const consulta = await fetch('https://configuracion-service.vercel.app/all');
        const data = await consulta.json();
        configuraciones.value = data;
        isLoading.value = false;
    } catch (error) {
        console.error(error.message);
    }   
}
	
onMounted(async()=>{
    await fetchConfiguraciones();
    authorizedCheck();
})

const authorizedCheck = () => {
    let rol = localStorage.getItem('role');
    if(rol !== 'administrador' && rol !== 'webmaster'){
        router.push({ path: '/pages/errors/not-authorized' })
    }
}
	
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;

  return configuraciones.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage.value < configuraciones.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};



//  ------------------------  ADD ------------------------------- //

    // --------------------------- Secciones en Modal ADD ------------------------- //

const agregarSeccion = () => {
    if(tipoSeccion.value){  
    seccionesForm.value.push({
        nombre: '',
        tipo: tipoSeccion.value,
        valor: tipoSeccion.value == 'Boolean'? false : null
      }); 
    }
};
const eliminarSeccion = (index) =>{
    seccionesForm.value.splice(index, 1);
};


const agregarSeccionAnidado = (index) => {
    if(tipoSeccionAnidado.value[index]){  
      if(seccionesForm.value[index].valor === null){
      seccionesForm.value[index].valor = []; 
      }  
      seccionesForm.value[index].valor.push({
        nombre: '',
        tipo: tipoSeccionAnidado.value[index],
        valor: tipoSeccionAnidado.value[index] == 'Boolean'? false : null
      });
      //console.log('raw',seccionesForm.value)
    }
};
const eliminarSeccionAnidado = (index, indexA) =>{
    seccionesForm.value[index].valor.splice(indexA, 1);
    delete tipoSeccionAnidado.value[index];
};

const agregarSeccionAnidado2 = (index, indexA) => {
    if(tipoSeccionAnidado2.value[indexA]){  
      if(seccionesForm.value[index].valor[indexA].valor === null) {
      seccionesForm.value[index].valor[indexA].valor = [];   
      }
      seccionesForm.value[index].valor[indexA].valor.push({
        nombre: '',
        tipo: tipoSeccionAnidado2.value[indexA],
        valor: tipoSeccionAnidado2.value[indexA] == 'Boolean'? false : null
      });
    
    }
};
const eliminarSeccionAnidado2 = (index, indexA, indexA2) =>{
    seccionesForm.value[index].valor[indexA].valor.splice(indexA2, 1);
    delete tipoSeccionAnidado2.value[indexA];
};

const agregarSeccionAnidado3 = (index, indexA, indexA2) => {
    if(tipoSeccionAnidado3.value[indexA2]){  
      if(seccionesForm.value[index].valor[indexA].valor[indexA2].valor === null) {
        seccionesForm.value[index].valor[indexA].valor[indexA2].valor = [];   
      }
      seccionesForm.value[index].valor[indexA].valor[indexA2].valor.push({
        nombre: '',
        tipo: tipoSeccionAnidado2.value[indexA2],
        valor: tipoSeccionAnidado2.value[indexA2] == 'Boolean'? false : null
      });
    
    }
};
const eliminarSeccionAnidado3 = (index, indexA, indexA2, indexA3) =>{
    seccionesForm.value[index].valor[indexA].valor[indexA2].valor.splice(indexA3, 1);
    delete tipoSeccionAnidado2.value[indexA2];
};

    // --------------------------- Manejo del ADD ------------------------- //

const onAddConfiguracionActive = () => {
    isConfiguracionAddActive.value = true;
}

const onAddConfiguracionValueUpdate = (val) => {
    if(val === false){
    seccionesForm.value = [];   
    nuevaConfiguracion.value = {
      key: "",
      estructura: []
     };
    }
	isConfiguracionAddActive.value = val;
}

async function onAddConfiguracionSubmit () {
    
    formNuevo.value?.validate().then(async({ valid: isValid }) => {
    if (isValid){
        let arr = Array.from(seccionesForm.value);
        const obj = {};
        arr.forEach((element) => {
            if(Array.isArray(element.valor) && element.tipo == "Objeto"){   
                const obj1 = {};

                element.valor.forEach((a) => {
                    if(Array.isArray(a.valor) && a.tipo == "Objeto"){    
                        const obj2 = {};

                        a.valor.forEach((b) => {
                            if(Array.isArray(b.valor) && b.tipo == "Objeto"){ 
                                const obj3 = {};
                                
                                b.valor.forEach((c) => {
                                    obj3[c.nombre] = c.valor;
                                });

                                b.valor = obj3;
                            }else if(Array.isArray(b.valor) && b.tipo == "Lista"){
                                const arr3 = [];
                                
                                b.valor.forEach((c) => {
                                   arr3.push(c.valor);
                                });

                                b.valor = arr3;
                            }
                            obj2[b.nombre] = b.valor;
                        });

                        a.valor = obj2;

                    }else if(Array.isArray(a.valor) && a.tipo == "Lista"){
                        const arr2 = [];
                        a.valor.forEach((b) => { 
                            if(Array.isArray(b.valor) && b.tipo == "Objeto"){ 
                                const obj3 = {};
                                
                                b.valor.forEach((c) => {
                                    obj3[c.nombre] = c.valor;
                                });

                                b.valor = obj3;
                            }else if(Array.isArray(b.valor) && b.tipo == "Lista"){
                                const arr3 = [];
                                
                                b.valor.forEach((c) => {
                                   arr3.push(c.valor);
                                });

                                b.valor = arr3;
                            }                  
                            arr2.push(b.valor);
                        });
                    }

                    obj1[a.nombre] = a.valor;
                });

                element.valor = obj1;
                
            }else if(Array.isArray(element.valor) && element.tipo == "Lista"){

                const arr1 = [];

                element.valor.forEach((a) => {
                    if(Array.isArray(a.valor) && a.tipo == "Lista"){
                        const arr2 = [];

                        a.valor.forEach((b) => {
                            if(Array.isArray(b.valor) && b.tipo == "Lista"){ 
                                const arr3 = [];
                                
                                b.valor.forEach((c) => {
                                   arr3.push(c.valor);
                                });

                                b.valor = arr3;
                            }else if(Array.isArray(b.valor) && b.tipo == "Objeto"){
                                const obj3 = {};
                                
                                b.valor.forEach((c) => {
                                    obj3[c.nombre] = c.valor;
                                });

                                b.valor = obj3;
                            }
                            arr2.push(b.valor);
                        });

                        a.valor = arr2;
                    }else if(Array.isArray(a.valor) && a.tipo == "Objeto"){
                        const obj2 = {};

                        a.valor.forEach((b) => {
                            if(Array.isArray(b.valor) && b.tipo == "Objeto"){ 
                                const obj3 = {};
                                
                                b.valor.forEach((c) => {
                                    obj3[c.nombre] = c.valor;
                                });

                                b.valor = obj3;
                            }else if(Array.isArray(b.valor) && b.tipo == "Lista"){
                                const arr3 = [];
                                
                                b.valor.forEach((c) => {
                                   arr3.push(c.valor);
                                });

                                b.valor = arr3;
                            }
                            obj2[b.nombre] = b.valor;
                        });

                        a.valor = obj2;
                    }
                    arr1.push(a.valor);
                });
                element.valor = arr1;

            }           
            obj[element.nombre] = element.valor;
        });

        nuevaConfiguracion.value.estructura = obj;
        
        var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		var raw = JSON.stringify(nuevaConfiguracion.value);
		var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
		};
		await fetch(`https://configuracion-service.vercel.app/insert`, requestOptions)
		.then(response =>{			
		}).catch(error => console.log('error', error));
        
        //console.log('nuevaConfiguracion',nuevaConfiguracion.value);
        await fetchConfiguraciones();
        seccionesForm.value = [];   
        nuevaConfiguracion.value = {
        key: "",
        estructura: []
        };
        isConfiguracionAddActive.value = false; 
        }
    });
}


//  ------------------------  EDIT ------------------------------- //
function convertirObjetoAArray(obj) {
  function esArray(valor) {
    return Array.isArray(valor);
  }

  function esObjeto(valor) {
    return typeof valor === "object" && valor !== null && !Array.isArray(valor);
  }

  function convertirValor(valor) {
    if (esArray(valor)) {
      return {
        nombre: "",
        tipo: "Lista",
        valor: valor.map(convertirValor),
      };
    } else if (esObjeto(valor)) {
      return {
        nombre: "",
        tipo: "Objeto",
        valor: convertirObjetoAArray(valor),
      };
    } else {
      let tipo = typeof valor === "number" ? "Numero" : typeof valor === "string" ? "Texto" : "Boolean";
      if(tipo === "Texto"){
        let isNum;
        if(!isNaN(value) &&  !isNaN(parseFloat(value))){
            isNum = true;
        }
        let isDate = moment(value);
        if (isDate.isValid() && isNum !== true){
            tipo = "Fecha";
        }
      }
      return {
        nombre: "",
        tipo: tipo,
        valor: valor,
      };
    }
  }

  const array = [];

  for (const key in obj) {
    const value = obj[key];
    if (esArray(value)) {
      array.push({
        nombre: key,
        tipo: "Lista",
        valor: value.map(convertirValor),
      });
    } else if (esObjeto(value)) {
      array.push({
        nombre: key,
        tipo: "Objeto",
        valor: convertirObjetoAArray(value),
      });
    } else {
      let tipo = typeof value === "number" ? "Numero" : typeof value === "string" ? "Texto" : "Boolean";
      if(tipo === "Texto"){
        let isNum;
        if(!isNaN(value) &&  !isNaN(parseFloat(value))){
            isNum = true;
        }
        let isDate = moment(value);
        if (isDate.isValid() && isNum !== true){
            tipo = "Fecha";
        }
      }
      array.push({
        nombre: key,
        tipo: tipo,
        valor: value,
      });
    }
  }

  return array;
}
    // --------------------------- Secciones en Modal EDIT ------------------------- //
    const agregarSeccionEdit = () => {
    if(tipoSeccionEdit.value){  
    seccionesFormEdit.value.push({
        nombre: '',
        tipo: tipoSeccionEdit.value,
        valor: tipoSeccionEdit.value == 'Boolean'? false : null
      }); 
    }
};
const eliminarSeccionEdit = (index) =>{
    seccionesFormEdit.value.splice(index, 1);
};


const agregarSeccionAnidadoEdit = (index) => {
    if(tipoSeccionAnidadoEdit.value[index]){  
      if(seccionesFormEdit.value[index].valor === null){
      seccionesFormEdit.value[index].valor = []; 
      }  
      seccionesFormEdit.value[index].valor.push({
        nombre: '',
        tipo: tipoSeccionAnidadoEdit.value[index],
        valor: tipoSeccionAnidadoEdit.value[index] == 'Boolean'? false : null
      });
      
    }
};
const eliminarSeccionAnidadoEdit = (index, indexA) =>{
    seccionesFormEdit.value[index].valor.splice(indexA, 1);
    delete tipoSeccionAnidadoEdit.value[index];
};

const agregarSeccionAnidadoEdit2 = (index, indexA) => {
    if(tipoSeccionAnidadoEdit2.value[indexA]){  
      if(seccionesFormEdit.value[index].valor[indexA].valor === null) {
      seccionesFormEdit.value[index].valor[indexA].valor = [];   
      }
      seccionesFormEdit.value[index].valor[indexA].valor.push({
        nombre: '',
        tipo: tipoSeccionAnidadoEdit2.value[indexA],
        valor: tipoSeccionAnidadoEdit2.value[indexA] == 'Boolean'? false : null
      });
    
    }
};
const eliminarSeccionAnidadoEdit2 = (index, indexA, indexA2) =>{
    seccionesFormEdit.value[index].valor[indexA].valor.splice(indexA2, 1);
    delete tipoSeccionAnidadoEdit2.value[indexA];
};

const agregarSeccionAnidadoEdit3 = (index, indexA, indexA2) => {
    if(tipoSeccionAnidadoEdit3.value[indexA2]){  
      if(seccionesFormEdit.value[index].valor[indexA].valor[indexA2].valor === null) {
        seccionesFormEdit.value[index].valor[indexA].valor[indexA2].valor = [];   
      }
      seccionesFormEdit.value[index].valor[indexA].valor[indexA2].valor.push({
        nombre: '',
        tipo: tipoSeccionAnidadoEdit2.value[indexA2],
        valor: tipoSeccionAnidadoEdit2.value[indexA2] == 'Boolean'? false : null
      });
    
    }
};
const eliminarSeccionAnidadoEdit3 = (index, indexA, indexA2, indexA3) =>{
    seccionesFormEdit.value[index].valor[indexA].valor[indexA2].valor.splice(indexA3, 1);
    delete tipoSeccionAnidadoEdit2.value[indexA2];
};

    // --------------------------- Manejo del EDIT ------------------------- //

const onEditConfiguracionActive = async(key) => {
    isConfiguracionEditActive.value = true;
    const consulta = await fetch('https://configuracion-service.vercel.app/configuracion/'+key);
    const data = await consulta.json();
    console.log('array convertido',data);
    let arrRaw = convertirObjetoAArray(data);
    console.log('array convertido',arrRaw);
    editConfiguracion.value.key = key;
    seccionesFormEdit.value = arrRaw;
    
}

const onEditConfiguracionValueUpdate = (val) => {
    if(val === false){
        seccionesFormEdit.value = [];
        editConfiguracion.value = {
            key: "",
            estructura: []
        };   
    }
	isConfiguracionEditActive.value = val;
}

async function onEditConfiguracionSubmit () {
    
    formEdit.value?.validate().then(async({ valid: isValid }) => {
    if (isValid){
        let arr = Array.from(seccionesFormEdit.value);
        const obj = {};
        arr.forEach((element) => {
            if(Array.isArray(element.valor) && element.tipo == "Objeto"){   
                const obj1 = {};

                element.valor.forEach((a) => {
                    if(Array.isArray(a.valor) && a.tipo == "Objeto"){    
                        const obj2 = {};

                        a.valor.forEach((b) => {
                            if(Array.isArray(b.valor) && b.tipo == "Objeto"){ 
                                const obj3 = {};
                                
                                b.valor.forEach((c) => {
                                    obj3[c.nombre] = c.valor;
                                });

                                b.valor = obj3;
                            }else if(Array.isArray(b.valor) && b.tipo == "Lista"){
                                const arr3 = [];
                                
                                b.valor.forEach((c) => {
                                   arr3.push(c.valor);
                                });

                                b.valor = arr3;
                            }
                            obj2[b.nombre] = b.valor;
                        });

                        a.valor = obj2;

                    }else if(Array.isArray(a.valor) && a.tipo == "Lista"){
                        const arr2 = [];
                        a.valor.forEach((b) => { 
                            if(Array.isArray(b.valor) && b.tipo == "Objeto"){ 
                                const obj3 = {};
                                
                                b.valor.forEach((c) => {
                                    obj3[c.nombre] = c.valor;
                                });

                                b.valor = obj3;
                            }else if(Array.isArray(b.valor) && b.tipo == "Lista"){
                                const arr3 = [];
                                
                                b.valor.forEach((c) => {
                                   arr3.push(c.valor);
                                });

                                b.valor = arr3;
                            }                  
                            arr2.push(b.valor);
                        });
                    }

                    obj1[a.nombre] = a.valor;
                });

                element.valor = obj1;
                
            }else if(Array.isArray(element.valor) && element.tipo == "Lista"){

                const arr1 = [];

                element.valor.forEach((a) => {
                    if(Array.isArray(a.valor) && a.tipo == "Lista"){
                        const arr2 = [];

                        a.valor.forEach((b) => {
                            if(Array.isArray(b.valor) && b.tipo == "Lista"){ 
                                const arr3 = [];
                                
                                b.valor.forEach((c) => {
                                   arr3.push(c.valor);
                                });

                                b.valor = arr3;
                            }else if(Array.isArray(b.valor) && b.tipo == "Objeto"){
                                const obj3 = {};
                                
                                b.valor.forEach((c) => {
                                    obj3[c.nombre] = c.valor;
                                });

                                b.valor = obj3;
                            }
                            arr2.push(b.valor);
                        });

                        a.valor = arr2;
                    }else if(Array.isArray(a.valor) && a.tipo == "Objeto"){
                        const obj2 = {};

                        a.valor.forEach((b) => {
                            if(Array.isArray(b.valor) && b.tipo == "Objeto"){ 
                                const obj3 = {};
                                
                                b.valor.forEach((c) => {
                                    obj3[c.nombre] = c.valor;
                                });

                                b.valor = obj3;
                            }else if(Array.isArray(b.valor) && b.tipo == "Lista"){
                                const arr3 = [];
                                
                                b.valor.forEach((c) => {
                                   arr3.push(c.valor);
                                });

                                b.valor = arr3;
                            }
                            obj2[b.nombre] = b.valor;
                        });

                        a.valor = obj2;
                    }
                    arr1.push(a.valor);
                });
                element.valor = arr1;

            }           
            obj[element.nombre] = element.valor;
        });

        editConfiguracion.value.estructura = obj;
        
        var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		var raw = JSON.stringify(editConfiguracion.value);
		var requestOptions = {
				method: 'PUT',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
		};
		await fetch(`https://configuracion-service.vercel.app/update`, requestOptions)
		.then(response =>{			
		}).catch(error => console.log('error', error));
        
        console.log('editConfiguracion',editConfiguracion.value);
        await fetchConfiguraciones();
        seccionesFormEdit.value = [];   
        editConfiguracion.value = {
        key: "",
        estructura: []
        };
        isConfiguracionEditActive.value = false; 
        }
    });
}

// ------------------------     DELETE   ----------------------------   //
const onConfirmConfiguracionDeleteActive = () => {
    
}

</script>

<style type="text/css">
	.p-10 {
	    padding: 12px;
	}
</style>

<template>
	<section>
		<VRow>
			<VCol class="mt-6" cols="12" md="12" lg="12">
				
				<VCard class="mt-5" title="Configuraciones">	
                  
					<VCardText class="d-flex flex-wrap py-2 gap-2">
						
						<div class="d-flex align-left flex-wrap gap-2">
							<VBtn
								prepend-icon="tabler-plus"
								@click="onAddConfiguracionActive"
                                :disabled="isLoading"
							>
								Agregar una configuración
							</VBtn>
						</div>
					</VCardText>

				
                  <VCardText v-if="isLoading">Cargando datos...</VCardText>
                  <VCardText v-else-if="configuraciones.length > 0">
					<VTable class="text-no-wrap p-10 mb-5">
						<!-- 👉 table head -->
						<thead>
							<tr>
								<th scope="col">Key</th>	
								<th scope="col">Acciones</th>
							</tr>
						</thead>
						<!-- 👉 table body -->
						<tbody>
							<tr v-for="item in paginatedData" style="height: 3.5rem">
								<!-- 👉 nombre modulo -->
								<td>
												{{ item.key }}						
								</td>

								<td class="text-center" style="width: 5rem">
									<VBtn
										icon
										size="x-small"
										color="default"
										variant="text"
										@click="onEditConfiguracionActive(item.key)"
									>
										<VIcon size="22" icon="tabler-edit" />
									</VBtn>

                                    <VBtn icon size="x-small" color="default" variant="text" @click="onConfirmConfiguracionDeleteActive(item.key)">
                                        <VIcon size="22" icon="tabler-trash" />
                                    </VBtn>
								</td>
							</tr>
						</tbody>
					</VTable>
			
				<div class="d-flex align-center justify-space-between botonescurrentPage" id="target">
                  <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                  Página {{ currentPage }}
                  <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                    :disabled="(currentPage * itemsPerPage) >= configuraciones.length">
                  </VBtn>
                </div>
                </VCardText>
				<VCardText v-else>No existen datos</VCardText>	

       <!--------------------       ADD DIALOG     --------------------->

                <VDialog
						:width="$vuetify.display.smAndDown ? 'auto' : 900"
						:model-value="isConfiguracionAddActive"
						@update:model-value="onAddConfiguracionValueUpdate"		
                        persistent
                       no-click-animation				
					>
						<!-- Dialog close btn -->
						<DialogCloseBtn @click="onAddConfiguracionValueUpdate(false)" />

						<VCard class="pa-sm-14 pa-5">
							<VCardItem class="text-center">
								<VCardTitle class="text-h5 mb-3">
									Añadir configuración
								</VCardTitle>
							</VCardItem>

							<VCardText>		
                                <VRow >
                                <VCol cols="12">                   			
								<!-- 👉 Form -->
								<VForm
									class="mt-6"
                                    ref="formNuevo"
									@submit.prevent="onAddConfiguracionSubmit"
								>
									<VRow class="d-flex flex-wrap justify-center gap-1 ">
										<!-- 👉 Nombre -->
                                       
										<VCol cols="12">	
                                            <label>
                                                <h3>Key</h3>
                                            </label>										
                                            <VTextField
                                                style="width: 300px;"
                                                v-model="nuevaConfiguracion.key"
                                                placeholder="Ingrese la key"
                                                :rules="[requiredValidator]"                                                                                        
                                                />
										</VCol>
                                   
                                        <VCol cols="12">  
                                        <Span><h3>Estructura</h3></Span>     
                                       </VCol>

                                       <VCol cols="12"> 
                                       <div class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">
                                       <VSelect v-model="tipoSeccion" :items="itemsSeccion" label="Tipo de campo" />
                                         </div>
                                       <VBtn @click="agregarSeccion()"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                       </div>
                                       </VCol>
                                       
                                       <VDivider/>
                                         
                                        <VCol cols="12" class="d-flex flex-wrap justify-left gap-2" v-for="(seccion, index) in seccionesForm" :key="index">                                                     
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccion.nombre" :label="'Nombre ' + seccion.tipo"  :rules = "[requiredValidator]" />
                                        </div>
                                        <VSwitch
                                                v-if="seccion.tipo == 'Boolean'"
												v-model="seccion.valor"
												density="compact"
												label="Valor"                                 
											/>
                                         <div v-else-if="seccion.tipo == 'Texto'" style="width: 200px;">   
                                        <VTextField   type="text" v-model="seccion.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccion.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccion.valor" @input="seccion.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" />
                                        </div>  
                                        <div v-else-if="seccion.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccion.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                       <div v-else-if="seccion.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">
                                       <VSelect v-model="tipoSeccionAnidado[index]" :items="itemsSeccion" label="Tipo de campo" />
                                         </div>
                                       <VBtn @click="agregarSeccionAnidado(index)"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <div v-else-if="seccion.tipo == 'Lista'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">
                                       <VSelect v-model="tipoSeccionAnidado[index]" :items="itemsSeccion" label="Tipo de campo" />
                                         </div>
                                       <VBtn @click="agregarSeccionAnidado(index)"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                       <VBtn color="error" @click="eliminarSeccion(index)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        <!-----------------             OBJETO ANIDADO          --------------------->

                                       <VCol v-if="seccion.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA, indexA) in seccionesForm[index].valor" :key="indexA">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA.nombre" :label="'Nombre ' + seccionA.tipo"  :rules = "[requiredValidator]" />
                                        </div>
                                        <VSwitch
                                                v-if="seccionA.tipo == 'Boolean'"
												v-model="seccionA.valor"
												density="compact"
												label="Valor"
                                                :rules = "[requiredValidator]"
											/>
                                         <div v-else-if="seccionA.tipo == 'Texto'" style="width: 200px;">   
                                        <VTextField   type="text" v-model="seccionA.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA.valor" @input="seccionA.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" />
                                        </div>  

                                        <div v-else-if="seccionA.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div> 

                                        <div  v-else-if="seccionA.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">    
                                       <VSelect v-model="tipoSeccionAnidado2[indexA]" :items="itemsSeccion" label="Tipo de campo" />
                                        </div>
                                       <VBtn @click="agregarSeccionAnidado2(index, indexA)"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <div v-else-if="seccion.tipo == 'Lista'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">
                                       <VSelect v-model="tipoSeccionAnidado2[indexA]" :items="itemsSeccion" label="Tipo de campo" />
                                         </div>
                                       <VBtn @click="agregarSeccionAnidado2(index)"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidado(index, indexA)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                            <!-----------------             OBJETO ANIDADO 2 EN OBJETO       --------------------->

                                       <VCol v-if="seccionA.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA2, indexA2) in seccionesForm[index].valor[indexA].valor" :key="indexA2">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA2.nombre" :label="'Nombre ' + seccionA2.tipo"  :rules = "[requiredValidator]" />
                                       </div>
                                        
                                        <VSwitch
                                                v-if="seccionA2.tipo == 'Boolean'"
												v-model="seccionA2.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA2.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA2.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA2.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA2.valor" @input="seccionA2.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA2.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA2.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <div  v-else-if="seccionA2.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">    
                                       <VSelect v-model="tipoSeccionAnidado3[indexA2]" :items="itemsSeccionNoLista" label="Tipo de campo" />
                                        </div>
                                       <VBtn @click="agregarSeccionAnidado3(index, indexA, indexA2 )"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidado2(index, indexA, indexA2)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        <VCol v-if="seccionA2.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA3, indexA3) in seccionesForm[index].valor[indexA].valor[indexA2].valor" :key="indexA3">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA3.nombre" :label="'Nombre ' + seccionA3.tipo"  :rules = "[requiredValidator]" />
                                       </div>
                                        
                                        <VSwitch
                                                v-if="seccionA3.tipo == 'Boolean'"
												v-model="seccionA3.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA3.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA3.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA3.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA3.valor" @input="seccionA3.valor = parseInt($event.target.value)" label="Valor numero" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA3.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA3.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidado3(index, indexA, indexA2, indexA3)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        </VCol> 
                                        </VCol>   

                                            <!-----------------             LISTA ANIDADO 2 EN OBJETO       --------------------->

                                        <VCol v-if="seccionA.tipo == 'Lista'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA2, indexA2) in seccionesForm[index].valor[indexA].valor" :key="indexA2">
                                                                   
                                        <VSwitch
                                                v-if="seccionA2.tipo == 'Boolean'"
												v-model="seccionA2.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA2.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA2.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA2.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA2.valor" @input="seccionA2.valor = parseInt($event.target.value)" label="Valor numero" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA2.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA2.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <div  v-else-if="seccionA2.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">    
                                       <VSelect v-model="tipoSeccionAnidado3[indexA2]" :items="itemsSeccionNoLista" label="Tipo de campo" />
                                        </div>
                                       <VBtn @click="agregarSeccionAnidado3(index, indexA, indexA2 )"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidado2(index, indexA, indexA2)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        <VCol v-if="seccionA2.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA3, indexA3) in seccionesForm[index].valor[indexA].valor[indexA2].valor" :key="indexA3">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA3.nombre" :label="'Nombre ' + seccionA3.tipo"  :rules = "[requiredValidator]" />
                                       </div>
                                        
                                        <VSwitch
                                                v-if="seccionA3.tipo == 'Boolean'"
												v-model="seccionA3.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA3.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA3.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA3.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA3.valor" @input="seccionA3.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA3.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA3.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidado3(index, indexA, indexA2, indexA3)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        </VCol> 
                                        </VCol>

                                        </VCol>

                                        <!-----------------             LISTA ANIDADO          --------------------->

                                        <VCol v-if="seccion.tipo == 'Lista'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA, indexA) in seccionesForm[index].valor" :key="indexA">                                       
                                        <VSwitch
                                                v-if="seccionA.tipo == 'Boolean'"
												v-model="seccionA.valor"
												density="compact"
												label="Valor"
                                                :rules = "[requiredValidator]"
											/>
                                         <div v-else-if="seccionA.tipo == 'Texto'" style="width: 200px;">   
                                        <VTextField   type="text" v-model="seccionA.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA.valor" @input="seccionA.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" />
                                        </div>  

                                        <div v-else-if="seccionA.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div> 

                                        <div  v-else-if="seccionA.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">    
                                       <VSelect v-model="tipoSeccionAnidado2[indexA]" :items="itemsSeccion" label="Tipo de campo" />
                                        </div>
                                       <VBtn @click="agregarSeccionAnidado2(index, indexA)"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <div v-else-if="seccionA.tipo == 'Lista'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">
                                       <VSelect v-model="tipoSeccionAnidado2[indexA]" :items="itemsSeccion" label="Tipo de campo" />
                                         </div>
                                       <VBtn @click="agregarSeccionAnidado2(index, indexA)"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidado(index, indexA)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                            <!-----------------------     OBJETO ANIDADO 2 EN LISTA   --------------------->

                                       <VCol v-if="seccionA.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA2, indexA2) in seccionesForm[index].valor[indexA].valor" :key="indexA2">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA2.nombre" :label="'Nombre ' + seccionA2.tipo"  :rules = "[requiredValidator]" />
                                       </div>
                                        
                                        <VSwitch
                                                v-if="seccionA2.tipo == 'Boolean'"
												v-model="seccionA2.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA2.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA2.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA2.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA2.valor" @input="seccionA2.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA2.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA2.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <div  v-else-if="seccionA2.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">    
                                       <VSelect v-model="tipoSeccionAnidado3[indexA2]" :items="itemsSeccionNoLista" label="Tipo de campo" />
                                        </div>
                                       <VBtn @click="agregarSeccionAnidado3(index, indexA, indexA2 )"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidado2(index, indexA, indexA2)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        <VCol v-if="seccionA2.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA3, indexA3) in seccionesForm[index].valor[indexA].valor[indexA2].valor" :key="indexA3">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA3.nombre" :label="'Nombre ' + seccionA3.tipo"  :rules = "[requiredValidator]" />
                                       </div>
                                        
                                        <VSwitch
                                                v-if="seccionA3.tipo == 'Boolean'"
												v-model="seccionA3.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA3.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA3.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA3.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA3.valor" @input="seccionA3.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA3.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA3.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidado3(index, indexA, indexA2, indexA3)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        </VCol> 
                                        </VCol>   
                                            <!-----------------------    LISTA ANIDADO 2  EN LISTA   --------------------->
                                        <VCol v-if="seccionA.tipo == 'Lista'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA2, indexA2) in seccionesForm[index].valor[indexA].valor" :key="indexA2">
                                                                
                                        <VSwitch
                                                v-if="seccionA2.tipo == 'Boolean'"
												v-model="seccionA2.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA2.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA2.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA2.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA2.valor" @input="seccionA2.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA2.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA2.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <div  v-else-if="seccionA2.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">    
                                       <VSelect v-model="tipoSeccionAnidado3[indexA2]" :items="itemsSeccionNoLista" label="Tipo de campo" />
                                        </div>
                                       <VBtn @click="agregarSeccionAnidado3(index, indexA, indexA2 )"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidado2(index, indexA, indexA2)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        <VCol v-if="seccionA2.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA3, indexA3) in seccionesForm[index].valor[indexA].valor[indexA2].valor" :key="indexA3">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA3.nombre" :label="'Nombre ' + seccionA3.tipo"  :rules = "[requiredValidator]" />
                                       </div>
                                        
                                        <VSwitch
                                                v-if="seccionA3.tipo == 'Boolean'"
												v-model="seccionA3.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA3.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA3.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA3.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA3.valor" @input="seccionA3.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA3.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA3.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidado3(index, indexA, indexA2, indexA3)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        </VCol> 
                                        </VCol>

                                        </VCol> 
                                        
                                        </VCol>                               
                                                                            
                                                                                
										<!-- 👉 Submit and Cancel -->
										<VCol
											cols="12"
											class="d-flex flex-wrap justify-center gap-4"
										>
											<VBtn type="submit"> Enviar </VBtn>

											<VBtn
												color="secondary"
												variant="tonal"
												@click="onAddConfiguracionValueUpdate(false)"
											>
												Cancelar
											</VBtn>
										</VCol>
									</VRow>
								</VForm>
                                 </VCol>    
                                </VRow>		
							</VCardText>
						</VCard>
					</VDialog>

   <!--------------------       EDIT DIALOG     --------------------->
       
                <VDialog
						:width="$vuetify.display.smAndDown ? 'auto' : 900"
						:model-value="isConfiguracionEditActive"
						@update:model-value="onEditConfiguracionValueUpdate"		
                        persistent
                       no-click-animation				
					>
						<!-- Dialog close btn -->
						<DialogCloseBtn @click="onEditConfiguracionValueUpdate(false)" />

						<VCard class="pa-sm-14 pa-5">
							<VCardItem class="text-center">
								<VCardTitle class="text-h5 mb-3">
									Editar configuración
								</VCardTitle>
							</VCardItem>

							<VCardText>		
                                <VRow >
                                <VCol cols="12">                   			
								<!-- 👉 Form -->
								<VForm
									class="mt-6"
                                    ref="formEdit"
									@submit.prevent="onEditConfiguracionSubmit"
								>
									<VRow class="d-flex flex-wrap justify-center gap-1 ">
										<!-- 👉 Nombre -->
                                       
										<VCol cols="12">	
                                            <span>
                                                <h3>Key</h3>
                                            </span>
                                            <span>
                                                <h4>{{ editConfiguracion.key }}</h4>
                                            </span>										
                                            
										</VCol>                                 
                                        <VCol cols="12">  
                                        <Span><h3>Estructura</h3></Span>     
                                       </VCol>

                                       <VCol cols="12"> 
                                       <div class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">
                                       <VSelect v-model="tipoSeccionEdit" :items="itemsSeccion" label="Tipo de campo" />
                                         </div>
                                       <VBtn @click="agregarSeccionEdit()"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                       </div>
                                       </VCol>
                                       
                                       <VDivider/>
                                         
                                        <VCol cols="12" class="d-flex flex-wrap justify-left gap-2" v-for="(seccion, index) in seccionesFormEdit" :key="index">                                                     
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccion.nombre" :label="'Nombre ' + seccion.tipo"  :rules = "[requiredValidator]" />
                                        </div>
                                        <VSwitch
                                                v-if="seccion.tipo == 'Boolean'"
												v-model="seccion.valor"
												density="compact"
												label="Valor"                                 
											/>
                                         <div v-else-if="seccion.tipo == 'Texto'" style="width: 200px;">   
                                        <VTextField   type="text" v-model="seccion.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccion.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccion.valor" @input="seccion.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" />
                                        </div>  
                                        <div v-else-if="seccion.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccion.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                       <div v-else-if="seccion.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">
                                       <VSelect v-model="tipoSeccionAnidadoEdit[index]" :items="itemsSeccion" label="Tipo de campo" />
                                         </div>
                                       <VBtn @click="agregarSeccionAnidadoEdit(index)"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <div v-else-if="seccion.tipo == 'Lista'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">
                                       <VSelect v-model="tipoSeccionAnidadoEdit[index]" :items="itemsSeccion" label="Tipo de campo" />
                                         </div>
                                       <VBtn @click="agregarSeccionAnidadoEdit(index)"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                       <VBtn color="error" @click="eliminarSeccionEdit(index)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        <!-----------------             OBJETO ANIDADO          --------------------->

                                       <VCol v-if="seccion.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA, indexA) in seccionesFormEdit[index].valor" :key="indexA">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA.nombre" :label="'Nombre ' + seccionA.tipo"  :rules = "[requiredValidator]" />
                                        </div>
                                        <VSwitch
                                                v-if="seccionA.tipo == 'Boolean'"
												v-model="seccionA.valor"
												density="compact"
												label="Valor"
                                                :rules = "[requiredValidator]"
											/>
                                         <div v-else-if="seccionA.tipo == 'Texto'" style="width: 200px;">   
                                        <VTextField   type="text" v-model="seccionA.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA.valor" @input="seccionA.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" />
                                        </div>  

                                        <div v-else-if="seccionA.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div> 

                                        <div  v-else-if="seccionA.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">    
                                       <VSelect v-model="tipoSeccionAnidadoEdit2[indexA]" :items="itemsSeccion" label="Tipo de campo" />
                                        </div>
                                       <VBtn @click="agregarSeccionAnidadoEdit2(index, indexA)"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <div v-else-if="seccion.tipo == 'Lista'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">
                                       <VSelect v-model="tipoSeccionAnidadoEdit2[indexA]" :items="itemsSeccion" label="Tipo de campo" />
                                         </div>
                                       <VBtn @click="agregarSeccionAnidadoEdit2(index)"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidadoEdit(index, indexA)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                            <!-----------------             OBJETO ANIDADO 2 EN OBJETO       --------------------->

                                       <VCol v-if="seccionA.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA2, indexA2) in seccionesFormEdit[index].valor[indexA].valor" :key="indexA2">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA2.nombre" :label="'Nombre ' + seccionA2.tipo"  :rules = "[requiredValidator]" />
                                       </div>
                                        
                                        <VSwitch
                                                v-if="seccionA2.tipo == 'Boolean'"
												v-model="seccionA2.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA2.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA2.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA2.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA2.valor" @input="seccionA2.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA2.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA2.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <div  v-else-if="seccionA2.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">    
                                       <VSelect v-model="tipoSeccionAnidadoEdit3[indexA2]" :items="itemsSeccionNoLista" label="Tipo de campo" />
                                        </div>
                                       <VBtn @click="agregarSeccionAnidadoEdit3(index, indexA, indexA2 )"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidadoEdit2(index, indexA, indexA2)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        <VCol v-if="seccionA2.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA3, indexA3) in seccionesFormEdit[index].valor[indexA].valor[indexA2].valor" :key="indexA3">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA3.nombre" :label="'Nombre ' + seccionA3.tipo"  :rules = "[requiredValidator]" />
                                       </div>
                                        
                                        <VSwitch
                                                v-if="seccionA3.tipo == 'Boolean'"
												v-model="seccionA3.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA3.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA3.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA3.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA3.valor" @input="seccionA3.valor = parseInt($event.target.value)" label="Valor numero" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA3.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA3.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidadoEdit3(index, indexA, indexA2, indexA3)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        </VCol> 
                                        </VCol>   

                                            <!-----------------             LISTA ANIDADO 2 EN OBJETO       --------------------->

                                        <VCol v-if="seccionA.tipo == 'Lista'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA2, indexA2) in seccionesFormEdit[index].valor[indexA].valor" :key="indexA2">
                                                                   
                                        <VSwitch
                                                v-if="seccionA2.tipo == 'Boolean'"
												v-model="seccionA2.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA2.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA2.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA2.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA2.valor" @input="seccionA2.valor = parseInt($event.target.value)" label="Valor numero" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA2.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA2.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <div  v-else-if="seccionA2.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">    
                                       <VSelect v-model="tipoSeccionAnidadoEdit3[indexA2]" :items="itemsSeccionNoLista" label="Tipo de campo" />
                                        </div>
                                       <VBtn @click="agregarSeccionAnidadoEdit3(index, indexA, indexA2 )"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidadoEdit2(index, indexA, indexA2)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        <VCol v-if="seccionA2.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA3, indexA3) in seccionesFormEdit[index].valor[indexA].valor[indexA2].valor" :key="indexA3">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA3.nombre" :label="'Nombre ' + seccionA3.tipo"  :rules = "[requiredValidator]" />
                                       </div>
                                        
                                        <VSwitch
                                                v-if="seccionA3.tipo == 'Boolean'"
												v-model="seccionA3.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA3.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA3.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA3.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA3.valor" @input="seccionA3.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA3.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA3.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidadoEdit3(index, indexA, indexA2, indexA3)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        </VCol> 
                                        </VCol>

                                        </VCol>

                                        <!-----------------             LISTA ANIDADO          --------------------->

                                        <VCol v-if="seccion.tipo == 'Lista'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA, indexA) in seccionesFormEdit[index].valor" :key="indexA">                                       
                                        <VSwitch
                                                v-if="seccionA.tipo == 'Boolean'"
												v-model="seccionA.valor"
												density="compact"
												label="Valor"
                                                :rules = "[requiredValidator]"
											/>
                                         <div v-else-if="seccionA.tipo == 'Texto'" style="width: 200px;">   
                                        <VTextField   type="text" v-model="seccionA.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA.valor" @input="seccionA.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" />
                                        </div>  

                                        <div v-else-if="seccionA.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div> 

                                        <div  v-else-if="seccionA.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">    
                                       <VSelect v-model="tipoSeccionAnidadoEdit2[indexA]" :items="itemsSeccion" label="Tipo de campo" />
                                        </div>
                                       <VBtn @click="agregarSeccionAnidadoEdit2(index, indexA)"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <div v-else-if="seccionA.tipo == 'Lista'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">
                                       <VSelect v-model="tipoSeccionAnidadoEdit2[indexA]" :items="itemsSeccion" label="Tipo de campo" />
                                         </div>
                                       <VBtn @click="agregarSeccionAnidadoEdit2(index, indexA)"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidadoEdit(index, indexA)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                            <!-----------------------     OBJETO ANIDADO 2 EN LISTA   --------------------->

                                       <VCol v-if="seccionA.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA2, indexA2) in seccionesFormEdit[index].valor[indexA].valor" :key="indexA2">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA2.nombre" :label="'Nombre ' + seccionA2.tipo"  :rules = "[requiredValidator]" />
                                       </div>
                                        
                                        <VSwitch
                                                v-if="seccionA2.tipo == 'Boolean'"
												v-model="seccionA2.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA2.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA2.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA2.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA2.valor" @input="seccionA2.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA2.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA2.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <div  v-else-if="seccionA2.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">    
                                       <VSelect v-model="tipoSeccionAnidadoEdit3[indexA2]" :items="itemsSeccionNoLista" label="Tipo de campo" />
                                        </div>
                                       <VBtn @click="agregarSeccionAnidadoEdit3(index, indexA, indexA2 )"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidadoEdit2(index, indexA, indexA2)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        <VCol v-if="seccionA2.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA3, indexA3) in seccionesFormEdit[index].valor[indexA].valor[indexA2].valor" :key="indexA3">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA3.nombre" :label="'Nombre ' + seccionA3.tipo"  :rules = "[requiredValidator]" />
                                       </div>
                                        
                                        <VSwitch
                                                v-if="seccionA3.tipo == 'Boolean'"
												v-model="seccionA3.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA3.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA3.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA3.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA3.valor" @input="seccionA3.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA3.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA3.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidadoEdit3(index, indexA, indexA2, indexA3)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        </VCol> 
                                        </VCol>   
                                            <!-----------------------    LISTA ANIDADO 2  EN LISTA   --------------------->
                                        <VCol v-if="seccionA.tipo == 'Lista'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA2, indexA2) in seccionesFormEdit[index].valor[indexA].valor" :key="indexA2">
                                                                
                                        <VSwitch
                                                v-if="seccionA2.tipo == 'Boolean'"
												v-model="seccionA2.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA2.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA2.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA2.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA2.valor" @input="seccionA2.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA2.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA2.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <div  v-else-if="seccionA2.tipo == 'Objeto'" class="d-flex flex-wrap justify-left gap-4 ">     
                                        <div style="width: 200px;">    
                                       <VSelect v-model="tipoSeccionAnidadoEdit3[indexA2]" :items="itemsSeccionNoLista" label="Tipo de campo" />
                                        </div>
                                       <VBtn @click="agregarSeccionAnidadoEdit3(index, indexA, indexA2 )"><VIcon icon="tabler-plus"></VIcon></VBtn>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidadoEdit2(index, indexA, indexA2)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        <VCol v-if="seccionA2.tipo == 'Objeto'" cols="12" style="margin-left: 1rem;" class="d-flex flex-wrap justify-left gap-2" v-for="(seccionA3, indexA3) in seccionesFormEdit[index].valor[indexA].valor[indexA2].valor" :key="indexA3">
                                        <div style="width: 200px;">
                                        <VTextField v-model="seccionA3.nombre" :label="'Nombre ' + seccionA3.tipo"  :rules = "[requiredValidator]" />
                                       </div>
                                        
                                        <VSwitch
                                                v-if="seccionA3.tipo == 'Boolean'"
												v-model="seccionA3.valor"
												density="compact"
												label="Valor"
                                                
											/>

                                        <div v-else-if="seccionA3.tipo == 'Texto'" style="width: 200px;">    
                                        <VTextField   type="text" v-model="seccionA3.valor" label="Valor texto" :rules = "[requiredValidator]"  />
                                        </div>
                                        <div v-else-if="seccionA3.tipo == 'Número'" style="width: 200px;">
                                        <VTextField   type="number" :value="seccionA3.valor" @input="seccionA3.valor = parseInt($event.target.value)" label="Valor número" :rules = "[requiredValidator]" /> 
                                        </div> 
                                        <div v-else-if="seccionA3.tipo == 'Fecha'" class="date-picker-wrapper" style="width: 200px;">
                                        <AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="seccionA3.valor"
                                            show-current=true :config="{
                                            position: 'auto right',                  
                                            altFormat: 'F j, Y',
                                            dateFormat: 'd-m-Y',
                                            maxDate: new Date(),
                                            reactive: true
                                            }" :rules = "[requiredValidator]"/>
                                        </div>

                                        <VBtn color="error" @click="eliminarSeccionAnidadoEdit3(index, indexA, indexA2, indexA3)"><VIcon icon="tabler-trash"></VIcon></VBtn>

                                        </VCol> 
                                        </VCol>

                                        </VCol> 
                                        
                                        </VCol>                               
                                                                            
                                                                                
										<!-- 👉 Submit and Cancel -->
										<VCol
											cols="12"
											class="d-flex flex-wrap justify-center gap-4"
										>
											<VBtn type="submit"> Enviar </VBtn>

											<VBtn
												color="secondary"
												variant="tonal"
												@click="onEditConfiguracionValueUpdate(false)"
											>
												Cancelar
											</VBtn>
										</VCol>
									</VRow>
								</VForm>
                                 </VCol>    
                                </VRow>		
							</VCardText>
						</VCard>
					</VDialog>


				</VCard>
			</VCol>
		</VRow>
	
	</section>
</template>
<style lang="scss">
.flatpickr-calendar.open {
    z-index: 100000;
}
</style>
