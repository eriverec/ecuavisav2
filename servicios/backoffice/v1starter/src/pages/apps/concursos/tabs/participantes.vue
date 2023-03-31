<script setup>


/* https://showandevents-service.vercel.app/all */
const isLoading = ref(true);
const urlAPI = "https://showandevents-service.vercel.app/all"
const userList = ref([])

const sortOptions = reactive({
  type: "asc",
  column: "total"
});

const groupedUsers = computed(() => {
  const groups = {}
  userList.value.forEach(user => {
    const key = `${user.nombre}-${user.apellido}`
    if (!groups[key]) {
      groups[key] = {
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
        direccion: user.direccion,
        porcentajeRespuestas: [parseFloat(user.porcentajeRespuestas)],
        respuestas: user.data[0].trivia.reduce((acc, pregunta) => {
          if (pregunta.respuesta !== "") {
            acc[pregunta.respuesta] = (acc[pregunta.respuesta] || 0) + 1
          }
          return acc
        }, {})
      }
    } else {
      groups[key].porcentajeRespuestas.push(parseFloat(user.porcentajeRespuestas))
      user.data[0].trivia.forEach(pregunta => {
        if (pregunta.respuesta !== "") {
          groups[key].respuestas[pregunta.respuesta] = (groups[key].respuestas[pregunta.respuesta] || 0) + 1
        }
      })
    }
  })
  return Object.values(groups)

})
const error = ref(null)
const orderAsc = ref(true);
const orderState = ref({
  orderBy: 'nombre',
  orderAsc: true,
})
const toggleOrderBy = (key) => {
  if (key === orderState.value.orderBy) {
    orderState.value.orderAsc = !orderState.value.orderAsc
  }
  orderState.value.orderBy = key
}
const sortedUsers = computed(() => {
  const arr = [...groupedUsers.value]
  const key = orderState.value.orderBy
  const asc = orderState.value.orderAsc
  return arr.sort((a, b) => {
    if (key === 'nombre') {
      if (asc) {
        return a.nombre < b.nombre ? -1 : a.nombre > b.nombre ? 1 : 0
      }
      return b.nombre < a.nombre ? -1 : b.nombre > a.nombre ? 1 : 0
    } else if (key === 'apellido') {
      if (asc) {
        return a.apellido < b.apellido ? -1 : a.apellido > b.apellido ? 1 : 0
      }
      return b.apellido < a.apellido ? -1 : b.apellido > a.apellido ? 1 : 0
    } 
    else if (key === 'respuestas') {
      const totalA = Object.values(a.respuestas).reduce((total, curr) => total + curr, 0)
      const totalB = Object.values(b.respuestas).reduce((total, curr) => total + curr, 0)
      if (asc) {
        return totalA - totalB
      }
      return totalB - totalA
    } else {
      return 0
    }
  })
})


onMounted(async () => {
  try {
    const response = await fetch(urlAPI)
    const data = await response.json()
    if (data.resp === true) {
      userList.value = data.data.map(item => ({
        nombre: item.data[0].name,
        apellido: item.data[0].lastname,
        telefono: item.data[0].telefono,
        direccion: item.data[0].direccion,
        porcentajeRespuestas: `${((item.data[0].trivia.filter(pregunta => pregunta.respuesta !== '').length / item.data[0].trivia.length) * 100).toFixed(2)}`,
        data: item.data
      }))
      isLoading.value = false;
    } else {
      error.value = 'Hubo un problema al cargar los datos'
    }
  } catch (err) {
    error.value = `Error: ${err.message}`
  }
})


</script>

<template>
  <div>

    <div v-if="isLoading" class="mt-6">Cargando datos...</div>
    <div class="mt-6" v-else>
      <VCard>
        <VCardItem class="pb-sm-0">
          <VCardTitle>Participantes</VCardTitle>
        </VCardItem>

        <VTable class="text-no-wrap w-100 px-4">
          <thead>
            <tr>
              <th @click="toggleOrderBy('nombre')">
                <div class="d-flex align-center justify-space-between v-card--link">
                  Nombre
                  <span class="d-flex flex-sm-column">
                    <VIcon color="danger" icon="tabler-chevron-up" />
                    <VIcon color="danger" icon="tabler-chevron-down" />
                  </span>
                </div>
              </th>
              <th @click="toggleOrderBy('apellido')">
                <div class="d-flex align-center justify-space-between v-card--link">
                  Apellido
                  <span class="d-flex flex-sm-column">
                    <VIcon color="danger" icon="tabler-chevron-up" />
                    <VIcon color="danger" icon="tabler-chevron-down" />
                  </span>
                </div>
              </th>
              <th>Teléfono</th>
              <!-- <th>Dirección</th> -->
              <!-- <th>Respuestas</th> -->
              <th @click="toggleOrderBy('respuestas')">
                <div class="d-flex align-center justify-space-between v-card--link">
                  Respuestas
                  <span class="d-flex flex-sm-column">
                    <VIcon color="danger" icon="tabler-chevron-up" />
                    <VIcon color="danger" icon="tabler-chevron-down" />
                  </span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in sortedUsers" :key="`${user.nombre}-${user.apellido}`">
              <td>{{ user.nombre }}</td>
              <td>{{ user.apellido }}</td>
              <td>{{ user.telefono }}</td>
              <!-- <td>{{ user.direccion }}</td> -->

              <!-- <td>
                <ul>
                  <li v-for="(count, answer) in user.respuestas" :key="answer">{{ answer }} ({{ count }})</li>
                </ul>
              </td> -->

              <td>{{ Object.values(user.respuestas).reduce((total, curr) => total + curr, 0) }}</td>

            </tr>
          </tbody>
        </VTable>

        <div v-if="error" role="alert">{{ error }}</div>

      </VCard>
    </div>


  </div>
</template>

<style scoped>
svg.iconify {
  font-size: 1rem;
}

.v-icon {
  height: 0.8em;
}
</style>
