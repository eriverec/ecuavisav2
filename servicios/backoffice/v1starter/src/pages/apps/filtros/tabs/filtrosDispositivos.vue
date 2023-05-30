<script setup>
import { onMounted } from 'vue';

const isLoading = ref(true);
const filtrosDispositivos = ref([]);
const updateDispositivos = ref({});
const newDispositivos = ref({});
const deleteShowDispositivo = ref({});
const isDispositivosEditVisible = ref(false);
const isDispositivosAddVisible = ref(false);
const isDispositivoDeleteConfirmVisible = ref(false);
const isNameUsed = ref(false);
const noData = ref(false);


const itemActividad = [
            {
            title: "Por sesión",
            value: "sesion",
            },
            {
            title: "Por páginas vistas",
            value: "visita",
         }
];
const  itemDispositivos = [
            {
            title: "Movil",
            value: "movil",
            },
            {
            title: "Desktop",
            value: "desktop",
            }
];
const itemOs = [
            {
            title: "Windows",
            value: "Windows",
            },
            {
            title: "Mac OS",
            value: "Mac OS",
            },
            {
            title: "Linux",
            value: "Linux",
            },
            {
            title: "Android",
            value: "Android",
            },  
            {
            title: "Todos",
            value: "todos",
            }   
                       
];
const itemBrowser = [
            {
            title: "Chrome",
            value: "Chrome",
            },
            {
            title: "Safari",
            value: "Safari",
            },
            {
            title: "Firefox",
            value: "Firefox",
            },
            {
            title: "Todos",
            value: "todos",
            }               
];

async function fetchDispositivos (){
    isLoading.value = true;
    await fetch('https://servicio-filtros.vercel.app/dispositivos/grafico/all')
    .then(response => response.json())
    .then(data => {
        filtrosDispositivos.value = Array.from(data);
        isLoading.value = false;
    })
    .catch(error => {return error});
}



onMounted(fetchDispositivos);

// ------------------------------- add

async function onFormAddDispositivosActive  (){
	isDispositivosAddVisible.value = true;     
};

async function onFormAddDispositivosSubmit  (){
    isNameUsed.value = false;
    noData.value = false;
    let array = Array.from(filtrosDispositivos.value);
 
    let check = array.filter(a => a.isDefault === true );
    
    if(check.length && newDispositivos.value.isDefault === true){
        let bool = JSON.stringify({
            "id": check[0]._id,
            "isDefault": false
        });
        await fetch('https://servicio-filtros.vercel.app/dispositivos/grafico/update' ,
          {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
            },
            body: bool
          })
        
        .catch(error => {return error}); 
    }
    let tipo = 'chartDispositivos';   
    let raw = JSON.stringify({
        "nombre": newDispositivos.value.nombre,
        "tipo": tipo,
        "device": newDispositivos.value.device,
        "browser": newDispositivos.value.browser,
        "os": newDispositivos.value.os,
        "actividad": newDispositivos.value.actividad,
        "fecha": newDispositivos.value.fecha,
        "isDefault": newDispositivos.value.isDefault
    });

    await fetch('https://servicio-filtros.vercel.app/dispositivos/grafico/add' ,
          {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: raw
          })
        .then(response => response.json())
        .then(response =>{  
                
            if(response == "El filtro ya existe"){
                isNameUsed.value = true;
                return false;
            }else if(response == "Faltan datos"){
                noData.value = true;
                return false;
            }
            else{
            isDispositivosAddVisible.value = false; 
            noData.value = false; 
            isNameUsed.value = false;
            fetchDispositivos();
            return true;
        }
            
        })
        .catch(error => {return error}); 
      
}

const onFormDispositivosAddReset = () => {
  newDispositivos.value = {};
	isDispositivosAddVisible.value = false;	
};

const dialogDispositivosAddValueUpdate = (val) => {
	if(val === false){
		newDispositivos.value = {}; 
	}
	isDispositivosAddVisible.value = val;
};

// ------------------------------- edit

const nombreOld = ref('');

async function onFormEditDispositivosActive  (id){
		//let index =  categorias.value.map((e) => e.id).indexOf(id);  	
	await fetch('https://servicio-filtros.vercel.app/dispositivos/grafico/id?' + new URLSearchParams({ id: id }))
        .then(response => response.json())
        .then(data => {
        updateDispositivos.value = data;  
        nombreOld.value = data.nombre;      
    })
    .catch(error => {return error}); 
	isDispositivosEditVisible.value = true;
     
};

