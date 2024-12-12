<template>
    <div class="position-relative">
      <VRow>
        <!-- Primera fila: Dos tarjetas 6-6 -->
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
              <VCol cols="12" md="12">
                <label for="tipocontenido">Escoge una sección</label>
              </VCol>
              <VCol cols="12" md="12">
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
            <VRow>
              <!-- Primera columna: Filtros y campos condicionales -->
              <VCol cols="12" md="6">
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
                <!-- Metadatos -->
                <VCol cols="12" :class="criterio.includes('metadatos')?'':'d-none'">
                  <VRow no-gutters>
                    <VCol cols="12">
                      <VRow no-gutters>
                        <VCol cols="12" md="12">
                          <label for="metadatos">Metadatos</label>
                        </VCol>
                        <VCol cols="12" md="12">
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

                <!-- Geolocalización -->
                <VCol cols="12" :class="criterio.includes('trazabilidads')?'':'d-none'">
                  <VRow no-gutters>
                    <VCol cols="6">
                      <VRow no-gutters>
                        <VCol cols="12" md="12">
                          <label for="email">Países</label>
                        </VCol>
                        <VCol cols="12" md="12">
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
                        <VCol cols="12" md="12">
                          <label for="email">Ciudades</label>
                        </VCol>
                        <VCol cols="12" md="12">
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

                <!-- Dispositivos -->
                <VCol cols="12" :class="criterio.includes('dispositivos')?'':'d-none'">
                  <VRow no-gutters>
                    <VCol cols="12">
                      <VRow no-gutters>
                        <VCol cols="12" md="12">
                          <label for="email">Dispositivos</label>
                        </VCol>
                        <VCol cols="12" md="12">
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

                <!-- Plataforma -->
                <VCol cols="12" :class="criterio.includes('plataforma')?'':'d-none'">
                  <VRow no-gutters>
                    <VCol cols="6 pt-2">
                      <VRow no-gutters>
                        <VCol cols="12" md="12">
                          <label for="navegador">Sistema operativo</label>
                        </VCol>
                        <VCol cols="12" md="12">
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
                        <VCol cols="12" md="12">
                          <label for="navegador">Navegador</label>
                        </VCol>
                        <VCol cols="12" md="12">
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

              <!-- Separador vertical -->
              <VDivider vertical />

              <!-- Segunda columna: Personalizado -->
              <VCol cols="12" md="6">
                <div class="d-flex flex-column align-center justify-center h-100">
                  <h3 class="mb-4">Personalizado</h3>
                  <VBtn 
                    color="primary"
                    @click="openModal"
                  >
                    Añadir usuarios específicos
                  </VBtn>
                </div>
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
      <VIcon icon="mdi-check" />
    </VBtn>
  </div>
</template>
  
<script setup>
import { useCategoriasListStore } from "@/views/apps/categorias/useCategoriasListStore";
import Papa from 'papaparse';
import { computed, onMounted, ref, watch } from 'vue';
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

  
  const timeoutId = ref(null);
  const timeoutSegundos = 3000;
  
  const nombreCampania = ref('')
  const descripcionCampania = ref('');
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
  const dataUsuarios = ref({
    total: 0,
    userIds: []
  });
  
  const selectItemParticipantes = ref(null);
  const selectItemsList = ref([
    { title:'Usuarios específicos', value: 'Usuarios específicos' },
    { title:'Todos', value: 'Todos' }
  ]);
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
  

  
  const numeroRules = computed(() => [
    (v) => (selectItemParticipantes.value === 'Otro' && !files_csv.value.length && !v) ? 'El número es requerido' : true,
    (v) => /^\d+$/.test(v) || 'Ingrese solo números',
    (v) => {
      if (!dataUsuarios.value?.total) return true;
      return v <= dataUsuarios.value.total || `El número no puede ser mayor a ${dataUsuarios.value.total}`;
    }
  ]);
  
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

