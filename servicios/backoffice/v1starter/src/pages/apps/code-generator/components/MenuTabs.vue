<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// Props: recibe el índice activo desde el padre
const props = defineProps({
  activeIndex: {
    type: Number,
    default: 0
  }
})

// Definir los tabs con sus rutas
const newsletterTabs = [
  {
    id: 'codigorojas',
    index: 0,
    label: 'Código Rojas',
    icon: 'tabler-circle-dot',
    route: '/apps/code-generator/codigo-rojas',
    color: 'primary'
  },
]

// Navegar a una ruta específica
const navigateTo = (tab) => {
  router.push(tab.route)
}

// Verificar si un tab está activo
const isTabActive = (tabIndex) => {
  return tabIndex === props.activeIndex
}
</script>

<template>
  <div class="vertical-tabs">
    <!-- Opción 1: Usando router-links nativos -->
    <div class="v-tabs v-tabs--vertical v-tabs-pill ">
      <div class="v-tabs-bar w-100">
        <div class="v-tabs-bar__content d-flex flex-column">
          <RouterLink
            v-for="tab in newsletterTabs"
            :key="tab.id"
            :to="tab.route"
            :class="[
              'v-tab',
              'v-tab--vertical',
              { 'v-tab--active': isTabActive(tab.index) }
            ]"
          >
            <VIcon 
              :icon="tab.icon" 
              size="18"
              start 
              :color="isTabActive(tab.index) ? tab.color : undefined" 
            />
            {{ tab.label }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

/* Estilo para router-links como tabs */
.v-tabs-bar__content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.v-tab {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: start;
  box-sizing: border-box;
  min-height: 48px;
  padding: 0 24px;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: normal;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 0.0892857143em;
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity));
  cursor: pointer;
  user-select: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 6px;
  margin: 2px 0;
}

.v-tab--vertical {
  justify-content: start;
  text-align: left;
}

.v-tab:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
  color: rgb(var(--v-theme-primary));
}

.v-tab--active {
  background-color: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary)) !important;
  font-weight: 600;
}

/* Estilo para la opción con VList */
.vertical-tabs-list {
  background: transparent;
  padding: 0;
}

.vertical-tab-item {
  border-radius: 6px;
  margin: 2px 0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.vertical-tab-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.vertical-tab-item--active {
  background-color: rgba(var(--v-theme-primary), 0.1) !important;
  border-left: 3px solid rgb(var(--v-theme-primary));
}

/* Estilos responsive */
@media (max-width: 960px) {
  .vertical-tabs {
    width: auto;
  }
  
  .v-tabs-bar__content {
    flex-direction: row;
    overflow-x: auto;
    padding-bottom: 8px;
  }
  
  .v-tab {
    min-width: 120px;
    padding: 12px 16px;
    white-space: nowrap;
  }
  
  .v-tab--vertical {
    justify-content: center;
  }
}
</style>