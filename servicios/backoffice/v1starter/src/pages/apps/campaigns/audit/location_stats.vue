<script setup>
import { ref, watch } from 'vue'
import { VAvatar, VBtn, VChip, VExpansionPanel, VExpansionPanels, VExpansionPanelText, VExpansionPanelTitle, VTable } from 'vuetify/components'

const props = defineProps({
  campaignId: {
    type: String,
    required: true
  },
  dateRange: {
    type: Object,
    required: true
  }
})

const locationData = ref([])
const isLoading = ref(true)
const expandedPanel = ref([0])
// const today = moment().format('YYYY-MM-DD')
// const dateRange = ref([today, today])

const getCountryCode = (countryName) => {
  const countryMap = {
    'United States': 'us',
    'United Kingdom': 'gb',
    'Spain': 'es',
    'Mexico': 'mx',
    'Colombia': 'co',
    'Argentina': 'ar',
    'Chile': 'cl',
    'Peru': 'pe',
    'Ecuador': 'ec',
    'Venezuela': 've',
    'Brazil': 'br'
  }
  return countryMap[countryName] || countryName.slice(0, 2).toLowerCase()
}

// const handleDateChange = (dates) => {
//   dateRange.value = dates
//   fetchData()
// }

const fetchData = async () => {
  try {
    isLoading.value = true
    const response = await fetch(
      `https://ads-service.vercel.app/grafico/stats-paises-ciudades/${props.campaignId}?` + 
      `fechai=${props.dateRange.start}&fechaf=${props.dateRange.end}&page=1&limit=500000`
    )
    const data = await response.json()
    
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
      `fechai=${props.dateRange.start}&fechaf=${props.dateRange.end}&page=1&limit=500000`
    )
    const data = await response.json()
    
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
      userId: item.user._id,
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
  } catch (error) {
    console.error('Error downloading data:', error)
  }
}

watch(() => props.campaignId, () => {
  fetchData()
}, { immediate: true })

watch(() => props.dateRange, () => {
  fetchData()
}, { deep: true })

</script>


<template>
  <div class="location-stats py-4">
    <div class="d-flex justify-space-between align-center  mb-4">
      <div class="date-picker-wrapper" style="width: calc(100% - 48px);">
        <!-- <AppDateTimePicker 
        prepend-inner-icon="tabler-calendar" 
          density="comfortable"
          style="max-width: 300px;"
          :show-current="true"
          @on-change="handleDateChange"
          :config="{
            position: 'auto right',
            mode: 'range',
            altFormat: 'F j, Y',
            dateFormat: 'Y-m-d',
            defaultDate: [today, today],
            maxDate: 'today',
            showMonths: 1,
            locale: {
              rangeSeparator: ' al ',
              firstDayOfWeek: 1
            }
          }"
        /> -->
      </div>
    </div>

    <div class="location-stats-container">
      <div v-if="isLoading" class="d-flex justify-center align-center py-4">
        <VProgressCircular indeterminate color="primary" />
      </div>
      
      <div v-else class="location-stats-scroll">
        <VExpansionPanels v-model="expandedPanel">
          <VExpansionPanel
            v-for="country in locationData"
            :key="country.country"
            class="location-panel"
          >
            <VExpansionPanelTitle class="d-flex flex-wrap justify-space-between gap-4">
              <div class="d-flex align-center">
                <VAvatar
                  class="me-3"
                  size="34"
                  :image="`https://hatscripts.github.io/circle-flags/flags/${getCountryCode(country.country).toLowerCase()}.svg`"
                />
                <span class="country-name">{{ country.country }}</span>
              </div>
              <div class="d-flex align-center">
                <VChip
                  label
                  color="primary"
                  variant="tonal"
                  class="me-2 cities-chip"
                >
                  {{ country.totalCities }} {{ country.totalCities === 1 ? 'Ciudad' : 'Ciudades' }}
                </VChip>
              </div>
            </VExpansionPanelTitle>

            <VExpansionPanelText>
              <VTable hover class="stats-table">
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
                        variant="tonal"
                      >
                        {{ city.clicks }}
                      </VChip>
                    </td>
                    <td class="text-center">
                      <VChip
                        label
                        :color="city.views > 0 ? 'warning' : 'grey'"
                        size="small"
                        variant="tonal"
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
                        @click.stop="downloadCityData(country.country, city)"
                      >
                        <VIcon>mdi-account-arrow-down-outline</VIcon>
                      </VBtn>
                    </td>
                  </tr>
                </tbody>
              </VTable>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </div>
    </div>
  </div>
</template>

<style scoped>
.location-stats {
  height: 100%;
}

.location-stats-container {
  height: 100%;
}

.location-stats-scroll {
  height: calc(100vh - 350px);
  overflow-y: auto;
}

.location-panel {
  margin-bottom: 8px !important;
  background: transparent !important;
  border: 1px solid rgba(var(--v-border-color), 0.12) !important;
}

:deep(.v-expansion-panel-title) {
  padding: 16px !important;
}

.country-name {
  font-size: 1rem;
  font-weight: 500;
}

.cities-chip {
  font-weight: 500;
}

.stats-table {
  background: transparent !important;
}

:deep(.stats-table th) {
  font-weight: 600 !important;
  color: rgb(var(--v-theme-on-surface)) !important;
  background: rgba(var(--v-theme-surface-variant), 0.1) !important;
}

:deep(.stats-table td) {
  color: rgb(var(--v-theme-on-surface)) !important;
}

:deep(.v-theme--dark) {
  .location-panel {
    border-color: rgba(255, 255, 255, 0.12) !important;
  }
  
  .stats-table th {
    background: rgba(255, 255, 255, 0.05) !important;
  }
}

.location-stats-scroll::-webkit-scrollbar {
  width: 8px;
}

.location-stats-scroll::-webkit-scrollbar-track {
  background: rgba(var(--v-theme-surface-variant), 0.1);
  border-radius: 4px;
}

.location-stats-scroll::-webkit-scrollbar-thumb {
  background: rgba(var(--v-theme-primary), 0.3);
  border-radius: 4px;
}

.location-stats-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(var(--v-theme-primary), 0.5);
}
</style>