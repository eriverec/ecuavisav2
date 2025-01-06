<script setup>
import debounce from 'lodash/debounce'
import moment from 'moment'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'


const router = useRouter()



const handleDateChange = () => {
  if (dateRange.value[0] && dateRange.value[1]) {
    buscarCampañasDebounced()
  }
}

const handleViewClick = async (campaignId) => {

  const campaign = dataCampaigns.value.find(c => c._id === campaignId)
  if (campaign) {
    campaign.loading = true
  }

  await router.push({ 
    name: 'apps-campaigns-view-id', 
    params: { id: campaignId } 
  })

  if (campaign) {
    campaign.loading = false
  }
}

const currentPage = ref(1)
const totalRegistros = ref(1)
const totalRegistrosHtml = ref(1)
const dataCampaigns = ref([])
const derviceExistData = ref(false)
const searchQuery = ref('')
const disabledPagination = ref(false)
const statusFilter = ref('todos')
const dateRange = ref([null, null])
const menuDate = ref(false)

const dateRangeText = computed(() => {
  if (!dateRange.value?.[0] || !dateRange.value?.[1]) return ''
  return `${moment(dateRange.value[0]).format('DD/MM/YY')} - ${moment(dateRange.value[1]).format('DD/MM/YY')}`
})

const clearDateRange = () => {
  dateRange.value = [null, null]
  buscarCampañasDebounced()
}
const applyDateFilter = (campaigns) => {
  if (!dateRange.value?.[0] || !dateRange.value?.[1]) return campaigns
  
  const startDate = moment(dateRange.value[0]).startOf('day')
  const endDate = moment(dateRange.value[1]).endOf('day')

  return campaigns.filter(campaign => {
    if (!campaign.fechai || !campaign.fechaf) return false
    const campaignStart = moment(campaign.fechai).startOf('day')
    const campaignEnd = moment(campaign.fechaf).endOf('day')
    
    return (campaignStart.isSameOrBefore(endDate) && campaignEnd.isSameOrAfter(startDate))
  })
}

const getStats = async (campaignId) => {
  try {
    const fechai = moment().subtract(30, 'days').format('YYYY-MM-DD')
    const fechaf = moment().format('YYYY-MM-DD')
    
    const response = await fetch(
      `https://ads-service.vercel.app/grafico/stats-diario/${campaignId}?fechai=${fechai}&fechaf=${fechaf}&page=1&limit=500000`
    )
    const data = await response.json()

    if (data?.resp && data?.data?.preview && data?.data?.click) {
      const stats = data.data
      const totalImpresiones = stats.preview?.reduce((acc, curr) => acc + (curr?.total || 0), 0) || 0
      const totalClicks = stats.click?.reduce((acc, curr) => acc + (curr?.total || 0), 0) || 0
      const ctr = totalImpresiones > 0 ? Math.round((totalClicks / totalImpresiones) * 100) : 0

      return {
        impresiones: totalImpresiones,
        clicks: totalClicks,
        ctr
      }
    }
    return { impresiones: 0, clicks: 0, ctr: 0 }
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error)
    return { impresiones: 0, clicks: 0, ctr: 0 }
  }
}

