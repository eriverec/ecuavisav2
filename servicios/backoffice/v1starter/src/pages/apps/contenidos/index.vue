<template>
  <div>
    <VBtn
      color="primary"
      class="mb-4 text-uppercase"
      prepend-icon="mdi-plus"
      @click="showCreateConfigDialog"
  
    >
      Crear Nueva Regla
    </VBtn>

    <VDialog v-model="createDialog.show" max-width="500px">
      <VCard>
        <VCardTitle class="text-uppercase">Crear nueva regla</VCardTitle>
        <VCardText>
          <VSelect
            v-model="createDialog.selectedType"
            label="Tipo de Contenido"
            :items="getAvailableContentTypes()"
            required
          />
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="primary" variant="text" @click="createNewConfig">
            Crear
          </VBtn>
          <VBtn color="error" variant="text" @click="createDialog.show = false">
            Cancelar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Tabs -->
    <VTabs
      v-model="activeTab"
      color="primary"
      align-tabs="start"
      class="mb-4"
    >
      <VTab
        v-for="(config, index) in configurations"
        :key="config.id"
        :value="index"
        :disabled="isTabDisabled(config)"
      >
        {{ config.name }}
        <VBtn
          icon="mdi-delete"
          size="small"
          color="error"
          variant="text"
          class="ml-2"
          @click.stop="confirmDeleteConfig(index)"
          :disabled="isTabDisabled(config)"
        />
      </VTab>
    </VTabs>

    <VWindow v-model="activeTab">
      <VWindowItem
        v-for="(config, index) in configurations"
        :key="config.id"
        :value="index"
      >
        <VCard class="mt-5" :title="config.name">
          <VCardText>
            <VAlert
              v-if="error"
              type="error"
              variant="tonal"
              closable
              class="mb-4"
            >
              {{ error }}
            </VAlert>

            <form @submit.prevent="updateConfig(index)">
              <VRow>
                <VCol cols="12" md="6">
                  <VTextField
                    v-model="config.name"
                    label="Nombre de la configuración del límite"
                    required
                  />
                </VCol>
                
                <VCol cols="12" md="6">
                  <VSelect
                    v-model="config.contentType"
                    label="Tipo de Contenido"
                    :items="['Article', 'Live']"
                    required
                    :disabled="isContentTypeDisabled(config)"
                  />
                </VCol>

                <!-- Switch Global -->
                <VCol cols="12">
                  <VCard>
                    <VCardTitle class="text-h6 font-weight-normal d-flex align-center">
                      ¿Será un límite global?
                      <VTooltip location="top">
                        <template v-slot:activator="{ props }">
                          <VIcon
                            v-bind="props"
                            icon="mdi-information"
                            color="primary"
                            class="ml-2"
                          />
                        </template>
                        Mientras esto se encuentre activo, no se validará ninguna regla adicional del mismo tipo de contenido
                      </VTooltip>
                    </VCardTitle>
                    <VCardText>
                      <VSwitch
                        v-model="config.switchGlobal"
                        label="Activar en todo el sitio"
                        @update:model-value="handleGlobalSwitch($event, config)"
                      />
                    </VCardText>
                  </VCard>
                </VCol>

                <!-- Configuración por Sección / URL -->
                <VCol cols="12" v-if="!config.switchGlobal">
                  <VCard>
                    <VCardTitle class="text-h6 font-weight-normal">
                      Configuración por {{ config.contentType === 'Live' ? 'URL' : 'Secciones / URL' }}
                    </VCardTitle>
                    <VCardText>
                      <VDivider class="mb-3"/>
                      <VRow>
                        <!-- Secciones - Solo visible para Article -->
                        <VCol
                          v-if="config.contentType !== 'Live'"
                          cols="12"
                          md="6"
                        >
                          <div class="d-flex flex-column gap-3">
                            <VSwitch
                              v-model="config.switchSection"
                              label="Por sección"
                            />
                            <div v-if="config.switchSection">
                              <div class="mb-3">
                                <label class="text-subtitle-1 mb-2 d-block">Secciones y/o subsecciones incluidas</label>
                                <div class="d-flex flex-wrap gap-2 mb-2">
                                  <VChip
                                    v-for="(section, sIndex) in config.include_sections"
                                    :key="sIndex"
                                    closable
                                    class="ma-1"
                                    @click:close="removeSection(index, section, 'include')"
                                  >
                                    {{ section }}
                                  </VChip>
                                </div>
                                <VTextField
                                  v-model="newIncludeSection"
                                  placeholder="Escribe y agrega una coma (,) al final"
                                  @input="(event) => handleSectionInput(index, 'include', event)"
                                  hide-details
                                />
                              </div>
                              
                              <div>
                                <label class="text-subtitle-1 mb-2 d-block">Secciones y/o subsecciones excluidas</label>
                                <div class="d-flex flex-wrap gap-2 mb-2">
                                  <VChip
                                    v-for="(section, sIndex) in config.exclude_sections"
                                    :key="sIndex"
                                    closable
                                    class="ma-1"
                                    @click:close="removeSection(index, section, 'exclude')"
                                  >
                                    {{ section }}
                                  </VChip>
                                </div>
                                <VTextField
                                  v-model="newExcludeSection"
                                  placeholder="Escribe y agrega una coma (,) al final"
                                  @input="(event) => handleSectionInput(index, 'exclude', event)"
                                  hide-details
                                />
                              </div>
                            </div>
                          </div>
                        </VCol>
                        
                        <!-- URL - Centrado cuando es Live -->
                        <VCol
                          cols="12"
                          :md="config.contentType === 'Live' ? 12 : 6"
                          :class="{ 'text-left': config.contentType === 'Live' }"
                        >
                          <div class="d-flex flex-column gap-3" :class="{ 'align-left': config.contentType === 'Live' }">
                            <VSwitch
                              v-model="config.switchUrl"
                              label="Por URL"
                            />
                            <VTextField
                              v-if="config.switchUrl"
                              v-model="config.UrlName"
                              label="URL"
                              placeholder="https://www.ecuavisa.com/ejemplo"
                              :rules="[v => !config.switchUrl || (v && isValidUrl(v)) || 'Por favor ingrese una URL válida']"
                              :class="config.contentType === 'Live' ? 'w-50' : ''"
                            />
                          </div>
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>
                </VCol>

                <!-- Configuración de Límites -->
                <VCol cols="12" md="4" v-for="(item, lIndex) in limitItems" :key="lIndex">
                  <VCard>
                    <VCardTitle class="text-h6">{{ item.title }}</VCardTitle>
                    <VCardText>
                      <VDivider class="mb-3"/>
                      <VSwitch
                        v-model="config[item.switchModel]"
                        :label="item.switchLabel"
                      />
                      <VTextField
                        v-model.number="config[item.textModel]"
                        type="number"
                        :label="item.textLabel"
                        :disabled="!config[item.switchModel]"
                        min="0"
                      />
                    </VCardText>
                  </VCard>
                </VCol>

                <!-- Mensajes HTML -->
                <VCol cols="12">
                  <VCard>
                    <VCardTitle class="text-h6 font-weight-normal">
                      Configuración HTML a mostrar
                    </VCardTitle>
                    <VCardText>
                      <VDivider class="mb-3"/>
                      <VRow>
                        <VCol cols="12" md="6">
                          <VTextarea
                            v-model="config.messageToInviteRegister"
                            label="Mensaje para invitar a registrarse"
                            rows="4"
                          />
                        </VCol>
                        <VCol cols="12" md="6">
                          <VTextarea
                            v-model="config.messageToInviteSuscribers"
                            label="Mensaje para invitar a suscribirse"
                            rows="4"
                          />
                        </VCol>
                      </VRow>
                    </VCardText>
                  </VCard>
                </VCol>
              </VRow>

              <div class="d-flex gap-4 mt-4">
                <VBtn 
                  type="submit" 
                  color="primary" 
                  variant="tonal"
                  :loading="loading"
                  :disabled="loading"
                  class="text-uppercase"
                >
                  Guardar regla
                </VBtn>
                
                <VBtn 
                  color="secondary" 
                  variant="tonal" 
                  @click="getConfig"
                  :loading="loading"
                  :disabled="loading"
                  class="text-uppercase"
                >
                  Recargar Datos
                </VBtn>
              </div>
            </form>
          </VCardText>
        </VCard>
      </VWindowItem>
    </VWindow>

    <!-- confirmación para eliminar -->
    <VDialog v-model="deleteDialog.show" max-width="500px">
      <VCard>
        <VCardTitle>Confirmar eliminación</VCardTitle>
        <VCardText>
          ¿Está seguro que desea eliminar esta configuración? Esta acción no se puede deshacer.
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="error" variant="text" @click="deleteConfig">
            Eliminar
          </VBtn>
          <VBtn color="primary" variant="text" @click="deleteDialog.show = false">
            Cancelar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- confirmación para activar global -->
    <VDialog v-model="globalConfirmDialog.show" max-width="500px">
      <VCard>
        <VCardTitle>Confirmar activación global</VCardTitle>
        <VCardText>
          Mientras esto se encuentre activo, no se validará ninguna regla adicional del mismo tipo de contenido.
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn color="primary" variant="text" @click="confirmGlobalSwitch">
            Confirmar
          </VBtn>
          <VBtn color="error" variant="text" @click="cancelGlobalSwitch">
            Cancelar
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VSnackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      location="top end"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <VBtn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Cerrar
        </VBtn>
      </template>
    </VSnackbar>
  </div>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

