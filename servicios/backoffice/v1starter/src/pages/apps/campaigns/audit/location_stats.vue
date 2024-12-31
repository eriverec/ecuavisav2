<script setup>
import moment from 'moment'
import { ref, watch } from 'vue'
import { VAvatar, VBtn, VChip, VExpansionPanel, VExpansionPanels, VExpansionPanelText, VExpansionPanelTitle, VTable } from 'vuetify/components'

const props = defineProps({
  campaignId: {
    type: String,
    required: true
  },
  dateRange: {
    type: Object,
    default: () => ({
      start: moment().subtract(30, 'days'),
      end: moment()
    })
  }
})

const locationData = ref([])
const isLoading = ref(true)
const expandedPanel = ref([0])

const fetchData = async () => {
  try {
    isLoading.value = true
    const response = await fetch(
      `https://ads-service.vercel.app/grafico/stats-paises-ciudades/${props.campaignId}?` + 
      `fechai=${props.dateRange.start.format('YYYY-MM-DD')}&` +
      `fechaf=${props.dateRange.end.format('YYYY-MM-DD')}&` +
      'page=1&limit=500000'
    )
    const data = await response.json()
    
    // Procesar y agrupar los datos por país y ciudad
    const groupedData = data.consulta.reduce((acc, item) => {
      if (!acc[item.pais]) {
        acc[item.pais] = {
          country: item.pais,
          cities: {},
          totalCities: 0
        }
      }
      
      if (!acc[item.pais].cities[item.ciudad]) {
        acc[item.pais].cities[item.ciudad] = {
          name: item.ciudad,
          clicks: 0,
          views: 0
        }
        acc[item.pais].totalCities++
      }
      
      if (item.type === 'click') {
        acc[item.pais].cities[item.ciudad].clicks += item.total
      } else if (item.type === 'preview') {
        acc[item.pais].cities[item.ciudad].views += item.total
      }
      
      return acc
    }, {})

    locationData.value = Object.values(groupedData).map(country => ({
      ...country,
      cities: Object.values(country.cities)
    }))
  } catch (error) {
    console.error('Error fetching location data:', error)
  } finally {
    isLoading.value = false
  }
}

const downloadCityData = async (country, city) => {
  try {
    const response = await fetch(
      `https://ads-service.vercel.app/grafico/stats-paises-ciudades/btn-descargar/${props.campaignId}?` + 
      `fechai=${props.dateRange.start.format('YYYY-MM-DD')}&` +
      `fechaf=${props.dateRange.end.format('YYYY-MM-DD')}&` +
      'page=1&limit=500000'
    )
    const data = await response.json()
    
    // Filtrar datos por país y ciudad
    const filteredData = data.consulta.filter(
      item => item.pais === country && item.ciudad === city.name
    )

    const headers = {
      type: 'Tipo',
      total: 'Total',
      pais: 'País',
      ciudad: 'Ciudad',
      userId: 'ID Usuario',
      first_name: 'Nombre',
      last_name: 'Apellido',
      email: 'Email',
      phone: 'Teléfono'
    }

    const csvData = filteredData.map(item => ({
      type: item.type,
      total: item.total,
      pais: item.pais,
      ciudad: item.ciudad,
      userId: item.user.wylexId,
      first_name: item.user.first_name,
      last_name: item.user.last_name,
      email: item.user.email,
      phone: item.user.phone_number || ''
    }))

    const csvContent = [
      Object.values(headers).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n')

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `estadisticas_${country}_${city.name}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    document.body.removeChild(link)
  } catch (error) {
    console.error('Error downloading data:', error)
  }
}

watch(() => [props.campaignId, props.dateRange], () => {
  fetchData()
}, { immediate: true })

</script>

<template>
  <VCard variant="text" class="pa-0">
    <VCardTitle class="d-flex justify-space-between align-center pa-4">
      <span>Estadísticas por Ubicación</span>
    </VCardTitle>

    <VCardText class="location-stats-container">
      <div v-if="isLoading" class="d-flex justify-center align-center py-4">
        <VProgressCircular indeterminate color="primary" />
      </div>
      
      <div v-else class="location-stats-scroll">
        <VExpansionPanels variant="accordion" v-model="expandedPanel">
          <VExpansionPanel
            v-for="country in locationData"
            :key="country.country"
          >
            <VExpansionPanelTitle class="d-flex flex-wrap justify-space-between gap-4">
              <div class="d-flex align-center">
                <VAvatar
                  class="me-3"
                  size="34"
                  :image="`https://www.countryflagicons.com/FLAT/64/${
                    country.country === 'United States' ? 'US' :
                    country.country === 'United Kingdom' ? 'GB' :
                    country.country.slice(0, 2).toUpperCase()
                  }.png`"
                />
                {{ country.country }}
              </div>
              <div class="d-flex align-center">
                <VChip
                  label
                  color="primary"
                  class="me-2"
                >
                  {{ country.totalCities }} {{ country.totalCities === 1 ? 'Ciudad' : 'Ciudades' }}
                </VChip>
              </div>
            </VExpansionPanelTitle>

            <VExpansionPanelText>
              <div class="border rounded">
                <VTable hover>
                  <thead>
                    <tr>
                      <th>Ciudad</th>
                      <th class="text-center">Clicks</th>
                      <th class="text-center">Impresiones</th>
                      <th class="text-center">Descargar usuarios</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="city in country.cities" :key="city.name">
                      <td>{{ city.name }}</td>
                      <td class="text-center">
                        <VChip
                          label
                          :color="city.clicks > 0 ? 'success' : 'grey'"
                          size="small"
                        >
                          {{ city.clicks }}
                        </VChip>
                      </td>
                      <td class="text-center">
                        <VChip
                          label
                          :color="city.views > 0 ? 'warning' : 'grey'"
                          size="small"
                        >
                          {{ city.views }}
                        </VChip>
                      </td>
                      <td class="text-center">
                        <VBtn
                          icon
                          size="small"
                          color="primary"
                          variant="text"
                          @click="downloadCityData(country.country, city)"
                        >
                          <VIcon>mdi-account-arrow-down-outline</VIcon>
                        </VBtn>
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </div>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </div>
    </VCardText>
  </VCard>
</template>

<style scoped>
.border {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important;
  border-radius: 6px;
}

.v-expansion-panel {
  margin-bottom: 8px !important;
}

.location-stats-container {
  height: 100%;
  padding: 0;
}

.location-stats-scroll {
  height: calc(100vh - 350px); 
  overflow-y: auto;
  padding: 0;
}

.location-stats-scroll::-webkit-scrollbar {
  width: 8px;
}

.location-stats-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.location-stats-scroll::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.location-stats-scroll::-webkit-scrollbar-thumb:hover {
  background: #555;
}

:deep(.v-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}

:deep(.v-card-text) {
  flex-grow: 1;
  padding: 0;
}
</style>