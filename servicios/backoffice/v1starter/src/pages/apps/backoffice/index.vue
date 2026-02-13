<template>
  <VRow>
      <VCol cols="12" >
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
      <VCardItem class="pb-sm-0">        
        <div class="d-flex align-center flex-wrap justify-space-between">    
            <VCardTitle>Usuarios backoffice</VCardTitle>  
            <div>
                <VBtn prepend-icon="tabler-plus" @click="onFormAddGestoresActive">
                    Añadir usuario
                </VBtn>
            </div>
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
                <tr v-for="user in paginatedData" :key="user._id">
                  <td>
                    {{ user.fullName }} 
                  </td>
                  <td>
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
                <VCardItem>
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
      
      <!-- Nueva Card para Usuarios PWA -->
      <VCol cols="12">
        <VCard>
          <VSnackbar
            v-model="pwaUserMessage.show"
            :color="pwaUserMessage.type"
            transition="scale-transition"
            location="top center"
          >
            {{ pwaUserMessage.text }}
          </VSnackbar>
          
          <VCardItem class="pb-sm-0">        
    <div class="d-flex align-center flex-wrap justify-space-between">    
        <VCardTitle>Usuarios APP (Radar)</VCardTitle>  
        <div>
            <VBtn prepend-icon="tabler-plus" @click="isPwaUserAddVisible = true">
                Añadir usuario
            </VBtn>
        </div>
    </div>  