async function onFormDispositivosSubmit  (id){
    isNameUsed.value = false;
    let array = Array.from(filtrosDispositivos.value);
 
    let check = array.filter(a => a.isDefault === true );
    
    if(check.length && updateDispositivos.value.isDefault === true){
        let bool = JSON.stringify({
            "id": check[0]._id,
            "isDefault": false
        });
        await fetch('https://servicio-filtros.vercel.app/dispositivos/grafico/update' ,
          {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
            },
            body: bool
          })
        
        .catch(error => {return error}); 
    }
    
    let raw;
    
    if(updateDispositivos.value.nombre == nombreOld.value){
        raw = JSON.stringify({
        "id": id,      
        "device": updateDispositivos.value.device,
        "browser": updateDispositivos.value.browser,
        "os": updateDispositivos.value.os,
        "actividad": updateDispositivos.value.actividad,
        "fecha": updateDispositivos.value.fecha,
        "isDefault": updateDispositivos.value.isDefault
    });
    }else{
        raw = JSON.stringify({
        "id": id,
        "nombre": updateDispositivos.value.nombre,        
        "device": updateDispositivos.value.device,
        "browser": updateDispositivos.value.browser,
        "os": updateDispositivos.value.os,
        "actividad": updateDispositivos.value.actividad,
        "fecha": updateDispositivos.value.fecha,
        "isDefault": updateDispositivos.value.isDefault
    });}

    await fetch('https://servicio-filtros.vercel.app/dispositivos/grafico/update' ,
          {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
            },
            body: raw
          })
        .then(response => response.json())
        .then(response =>{       
            if(response == "El nombre del filtro ya existe"){
                
                isNameUsed.value = true;
                return false;
            }else{
            isDispositivosEditVisible.value = false; 
            isNameUsed.value = false; 
            fetchDispositivos();
            return true;
        }
            
        })
        .catch(error => {return error}); 
      
}

const onFormDispositivosEditReset = () => {
    updateDispositivos.value = {};
	isDispositivosEditVisible.value = false;	
};

const dialogDispositivosEditValueUpdate = (val) => {
	if(val === false){
		updateDispositivos.value = {}; 
	}
	isDispositivosEditVisible.value = val;
};

//  ------------- DELETE 
async function onConfirmDispositivoDeleteActive (id){
  isDispositivoDeleteConfirmVisible.value = true;

  await fetch('https://servicio-filtros.vercel.app/dispositivos/grafico/id?' + new URLSearchParams({ id: id }))
        .then(response => response.json())
        .then(data => {
        deleteShowDispositivo.value = data;        
    })
    .catch(error => {return error}); 
}

async function onFormDispositivosDeleteSend  (){
  
  let id = deleteShowDispositivo.value._id;

  var requestOptions = {
  method: 'DELETE',
  redirect: 'follow'
  };

  await fetch('https://servicio-filtros.vercel.app/dispositivos/grafico/delete?' + new URLSearchParams({ id: id }),requestOptions)
        .then(response => response.json())
        .then(data => {
        isDispositivoDeleteConfirmVisible.value = false;  
        deleteShowDispositivo.value = {};  
        fetchDispositivos();  
        return true;             
    })
    .catch(error => {return error}); 
  
}

const dialogDispositivosDeleteValueUpdate = (val) => {
	if(val === false){
		deleteShowDispositivo.value = {}; 
	}
	isDispositivoDeleteConfirmVisible.value = val;
};

const onFormDispositivosDeleteReset = () => {
  deleteShowDispositivo.value = {};
	isDispositivoDeleteConfirmVisible.value = false;	
};
</script>

