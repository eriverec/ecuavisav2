<script setup>
import { ref, onMounted } from 'vue';

// Configuración de la API
const API_BASE_URL = 'https://services.ecuavisa.com/servicio-mediakit/api-v3.php';
const FOLDER_NAME = 'publicidad';

// Estado de la aplicación
const loading = ref(false);
const estructura = ref(null);
const selectedDispositivo = ref('desktop');
const selectedCategoria = ref('tradicionales');
const showModal = ref(false);
const modalMode = ref('add'); // 'add' o 'edit'
const editingIndex = ref(-1);
const notification = ref({ show: false, message: '', type: 'success' });
const showDebugPanel = ref(false);
const apiResponse = ref(null);

// Formulario
const formData = ref({
  nombre: '',
  dispositivos: '',
  categoria: '',
  tamanos: '',
  peso: '',
  formatos: '',
  imagen: '',
  demo: ''
});

// ========== FUNCIONES DE API ==========

/**
 * Obtiene todos los datos de medidas
 */
async function getAllData() {
  try {
    const url = `${API_BASE_URL}?api=web&key=medidas&folder=${FOLDER_NAME}`;
    console.log('Llamando a la API:', url);
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('Respuesta de la API:', data);
    apiResponse.value = data; // Guardar para debug
    
    if (data.success) {
      // Según la documentación, data.data contiene la estructura
      return data.data;
    }
    throw new Error(data.message || 'Error al obtener los datos');
  } catch (error) {
    console.error('Error en getAllData:', error);
    apiResponse.value = { error: error.message }; // Guardar error para debug
    throw error;
  }
}

/**
 * Guarda o actualiza los datos completos
 */
