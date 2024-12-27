<script>
import DailyStats from '@/pages/apps/campaigns/audit/daily_stats.vue'
import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js"

import { hexToRgb } from '@layouts/utils'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import esLocale from "moment/locale/es"
import { useRoute } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'
import TabGroupTable from './tabGroupTable.vue'


const moment = extendMoment(Moment)
moment.locale('es', [esLocale])

const valoresHoy = useSelectValueCalendar()

export default {
  components: {
    VueApexCharts,
    TabGroupTable,
    DailyStats
  },

  setup() {
    const route = useRoute()
    const loadingMetrics = ref(false)
    
    return {
      id: route.params.id,
      moment,
      loadingMetrics
    }
  },
  
  data() {
    return {
      showContentDialog: false,
      isLoadingPosition: false,
      isLoadingContent: false,
      isFullLoading: false,
      loadingMetrics: false,
      showDialog: false,
      activeTab: 'resumen',
      positionDetails: null,
      campaignsList: [], // para TabGroupTable
      dataChart_1: [],
      dataChart_2: [],
      dataRegistros: [],
      dataRegistrosBackup: [],
      dataRegistrosExport: [],
      
      // Configuración de fechas
      selectedfechaIniFin: 'Hoy',
      fechaIniFinList: useSelectCalendar(),
      fecha: {
        i: valoresHoy.i,
        f: valoresHoy.f,
        title: "hoy"
      },
      limit: valoresHoy.limit,

      suggestion: {
  _id: "",
  campaignTitle: "",
  statusCampaign: true,
  description: "",
  participantes: "",
  userIdSize: 0,
  urls: {
    html: "",
    img: {
      escritorio: "",
      mobile: ""
    }
  },
  criterial: {
    visibilitySection: {
      name: "",
      params: {
        landing: true,
        root: true,
        subsection: true,
        all: true
      },
      specificUrl: {
        enabled: false,
        url: ""
      }
    },
    country: [],
    city: -1
  },
  type: "",
  position: "",
  created_at: ""
},
  
    loadingDownloadTable: [],
    loadingDownloadTableEnCurso: false,
    selecOrdergroup: null,
    itemsOrdergroup: [
      {title:'Ordenar por Impresiones DESC', value: 1},
      {title:'Ordenar por Impresiones ASC', value: 2},
      {title:'Ordenar por clicks DESC', value: 3},
      {title:'Ordenar por clicks ASC', value: 4},
      {title:'Ordenar por nombre de página DESC', value: 5},
      {title:'Ordenar por nombre de página ASC', value: 6},
    ]
  }
  

  },

  computed: {
    resolveDeviceTimeLine() {
      const vuetifyTheme = useTheme()
      const currentTheme = vuetifyTheme.current.value.colors
      const variableTheme = vuetifyTheme.current.value.variables
      const themeDisabledTextColor = `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`

      let dataRaw = Array.from(this.dataChart_1)
      const seriesFormat = {
        data: []
      }

      const categoriesRaw = []
      for (let i in dataRaw) {
        seriesFormat.data.push(dataRaw[i].preview)
        seriesFormat.data.push(dataRaw[i].click)
      }

      categoriesRaw.push("Impresiones")
      categoriesRaw.push("Clicks")

      const options = {
        chart: {
          parentHeightOffset: 0,
          type: 'donut'
        },
        labels: categoriesRaw,
        colors: [
          "#7365ed",
          "#ff7f50"
        ],
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            return opts.w.config.series[opts.seriesIndex]
          }
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " visitas"
            }
          }
        },
        legend: {
          position: 'bottom',
          horizontalAlign: 'center',
          labels: {
            colors: themeDisabledTextColor
          }
        }
      }

      return { series: seriesFormat.data, options }
    },

    resolveChart_2() {
      const vuetifyTheme = useTheme()
      const currentTheme = vuetifyTheme.current.value.colors
      const variableTheme = vuetifyTheme.current.value.variables
      const headingColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`
      const themeDisabledTextColor = `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`

      let dataRaw = Array.from(this.dataChart_2)

      const getColors = () => {
        return dataRaw.map(data => {
          if (data.campaignId === this.id) {
            return {
              preview: "#7365ed",
              click: "#ff7f50"
            }
          }
          return {
            preview: "#7365ed",
            click: "#ff7f50"
          }
        })
      }

      const colors = getColors()

      const options = {
        chart: {
          parentHeightOffset: 0,
          zoom: { enabled: false },
          toolbar: { show: false },
          type: 'bar',
          height: 350
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['transparent']
        },
        dataLabels: { enabled: false },
        xaxis: {
          categories: dataRaw.map(s => s.title),
          labels: {
            colors: themeDisabledTextColor,
            style: {
              fontSize: '12px'
            }
          }
        },
        yaxis: {
          title: {
            text: 'Interacciones',
            style: { color: headingColor }
          }
        },
        fill: { opacity: 1 },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " visitas"
            }
          }
        },
        legend: {
          labels: { colors: headingColor }
        },
        plotOptions: {
          bar: {
            columnWidth: '70%'
          }
        }
      }

      return {
        series: [{
          name: 'Impresiones',
          data: dataRaw.map((s, index) => ({
            x: s.title,
            y: s.preview,
            fillColor: colors[index].preview
          }))
        }, {
          name: 'Clicks',
          data: dataRaw.map((s, index) => ({
            x: s.title,
            y: s.click,
            fillColor: colors[index].click
          }))
        }],
        options
      }
    },

    groupedDataRegistros() {
    const grouped = this.dataRegistros.reduce((acc, item) => {
      const key = item.url
      if (!acc[key]) {
        acc[key] = {
          title: item.title,
          url: item.url,
          impresiones: 0,
          clicks: 0,
          idCampaign: item.idCampaign,
          firstUser: item.firstUser,
          created_at: item.created_at
        }
      }

      if (item.type === 'preview') {
        acc[key].impresiones++
      } else if (item.type === 'click') {
        acc[key].clicks++
      }

      return acc
    }, {})

    return Object.values(grouped)
  },
  totalPages() {
    return Math.ceil(this.groupedDataRegistros.length / this.perPage)
  },
  
  paginatedData() {
    const start = (this.currentPage - 1) * this.perPage
    const end = start + this.perPage
    return this.groupedDataRegistros.slice(start, end)
  }
},


  watch: {
    activeTab(newValue) {
      if (newValue === 'metricas') {
        this.cart_1()
        this.cart_2()
        this.getDataAuditoria()
      }
    },
    selectedfechaIniFin: {
      handler(newValue) {
        let selectedCombo = useSelectValueCalendar(newValue)
        this.fecha = {
          i: selectedCombo.i,
          f: selectedCombo.f,
          title: newValue
        }
        this.limit = selectedCombo.limit
        this.getDataAuditoria()
      }
    },
    selectedOptionperPage(newValue) {
    if (newValue) {
      this.perPage = newValue.value
      this.currentPage = 1
    }
  },

  selecOrdergroup(newValue) {
    if (newValue) {
      const datosOrdenados = [...this.groupedDataRegistros].sort(
        this.comparador(newValue.value)
      )
      this.groupedDataRegistros = datosOrdenados
    }
  }
  },

  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      const day = date.getDate().toString().padStart(2, '0')
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const year = date.getFullYear().toString().slice(-2)
      return `${day}/${month}/${year}`
    },

    getPaisTexto(country) {
      if (Array.isArray(country) && country.length === 0) {
        return 'País no definido'
      }
      return country || 'País no definido'
    },

    getCiudadTexto(city) {
      return city === -1 ? 'Todas las ciudades' : city
    },

    async getDetallesCampaign() {
      try {
        console.log('Intentando obtener datos para ID:', this.id)
        const respuesta = await fetch(`https://ads-service.vercel.app/campaign/${this.id}`)
        const datos = await respuesta.json()
        console.log('Datos recibidos:', datos)
        return datos
      } catch (error) {
        console.error('Error al obtener detalles:', error)
        return null
      }
    },

    async obtenerDetalles() {
      this.isLoadingContent = true
      try {
        const datos = await this.getDetallesCampaign()
        console.log('Datos a asignar:', datos)
        if (datos) {
          this.suggestion = Array.isArray(datos) ? datos[0] : datos
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        this.isLoadingContent = false
      }
    },
    async showPositionDialog() {
      this.isLoadingPosition = true
      this.showDialog = true
      
      try {
        const response = await fetch('https://configuracion-service.vercel.app/configuracion/adsDesktop')
        const data = await response.json()
        
        const positionValue = this.getPositionValue(this.suggestion.position)
        this.positionDetails = data.data.find(item => item.value === positionValue)
        
      } catch (error) {
        console.error('Error al cargar los detalles de la posición:', error)
      } finally {
        this.isLoadingPosition = false
      }
    },

    getPositionValue(position) {
      const positionMap = {
        'RDTop1': 'fullBanner',
        'RDTop2': 'adbox',
        'RDTop3': 'takeover',
        'RDFloating': 'zocalo'
      }
      return positionMap[position] || position
    },

    async cart_1() {
      try {
        this.loadingMetrics = true
        const response = await fetch(`https://ads-service.vercel.app/campaigns-historical/chart-1?idCampaign=${this.id}`)
        const data = await response.json()

        this.dataChart_1 = data.data.reduce((acumulador, actual) => {
          acumulador.push({
            preview: actual.sumPreview,
            click: actual.sumClick,
            title: actual.campaignData.campaignTitle,
          })
          return acumulador
        }, [])

      } catch (error) {
        console.error('Error al obtener métricas:', error)
      } finally {
        this.loadingMetrics = false
      }
    },

    async cart_2() {
      try {
        this.loadingMetrics = true
        const response = await fetch('https://ads-service.vercel.app/campaigns-historical/chart-1')
        const data = await response.json()

        let campaignDataFiltered = data.data.filter(item => 
          item.campaignData._id === this.id || 
          data.data.indexOf(item) < 5
        ).slice(0, 5)

        this.dataChart_2 = campaignDataFiltered.map(actual => ({
          preview: actual.sumPreview,
          click: actual.sumClick,
          title: actual.campaignData.campaignTitle,
          campaignId: actual.campaignData._id
        }))

      } catch (error) {
        console.error('Error al obtener métricas de comparación:', error)
      } finally {
        this.loadingMetrics = false
      }
    },

    async getDataAuditoria(options = {}) {
      try {
        const {
          tipo = "all",
          limit = this.limit || 100,
          page = 1
        } = options

        const response = await fetch(
          `https://ads-service.vercel.app/campaigns-historical/events/${tipo}?fechai=${this.fecha.i.format('YYYY-MM-DD')}&fechaf=${this.fecha.f.format('YYYY-MM-DD')}&page=${page}&limit=${limit}&idCampaign=${this.id}&userId=`
        )
        const data = await response.json()
        
        this.dataRegistros = data.data
        this.dataRegistrosBackup = data.data
        
      } catch (error) {
        console.error('Error al obtener auditoría:', error)
      }
    },

    async getCampaniasList() {
  try {
    const response = await fetch(`https://ads-service.vercel.app/campaign/${this.id}`)
    const datos = await response.json()
    if (datos && datos.length > 0) {
      // Asegurarnos de que solo pasamos la campaña actual
      this.campaignsList = [{
        value: datos[0]._id,
        title: datos[0].campaignTitle
      }]
    }
  } catch (error) {
    console.error('Error al obtener lista de campañas:', error)
  }
}

    

  },

  //comparacion diaria

  
  async mounted() {
    console.log('ID en mounted:', this.id)
    await this.obtenerDetalles()
    await this.getCampaniasList()
  }
}
</script>



