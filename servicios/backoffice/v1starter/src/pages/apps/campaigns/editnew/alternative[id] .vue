<script setup>
import { useCategoriasListStore } from "@/views/apps/categorias/useCategoriasListStore";
import { computed, nextTick, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FormWizard, TabContent } from "vue3-form-wizard";
import 'vue3-form-wizard/dist/style.css';
import UserList from './modal-usuarios.vue';

// Router y Store setup
const router = useRouter();
const route = useRoute();
const categoriasListStore = useCategoriasListStore();

// Estado básico
const currentTab = ref('tab-lista');
const loadingWizard = ref(false);
const loadingPanel = ref(false);
const loadComponent = ref(true);
const showUserModal = ref(false);

// Datos de campaña
const nombreCampania = ref('');
const descripcionCampania = ref('');
const languages = ref([]);
const criterio = ref([]);
const posicion = ref([]);
const metadatos = ref([]);
const campaignUsers = ref([]);
const selectItemVisibilidad = ref([]);

// URLs y códigos
const codigoExternoModel = ref('');
const linkAds = ref('');
const linkImageEscritorio = ref('');
const linkImageMobile = ref('');

// Datos de geolocalización
const selectedItem = ref([]);
const selectedItemCiudad = ref([]);
const cityList = ref([]);
const countryList = ref([]);
const dataCountry = ref([]);

// Criterios y selecciones
const selectItemDispositivos = ref([]);
const selectItemNavegador = ref([]);
const selectItemSO = ref([]);
const metadatosItems = ref([]);
const selectMetadatos = ref(null);

// Timeout y manejo de búsqueda
const timeoutId = ref(null);
const timeoutSegundos = 3000;
const search = ref(null);
const searchMetadatos = ref([]);
const searchCiudades = ref([]);

// Notificaciones
const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

// Listas constantes
const languageList = [
  { title: 'Imágenes locales', value: 'imagen' },
  { title: 'Código HTML', value: 'html' },
  { title: 'Códigos ADS', value: 'script' }
];

const criterioList = [
  { title: 'Geolocalización', value: 'trazabilidads' },
  { title: 'Dispositivos', value: 'dispositivos' },
  { title: 'Metadatos', value: 'metadatos' },
  { title: 'Plataforma', value: 'plataforma' }
];

const selectItemsListVisibilidad = [
  { title: 'Todo el sitio', value: 'all' },
  { title: 'Lo-ultimo', value: 'Lo-ultimo' },
  { title: 'Noticias', value: 'Noticias' },
  { title: 'Mundo', value: 'Mundo' },
  { title: 'Estadio', value: 'Estadio' },
  { title: 'Entretenimiento', value: 'Entretenimiento' },
  { title: 'Programas', value: 'Programas' },
  { title: 'Tendencias', value: 'Tendencias' },
  { title: 'Home', value: 'Home' }
];

const selectItemsListDispositivos = [
  { title: 'Escritorio', value: 'desktop', avatar: 'mdi-laptop-chromebook' },
  { title: 'Móvil', value: 'movil', avatar: 'mdi-cellphone-android' }
];

const selectItemsListNavegador = [
  { title: 'Chrome', value: 'Chrome' },
  { title: 'Safari', value: 'Safari' },
  { title: 'Firefox', value: 'Firefox' },
  { title: 'Otro', value: 'Otro' }
];

const selectItemsListSO = [
  { title: 'Windows', value: 'Windows', avatar: 'tabler-brand-windows', 
    navegador: ['Chrome', 'Firefox'] },
  { title: 'Mac OS', value: 'Mac OS', avatar: 'tabler-brand-apple',
    navegador: ['Safari', 'Chrome'] },
  { title: 'Android', value: 'Android', avatar: 'tabler-brand-android',
    navegador: ['Chrome', 'Firefox'] },
  { title: 'Linux', value: 'Linux', avatar: 'mdi-linux',
    navegador: ['Chrome'] },
  { title: 'Otro', value: 'Otro', avatar: 'mdi-account',
    navegador: ['Chrome'] }
];