async function saveData(estructuraData) {
  try {
    const payload = {
      key: 'medidas',
      estructura: estructuraData,
      folder: FOLDER_NAME
    };
    
    console.log('Guardando datos:', payload);
    
    const response = await fetch(`${API_BASE_URL}?api=update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    
    console.log('Respuesta de saveData:', data);
    apiResponse.value = data; // Guardar para debug
    
    if (data.success) {
      return data;
    }
    throw new Error(data.message || 'Error al guardar los datos');
  } catch (error) {
    console.error('Error en saveData:', error);
    apiResponse.value = { error: error.message }; // Guardar error para debug
    throw error;
  }
}

// ========== FUNCIONES DE CARGA Y GESTIÓN ==========

// Cargar datos iniciales
onMounted(async () => {
  await loadData();
});

async function loadData() {
  loading.value = true;
  try {
    const data = await getAllData();
    console.log('Datos recibidos:', data);
    
    // La API devuelve la estructura directamente en data.data
    // Según medidas.json, la estructura es un array con un objeto
    if (data && Array.isArray(data) && data.length > 0) {
      estructura.value = data[0];
    } else if (data && typeof data === 'object' && !Array.isArray(data)) {
      // Si la API devuelve un objeto directamente (sin array)
      estructura.value = data;
    } else {
      // Si no hay datos, inicializar estructura vacía
      initializeEmptyStructure();
      showNotification('No hay datos guardados. Usa el botón "Inicializar Datos" para crear la estructura.', 'info');
    }
  } catch (error) {
    console.error('Error completo:', error);
    
    // Si el error es "No se encontró la configuración", inicializar estructura vacía
    if (error.message.includes('No se encontró')) {
      initializeEmptyStructure();
      showNotification('No se encontró el archivo. Usa el botón "Inicializar Datos" para crearlo.', 'info');
    } else {
      showNotification('Error al cargar los datos: ' + error.message, 'error');
      initializeEmptyStructure();
    }
  } finally {
    loading.value = false;
  }
}

function initializeEmptyStructure() {
  estructura.value = {
    formatos_desktop: {
      tradicionales: [],
      rich_media: []
    },
    formatos_mobile: {
      tradicionales: [],
      rich_media: []
    }
  };
}

async function initializeData() {
  if (!confirm('¿Estás seguro de que deseas crear la estructura de datos inicial?')) {
    return;
  }
  
  loading.value = true;
  try {
    // Crear estructura inicial vacía
    const estructuraInicial = {
      formatos_desktop: {
        tradicionales: [],
        rich_media: []
      },
      formatos_mobile: {
        tradicionales: [],
        rich_media: []
      }
    };
    
    await saveData([estructuraInicial]);
    showNotification('Estructura de datos creada exitosamente', 'success');
    await loadData();
  } catch (error) {
    showNotification('Error al inicializar datos: ' + error.message, 'error');
  } finally {
    loading.value = false;
  }
}

// Obtener formatos actuales según selección
function getCurrentFormatos() {
  if (!estructura.value) return [];
  const key = selectedDispositivo.value === 'desktop' ? 'formatos_desktop' : 'formatos_mobile';
  return estructura.value[key]?.[selectedCategoria.value] || [];
}

// Abrir modal para agregar
function openAddModal() {
  modalMode.value = 'add';
  resetForm();
  // Establecer el dispositivo y categoría según las pestañas seleccionadas
  formData.value.dispositivos = selectedDispositivo.value === 'desktop' ? 'Desktop' : 'Mobile';
  formData.value.categoria = selectedCategoria.value;
  showModal.value = true;
}

// Abrir modal para editar
function openEditModal(index) {
  modalMode.value = 'edit';
  editingIndex.value = index;
  const formato = getCurrentFormatos()[index];
  
  formData.value = { 
    ...formato,
    categoria: selectedCategoria.value
  };
  showModal.value = true;
}

// Resetear formulario
function resetForm() {
  formData.value = {
    nombre: '',
    dispositivos: 'Desktop',
    categoria: 'tradicionales',
    tamanos: '',
    peso: '',
    formatos: '',
    imagen: '',
    demo: ''
  };
  editingIndex.value = -1;
}

// Cerrar modal
function closeModal() {
  showModal.value = false;
  resetForm();
}

// Guardar formato (agregar o editar)
async function saveFormato() {
  loading.value = true;
  try {
    // Determinar dispositivo basado en el formulario
    const key = formData.value.dispositivos === 'Desktop' ? 'formatos_desktop' : 'formatos_mobile';
    const categoria = formData.value.categoria;
    
    // Crear una copia profunda de la estructura
    const nuevaEstructura = JSON.parse(JSON.stringify(estructura.value));
    
    // Asegurar que existen las propiedades
    if (!nuevaEstructura[key]) {
      nuevaEstructura[key] = {};
    }
    if (!nuevaEstructura[key][categoria]) {
      nuevaEstructura[key][categoria] = [];
    }
    
    // Crear objeto sin el campo categoria
    const { categoria: _, ...formatoData } = formData.value;
    
    if (modalMode.value === 'add') {
      // Agregar nuevo formato
      nuevaEstructura[key][categoria].push({ ...formatoData });
      showNotification('Formato agregado exitosamente', 'success');
    } else {
      // Si se cambió de categoría o dispositivo, eliminar del anterior
      const oldKey = selectedDispositivo.value === 'desktop' ? 'formatos_desktop' : 'formatos_mobile';
      const oldCategoria = selectedCategoria.value;
      
      if (oldKey !== key || oldCategoria !== categoria) {
        // Eliminar de la ubicación anterior
        nuevaEstructura[oldKey][oldCategoria].splice(editingIndex.value, 1);
        // Agregar en la nueva ubicación
        nuevaEstructura[key][categoria].push({ ...formatoData });
      } else {
        // Editar en la misma ubicación
        nuevaEstructura[key][categoria][editingIndex.value] = { ...formatoData };
      }
      showNotification('Formato actualizado exitosamente', 'success');
    }
    
    // Guardar en la API (según la documentación, estructura debe ser un array)
    await saveData([nuevaEstructura]);
    
    // Recargar datos
    await loadData();
    closeModal();
  } catch (error) {
    showNotification('Error al guardar: ' + error.message, 'error');
  } finally {
    loading.value = false;
  }
}

// Eliminar formato
async function deleteFormato(index) {
  if (!confirm('¿Estás seguro de que deseas eliminar este formato?')) {
    return;
  }
  
  loading.value = true;
  try {
    const key = selectedDispositivo.value === 'desktop' ? 'formatos_desktop' : 'formatos_mobile';
    
    // Crear una copia profunda de la estructura
    const nuevaEstructura = JSON.parse(JSON.stringify(estructura.value));
    
    // Eliminar el formato
    nuevaEstructura[key][selectedCategoria.value].splice(index, 1);
    
    // Guardar en la API
    await saveData([nuevaEstructura]);
    
    showNotification('Formato eliminado exitosamente', 'success');
    
    // Recargar datos
    await loadData();
  } catch (error) {
    showNotification('Error al eliminar: ' + error.message, 'error');
  } finally {
    loading.value = false;
  }
}

// Mostrar notificación
function showNotification(message, type = 'success') {
  notification.value = { show: true, message, type };
  setTimeout(() => {
    notification.value.show = false;
  }, 3000);
}

function toggleDebugPanel() {
  showDebugPanel.value = !showDebugPanel.value;
}
</script>

<template>
  <section class="mediakit-manager">
    <!-- Notificaciones -->
    <VSnackbar
      v-model="notification.show"
      :color="notification.type"
      location="top end"
      :timeout="3000"
    >
      {{ notification.message }}
    </VSnackbar>

    <!-- Loading Overlay -->
    <VOverlay
      v-model="loading"
      class="align-center justify-center"
      persistent
    >
      <VProgressCircular
        color="primary"
        indeterminate
        size="64"
      />
    </VOverlay>

    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <h1 class="text-h4 font-weight-bold">
        Gestor de Mediakit
      </h1>
      <div class="d-flex gap-3">
        <!-- <VBtn
          color="secondary"
          variant="tonal"
          @click="toggleDebugPanel"
        >
          <VIcon
            icon="tabler-bug"
            start
          />
          Debug
        </VBtn> -->
        <VBtn
          v-if="!estructura || (getCurrentFormatos().length === 0 && selectedCategoria === 'tradicionales' && selectedDispositivo === 'desktop')"
          color="warning"
          variant="tonal"
          @click="initializeData"
        >
          <VIcon
            icon="tabler-settings"
            start
          />
          Inicializar Datos
        </VBtn>
        <VBtn
          color="primary"
          @click="openAddModal"
        >
          <VIcon
            icon="tabler-plus"
            start
          />
          Agregar Formato
        </VBtn>
      </div>
    </div>

    <!-- Panel de Debug -->
    <VNavigationDrawer
      v-model="showDebugPanel"
      location="end"
      temporary
      width="500"
    >
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>Información de Debug</span>
          <VBtn
            icon="tabler-x"
            variant="text"
            size="small"
            @click="toggleDebugPanel"
          />
        </VCardTitle>
        <VDivider />
        <VCardText>
          <div class="mb-4">
            <h6 class="text-subtitle-2 text-medium-emphasis mb-2">
              URL DE LA API:
            </h6>
            <code class="text-caption">{{ API_BASE_URL }}</code>
          </div>
          <div class="mb-4">
            <h6 class="text-subtitle-2 text-medium-emphasis mb-2">
              CARPETA:
            </h6>
            <code class="text-caption">{{ FOLDER_NAME }}</code>
          </div>
          <div class="mb-4">
            <h6 class="text-subtitle-2 text-medium-emphasis mb-2">
              ÚLTIMA RESPUESTA DE LA API:
            </h6>
            <pre class="text-caption pa-3 bg-surface-variant rounded">{{ JSON.stringify(apiResponse, null, 2) }}</pre>
          </div>
          <div>
            <h6 class="text-subtitle-2 text-medium-emphasis mb-2">
              ESTRUCTURA ACTUAL:
            </h6>
            <pre class="text-caption pa-3 bg-surface-variant rounded" style="max-height: 300px; overflow-y: auto;">{{ JSON.stringify(estructura, null, 2) }}</pre>
          </div>
        </VCardText>
      </VCard>
    </VNavigationDrawer>

    <!-- Filtros -->
    <VCard class="mb-6">
      <VCardText>
        <VRow>
          <VCol
            cols="12"
            md="6"
          >
            <VSelect
              v-model="selectedDispositivo"
              label="Dispositivo"
              :items="[
                { title: 'Desktop', value: 'desktop' },
                { title: 'Mobile', value: 'mobile' }
              ]"
              variant="outlined"
              density="compact"
            />
          </VCol>
          <VCol
            cols="12"
            md="6"
          >
            <VSelect
              v-model="selectedCategoria"
              label="Categoría"
              :items="[
                { title: 'Tradicionales', value: 'tradicionales' },
                { title: 'Rich Media', value: 'rich_media' }
              ]"
              variant="outlined"
              density="compact"
            />
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <!-- Lista de formatos -->
    <VRow>
      <VCol
        v-for="(formato, index) in getCurrentFormatos()"
        :key="index"
        cols="12"
        md="6"
        lg="4"
      >
        <VCard>
            <div v-if="formato.imagen" style="width: max-content; margin: auto">
                <VImg                  
                  :src="formato.imagen"
                  :alt="formato.nombre"
                  height="200"
                  width="200"
                  cover
                />
            </div>
          
          <div
            v-else
            class="d-flex align-center justify-center bg-surface-variant"
            style="height: 200px;"
          >
            <span class="text-disabled">Sin imagen</span>
          </div>

          <VCardText>
            <h3 class="text-h6 mb-3">
              {{ formato.nombre }}
            </h3>
            <div class="text-body-2">
              <p class="mb-2">
                <strong>Dispositivos:</strong> {{ formato.dispositivos }}
              </p>
              <p class="mb-2">
                <strong>Tamaños:</strong> {{ formato.tamanos }}
              </p>
              <p class="mb-2">
                <strong>Peso:</strong> {{ formato.peso }}
              </p>
              <p class="mb-2">
                <strong>Formatos:</strong> {{ formato.formatos }}
              </p>
            </div>
          </VCardText>

          <VCardActions>
            <VBtn
              v-if="formato.demo"
              :href="formato.demo"
              target="_blank"
              variant="text"
              color="primary"
              size="small"
            >
              Ver Demo
            </VBtn>
            <VSpacer />
            <VBtn
              variant="tonal"
              color="secondary"
              size="small"
              @click="openEditModal(index)"
            >
              Editar
            </VBtn>
            <VBtn
              variant="tonal"
              color="error"
              size="small"
              @click="deleteFormato(index)"
            >
              Eliminar
            </VBtn>
          </VCardActions>
        </VCard>
      </VCol>

      <!-- Empty State -->
      <VCol
        v-if="getCurrentFormatos().length === 0"
        cols="12"
      >
        <VCard class="text-center pa-10">
          <VIcon
            icon="tabler-folder-open"
            size="64"
            color="disabled"
            class="mb-4"
          />
          <p class="text-body-1 text-medium-emphasis mb-4">
            No hay formatos en esta categoría
          </p>
          <VBtn
            color="primary"
            @click="openAddModal"
          >
            Agregar primer formato
          </VBtn>
        </VCard>
      </VCol>
    </VRow>

    <!-- Modal para agregar/editar -->
    <VDialog
      v-model="showModal"
      max-width="600"
      persistent
    >
      <VCard>
        <VCardTitle class="d-flex justify-space-between align-center">
          <span>{{ modalMode === 'add' ? 'Agregar' : 'Editar' }} Formato</span>
          <VBtn
            icon="tabler-x"
            variant="text"
            size="small"
            @click="closeModal"
          />
        </VCardTitle>
        <VDivider />
        <VCardText>
          <VForm @submit.prevent="saveFormato">
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="formData.nombre"
                  label="Nombre"
                  placeholder="Ej: Full Banner"
                  required
                  variant="outlined"
                  density="compact"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="formData.dispositivos"
                  label="Dispositivos"
                  :items="['Desktop', 'Mobile']"
                  required
                  variant="outlined"
                  density="compact"
                />
              </VCol>

              <VCol
                cols="12"
                md="6"
              >
                <VSelect
                  v-model="formData.categoria"
                  label="Categoría"
                  :items="[
                    { title: 'Tradicionales', value: 'tradicionales' },
                    { title: 'Rich Media', value: 'rich_media' }
                  ]"
                  required
                  variant="outlined"
                  density="compact"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="formData.tamanos"
                  label="Tamaños"
                  placeholder="Ej: 728x90 - 728x250 pxl"
                  required
                  variant="outlined"
                  density="compact"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="formData.peso"
                  label="Peso"
                  placeholder="Ej: 150 Kb(máx)"
                  variant="outlined"
                  density="compact"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="formData.formatos"
                  label="Formatos"
                  placeholder="Ej: JPG - PNG - GIF - HTML"
                  required
                  variant="outlined"
                  density="compact"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="formData.imagen"
                  label="URL de Imagen"
                  placeholder="https://..."
                  type="url"
                  variant="outlined"
                  density="compact"
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="formData.demo"
                  label="URL de Demo"
                  placeholder="https://..."
                  type="url"
                  variant="outlined"
                  density="compact"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
        <!-- <VDivider /> -->
        <VCardActions>
          <!-- <VSpacer /> -->
          <VBtn
            color="secondary"
            variant="tonal"
            @click="closeModal"
          >
            Cancelar
          </VBtn>
          <VBtn
            color="primary"
            @click="saveFormato"
          >
            {{ modalMode === 'add' ? 'Agregar' : 'Guardar Cambios' }}
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </section>
</template>

<style scoped>
.mediakit-manager {
  padding: 1.5rem;
}
</style>