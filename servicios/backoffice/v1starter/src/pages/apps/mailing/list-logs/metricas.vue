<script setup>
  import metrica_concurso_agrupados_x_dias from '@/views/apps/concursos/metrica_concurso_colegio.vue';
  import metrica_concurso_colegio_registro from '@/views/apps/concursos/metrica_concurso_colegio_registro.vue';
import metrica_concurso_agrupados_x_horas from '@/views/apps/concursos/metrica_concurso_colegio_x_horas.vue';

</script>

<template>

  <VRow>

    <VCol cols="12" md="12">
      <metrica_concurso_colegio_registro />
    </VCol>

    <VCol cols="12" md="12">
      <metrica_concurso_agrupados_x_dias />
    </VCol>

    <VCol cols="12" md="12">
      <metrica_concurso_agrupados_x_horas />
    </VCol>

  </VRow>

</template>