<template>
    <div class="position-relative">
      <VRow>
        <!-- Detalles de campaña-->
        <VCol cols="12" md="6">
          <VCard class="h-100">
            <VCardTitle class="pa-4">
              <VChip
                color="primary"
                label
                size="large"
                class="px-4 py-2 text-uppercase"
              >
                Detalles de Campaña
              </VChip>
            </VCardTitle>
          <VCardText>
            <VRow>
              <!-- Nombre de la campaña -->
              <VCol cols="6">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label for="nombreCampania">Nombre de la campaña</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <VTextField
                      id="nombreCampania"
                      v-model="nombreCampania"
                      placeholder="Nombre de la campaña"
                      persistent-placeholder
                    />
                  </VCol>
                </VRow>
              </VCol>
  
              <!-- Tipo de contenido -->
              <VCol cols="6">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label for="tipocontenido">Tipo de contenido</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <VSelect
                      v-model="languages"
                      :items="languageList"
                      chips
                      clearable
                      label=""
                    />
                  </VCol>
                </VRow>
              </VCol>
  
              <!-- Campo de descripción -->
              <VCol cols="12">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label for="descripcionCampania">Descripción de la campaña</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <VTextarea
                      id="descripcionCampania"
                      v-model="descripcionCampania"
                      placeholder="Ingrese una descripción para la campaña"
                      persistent-placeholder
                      rows="3"
                    />
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
  
      <VCol cols="12" md="6">
        <VCard class="h-100">
          <VCardTitle class="pa-4">
            <VChip
              color="primary"
              label
              size="large"
              class="px-4 py-2 text-uppercase"
            >
              Configuración de Contenido
            </VChip>
          </VCardTitle>
          <VCardText>
            <VRow class="pb-5">
              <VCol cols="6">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label for="tipocontenido">Tipo de contenido</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <VSelect
                      v-model="languages"
                      :items="languageList"
                      chips
                      clearable
                      label=""
                    />
                  </VCol>
                </VRow>
              </VCol>
  
              <VCol cols="12">
                <hr>
              </VCol>
  
              <!-- Campo de código (visible cuando no es imagen) -->
              <VCol cols="12" :class="(languages=='imagen'?'d-none':'')">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label for="nombreCampania">Inserte el código</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <VTextarea 
                      label="Código" 
                      v-model="codigoExternoModel" 
                    />
                  </VCol>
                </VRow>
              </VCol>
  
              <!-- Campo de link (visible solo cuando es imagen) -->
              <VCol cols="12" :class="(languages!='imagen'?'d-none':'')">
                <VRow no-gutters>
                  <VCol cols="12" md="12">
                    <label for="nombreCampania">Link del ads</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <VTextField
                      id="link"
                      v-model="linkAds"
                      placeholder="Link del ads"
                      persistent-placeholder
                    />
                  </VCol>
                </VRow>
              </VCol>
  
              <!-- URL imagen escritorio (visible solo cuando es imagen) -->
              <VCol cols="6" :class="(languages!='imagen'?'d-none':'')">
                <VRow no-gutters>
                  <VCol cols="6" md="12">
                    <label for="">URL imagen de escritorio</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <VTextField
                      id="linkImageEscritorio"
                      v-model="linkImageEscritorio"
                      placeholder="Link imagen de escritorio"
                      persistent-placeholder
                    />
                  </VCol>
                </VRow>
              </VCol>
  
              <!-- URL imagen móvil (visible solo cuando es imagen) -->
              <VCol cols="6" :class="(languages!='imagen'?'d-none':'')">
                <VRow no-gutters>
                  <VCol cols="6" md="12">
                    <label for="">URL imagen de móvil</label>
                  </VCol>
                  <VCol cols="12" md="12">
                    <VTextField
                      id="linkImageEscritorio"
                      v-model="linkImageMobile"
                      placeholder="Link imagen de móvil"
                      persistent-placeholder
                    />
                  </VCol>
                </VRow>
              </VCol>
            </VRow>
          </VCardText>
        </VCard>
      </VCol>
  
      <!-- Visibilidad en la web -->
      <VCol cols="12">
        <VCard>
          <VCardTitle class="pa-4">
            <VChip
              color="primary"
              label
              size="large"
              class="px-4 py-2 text-uppercase"
            >
              Visibilidad en la web
            </VChip>
          </VCardTitle>
      <VCardText>
        <VRow>
          <!-- Escoge sección -->
          <VCol cols="6">
                          <VRow no-gutters>
            
                            <VCol
                              cols="12"
                              md="12"
                            >
                              <label for="tipocontenido">Escoge una sección</label>
                            </VCol>

                            <VCol
                              cols="12"
                              md="12"
                            >
                              <VSelect
                                v-model="selectItemVisibilidad"
                                :items="selectItemsListVisibilidad"
                                chips
                                clearable
                                label=""
                              />
                            </VCol>
                          </VRow>
                        </VCol>

          <!-- Posición -->
          <VCol cols="6">
            <VRow no-gutters>
              <VCol cols="12" md="12">
                <label for="email">Posición</label>
              </VCol>
              <VCol cols="12" md="12">
                <VCombobox
                  v-model="posicion"
                  multiple
                  chips
                  :items="posicionList"
                  variant="outlined"
                  label=""
                  persistent-hint
                  v-model:search-input="search"
                  hide-selected
                  :hide-no-data="false"
                  hint=""
                />
              </VCol>
            </VRow>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </VCol>
