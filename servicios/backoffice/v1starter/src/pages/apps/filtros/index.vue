<script setup>
import { onMounted } from 'vue';

const isLoading = ref(true);
const currentTab = ref('tab-chartDispositivos')
const filtrosDispositivos = ref([]);
const updateDispositivos = ref({});
const isDispositivosEditVisible = ref(false);
const filtrosVisitas = ref([]);
const isNameUsed = ref(false);
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

const fetchData = () =>{
    if(currentTab.value == 'tab-chartDispositivos'){
        fetchDispositivos();
    }
    if(currentTab.value == 'tab-visitas'){
        fetchVisitas();
    }
}

onMounted(fetchData);

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
        
        "tipo": updateDispositivos.value.tipo,
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
        "tipo": updateDispositivos.value.tipo,
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
            fetchData();
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
</script>

<template>
  <section>
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">

        <VTabs v-model="currentTab" class="v-tabs-pill">
          <VTab value="tab-chartDispositivos">Dispositivos</VTab>
          <VTab value="tab-visitas">Visitas</VTab>
          <!-- <VTab>Tab Three</VTab> -->
        </VTabs>
        <VSnackbar
      v-model="isNameUsed"
      color="error"
      transition="scale-transition"
      location="top center"
    >
      El nombre del filtro ya está en uso.
    </VSnackbar>
        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-chartDispositivos">
          <VCardText>
            <div class="d-flex align-center flex-wrap gap-2">    
            <VCardTitle>Filtros de dispositivos</VCardTitle>  
            <VBtn prepend-icon="tabler-plus" @click="">
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
                  <VBtn icon size="x-small" color="default" variant="text" >
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>

                  
                </td>
              </tr>
            </tbody>
          </VTable>
          <VDialog
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
                                        <VCol cols="6" >
											<VSwitch
												v-model="updateDispositivos.isDefault"
												density="compact"
												label="Default"
											/>
										</VCol>
                                        <VCol cols="6">
											<VSelect
												v-model="updateDispositivos.actividad"
												label="Actividad"
                                                :items = "itemActividad"
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

        </VCardText>
                  
             

        
                  
                  <VList lines="two" >
                    <template  v-for="(title, index) in datos" :key="index" >
                      <VListItem border>
                    

                        <VListItemTitle>
                          <span>{{ title.title }}</span>
                        </VListItemTitle>
                        <VListItemSubtitle class="mt-1" color="info">
                          <span class="text-xs text-disabled">Item N° {{ index + 1 }}: {{ title.description }}</span>
                        </VListItemSubtitle>
                        <template #append>
                          <VChip :color="title.estado == true ? 'success' : 'warning'" class="mr-4" >{{ title.estado == true ? 'Activo' : 'Inactivo' }} </VChip>
                          <VChip :color="default" class="mr-4" >{{ title.users_suscribed }} Suscrito(s) </VChip>
                          <!-- <VBtn size="small" href="/apps/user/view/"> Ver usuario </VBtn> -->
                          <RouterLink :to="{ name: 'apps-sugerencias-slug-id',  params: { id: title._id }, }" class="font-weight-medium user-list-name" >
                            <VBtn  variant="text" rounded="pill">
                              <VIcon icon="mdi-pencil" /> 
                            </VBtn>
                          </RouterLink>
                        </template>
                      </VListItem>
                    </template>
                  </VList>
                
           
              </VWindowItem>

              <VWindowItem value="tab-agregar">
                
                



              </VWindowItem>

             
            </VWindow>
          </VCardText>
        </VCard>

      </VCol>
    </VRow>
  </section>
</template>

