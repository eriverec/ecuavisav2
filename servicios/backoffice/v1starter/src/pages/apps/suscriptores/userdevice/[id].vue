<template>
  
    <VCard class="gestionador-dispositivos">
      <VCardText>
        <div>
   <h2>Dispositivos de {{ usuario.first_name }}  {{ usuario.last_name }}</h2>
    <!-- <VCardTitle class="pt-4 pl-6">Dispositivos de</VCardTitle>    -->
    
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
            {{ dispositivo.nombre_dispositivo }}
          </td>      
          <td class="text-medium-emphasis">
            <i :class="`fa fa-${dispositivo.navegador.toLowerCase()}`"></i>
            {{ dispositivo.navegador }}
          </td>   
          <td class="text-medium-emphasis">
            {{ dispositivo.geo.country }}
          </td>      
          <td class="text-medium-emphasis">
            {{ dispositivo.ip_dispositivo }}
          </td>      
          <td class="text-medium-emphasis">
            <VBtn 
              icon 
              color="error" 
              variant="text" 
              @click="eliminarSesion(dispositivo.ip_dispositivo)"
            >
              <VIcon size="22" icon="tabler-trash" />
            </VBtn>
          </td>             
        </tr>
      </tbody>
    </VTable>
  </div>
</VCardText>
</VCard>
</template>

<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';

export default {
  setup() {
    const usuario = ref({});
    const dispositivos = ref([]);
    const route = useRoute()
    const userId = Number(route.params.id); 

    const obtenerUsuario = async () => {
      try {
        const response = await axios.get(
          `https://ecuavisa-suscripciones.vercel.app/dispositivo/backoffice/all?page=1&limit=1&userId=${userId}`
        );
        usuario.value = response.data.data[0].user;
        dispositivos.value = response.data.data[0].dispositivos;
      } catch (error) {
        console.error(error);
      }
    };

    const eliminarTodasSesiones = async () => {
      try {
        await axios.post(
          `https://ecuavisa-suscripciones.vercel.app/dispositivo/web-cerrar-sesion-all/${userId}`
        );
        obtenerUsuario();
      } catch (error) {
        console.error(error);
      }
    };

    const eliminarSesion = async (ip) => {
      try {
        await axios.post(
          `https://ecuavisa-suscripciones.vercel.app/dispositivo/web-cerrar-sesion/${userId}`,
          { ip }
        );
        obtenerUsuario();
      } catch (error) {
        console.error(error);
      }
    };

    onMounted(() => {
      obtenerUsuario();
    });

    return {
      usuario,
      dispositivos,
      eliminarTodasSesiones,
      eliminarSesion,
    };
  },
};
</script>

<style scoped>

.gestionador-dispositivos {
  /* max-width: 600px; */
  margin: 0 auto;
  padding: 20px;
}
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

th {
  background-color: #f0f0f0;
}
</style>