<!-- Tarjeta de Target/Usuarios -->
<VCol cols="12">
  <VCard>
    <VCardTitle class="pa-4">
      <VChip
        color="primary"
        label
        size="large"
        class="px-4 py-2 text-uppercase"
      >
        Target / Usuarios
      </VChip>
    </VCardTitle>
    <VCardText>
      <div class="d-flex justify-end mb-4">
        <VSwitch
          v-model="modoPersonalizado"
          color="primary"
          label="Modo Personalizado"
          hide-details
        />
      </div>

      <!-- Contenido que cambia según el switch -->
      <VRow v-if="!modoPersonalizado">
        <VCol cols="12">
          <h3 class="text-center">Filtrar en la plataforma</h3>
          <p class="mb-5 text-center">usuarios registrados en ecuavisa.com</p>

          <!-- Tabla de criterios -->
          <VTable density="compact" class="border-transparent mb-4">
            <tbody>
              <tr>
                <td class="border-transparent" style="width: 50%">
                  <VCheckbox
                    v-model="criterio"
                    :label="criterioList[0].title"
                    :value="criterioList[0].value"
                  />
                </td>
                <td class="border-transparent" style="width: 50%">
                  <VCheckbox
                    v-model="criterio"
                    :label="criterioList[1].title"
                    :value="criterioList[1].value"
                  />
                </td>
              </tr>
              <tr>
                <td class="border-transparent">
                  <VCheckbox
                    v-model="criterio"
                    :label="criterioList[2].title"
                    :value="criterioList[2].value"
                  />
                </td>
                <td class="border-transparent">
                  <VCheckbox
                    v-model="criterio"
                    :label="criterioList[3].title"
                    :value="criterioList[3].value"
                  />
                </td>
              </tr>
            </tbody>
          </VTable>

                <!-- Campos condicionales -->
                <VCol cols="12" :class="criterio.includes('metadatos')?'':'d-none'">
                              <VRow no-gutters >
                                <VCol cols="12">
                                  <VRow no-gutters>
                                    <!-- 👉 Email -->
                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <label for="metadatos">Metadatos</label>
                                    </VCol>

                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                    <VCombobox
                                        v-model="metadatos"
                                        multiple
                                        chips
                                        :items="metadatosItems"
                                        variant="outlined"
                                        label=""
                                        persistent-hint
                                        v-model:search-input="searchMetadatos"
                                        hide-selected
                                        :hide-no-data="false"
                                        hint=""
                                      />

                                    </VCol>
                                  </VRow>
                                </VCol>
                              </VRow>
                </VCol>
                <VCol cols="12" :class="criterio.includes('trazabilidads')?'':'d-none'">
                              <VRow no-gutters >
                                <VCol cols="6">
                                  <VRow no-gutters>
                                    <!-- 👉 Email -->
                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <label for="email">Países</label>
                                    </VCol>

                                    <VCol
                                      cols="12"
                                      md="12"
                                    >

                                      <VCombobox
                                        v-model="selectedItem"
                                        :items="countryList"
                                        class="pr-1"
                                        chips
                                        clearable
                                        :menu-props="{ maxHeight: '300' }"
                                      />
                                    </VCol>
                                  </VRow>
                                </VCol>
                                <VCol cols="6">
                                  <VRow no-gutters>
                                    <!-- 👉 Email -->
                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <label for="email">Ciudades</label>
                                    </VCol>

                                    <VCol
                                      cols="12"
                                      md="12"
                                    >

                                      <VCombobox
                                        v-model="selectedItemCiudad"
                                        multiple
                                        chips
                                        :items="cityList"
                                        v-model:search-input="searchCiudades"
                                        :hide-no-data="false"
                                        :menu-props="{ maxHeight: '300' }"
                                        class="custom-combobox-ciudad"
                                        :disabled="loadingPanel"
                                      />

                                      
                                    </VCol>
                                  </VRow>
                                </VCol>
                              </VRow>
                </VCol>
                <VCol cols="12" :class="criterio.includes('dispositivos')?'':'d-none'">
                              <VRow no-gutters >
                                <VCol cols="12">
                                  <VRow no-gutters>
                                    <!-- 👉 Email -->
                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <label for="email">Dispositivos</label>
                                    </VCol>

                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <VSelect
                                        v-model="selectItemDispositivos"
                                        :items="selectItemsListDispositivos"
                                        item-title="title"
                                        item-value="value"
                                        class="pr-1"
                                        
                                        multiple
                                        clearable
                                      >
                                        <template #selection="{ item }">
                                          <VChip>
                                            <VAvatar>
                                              <VIcon color="" :icon="item.raw.avatar" />
                                            </VAvatar>
                                            <span>{{ item.title }}</span>
                                          </VChip>
                                        </template>
                                      </VSelect>
                                    </VCol>
                                  </VRow>
                                </VCol>
                              </VRow>
                </VCol>
                <VCol cols="12" :class="criterio.includes('plataforma')?'':'d-none'">
                              <VRow no-gutters >
                                <VCol cols="6 pt-2">
                                  <VRow no-gutters>
                                    <!-- 👉 Email -->
                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <label for="navegador">Sistema operativo</label>
                                    </VCol>

                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <VSelect
                                        v-model="selectItemSO"
                                        :items="selectItemsListSO"
                                        item-title="title"
                                        item-value="value"
                                        class="pr-1"
                                        
                                        multiple
                                        clearable
                                      >
                                        <template #selection="{ item }">
                                          <VChip>
                                            <VAvatar>
                                              <VIcon color="" :icon="item.raw.avatar" />
                                            </VAvatar>
                                            <span>{{ item.title }}</span>
                                          </VChip>
                                        </template>
                                      </VSelect>
                                    </VCol>
                                  </VRow>
                                </VCol>
                                <VCol cols="6 pt-2">
                                  <VRow no-gutters>
                                    <!-- 👉 Email -->
                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <label for="navegador">Navegador</label>
                                    </VCol>

                                    <VCol
                                      cols="12"
                                      md="12"
                                    >
                                      <VSelect
                                        v-model="selectItemNavegador"
                                        :items="selectItemsListNavegador"
                                        item-title="title"
                                        item-value="value"
                                        class="pr-1"
                                        chips
                                        multiple
                                        clearable
                                      />
                                      
                                    </VCol>
                                  </VRow>
                                </VCol>
                              </VRow>
               </VCol>

              </VCol>
            </VRow>

             <!-- Vista de modo personalizado -->
      <!-- Reemplazar la sección de modo personalizado en la última tarjeta -->
      <VRow v-else>
  <VCol cols="12">
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2000"
      location="top"
    >
      {{ snackbar.text }}
    </VSnackbar>

    <!-- Campo de búsqueda y botones -->
    <VRow justify="space-between" class="mb-4">
      <VCol cols="4">
        <VTextField 
          append-inner-icon="tabler-user-search" 
          @input="filtrarUsuarios" 
          v-model="filterLocal" 
          label="Buscar usuarios dentro del listado"
          density="compact"
          :disabled="!hasUsers"
        />
      </VCol>
      <VCol cols="auto">
        <div class="d-flex gap-3 flex-wrap">
          <VBtn 
            color="info" 
            @click="handleExport" 
            size="small"
            :disabled="!hasUsers"
          >
            Descargar Usuarios<VIcon end icon="tabler-download" />
          </VBtn>
          <VBtn 
            color="success" 
            @click="handleAddUser" 
            size="small"
            
          >
            Añadir usuarios<VIcon end icon="mdi-account-plus" />
          </VBtn>
          <VBtn 
            color="primary" 
            @click="triggerFileInput" 
            size="small"
            :loading="isUploading"
          >
            Importar CSV<VIcon end icon="mdi-file-upload" />
          </VBtn>
          <input
            ref="fileInput"
            type="file"
            accept=".csv"
            style="display: none"
            @change="handleFileChange"
          />
        </div>
      </VCol>
    </VRow>

    <!-- Lista de usuarios (visible solo cuando hay usuarios) -->
    <div v-if="hasUsers">
      <VList lines="two">
        <template v-for="(user, index) in currentUsers" :key="index">
          <VListItem border>
            <VListItemTitle>
              <span>{{ user.firstname || user.first_name }} {{ user.lastname || user.last_name }}</span>
            </VListItemTitle>
            <VListItemSubtitle class="mt-1">
              <span class="text-xs text-disabled">Correo: {{ user.email }}</span>
            </VListItemSubtitle>
            <template #append>
              <VBtn
                icon
                size="x-small"
                color="error"
                variant="text"
                @click="handleDeleteUser(user.wylexId)"
              >
                <VIcon size="22" icon="tabler-trash" />
              </VBtn>
            </template>
          </VListItem>
        </template>
      </VList>

      <!-- Paginación -->
      <div class="d-flex justify-center mt-4">
        <VBtn 
          variant="tonal" 
          @click="currentPageLocal--" 
          :disabled="currentPageLocal <= 1" 
          size="small" 
          color="primary"
        >
          <VIcon start icon="tabler-arrow-left" /> Anterior
        </VBtn>
        <VBtn 
          variant="tonal" 
          @click="currentPageLocal++" 
          :disabled="currentPageLocal >= totalPages" 
          size="small" 
          color="primary" 
          class="ms-3"
        >
          Siguiente <VIcon end icon="tabler-arrow-right" />
        </VBtn>
      </div>
    </div>

    <!-- Mensaje cuando no hay usuarios -->
    <div v-else class="text-center pa-4">
      <p class="text-medium-emphasis">No hay usuarios cargados. Por favor, importa un archivo CSV para comenzar.</p>
    </div>

    <!-- Modal de búsqueda -->
    <VDialog v-model="showSearchDialog" max-width="800px">
      <VCard>
        <VCardTitle>Buscar Usuarios</VCardTitle>
        <VCardText>
          <VTextField
            v-model="searchQuery"
            @input="handleSearch"
            label="Buscar por nombre, correo o teléfono (mínimo 4 caracteres)"
            append-inner-icon="tabler-search"
            :loading="isSearching"
          />
          
          <VTable v-if="searchResults.length > 0">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in searchResults" :key="user.wylexId">
                <td>{{ user.first_name }} {{ user.last_name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <VBtn
                    size="small"
                    color="primary"
                    @click="handleAddSpecificUser(user)"
                    :loading="loadingAdd"
                  >
                    Agregar
                  </VBtn>
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="primary"
            text
            @click="closeSearchDialog"
          >
            Cerrar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCol>
</VRow>
    </VCardText>
  </VCard>
</VCol>

    </VRow>

  
    <!-- Botón flotante para guardar -->
    <VBtn
      class="save-button"
      color="success"
      icon="mdi-check"
      size="large"
      @click="onComplete"
      style="position: fixed; bottom: 2rem; right: 2rem;"
    >
      <VIcon icon="tabler-device-floppy" />
    </VBtn>
  </div>

  <VDialog
    v-model="userModalOpen"
    class="v-dialog-sm"
    persistent
  >
    <VCard>
      <VCardText class="pa-6">
        <UserList
          :campaign-id="tempCampaignId"
          :campaign-title="nombreCampania"
          :users-per-page="10"
          @update:users="handleUserUpdate"
          @close="userModalOpen = false"
        />
      </VCardText>
    </VCard>
  </VDialog>
</template>
  
<script setup>
import { useCategoriasListStore } from "@/views/apps/categorias/useCategoriasListStore";
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import 'vue3-form-wizard/dist/style.css';

const router = useRouter();
const currentTab = ref('tab-lista');
const checkbox = ref(false);
const loadingWizard = ref(false);
const loadingPanel = ref(false);
const dataCampaigns = ref([]);
const dataCountry = ref([]);
const cityList = ref([]);
const countryList = ref([]);

const modoPersonalizado = ref(false);


const timeoutId = ref(null);
const timeoutSegundos = 3000;

const nombreCampania = ref('')
const codigoExternoModel = ref('')
const linkAds = ref('')
const linkImageEscritorio = ref('')
const linkImageMobile = ref('');
const numeroOtroUsuarios = ref('');
const languages = ref([]);
const criterio = ref([]);
const posicion = ref([]);
const selectedItem = ref([]);
const selectedItemCiudad = ref([]);
const dataUsuarios = ref({});
const selectItemParticipantes = ref(null);
const selectItemsList = ref([{ title:'Otro', value: 'Otro' },{ title:'100', value: '100' }]);
const minValue = ref(1); // Valor mínimo permitido
const maxValue = ref(100); // Valor máximo permitido


const search = ref(null)


const metadatos = ref([]);
const metadatosItems = ref([]);
const searchMetadatos = ref([]);
const searchCiudades = ref([]);
const selectMetadatos = ref(null);
const categoriasListStore = useCategoriasListStore();
const fetchCategorias = async () => {
  try {
    const response = await categoriasListStore.fetchCategorias();
    return response.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const descripcionCampania = ref('');

const selectItemVisibilidad = ref([]);
const selectItemsListVisibilidad = ref([
  { title:'Todo el sitio', value: 'all', avatar:"" },
  { title:'Lo-ultimo', value: 'Lo-ultimo', avatar:"" },
  { title:'Noticias', value: 'Noticias', avatar:"" },
  { title:'Mundo', value: 'Mundo', avatar:"" },
  { title:'Estadio', value: 'Mundo', avatar:"" },
  { title:'Entretenimiento', value: 'Entretenimiento', avatar:"" },
  { title:'Programas', value: 'Programas', avatar:"" },
  { title:'Tendencias', value: 'Tendencias', avatar:"" },
  { title:'Home', value: 'Home', avatar:"" },
]);

const selectItemDispositivos = ref([]);
const selectItemsListDispositivos = ref([
  // { title:'Todos', value: '0', avatar:"mdi-cellphone-link" },
  { title:'Escritorio', value: 'desktop', avatar:"mdi-laptop-chromebook" },
  { title:'Móvil', value: 'movil', avatar:"mdi-cellphone-android" },
  ]);

const selectItemNavegador = ref([]);
const selectItemsListNavegador = ref([
  // { title:'Todos', value: '0', avatar:"" },
  { title:'Chrome', value: 'Chrome', avatar:"" },
  { title:'Safari', value: 'Safari', avatar:"" },
  { title:'Firefox', value: 'Firefox', avatar:""},
  { title:'Otro', value: 'Otro', avatar:"" } ,
  ]);

const selectItemSO = ref([]);
const selectItemsListSO = ref([
  // { title:'Todos', value: '0', avatar:"", navegador: [] },
  { title:'Windows', value: 'Windows', avatar:"tabler-brand-windows", navegador: [{ title:'Chrome', value: 'Chrome' },{ title:'Firefox', value: 'Firefox' }] },
  { title:'Mac OS', value: 'Mac OS', avatar:"tabler-brand-apple", navegador: [{ title:'Safari', value: 'Safari' },{ title:'Chrome', value: 'Chrome' }] },
  { title:'Android', value: 'Android', avatar:"tabler-brand-android", navegador: [{ title:'Chrome', value: 'Chrome' },{ title:'Firefox', value: 'Firefox' }] },
  { title:'Linux', value: 'Linux', avatar:"mdi-linux", navegador: [{ title:'Chrome', value: 'Chrome' }] } ,
  { title:'Otro', value: 'Otro', avatar:"mdi-account", navegador: [{ title:'Chrome', value: 'Chrome' }] } ,
  ]);

const numeroRules = [
  (v) => !!v || 'El número es requerido', // Verifica que no esté vacío
  (v) => /^\d+$/.test(v) || 'Ingrese solo números', // Verifica que solo sean números
  (v) => v >= minValue.value && v <= maxValue.value || 'Ingrese un número entre '+minValue.value+' y '+maxValue.value // Verifica el rango de valores
];

const languageList = [{
  title:'Imágenes locales',
  value:'imagen'
},{
  title:'Código HTML',
  value:'html'
},{
  title:'Códigos ADS',
  value:'script'
}]

const criterioList = [
  { title:'Geolocalización', value:'trazabilidads' },
  { title:'Dispositivos', value:'dispositivos' },
  { title:'Metadatos', value:'metadatos' },
  { title:'Plataforma', value:'plataforma' },

];

const posicionList = [
  'RDTop1',
  'RDTop2',
  'RDTop3',
  'RDFloating',
]

watch(posicion, value => {
  if (value.length > 1)
    nextTick(() => posicion.value.pop())
})

watch(metadatos, value => {
  if (value.length > 5)
    nextTick(() => metadatos.value.pop())
})



onMounted(async () => {
  await getCountries();
  await getMetadatos();
});

// antes: no valia listado paises
// async function getCountries(){
//   var myHeaders = new Headers();
//   loadingPanel.value=true;
//   myHeaders.append("Content-Type", "application/json");
//   var requestOptions = {
//     method: 'GET',
//     headers: myHeaders,
//     redirect: 'follow'
//   };
//   var response = await fetch(`https://ecuavisa-suscripciones.vercel.app/otros/obtener-paises-ciudades`, requestOptions);
//   const data = await response.json();
//   dataCountry.value = data;
//   loadingPanel.value=false;
// }

async function getCountries() {
  try {
    loadingPanel.value = true;
    const response = await fetch('https://ecuavisa-suscripciones.vercel.app/otros/obtener-paises-ciudades', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Error al obtener países');
    }

    const data = await response.json();
    dataCountry.value = data;
    
    // Procesar países para el select
    const paises = data.map(item => item.country);
    countryList.value = paises;
    
    console.log('Países cargados:', countryList.value);
  } catch (error) {
    console.error('Error al cargar países:', error);
    alert('Error al cargar la lista de países');
  } finally {
    loadingPanel.value = false;
  }
}

// Función para manejar la actualización de usuarios desde el UserList
function handleUserUpdate(users) {
  if (!dataUsuarios.value) {
    dataUsuarios.value = {};
  }

  dataUsuarios.value.userIds = Array.isArray(users) ? users : [];
  console.log('IDs de usuarios actualizados:', dataUsuarios.value.userIds);
}

// para mejorar la carga de ciudades
watch(() => selectedItem.value, async (newValue) => {
  if (newValue) {
    selectedItemCiudad.value = [];
    selectItemParticipantes.value = [];
    
    const ciudades = [];
    ciudades.push({ title: "Todas las ciudades", value: "0" });
    
    const paisSeleccionado = dataCountry.value.find(pais => pais.country === newValue);
    if (paisSeleccionado && paisSeleccionado.data) {
      paisSeleccionado.data.forEach(ciudad => {
        ciudades.push({ title: ciudad.city, value: ciudad.city });
      });
    }

    ciudades.sort(compareByTitle);
    
    const ciudadesUnicas = [...new Set(ciudades.map(ciudad => ciudad.title))];
    cityList.value = ciudadesUnicas;
    
    console.log('Ciudades cargadas:', cityList.value);
  } else {
    cityList.value = [];
    selectItemParticipantes.value = [];
  }
});

async function getMetadatos(){
  try {
    var metadatosTemp = await fetchCategorias();

    var metadatosList = [];
    var metadatosListItems = [];
    for(var i in metadatosTemp){
      metadatosList.push({ title:metadatosTemp[i].__text, value:metadatosTemp[i].__text });
      metadatosListItems.push(metadatosTemp[i].__text);
    }
    selectMetadatos.value = metadatosList;

    metadatosListItems.slice().sort();

    const arraySinDuplicados = metadatosListItems.filter((valor, indice, arreglo) => arreglo.indexOf(valor) === indice);

    metadatosItems.value = arraySinDuplicados;

  } catch (error) {
      console.error("Error al listar todos los metadatos")
  }
}

// const fetchWithTimeout = (url, options, timeout = 10000) => {
//     return Promise.race([
//         fetch(url, options),
//         new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
//     ]);
// };

async function fetchWithTimeout(url, options, timeout = 10000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    
    clearTimeout(id);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('La solicitud tomó demasiado tiempo');
    }
    throw error;
  }
}

// Actualizamos la función updateBulkUsers
async function updateBulkUsers(userIds) {
  try {
    console.log('Iniciando actualización de usuarios:', {
      tempCampaignId: tempCampaignId.value,
      userIds: userIds
    });

    // Verificamos que tengamos un ID de campaña temporal
    if (!tempCampaignId.value) {
      throw new Error('No hay ID de campaña temporal');
    }

    // Verificamos que tengamos usuarios para agregar
    if (!userIds || userIds.length === 0) {
      throw new Error('No hay usuarios para agregar');
    }

    const response = await fetchWithTimeout(
      `https://ads-service.vercel.app/campaign/v2/user/${tempCampaignId.value}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userIds: userIds
        })
      }
    );

    console.log('Respuesta del servidor:', response);

    if (!response.resp) {
      throw new Error(response.error || 'Error al agregar usuarios');
    }

    return response;
  } catch (error) {
    console.error('Error detallado:', error);
    throw new Error(`Error al actualizar usuarios: ${error.message}`);
  }
}

async function getUsuarios(){
  var ciudad = -1;
  var pais = -1;
  var criterioTemp = criterio.value;

  var so_temp = null;
  var dispositivo_temp = null;
  var navegador_temp = null;
  var metadato = null;

  if(criterioTemp.includes("metadatos") || criterioTemp.includes("trazabilidads")){
    pais = (selectedItem.value).length > 0 ? selectedItem.value : -1;
    ciudad = (selectedItemCiudad.value).length > 0 ? selectedItemCiudad.value : -1;
    ciudad = (ciudad=="Todas las ciudes"?-1:ciudad);
  }

  if(criterioTemp.includes("metadatos")){
    metadato = metadatos.value || null;
  }

  if(criterioTemp.includes("dispositivos")){
    dispositivo_temp = selectItemDispositivos.value || null;
  }

  if(criterioTemp.includes("plataforma")){
    so_temp = selectItemSO.value || null;
    navegador_temp = selectItemNavegador.value || null;
  }
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      "metadato": metadato,
      "criterio": criterioTemp,
      "pais": pais,
      "ciudad": ciudad,
      "navegador": navegador_temp,
      "os": so_temp,
      "dispositivo": dispositivo_temp
    });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    //console.log('data enviar ',raw);    
    const send = await fetch('https://ads-service.vercel.app/campaign/v2/usuarios/get/user/total', requestOptions);
    const respuesta = await send.json();    
    //console.log('resp',respuesta);    
    dataUsuarios.value =respuesta;
    //console.log('data total',dataUsuarios.value);

  
}

const consentimiento = ref(false);

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/[áàâä]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôö]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/[ñ]/g, 'n')
    .replace(/[^a-z0-9\-]+/g, '-') // Remover caracteres no alfanuméricos ni guiones
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones bajos
    .replace(/\-\-+/g, '-') // Remover múltiples guiones bajos
    .replace(/^-+/, '') // Remover guiones bajos al inicio
    .replace(/-+$/, ''); // Remover guiones bajos al final
}

// async function onComplete() {
//   var name = nombreCampania.value;
//   var tipoContenido = languages.value;
//   var cri = criterio.value;
//   var po = posicion.value;
//   var script = codigoExternoModel.value || "";
//   var linksWeb = linkAds.value || "#";
//   var urlImagen_1 = linkImageEscritorio.value || "";
//   var urlImagen_2 = linkImageMobile.value || "";
//   var paises_temp = selectedItem.value;

//   var ciudad = -1;
//   var pais = -1;

//   var so_temp = null;
//   var dispositivo_temp = null;
//   var metadato_temp = null;
//   var navegador_temp = null;


//   var ciudades_temp = selectedItemCiudad.value;
//   var participantes_temp = selectItemParticipantes.value;
//   var otroValor_temp = numeroOtroUsuarios.value;

//   var visibilidad = selectItemVisibilidad.value;

//   if(cri.includes("metadatos") || cri.includes("trazabilidads")){
//     pais = (selectedItem.value).length > 0 ? selectedItem.value : -1;
//     ciudad = (selectedItemCiudad.value).length > 0 ? (selectedItemCiudad.value).join(',') : -1;
//   }

//   if(cri.includes("metadatos")){
//     metadato_temp = (metadatos.value).join(',') || null;
//   }

//   if(cri.includes("dispositivos")){
//     dispositivo_temp = (selectItemDispositivos.value).join(',') || null;
//   }

//   if(cri.includes("plataforma")){
//     so_temp = (selectItemSO.value).join(',') || null;
//     navegador_temp = (selectItemNavegador.value).join(',') || null;
//   }

//   // var so_temp = selectItemSO.value;
//   // var dispositivo_temp = selectItemDispositivos.value;
//   // var navegador_temp = selectItemNavegador.value;

//   var jsonEnviar = {
//       "campaignTitle": nombreCampania.value,
//       "description": descripcionCampania.value,
//       "type": languages.value,
//       "criterial": {
//         "visibilitySection": selectItemVisibilidad.value,
//         "country": selectedItem.value || -1,
//         "city": selectedItemCiudad.value?.includes('Todas las ciudades') ? 
//           -1 : 
//           selectedItemCiudad.value?.length > 0 ? selectedItemCiudad.value.join(',') : -1,
//         "so": selectItemSO.value?.length > 0 ? selectItemSO.value.join(',') : null,
//         "dispositivo": selectItemDispositivos.value?.length > 0 ? selectItemDispositivos.value.join(',') : null,
//         "metadato": metadatos.value?.length > 0 ? metadatos.value.join(',') : null,
//         "navegador": selectItemNavegador.value?.length > 0 ? selectItemNavegador.value.join(',') : null
//       },
//       "coleccion": criterio.value.join(','),
//       "position": posicion.value.join(","),
//       "participantes": tipoParticipantes,
//       "otroValor": dataUsuarios.value.total,
//       "userId": dataUsuarios.value.userIds, // Array de IDs de usuarios
//       "userIdRemove": [],
//       "userIdAdd": [],
//       "statusCampaign": true,
//       "urls": {
//         "url": linkAds.value || "#",
//         "img": {
//           "escritorio": linkImageEscritorio.value || "",
//           "mobile": linkImageMobile.value || ""
//         },
//         "html": codigoExternoModel.value || ""
//       },
//       "campaignSlug": slugify(nombreCampania.value)
//     };

//   var myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");
//   var requestOptions = {
//     method: 'POST',
//     headers: myHeaders,
//     body: JSON.stringify(jsonEnviar),
//     redirect: 'follow'
//   };
//   loadingPanel.value=true;
//   var response = await fetch(`https://ads-service.vercel.app/campaign/create`, requestOptions);
//   const data = await response.json();
//   if(data.resp){
//     router.push('/apps/campaigns/list');
//   }else{
//     alert("Un error se presentó: "+data.error)
//   };
//   loadingPanel.value=false;
// }

// Agregar esta función antes de onComplete

function validarFormulario() {
  if (!nombreCampania.value) {
    alert("El nombre de la campaña es obligatorio");
    return false;
  }
  
  if (!descripcionCampania.value) {
    alert("La descripción de la campaña es obligatoria");
    return false;
  }

  if (!languages.value) {
    alert("El tipo de contenido es obligatorio");
    return false;
  }

  if (!posicion.value?.length) {
    alert("Debe seleccionar al menos una posición");
    return false;
  }

  if (!criterio.value?.length) {
    alert("Debe seleccionar al menos un criterio");
    return false;
  }

  return true;
}


async function onComplete() {
  if (!validarFormulario()) {
    return;
  }

  const jsonEnviar = {
    "campaignTitle": nombreCampania.value,
    "description": descripcionCampania.value,
    "type": languages.value,
    "criterial": {
      "visibilitySection": selectItemVisibilidad.value,
      "country": selectedItem.value || -1,
      "city": selectedItemCiudad.value?.includes('Todas las ciudades') ? 
        -1 : 
        selectedItemCiudad.value?.length > 0 ? selectedItemCiudad.value.join(',') : -1,
      "so": selectItemSO.value?.length > 0 ? selectItemSO.value.join(',') : null,
      "dispositivo": selectItemDispositivos.value?.length > 0 ? selectItemDispositivos.value.join(',') : null,
      "metadato": metadatos.value?.length > 0 ? metadatos.value.join(',') : null,
      "navegador": selectItemNavegador.value?.length > 0 ? selectItemNavegador.value.join(',') : null
    },
    "coleccion": criterio.value.join(','),
    "position": posicion.value.join(","),
    "participantes": modoPersonalizado.value ? "personalizado" : "filtrado",
    "otroValor": dataUsuarios.value?.total || 0,
    "userId": modoPersonalizado.value ? 
      (filteredUsers.value?.map(user => user.wylexId) || []) : 
      (dataUsuarios.value?.userIds || []),
    "userIdRemove": [],
    "userIdAdd": [],
    "statusCampaign": true,
    "urls": {
      "url": linkAds.value || "#",
      "img": {
        "escritorio": linkImageEscritorio.value || "",
        "mobile": linkImageMobile.value || ""
      },
      "html": codigoExternoModel.value || ""
    },
    "campaignSlug": slugify(nombreCampania.value),
    "tempCampaignId": tempCampaignId.value // Incluimos el ID temporal
  };

  try {
    loadingPanel.value = true;
    const response = await fetch('https://ads-service.vercel.app/campaign/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonEnviar)
    });

    const data = await response.json();
    
    if (data.resp) {
      router.push('/apps/campaigns/list');
    } else {
      alert("Error al crear la campaña: " + (data.error || 'Error desconocido'));
    }
  } catch (error) {
    console.error("Error al crear la campaña:", error);
    alert("Error al crear la campaña");
  } finally {
    loadingPanel.value = false;
  }
}

async function handleValidation(isValid, tabIndex) {
  if(tabIndex == 1 && isValid == true && dataCountry.value.length < 1){
    await getCountries();

    var paises = [];
    for(var i in dataCountry.value){
      var ins = dataCountry.value[i];
      // paises.push({ title:ins.country, value:ins.country });
      paises.push(ins.country);
    }

    // console.log(paises)
    countryList.value = paises;

  }
  // console.log('Tab: '+tabIndex+ ' valid: '+isValid)
  return false;
}

async function handleValidationChange(prevIndex, nextIndex) {

  return false;
}

async function setLoading(value) {
  loadingWizard.value = value
}

async function validateAsync() {
    var nombre = nombreCampania.value;
    var descripcion = descripcionCampania.value;
    var tipoC = languages.value;
    var crit = criterio.value; // Agregamos esta línea
    var pos = posicion.value;
    var visibilidad = selectItemVisibilidad.value;
  
    if(nombre.length < 1 || nombre.trim() == ""){
      alert("Debes añadir un nombre de campaña");
      return false;
    }
  
    if(descripcion.length < 1 || descripcion.trim() == ""){
      alert("Debes añadir una descripción de campaña");
      return false;
    }
  
    if(tipoC.length < 1){
      alert("Debes añadir un tipo de contenido");
      return false;
    }
  
    if(crit.length < 1){
      alert("Debes añadir al menos un criterio");
      return false;
    }
  
    if(pos.length < 1){
      alert("Debes añadir la posicion del ads");
      return false;
    }
  
    if(visibilidad.length < 1){
      alert("Debes añadir la La visibilidad en el sitio web");
      return false;
    }
  
    return true;
  }
async function validateAsyncInsercion() {
  var nombre = nombreCampania.value;
  var tipoC = languages.value;
  var crit = criterio.value;
  var pos = posicion.value;
  var codigoExterno = codigoExternoModel.value;
  var linkAdsL = linkAds.value;
  var linkImageEscritorioL = linkImageEscritorio.value;
  var linkImageMobileL = linkImageMobile.value;

  if(tipoC != "imagen"){
    if(codigoExterno.length < 1 || codigoExterno == ""){
      alert("Debe ingresar el código");
      return false;
    }
  }else{
    if(linkAdsL.length < 1 || linkAdsL == ""){
      alert("Debe ingresar el link");
      return false;
    }
    if(linkImageEscritorioL.length < 1 || linkImageEscritorioL == ""){
      alert("Debe ingresar el link de la imagen para dispositivos de escritorio");
      return false;
    }
    if(linkImageMobileL.length < 1 || linkImageMobileL == ""){
      alert("Debe ingresar el link de la imagen para dispositivos responsive");
      return false;
    }
  }

  return true;
}

async function validateAsyncCriterio() {
  var nombre = nombreCampania.value;
  var tipoC = languages.value;
  var crit = criterio.value;
  var pos = posicion.value;
  var codigoExterno = codigoExternoModel.value;
  var linkAdsL = linkAds.value;
  var linkImageEscritorioL = linkImageEscritorio.value;
  var linkImageMobileL = linkImageMobile.value;

  if(tipoC != "Local"){
    if(codigoExterno.length < 1 || codigoExterno == ""){
      alert("Debe ingresar el código");
      return false;
    }
  }else{
    if(linkAdsL.length < 1 || linkAdsL == ""){
      alert("Debe ingresar el link");
      return false;
    }
    if(linkImageEscritorioL.length < 1 || linkImageEscritorioL == ""){
      alert("Debe ingresar el link de la imagen para dispositivos de escritorio");
      return false;
    }
    if(linkImageMobileL.length < 1 || linkImageMobileL == ""){
      alert("Debe ingresar el link de la imagen para dispositivos responsive");
      return false;
    }
  }

  return true;
}


const errorMessages = computed(() => numeroRules.map(rule => rule(numeroOtroUsuarios.value)).filter(Boolean));
const hasErrors = computed(() => errorMessages.value.length > 0);

async function validateAsyncUsuarios() {
  var pais = selectedItem.value;
  var ciudad = selectedItemCiudad.value;

  // console.log(ciudad)
  var crit = criterio.value;
  var participantes = selectItemParticipantes.value;
  var numeroOtrosUsuarios = numeroOtroUsuarios.value;
  var dispositivos_temp = selectItemDispositivos.value;
  var metadatos_temp = metadatos.value;
  var selectItemSO_temp = selectItemSO.value;
  var selectItemNavegador_temp = selectItemNavegador.value;
  var selectedItem_temp = selectedItem.value;
  var selectedItemCiudad_temp = selectedItemCiudad.value;


  if(crit.includes("dispositivos")){
    if(dispositivos_temp.length < 1 || dispositivos_temp == ""){
      alert("Debe seleccionar un dispositivo");
      return false;
    }
  }

  if(crit.includes("metadatos")){
    if(metadatos_temp.length < 1 || metadatos_temp == ""){
      alert("Debe seleccionar al menos 1 metadato");
      return false;
    }
  }

  if(crit.includes("plataforma")){
    if(selectItemSO_temp.length < 1 || selectItemSO_temp == ""){
      alert("Debe seleccionar al menos 1 SO");
      return false;
    }

    if(selectItemNavegador_temp.length < 1 || selectItemNavegador_temp == ""){
      alert("Debe seleccionar al menos 1 Navegador");
      return false;
    }
  }

  if(crit.includes("trazabilidads")){
    if(selectedItem_temp.length < 1 || selectedItem_temp == ""){
      alert("Debe seleccionar al menos 1 país");
      return false;
    }

    if(selectedItemCiudad_temp.length < 1 || selectedItemCiudad_temp == ""){
      alert("Debe seleccionar al menos 1 ciudad");
      return false;
    }

  }

  if(participantes.length < 1 || participantes == ""){
    alert("Debes ingresar el número de participantes");
    return false;
  }

  if(participantes == 'Otro'){
    if(numeroOtrosUsuarios < 1 || numeroOtrosUsuarios == ""){
      alert("Debes ingresar el valor correspondiente para el número de participantes");
      return false;
    }

  }

  if(participantes == ''){
    alert("Debes seleccionar la cantidad de usuarios");
    return false;
  }
  return true;
}

function compareByTitle(a, b) {
  if (a.title === "Todas las ciudes") {
    return -1; // El elemento "Todas las ciudes" se mantiene en el primer lugar
  } else if (b.title === "Todas las ciudes") {
    return 1;
  } else {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  }
}

function groupByTitleWithAttributes(arr) {
  const grouped = {};

  for (const item of arr) {
    const title = item.title;
    if (!grouped[title]) {
      grouped[title] = [];
    }
    grouped[title].push(item.value);
  }

  const result = [];
  for (const title in grouped) {
    if (grouped.hasOwnProperty(title)) {
      result.push({
        title: title,
        value: grouped[title][0]
      });
    }
  }

  return result;
}


watch(() => selectedItem.value, (newValue, oldValue) => {
  if(selectedItem.value != null){

    selectedItemCiudad.value = [];
    selectItemParticipantes.value = [];
    var ciudades = [];
    ciudades.push({ title: "Todas las ciudes", value: "0" });
    for(var i in dataCountry.value){
      var ins = dataCountry.value[i];
      if(ins.country == newValue){
        for(var j in ins.data){
          var ins2 = ins.data[j];
          ciudades.push({ title:ins2.city, value:ins2.city });
        }
      }
    }

    ciudades.sort(compareByTitle);
    // console.log(Object.values(groupByTitle(ciudades)))
    var ciudadesTemp_2 = Object.values(groupByTitleWithAttributes(ciudades));
    var ciudadesSi = [];
    for(var i in ciudadesTemp_2){
      ciudadesSi.push(ciudadesTemp_2[i].title);
    }
    cityList.value = ciudadesSi;

    console.log(cityList.value)
  }else{
    cityList.value = [];
    selectItemParticipantes.value = [];
  }
});

function generateRandomIntegers(min, max, count) {
  const randomIntegers = [];

  for (let i = 0; i < count; i++) {
    let randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    
    // Asegurarse de que el número termine en 0
    if (randomInt % 10 !== 0) {
      randomInt += 10 - (randomInt % 10);
    }

    randomIntegers.push(randomInt);
  }

  return randomIntegers;
}

async function generarOtrosValores(){
  maxValue.value = dataUsuarios.value.total;
  minValue.value = 1;
  if(dataUsuarios.value.total < 100){
    selectItemsList.value = [{ title:'Todos', value: 'Todos' },{ title:'Otro valor', value: 'Otro' }];
  }else{
    var numeros = generateRandomIntegers(100, dataUsuarios.value.total, 3);
    var items = [];
    items.push({ title:'Otro valor', value: 'Otro' });
    if(dataUsuarios.value.total > 110){
      for(var i in numeros){
        items.push({ title:numeros[i], value: numeros[i] });
      }
    }
    items.push({ title:'Todos', value: 'Todos' });
    selectItemsList.value = items;
  }

  return true;
}

watch(async () => selectedItemCiudad.value,async  (newValue, oldValue) => {
  if(cityList.value.length > 1){
    if(selectedItemCiudad.value != null){
      loadingPanel.value=true;
      clearTimeout(timeoutId.value);
      timeoutId.value = setTimeout(async () => {
        await getUsuarios();
        loadingPanel.value=false;
      }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada
      await generarOtrosValores();
    }else{
      dataUsuarios.value = {};
    }
  }
  // selectItemsList.value = [100, 200, 1000, "Otro"];
});

watch(async () => selectItemDispositivos.value,async  (newValue, oldValue) => {
  if(selectItemDispositivos.value != null){
    loadingPanel.value=true;
    clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(async () => {
      await getUsuarios();
      loadingPanel.value=false;
    }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada
    await generarOtrosValores();
  }else{
    dataUsuarios.value = {};
  }

  // selectItemsList.value = [100, 200, 1000, "Otro"];
});

watch(async () => selectItemSO.value,async  (newValue, oldValue) => {
  // console.log('Nuevo valor seleccionado:', newValue);
  // console.log('Valor anterior:', oldValue);
  loadingPanel.value=true;
    clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(async () => {
      await getUsuarios();
      loadingPanel.value=false;
    }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada
    await generarOtrosValores();

  // selectItemsList.value = [100, 200, 1000, "Otro"];
});


watch(async () => selectItemNavegador.value,async  (newValue, oldValue) => {
  if(selectItemNavegador.value != null){
    loadingPanel.value=true;
    clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(async () => {
      await getUsuarios();
      loadingPanel.value=false;
    }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada
    await generarOtrosValores();
  }else{
    dataUsuarios.value = {};
  }

});



watch(async () => metadatos.value,async  (newValue, oldValue) => {

  if(metadatos.value != null){
    loadingPanel.value=true;
    clearTimeout(timeoutId.value);
    timeoutId.value = setTimeout(async () => {
      await getUsuarios();
      loadingPanel.value=false;
    }, timeoutSegundos); // Espera 1000 milisegundos antes de realizar la llamada
    await generarOtrosValores();
  }else{
    dataUsuarios.value = {};
  }

});

// Agregar estas variables en la sección de variables ref
const filterLocal = ref('');
const currentPageLocal = ref(1);
// const timeoutId = ref(null);
const filteredUsers = ref([]);
const showSearchDialog = ref(false);
const searchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const searchTimeout = ref(null);
const loadingAdd = ref(false);
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});
const usersData = ref([]); // Para almacenar la lista de usuarios

// Agregar estos métodos
async function refreshUserData() {
  if (!tempCampaignId.value) return;
  
  try {
    const response = await fetch(`https://ads-service.vercel.app/campaign/${tempCampaignId.value}/user`);
    const data = await response.json();
    if (data && data[0]) {
      usersData.value = data[0].userId;
      filteredUsers.value = data[0].userId;
      // Actualizar dataUsuarios para mantener sincronización
      dataUsuarios.value = {
        ...dataUsuarios.value,
        userIds: data[0].userId.map(user => user.wylexId)
      };
    }
  } catch (error) {
    console.error('Error al actualizar datos:', error);
  }
}

async function handleAddSpecificUser(user) {
  loadingAdd.value = true;
  try {
    const response = await fetch(`https://ads-service.vercel.app/campaign/add-user/${tempCampaignId.value}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.wylexId
      })
    });

    const data = await response.json();
    if (data.resp) {
      snackbar.value = {
        show: true,
        text: 'Usuario agregado exitosamente',
        color: 'success'
      };
      await refreshUserData();
    } else {
      throw new Error(data.error || 'Error al agregar usuario');
    }
  } catch (error) {
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: 'error'
    };
  } finally {
    loadingAdd.value = false;
  }
}


// Agregar computed properties
const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / 10); // 10 usuarios por página
});

const currentUsers = computed(() => {
  const start = (currentPageLocal.value - 1) * 10;
  const end = start + 10;
  return filteredUsers.value.slice(start, end);
});


// Agregar estas variables ref
const tempCampaignId = ref('');

// Función para generar ID temporal
function generateTempId() {
  return 'temp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Agregar watch para modoPersonalizado
watch(() => modoPersonalizado.value, async (newValue) => {
  if (newValue) {
    if (!tempCampaignId.value) {
      tempCampaignId.value = generateTempId();
      console.log('ID temporal generado:', tempCampaignId.value);
    }
    await refreshUserData();
  }
});

// Agregar estas variables ref
const isUploading = ref(false);
const fileInput = ref(null);

// Agregar computed property para controlar la visibilidad de elementos
const hasUsers = computed(() => {
  return filteredUsers.value && filteredUsers.value.length > 0;
});

// Función para manejar el click en el botón de importar
function triggerFileInput() {
  if (fileInput.value) {
    fileInput.value.click();
  }
}

// Función actualizada para manejar el archivo CSV
async function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.name.endsWith('.csv')) {
    snackbar.value = {
      show: true,
      text: 'Por favor, selecciona un archivo CSV',
      color: 'error'
    };
    event.target.value = '';
    return;
  }

  isUploading.value = true;

  try {
    const Papa = (await import('papaparse')).default;

    Papa.parse(file, {
      header: true,
      complete: async (result) => {
        try {
          if (!result.data || !result.data.length) {
            throw new Error('El archivo está vacío');
          }

          console.log('Datos del CSV:', result.data);

          const userIds = result.data
            .filter(row => row.id && row.id.trim() !== '')
            .map(row => parseInt(row.id))
            .filter(id => !isNaN(id));

          console.log('IDs filtrados:', userIds);

          if (userIds.length === 0) {
            throw new Error('No se encontraron IDs válidos en el archivo');
          }

          if (userIds.length > 30000) {
            throw new Error('El máximo es 30,000 usuarios');
          }

          // Procesamos los usuarios en lotes de 1000 para evitar sobrecarga
          const batchSize = 1000;
          for (let i = 0; i < userIds.length; i += batchSize) {
            const batch = userIds.slice(i, i + batchSize);
            await updateBulkUsers(batch);
            
            // Actualizamos el progreso
            snackbar.value = {
              show: true,
              text: `Procesando... ${Math.min((i + batchSize), userIds.length)} de ${userIds.length} usuarios`,
              color: 'info'
            };
          }

          snackbar.value = {
            show: true,
            text: `${userIds.length} usuarios procesados exitosamente`,
            color: 'success'
          };

          await refreshUserData();
        } catch (error) {
          console.error('Error procesando archivo:', error);
          snackbar.value = {
            show: true,
            text: `Error: ${error.message}`,
            color: 'error'
          };
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
        snackbar.value = {
          show: true,
          text: `Error al procesar el archivo: ${error.message}`,
          color: 'error'
        };
      }
    });
  } catch (error) {
    console.error('Error general:', error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: 'error'
    };
  } finally {
    isUploading.value = false;
    event.target.value = '';
  }
}

// Función de exportación actualizada
async function handleExport() {
  if (!hasUsers.value) return;

  try {
    const Papa = (await import('papaparse')).default;
    
    const csvData = Papa.unparse(filteredUsers.value.map(user => ({
      id: user.wylexId,
      nombre: `${user.firstname || user.first_name} ${user.lastname || user.last_name}`,
      email: user.email
    })));

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `usuarios_campana_${nombreCampania.value}_${new Date().toISOString()}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    snackbar.value = {
      show: true,
      text: 'Error al exportar usuarios',
      color: 'error'
    };
  }
}
</script>