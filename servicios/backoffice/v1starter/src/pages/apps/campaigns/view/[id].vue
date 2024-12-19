<script>
import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js"
import { hexToRgb } from '@layouts/utils'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import esLocale from "moment/locale/es"
import { useRoute } from 'vue-router'
import VueApexCharts from 'vue3-apexcharts'
import { useTheme } from 'vuetify'

const moment = extendMoment(Moment)
moment.locale('es', [esLocale])

const valoresHoy = useSelectValueCalendar()

export default {
  components: {
    VueApexCharts
  },

  setup() {
    const route = useRoute()
    return {
      id: route.params.id,
      moment
    }
  },
  data() {
    return {
      isLoadingPosition: false,
      isLoadingContent: false,
      isFullLoading: false,
      loadingMetrics: false,
      showDialog: false,
      activeTab: 'resumen',
      positionDetails: null,
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
          visibilitySection: "",
          country: [],
          city: -1
        },
        type: "",
        position: "",
        created_at: ""
      },
      currentPage: 1,
    perPage: 7,
    selectedOptionperPage: { title: '7', value: 7 },
    itemsPage: [
      { title: '7', value: 7 },
      { title: '30', value: 30 },
      { title: '50', value: 50 },
      { title: '100', value: 100 },
      { title: '200', value: 200 }
    ],
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

    async downloadFull() {
  if(this.groupedDataRegistros.length < 1){
    alert("No hay registros que exportar")
    return false
  }

  this.isFullLoading = true
  try {
    console.log('Iniciando exportación...')
    await this.exportarDataAudit()
    
    const headers = {
      title: "title",
      url: "url",
      type: "type",
      created_at: "created_at",
      user_email: "user_email",
      user_last_name: "user_last_name",
      user_firstname: "user_firstname",
      campaign_idCampaign: "campaign_idCampaign",
      campaign_title: "campaign_title",
      campaign_position: "campaign_position"
    }

    console.log('Datos a exportar:', this.dataRegistrosExport)
    let title = "campaigns_full"

    await this.exportCSVFile(headers, this.dataRegistrosExport, title)
  } catch (error) {
    console.error('Error en downloadFull:', error)
  } finally {
    this.isFullLoading = false
  }
},

async exportarDataAudit() {
  this.dataRegistrosExport = []
  let skip = 1
  let batchSize = 7000

  try {
    console.log('Obteniendo datos para exportar...')
    const response = await fetch(
      `https://ads-service.vercel.app/campaigns-historical/events/all?fechai=${this.fecha.i.format('YYYY-MM-DD')}&fechaf=${this.fecha.f.format('YYYY-MM-DD')}&page=1&limit=${batchSize}&idCampaign=${this.selecCampaign.value}&userId=`
    )
    const data = await response.json()
    console.log('Datos recibidos:', data)

    if (data.data && data.data.length > 0) {
      const processedData = data.data.map(item => ({
        title: item.title || '',
        url: item.url || '',
        type: item.type || '',
        created_at: item.created_at || '',
        user_email: item.firstUser?.email || '',
        user_last_name: item.firstUser?.last_name || '',
        user_firstname: item.firstUser?.firstname || '',
        campaign_idCampaign: item.idCampaign?._id || '',
        campaign_title: item.idCampaign?.title || '',
        campaign_position: item.idCampaign?.position || ''
      }))

      this.dataRegistrosExport = processedData
      console.log('Datos procesados:', this.dataRegistrosExport)
    }

  } catch (error) {
    console.error('Error en exportarDataAudit:', error)
  }

  return true
},
async exportarDataAudit() {
  this.dataRegistrosExport = []
  let skip = 1
  let batchSize = 7000

  try {
    console.log('Obteniendo datos para exportar...')
    const response = await fetch(
      `https://ads-service.vercel.app/campaigns-historical/events/all?fechai=${this.fecha.i.format('YYYY-MM-DD')}&fechaf=${this.fecha.f.format('YYYY-MM-DD')}&page=1&limit=${batchSize}&idCampaign=${this.selecCampaign.value}&userId=`
    )
    const data = await response.json()
    console.log('Datos recibidos:', data)

    if (data.data && data.data.length > 0) {
      const processedData = data.data.map(item => ({
        title: item.title || '',
        url: item.url || '',
        type: item.type || '',
        created_at: item.created_at || '',
        user_email: item.firstUser?.email || '',
        user_last_name: item.firstUser?.last_name || '',
        user_firstname: item.firstUser?.firstname || '',
        campaign_idCampaign: item.idCampaign?._id || '',
        campaign_title: item.idCampaign?.title || '',
        campaign_position: item.idCampaign?.position || ''
      }))

      this.dataRegistrosExport = processedData
      console.log('Datos procesados:', this.dataRegistrosExport)
    }

  } catch (error) {
    console.error('Error en exportarDataAudit:', error)
  }

  return true
},

async exportCSVFile(headers, items, fileTitle) {
  try {
    console.log('Iniciando creación de CSV...')
    if (headers) {
      items.unshift(headers)
    }

    console.log('Items para CSV:', items)
    const csvContent = items.map(row => {
      return Object.values(row)
        .map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value
        )
        .join(',')
    }).join('\n')

    console.log('Contenido CSV generado:', csvContent)

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${fileTitle}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

  } catch (error) {
    console.error('Error en exportCSVFile:', error)
  }
},

    truncateText(text, length = 50) {
    if (text && text.length > length) {
      return text.substring(0, length) + '...'
    }
    return text
  },

 
