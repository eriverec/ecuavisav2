<template>
  <section>
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">

        <VTabs v-model="currentTab" class="v-tabs-pill">
          <VTab value="tab-detalles">Detalles</VTab>
          <VTab value="tab-usuarios">Usuarios</VTab>
          <!-- <VTab>Tab Three</VTab> -->
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-detalles">
                <div class="d-flex flex-wrap py-4 gap-4 align-items-center" style="justify-content: space-between;">
                  <div>
                    <VCardTitle>Información sobre la campaña: <b>{{suggestion.campaignTitle}}</b>
                    </VCardTitle>
                    <VCardSubtitle> A continuación encontrarás los detalles de la campaña 
                    </VCardSubtitle>
                  </div>

                </div>
                  <!-- 👉 Cuadro datos -->
    <VCol
      md="6"
      lg="8"
      cols="12"
    >
      <VCard>
        <VRow no-gutters>
          <VCol
            cols="12"
            sm="8"
            md="12"
            lg="7"
            order="2"
            order-lg="1"
          >
            <VCardItem>
              <VCardTitle>{{suggestion.campaignTitle}}</VCardTitle>
            </VCardItem>

            <VCardText>
              Here, I focus on a range of items and features that we use in life without giving them a second thought such as Coca Cola, body muscles and holding ones own breath. Though, most of these notes are not fundamentally necessary, they are such that you can use them for a good laugh, at a drinks party or for picking up women or men.
            </VCardText>

            <VCardText>
              <VDivider />
            </VCardText>

            <VCardText class="d-flex justify-center">
              <div class="me-auto pe-4">
                <p class="d-flex align-center mb-6">
                  <VIcon
                    color="primary"
                    icon="tabler-lock-open"
                    size="22"
                  />
                  <span class="ms-3">{{suggestion.criterial.country}}</span>
                </p>

                <p class="d-flex align-center mb-0">
                  <VIcon
                    color="primary"
                    icon="tabler-user"
                    size="22"
                  />
                  <span class="ms-3">{{suggestion.userId.length}} usuarios</span>
                </p>
              </div>

              <VDivider
                v-if="$vuetify.display.smAndUp"
                vertical
                inset
              />

              <div class="ms-auto ps-4">
                <p class="d-flex align-center mb-6">
                  <VIcon
                    color="primary"
                    icon="tabler-star"
                    size="22"
                  />
                  <span class="ms-3">Access all Features</span>
                </p>

                <p class="d-flex align-center mb-0">
                  <VIcon
                    color="primary"
                    icon="tabler-trending-up"
                    size="22"
                  />
                  <span class="ms-3">Lifetime Free Update</span>
                </p>
              </div>
            </VCardText>
          </VCol>

          <VCol
            cols="12"
            sm="4"
            md="12"
            lg="5"
            order="1"
            order-lg="2"
            class="member-pricing-bg text-center"
          >
            <div class="membership-pricing d-flex flex-column align-center py-14 h-100 justify-center">
              <p class="mb-5">
                <!-- <sub class="text-h5">$</sub> -->
                <sup class="text-h2 font-weight-medium">
                  <VChip v-if="suggestion.statusCampaign" color="success">
                      <VIcon
                        start
                        size="50"
                        icon="mdi-toggle-switch"
                         />
                        ACTIVA
                  </VChip>

                  <VChip v-else>
                      <VIcon
                        start
                        size="50"
                        icon="mdi-toggle-switch-off"
                      />
                      INACTIVA
                  </VChip>
               
                
                </sup>
                <!-- <sub class="text-h5">USD</sub> -->
              </p>

              <p class="text-sm">
                5 Tips For Offshore <br> Software Development
              </p>

              <VBtn class="mt-8">
                Contact Now
              </VBtn>
            </div>
          </VCol>
        </VRow>
      </VCard>
    </VCol>
                
              </VWindowItem>

              <VWindowItem value="tab-usuarios">
                <p>Próximamente</p>
              </VWindowItem>

            </VWindow>
          </VCardText>
        </VCard>

      </VCol>
    </VRow>

    
  </section>
</template>

<script>
import { useRoute } from 'vue-router';
const route = useRoute();
const currentTab = ref('tab-detalles')

export default {
  setup() {
    const route = useRoute();
    const id = route.params.id;
    return {
      id
    }
    // Aquí podemos utilizar la variable "id" para hacer algo con el valor del parámetro "id"
  },
  data() {
    return {
      datos: [],
      suggestion: {
        _id: "",
        campaignTitle: "",
        statusCampaign: true,
        urls: {},
        criterial: {
          country: "",
          city: 0
        },
        type: "",
        position: "",
        created_at: "",
        userId: []
      },
      currentTab: 'tab-detalles'
    };
  },
  watch: {
  },
  mounted() {
    this.obtenerDetalles();
  },
  methods: {
    async obtenerDetalles() {
      const respuesta = await fetch(`https://ads-service.vercel.app/campaign/${this.id}/user`); 
      // const respuesta = await fetch(`https://ads-service.vercel.app/campaign/64db93a5251f961bdbb22365/user`); 
      const datos = await respuesta.json();
      this.suggestion = datos[0];
      console.log(this.suggestion)
      // const registros = datos.userId;
      // 
    },

    //https://ads-service.vercel.app/campaign/64db93a5251f961bdbb22365/user

    
  },
};
</script>