<template>
  <section>
    <div class="fill-width">
      <div class="text-center py-6">
        <h1 class="text-h5 font-weight-bold">
          Información sobre: "{{suggestion.campaignTitle}}"
        </h1>
        <div class="text-body-1 mt-2">
          A continuación encontrarás detalles sobre la campaña
        </div>
      </div>

    
      <div class="d-flex justify-center">
        <div style="width: 800px;" class="text-center">
          <VTabs v-model="activeTab" grow>
            <VTab value="resumen">Resumen</VTab>
            <VTab value="metricas">Métricas</VTab>
          </VTabs>
        </div>
      </div>


      <VWindow v-model="activeTab" class="mt-6">
        <VWindowItem value="resumen">
          <div class="d-flex justify-center">
            <div style="width: 800px;">
              <div v-if="isLoadingContent" class="text-center py-8">
                <VProgressCircular indeterminate color="primary" />
                <div class="mt-4">Cargando datos, espere...</div>
              </div>
              
              <VList v-else class="transparent-list">
                 <!-- Estado -->
                 <VListItem>
                  <template v-slot:prepend>
                    <VIcon color="primary" icon="mdi-checkbox-marked-circle-outline" size="24" />
                  </template>
                  <VListItemTitle class="font-weight-bold text-body-1">Estado</VListItemTitle>
                  <VListItemSubtitle class="mt-1">
                    <VChip
                      :color="suggestion.statusCampaign ? 'success' : 'error'"
                      size="small"
                    >
                      {{ suggestion.statusCampaign ? 'Activo' : 'Inactivo' }}
                    </VChip>
                  </VListItemSubtitle>
                </VListItem>

                <VDivider />

                <!-- Período de campaña -->
                <VListItem>
                  <template v-slot:prepend>
                    <VIcon color="primary" icon="mdi-calendar-range" size="24" />
                  </template>
                  <VListItemTitle class="font-weight-bold text-body-1">Período de campaña</VListItemTitle>
                  <VListItemSubtitle class="mt-1">{{ formatDate(suggestion.fechai) }} hasta {{ formatDate(suggestion.fechaf) }}</VListItemSubtitle>
                </VListItem>

                <VDivider />

                <!-- Título -->
                <VListItem>
                  <template v-slot:prepend>
                    <VIcon color="primary" icon="mdi-format-title" size="24" />
                  </template>
                  <VListItemTitle class="font-weight-bold text-body-1">Título</VListItemTitle>
                  <VListItemSubtitle class="mt-1">{{ suggestion.campaignTitle }}</VListItemSubtitle>
                </VListItem>

                <VDivider />

                <!-- Descripción -->
                <VListItem>
                  <template v-slot:prepend>
                    <VIcon color="primary" icon="mdi-text-long" size="24" />
                  </template>
                  <VListItemTitle class="font-weight-bold text-body-1">Descripción</VListItemTitle>
                  <VListItemSubtitle class="mt-1">{{ suggestion.description }}</VListItemSubtitle>
                </VListItem>

                <VDivider />

                <!-- Tipo de Contenido -->
                <VListItem>
                  <template v-slot:prepend>
                    <VIcon color="primary" icon="mdi-file-code-outline" size="24" />
                  </template>
                  
                  <VListItemTitle class="font-weight-bold text-body-1">
                    Tipo de Contenido
                    <VBtn
                      icon
                      variant="text"
                      size="small"
                      @click="showContentDialog = true"
                    >
                      <VIcon
                        color="info"
                        icon="mdi-eye"
                        size="18"
                        class="ms-2"
                      />
                    </VBtn>

                    <VDialog
                      v-model="showContentDialog"
                      :scrim="true"
                      width="400"
                    >
                      <VCard class="content-preview-card">
                        <VCardTitle class="dialog-title pa-4">
                          <div class="text-center text-h6 font-weight-bold w-100">Contenido</div>
                          <VBtn
                            icon
                            variant="text"
                            size="small"
                            @click="showContentDialog = false"
                            class="close-button"
                          >
                            <VIcon>mdi-close</VIcon>
                          </VBtn>
                        </VCardTitle>

                        <VCardText class="pa-4">
                          <div v-if="suggestion.type === 'html'" class="content-preview">
                            <div v-html="suggestion.urls.html"></div>
                          </div>
                          <div v-else-if="suggestion.urls.img">
                            <img 
                              :src="suggestion.urls.img.escritorio" 
                              alt="Contenido"
                              class="preview-image"
                            />
                          </div>
                        </VCardText>
                      </VCard>
                    </VDialog>
                  </VListItemTitle>
                  
                  <VListItemSubtitle class="mt-1">{{ suggestion.type }}</VListItemSubtitle>
                </VListItem>

                <VDivider />

                <!-- Sección -->
                <VListItem>
                  <template v-slot:prepend>
                    <VIcon color="primary" icon="mdi-view-dashboard-outline" size="24" />
                  </template>
                  <VListItemTitle class="font-weight-bold text-body-1">Sección</VListItemTitle>
                  <VListItemSubtitle class="mt-1">{{ suggestion.criterial.visibilitySection.name }}</VListItemSubtitle>
                </VListItem>

                <VDivider />

                <!-- País/Ciudad (condicional) -->
                <template v-if="suggestion.participantes === 'filtrado'">
                  <VListItem>
                    <template v-slot:prepend>
                      <VIcon color="primary" icon="mdi-map-marker-radius" size="24" />
                    </template>
                    <VListItemTitle class="font-weight-bold text-body-1">País / Ciudad</VListItemTitle>
                    <VListItemSubtitle class="mt-1">
                      <span>{{ getPaisTexto(suggestion.criterial.country) }}</span>
                      <span> / </span>
                      <span>{{ getCiudadTexto(suggestion.criterial.city) }}</span>
                    </VListItemSubtitle>
                  </VListItem>
                  <VDivider />
                </template>

                <!-- Posición -->
                <VListItem>
                  <template v-slot:prepend>
                    <VIcon color="primary" icon="mdi-crosshairs-gps" size="24" />
                  </template>
                  <VListItemTitle class="font-weight-bold text-body-1">
                    Posición
                    <VIcon
                      color="info"
                      icon="mdi-magnify"
                      size="18"
                      class="ms-2 cursor-pointer"
                      @click="showPositionDialog"
                    />
                  </VListItemTitle>
                  <VListItemSubtitle class="mt-1">{{ suggestion.position }}</VListItemSubtitle>
                </VListItem>

                <VDivider />

               

                <VDivider />

                <!-- Fecha de Creación -->
                <VListItem>
                  <template v-slot:prepend>
                    <VIcon color="primary" icon="mdi-calendar" size="24" />
                  </template>
                  <VListItemTitle class="font-weight-bold text-body-1">Fecha de Creación</VListItemTitle>
                  <VListItemSubtitle class="mt-1">{{ formatDate(suggestion.created_at) }}</VListItemSubtitle>
                </VListItem>

                <VDivider />

                <!-- Total Usuarios -->
                <VListItem>
                  <template v-slot:prepend>
                    <VIcon color="primary" icon="mdi-account-group" size="24" />
                  </template>
                  <VListItemTitle class="font-weight-bold text-body-1">Total Usuarios</VListItemTitle>
                  <VListItemSubtitle class="mt-1">{{ suggestion.userIdSize }}</VListItemSubtitle>
                </VListItem>
              </VList>
            </div>
          </div>
        </VWindowItem>