<template>
 <VCardText>
            <VSnackbar
      v-model="isNameUsed"
      color="error"
      transition="scale-transition"
      location="top center"
    >
      El nombre del filtro ya está en uso.
    </VSnackbar>
    <VSnackbar
      v-model="noData"
      color="error"
      transition="scale-transition"
      location="top center"
    >
      Porfavor ingresar todos los datos.
    </VSnackbar>
            <div class="d-flex align-center flex-wrap gap-2">    
            <VCardTitle>Filtros de dispositivos</VCardTitle>  
            <VBtn prepend-icon="tabler-plus" @click="onFormAddDispositivosActive">
                Añadir filtro
            </VBtn>
             
            </div>
        </VCardText> 
        <VCardText v-if="isLoading">Cargando datos...</VCardText>
        <VCardText  v-else>
          <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Dispositivo</th>
                <th scope="col">Browser</th>
                <th scope="col">Os</th>
                <th scope="col">Actividad</th>
                <th scope="col">Fecha</th>
                <th scope="col">Default</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item  in filtrosDispositivos" >
                <td >
                   {{ item.nombre}} 
                </td>
                <td >
                  {{ item.device }}
                </td>
                <td >
                  {{ item.browser }}
                </td>
                <td >
                  {{ item.os }}
                </td>
                <td >
                  {{ item.actividad }}
                </td>
                <td >
                  {{ item.fecha }}
                </td>
                <td >
                <VChip :color="item.isDefault == true ? 'success' : 'warning' " class="mr-4" >{{ item.isDefault == true ? 'Default' : 'No default'}} </VChip>
                </td>
                
                <td class="text-center" style="width: 5rem">
                 <VBtn icon size="x-small" color="default" variant="text" @click="onFormEditDispositivosActive(item._id)">
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>
                  <VBtn icon size="x-small" color="default" variant="text" @click="onConfirmDispositivoDeleteActive(item._id)">
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>

                  
                </td>
              </tr>
            </tbody>
          </VTable>
          <VDialog
             persistent
             no-click-animation
						:width="$vuetify.display.smAndDown ? 'auto' : 700"
						:model-value="isDispositivosEditVisible"
						@update:model-value="dialogDispositivosEditValueUpdate"
					>
						<!-- Dialog close btn -->
						<DialogCloseBtn @click="dialogDispositivosEditValueUpdate(false)" />

						<VCard class="pa-sm-14 pa-5">
							<VCardItem class="text-center">
								<VCardTitle class="text-h5 mb-3">
									Editar el filtro
								</VCardTitle>
							</VCardItem>

							<VCardText>
						
								<!-- 👉 Form -->
								<VForm
									class="mt-6"
									@submit.prevent="onFormDispositivosSubmit(updateDispositivos._id)"
								>
									<VRow class="d-flex flex-wrap justify-center gap-4">
                                        <VRow>
										<!-- 👉 Nombre -->
										<VCol cols="6" >
											<VTextField
												v-model="updateDispositivos.nombre"
												label="Nombre"
											/>
										</VCol>

										<VCol cols="6">
											<VSelect
												v-model="updateDispositivos.device"
												label="Dispositivo"
                                                :items = "itemDispositivos"
											/>
										</VCol>
                                        <VCol cols="6" >
											<VSelect
												v-model="updateDispositivos.browser"
												label="Browser"
                                                :items = "itemBrowser"
											/>
										</VCol>
                                        <VCol cols="6" >
											<VSelect
												v-model="updateDispositivos.os"
												label="Os"
                                                :items = "itemOs"
											/>
										</VCol>
                    <VCol cols="6">
											<VSelect
												v-model="updateDispositivos.actividad"
												label="Actividad"
                                                :items = "itemActividad"
											/>
										</VCol>
                                        
                                        
                    <VCol cols="6">
                       
                        <AppDateTimePicker
                        label="Fecha"
                        prepend-inner-icon="tabler-calendar"
                        density="compact"
                        :default-value="new Date()"
                        v-model="updateDispositivos.fecha"
                        show-current= true
                        @on-change=""
                        :config="{                           
                          mode:'range',
                          altFormat: 'F j, Y',
                          dateFormat: 'm-d-Y',
                          maxDate: new Date(),
                          reactive :true
                          
                        }"
                        />
                     
                    </VCol>
                    <VCol cols="6" >
											<VSwitch
												v-model="updateDispositivos.isDefault"
												density="compact"
												label="Default"
											/>
										</VCol>                     
                                    </VRow>
										<!-- 👉 Submit and Cancel -->
										<VCol
											cols="12"
											class="d-flex flex-wrap justify-center gap-4"
										>
											<VBtn type="submit"> Enviar </VBtn>

											<VBtn
												color="secondary"
												variant="tonal"
												@click="onFormDispositivosEditReset"
											>
												Cancelar
											</VBtn>
										</VCol>
									</VRow>
								</VForm>
							</VCardText>
						</VCard>
					</VDialog>
          <!--           ADD             -->
          <VDialog
              persistent
             no-click-animation
						:width="$vuetify.display.smAndDown ? 'auto' : 700"
						:model-value="isDispositivosAddVisible"
						@update:model-value="dialogDispositivosAddValueUpdate"
					>
						<!-- Dialog close btn -->
						<DialogCloseBtn @click="dialogDispositivosAddValueUpdate(false)" />

						<VCard class="pa-sm-14 pa-5">
							<VCardItem class="text-center">
								<VCardTitle class="text-h5 mb-3">
									Añadir un filtro
								</VCardTitle>
							</VCardItem>

							<VCardText>
						
								<!-- 👉 Form -->
								<VForm
									class="mt-6"
									@submit.prevent="onFormAddDispositivosSubmit()"
								>
									<VRow class="d-flex flex-wrap justify-center gap-4">
                                        <VRow>
										<!-- 👉 Nombre -->
										<VCol cols="6" >
											<VTextField
												v-model="newDispositivos.nombre"
												label="Nombre"
											/>
										</VCol>

										<VCol cols="6">
											<VSelect
												v-model="newDispositivos.device"
												label="Dispositivo"
                                                :items = "itemDispositivos"
											/>
										</VCol>
                                        <VCol cols="6" >
											<VSelect
												v-model="newDispositivos.browser"
												label="Browser"
                                                :items = "itemBrowser"
											/>
										</VCol>
                                        <VCol cols="6" >
											<VSelect
												v-model="newDispositivos.os"
												label="Os"
                                                :items = "itemOs"
											/>
										</VCol>
                    <VCol cols="6">
											<VSelect
												v-model="newDispositivos.actividad"
												label="Actividad"
                                                :items = "itemActividad"
											/>
										</VCol>
                                                             
                    <VCol cols="6">
                       
                       <AppDateTimePicker
                       label="Fecha"
                       prepend-inner-icon="tabler-calendar"
                       density="compact"
                       :default-value="new Date()"
                       v-model="newDispositivos.fecha"
                       show-current= true
                       @on-change=""
                       :config="{                           
                         mode:'range',
                         altFormat: 'F j, Y',
                         dateFormat: 'm-d-Y',
                         maxDate: new Date(),
                         reactive :true
                         
                       }"
                       />
                    
                   </VCol>
                   <VCol cols="6" >
											<VSwitch
												v-model="newDispositivos.isDefault"
												density="compact"
												label="Default"
											/>
										</VCol>
                                        
                                    </VRow>
										<!-- 👉 Submit and Cancel -->
										<VCol
											cols="12"
											class="d-flex flex-wrap justify-center gap-4"
										>
											<VBtn type="submit"> Enviar </VBtn>

											<VBtn
												color="secondary"
												variant="tonal"
												@click="onFormDispositivosAddReset"
											>
												Cancelar
											</VBtn>
										</VCol>
									</VRow>
								</VForm>
							</VCardText>
						</VCard>
					</VDialog>

          <VDialog
             persistent
             no-click-animation
						:width="$vuetify.display.smAndDown ? 'auto' : 600"
						:model-value="isDispositivoDeleteConfirmVisible"
						@update:model-value="dialogDispositivosDeleteValueUpdate"
					>
						<!-- Dialog close btn -->
						<DialogCloseBtn @click="dialogDispositivosDeleteValueUpdate(false)" />

						<VCard class="pa-sm-14 pa-5">
							<VCardItem class="text-center">
								<VCardTitle class="text-h5 mb-3 p-5">
									<span>¿ Está seguro que desea eliminar</span><br>
                  <span>el filtro <i>{{ deleteShowDispositivo.nombre }}</i> ?</span>
								</VCardTitle>
							</VCardItem>
              <VCardItem >
                <VCol
											cols="12"
											class="d-flex flex-wrap justify-center gap-4"
										>
                <VBtn color="error"
											
											@click="onFormDispositivosDeleteSend"
                      > 
                      Aceptar 
                </VBtn>

								<VBtn
												
												
												@click="onFormDispositivosDeleteReset"
											>
												Cancelar
								</VBtn>
              </VCol>
              </VCardItem>

						</VCard>
					</VDialog>

        </VCardText>
</template>
<style lang="scss">
.flatpickr-calendar.open {
    z-index: 100000;
}
</style>