</VCardItem>
          
          <VCardItem class="pb-sm-0"> 
            <VCardText v-if="isPwaLoading">Cargando información...</VCardText>
            <VCardText v-else> 
              <VTable class="text-no-wrap tableNavegacion">
                <thead>
                  <tr>
                    <th scope="col">Nombre de Usuario</th>
                    <th scope="col">Email</th>
                    <th scope="col">Fecha Creación</th>    
                    <th scope="col">Acciones</th>           
                  </tr>
                </thead>
  
                <tbody>
                  <tr v-for="user in paginatedPwaUsers" :key="user.username">
                    <td>
                      {{ user.username }} 
                    </td>
                    <td>
                      {{ user.email }} 
                    </td>
                    <td>
                      {{ user.created_at }} 
                    </td>   
                    <td class="text-center" style="width: 5rem">
                      <VBtn icon size="x-small" color="default" variant="text" @click="onPwaUserEditActive(user.username)">
                        <VIcon size="22" icon="tabler-edit" />
                      </VBtn>
                      <VBtn icon size="x-small" color="default" variant="text" @click="onPwaUserDeleteConfirm(user.username)">
                        <VIcon size="22" icon="tabler-trash" />
                      </VBtn>      
                    </td>         
                  </tr>
                </tbody>
              </VTable>
              <VDivider />
  
              <div class="px-4 py-4 mt-5">
                <v-btn
                  :disabled="pwaCurrentPage === 1"
                  @click="pwaCurrentPage -= 1"
                  size="small"
                  color="primary"
                >
                  Anterior
                </v-btn>
                <span class="px-2">{{ pwaCurrentPage }} de {{ pwaTotalPages }} de un total de {{ pwaUsers.length }} registros</span>
                <v-btn
                  :disabled="pwaCurrentPage === pwaTotalPages"
                  @click="pwaCurrentPage += 1"
                  size="small"
                  color="primary"
                >
                  Siguiente
                </v-btn>
              </div>
  
              <!-- Dialog para añadir nuevo usuario APP -->
              <VDialog
                persistent
                no-click-animation
                :width="$vuetify.display.smAndDown ? 'auto' : 700"
                v-model="isPwaUserAddVisible"
              >
                <!-- Dialog close btn -->
                <DialogCloseBtn @click="isPwaUserAddVisible = false" />
  
                <VCard class="pa-sm-14 pa-5">
                  <VCardItem class="text-center">
                    <VCardTitle class="text-h5 mb-3">
                      Registrar Nuevo Usuario PWA
                    </VCardTitle>
                  </VCardItem>
  
                  <VCardText>
                    <VForm
                      class="mt-6"
                      @submit.prevent="onPwaUserRegister"
                    >
                      <VRow class="d-flex flex-wrap justify-center gap-4">
                        <VRow>
                          <VCol cols="6">
                            <VTextField
                              v-model="newPwaUser.username"
                              label="Nombre de Usuario"
                              required
                            />
                          </VCol>
                          
                          <VCol cols="6">
                            <VTextField
                              v-model="newPwaUser.email"
                              label="Correo Electrónico"
                              type="email"
                              required
                            />
                          </VCol>
                          
                          <VCol cols="6">
                            <VTextField
                              v-model="newPwaUser.password"
                              label="Contraseña"
                              type="password"
                              required
                            />
                          </VCol>
                          
                          <VCol cols="6">
                            <VTextField
                              v-model="newPwaUser.delete_key"
                              label="Palabra Clave para Eliminar Cuenta"
                              type="password"
                              hint="Esta clave es necesaria para eliminar la cuenta"
                              required
                            />
                          </VCol>
                        </VRow>
                        
                        <VCol
                          cols="12"
                          class="d-flex flex-wrap justify-center gap-4"
                        >
                          <VBtn 
                            type="submit"
                            :loading="pwaRegisterLoading"
                          > 
                            Enviar 
                          </VBtn>
  
                          <VBtn
                            color="secondary"
                            variant="tonal"
                            @click="onPwaUserAddReset"
                          >
                            Cancelar
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VForm>
                  </VCardText>
                </VCard>
              </VDialog>
              
              <!-- Dialog para editar usuario PWA -->
              <VDialog
                persistent
                no-click-animation
                :width="$vuetify.display.smAndDown ? 'auto' : 700"
                v-model="isPwaUserEditVisible"
              >
                <!-- Dialog close btn -->
                <DialogCloseBtn @click="isPwaUserEditVisible = false" />
  
                <VCard class="pa-sm-14 pa-5">
                  <VCardItem class="text-center">
                    <VCardTitle class="text-h5 mb-3">
                      Editar Usuario PWA
                    </VCardTitle>
                  </VCardItem>
  
                  <VCardText>
                    <VForm
                      class="mt-6"
                      @submit.prevent="onPwaUserUpdate"
                    >
                      <VRow class="d-flex flex-wrap justify-center gap-4">
                        <VRow>
                          <VCol cols="6">
                            <VTextField
                              v-model="editPwaUser.username"
                              label="Nombre de Usuario"
                              disabled
                            />
                          </VCol>
                          
                          <VCol cols="6">
                            <VTextField
                              v-model="editPwaUser.email"
                              label="Correo Electrónico"
                              type="email"
                              required
                            />
                          </VCol>
                          
                          <VCol cols="6">
                            <VTextField
                              v-model="editPwaUser.password"
                              label="Nueva Contraseña (opcional)"
                              type="password"
                              hint="Dejar en blanco para mantener la actual"
                            />
                          </VCol>
                          
                          <VCol cols="6">
                            <VTextField
                              v-model="editPwaUser.delete_key"
                              label="Palabra Clave para Eliminar (opcional)"
                              type="password"
                              hint="Dejar en blanco para mantener la actual"
                            />
                          </VCol>
                        </VRow>
                        
                        <VCol
                          cols="12"
                          class="d-flex flex-wrap justify-center gap-4"
                        >
                          <VBtn 
                            type="submit"
                            :loading="pwaUpdateLoading"
                          > 
                            Actualizar 
                          </VBtn>
  
                          <VBtn
                            color="secondary"
                            variant="tonal"
                            @click="isPwaUserEditVisible = false"
                          >
                            Cancelar
                          </VBtn>
                        </VCol>
                      </VRow>
                    </VForm>
                  </VCardText>
                </VCard>
              </VDialog>
              
              <!-- Dialog para confirmar eliminación -->
              <VDialog
                persistent
                no-click-animation
                :width="$vuetify.display.smAndDown ? 'auto' : 600"
                v-model="isPwaUserDeleteVisible"
              >
                <!-- Dialog close btn -->
                <DialogCloseBtn @click="isPwaUserDeleteVisible = false" />
  
                <VCard class="pa-sm-14 pa-5">
                  <VCardItem class="text-center">
                    <VCardTitle class="text-h5 mb-3 p-5">
                      <span>¿Está seguro que desea eliminar</span><br>
                      <span>el usuario <i>{{ deletePwaUser.username }}</i>?</span>
                    </VCardTitle>
                  </VCardItem>
                  
                  <!-- Campo para la palabra clave de eliminación -->
                  <VCardText>
                    <VTextField
                      v-model="deletePwaUser.delete_key"
                      label="Palabra clave para eliminar"
                      type="password"
                      hint="Se requiere la palabra clave configurada para este usuario"
                      required
                      :error-messages="deleteKeyError ? 'Este campo es obligatorio' : ''"
                    />
                  </VCardText>
                  
                  <VCardItem>
                    <VCol
                      cols="12"
                      class="d-flex flex-wrap justify-center gap-4"
                    >
                      <VBtn 
                        color="error"
                        @click="onPwaUserDelete"
                        :loading="pwaDeleteLoading"
                      > 
                        Eliminar 
                      </VBtn>
  
                      <VBtn
                        @click="isPwaUserDeleteVisible = false"
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
  
