<script setup>
import tabDispositivos from "@/pages/apps/filtros/tabs/filtrosDispositivos.vue";
import tabVisitas from "@/pages/apps/filtros/tabs/filtrosVisitas.vue";

const currentTab = ref('tab-chartDispositivos');

</script>

<template>
  <section>
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">

        <VTabs v-model="currentTab" class="v-tabs-pill">
          <VTab value="tab-chartDispositivos">Dispositivos</VTab>
          <VTab value="tab-visitas">Visitas</VTab>
          <!-- <VTab>Tab Three</VTab> -->
        </VTabs>
        
        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-chartDispositivos">
                <tabDispositivos/>      
              </VWindowItem>

              <VWindowItem value="tab-visitas">
                <tabVisitas/>              
              </VWindowItem>

             
            </VWindow>
          </VCardText>
        </VCard>

      </VCol>
    </VRow>
  </section>
</template>


