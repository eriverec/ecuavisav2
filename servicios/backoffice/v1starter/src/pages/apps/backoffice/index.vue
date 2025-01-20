<script setup>
import { onMounted } from 'vue';

const dataGestores = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = ref(1);
const isLoading = ref(true);
const updateGestores = ref({});
const isGestoresEditVisible = ref(false);
const isEmailUsed = ref(false);
const newGestores = ref({});
const isGestoresAddVisible = ref(false);
const noData = ref(false);
const deleteShowGestores = ref({});
const isGestoresDeleteConfirmVisible = ref(false);
const roles = [
  {title: "Administrador",value:  "administrador"},
  {title: "Redacción",value:  "redaccion"},
  {title: "Webmaster",value:  "webmaster"},
  {title: "Visor",value:  "visor"},
  {title: "Marketing",value:  "marketing"},
]
async function getGestores(){
    isLoading.value = true;
    await fetch ('https://gestores-flax.vercel.app/all')
    .then(result => result.json())
    .then(data => {
        dataGestores.value = data; 
        isLoading.value = false;
    });
}

onMounted(getGestores);

const paginatedData = computed(() => {	
    const start = (currentPage.value - 1) * itemsPerPage.value;
	const end = start + itemsPerPage.value;
	let dataF = dataGestores.value.slice(start, end);
	totalPages.value = Math.ceil(dataGestores.value.length / itemsPerPage.value);
	//filteredData =  catag_list;
	return dataF;
});

// ------------------------------- edit

const emailOld = ref('');
async function onFormEditGestoresActive  (id){
		//let index =  categorias.value.map((e) => e.id).indexOf(id);  	
	await fetch('https://gestores-flax.vercel.app/id?' + new URLSearchParams({ id: id }))
        .then(response => response.json())
        .then(data => {
        updateGestores.value = data;  
        emailOld.value = data.email;      
    })
    .catch(error => {return error}); 
	isGestoresEditVisible.value = true;
     
};

async function onFormGestoresSubmit  (id){
    let raw;
    
    if(updateGestores.value.email == emailOld.value){
        raw = JSON.stringify({
        "id": id,     
        "fullName": updateGestores.value.fullName,
        "role": updateGestores.value.role
    });
    }else{
        raw = JSON.stringify({
        "id": id,     
        "fullName": updateGestores.value.fullName,
        "email": updateGestores.value.email,
        "role": updateGestores.value.role
    });}
  

    await fetch('https://gestores-flax.vercel.app/update' ,
          {
            method: 'PUT',
            headers: {
              "Content-Type": "application/json",
            },
            body: raw
          })
        .then(response => response.json())
        .then(response =>{       
            if(response == "El email ya está registrado"){               
                isEmailUsed.value = true;
                return false;
            }else{
            isGestoresEditVisible.value = false; 
            isEmailUsed.value = false; 
            getGestores();
            return true;
        }
            
        })
        .catch(error => {return error}); 
      
}

const onFormGestoresEditReset = () => {
    updateGestores.value = {};
	isGestoresEditVisible.value = false;	
};

const dialogGestoresEditValueUpdate = (val) => {
	if(val === false){
		updateGestores.value = {}; 
	}
	isGestoresEditVisible.value = val;
};

// ------------------------------- add

async function onFormAddGestoresActive  (){
	isGestoresAddVisible.value = true;     
};

async function onFormGestoresAddSubmit  (){
    noData.value = false;
    isEmailUsed.value = false;
   
    let raw = JSON.stringify({
        "fullName": newGestores.value.fullName,
        "email": newGestores.value.email,
        "password": newGestores.value.password,
        "role": newGestores.value.role
    });

    await fetch('https://gestores-flax.vercel.app/add' ,
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
            if(response == "El email ya está registrado"){
                isEmailUsed.value = true;
                return false;
            }else if(response == "Faltan datos"){
                noData.value = true;
                return false;
            }
            else{
            isGestoresAddVisible.value = false; 
            noData.value = false; 
            isEmailUsed.value = false;
            getGestores();
            return true;
        }
            
        })
        .catch(error => {return error}); 
      
}