//método para descargar datos por link
async downloadRowData(item) {
  try {
    const headers = {
      title: "Título de la nota",
      user_name: "Nombre del usuario",
      user_lastname: "Apellido del usuario",
      created_at: "Fecha"
    }

    const data = [{
      title: item.title,
      user_name: item.firstUser?.firstname || '',
      user_lastname: item.firstUser?.last_name || '',
      created_at: this.moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")
    }]

    const fileName = `usuarios_${this.moment().format('YYYY-MM-DD_HH-mm')}`
    await this.exportCSVFile(headers, data, fileName)
  } catch (error) {
    console.error('Error al descargar datos:', error)
  }
},

async exportarDataAudit() {
  this.dataRegistrosExport = []
  let skip = 1
  let batchSize = 7000

  while (true) {
    const batchRegister = await this.getDataAuditoria({
      tipo: "all",
      fechai: this.fecha.i.format("YYYY-MM-DD"),
      fechaf: this.fecha.f.format("YYYY-MM-DD"),
      limit: batchSize,
      page: skip,
      exportar: true
    })

    if (!batchRegister || batchRegister.length === 0) {
      break
    }

    const processedData = batchRegister.map(actual => ({
      title: actual.title,
      url: actual.url,
      type: actual.type,
      created_at: actual.created_at,
      user_email: actual.firstUser.email,
      user_last_name: actual.firstUser.last_name,
      user_firstname: actual.firstUser.firstname,
      campaign_idCampaign: actual.idCampaign._id,
      campaign_title: actual.idCampaign.title,
      campaign_position: actual.idCampaign.position
    }))

    this.dataRegistrosExport.push(...processedData)
    skip += 1
  }

  return true
},


