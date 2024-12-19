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

      <!--  tabs -->
      <div class="d-flex justify-center">
        <div style="width: 800px;">
          <VTabs v-model="activeTab" class="justify-center">
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

                <!-- País/Ciudad -->
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


                <!-- Tipo de Contenido -->
                <VListItem>
                  <template v-slot:prepend>
                    <VIcon color="primary" icon="mdi-file-code-outline" size="24" />
                  </template>
                  <VListItemTitle class="font-weight-bold text-body-1">
                    Tipo de Contenido
                    <VTooltip location="end">
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
                  <VListItemSubtitle class="mt-1">{{ suggestion.userId.length }}</VListItemSubtitle>
                </VListItem>
              </VList>
            </div>
          </div>
        </VWindowItem>

        <VWindowItem value="metricas">
          <div class="text-center">
            <p>Contenido de métricas pendiente</p>
          </div>
        </VWindowItem>
      </VWindow>
    </div>

    <!--  imagen de posición -->
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
        <VCardText v-if="positionDetails" class="text-center">
          <img 
            :src="positionDetails.data.img" 
            :alt="positionDetails.value"
            class="position-image"
          />
        </VCardText>
      </VCard>
    </VDialog>
  </section>
</template>


<script>
import { useRoute } from 'vue-router';

export default {
  setup() {
    const route = useRoute()
    const id = route.params.id
    return { id }
  },
  
  data() {
    return {
      isLoadingContent: false,
      activeTab: 'resumen',
      showDialog: false,
      positionDetails: null,
      suggestion: {
        _id: "",
        campaignTitle: "",
        statusCampaign: true,
        description: "",
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
        created_at: "",
        userId: []
      }
    }
  },

  async mounted() {
    await this.obtenerDetalles()
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
        return 'País no definido';
      }
      return country || 'País no definido';
    },

    getCiudadTexto(city) {
      return city === -1 ? 'Todas las ciudades' : city;
    },

    async getDetallesCampaign(data = {}) {
      const { limit = 20000, page = 1 } = data
      const respuesta = await fetch(`https://ads-service.vercel.app/campaign/${this.id}/user/?limit=${limit}&page=${page}`)
      const datos = await respuesta.json()
      return datos[0]
    },

    // async obtenerDetalles() {
    //   this.isLoadingContent = true
    //   let skip = 1
    //   let batchSize = 20000
    //   let dataFull = []

    //   while (true) {
    //     const batchRegister = await this.getDetallesCampaign({
    //       limit: batchSize,
    //       page: skip
    //     })

    //     if (batchRegister.userId.length === 0) {
    //       break
    //     }

    //     if (skip == 1) {
    //       dataFull.push(...[batchRegister])
    //     } else {
    //       dataFull[0].userId.push(...batchRegister.userId)
    //     }

    //     this.suggestion = dataFull[0]
    //     this.isLoadingContent = false
    //     skip += 1
    //   }
    // },

async obtenerDetalles() {
      this.isLoadingContent = true
      let skip = 1
      let batchSize = 20000
      let dataFull = []

      while (true) {
        const batchRegister = await this.getDetallesCampaign({
          limit: batchSize,
          page: skip
        })

        console.log('Datos recibidos:', batchRegister) // Para debug

        if (batchRegister.userId.length === 0) {
          break
        }

        if (skip == 1) {
          dataFull.push(...[batchRegister])
        } else {
          dataFull[0].userId.push(...batchRegister.userId)
        }

        this.suggestion = dataFull[0]
        console.log('Suggestion asignado:', this.suggestion) // Para debug
        this.isLoadingContent = false
        skip += 1
      }
},
    async showPositionDialog() {
      try {
        const response = await fetch('https://configuracion-service.vercel.app/configuracion/adsDesktop')
        const data = await response.json()
        
        const positionValue = this.getPositionValue(this.suggestion.position)
        this.positionDetails = data.data.find(item => item.value === positionValue)
        
        if (this.positionDetails) {
          this.showDialog = true
        }
      } catch (error) {
        console.error('Error al cargar los detalles de la posición:', error)
      }
    },

    getPositionValue(position) {
      // Mapeo de posiciones
      const positionMap = {
        'RDTop1': 'fullBanner',
        'RDTop2': 'adbox',
        'RDTop3': 'takeover',
        'RDFloating': 'zocalo'
      }
      return positionMap[position] || position
    }
}
}
</script>

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
</style>