const loading = ref(false);
const error = ref(null);
const newIncludeSection = ref('');
const newExcludeSection = ref('');
const activeTab = ref(0);
const configurations = ref([]);

const createDialog = ref({
  show: false,
  selectedType: 'Live'
});

const globalConfirmDialog = ref({
  show: false,
  config: null,
  previousValue: false
});

const deleteDialog = ref({
  show: false,
  index: null
});

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});


const hasGlobalArticleRule = computed(() => {
  return configurations.value.some(config => 
    config.switchGlobal && config.contentType === 'Article'
  );
});

const globalArticleConfigId = computed(() => {
  const config = configurations.value.find(config => 
    config.switchGlobal && config.contentType === 'Article'
  );
  return config ? config.id : null;
});


const limitItems = [
  {
    title: 'Visitantes',
    switchModel: 'activeLimitVisitors',
    switchLabel: 'Activar límite de visitantes',
    textModel: 'limitVisitors',
    textLabel: 'Límite de visitantes'
  },
  {
    title: 'Usuarios Registrados',
    switchModel: 'activeRegisteredVisitor',
    switchLabel: 'Activar límite de usuarios registrados',
    textModel: 'limitRegisteredVisitors',
    textLabel: 'Límite de usuarios registrados'
  },
  {
    title: 'Suscriptores',
    switchModel: 'activeLimitSuscribers',
    switchLabel: 'Activar límite de suscriptores',
    textModel: 'limitSuscribers',
    textLabel: 'Límite de suscriptores'
  }
];