// Computed properties
const totalUsers = computed(() => {
  return campaignUsers.value?.length || 0;
});

// Mounted hook
onMounted(async () => {
  try {
    loadComponent.value = true;
    
    await Promise.all([
      getCountries(),
      getCampaignToEdit(),
      getMetadatos()
    ]);
    
  } catch (error) {
    console.error("Error en mounted:", error);
    snackbar.value = {
      show: true,
      text: 'Error al cargar la campaña',
      color: 'error'
    };
  } finally {
    loadComponent.value = false;
  }
});

// API Calls
async function getMetadatos() {
  try {
    const metadatosTemp = await fetchCategorias();
    const metadatosList = [];
    const metadatosListItems = [];
    
    for (const item of metadatosTemp) {
      metadatosList.push({ title: item.__text, value: item.__text });
      metadatosListItems.push(item.__text);
    }
    
    selectMetadatos.value = metadatosList;
    metadatosItems.value = [...new Set(metadatosListItems)].sort();
  } catch (error) {
    console.error("Error al listar metadatos:", error);
  }
}

async function getCountries() {
  try {
    loadingPanel.value = true;
    const response = await fetch('https://ecuavisa-suscripciones.vercel.app/otros/obtener-paises-ciudades');
    dataCountry.value = await response.json();
    
    // Preparar lista de países
    countryList.value = dataCountry.value.map(item => item.country).sort();
  } catch (error) {
    console.error("Error al obtener países:", error);
    snackbar.value = {
      show: true,
      text: 'Error al cargar países',
      color: 'error'
    };
  } finally {
    loadingPanel.value = false;
  }
}

async function getCampaignHeader() {
  try {
    loadingPanel.value = true;
    
    const [campaignResponse] = await Promise.all([
      fetch(`https://ads-service.vercel.app/campaign/get/edit/${route.params.id}/`)
    ]);
    
    const campaignData = await campaignResponse.json();
    if (!campaignData || !campaignData[0]) {
      throw new Error('No se recibieron datos de la campaña');
    }

    const campaign = campaignData[0];
    
    // Asignar datos básicos
    nombreCampania.value = campaign.campaignTitle;
    descripcionCampania.value = campaign.description || '';
    languages.value = campaign.type || '';
    criterio.value = campaign.coleccion ? campaign.coleccion.split(',') : [];
    posicion.value = campaign.position ? campaign.position.split(',') : [];
    
    // Asignar criterios
    if (campaign.criterial) {
      selectItemVisibilidad.value = campaign.criterial.visibilitySection || "all";
      metadatos.value = campaign.criterial.metadato ? campaign.criterial.metadato.split(',') : [];
      
      if (campaign.criterial.country && campaign.criterial.country !== -1) {
        selectedItem.value = campaign.criterial.country;
        if (campaign.criterial.city && campaign.criterial.city !== -1) {
          selectedItemCiudad.value = campaign.criterial.city.split(',');
        }
      }
      
      if (campaign.criterial.dispositivo) {
        selectItemDispositivos.value = campaign.criterial.dispositivo.split(',');
      }
      
      if (campaign.criterial.navegador) {
        selectItemNavegador.value = campaign.criterial.navegador.split(',');
      }
      
      if (campaign.criterial.so) {
        selectItemSO.value = campaign.criterial.so.split(',');
      }
    }
    
    // Asignar URLs
    if (campaign.urls) {
      codigoExternoModel.value = campaign.urls.html || '';
      linkAds.value = campaign.urls.url || '#';
      linkImageEscritorio.value = campaign.urls.img?.escritorio || '';
      linkImageMobile.value = campaign.urls.img?.mobile || '';
    }

    // Asignar usuarios
    if (userData && userData[0]) {
      campaignUsers.value = userData[0].userId || [];
    }

  } catch (error) {
    console.error("Error al obtener la campaña:", error);
    snackbar.value = {
      show: true,
      text: 'Error al cargar la campaña',
      color: 'error'
    };
  } finally {
    loadingPanel.value = false;
  }
}

