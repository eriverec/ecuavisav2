<script setup>
import { ref, onMounted, computed } from 'vue'

const data = ref([])
const loading = ref(true)
const error = ref(null)
const currentPage = ref(1)
const totalRecords = ref(0)
const limit = 50

const fetchData = async () => {
  try {
    loading.value = true
    const response = await fetch(`https://ecuavisa-suscripciones.vercel.app/suscripciones/all?page=${currentPage.value}&limit=${limit}`)
    if (!response.ok) {
      throw new Error('Network response was not ok')
    }
    const jsonData = await response.json()
    data.value = [...data.value, ...jsonData.data]
    totalRecords.value = jsonData.total

    if (data.value.length < totalRecords.value) {
      currentPage.value++
      await fetchData()
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const usuariosActivos = computed(() => {
  return data.value.filter(usuario => usuario.estado === 3).length
})

const usuariosInactivos = computed(() => {
  return data.value.filter(usuario => usuario.estado != 3).length
})

const getEcuadorDate = (date) => {
  return new Date(date.toLocaleString('en-US', { timeZone: 'America/Guayaquil' }))
}

const isThisWeek = (date) => {
  const now = getEcuadorDate(new Date())
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay())
  const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 6)
  return date >= weekStart && date <= weekEnd
}

const isLastWeek = (date) => {
  const now = getEcuadorDate(new Date())
  const lastWeekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 7)
  const lastWeekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() - 1)
  return date >= lastWeekStart && date <= lastWeekEnd
}

const nuevosUsuariosSemanaActual = computed(() => {
  return data.value.filter(usuario => {
    const createdDate = getEcuadorDate(new Date(usuario.created_at))
    return isThisWeek(createdDate)
  }).length
})

const nuevosUsuariosSemanaAnterior = computed(() => {
  return data.value.filter(usuario => {
    const createdDate = getEcuadorDate(new Date(usuario.created_at))
    return isLastWeek(createdDate)
  }).length
})

onMounted(() => {
  fetchData()
})
</script>

<template>
  <VCard class="mb-4" style="width: 400px;">
    <VCardText class="d-flex justify-space-between">
      <p v-if="loading">Cargando...</p>
      <p v-else-if="error">Error: {{ error }}</p>
      <div v-else>
        <span class="text-h56">Total de usuarios</span>
        <!-- <span>Total de usuarios activos:</span> -->
        <div>
          <div class="d-flex align-center gap-2 my-1">
            <label class="text-primary">Registrados:</label> {{ totalRecords }}
          </div>
          <div class="d-flex align-center gap-2 my-1">
            <label class="text-primary">Activos:</label> {{ usuariosActivos }}
          </div>
          <div class="d-flex align-center gap-2 my-1">
            <label class="text-primary">Inactivos:</label> {{ usuariosInactivos }}
          </div>
          <div class="d-flex align-center gap-2 my-1">
            <label class="text-primary">Registrados esta semana:</label> {{ nuevosUsuariosSemanaActual }}
          </div>
          <div class="d-flex align-center gap-2 my-1">
            <label class="text-primary">Registrados semana pasada:</label> {{ nuevosUsuariosSemanaAnterior }}
          </div>
        </div>
      </div>

    </VCardText>
  </VCard>
</template>