const baseUrl = 'https://estadisticas.ecuavisa.com/sites/gestor/Tools/contenidoLimits/config_contenido.php';


const generateSimpleId = () => {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `config_${dateStr}_${random}`;
};

const getEmptyConfig = () => ({
  id: generateSimpleId(),
  name: 'Nueva configuración',
  contentType: 'Article',
  activeLimitVisitors: false,
  limitVisitors: 0,
  activeRegisteredVisitor: false,
  limitRegisteredVisitors: 0,
  activeLimitSuscribers: false,
  limitSuscribers: 0,
  messageToInviteRegister: '',
  messageToInviteSuscribers: '',
  switchGlobal: false,
  switchSection: false,
  include_sections: [],
  exclude_sections: [],
  switchUrl: false,
  UrlName: ''
});


const showCreateConfigDialog = () => {
  createDialog.value.selectedType = hasGlobalArticleRule.value ? 'Live' : 'Article';
  createDialog.value.show = true;
};

const getAvailableContentTypes = () => {
  if (hasGlobalArticleRule.value) {
    return ['Live'];
  }
  return ['Article', 'Live'];
};

const createNewConfig = () => {
  const newConfig = getEmptyConfig();
  newConfig.contentType = createDialog.value.selectedType;
  configurations.value.push(newConfig);
  activeTab.value = configurations.value.length - 1;
  createDialog.value.show = false;
};

// Funciones de validación
const isTabDisabled = (config) => {
  // Solo deshabilitar si es Article y no es la regla global activa
  return hasGlobalArticleRule.value && 
         config.contentType === 'Article' && 
         config.id !== globalArticleConfigId.value;
};

