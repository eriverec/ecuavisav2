<script setup>
import { onMounted } from 'vue';

const isLoading = ref(true);
const updateVisitas = ref({});
const newVisitas = ref({});
const deleteShowVisitas = ref({});
const isVisitasEditVisible = ref(false);
const isVisitasAddVisible = ref(false);
const isVisitasDeleteConfirmVisible = ref(false);
const filtrosVisitas = ref([]);
const isNameUsed = ref(false);
const noData = ref(false);

async function fetchVisitas (){
    isLoading.value = true;
    await fetch('https://servicio-filtros.vercel.app/visitas/all')
    .then(response => response.json())
    .then(data => {
        filtrosVisitas.value = Array.from(data);
        isLoading.value = false;
    })
    .catch(error => {return error});
}


onMounted(fetchVisitas);

// ------------------------------- add

async function onFormAddVisitasActive  (){
	isVisitasAddVisible.value = true;     
};

async function onFormAddVisitasSubmit  (){
    isNameUsed.value = false;
    noData.value = false;
    let array = Array.from(filtrosVisitas.value);
 
    let check = array.filter(a => a.isDefault === true );
    console.log('data a enviar',newVisitas.value);
    if(check.length && newVisitas.value.isDefault === true){
        let bool = JSON.stringify({
            "id": check[0]._id,
            "isDefault": false
        });
        await fetch('https://servicio-filtros.vercel.app/visitas/update' ,
          {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
            },
            body: bool
          })
        
        .catch(error => {return error}); 
    }
    let tipo = 'visitas';   
    let raw = JSON.stringify({
        "nombre": newVisitas.value.nombre,
        "tipo": tipo,
        "device": newVisitas.value.device,
        "browser": newVisitas.value.browser,
        "os": newVisitas.value.os,
        "actividad": newVisitas.value.actividad,
        "fecha": newVisitas.value.fecha,
        "isDefault": newVisitas.value.isDefault
    });

    await fetch('https://servicio-filtros.vercel.app/visitas/add' ,
          {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: raw
          })
        .then(response => response.json())
        .then(response =>{  
            console.log(response);     
            if(response == "El filtro ya existe"){
                isNameUsed.value = true;
                return false;
            }else if(response == "Faltan datos"){
                noData.value = true;
                return false;
            }
            else{
            isVisitasAddVisible.value = false; 
            noData.value = false; 
            isNameUsed.value = false;
            fetchVisitas();
            return true;
        }
            
        })
        .catch(error => {return error}); 
      
}

const onFormVisitasAddReset = () => {
  newVisitas.value = {};
	isVisitasAddVisible.value = false;	
};

const dialogVisitasAddValueUpdate = (val) => {
	if(val === false){
		newVisitas.value = {}; 
	}
	isVisitasAddVisible.value = val;
};

// ------------------------------- edit

const nombreOld = ref('');

async function onFormEditVisitasActive  (id){
		//let index =  categorias.value.map((e) => e.id).indexOf(id);  	
	await fetch('https://servicio-filtros.vercel.app/visitas/id?' + new URLSearchParams({ id: id }))
        .then(response => response.json())
        .then(data => {
        updateVisitas.value = data;  
        nombreOld.value = data.nombre;      
    })
    .catch(error => {return error}); 
	isVisitasEditVisible.value = true;
     
};

async function onFormVisitasSubmit  (id){
    isNameUsed.value = false;
    let array = Array.from(filtrosVisitas.value);
 
    let check = array.filter(a => a.isDefault === true );
    
    if(check.length && updateVisitas.value.isDefault === true){
        let bool = JSON.stringify({
            "id": check[0]._id,
            "isDefault": false
        });
        await fetch('https://servicio-filtros.vercel.app/visitas/update' ,
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
    
    if(updateVisitas.value.nombre == nombreOld.value){
        raw = JSON.stringify({
        "id": id,      
        "device": updateVisitas.value.device,
        "browser": updateVisitas.value.browser,
        "os": updateVisitas.value.os,
        "actividad": updateVisitas.value.actividad,
        "fecha": updateVisitas.value.fecha,
        "isDefault": updateVisitas.value.isDefault
    });
    }else{
        raw = JSON.stringify({
        "id": id,
        "nombre": updateVisitas.value.nombre,        
        "device": updateVisitas.value.device,
        "browser": updateVisitas.value.browser,
        "os": updateVisitas.value.os,
        "actividad": updateVisitas.value.actividad,
        "fecha": updateVisitas.value.fecha,
        "isDefault": updateVisitas.value.isDefault
    });}

    await fetch('https://servicio-filtros.vercel.app/visitas/update' ,
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
            isVisitasEditVisible.value = false; 
            isNameUsed.value = false; 
            fetchVisitas();
            return true;
        }
            
        })
        .catch(error => {return error}); 
      
}

const onFormVisitasEditReset = () => {
    updateVisitas.value = {};
	isVisitasEditVisible.value = false;	
};

const dialogVisitasEditValueUpdate = (val) => {
	if(val === false){
		updateVisitas.value = {}; 
	}
	isVisitasEditVisible.value = val;
};

