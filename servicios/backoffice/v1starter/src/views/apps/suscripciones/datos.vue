<script setup>
import { ref, onMounted, computed } from 'vue'

import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
moment.updateLocale('es', { week: { dow: 1 } });

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

const isInWeek = (date, weekOffset = 0) => {
  const start = moment().add(weekOffset, 'weeks').startOf('isoWeek');
  const end = moment().add(weekOffset, 'weeks').endOf('isoWeek');
  return moment(date).isBetween(start, end, null, '[]');
}

const getEcuadorDate = (date) => {
  return new Date(date.toLocaleString('en-US', { timeZone: 'America/Guayaquil' }))
}

const getWeekRange = (weekOffset = 0) => {
  const start = moment().add(weekOffset, 'weeks').startOf('isoWeek');
  const end = moment().add(weekOffset, 'weeks').endOf('isoWeek');
  return `${start.format('D')} al ${end.format('D')} de ${end.format('MMM YYYY')}`;
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
  return data.value.filter(usuario =>
    usuario.estado === 3 && isInWeek(usuario.created_at)
  ).length
})

const nuevosUsuariosSemanaAnterior = computed(() => {
  return data.value.filter(usuario =>
    usuario.estado === 3 && isInWeek(usuario.created_at, -1)
  ).length
})

const semanaActual = computed(() => getWeekRange())
const semanaAnterior = computed(() => getWeekRange(-1))

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="">
    <VRow>
      <VCol cols="12" md="12" lg="4">
        <VCard  style="height: 150px;" >
          <VCardText class="d-flex justify-space-between">
            <div>
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
                    <label class="text-primary">Pagados:</label> {{ usuariosActivos }}
                  </div>
                  <div class="d-flex align-center gap-2 my-1">
                    <label class="text-primary">Errores:</label> {{ usuariosInactivos }}
                  </div>
                </div>
              </div>

            </div>
            <VAvatar variant="tonal" color="success">
              <VIcon size="20" icon="tabler-user" />
            </VAvatar>

          </VCardText>
        </VCard>

      </VCol>
      <VCol cols="12" md="12" lg="4">
        <VCard  style="height: 150px;" >
          <VCardText class="d-flex justify-space-between">
            <div>
              <p v-if="loading">Cargando...</p>
              <p v-else-if="error">Error: {{ error }}</p>
              <div v-else>
                <span class="text-h56">Registrados por semana</span>
                <!-- <span>Total de usuarios activos:</span> -->
                <div>
                  <div class="d-flex align-center gap-2 my-1">
                    <label class="text-primary">Actual:</label> {{ nuevosUsuariosSemanaActual }}
                    <VAvatar size="x-small" variant="tonal" color="secondary">
                      <VIcon size="20" icon="tabler-info-circle" />
                      <VTooltip activator="parent" location="top">
                        {{ semanaActual }}
                      </VTooltip>
                    </VAvatar>
                  </div>
                  <div class="d-flex align-center gap-2 my-1">
                    <label class="text-primary">Anterior:</label> {{ nuevosUsuariosSemanaAnterior }}
                    <VAvatar size="x-small" variant="tonal" color="secondary">
                      <VIcon size="20" icon="tabler-info-circle" />
                      <VTooltip activator="parent" location="top">
                        {{ semanaAnterior }}
                      </VTooltip>
                    </VAvatar>
                  </div>
                </div>
              </div>

            </div>

            <VAvatar variant="tonal" color="warning">
              <VIcon size="20" icon="tabler-calendar" />
            </VAvatar>

          </VCardText>
        </VCard>
      </VCol>
      <VCol cols="12" md="12" lg="4">

        <VCard  style="height: 150px;" >
          <VCardText class="d-flex justify-space-between">
            <div>
              <p v-if="loading">Cargando...</p>
              <p v-else-if="error">Error: {{ error }}</p>
              <div v-else>
                <span class="text-h56">Reembolsos</span>
                <!-- <span>Total de usuarios activos:</span> -->
                <div>
                  <div class="d-flex align-center gap-2 my-1">
                    <label class="text-primary">Completados:</label> 00
                    
                  </div>
                  <div class="d-flex align-center gap-2 my-1">
                    <label class="text-primary">Rechazados:</label> 00
                   
                  </div>
                  <div class="d-flex align-center gap-2 my-1">
                    <label class="text-primary">Pendientes:</label> 00
                   
                  </div>
                </div>
              </div>

            </div>

            <VAvatar variant="tonal" color="primary">
              <VIcon size="20" icon="tabler-rotate-2" />
            </VAvatar>

          </VCardText>
        </VCard>
      </VCol>
    </VRow>




  </div>
</template>