async convertToCSV(objArray) {
  const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
  let str = ''

  for (let i = 0; i < array.length; i++) {
    let line = ''
    for (const index in array[i]) {
      if (line !== '') line += ','
      const value = String(array[i][index]).replace(/"/g, '""')
      line += value.includes(',') ? `"${value}"` : value
    }
    str += line + '\r\n'
  }

  return str
},

async exportCSVFile(headers, items, fileTitle) {
  if (headers) {
    const headerRow = {}
    Object.keys(headers).forEach(key => {
      headerRow[key] = headers[key]
    })
    items.unshift(headerRow)
  }

  const jsonObject = JSON.stringify(items)
  const csv = await this.convertToCSV(jsonObject)
  const exportedFilename = fileTitle + ".csv"

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  if (navigator.msSaveBlob) {
    navigator.msSaveBlob(blob, exportedFilename)
  } else {
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", exportedFilename)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
},

    async downloadRow(item) {
      this.isFullLoading = true
      try {
        const data = [{
          title: item.title,
          user_name: item.firstUser?.firstname || '',
          created_at: this.moment(item.created_at).format("YYYY-MM-DD HH:mm:ss")
        }]
        
        const headers = {
          title: "Título de la nota",
          user_name: "Nombre del usuario",
          created_at: "Fecha"
        }

        const fileName = `usuario_${item.firstUser?.firstname || 'sin_nombre'}_${this.moment().format('YYYY-MM-DD')}`
        await this.exportCSVFile(headers, data, fileName)
      } finally {
        this.isFullLoading = false
      }
    },
  },

  async mounted() {
    console.log('ID en mounted:', this.id)
    await this.obtenerDetalles()
    if (this.activeTab === 'metricas') {
      await this.cart_1()
      await this.cart_2()
      await this.getDataAuditoria()
    }
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
                    <VTooltip location="end" class="large-tooltip">
                      <template v-slot:activator="{ props }">
                        <VIcon
                          v-bind="props"
                          color="info"
                          icon="mdi-information"
                          size="18"
                          class="ms-2"
                        />
                      </template>
                      <VCard>
                        <VCardTitle class="text-subtitle-2">Contenido</VCardTitle>
                        <VCardText>
                          <div v-if="suggestion.type === 'html'" class="content-preview">
                            <div v-html="suggestion.urls.html"></div>
                          </div>
                          <div v-else-if="suggestion.urls.img">
                            <img 
                              :src="suggestion.urls.img.escritorio" 
                              alt="Contenido"
                              style="max-width: 200px;"
                            />
                          </div>
                        </VCardText>
                      </VCard>
                    </VTooltip>
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
                  <VListItemSubtitle class="mt-1">{{ suggestion.criterial.visibilitySection }}</VListItemSubtitle>
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
    <!-- Gráficos en dos columnas -->
    <div class="d-flex justify-center mb-6">
      <div style="width: 95%;">
        <VRow>
          <!-- Gráfico Circular -->
          <VCol cols="12" md="6">
            <VCard class="px-0 py-0 pb-4">
              <VCardItem class="header_card_item pb-0">
                <div class="d-flex pr-0" style="justify-content: space-between;">
                  <div class="descripcion">
                    <VCardTitle>Eventos de la campaña</VCardTitle>
                    <small class="mt-3">Información de impresiones y clicks</small>
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
          </VCol>

          <!-- Gráfico de Barras -->
          <VCol cols="12" md="6">
            <VCard class="px-0 py-0 pb-4">
              <VCardItem class="header_card_item pb-0">
                <div class="d-flex pr-0" style="justify-content: space-between;">
                  <div class="descripcion">
                    <VCardTitle>Comparativa con otras campañas</VCardTitle>
                    <small class="mt-3">Comparación de eventos con campañas recientes</small>
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
          </VCol>
        </VRow>
      </div>
    </div>

    <!-- Tabla de Análisis -->
    <div class="d-flex justify-center">
      <div style="width: 95%;">
        <VCard>
         

          <VDivider />

          <div class="d-flex justify-center mt-6">
          <div style="width: 95%;">
            <VCard>
              <VCardTitle class="d-flex justify-space-between align-center px-5 py-4">
                <span>Análisis Detallado</span>
                <VBtn
                  variant="tonal"
                  color="success"
                  prepend-icon="tabler-download"
                  @click="downloadFull"
                  :loading="isFullLoading"
                  :disabled="isFullLoading"
                >
                  Exportar datos
                </VBtn>
              </VCardTitle>

              <VDivider />

              <!-- Selector de fechas -->
              <div class="bg-ecuavisa py-4 d-flex gap-4 flex-wrap px-5">
          <div style="min-width: 90px;width: auto;">
            <VCombobox 
              v-model="selectedfechaIniFin" 
              :items="fechaIniFinList" 
              variant="outlined" 
              label="Fecha" 
              persistent-hint 
              hide-selected 
              hint="" 
            />
          </div>
        </div>

              <VDivider />

              <div class="px-5 py-4">
                <VTable class="text-no-wrap invoice-list-table">
                  <thead class="text-uppercase">
                    <tr>
                      <th scope="col">N</th>
                      <th scope="col">Título de Página</th>
                      <th scope="col" class="text-center">Impresiones</th>
                      <th scope="col" class="text-center">Click</th>
                      <th scope="col">Nombre de Campaña</th>
                      <th scope="col">Link/Descargar</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(item, index) in paginatedData" :key="index" style="height: 3.75rem;">
                      <td class="text-center">{{ index + 1 }}</td>
                      <td style="min-width: 17rem;max-width: 17rem;text-align: left;">
                        <VCardTitle class="px-0" :title="item.title" style="font-size: 18px;">
                          <small>{{ truncateText(item.title, 50) }}</small>
                        </VCardTitle>
                      </td>
                      <td class="text-center">
                        <VChip label size="small" color="success">
                          {{ item.impresiones }}
                        </VChip>
                      </td>
                      <td class="text-center">
                        <VChip label size="small" color="success">
                          {{ item.clicks }}
                        </VChip>
                      </td>
                      <td>
                        <VChip color="success">
                          {{ truncateText(item.idCampaign?.title, 30) }}
                        </VChip>
                      </td>
                      <td class="text-center" style="width: 5rem;">
                        <div class="d-flex gap-2 justify-center">
                          <VBtn
                            variant="text"
                            color="info"
                            icon="mdi-link-variant"
                            :href="item.url"
                            target="_blank"
                          />
                          <VBtn
                            variant="text"
                            color="warning"
                            icon="mdi-account-arrow-down-outline"
                            :loading="loadingDownloadTable[index]"
                            :disabled="loadingDownloadTable[index]"
                            @click="downloadRowData(item)"
                            title="Descargar usuarios que interactuaron en esta página"
                          />
                        </div>
                      </td>
                    </tr>
                  </tbody>

                  <tfoot v-show="!paginatedData.length">
                    <tr>
                      <td colspan="6" class="text-center text-body-1">
                        No hay datos que mostrar
                      </td>
                    </tr>
                  </tfoot>
                </VTable>

                  <VPagination 
                    class="mt-5" 
                    v-model="currentPage" 
                    :length="totalPages" 
                    :total-visible="7" 
                  />
              </div>
            </VCard>
          </div>
        </div>
        </VCard>
      </div>
    </div>
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

.large-tooltip {
  max-width: 800px !important;
  width: auto !important;
}
</style>