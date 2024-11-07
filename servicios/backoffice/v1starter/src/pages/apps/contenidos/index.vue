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

            <!-- Configuración de Visitantes -->
            <VCol cols="12">
              <VDivider class="mb-3"/>
              <h3 class="text-h6 mb-3">Configuración de Visitantes</h3>
              <VRow>
                <VCol cols="12" md="4">
                  <VSwitch
                    v-model="config.activeLimitVisitors"
                    label="Activar límite de visitantes"
                  />
                </VCol>
                <VCol cols="12" md="8">
                  <VTextField
                    v-model.number="config.limitVisitors"
                    type="number"
                    label="Límite de visitantes"
                    :disabled="!config.activeLimitVisitors"
                    min="0"
                  />
                </VCol>
              </VRow>
            </VCol>

            <!-- Configuración de Usuarios Registrados -->
            <VCol cols="12">
              <VDivider class="mb-3"/>
              <h3 class="text-h6 mb-3">Configuración de Usuarios Registrados</h3>
              <VRow>
                <VCol cols="12" md="4">
                  <VSwitch
                    v-model="config.activeRegisteredVisitor"
                    label="Activar límite de usuarios registrados"
                  />
                </VCol>
                <VCol cols="12" md="8">
                  <VTextField
                    v-model.number="config.limitRegisteredVisitors"
                    type="number"
                    label="Límite de usuarios registrados"
                    :disabled="!config.activeRegisteredVisitor"
                    min="0"
                  />
                </VCol>
              </VRow>
            </VCol>

            <!-- Configuración de Suscriptores -->
            <VCol cols="12">
              <VDivider class="mb-3"/>
              <h3 class="text-h6 mb-3">Configuración de Suscriptores</h3>
              <VRow>
                <VCol cols="12" md="4">
                  <VSwitch
                    v-model="config.activeLimitSuscribers"
                    label="Activar límite de suscriptores"
                  />
                </VCol>
                <VCol cols="12" md="8">
                  <VTextField
                    v-model.number="config.limitSuscribers"
                    type="number"
                    label="Límite de suscriptores"
                    :disabled="!config.activeLimitSuscribers"
                    min="0"
                  />
                </VCol>
              </VRow>
            </VCol>

            <!-- Mensajes -->
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
  messageToInviteSuscribers: ''
});

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
});

const baseUrl = 'https://estadisticas.ecuavisa.com/sites/gestor/Tools/contenidoLimits/config_contenido.php';

const updateConfig = async () => {
  loading.value = true;
  error.value = null;

  try {
    // Preparar los datos en formato JSON
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
      messageToInviteSuscribers: config.value.messageToInviteSuscribers
    };

    console.log('Datos a enviar:', jsonData);

    const response = await axios({
      method: 'POST',
      url: `${baseUrl}?action=update`,
      data: jsonData, // Axios automáticamente convierte el objeto a JSON
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
        messageToInviteSuscribers: data.messageToInviteSuscribers || ''
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
</style>