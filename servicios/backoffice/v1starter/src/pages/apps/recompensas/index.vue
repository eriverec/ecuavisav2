<template>
  <section>
    <VCard title="Recompesas">
      <VCardSubtitle> Busca los usuarios por nombres, apellidos y emails </VCardSubtitle>
      <VCardText>
        <div class="d-flex gap-4">
          <VTextField v-model="searchTerm" @keyup.enter="search" style="max-width: 400px;" label="Buscar..."  />
          <VBtn @click="search" color="primary">
            Buscar
          </VBtn>
        </div>

      </VCardText>
    </VCard>

    <VCard class="mt-4" title="Resultado">
      <VCardText>

        <div v-if="loading">Cargando...</div>

        <VTable v-else-if="searchResults.length > 0" style="width: 100%;" class="text-no-wrap tableNavegacion mb-5"
          hover="true">
          <thead>
            <tr>
              <th scope="col">Usuario</th>
              <th scope="col">Correo</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in searchResults" :key="user._id" class="">
              <td>
                {{ (user.last_name + ' ' + user.first_name).length > 25 ? (user.last_name + ' ' + user.first_name).substring(0,
                  25) + "..." : (user.last_name + ' ' + user.first_name) }}
              </td>
              <td class="text-medium-emphasis">
                {{ user.email }}
              </td>

            </tr>

          </tbody>
        </VTable>
        <div v-else>
          <td colspan="3">No hay datos</td>
        </div>


      </VCardText>
    </VCard>
  </section>
</template>

<script setup>
import { ref } from 'vue';

const searchTerm = ref('');
const searchResults = ref([]);
const loading = ref(false);

const search = async () => {
  loading.value = true;
  try {
    const response = await fetch(`https://ads-service.vercel.app/busqueda/user/?s=${searchTerm.value}`);
    const data = await response.json();
    if (data.resp) {
      searchResults.value = data.data;
    } else {
      searchResults.value = [];
    }
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error);
  } finally {
    loading.value = false;
  }
};

</script>