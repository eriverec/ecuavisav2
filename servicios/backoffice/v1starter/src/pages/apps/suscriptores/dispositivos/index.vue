<template>
  <VCard class="gestionador-dispositivos">
    <VCardText>
      <div class="d-flex align-center mb-4">
        <VIcon
          icon="tabler-devices"
          size="x-large"
          class="mr-2"
        />
        <h2 class="text-h5 font-weight-bold">Gestión de Dispositivos</h2>
      </div>
      
      <p class="ingresa mb-4">Ingresa la cantidad de dispositivos permitidos:</p>
      
      <div class="d-flex align-center input-group">
        <VTextField
          v-model="numeroDispositivos"
          label="Número de dispositivos"
          type="text"
          class="mr-2"
          hide-details
        />
        <VTooltip location="top">
          <template #activator="{ props }">
            <VIcon
              icon="mdi-information-outline"
              v-bind="props"
              color="primary"
              size="small"
              class="mr-4"
            />
          </template>
          <span>Colocar "*" para definir sin límite</span>
        </VTooltip>
        <VBtn
          @click="actualizarDispositivos"
          color="primary"
          class="custom-btn"
        >
          Actualizar
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';

export default {
  name: 'GestionadorDispositivos',
  setup() {
    const numeroDispositivos = ref('')

    const obtenerInfo = async () => {
      try {
        const response = await axios.get('https://ecuavisa-suscripciones.vercel.app/backoffice/dispositivo/info/')
        numeroDispositivos.value = response.data.data.numero_dispositivos
      } catch (error) {
        console.error('Error al obtener la información:', error)
      }
    }

    const actualizarDispositivos = async () => {
      try {
        await axios.post('https://ecuavisa-suscripciones.vercel.app/backoffice/dispositivo/update', {
          numero_dispositivos: numeroDispositivos.value
        })
        alert('Número de dispositivos actualizado con éxito')
      } catch (error) {
        console.error('Error al actualizar los dispositivos:', error)
        alert('Error al actualizar los dispositivos')
      }
    }

    onMounted(obtenerInfo)

    return {
      numeroDispositivos,
      actualizarDispositivos
    }
  }
}
</script>

<style scoped>
.gestionador-dispositivos {
  margin: 0 auto;
  padding: 20px;
}

.ingresa {
  font-size: 17px;
  color: #7367F0;
}

.input-group {
  max-width: 50%;
}

.v-text-field {
  width: 200px;
}

:deep(.v-field__input) {
  padding-top: 8px !important;
  padding-bottom: 8px !important;
}

.custom-btn {
  height: 43px;
}
</style>