async function getCampaigns(page = 1, limit = 10, s = null) {
  const applyStatusFilter = (campaigns) => {
    if (statusFilter.value === 'todos') return campaigns
    return campaigns.filter(campaign => campaign.statusCampaign === statusFilter.value)
  }

  const applyDateFilter = (campaigns) => {
  if (!dateRange.value[0] || !dateRange.value[1]) return campaigns
  
  const startDate = moment(dateRange.value[0]).startOf('day')
  const endDate = moment(dateRange.value[1]).endOf('day')

  return campaigns.filter(campaign => {
    const campaignStart = moment(campaign.fechai).startOf('day')
    const campaignEnd = moment(campaign.fechaf).endOf('day')
    
    return (campaignStart.isSameOrBefore(endDate) && campaignEnd.isSameOrAfter(startDate))
  })
}
  try {
    derviceExistData.value = true
    var myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/json")

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    }

    var response = await fetch(
      `https://ads-service.vercel.app/campaign/get/all?page=${page}&limit=${limit}` + (s ? ("&s=" + s) : ""),
      requestOptions
    )
    const data = await response.json()

    // estadísticas para cada campaña
    const campaignsWithStats = await Promise.all(
      data.data.map(async (campaign) => {
        const stats = await getStats(campaign._id)
        return {
          ...campaign,
          ...stats
        }
      })
    )

    dataCampaigns.value = applyDateFilter(applyStatusFilter(campaignsWithStats))
    totalRegistrosHtml.value = data.total
    totalRegistros.value = Math.ceil(data.total / data.limit)
    derviceExistData.value = false
    return true
  } catch (error) {
    derviceExistData.value = false
    console.error(error.message)
    return false
  }
}


const handlePaginationClick = async () => {
  disabledPagination.value = true
  await getCampaigns(currentPage.value)
  disabledPagination.value = false
}

// Función búsqueda
const buscarCampañas = async () => {
  try {
    const query = searchQuery.value?.toLowerCase()
    disabledPagination.value = true
    await getCampaigns(1, 10, query)
    disabledPagination.value = false
  } catch (error) {
    console.error("Error en búsqueda:", error)
  }
}

const buscarCampañasDebounced = debounce(buscarCampañas, 500)

onMounted(() => {
  getCampaigns()
})
</script>