<!-- Tab Métricas -->
<VWindowItem value="metricas">
    <VRow>
      <!-- grafico impresiones y clicks general -->
      <!-- <VCol cols="12" md="6">
        <VCard class="px-0 py-0 pb-4">
          <VCardItem class="header_card_item pb-0">
            <div class="d-flex pr-0" style="justify-content: space-between;">
              <div class="descripcion">
                <VCardTitle>Gráficos de eventos</VCardTitle>
                <small class="mt-3">Información en porcentajes de la campaña</small>
              </div>
            </div>
            <VDivider class="my-5" />
          </VCardItem>

          <div v-if="loadingMetrics" class="text-center py-8">
            <VProgressCircular indeterminate color="primary" />
            <div class="mt-4">Cargando métricas...</div>
          </div>

          <div v-else>
            <VueApexCharts 
              v-if="resolveDeviceTimeLine.series.length > 0" 
              :options="resolveDeviceTimeLine.options" 
              :series="resolveDeviceTimeLine.series" 
              :height="400" 
              width="100%" 
            />
            <div class="px-4 text-center py-8" v-else>
              No existen datos para esta campaña
            </div>
          </div>
        </VCard>
      </VCol> -->

      <!-- <VCol cols="12" md="6">
        <VCard class="px-0 py-0 pb-4">
          <VCardItem class="header_card_item pb-0">
            <div class="d-flex pr-0" style="justify-content: space-between;">
              <div class="descripcion">
                <VCardTitle>Comparativa de eventos</VCardTitle>
                <small class="mt-3">Comparación con otras campañas</small>
              </div>
            </div>
            <VDivider class="my-5" />
          </VCardItem>

          <div v-if="loadingMetrics" class="text-center py-8">
            <VProgressCircular indeterminate color="primary" />
            <div class="mt-4">Cargando comparativa...</div>
          </div>

          <div v-else>
            <VueApexCharts 
              v-if="resolveChart_2.series[0].data.length > 0" 
              :options="resolveChart_2.options" 
              :series="resolveChart_2.series" 
              :height="400"
              width="100%" 
            />
            <div class="px-4 text-center py-8" v-else>
              No hay datos disponibles para comparar
            </div>
          </div>
        </VCard>
      </VCol> -->

      <!-- comparacion diaria -->
      <VCol cols="12" md="12">
      <VCard class="px-0 py-0 pb-4">
        <DailyStats 
          :campaignId="id"
          @loading="loadingMetrics = $event"
        />
      </VCard>
    </VCol>

      <VCol cols="12">
        <div class="descripcion">
                <VCardTitle>Listado de URLs visitadas</VCardTitle>
        </div>
        <TabGroupTable 
        :dataCampaigns="campaignsList"
        :key="campaignsList[0]?.value" 
      />
      </VCol>
    </VRow>
  </VWindowItem>

      </VWindow>
    </div>

    <!-- Diálogo para mostrar imagen de posición -->
    <VDialog
  v-model="showDialog"
  max-width="800"
