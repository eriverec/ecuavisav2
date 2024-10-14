<template>
  <div>
    <VSnackbar :timeout="2000" v-model="isSave" color="success" transition="scale-transition" location="top end">
      Datos actualizados correctamente
    </VSnackbar>

    <VCard class="mt-5 card" title="Modal Omdemand" subtitle="Ecuavisa">
      <VCardText>
        <VRow class="ml-2 mr-2 mb-2">
          <VCol cols="12" md="6" lg="6">
            <VRow id="modal">
              <VCol cols="12">
                <VSwitch v-model="estado" :label="capitalizedLabel(estado)" />
              </VCol>
              <VCol cols="12">
                <VTextarea label="Contenido del modal" type="text" v-model="contenido" />
              </VCol>
              <VCol cols="12">
                  <div class="demo-space-x">
                    <VCombobox
                      class="listUrls"
                      v-model="urls"
                      multiple
                      chips
                      :items="items"
                      variant="outlined"
                      label="URLS"
                    />


                  </div>

        
              </VCol>
              <VCol cols="12">
                <VBtn @click="updateData" color="success" variant="tonal">
                  Guardar
                </VBtn>
              </VCol>
            </VRow>
          </VCol>

          <VCol cols="12" md="6" lg="6"></VCol>

        </VRow>

      </VCardText>
    </VCard>

  </div>

</template>
<style>
.listUrls .v-chip{
  white-space: normal; 
  height: auto;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';

// Variables reactivas
const estado = ref(false);
const contenido = ref('');
// const urlInput = ref('');
const urls = ref([]);
const isSave = ref(false);

// Función para obtener los datos del JSON
const fetchData = async () => {
  try {
    const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/suscripciones/modalondemand/getData.php');
    const data = await response.json();
    estado.value = data.data.estado === "true";
    contenido.value = data.data.contenido;
    urls.value = data.data.url || [];
    // urlInput.value = data.data.url.join(', ');
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Llamar a la función al montar el componente
onMounted(fetchData);

// Función para actualizar los datos
const updateData = async () => {
  //const urls = urlInput.value.split(/[\s,]+/).filter(url => url.length > 0); // Convertir la cadena en un array de URLs

  const urlsSinComas = urls.value // Convertir la cadena en un array de URLs



  const newData = {
    key: "modalondemand",
    data: {
      estado: estado.value ? "true" : "false",
      contenido: contenido.value,
      url: urlsSinComas
    }
  };

  try {
    const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/suscripciones/modalondemand/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
    });
    const data = await response.json();
    console.log("data", data);
    if (data.success) {
      isSave.value = true;
      fetchData(); // Refrescar los datos después de la actualización
    } else {
      console.error('Error actualizando:', data.error);
    }
  } catch (error) {
    console.error('Error updating data:', error);
  }
};

// Función para capitalizar el label del switch
const capitalizedLabel = (estado) => {
  return estado ? 'Activo' : 'Inactivo';
};
</script>

<style scoped>
/* Estilos personalizados para el componente */
</style>