<script setup>
import { computed, onMounted, ref } from 'vue';
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
  {title: "Administrador", value: "administrador"},
  {title: "Redacción", value: "redaccion"},
  {title: "Webmaster", value: "webmaster"},
  {title: "Monetización", value: "monetizacion"},
  {title: "Visor", value: "visor"},
  {title: "Marketing", value: "marketing"},
  {title: "Audiencias", value: "audiencia"},
  {title: "Visor Radar Digital", value: "radar"},
];


// Variables para Usuarios APP
const pwaUsers = ref([]);
const isPwaLoading = ref(true);
const isPwaUserAddVisible = ref(false);
const isPwaUserEditVisible = ref(false);
const isPwaUserDeleteVisible = ref(false);
const pwaCurrentPage = ref(1);
const pwaItemsPerPage = ref(10);
const pwaTotalPages = ref(1);
const deleteKeyError = ref(false);

const newPwaUser = ref({
  username: '',
  email: '',
  password: '',
  delete_key: ''
});

const editPwaUser = ref({
  username: '',
  email: '',
  password: '',
  delete_key: ''
});

const deletePwaUser = ref({
  username: '',
  delete_key: ''
});

const pwaRegisterLoading = ref(false);
const pwaUpdateLoading = ref(false);
const pwaDeleteLoading = ref(false);

// Notificaciones para la card de PWA
const pwaUserMessage = ref({
  show: false,
  text: '',
  type: 'success' // success, error, info, warning
});

// URL de la API
const PWA_API_URL = 'https://services.ecuavisa.com/pwa-users/api-v3.php';

// Funciones para usuarios backoffice
async function getGestores(){
    isLoading.value = true;
    await fetch('https://gestores-flax.vercel.app/all')
    .then(result => result.json())
    .then(data => {
        dataGestores.value = data; 
        isLoading.value = false;
    });
}

const paginatedData = computed(() => {	
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    let dataF = dataGestores.value.slice(start, end);
    totalPages.value = Math.ceil(dataGestores.value.length / itemsPerPage.value);
    return dataF;
});

// ------------------------------- edit
const emailOld = ref('');
async function onFormEditGestoresActive(id){
    await fetch('https://gestores-flax.vercel.app/id?' + new URLSearchParams({ id: id }))
        .then(response => response.json())
        .then(data => {
        updateGestores.value = data;  
        emailOld.value = data.email;      
    })
    .catch(error => {return error}); 
    isGestoresEditVisible.value = true;
}

