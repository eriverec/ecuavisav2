<script setup>

const currentTab = ref('tab-lista');
const checkbox = ref(1);
const dataCampaigns = ref([]);

onMounted(getCampaigns)

async function getCampaigns(){
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  var response = await fetch(`https://ads-service.vercel.app/campaign/get/all`, requestOptions);
  const data = await response.json();

  dataCampaigns.value = data;
}

</script>

<template>
  <section>
    <VRow>
      <VCol
        class="mt-6"
        cols="12"
        md="12"
        lg="12"
      >
        <VTabs
          v-model="currentTab"
          class="v-tabs-pill"
        >
          <VTab
            value="tab-lista"
            class=" d-none"
          >
            Listado
          </VTab>
          <VTab
            value="tab-agregar"
            class=" d-none"
          >
            Estadísticas
          </VTab>
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-lista">
                <div
                  class="d-flex flex-wrap py-4 gap-4 align-items-center"
                  style="justify-content: space-between;"
                >
                  <div>
                    <VCardTitle>
                      Listado de campañas existentes
                    </VCardTitle>
                    <VCardSubtitle> Elige la campaña sobre la que necesites información  </VCardSubtitle>
                  </div>
                </div>

                
                <!-- inicio lista de Módulos -->
                  
                <VList lines="two">
                  <template
                    v-for="(element, index) in dataCampaigns"
                    :key="index"
                  >
                    <VListItem
                      v-if="element.campaignTitle"
                      border
                    >

                      <VListItemTitle>
                        <span>{{ element.position }}</span>
                      </VListItemTitle>
                      <VListItemSubtitle
                        class="mt-1"
                        color="info"
                      >
                      </VListItemSubtitle>
                      
                    </VListItem>
                  </template>
                </VList>
                <!-- fin lista usuarios -->
              </VWindowItem>

              

              
            </VWindow>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>



<style scoped>  
.v-card.v-theme--dark .iframe-dark {
  display: block;
}

.v-card.v-theme--dark .iframe-light {
  display: none;
}

.v-card.v-theme--light .iframe-dark {
  display: none;
}

.v-card.v-theme--light .iframe-light {
  display: block;
}
</style>