>
  <VCard>
    <VCardTitle class="d-flex flex-column pa-4">
      <div class="w-100 d-flex justify-end">
        <VBtn
          icon
          color="grey"
          variant="plain"
          @click="showDialog = false"
        >
          <VIcon>mdi-close</VIcon>
        </VBtn>
      </div>
      <div class="text-center w-100 mt-n6">
        Imagen de la Posición
      </div>
    </VCardTitle>
    <VCardText class="text-center">
      <!-- Loading -->
      <div v-if="isLoadingPosition" class="d-flex justify-center align-center" style="min-height: 200px;">
        <VProgressCircular
          indeterminate
          color="primary"
        ></VProgressCircular>
      </div>
      
      <!-- Imagen -->
      <img 
        v-else-if="positionDetails"
        :src="positionDetails.data.img" 
        :alt="positionDetails.value"
        class="position-image"
      />
    </VCardText>
  </VCard>
</VDialog>
  </section>
</template>

<style scoped>
.fill-width {
  width: 100%;
  min-height: 100vh;
  background-color: rgb(var(--v-theme-surface));
}

.transparent-list {
  background: transparent !important;
  border-radius: 0;
  box-shadow: none !important;
}

.v-list-item {
  padding: 16px;
  background: white;
}

.content-preview {
  max-height: 200px;
  overflow-y: auto;
}