async function onFormGestoresSubmit(id){
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
async function onFormAddGestoresActive(){
    isGestoresAddVisible.value = true;     
};

async function onFormGestoresAddSubmit(){
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
async function onConfirmGestoresDeleteActive(id){
  isGestoresDeleteConfirmVisible.value = true;

  await fetch('https://gestores-flax.vercel.app/id?' + new URLSearchParams({ id: id }))
        .then(response => response.json())
        .then(data => {
        deleteShowGestores.value = data;        
    })
    .catch(error => {return error}); 
}

async function onFormGestoresDeleteSend(){
  
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

// Funciones para card de Usuarios APP
async function getPwaUsers() {
  isPwaLoading.value = true;
  
  try {
    const response = await fetch(`${PWA_API_URL}?api=all&folder=users`);
    const data = await response.json();
    
    if (data.success) {
      // Transformamos el formato de datos para que sea más fácil de trabajar
      pwaUsers.value = [];
      if (data.data && Array.isArray(data.data)) {
        // Los datos están en un array dentro de data.data
        pwaUsers.value = data.data.map(item => {
          // Eliminar password de los datos mostrados
          const {password, ...userWithoutPassword} = item;
          return userWithoutPassword;
        });
      }
    } else {
      pwaUserMessage.value = {
        show: true,
        text: 'Error al cargar usuarios PWA',
        type: 'error'
      };
      setTimeout(() => {
        pwaUserMessage.value.show = false;
      }, 3000);
    }
  } catch (error) {
    console.error('Error al cargar usuarios PWA:', error);
    pwaUserMessage.value = {
      show: true,
      text: 'Error de conexión al cargar usuarios PWA',
      type: 'error'
    };
    setTimeout(() => {
      pwaUserMessage.value.show = false;
    }, 3000);
  } finally {
    isPwaLoading.value = false;
  }
}

// Paginación para usuarios app
const paginatedPwaUsers = computed(() => {
  const start = (pwaCurrentPage.value - 1) * pwaItemsPerPage.value;
  const end = start + pwaItemsPerPage.value;
  let filteredUsers = pwaUsers.value.slice(start, end);
  pwaTotalPages.value = Math.ceil(pwaUsers.value.length / pwaItemsPerPage.value);
  return filteredUsers;
});

// Función para registrar un nuevo usuario app
async function onPwaUserRegister() {
  if (!newPwaUser.value.username || !newPwaUser.value.email || 
      !newPwaUser.value.password || !newPwaUser.value.delete_key) {
    pwaUserMessage.value = {
      show: true,
      text: 'Todos los campos son obligatorios',
      type: 'error'
    };
    setTimeout(() => {
      pwaUserMessage.value.show = false;
    }, 3000);
    return;
  }
  
  pwaRegisterLoading.value = true;
  
  try {
    const response = await fetch(`${PWA_API_URL}?user=register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPwaUser.value)
    });
    
    const data = await response.json();
    
    if (data.success) {
      pwaUserMessage.value = {
        show: true,
        text: 'Usuario registrado correctamente',
        type: 'success'
      };
      // Resetear formulario y cerrar modal
      onPwaUserAddReset();
      // Recargar lista de usuarios
      getPwaUsers();
    } else {
      pwaUserMessage.value = {
        show: true,
        text: data.message || 'Error al registrar usuario',
        type: 'error'
      };
    }
  } catch (error) {
    console.error('Error al registrar usuario PWA:', error);
    pwaUserMessage.value = {
      show: true,
      text: 'Error de conexión al registrar usuario',
      type: 'error'
    };
  } finally {
    pwaRegisterLoading.value = false;
    setTimeout(() => {
      pwaUserMessage.value.show = false;
    }, 3000);
  }
}

// Resetear formulario de registro
function onPwaUserAddReset() {
  newPwaUser.value = {
    username: '',
    email: '',
    password: '',
    delete_key: ''
  };
  isPwaUserAddVisible.value = false;
}

// Función para activar edición de usuario
async function onPwaUserEditActive(username) {
  try {
    const response = await fetch(`${PWA_API_URL}?user=details&username=${username}`);
    const data = await response.json();
    
    if (data.success && data.user) {
      editPwaUser.value = {
        username: data.user.username,
        email: data.user.email,
        password: '', // Campo vacío para nueva contraseña opcional
        delete_key: '' // Campo vacío para nueva clave de borrado opcional
      };
      isPwaUserEditVisible.value = true;
    } else {
      pwaUserMessage.value = {
        show: true,
        text: 'No se pudo cargar los datos del usuario',
        type: 'error'
      };
      setTimeout(() => {
        pwaUserMessage.value.show = false;
      }, 3000);
    }
  } catch (error) {
    console.error('Error al cargar usuario para edición:', error);
    pwaUserMessage.value = {
      show: true,
      text: 'Error de conexión al cargar datos del usuario',
      type: 'error'
    };
    setTimeout(() => {
      pwaUserMessage.value.show = false;
    }, 3000);
  }
}

// Función para actualizar usuario
async function onPwaUserUpdate() {
  if (!editPwaUser.value.username || !editPwaUser.value.email) {
    pwaUserMessage.value = {
      show: true,
      text: 'Nombre de usuario y email son obligatorios',
      type: 'error'
    };
    setTimeout(() => {
      pwaUserMessage.value.show = false;
    }, 3000);
    return;
  }
  
  pwaUpdateLoading.value = true;
  
  // Preparar datos para actualización
  const updateData = {
    username: editPwaUser.value.username,
    email: editPwaUser.value.email
  };
  
  // Añadir password solo si se ha proporcionado uno nuevo
  if (editPwaUser.value.password) {
    updateData.password = editPwaUser.value.password;
  }
  
  // Añadir delete_key solo si se ha proporcionado una nueva
  if (editPwaUser.value.delete_key) {
    updateData.delete_key = editPwaUser.value.delete_key;
  }
  
  try {
    const response = await fetch(`${PWA_API_URL}?user=update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      pwaUserMessage.value = {
        show: true,
        text: 'Usuario actualizado correctamente',
        type: 'success'
      };
      isPwaUserEditVisible.value = false;
      // Recargar lista de usuarios
      getPwaUsers();
    } else {
      pwaUserMessage.value = {
        show: true,
        text: data.message || 'Error al actualizar usuario',
        type: 'error'
      };
    }
  } catch (error) {
    console.error('Error al actualizar usuario PWA:', error);
    pwaUserMessage.value = {
      show: true,
      text: 'Error de conexión al actualizar usuario',
      type: 'error'
    };
  } finally {
    pwaUpdateLoading.value = false;
    setTimeout(() => {
      pwaUserMessage.value.show = false;
    }, 3000);
  }
}

// Función para confirmar eliminación
function onPwaUserDeleteConfirm(username) {
  // Resetear mensaje de error si existe
  deleteKeyError.value = false;
  // Inicializar objeto con solo el username
  deletePwaUser.value = {
    username: username,
    delete_key: ''
  };
  isPwaUserDeleteVisible.value = true;
}

// Función para eliminar usuario
async function onPwaUserDelete() {
  // Resetear el estado de error
  deleteKeyError.value = false;
  
  if (!deletePwaUser.value.username) {
    return;
  }
  
  // Validar que se haya ingresado la palabra clave
  if (!deletePwaUser.value.delete_key) {
    deleteKeyError.value = true;
    pwaUserMessage.value = {
      show: true,
      text: 'Se requiere la palabra clave para eliminar',
      type: 'error'
    };
    setTimeout(() => {
      pwaUserMessage.value.show = false;
    }, 3000);
    return;
  }
  
  pwaDeleteLoading.value = true;
  
  try {
    const response = await fetch(`${PWA_API_URL}?user=delete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(deletePwaUser.value)
    });
    
    const data = await response.json();
    
    if (data.success) {
      pwaUserMessage.value = {
        show: true,
        text: 'Usuario eliminado correctamente',
        type: 'success'
      };
      isPwaUserDeleteVisible.value = false;
      // Resetear el formulario de eliminación
      deletePwaUser.value = {
        username: '',
        delete_key: ''
      };
      // Recargar lista de usuarios
      getPwaUsers();
    } else {
      pwaUserMessage.value = {
        show: true,
        text: data.message || 'Error al eliminar usuario',
        type: 'error'
      };
    }
  } catch (error) {
    console.error('Error al eliminar usuario PWA:', error);
    pwaUserMessage.value = {
      show: true,
      text: 'Error de conexión al eliminar usuario',
      type: 'error'
    };
  } finally {
    pwaDeleteLoading.value = false;
    setTimeout(() => {
      pwaUserMessage.value.show = false;
    }, 3000);
  }
}

// Cargar usuarios al montar el componente
onMounted(() => {
  getGestores(); // Carga los gestores existentes
  getPwaUsers(); // Carga los usuarios PWA
});
 </script>