const isContentTypeDisabled = (config) => {
  return config.switchGlobal || 
         (hasGlobalArticleRule.value && config.contentType === 'Article');
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const handleGlobalSwitch = (value, config) => {
  if (value && config.contentType === 'Article') {
    globalConfirmDialog.value = {
      show: true,
      config,
      previousValue: !value
    };
  }
};

const confirmGlobalSwitch = async () => {
  const { config } = globalConfirmDialog.value;
  if (config) {
    config.switchGlobal = true;
    await updateConfig(configurations.value.findIndex(c => c.id === config.id));
  }
  globalConfirmDialog.value.show = false;
};

const cancelGlobalSwitch = () => {
  const { config, previousValue } = globalConfirmDialog.value;
  if (config) {
    config.switchGlobal = previousValue;
  }
  globalConfirmDialog.value.show = false;
};

// Funciones para el manejo de secciones
const capitalizeWords = (string) => {
  if (!string) return '';
  return string
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const handleSectionInput = (configIndex, type, event) => {
  const value = event.target.value;
  if (value.endsWith(',')) {
    const newSection = value.slice(0, -1).trim();
    if (newSection) {
      const config = configurations.value[configIndex];
      const sections = type === 'include' ? config.include_sections : config.exclude_sections;
      const capitalizedValue = capitalizeWords(newSection);
      
      if (!sections.includes(capitalizedValue)) {
        sections.push(capitalizedValue);
      }
      
      if (type === 'include') {
        newIncludeSection.value = '';
      } else {
        newExcludeSection.value = '';
      }
    }
  }
};

const removeSection = (configIndex, section, type) => {
  const config = configurations.value[configIndex];
  const sections = type === 'include' ? config.include_sections : config.exclude_sections;
  const index = sections.indexOf(section);
  if (index > -1) {
    sections.splice(index, 1);
  }
};

// Funciones para limpieza de datos
const cleanArrayData = (data) => {
  if (!data) return [];
  if (typeof data === 'string') {
    return [capitalizeWords(data)];
  }
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'string') {
        return capitalizeWords(item);
      }
      if (item && typeof item === 'object' && (item.value || item.title)) {
        return capitalizeWords(item.value || item.title);
      }
      return '';
    }).filter(item => item !== '');
  }
  return [];
};

// Funciones CRUD
const confirmDeleteConfig = (index) => {
  const config = configurations.value[index];
  
  // Permitir eliminar si:
  // 1. No hay regla global de Article, o
  // 2. Es la regla global de Article, o
  // 3. Es una regla de otro tipo (no Article)
  if (!hasGlobalArticleRule.value || 
      config.id === globalArticleConfigId.value || 
      config.contentType !== 'Article') {
    deleteDialog.value = {
      show: true,
      index
    };
  }
};

const deleteConfig = async () => {
  if (deleteDialog.value.index !== null) {
    try {
      const configToDelete = configurations.value[deleteDialog.value.index];
      
      if (configToDelete.switchGlobal && configToDelete.contentType === 'Article') {
        const confirmed = await new Promise(resolve => {
          if (confirm('Esta es una configuración global. ¿Está seguro de eliminarla?')) {
            resolve(true);
          } else {
            resolve(false);
          }
        });
        
        if (!confirmed) {
          deleteDialog.value.show = false;
          return;
        }
      }

      configurations.value.splice(deleteDialog.value.index, 1);
      
      const response = await axios({
        method: 'POST',
        url: `${baseUrl}?action=update`,
        data: configurations.value,
        headers: {
          'Accept': '*',
          'Content-Type': 'application/json',
        }
      });

      if (response.data && response.data.success) {
        showSnackbar('Configuración eliminada correctamente', 'success');
        if (activeTab.value >= configurations.value.length) {
          activeTab.value = Math.max(0, configurations.value.length - 1);
        }
      } else {
        throw new Error('Error al eliminar la configuración');
      }
    } catch (err) {
      showSnackbar('Error al eliminar la configuración', 'error');
      console.error('Error:', err);
    }
    deleteDialog.value.show = false;
  }
};

const updateConfig = async (index) => {
  loading.value = true;
  error.value = null;

  try {
    const currentConfig = configurations.value[index];
    
    if (currentConfig.switchGlobal && currentConfig.contentType === 'Article') {
      const otherGlobalArticle = configurations.value.find((config, i) => 
        i !== index && config.switchGlobal && config.contentType === 'Article'
      );
      
      if (otherGlobalArticle) {
        throw new Error('Ya existe una configuración global para artículos');
      }
    }

    if (currentConfig.switchUrl && !isValidUrl(currentConfig.UrlName)) {
      throw new Error('Por favor ingrese una URL válida');
    }

    const response = await axios({
      method: 'POST',
      url: `${baseUrl}?action=update`,
      data: configurations.value,
      headers: {
        'Accept': '*',
        'Content-Type': 'application/json',
      }
    });

    if (response.data && response.data.success) {
      showSnackbar('Configuración actualizada correctamente', 'success');
    } else {
      throw new Error(response.data?.message || 'Error al actualizar la configuración');
    }
  } catch (err) {
    console.error('Error al actualizar:', err);
    error.value = `Error al actualizar la configuración: ${err.message}`;
    showSnackbar('Error en la actualización', 'error');
  } finally {
    loading.value = false;
  }
};

