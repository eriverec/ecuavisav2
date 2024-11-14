<template>
  <div>
    <VBtn
      color="primary"
      class="mb-4"
      prepend-icon="mdi-plus"
      @click="createNewConfig"
    >
      Crear nueva Regla
    </VBtn>

    <!-- Tabs -->
    <VTabs
      v-model="activeTab"
      color="primary"
      align-tabs="start"
      class="mb-4"
    >
      <VTab
        v-for="(config, index) in configurations"
        :key="index"
        :value="index"
      >
        {{ config.name }}
        <VBtn
          icon="mdi-delete"
          size="small"
          color="error"
          variant="text"
          class="ml-2"
          @click.stop="confirmDeleteConfig(index)"
        />
      </VTab>
    </VTabs>

    <VWindow v-model="activeTab">
      <VWindowItem
        v-for="(config, index) in configurations"
        :key="index"
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
                <VCol cols="12" md="12">
                  <VTextField
                    v-model="config.name"
                    label="Nombre de la configuración del límite"
                    required
                  />
                </VCol>
                
                <VCol cols="12" md="6" class="d-none">
                  <VSelect
                    v-model="config.contentType"
                    label="Tipo de Contenido"
                    :items="['Article', 'Video', 'Gallery']"
                    required
                  />
                </VCol>

                <!-- Switch Global -->
                <VCol cols="12">
                  <VCard>
                    <VCardTitle class="text-h6 font-weight-normal">
                      ¿Será un límite global?
                    </VCardTitle>
                    <VCardText>
                      <VSwitch
                        v-model="config.switchGlobal"
                        label="Activar en todo el sitio"
                      />
                    </VCardText>
                  </VCard>
                </VCol>

                <!-- Configuración por Sección / URL -->
                <VCol cols="12" v-if="!config.switchGlobal">
                  <VCard>
                    <VCardTitle class="text-h6 font-weight-normal">
                      Configuración por Sección / URL
                    </VCardTitle>
                    <VCardText>
                      <VDivider class="mb-3"/>
                      <VRow>
                        <VCol cols="12" md="6">
                          <div class="d-flex flex-column gap-3">
                            <VSwitch
                              v-model="config.switchSection"
                              label="Por sección"
                            />
                            <div v-if="config.switchSection">
                              <div class="mb-3">
                                <label class="text-subtitle-1 mb-2 d-block">Secciones incluidas</label>
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
                                <label class="text-subtitle-1 mb-2 d-block">Secciones excluidas</label>
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
                        
                        <VCol cols="12" md="6">
                          <div class="d-flex flex-column gap-3">
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
                >
                  Guardar Configuración
                </VBtn>
                
                <VBtn 
                  color="secondary" 
                  variant="tonal" 
                  @click="getConfig"
                  :loading="loading"
                  :disabled="loading"
                >
                  Recargar Datos
                </VBtn>
              </div>
            </form>
          </VCardText>
        </VCard>
      </VWindowItem>
    </VWindow>

    <!-- Diálogo de confirmación para eliminar -->
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

    <!-- Snackbar -->
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
import { onMounted, ref } from 'vue';

const loading = ref(false);
const error = ref(null);
const newIncludeSection = ref('');
const newExcludeSection = ref('');
const activeTab = ref(0);
const configurations = ref([]);

const deleteDialog = ref({
  show: false,
  index: null
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

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

const baseUrl = 'https://estadisticas.ecuavisa.com/sites/gestor/Tools/contenidoLimits/config_contenido.php';

const getEmptyConfig = () => ({
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

const createNewConfig = () => {
  configurations.value.push(getEmptyConfig());
  activeTab.value = configurations.value.length - 1;
};

const confirmDeleteConfig = (index) => {
  deleteDialog.value = {
    show: true,
    index
  };
};

const deleteConfig = async () => {
  if (deleteDialog.value.index !== null) {
    try {
      // Aquí iría la llamada al backend para eliminar la configuración
      configurations.value.splice(deleteDialog.value.index, 1);
      showSnackbar('Configuración eliminada correctamente', 'success');
      if (activeTab.value >= configurations.value.length) {
        activeTab.value = Math.max(0, configurations.value.length - 1);
      }
    } catch (err) {
      showSnackbar('Error al eliminar la configuración', 'error');
    }
    deleteDialog.value.show = false;
  }
};

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

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const updateConfig = async (index) => {
  loading.value = true;
  error.value = null;

  try {
    // Validar la URL de la configuración actual
    const currentConfig = configurations.value[index];
    if (currentConfig.switchUrl && !isValidUrl(currentConfig.UrlName)) {
      throw new Error('Por favor ingrese una URL válida');
    }

    
    const allConfigs = configurations.value.map(config => ({
      name: config.name,
      contentType: config.contentType,
      activeLimitVisitors: config.activeLimitVisitors,
      limitVisitors: parseInt(config.limitVisitors),
      activeRegisteredVisitor: config.activeRegisteredVisitor,
      limitRegisteredVisitors: parseInt(config.limitRegisteredVisitors),
      activeLimitSuscribers: config.activeLimitSuscribers,
      limitSuscribers: parseInt(config.limitSuscribers),
      messageToInviteRegister: config.messageToInviteRegister,
      messageToInviteSuscribers: config.messageToInviteSuscribers,
      switchGlobal: config.switchGlobal,
      switchSection: config.switchSection,
      include_sections: config.include_sections,
      exclude_sections: config.exclude_sections,
      switchUrl: config.switchUrl,
      UrlName: config.UrlName
    }));

    const response = await axios({
      method: 'POST',
      url: `${baseUrl}?action=update`,
      data: allConfigs, 
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
      // array de configuraciones
      const configsData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      
      configurations.value = configsData.map(data => ({
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
</style>