watch(() => selectedItem.value, (newValue) => {
  if (newValue) {
    // Reset selecciones
    selectedItemCiudad.value = []
    cityList.value = ['Todas las ciudes']
    
    // Encontrar el país seleccionado
    const selectedCountry = dataCountry.value.find(country => country.country === newValue)
    if (selectedCountry) {
      // Agregar las ciudades al listado
      cityList.value = [
        'Todas las ciudes',
        ...selectedCountry.data.map(city => city.city)
      ]
    }
  } else {
    cityList.value = []
    selectedItemCiudad.value = []
  }
})

async function getCountries() {
  loadingPanel.value = true
  try {
    const response = await fetch('https://ecuavisa-suscripciones.vercel.app/otros/obtener-paises-ciudades')
    const data = await response.json()
    console.log('Countries data:', data) // Para debug
    dataCountry.value = data
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loadingPanel.value = false
  }
}

// Al montar
onMounted(() => {
  getCountries()
})
  // para añadir csv de usuarios
  const files_csv = ref([]);
  const files_loading = ref(false);
  const files_csv_mensaje = ref("");
  const usuarios_traidos_del_csv = ref([]);
  
  
  watch(posicion, value => {
    if (value.length > 1)
      nextTick(() => posicion.value.pop())
  })
  
  watch(metadatos, value => {
    if (value.length > 5)
      nextTick(() => metadatos.value.pop())
  })
  
  
 onMounted(getMetadatos)
  onMounted(() => {
  getCountries()
})
  
  function dividirArray(original, tamano = 500) {
    const resultado = [];
    for (let i = 0; i < original.length; i += tamano) {
      const trozo = original.slice(i, i + tamano);
      resultado.push(trozo);
    }
    return resultado;
  }
  
  async function handleFileChange(event) {
    const file = event.target.files[0];
    if (!file) {
      console.log('No se seleccionó archivo');
      return;
    }
  
    if (!file.name.endsWith('.csv')) {
      alert('Por favor, selecciona un archivo CSV.');
      files_csv.value = [];
      return;
    }
  
    try {
      files_loading.value = true;
      files_csv_mensaje.value = "Procesando archivo...";
  
      Papa.parse(file, {
        header: true,
        dynamicTyping: false,
        complete: (result) => {
          try {
            if (!result.data || !result.data.length) {
              throw new Error('El archivo está vacío');
            }
  
            const csvData = result.data;
            console.log('Datos CSV raw:', csvData);
            
            if (!csvData[0]?.id) {
              throw new Error('El archivo no tiene un formato válido. Debe contener una columna "id".');
            }
  
            // Filtramos y convertimos explícitamente a números
            let dataNormal = csvData
              .filter(row => row.id && row.id.trim() !== '')
              .map(row => {
                const parsedId = isNaN(row.id) ? row.id : parseInt(row.id);
                return parsedId;
              });
  
            console.log('IDs procesados:', dataNormal);
  
            if (dataNormal.length > 30000) {
              throw new Error('La cantidad de usuarios no debe pasar de 30 mil.');
            }
  
            if (dataNormal.length === 0) {
              throw new Error('No se encontraron IDs válidos en el archivo.');
            }
  
            usuarios_traidos_del_csv.value = dataNormal;
            dataUsuarios.value = { total: dataNormal.length, usuarios: dataNormal };
            files_csv_mensaje.value = `${dataNormal.length} usuarios procesados correctamente`;
  
          } catch (error) {
            console.error('Error en el procesamiento:', error);
            alert(error.message);
            files_csv.value = [];
            files_csv_mensaje.value = "";
            usuarios_traidos_del_csv.value = [];
          } finally {
            files_loading.value = false;
          }
        },
        error: (error) => {
          console.error('Error al parsear CSV:', error);
          alert('Error al procesar el archivo: ' + error.message);
          files_loading.value = false;
          files_csv.value = [];
          files_csv_mensaje.value = "";
          usuarios_traidos_del_csv.value = [];
        }
      });
  
    } catch (error) {
      console.error('Error general:', error);
      alert('Error al procesar el archivo: ' + error.message);
      files_loading.value = false;
      files_csv.value = [];
      files_csv_mensaje.value = "";
      usuarios_traidos_del_csv.value = [];
    }
  }
 
  
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
  
  const fetchWithTimeout = (url, options, timeout = 10000) => {
      return Promise.race([
          fetch(url, options),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
      ]);
  };
  
  async function getUsuarios(){
    try {
      var criterioTemp = criterio.value;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      
      var raw = JSON.stringify({
        "metadato": (metadatos.value) || null,
        "criterio": criterioTemp,
        "pais": (selectedItem.value?.length > 0) ? selectedItem.value : -1,
        "ciudad": (selectedItemCiudad.value?.length > 0) ? selectedItemCiudad.value : -1,
        "navegador": selectItemNavegador.value || null,
        "os": selectItemSO.value || null,
        "dispositivo": selectItemDispositivos.value || null
      });
  
      console.log("Parámetros de búsqueda:", raw);
  
      const response = await fetch('https://ads-service.vercel.app/campaign/v2/usuarios/get/user/total', {
        method: 'POST',
        headers: myHeaders,
        body: raw
      });
  
      const datos = await response.json();
      console.log("Respuesta de usuarios:", datos);
  
      dataUsuarios.value = {
        total: datos.total || 0,
        userIds: datos.userIds || []  // Asegúrate que el backend devuelve este campo
      };
  
      return true;
    } catch (error) {
      console.error("Error en getUsuarios:", error);
      dataUsuarios.value = { total: 0, userIds: [] };
      return false;
    }
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
  
  async function onComplete() {
    var name = nombreCampania.value;
    var description = descripcionCampania.value;
    var tipoContenido = languages.value;
    var cri = criterio.value;
    var po = posicion.value;
    var script = codigoExternoModel.value || "";
    var linksWeb = linkAds.value || "#";
    var urlImagen_1 = linkImageEscritorio.value || "";
    var urlImagen_2 = linkImageMobile.value || "";
    var paises_temp = selectedItem.value;
    var ciudad = -1;
    var pais = -1;
    var so_temp = null;
    var dispositivo_temp = null;
    var metadato_temp = null;
    var navegador_temp = null;
    var visibilidad = selectItemVisibilidad.value;
  
    // Obtener los IDs basados en la selección
    let userIds = [];
    if (selectItemParticipantes.value === 'Todos') {
      userIds = dataUsuarios.value.usuarios || [];
    } else if (selectItemParticipantes.value === 'Usuarios específicos') {
      if (!usuarios_traidos_del_csv.value || !usuarios_traidos_del_csv.value.length) {
        alert('No hay usuarios cargados del CSV');
        return;
      }
      userIds = [...usuarios_traidos_del_csv.value];
    }
  
    console.log('UserIds a enviar:', userIds);
  
    if(cri.includes("metadatos") || cri.includes("trazabilidads")) {
      pais = (selectedItem.value).length > 0 ? selectedItem.value : -1;
      ciudad = (selectedItemCiudad.value).length > 0 ? (selectedItemCiudad.value).join(',') : -1;
    }
  
    if(cri.includes("metadatos")) {
      metadato_temp = (metadatos.value).join(',') || null;
    }
  
    if(cri.includes("dispositivos")) {
      dispositivo_temp = (selectItemDispositivos.value).join(',') || null;
    }
  
    if(cri.includes("plataforma")) {
      so_temp = (selectItemSO.value).join(',') || null;
      navegador_temp = (selectItemNavegador.value).join(',') || null;
    }
  
    var jsonEnviar = {
      "campaignTitle": name,
      "description": description,
      "type": tipoContenido,
      "criterial": {
        "visibilitySection": visibilidad,
        "country": pais,
        "city": ciudad,
        "so": so_temp,
        "dispositivo": dispositivo_temp,
        "metadato": metadato_temp,
        "navegador": navegador_temp
      },
      "coleccion": cri.join(','),
      "position": po.join(","),
      "participantes": selectItemParticipantes.value,
      "otroValor": userIds.length,
      "userId": userIds,
      "urls": {
        "url": linksWeb,
        "img": {
          "escritorio": urlImagen_1,
          "mobile": urlImagen_2
        },
        "html": script
      },
      "campaignSlug": slugify(name)
    };
  
    console.log('JSON a enviar:', JSON.stringify(jsonEnviar, null, 2));
  
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(jsonEnviar),
      redirect: 'follow'
    };
  
    loadingPanel.value = true;
    try {
      var response = await fetch(`https://ads-service.vercel.app/campaign/create`, requestOptions);
      const data = await response.json();
      if(data.resp) {
        router.push('/apps/campaigns/list');
      } else {
        alert("Un error se presentó: " + (data.error || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error al crear campaña:', error);
      alert("Error al crear la campaña: " + error.message);
    } finally {
      loadingPanel.value = false;
    }
  }
  
  async function handleValidationChange(prevIndex, nextIndex) {
    // console.log('prevIndex: '+prevIndex+ ' nextIndex: '+nextIndex)
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
    var crit = criterio.value;
    var participantes = selectItemParticipantes.value;
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
  
    if(crit.length < 1 || crit == ""){
      alert("Debes ingresar el criterio");
      return false;
    }
  
    if(participantes.length < 1 || participantes == ""){
      alert("Debes ingresar el número de participantes");
      return false;
    }
  
    if (selectItemParticipantes.value === 'Usuarios específicos') {
      if (!files_csv.value || files_csv.value.length === 0) {
        alert("Debe subir un archivo CSV con los usuarios");
        return false;
      }
  
      if (!usuarios_traidos_del_csv.value || usuarios_traidos_del_csv.value.length === 0) {
        alert("No se han procesado usuarios del CSV");
        return false;
      }
    }
  
    return true;
  }
  
  
//   function compareByTitle(a, b) {
//     if (a.title === "Todas las ciudes") {
//       return -1; // El elemento "Todas las ciudes" se mantiene en el primer lugar
//     } else if (b.title === "Todas las ciudes") {
//       return 1;
//     } else {
//       if (a.title < b.title) {
//         return -1;
//       }
//       if (a.title > b.title) {
//         return 1;
//       }
//       return 0;
//     }
//   }
  
//   function groupByTitleWithAttributes(arr) {
//     const grouped = {};
  
//     for (const item of arr) {
//       const title = item.title;
//       if (!grouped[title]) {
//         grouped[title] = [];
//       }
//       grouped[title].push(item.value);
//     }
  
//     const result = [];
//     for (const title in grouped) {
//       if (grouped.hasOwnProperty(title)) {
//         result.push({
//           title: title,
//           value: grouped[title][0]
//         });
//       }
//     }
  
//     return result;
//   }
  
  
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
    
    // Simplificamos para mostrar solo las dos opciones que necesitamos
    selectItemsList.value = [
      { title: 'Usuarios específicos', value: 'Usuarios específicos' },
      { title: 'Todos', value: 'Todos' }
    ];
  
    return true;
  }
  
  watch(async () => selectedItemCiudad.value,async  (newValue, oldValue) => {
    // console.log('Nuevo valor seleccionado:', newValue);
    // console.log('Valor anterior:', oldValue);
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
    // console.log('Nuevo valor seleccionado:', newValue);
    // console.log('Valor anterior:', oldValue);
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
    // console.log('Nuevo valor seleccionado:', newValue);
    // console.log('Valor anterior:', oldValue);
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
  
    // selectItemsList.value = [100, 200, 1000, "Otro"];
  });
  
  
  
  watch(async () => metadatos.value,async  (newValue, oldValue) => {
    // console.log('Nuevo valor seleccionado:', newValue);
    // console.log('Valor anterior:', oldValue);
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
  
    // selectItemsList.value = [100, 200, 1000, "Otro"];
  });
  
  
  </script>