async function getCampaignToEdit() {
  try {
    loadingPanel.value = true;
    
    const [campaignResponse, usersResponse] = await Promise.all([
      fetch(`https://ads-service.vercel.app/campaign/get/edit/${route.params.id}/`),
      fetch(`https://ads-service.vercel.app/campaign/${route.params.id}/user`)
    ]);
    
    const campaignData = await campaignResponse.json();
    const userData = await usersResponse.json();
    
    if (!campaignData || !campaignData[0]) {
      throw new Error('No se recibieron datos de la campaña');
    }

    const campaign = campaignData[0];
    
    // Asignar datos básicos
    nombreCampania.value = campaign.campaignTitle;
    descripcionCampania.value = campaign.description || '';
    languages.value = campaign.type || '';
    criterio.value = campaign.coleccion ? campaign.coleccion.split(',') : [];
    posicion.value = campaign.position ? campaign.position.split(',') : [];
    
    // Asignar criterios
    if (campaign.criterial) {
      selectItemVisibilidad.value = campaign.criterial.visibilitySection || "all";
      metadatos.value = campaign.criterial.metadato ? campaign.criterial.metadato.split(',') : [];
      
      if (campaign.criterial.country && campaign.criterial.country !== -1) {
        selectedItem.value = campaign.criterial.country;
        if (campaign.criterial.city && campaign.criterial.city !== -1) {
          selectedItemCiudad.value = campaign.criterial.city.split(',');
        }
      }
      
      if (campaign.criterial.dispositivo) {
        selectItemDispositivos.value = campaign.criterial.dispositivo.split(',');
      }
      
      if (campaign.criterial.navegador) {
        selectItemNavegador.value = campaign.criterial.navegador.split(',');
      }
      
      if (campaign.criterial.so) {
        selectItemSO.value = campaign.criterial.so.split(',');
      }
    }
    
    // Asignar URLs
    if (campaign.urls) {
      codigoExternoModel.value = campaign.urls.html || '';
      linkAds.value = campaign.urls.url || '#';
      linkImageEscritorio.value = campaign.urls.img?.escritorio || '';
      linkImageMobile.value = campaign.urls.img?.mobile || '';
    }

    // Asignar usuarios
    if (userData && userData[0]) {
      campaignUsers.value = userData[0].userId || [];
    }

  } catch (error) {
    console.error("Error al obtener la campaña:", error);
    snackbar.value = {
      show: true,
      text: 'Error al cargar la campaña',
      color: 'error'
    };
  } finally {
    loadingPanel.value = false;
  }
}