const onFormGestoresAddReset = () => {
  newGestores.value = {};
	isGestoresAddVisible.value = false;	
};

const dialogGestoresAddValueUpdate = (val) => {
	if(val === false){
		newGestores.value = {}; 
	}
	isGestoresAddVisible.value = val;
};
//  ------------- DELETE 
async function onConfirmGestoresDeleteActive (id){
  isGestoresDeleteConfirmVisible.value = true;

  await fetch('https://gestores-flax.vercel.app/id?' + new URLSearchParams({ id: id }))
        .then(response => response.json())
        .then(data => {
        deleteShowGestores.value = data;        
    })
    .catch(error => {return error}); 
}

async function onFormGestoresDeleteSend  (){
  
  let id = deleteShowGestores.value._id;

  var requestOptions = {
  method: 'DELETE',
  redirect: 'follow'
  };

  await fetch('https://gestores-flax.vercel.app/delete?' + new URLSearchParams({ id: id }),requestOptions)
        .then(response => response.json())
        .then(data => {
        isGestoresDeleteConfirmVisible.value = false;  
        deleteShowGestores.value = {};  
        getGestores();  
        return true;             
    })
    .catch(error => {return error}); 
  
}

const dialogGestoresDeleteValueUpdate = (val) => {
	if(val === false){
		deleteShowGestores.value = {}; 
	}
	isGestoresDeleteConfirmVisible.value = val;
};

const onFormGestoresDeleteReset = () => {
  deleteShowGestores.value = {};
	isGestoresDeleteConfirmVisible.value = false;	
};




</script>

<template>
<VRow>
    <VCol cols="12" >
    <!-- trazabilidad independiente -->
    
      <VCard >
        <VSnackbar
      v-model="isEmailUsed"
      color="error"
      transition="scale-transition"
      location="top center"
    >
      El email ya está registrado.
    </VSnackbar>
    <VSnackbar
      v-model="noData"
      color="error"
      transition="scale-transition"
      location="top center"
    >
      Porfavor ingresar todos los datos.
    </VSnackbar>
        <VCardItem class="pb-sm-0" >        
            <div class="d-flex align-center flex-wrap gap-2">    
            <VCardTitle>Usuarios backoffice</VCardTitle>  
            <VBtn prepend-icon="tabler-plus" @click="onFormAddGestoresActive">
                Añadir usuario
            </VBtn>
             
            </div>  
        </VCardItem>
          <VCardItem class="pb-sm-0"> 
          <VCardText v-if="isLoading">Cargando información...</VCardText>
          <VCardText v-else> 
          <VTable class="text-no-wrap tableNavegacion">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Rol</th>    
                <th scope="col">Acciones</th>           
              </tr>
            </thead>

            <tbody>
              <tr v-for="user in paginatedData" >
                <td >
                  {{ user.fullName }} 
                </td>
                <td >
                  {{ user.email }} 
                </td>
                <td>
                  {{ user.role}} 
                </td>   
                <td class="text-center" style="width: 5rem">
                 <VBtn icon size="x-small" color="default" variant="text" @click="onFormEditGestoresActive(user._id)">
                    <VIcon size="22" icon="tabler-edit" />
                  </VBtn>
                  <VBtn icon size="x-small" color="default" variant="text" @click="onConfirmGestoresDeleteActive(user._id)">
                    <VIcon size="22" icon="tabler-trash" />
                  </VBtn>      
                </td>         
              </tr>
            </tbody>
          </VTable>
          <VDivider />

<div class="px-4 py-4 mt-5">
    <v-btn
        :disabled="currentPage === 1"
        @click="currentPage -= 1"
        size="small"
        color="primary"
    >
        Anterior
    </v-btn>
    <span class="px-2"
        >{{ currentPage }} de {{ totalPages }} de un total de
        {{ dataGestores.length }} registros</span
    >

    <v-btn
        :disabled="currentPage === totalPages"
        @click="currentPage += 1"
        size="small"
        color="primary"
    >
        Siguiente
    </v-btn>
