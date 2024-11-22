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

          <span class="text-uppercase">
            {{ modal.titulo || `Modal ${index + 1}` }}

          </span>
        

          <VSwitch class="mx-5" v-model="modal.estado" inset :label="capitalizedLabel(modal.estado)" />

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

                <VCol cols="6">
   

                  <VCombobox
                    label="País"
                    chips
                    v-model="modal.selectedCountry"
                    :items="countries"
                    item-title="country"
                    item-value="countryCode"
                    :hide-no-data="false"
                    :menu-props="{ maxHeight: '300' }"
                    @update:model-value="updateCities(index)"
                    return-object
                    clearable
                  />

                </VCol>
                <VCol cols="6">

                  <!-- Modifica el VCombobox de Ciudad así: -->
                  <VCombobox
                    label="Ciudad"
                    chips
                    v-model="modal.selectedCity"
                    :items="modal.availableCities"
                    item-title="city"
                    item-value="city"
                    :hide-no-data="false"
                    :menu-props="{ maxHeight: '300' }"
                    :disabled="!modal.selectedCountry"
                    @update:model-value="handleCityChange(index)"
                    return-object
                    clearable
                  />

         


                </VCol>
                <VCol cols="2">
                

                  <VBtn color="error" variant="text" @click="deleteModal(index)" >
                    <VIcon start icon="tabler-trash" />Eliminar
                  </VBtn>

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
const countries = ref([]);

// Función para obtener países y ciudades
const fetchCountriesAndCities = async () => {
  try {
    const response = await fetch('https://ecuavisa-suscripciones.vercel.app/otros/obtener-paises-ciudades');
    const data = await response.json();
    countries.value = data;
  } catch (error) {
    console.error('Error fetching countries and cities:', error);
  }
};

const handleCityChange = (modalIndex) => {
  if (!modals.value[modalIndex].selectedCity) {
    // Si se limpió la ciudad, actualizamos las ciudades disponibles
    updateCities(modalIndex);
  }
};

// Función para actualizar las ciudades disponibles según el país seleccionado
const updateCities = (modalIndex) => {
  const selectedCountry = modals.value[modalIndex].selectedCountry;
  if (selectedCountry && typeof selectedCountry === 'object') {
    const country = countries.value.find(c => c.countryCode === selectedCountry.countryCode);
    if (country) {
      modals.value[modalIndex].availableCities = country.data;
      // Solo resetear la ciudad si no hay una selección actual
      if (!modals.value[modalIndex].selectedCity) {
        modals.value[modalIndex].selectedCity = null;
      }
    }
  } else {
    modals.value[modalIndex].availableCities = [];
    modals.value[modalIndex].selectedCity = null;
  }
};




// Función para obtener los datos del JSON
const fetchData = async () => {
  try {
    const response = await fetch('https://estadisticas.ecuavisa.com/sites/gestor/Tools/suscripciones/modalondemand/v2/getData.php');
    const data = await response.json();
    modals.value = data.modals.map(modal => ({
      estado: modal.estado === "true",
      titulo: modal.titulo,
      contenido: modal.contenido,
      url: modal.url || [],
      selectedCountry: modal.paisCode  ? {
        country: modal.pais,
        countryCode: modal.paisCode
      } : null,
      selectedCity: modal.ciudad ? {
        city: modal.ciudad,
        countryCode: modal.city?.countryCode
      } : null,
      availableCities: []
    }));

 
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// Llamar a la función al montar el componente
onMounted(() => {
  fetchCountriesAndCities();
  fetchData();
});

// Función para agregar un nuevo modal
const addModal = () => {
  modals.value.push({
    estado: false,
    titulo: '',
    contenido: '',
    url: [],
    selectedCountry: null,
    selectedCity: null,
    availableCities: []
  });
};


// Función para borrar un modal por su índice
const deleteModal = (index) => {
  if (confirm('¿Estás seguro de que deseas eliminar este modal')) {
    modals.value.splice(index, 1);
    setTimeout(async () => {
      await updateData()
    }, 500);
  }
};


// Función para eliminar una URL de un modal específico
const removeUrl = (modalIndex, urlItem) => {
  modals.value[modalIndex].url = modals.value[modalIndex].url.filter(url => url !== urlItem);
};

// Función para actualizar los datos
const updateData = async () => {
  const newData = {
    key: "modalondemand",
    modals: modals.value.map(modal => {
      return {
        estado: modal.estado ? "true" : "false",
        titulo: modal.titulo,
        contenido: modal.contenido,
        url: modal.url,
        paisCode: modal.selectedCountry?.countryCode || '',
        pais: modal.selectedCountry?.country || '',
        ciudad: modal.selectedCity?.city || '',
        city: modal.selectedCity ? {
          city: modal.selectedCity.city,
          countryCode: modal.selectedCity.countryCode
        } : null
      };
    })
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
      fetchData();
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
