<script setup>


import EstadisticasUsertype from '@/views/apps/contenidos/graficos/estadisticas_usertype.vue'
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardTitle>Estadísticas por Tipo de Usuario</VCardTitle>
        <VCardText>
          <EstadisticasUsertype />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>