<template>
  <VCard>
    <VCardText>
      <div class="d-flex flex-wrap py-4 gap-4 align-items-center" style="justify-content: space-between;">
        <div>
          <VCardTitle class="pa-0">
            Estado de campañas
          </VCardTitle>
          <VCardSubtitle class="pa-0 mb-3">Visualiza el rendimiento de las campañas en tiempo real</VCardSubtitle>
        </div>
      </div>
      <div class="d-flex align-center gap-4 mb-4">
        <VSelect
          v-model="statusFilter"
          label="Filtro por estado de campañas"
          :items="[
            { title: 'Todos', value: 'todos' },
            { title: 'Activo', value: true },
            { title: 'Inactivo', value: false }
          ]"
          density="compact"
          class="max-w-[150px]"
          hide-details
          @update:model-value="buscarCampañasDebounced"
        />

        <!-- <VMenu
          v-model="menuDate"
          :close-on-content-click="false"
        >
          <template v-slot:activator="{ props }">
            <VTextField
              v-model="dateRangeText"
              prepend-inner-icon="mdi-calendar-range"
              readonly
              label="Rango de fechas"
              hide-details
              density="compact"
              clearable
              class="max-w-[200px]"
              v-bind="props"
              @click:clear="clearDateRange"
            />
          </template>
          <VCard>
            <VPicker
              v-model="dateRange"
              mode="range"
              title="Selecciona el rango"
              elevation="0"
            >
              <template v-slot:actions>
                <VBtn
                  color="primary"
                  variant="text"
                  @click="menuDate = false"
                  size="small"
                >
                  Cerrar
                </VBtn>
              </template>
            </VPicker>
          </VCard>
        </VMenu> -->
        <VSpacer />
        <VTextField
          v-model="searchQuery"
          label="Buscar por título"
          prepend-inner-icon="mdi-magnify"
          single-line
          hide-details
          clearable
          :disabled="disabledPagination"
          class="max-w-xs"
          @input="buscarCampañasDebounced"
          @click:clear="buscarCampañasDebounced"
        />
      </div>

      <VList lines="two" border v-if="derviceExistData">
        <VListItem>
          <VListItemTitle>
            <div class="loading"></div>
          </VListItemTitle>
        </VListItem>
      </VList>

      <template v-else>
        <VDivider />
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">Campaña</th>
              <th scope="col">Estado</th>
    
              <th scope="col">Sector</th>
              <th scope="col">Fecha Inicio</th>
              <th scope="col">Fecha Final</th>
              <th scope="col">Impresiones</th>
              <th scope="col">Clicks</th>
              <th scope="col">CTR</th>
              <!-- <th scope="col">Creación</th> -->
              <th scope="col" class="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="campaign in dataCampaigns"
              :key="campaign._id"
              style="height: 3.5rem;"
            >
              
              <td>
                <div class="d-flex flex-column">
                  <h6 class="text-base font-weight-medium mb-0">
                    {{ campaign.campaignTitle }}
                  </h6>
                </div>
              </td>
              <td>
                <VChip
                  :color="campaign.statusCampaign ? 'success' : 'grey'"
                  size="small"
                >
                  {{ campaign.statusCampaign ? 'Activo' : 'Inactivo' }}
                </VChip>
              </td>
              <td class="text-medium-emphasis">
                <div v-if="campaign.criterial.country != null && campaign.criterial.country != -1 && campaign.participantes != 'personalizado'" class="text-xs text-disabled">
                  <VIcon icon="mdi-location" />
                  <template v-if="campaign.criterial.city != -1">
                    {{campaign.criterial.country}}, {{ campaign.criterial.city == "0" ? "": campaign.criterial.city }}
                  </template>
                  <template v-else>
                    {{ Array.isArray(campaign.criterial.country) ? 
                      (campaign.criterial.country.length > 0 ? campaign.criterial.country.join(', ') : "No definido") : 
                      campaign.criterial.country }}, Todas las ciudades
                  </template>
                </div>
                <div v-else class="text-xs text-disabled">
                  Audiencia personalizada
                </div>
              </td>
              <td class="text-medium-emphasis">{{ moment(campaign.fechai).format('DD/MM/YYYY') }}</td>
              <td class="text-medium-emphasis">{{ moment(campaign.fechaf).format('DD/MM/YYYY') }}</td>
              <td class="text-medium-emphasis text-center">{{ campaign.impresiones.toLocaleString() }}</td>
              <td class="text-medium-emphasis text-center">{{ campaign.clicks.toLocaleString() }}</td>
              <td class="text-medium-emphasis text-center">{{ campaign.ctr }}%</td>
              <!-- <td class="text-medium-emphasis">{{ moment(campaign.created_at).format('DD/MM/YYYY') }}</td> -->
              <td class="text-center">
                <VTooltip text="Ver más detalles y métricas de esta campaña">
                  <template v-slot:activator="{ props }">
                    <VBtn
                      icon
                      variant="text"
                      size="small"
                      color="default"
                      v-bind="props"
                      :loading="campaign.loading"
                      @click="handleViewClick(campaign._id)"
                    >
                      <VIcon size="18" icon="mdi-eye-outline" />
                    </VBtn>
                  </template>
                </VTooltip>
              </td>
            </tr>
          </tbody>

          <tfoot v-show="!dataCampaigns.length">
            <tr>
              <td
                colspan="9"
                class="text-center text-body-1"
              >
                No hay registros que mostrar
              </td>
            </tr>
          </tfoot>
        </VTable>
        
        <VDivider v-show="dataCampaigns.length" />
        <div class="d-flex flex-column gap-4 mt-4">
          <span class="text-sm text-disabled" v-show="dataCampaigns.length">
            Total de registros {{ totalRegistrosHtml }}
          </span>
          <VPagination
            v-model="currentPage"
            :length="totalRegistros"
            :disabled="disabledPagination"
            @click="handlePaginationClick"
          />
        </div>
      </template>
    </VCardText>
  </VCard>
</template>

<style scoped>
.v-table {
  background: transparent !important;
}

.v-table th {
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  font-size: 0.75rem;
}

.v-table td {
  vertical-align: middle;
}

.loading {
  border: 2px solid #7367F0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border-right-color: transparent;
  animation: rot 1s linear infinite;
}

@keyframes rot {
  100% {
    transform: rotate(360deg);
  }
}
</style>