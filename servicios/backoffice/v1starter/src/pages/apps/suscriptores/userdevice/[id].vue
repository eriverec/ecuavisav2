<template>
  <VCard class="gestionador-dispositivos">
    <VCardText>
      <div>
        <h2 class="dispositivos-titulo">
          Dispositivos de<br>
          <span class="nombre-usuario">{{ usuario.first_name }} {{ usuario.last_name }}</span>
        </h2>
        
        <div class="d-flex flex-wrap gap-4 mt-10 mb-10">
          <VBtn 
            prepend-icon="tabler-trash" 
            color="error" 
            variant="tonal" 
            class="ml-auto" 
            @click="eliminarTodasSesiones"
          >
            Eliminar todas las sesiones
          </VBtn>
        </div>

        <VTable class="text-no-wrap tableNavegacion mb-5">
          <thead>
            <tr>                          
              <th scope="col">Nombre del dispositivo</th>
              <th scope="col">Navegador</th>
              <th scope="col">País</th>
              <th scope="col">IP</th>
              <th scope="col">Acciones</th>    
            </tr>
          </thead>

          <tbody>
            <tr v-for="dispositivo in dispositivos" :key="dispositivo.ip_dispositivo">
              <td class="text-medium-emphasis">
                <VIcon :icon="obtenerIconoDispositivo(dispositivo.nombre_dispositivo)" class="mr-2" />
                {{ dispositivo.nombre_dispositivo }}
              </td>      
              <td class="text-medium-emphasis">
                <VIcon :icon="obtenerIconoNavegador(dispositivo.navegador)" class="mr-2" />
                {{ dispositivo.navegador }}
              </td>   
              <td class="text-medium-emphasis">
                {{ dispositivo.geo.country }}
              </td>      
              <td class="text-medium-emphasis">
                {{ dispositivo.ip_dispositivo }}
              </td>      
              <td class="text-medium-emphasis">
                <VTooltip location="top">
                  <template #activator="{ props }">
                    <VBtn 
                      icon 
                      color="error" 
                      variant="text" 
                      v-bind="props"
                      @click="eliminarSesion(dispositivo.ip_dispositivo)"
                    >
                      <VIcon size="22" icon="tabler-trash" />
                    </VBtn>
                  </template>
                  <span>Eliminar este dispositivo</span>
                </VTooltip>
              </td>             
            </tr>
          </tbody>
        </VTable>
      </div>
    </VCardText>
  </VCard>
</template>

<script setup>
import { useToast } from '@core/composable/useToast';
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const toast = useToast();
const usuario = ref({});
const dispositivos = ref([]);
const userId = Number(route.params.id);

const obtenerUsuario = async () => {
  try {
    const response = await axios.get(
      `https://ecuavisa-suscripciones.vercel.app/backoffice/dispositivo/web-get/${userId}`
    );
    usuario.value = response.data.data.user;
    dispositivos.value = response.data.data.dispositivos;
  } catch (error) {
    console.error(error);
    mostrarAlerta('Error al obtener los datos del usuario', 'error');
  }
};

const eliminarTodasSesiones = async () => {
  try {
    await axios.post(
      `https://ecuavisa-suscripciones.vercel.app/dispositivo/web-cerrar-sesion-all/${userId}`
    );
    obtenerUsuario();
    mostrarAlerta('Todas las sesiones han sido eliminadas', 'success');
  } catch (error) {
    console.error(error);
    mostrarAlerta('Error al eliminar todas las sesiones', 'error');
  }
};

const eliminarSesion = async (ip) => {
  try {
    await axios.post(
      `https://ecuavisa-suscripciones.vercel.app/dispositivo/web-cerrar-sesion/${userId}`,
      { ip }
    );
    obtenerUsuario();
    mostrarAlerta('Sesión eliminada correctamente', 'success');
  } catch (error) {
    console.error(error);
    mostrarAlerta('Error al eliminar la sesión', 'error');
  }
};

const mostrarAlerta = (mensaje, tipo) => {
  toast({
    title: tipo === 'success' ? 'Éxito' : 'Error',
    text: mensaje,
    variant: tipo,
  });
};

const obtenerIconoNavegador = (navegador) => {
  const iconos = {
    'Chrome': 'tabler-brand-chrome',
    'Firefox': 'tabler-brand-firefox',
    'Safari': 'tabler-brand-safari',
    'Edge': 'tabler-brand-edge',
    'Opera': 'tabler-brand-opera',
    'iOS': 'tabler-brand-apple-arcade',
  };
  return iconos[navegador] || 'tabler-world-www';
};

const obtenerIconoDispositivo = (nombreDispositivo) => {
  if (nombreDispositivo.toLowerCase().includes('desktop')) {
    return 'tabler-device-desktop';
  } else if (nombreDispositivo.toLowerCase().includes('mobile')) {
    return 'tabler-device-mobile';
  } else if (nombreDispositivo.toLowerCase().includes('tablet')) {
    return 'tabler-device-tablet';
  }
  return 'tabler-device';
};

onMounted(() => {
  obtenerUsuario();
});
</script>

<style scoped>
.gestionador-dispositivos {
  margin: 0 auto;
  padding: 20px;
}

.dispositivos-titulo {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.nombre-usuario {
  color: #7367F0;
  font-weight: bold;
}

.tableNavegacion {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.tableNavegacion th,
.tableNavegacion td {
  border: none;
  border-bottom: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

.tableNavegacion th {
  background-color: transparent;
  font-weight: bold;
  color: #333;
}

.tableNavegacion tr:last-child td {
  border-bottom: none;
}

.tableNavegacion tr:hover {
  background-color: #f5f5f5;
}
</style>