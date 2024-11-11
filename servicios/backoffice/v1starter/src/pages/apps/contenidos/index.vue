<template>
  <div>
    <VCard class="mt-5" title="Configuración de Límites de Contenido">
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

        <form @submit.prevent="updateConfig">
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

            <!-- Configuración por Sección / URL -->
            <VCol cols="12">
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
                        <VTextField
                          v-if="config.switchSection"
                          v-model="config.sectionName"
                          label="Nombre de la sección"
                          placeholder="Ejemplo: noticias, deportes, etc."
                          @input="capitalizeSectionName"
                        />
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
            <VCol cols="12" md="4" v-for="(item, index) in [
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
            ]" :key="index">
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

const config = ref({
  name: '',
  contentType: 'Article',
  activeLimitVisitors: false,
  limitVisitors: 0,
  activeRegisteredVisitor: false,
  limitRegisteredVisitors: 0,
  activeLimitSuscribers: false,
  limitSuscribers: 0,
  messageToInviteRegister: '',
  messageToInviteSuscribers: '',
  switchSection: false,
  sectionName: '',
  switchUrl: false,
  UrlName: ''
});

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

const baseUrl = 'https://estadisticas.ecuavisa.com/sites/gestor/Tools/contenidoLimits/config_contenido.php';

// Inicial en mayúscula
const capitalizeWords = (string) => {
  if (!string) return '';
  return string
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const capitalizeSectionName = (event) => {
  if (config.value.sectionName) {
    config.value.sectionName = capitalizeWords(config.value.sectionName);
  }
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const updateConfig = async () => {
  loading.value = true;
  error.value = null;

  try {
    if (config.value.switchUrl && !isValidUrl(config.value.UrlName)) {
      throw new Error('Por favor ingrese una URL válida');
    }

    const jsonData = {
      name: config.value.name,
      contentType: config.value.contentType,
      activeLimitVisitors: config.value.activeLimitVisitors,
      limitVisitors: parseInt(config.value.limitVisitors),
      activeRegisteredVisitor: config.value.activeRegisteredVisitor,
      limitRegisteredVisitors: parseInt(config.value.limitRegisteredVisitors),
      activeLimitSuscribers: config.value.activeLimitSuscribers,
      limitSuscribers: parseInt(config.value.limitSuscribers),
      messageToInviteRegister: config.value.messageToInviteRegister,
      messageToInviteSuscribers: config.value.messageToInviteSuscribers,
      switchSection: config.value.switchSection,
      sectionName: capitalizeWords(config.value.sectionName),
      switchUrl: config.value.switchUrl,
      UrlName: config.value.UrlName
    };

    console.log('Datos a enviar:', jsonData);

    const response = await axios({
      method: 'POST',
      url: `${baseUrl}?action=update`,
      data: jsonData,
      headers: {
        'Accept': '*',
        'Content-Type': 'application/json',
      }
    });

    console.log('Respuesta de actualización:', response.data);

    if (response.data && response.data.success) {
      showSnackbar('Configuración actualizada correctamente', 'success');
      await getConfig();
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
    
    console.log('Respuesta de lectura:', response.data);

    if (response.data && response.data.success && response.data.data) {
      const data = response.data.data;
      config.value = {
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
        switchSection: data.switchSection === true || data.switchSection === 'true',
        sectionName: capitalizeWords(data.sectionName || ''),
        switchUrl: data.switchUrl === true || data.switchUrl === 'true',
        UrlName: data.UrlName || ''
      };
      
      showSnackbar('Configuración cargada correctamente', 'success');
    } else {
      throw new Error('No se recibieron datos válidos del servidor');
    }
  } catch (err) {
    console.error('Error al cargar:', err);
    error.value = `Error al cargar la configuración: ${err.message}`;
    showSnackbar('Error al cargar la configuración', 'error');
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

.font-weight-bold {
  font-weight: 700 !important;
}
</style>