// Wizard Methods
async function onComplete() {
  try {
    const jsonEnviar = {
      campaignTitle: nombreCampania.value,
      description: descripcionCampania.value,
      type: languages.value,
      criterial: {
        visibilitySection: selectItemVisibilidad.value,
        country: selectedItem.value.length > 0 ? selectedItem.value : -1,
        city: selectedItemCiudad.value.length > 0 ? selectedItemCiudad.value.join(',') : -1,
        so: selectItemSO.value?.join(',') || null,
        dispositivo: selectItemDispositivos.value?.join(',') || null,
        metadato: metadatos.value?.join(',') || null,
        navegador: selectItemNavegador.value?.join(',') || null
      },
      coleccion: criterio.value.join(','),
      position: Array.isArray(posicion.value) ? posicion.value.join(",") : posicion.value,
      userId: campaignUsers.value.map(user => user.wylexId),
      urls: {
        url: linkAds.value || "#",
        img: {
          escritorio: linkImageEscritorio.value || "",
          mobile: linkImageMobile.value || ""
        },
        html: codigoExternoModel.value || ""
      },
      campaignSlug: slugify(nombreCampania.value),
      statusCampaign: true
    };

    loadingPanel.value = true;
    loadComponent.value = true;

    const response = await fetch(`https://ads-service.vercel.app/campaign/update/${route.params.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(jsonEnviar)
    });

    const data = await response.json();

    if (data.resp) {
      snackbar.value = {
        show: true,
        text: 'Campaña actualizada exitosamente',
        color: 'success'
      };
      
      setTimeout(() => {
        router.push('/apps/campaigns/list');
      }, 1500);
    } else {
      throw new Error(data.error || 'No se pudo actualizar la campaña');
    }
  } catch (error) {
    console.error("Error al actualizar:", error);
    snackbar.value = {
      show: true,
      text: `Error: ${error.message}`,
      color: 'error'
    };
  } finally {
    loadingPanel.value = false;
    loadComponent.value = false;
  }
}

async function validateAsync() {
  if (!nombreCampania.value?.trim()) {
    snackbar.value = {
      show: true,
      text: 'Debes añadir un nombre de campaña',
      color: 'error'
    };
    return false;
  }

  if (!descripcionCampania.value?.trim()) {
    snackbar.value = {
      show: true,
      text: 'Debes añadir una descripción de campaña',
      color: 'error'
    };
    return false;
  }

  if (!languages.value) {
    snackbar.value = {
      show: true,
      text: 'Debes añadir un tipo de contenido',
      color: 'error'
    };
    return false;
  }

  if (!posicion.value) {
    snackbar.value = {
      show: true,
      text: 'Debes añadir la posición del ads',
      color: 'error'
    };
    return false;
  }

  if (!selectItemVisibilidad.value) {
    snackbar.value = {
      show: true,
      text: 'Debes añadir la visibilidad en el sitio web',
      color: 'error'
    };
    return false;
  }

  return true;
}

async function validateAsyncInsercion() {
  if (languages.value !== "imagen") {
    if (!codigoExternoModel.value?.trim()) {
      snackbar.value = {
        show: true,
        text: 'Debe ingresar el código',
        color: 'error'
      };
      return false;
    }
  } else {
    if (!linkAds.value?.trim()) {
      snackbar.value = {
        show: true,
        text: 'Debe ingresar el link',
        color: 'error'
      };
      return false;
    }
    if (!linkImageEscritorio.value?.trim()) {
      snackbar.value = {
        show: true,
        text: 'Debe ingresar el link de la imagen para dispositivos de escritorio',
        color: 'error'
      };
      return false;
    }
    if (!linkImageMobile.value?.trim()) {
      snackbar.value = {
        show: true,
        text: 'Debe ingresar el link de la imagen para dispositivos responsive',
        color: 'error'
      };
      return false;
    }
  }

  return true;
}

// ... [código anterior se mantiene igual hasta validateAsyncCriterio]

async function validateAsyncCriterio() {
  const validaciones = [];

  if (criterio.value.includes('dispositivos') && 
      (!selectItemDispositivos.value?.length)) {
    validaciones.push('Debe seleccionar un dispositivo');
  }

  if (criterio.value.includes('metadatos') && 
      (!metadatos.value?.length)) {
    validaciones.push('Debe seleccionar al menos 1 metadato');
  }

  if (criterio.value.includes('plataforma')) {
    if (!selectItemSO.value?.length) {
      validaciones.push('Debe seleccionar al menos 1 SO');
    }
    if (!selectItemNavegador.value?.length) {
      validaciones.push('Debe seleccionar al menos 1 Navegador');
    }
  }

  if (criterio.value.includes('trazabilidads')) {
    if (!selectedItem.value?.length) {
      validaciones.push('Debe seleccionar al menos 1 país');
    }
    if (!selectedItemCiudad.value?.length) {
      validaciones.push('Debe seleccionar al menos 1 ciudad');
    }
  }

  if (!criterio.value?.length) {
    validaciones.push('Debes seleccionar al menos un criterio');
  }

  if (validaciones.length > 0) {
    snackbar.value = {
      show: true,
      text: validaciones[0],
      color: 'error'
    };
    return false;
  }

  return true;
}

// Utilidades
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
    .replace(/[^a-z0-9\-]+/g, '-')
    .replace(/\s+/g, '-')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

// Manejadores del wizard
async function handleValidation(isValid, tabIndex) {
  if (tabIndex === 1 && isValid) {
    await getCountries();
    countryList.value = dataCountry.value.map(item => item.country).sort();
  }
  return false;
}

async function setLoading(value) {
  loadingWizard.value = value;
}

// Manejadores del modal de usuarios
function openUserModal() {
  showUserModal.value = true;
}

function closeUserModal() {
  showUserModal.value = false;
  getCampaignToEdit(); // Recargar datos al cerrar
}

async function handleUserUpdate() {
  await getCampaignToEdit();
}

// Watchers
watch(selectedItem, async (newValue) => {
  if (newValue) {
    selectedItemCiudad.value = [];
    cityList.value = [];
    
    if (dataCountry.value?.length) {
      const countryData = dataCountry.value.find(c => c.country === newValue);
      if (countryData?.data) {
        cityList.value = ['Todas las ciudades', ...countryData.data.map(d => d.city)]
          .sort((a, b) => {
            if (a === 'Todas las ciudades') return -1;
            if (b === 'Todas las ciudades') return 1;
            return a.localeCompare(b);
          });
      }
    }
  }
});

watch(selectedItemCiudad, async (newValue) => {
  if (cityList.value.length > 1 && newValue?.length) {
    loadingPanel.value = true;
    clearTimeout(timeoutId.value);
    
    timeoutId.value = setTimeout(async () => {
      try {
        const response = await fetch('https://ads-service.vercel.app/campaign/v2/usuarios/get/user/total', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pais: selectedItem.value,
            ciudad: newValue,
            dispositivo: selectItemDispositivos.value,
            os: selectItemSO.value,
            navegador: selectItemNavegador.value,
            metadato: metadatos.value,
            criterio: criterio.value
          })
        });
        
        const data = await response.json();
        if (data.resp) {
          campaignUsers.value = data.total;
        }
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
        snackbar.value = {
          show: true,
          text: 'Error al obtener usuarios',
          color: 'error'
        };
      } finally {
        loadingPanel.value = false;
      }
    }, timeoutSegundos);
  }
});

// Watcher optimizado que agrupa las actualizaciones
watch([selectItemDispositivos, selectItemSO, selectItemNavegador, metadatos], 
  async (newValues, oldValues) => {
    // Solo actualizar si realmente hubo cambios
    const hasChanges = newValues.some((val, index) => {
      const oldVal = oldValues[index];
      return JSON.stringify(val) !== JSON.stringify(oldVal);
    });

    if (hasChanges) {
      clearTimeout(timeoutId.value);
      
      timeoutId.value = setTimeout(async () => {
        loadingPanel.value = true;
        try {
          await handleUserUpdate();
        } catch (error) {
          console.error('Error actualizando usuarios:', error);
        } finally {
          loadingPanel.value = false;
        }
      }, timeoutSegundos); // Reducido a 1 segundo
    }
  },
  { deep: true }
);

// Prevenir múltiples posiciones
watch(posicion, value => {
  if (value?.length > 1) {
    nextTick(() => posicion.value.pop());
  }
});

// Limitar metadatos
watch(metadatos, value => {
  if (value?.length > 5) {
    nextTick(() => metadatos.value.pop());
  }
});

</script>

<template>
  <section>
    <!-- Overlay de carga -->
    <VOverlay
      :model-value="loadingPanel"
      class="align-center justify-center"
    >
      <VProgressCircular
        indeterminate
        color="primary"
      />
    </VOverlay>

    <!-- Notificaciones -->
    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="2000"
      location="top"
      position="right"
    >
      {{ snackbar.text }}
    </VSnackbar>

    <VRow>
      <VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="7"
      >
        <VTabs
          v-model="currentTab"
          class="v-tabs-pill d-none"
        >
          <VTab value="tab-lista" class="d-none">
            Listado
          </VTab>
          <VTab value="tab-agregar" class="d-none">
            Estadísticas
          </VTab>
        </VTabs>

        <VCard class="mt-5">
          <VCardText class="px-0">
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-lista">
                <!-- Encabezado -->
                <div class="d-flex flex-wrap py-4 gap-4 align-items-center px-5">
                  <VCardTitle>
                    Edita campaña: {{ nombreCampania }}
                  </VCardTitle>
                  <VCardSubtitle>
                    Edita datos sobre la campaña seleccionada
                  </VCardSubtitle>
                </div>

                <!-- Wizard -->
                <form-wizard
                  :class="loadComponent ? 'disabled' : ''"
                  @on-complete="onComplete"
                  @on-loading="setLoading"
                  color="#7367F0"
                  @on-validate="handleValidation"
                  validate-on-back="true"
                  nextButtonText="Siguiente"
                  backButtonText="Anterior"
                  finishButtonText="Editar campaña"
                >
                  <!-- Paso 1: Detalles básicos -->
                  <tab-content title="Detalles de la campaña" class="px-4" :before-change="validateAsync">
                    <VRow class="pb-5">
                      <!-- Nombre de campaña -->
                      <VCol cols="12">
                        <VRow no-gutters>
                          <VCol cols="12" md="12">
                            <label for="nombreCampania">Nombre de la campaña</label>
                            <VTextField
                              id="nombreCampania"
                              v-model="nombreCampania"
                              placeholder="Nombre de la campaña"
                              persistent-placeholder
                            />
                          </VCol>
                        </VRow>
                      </VCol>

                      <!-- Descripción -->
                      <VCol cols="12">
                        <VRow no-gutters>
                          <VCol cols="12" md="12">
                            <label for="descripcionCampania">Descripción de la campaña</label>
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

                      <!-- Tipo de contenido -->
                      <VCol cols="6">
                        <VRow no-gutters>
                          <VCol cols="12" md="12">
                            <label for="tipocontenido">Tipo de contenido</label>
                            <VSelect
                              v-model="languages"
                              :items="languageList"
                              chips
                              clearable
                            />
                          </VCol>
                        </VRow>
                      </VCol>

                      <!-- Visibilidad -->
                      <VCol cols="6">
                        <VRow no-gutters>
                          <VCol cols="12" md="12">
                            <label for="tipocontenido">Visibilidad en la web</label>
                            <VSelect
                              v-model="selectItemVisibilidad"
                              :items="selectItemsListVisibilidad"
                              chips
                              clearable
                            />
                          </VCol>
                        </VRow>
                      </VCol>

                      <!-- Posición -->
                      <VCol cols="12">
                        <VRow no-gutters>
                          <VCol cols="12" md="12">
                            <label for="posicion">Posición</label>
                            <VCombobox
                              v-model="posicion"
                              multiple
                              chips
                              :items="posicionList"
                              variant="outlined"
                              v-model:search-input="search"
                              hide-selected
                              :hide-no-data="false"
                            />
                          </VCol>
                        </VRow>
                      </VCol>
                    </VRow>
                  </tab-content>

                  <!-- Paso 2: Inserción de código -->
                  <tab-content title="Inserción de código" class="px-4" :before-change="validateAsyncInsercion">
                    <VRow class="pb-5">
                      <!-- Selector de tipo -->
                      <VCol cols="12">
                        <VRow no-gutters>
                          <VCol cols="12" md="12">
                            <label for="tipocontenido">Tipo de contenido</label>
                            <VSelect
                              v-model="languages"
                              :items="languageList"
                              chips
                              clearable
                            />
                          </VCol>
                        </VRow>
                      </VCol>

                      <VCol cols="12">
                        <hr>
                      </VCol>

                      <!-- Código externo -->
                      <VCol cols="12" :class="languages == 'imagen' ? 'd-none' : ''">
                        <VRow no-gutters>
                          <VCol cols="12" md="12">
                            <label for="nombreCampania">Inserte el código</label>
                            <VTextarea
                              v-model="codigoExternoModel"
                              label="Código"
                              rows="4"
                            />
                          </VCol>
                        </VRow>
                      </VCol>

                      <!-- Configuración de imagen -->
                      <template v-if="languages == 'imagen'">
                        <VCol cols="12">
                          <VRow no-gutters>
                            <VCol cols="12" md="12">
                              <label for="link">Link del ads</label>
                              <VTextField
                                id="link"
                                v-model="linkAds"
                                placeholder="Link del ads"
                                persistent-placeholder
                              />
                            </VCol>
                          </VRow>
                        </VCol>

                        <VCol cols="6">
                          <VRow no-gutters>
                            <VCol cols="12" md="12">
                              <label for="linkEscritorio">URL imagen de escritorio</label>
                              <VTextField
                                id="linkEscritorio"
                                v-model="linkImageEscritorio"
                                placeholder="Link imagen de escritorio"
                                persistent-placeholder
                              />
                            </VCol>
                          </VRow>
                        </VCol>

                        <VCol cols="6">
                          <VRow no-gutters>
                            <VCol cols="12" md="12">
                              <label for="linkMobile">URL imagen de móvil</label>
                              <VTextField
                                id="linkMobile"
                                v-model="linkImageMobile"
                                placeholder="Link imagen de móvil"
                                persistent-placeholder
                              />
                            </VCol>
                          </VRow>
                        </VCol>
                      </template>
                    </VRow>
                  </tab-content>

                  <!-- Paso 3: Criterios -->
                  <tab-content title="Criterio de búsqueda" class="px-4" :before-change="validateAsyncCriterio">
                    <VRow class="pb-5">
                      <VCol cols="6">
                        <VRow class="pb-5">
                          <!-- Selector de criterios -->
                          <VCol cols="12">
                            <VRow no-gutters>
                              <VCol cols="12" md="12">
                                <label for="criterio">Criterio</label>
                                <VSelect
                                  v-model="criterio"
                                  :items="criterioList"
                                  multiple
                                  chips
                                  clearable
                                />
                              </VCol>
                            </VRow>
                          </VCol>

                          <!-- Metadatos -->
                          <VCol cols="12" v-if="criterio.includes('metadatos')">
                            <VRow no-gutters>
                              <VCol cols="12" md="12">
                                <label for="metadatos">Metadatos</label>
                                <VCombobox
                                  v-model="metadatos"
                                  multiple
                                  chips
                                  :items="metadatosItems"
                                  variant="outlined"
                                  v-model:search-input="searchMetadatos"
                                  hide-selected
                                  :hide-no-data="false"
                                />
                              </VCol>
                            </VRow>
                          </VCol>

                          <!-- Geolocalización -->
                          <VCol cols="12" v-if="criterio.includes('trazabilidads')">
                            <VRow no-gutters>
                              <VCol cols="6">
                                <label for="pais">Países</label>
                                <VCombobox
                                  v-model="selectedItem"
                                  :items="countryList"
                                  chips
                                  clearable
                                  :menu-props="{ maxHeight: '300' }"
                                />
                              </VCol>
                              <VCol cols="6">
                                <label for="ciudad">Ciudades</label>
                                <VCombobox
                                  v-model="selectedItemCiudad"
                                  multiple
                                  chips
                                  :items="cityList"
                                  v-model:search-input="searchCiudades"
                                  :hide-no-data="false"
                                  :menu-props="{ maxHeight: '300' }"
                                  :loading="loadingPanel"
                                  :disabled="!selectedItem.length"
                                />
                              </VCol>
                            </VRow>
                          </VCol>

                          <!-- Dispositivos -->
                          <VCol cols="12" v-if="criterio.includes('dispositivos')">
                            <VRow no-gutters>
                              <VCol cols="12" md="12">
                                <label for="dispositivos">Dispositivos</label>
                                <VSelect
                                  v-model="selectItemDispositivos"
                                  :items="selectItemsListDispositivos"
                                  item-title="title"
                                  item-value="value"
                                  multiple
                                  clearable
                                >
                                  <template #selection="{ item }">
                                    <VChip>
                                      <VAvatar>
                                        <VIcon :icon="item.raw.avatar" />
                                      </VAvatar>
                                      <span>{{ item.title }}</span>
                                    </VChip>
                                  </template>
                                </VSelect>
                              </VCol>
                            </VRow>
                          </VCol>

                          <!-- Plataforma -->
                          <VCol cols="12" v-if="criterio.includes('plataforma')">
                            <VRow no-gutters>
                              <VCol cols="6">
                                <label for="so">Sistema operativo</label>
                                <VSelect
                                  v-model="selectItemSO"
                                  :items="selectItemsListSO"
                                  item-title="title"
                                  item-value="value"
                                  multiple
                                  clearable
                                >
                                  <template #selection="{ item }">
                                    <VChip>
                                      <VAvatar>
                                        <VIcon :icon="item.raw.avatar" />
                                      </VAvatar>
                                      <span>{{ item.title }}</span>
                                    </VChip>
                                  </template>
                                </VSelect>
                              </VCol>
                              <VCol cols="6">
                                <label for="navegador">Navegador</label>
                                <VSelect
                                  v-model="selectItemNavegador"
                                  :items="selectItemsListNavegador"
                                  multiple
                                  chips
                                  clearable
                                  :disabled="!selectItemSO.length"
                                />
                              </VCol>
                            </VRow>
                          </VCol>
                        </VRow>
                      </VCol>

                      <!-- Panel de usuarios -->
                      <VCol cols="6">
                        <VCardText class="d-flex align-center gap-4">
                          <div>
                            <div class="d-flex align-center mb-2">
                              <VIcon
                                class="me-2"
                                size="24"
                                icon="tabler-users"
                                color="primary"
                              />
                              <span class="text-h6 text-medium-emphasis">
                                Usuarios participantes
                              </span>
                            </div>

                            <div class="d-flex align-center gap-4">
                              <div class="text-h6 font-weight-medium text-success fondo-boton">
                                {{ totalUsers }}
                              </div>
                              <VBtn
                                size="small"
                                variant="tonal"
                                color="secondary"
                                @click="openUserModal"
                                :disabled="loadingPanel"
                              >
                                Editar usuarios
                              </VBtn>
                            </div>
                          </div>
                        </VCardText>
                      </VCol>
                    </VRow>
                  </tab-content>
                </form-wizard>
              </VWindowItem>
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Modal de usuarios -->
    <VDialog
      v-model="showUserModal"
      max-width="900px"
      persistent
    >
      <VCard>
        <VCardText>
          <UserList
            :users="campaignUsers"
            :campaign-title="nombreCampania"
            :campaign-id="route.params.id"
            :users-per-page="10"
            @close="closeUserModal"
            @update-users="handleUserUpdate"
          />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="primary"
            @click="closeUserModal"
          >
            Cerrar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>

<style scoped>
.v-card.v-theme--dark .iframe-dark {
  display: block;
}

.v-card.v-theme--dark .iframe-light {
  display: none;
}

.v-card.v-theme--light .iframe-dark {
  display: none;
}

.v-card.v-theme--light .iframe-light {
  display: block;
}

/* Estilos para el loader del wizard */
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
  transform: translateZ(0);
  animation: load8 1.1s infinite linear;
}

@keyframes load8 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Estilos para el menú de selección */
.v-menu .v-select__slot {
  max-height: 10px;
  overflow-y: auto;
}

/* Estilos para el contador de usuarios */
.fondo-boton {
  background-color: #d4edda;
  padding: 8px 16px;
  border-radius: 5px;
  line-height: 24px;
}

/* Estilos para estados deshabilitados */
.disabled {
  pointer-events: none;
  opacity: 0.7;
}

/* Mejoras de accesibilidad */
label {
  display: inline-block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

/* Mejoras de espaciado para el wizard */
.v-tabs-pill {
  margin-bottom: 1rem;
}

.form-wizard-content {
  padding: 1rem 0;
}

/* Optimizaciones para móvil */
@media (max-width: 600px) {
  .v-row {
    margin: 0;
  }
  
  .v-col {
    padding: 0.5rem;
  }

  .fondo-boton {
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
  }
}
</style>