</div>
        <VDialog
                         persistent
                         no-click-animation
						:width="$vuetify.display.smAndDown ? 'auto' : 700"
						:model-value="isGestoresEditVisible"
						@update:model-value="dialogGestoresEditValueUpdate"
					>
						<!-- Dialog close btn -->
						<DialogCloseBtn @click="dialogGestoresEditValueUpdate(false)" />

						<VCard class="pa-sm-14 pa-5">
							<VCardItem class="text-center">
								<VCardTitle class="text-h5 mb-3">
									Editar el usuario
								</VCardTitle>
							</VCardItem>

							<VCardText>
						
								<!-- 👉 Form -->
								<VForm
									class="mt-6"
									@submit.prevent="onFormGestoresSubmit(updateGestores._id)"
								>
									<VRow class="d-flex flex-wrap justify-center gap-4">
                                        <VRow>
										<!-- 👉 Nombre -->
										<VCol cols="6" >
											<VTextField
												v-model="updateGestores.fullName"
												label="Nombre completo"
											/>
										</VCol>
                                        <VCol cols="6" >
											<VTextField
												v-model="updateGestores.email"
												label="Email"
											/>
										</VCol>
                
                                        <VCol cols="6" >
											<VSelect
                                            v-model="updateGestores.role"
                                            :items="roles"
                                            label="role"
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
												@click="onFormGestoresEditReset"
											>
												Cancelar
											</VBtn>
										</VCol>
									</VRow>
								</VForm>
							</VCardText>
						</VCard>
					</VDialog>  
                    <!--                 add             -->      
                    <VDialog
                         persistent
                         no-click-animation
						:width="$vuetify.display.smAndDown ? 'auto' : 700"
						:model-value="isGestoresAddVisible"
						@update:model-value="dialogGestoresAddValueUpdate"
					>
						<!-- Dialog close btn -->
						<DialogCloseBtn @click="dialogGestoresAddValueUpdate(false)" />

						<VCard class="pa-sm-14 pa-5">
							<VCardItem class="text-center">
								<VCardTitle class="text-h5 mb-3">
									Agregar usuario
								</VCardTitle>
							</VCardItem>

							<VCardText>
						
								<!-- 👉 Form -->
								<VForm
									class="mt-6"
									@submit.prevent="onFormGestoresAddSubmit"
								>
									<VRow class="d-flex flex-wrap justify-center gap-4">
                                        <VRow>
										<!-- 👉 Nombre -->
										<VCol cols="6" >
											<VTextField
												v-model="newGestores.fullName"
												label="Nombre completo"
											/>
										</VCol>
                                        <VCol cols="6" >
											<VTextField
												v-model="newGestores.email"
												label="Email"
											/>
										</VCol>
                                        <VCol cols="6" >
											<VTextField
												v-model="newGestores.password"
												label="Password"
											/>
										</VCol>
                
                                        <VCol cols="6" >
											<VSelect
                                            v-model="newGestores.role"
                                            :items="roles"
                                            label="Rol"
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
												@click="onFormGestoresAddReset"
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
						:model-value="isGestoresDeleteConfirmVisible"
						@update:model-value="dialogGestoresDeleteValueUpdate"
					>
						<!-- Dialog close btn -->
						<DialogCloseBtn @click="dialogGestoresDeleteValueUpdate(false)" />

						<VCard class="pa-sm-14 pa-5">
							<VCardItem class="text-center">
								<VCardTitle class="text-h5 mb-3 p-5">
									<span>¿ Está seguro que desea eliminar</span><br>
                  <span>el usuario <i>{{ deleteShowGestores.email }}</i> ?</span>
								</VCardTitle>
							</VCardItem>
              <VCardItem >
                <VCol
											cols="12"
											class="d-flex flex-wrap justify-center gap-4"
										>
                <VBtn color="error"
											
											@click="onFormGestoresDeleteSend"
                      > 
                      Aceptar 
                </VBtn>

								<VBtn
												
												
												@click="onFormGestoresDeleteReset"
											>
												Cancelar
								</VBtn>
              </VCol>
              </VCardItem>

						</VCard>
					</VDialog>
        </VCardText>
        </VCardItem>
      </VCard>
    </VCol>
</VRow>
</template>
<style scoped>
.clickable { cursor: pointer; }
@media (max-width: 1000px) {
  td span {
    max-width: 200px;
  }
}
</style>