.text-h5 {
  font-size: 1.5rem !important;
}

.text-body-1 {
  font-size: 1.1rem !important;
}

.v-list-item-subtitle {
  margin-top: 4px;
  font-size: 1rem !important;
}

.cursor-pointer {
  cursor: pointer;
}

.position-image {
  width: 100%;
  max-height: 400px;
  object-fit: contain;
}

.v-tabs {
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.apexcharts-legend-series {
  transition: 1s ease all;
  padding: 5px;
  border-radius: 7px;
}

.apexcharts-legend-series:hover {
  background-color: #e9e9ea;
}

.invoice-list-table {
  border-collapse: collapse;
  width: 100%;
}

.invoice-list-table th {
  white-space: nowrap;
  padding: 12px;
  font-weight: 600;
  background-color: rgb(var(--v-theme-background));
}

.invoice-list-table td {
  padding: 12px;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.v-tooltip {
  width: 500px;
  white-space: normal;
  word-break: break-word;
}

.item-limit {
  max-width: 210px;
  display: flex;
  font-size: 15px;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.invoice-list-table th {
  white-space: nowrap;
  padding: 12px;
  font-weight: 600;
}

.invoice-list-table td {
  padding: 12px;
}


.content-preview-card {
  border-radius: 8px !important;
  min-width: 500px !important;
  min-height: 300px !important;
  margin: 0 !important;
  position: relative !important;
}

.dialog-title {
  position: relative !important;
  padding-top: 16px !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.close-button {
  position: absolute !important;
  right: 16px !important;
  top: 12px !important;
}

.preview-image {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
}

.content-preview {
  max-height: 500px;
  overflow-y: auto;
}


.content-dialog {
  position: absolute !important;
  margin-left: 16px !important;
  margin-top: -30px !important;
}

.content-preview-card {
  border-radius: 8px !important;
  max-height: 80vh !important;
  overflow-y: auto !important;
}

.dialog-title {
  position: relative !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.close-button {
  position: absolute !important;
  right: 8px !important;
  top: 8px !important;
}

.preview-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

.content-preview {
  width: 100%;
  overflow-x: hidden;
}
</style>