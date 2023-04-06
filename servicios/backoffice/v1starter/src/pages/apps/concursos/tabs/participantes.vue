<script setup>

/* https://showandevents-service.vercel.app/all */
// import TriviaParticipantes from '@/pages/apps/concursos/tabs/participantesCopy.vue'

const apiUrl = 'https://showandevents-service.vercel.app/all?fechai=2023-01-01&fechaf=2023-10-30' // Aquí deberás poner la URL de tu API
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
      answers: trivia.map(ans => ans.respuesta),
      counts: {}
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
          total: 0,
          counts: {}
        }
        acc[subkey].pregunta = item.pregunta
      }
      acc[subkey].answers.push(...item.answers)
      acc[subkey].total += item.answers.length

      item.answers.forEach(ans => {
        if (!acc[subkey].counts[ans]) {
          acc[subkey].counts[ans] = 1
        } else {
          acc[subkey].counts[ans] += 1
        }
      })
      return acc
    }, {})
    grouped[key] = Object.values(grouped[key])
  }
  return grouped
})

</script>

<template>
  <!-- <TriviaParticipantes /> -->
  <VCard v-if="isLoading" class="mt-6">
    <VCardItem>
      <div class="d-flex justify-space-between">
        <VCardTitle>Cargando datos...</VCardTitle>
      </div>
    </VCardItem>
  </VCard>

  <VExpansionPanels multiple class="mt-6" v-else>


    <VExpansionPanel class="" v-for="(group, id) in groupedData" :key="id">
      <VExpansionPanelTitle>
        <div class="d-flex justify-space-between">
          <VCardTitle>
            <div>
              <VChip label class="text-secundary">Trivia {{ id }} </VChip> {{ group[0].pregunta }} 
            </div>
          </VCardTitle>
        </div>
      </VExpansionPanelTitle>
      <VExpansionPanelText>
        <div>
          <aside class="d-flex justify-end">
            <a :href="'https://showandevents-service.vercel.app/export/excel?idTrivia=' + id">
              <VBtn size="small" class="me-3" variant="text" color="success" prepend-icon="tabler-download">
                Excel
              </VBtn>
            </a>
            <a :href="'https://showandevents-service.vercel.app/export/csv?idTrivia=' + id">
              <VBtn size="small" variant="text" color="primary" prepend-icon="tabler-download">
                CSV
              </VBtn>
            </a>
          </aside>
          <VTable class="text-no-wrap w-100 px-4">
            <thead>
              <tr>
                <th>NOMBRE</th>
                <th>APELLIDO</th>
                <th>TELEFONO</th>
                <!-- <th>Respuestas</th> -->
                <th>TOTAL</th>

              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in group" :key="index">
                <td class="font-weight-thin">{{ item.name }}</td>
                <td class="font-weight-thin">{{ item.lastname }}</td>
                <td class="font-weight-thin">{{ item.telefono }}</td>
                <!-- <td><ul><li v-for="(ans, i) in item.answers" :key="i">{{ ans }} {{ count }}</li></ul></td> -->
                <!-- <td>
                  <ul>
                    <li v-for="(count, answer) in item.counts" :key="answer">
                      {{ answer }} ({{ count }})
                    </li>
                  </ul>
                </td> -->
                <td class="font-weight-thin">{{ item.total }}</td>
              </tr>
            </tbody>

          </VTable>
        </div>
      </VExpansionPanelText>
    </VExpansionPanel>
  </VExpansionPanels>
</template>