//  ------------- DELETE 
async function onConfirmVisitasDeleteActive (id){
  isVisitasDeleteConfirmVisible.value = true;

  await fetch('https://servicio-filtros.vercel.app/visitas/id?' + new URLSearchParams({ id: id }))
        .then(response => response.json())
        .then(data => {
        deleteShowVisitas.value = data;        
    })
    .catch(error => {return error}); 
}

async function onFormVisitasDeleteSend  (){
  console.log('nombre a eliminar',deleteShowVisitas.value.nombre);
  let id = deleteShowVisitas.value._id;

  var requestOptions = {
  method: 'DELETE',
  redirect: 'follow'
  };

  await fetch('https://servicio-filtros.vercel.app/visitas/delete?' + new URLSearchParams({ id: id }),requestOptions)
        .then(response => response.json())
        .then(data => {
        isVisitasDeleteConfirmVisible.value = false;  
        deleteShowVisitas.value = {};  
        fetchVisitas();  
        return true;             
    })
    .catch(error => {return error}); 
  
}

const dialogVisitasDeleteValueUpdate = (val) => {
	if(val === false){
		deleteShowVisitas.value = {}; 
	}
	isVisitasDeleteConfirmVisible.value = val;
};

const onFormVisitasDeleteReset = () => {
  deleteShowVisitas.value = {};
	isVisitasDeleteConfirmVisible.value = false;	
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
            <VCardTitle>Filtros de Visitas</VCardTitle>  
            <VBtn prepend-icon="tabler-plus" @click="onFormAddVisitasActive">
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
                <th scope="col">Fecha</th>
                <th scope="col">Default</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item  in filtrosVisitas" >
                <td >
                   {{ item.nombre}} 
                </td>
                <td >
                  {{ item.fecha }}
                </td>
                <td >
                <VChip :color="item.isDefault == true ? 'success' : 'warning' " class="mr-4" >{{ item.isDefault == true ? 'Default' : 'No default'}} </VChip>
                </td>
                
                <td class="text-center" style="width: 5rem">
                 <VBtn icon size="x-small" color="default" variant="text" @click="onFormEditVisitasActive(item._id)">
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>
                  <VBtn icon size="x-small" color="default" variant="text" @click="onConfirmVisitasDeleteActive(item._id)">
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
						:model-value="isVisitasEditVisible"
						@update:model-value="dialogVisitasEditValueUpdate"
					>
						<!-- Dialog close btn -->
						<DialogCloseBtn @click="dialogVisitasEditValueUpdate(false)" />

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
									@submit.prevent="onFormVisitasSubmit(updateVisitas._id)"
								>
									<VRow class="d-flex flex-wrap justify-center gap-4">
                                        <VRow>
										<!-- 👉 Nombre -->
										<VCol cols="6" >
											<VTextField
												v-model="updateVisitas.nombre"
												label="Nombre"
											/>
										</VCol>
                                 
                    <VCol cols="6">
                       
                        <AppDateTimePicker
                        label="Fecha"
                        prepend-inner-icon="tabler-calendar"
                        density="compact"
                        :default-value="new Date()"
                        v-model="updateVisitas.fecha"
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
												v-model="updateVisitas.isDefault"
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
												@click="onFormVisitasEditReset"
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
						:model-value="isVisitasAddVisible"
						@update:model-value="dialogVisitasAddValueUpdate"
					>
						<!-- Dialog close btn -->
						<DialogCloseBtn @click="dialogVisitasAddValueUpdate(false)" />

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
									@submit.prevent="onFormAddVisitasSubmit()"
								>
									<VRow class="d-flex flex-wrap justify-center gap-4">
                                        <VRow>
										<!-- 👉 Nombre -->
										<VCol cols="6" >
											<VTextField
												v-model="newVisitas.nombre"
												label="Nombre"
											/>
										</VCol>
								     
                    <VCol cols="6">
                       
                       <AppDateTimePicker
                       label="Fecha"
                       prepend-inner-icon="tabler-calendar"
                       density="compact"
                       :default-value="new Date()"
                       v-model="newVisitas.fecha"
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
												v-model="newVisitas.isDefault"
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
												@click="onFormVisitasAddReset"
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
						:model-value="isVisitasDeleteConfirmVisible"
						@update:model-value="dialogVisitasDeleteValueUpdate"
					>
						<!-- Dialog close btn -->
						<DialogCloseBtn @click="dialogVisitasDeleteValueUpdate(false)" />

						<VCard class="pa-sm-14 pa-5">
							<VCardItem class="text-center">
								<VCardTitle class="text-h5 mb-3 p-5">
									<span>¿ Está seguro que desea eliminar</span><br>
                  <span>el filtro <i>{{ deleteShowVisitas.nombre }}</i> ?</span>
								</VCardTitle>
							</VCardItem>
              <VCardItem >
                <VCol
											cols="12"
											class="d-flex flex-wrap justify-center gap-4"
										>
                <VBtn color="error"
											
											@click="onFormVisitasDeleteSend"
                      > 
                      Aceptar 
                </VBtn>

								<VBtn
												
												
												@click="onFormVisitasDeleteReset"
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

