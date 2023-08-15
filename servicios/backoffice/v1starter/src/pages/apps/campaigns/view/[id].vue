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
                    <VCardTitle>Información sobre la campaña: <b>{{suggestion.campaignTitle}}CAMPAÑA EJEMPLO</b>
                    </VCardTitle>
                    <VCardSubtitle> Al sugerir un tema nuevo y habilitarlo, aparecerá en el área de perfil del sitio
                    </VCardSubtitle>
                  </div>

                </div>

                
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
      //const respuesta = await fetch(`https://ads-service.vercel.app/campaign${this.id}/user`); 
      const respuesta = await fetch(`https://ads-service.vercel.app/campaign/64db93a5251f961bdbb22365/user`); 
      const datos = await respuesta.json();
      const registros = datos.data;
      this.suggestion = registros;
      console.log(registros);
    },

    //https://ads-service.vercel.app/campaign/64db93a5251f961bdbb22365/user

    
  },
};
</script>