const getConfig = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await axios({
      method: 'get',
      url: baseUrl,
      params: { 
        action: 'read'
      }
    });
    
    if (response.data && response.data.success && response.data.data) {
      const configsData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      
      configurations.value = configsData.map(data => ({
        id: data.id || generateSimpleId(),
        name: data.name || '',
        contentType: data.contentType || 'Article',
        activeLimitVisitors: data.activeLimitVisitors === true || data.activeLimitVisitors === 'true',
        limitVisitors: parseInt(data.limitVisitors) || 0,
        activeRegisteredVisitor: data.activeRegisteredVisitor === true || data.activeRegisteredVisitor === 'true',
        limitRegisteredVisitors: parseInt(data.limitRegisteredVisitors) || 0,
        activeLimitSuscribers: data.activeLimitSuscribers === true || data.activeLimitSuscribers === 'true',
        limitSuscribers: parseInt(data.limitSuscribers) || 0,
        messageToInviteRegister: data.messageToInviteRegister || '',
        messageToInviteSuscribers: data.messageToInviteSuscribers || '',
        switchGlobal: data.switchGlobal === true || data.switchGlobal === 'true',
        switchSection: data.switchSection === true || data.switchSection === 'true',
        include_sections: cleanArrayData(data.include_sections),
        exclude_sections: cleanArrayData(data.exclude_sections),
        switchUrl: data.switchUrl === true || data.switchUrl === 'true',
        UrlName: data.UrlName || ''
      }));
      
      showSnackbar('Configuraciones cargadas correctamente', 'success');
    } else {
      throw new Error('No se recibieron datos válidos del servidor');
    }
  } catch (err) {
    console.error('Error al cargar:', err);
    error.value = `Error al cargar la configuración: ${err.message}`;
    showSnackbar('Error al cargar las configuraciones', 'error');
  } finally {
    loading.value = false;
  }
};

const showSnackbar = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  };
};

onMounted(() => {
  getConfig();
});
</script>

<style scoped>
.v-divider {
  border-color: rgba(var(--v-border-color), 0.12);
}

.text-h6 {
  color: rgb(var(--v-theme-on-surface));
}

.gap-4 {
  gap: 1rem;
}

.gap-3 {
  gap: 0.75rem;
}

.gap-2 {
  gap: 0.5rem;
}

.font-weight-bold {
  font-weight: 700 !important;
}

.text-subtitle-1 {
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.75rem;
  letter-spacing: 0.009375em;
}

.mb-2 {
  margin-bottom: 0.5rem;
}

.d-block {
  display: block;
}

.ma-1 {
  margin: 0.25rem;
}

.ml-2 {
  margin-left: 0.5rem;
}

.d-flex.align-center {
  align-items: center;
}

/* Estilos para el modo Live */
.text-center {
  text-align: center;
}

.align-center {
  align-items: center;
}

.w-50 {
  width: 50% !important;
  margin: 0 auto;
}

/* Estilos para el tooltip */
.v-tooltip {
  border-radius: 4px;
  color: white;
  font-size: 0.875rem;
  padding: 5px 8px;
}

/* Estilos para los diálogos */
.v-dialog {
  border-radius: 4px;
  box-shadow: 0 11px 15px -7px rgba(0, 0, 0, 0.2),
              0 24px 38px 3px rgba(0, 0, 0, 0.14),
              0 9px 46px 8px rgba(0, 0, 0, 0.12);
}

/* elementos deshabilitados */
.v-btn--disabled,
.v-tab--disabled {
  opacity: 0.6;
  pointer-events: none;
}


.v-card {
  transition: box-shadow 0.3s ease;
}

/* .v-card:hover {
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16),
              0 3px 6px rgba(0, 0, 0, 0.23);
} */

/* Estilos para los chips */
.v-chip {
  transition: all 0.3s ease;
}

.v-chip:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.v-btn {
  text-transform: none;
  letter-spacing: 0.5px;
}


.v-text-field .v-input__slot {
  transition: border-color 0.3s ease;
}

.v-text-field--focused .v-input__slot {
  border-color: var(--v-primary-base);
}


.v-switch {
  margin-top: 4px;
  margin-bottom: 4px;
}


form {
  max-width: 100%;
}


.error-text {
  color: rgb(var(--v-error));
  font-size: 0.875rem;
  margin-top: 4px;
}

/* Estilos para los contenedores flexibles */
.d-flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.flex-wrap {
  flex-wrap: wrap;
}

/* Estilos para espaciado */
.mt-4 {
  margin-top: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-3 {
  margin-bottom: 0.75rem;
}

/* Estilos responsivos */
@media (max-width: 960px) {
  .w-50 {
    width: 75% !important;
  }
}

@media (max-width: 600px) {
  .w-50 {
    width: 100% !important;
  }
  
  .v-col-12 {
    padding: 8px;
  }
  
  .gap-4 {
    gap: 0.5rem;
  }
}
</style>