<script setup>
  import metrica_hija_embajador_agrupados_x_dias from '@/views/apps/concursos/metrica_hija_embajador_agrupados_x_dias.vue';
import metrica_hija_embajador_agrupados_x_horas from '@/views/apps/concursos/metrica_hija_embajador_agrupados_x_horas.vue';

</script>

<template>

  <VRow>

    <VCol cols="12" md="12">
      <metrica_hija_embajador_agrupados_x_dias />
    </VCol>

    <VCol cols="12" md="12" class="d-none">
      <metrica_hija_embajador_agrupados_x_horas />
    </VCol>

  </VRow>

</template>