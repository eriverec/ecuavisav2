<script setup>

/* https://showandevents-service.vercel.app/all */
// const isLoading = ref(true);
// const urlAPI = "https://showandevents-service.vercel.app/all"

const apiUrl = 'https://showandevents-service.vercel.app/all' // Aquí deberás poner la URL de tu API
const data = reactive([])
const isLoading = ref(true);

const fetchData = async () => {
  const response = await fetch(apiUrl)
  const json = await response.json()
  const parsedData = json.data.map(item => {
    const trivia = item.data[0].trivia.map(ans => ({
      pregunta: ans.pregunta,
      respuesta: ans.respuesta
    }))
    return {
      name: item.data[0].name,
      lastname: item.data[0].lastname,
      telefono: item.data[0].telefono,
      idTrivia: item.idTrivia,
      pregunta: trivia[0].pregunta,
      answers: trivia.map(ans => ans.respuesta)
    }
  })
  data.push(...parsedData)
  isLoading.value = false;
}

onMounted(() => {
  fetchData()
})

const groupedData = computed(() => {
  const byTrivia = data.reduce((acc, item) => {
    const key = item.idTrivia
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(item)
    return acc
  }, {})
  const grouped = {}
  for (const key in byTrivia) {
    grouped[key] = byTrivia[key].reduce((acc, item) => {
      const subkey = `${item.name}_${item.lastname}`
      if (!acc[subkey]) {
        acc[subkey] = {
          name: item.name,
          lastname: item.lastname,
          telefono: item.telefono,
          answers: [],
          total: 0
        }
        acc[subkey].pregunta = item.pregunta
      }
      acc[subkey].answers.push(...item.answers)
      acc[subkey].total += item.answers.length
      return acc
    }, {})
    grouped[key] = Object.values(grouped[key])
  }
  return grouped
})

</script>

<template>

  <VCard v-if="isLoading" class="mt-6">
    <VCardItem >
      <div class="d-flex justify-space-between">
        <VCardTitle >Cargando datos...</VCardTitle>
      </div>
    </VCardItem>
  </VCard>

  <VExpansionPanels multiple class="mt-6" v-else>


    <VExpansionPanel class="" v-for="(group, id) in groupedData" :key="id">
      <VExpansionPanelTitle>
        <div class="d-flex justify-space-between">
          <VCardTitle>
            <div>
              <VChip label class="text-success">Trivia {{ id }} </VChip> {{ group[0].pregunta }}
            </div>
          </VCardTitle>
        </div>
      </VExpansionPanelTitle>
      <VExpansionPanelText>
        <div>
          <VTable class="text-no-wrap w-100 px-4">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Teléfono</th>
                <!-- <th>Respuestas</th> -->
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in group" :key="index">
                <td>{{ item.name }}</td>
                <td>{{ item.lastname }}</td>
                <td>{{ item.telefono }}</td>
                <!-- <td><ul><li v-for="(ans, i) in item.answers" :key="i">{{ ans }}</li></ul></td> -->
                <td>{{ item.total }}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" align="right">
                  <aside class="mt-4">
                    <a :href="'https://showandevents-service.vercel.app/export/csv?idTrivia=' + id">
                      <VBtn class="me-3" variant="tonal" color="success" prepend-icon="tabler-download">
                        Excel
                      </VBtn>
                    </a>
                    <a :href="'https://showandevents-service.vercel.app/export/csv?idTrivia=' + id">
                      <VBtn variant="tonal" color="primary" prepend-icon="tabler-download">
                        CSV
                      </VBtn>
                    </a>
                  </aside>
                </td>
              </tr>
            </tfoot>
          </VTable>
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>
