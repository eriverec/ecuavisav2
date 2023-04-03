<script setup>
import TriviaEstadisticas from '@/pages/apps/concursos/tabs/estadisticas.vue'
import TriviaParticipantes from '@/pages/apps/concursos/tabs/participantes.vue'

const userTab = ref(null)

const tabsTrivia = [
  {
    icon: 'tabler-chart-bar',
    title: 'Estadísticas',
  },
  {
    icon: 'tabler-friends',
    title: 'Participantes',
  }
  // {
  //   icon: 'tabler-sitemap',
  //   title: 'Extras',
  // }
]

</script>

<template>
  <div>

    <VTabs v-model="userTab" class="v-tabs-pill">
      <VTab v-for="tab in tabsTrivia" :key="tab.icon">
        <VIcon :size="18" :icon="tab.icon" class="me-1" />
        <span>{{ tab.title }}</span>
      </VTab>
    </VTabs>

    <VWindow v-model="userTab" class="disable-tab-transition" :touch="false">
      <!-- Estadísticas -->
      <VWindowItem>
        <TriviaEstadisticas/>
      </VWindowItem>
      <!-- Participantes -->
      <VWindowItem>
        <TriviaParticipantes/>
      </VWindowItem>

      <!-- Extras -->
      <VWindowItem>
      </VWindowItem>

    </VWindow>


  </div>
</template>
