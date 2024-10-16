<template>
  <div>
    <VSnackbar :timeout="2000" v-model="isSave" color="success" transition="scale-transition" location="top end">
      Datos actualizados correctamente
    </VSnackbar>

    <VCard class="mt-5 card" title="Modal Omdemand" subtitle="Ecuavisa">
      <VCardText>
        <div class=" mr-2 mb-2">
          <VBtn @click="addModal" color="primary">
            Agregar
          </VBtn>
        </div>
      </VCardText>
    </VCard>

    <VExpansionPanels class="mt-5 mb-5">
      <VExpansionPanel v-for="(modal, index) in modals" :key="index" :value="index">
        <VExpansionPanelTitle>
          <VBtn icon size="small" variant="text" color="error" class="float-right mr-2 mb-0 botonDelete" @click="deleteModal(index)">
            <VIcon>mdi-delete</VIcon>
          </VBtn>
          <span class="text-uppercase">
            {{ modal.titulo || `Modal ${index + 1}` }}

          </span>
          <VChip v-if="modal.estado" class="cls_estado" label color="success">Activo</VChip>
          <VChip v-else class="cls_estado" label color="error">Inactivo</VChip>

        </VExpansionPanelTitle>
        <VExpansionPanelText>
          <VCard flat>
            <VCardText>
              <VRow id="modal">

                <VCol cols="12">
                  <VTextField label="Titulo" v-model="modal.titulo" />
                </VCol>
                <VCol cols="12">
                  <VTextarea label="Contenido del modal" type="text" v-model="modal.contenido" />
                </VCol>
                <VCol cols="12">
                  <div class="demo-space-x">

                    <VCombobox class="listUrls" v-model="modal.url" multiple chips :items="modal.url" variant="outlined"
                      label="URLS" />

                  </div>
                </VCol>
                <VCol cols="12">
                  <VSwitch v-model="modal.estado" inset :label="capitalizedLabel(modal.estado)" />
                </VCol>

              </VRow>



            </VCardText>
          </VCard>

        </VExpansionPanelText>
      </VExpansionPanel>
    </VExpansionPanels>


    <div class="d-flex" style="justify-content: flex-end;">
      <VBtn @click="updateData" color="success" variant="tonal">
        Guardar
      </VBtn>


    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// Variables reactivas
const modals = ref([]);
const isSave = ref(false);

// Función para obtener los datos del JSON
const fetchData = async () => {
  try {
    const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/suscripciones/modalondemand/v2/getData.php');
    const data = await response.json();
    modals.value = data.modals.map(modal => ({
      estado: modal.estado === "true",
      titulo: modal.titulo,
      contenido: modal.contenido,
      url: modal.url || []
    }));
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Llamar a la función al montar el componente
onMounted(fetchData);

// Función para agregar un nuevo modal
const addModal = () => {
  modals.value.push({
    estado: false,
    titulo: '',
    contenido: '',
    url: []
  });
};

// Función para borrar un modal por su índice
const deleteModal = (index) => {
  modals.value.splice(index, 1);
};

// Función para eliminar una URL de un modal específico
const removeUrl = (modalIndex, urlItem) => {
  modals.value[modalIndex].url = modals.value[modalIndex].url.filter(url => url !== urlItem);
};

// Función para actualizar los datos
const updateData = async () => {
  const newData = {
    key: "modalondemand",
    modals: modals.value.map(modal => ({
      estado: modal.estado ? "true" : "false",
      titulo: modal.titulo,
      contenido: modal.contenido,
      url: modal.url
    }))
  };

  try {
    const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/suscripciones/modalondemand/v2/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData)
    });
    const data = await response.json();
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

<style>
.listUrls .v-chip {
  white-space: normal;
  height: auto;
}

.cls_estado {
  font-style: italic;
  font-size: small;
  font-weight: 500;
  margin: 0 5px;
}
</style>
