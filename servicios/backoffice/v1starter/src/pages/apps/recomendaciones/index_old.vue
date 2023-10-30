<script setup>
import ChartRecomendaciones from "@/views/charts/apex-chart/ChartRecomendaciones.vue";
import ChartRecSubsecccion from "@/views/charts/apex-chart/ChartRecSubsecccion.vue";
</script>

<style type="text/css">
.disabled {
  opacity: 0.1;
  pointer-events: none;
}

.clickable {
  cursor: pointer;
}
</style>
<template>
  <VRow>
    <VCol cols="12">
      <VCard class="mt-3">
        <VCardText class=" flex-wrap justify-space-between gap-4">
          <VCardItem class="pt-0 pb-0">
            <VCardTitle>Recomendaciones por navegación</VCardTitle>
            <VCardSubtitle>Categoría de dispositivos de los últimos 7 días</VCardSubtitle>
          </VCardItem>
          <VDivider />

          <ChartRecomendaciones />

        </VCardText>
      </VCard>
    </VCol>


  </VRow>
</template>
<script>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

</script>