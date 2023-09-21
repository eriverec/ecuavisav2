<script setup>
import TCBar from '@/pages/apps/suscriptores/graficos/tcredito-bar.vue';
import TCTorta from '@/pages/apps/suscriptores/graficos/tcredito-torta.vue';

</script>

<script>
export default {
	data() {
		return {
			selectedTab: 0,
		};
	},
	methods: {
		selectTab(index) {
			this.selectedTab = index;
		},
	},
};
</script>
  

<template>
	<div class="text-center py-3" v-if="isLoading">Cargando...</div>
	<div v-else>
		<VCardTitle class="pt-4 pl-6">Montos cobrados por tipo de tarjeta</VCardTitle>
		<div class="tab-titles parentTabs">
			<div class="" @click="selectTab(0)" :class="{ active: selectedTab === 0 }"> <VIcon :size="22" icon="tabler-chart-bar" /></div>
			<div @click="selectTab(1)" :class="{ active: selectedTab === 1 }"> <VIcon :size="22" icon="tabler-chart-pie" /></div>
		</div>


		<div class="tab-content">
			<div v-if="selectedTab === 0" class="tab-item">
				<TCBar />
			</div>
			<div v-if="selectedTab === 1" class="tab-item">
				<TCTorta />
			</div>

		</div>


	</div>
</template>

<style scoped>
.parentTabs {
  overflow: auto;
  white-space: nowrap;
  display: flex;
  align-items: flex-start;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-bottom: 15px;
}

.parentTabs::-webkit-scrollbar {
  height: 10px;
}

.parentTabs::-webkit-scrollbar:hover {
  height: 10px;
  padding-top: 10px;
}

.parentTabs::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
}

.parentTabs::-webkit-scrollbar-thumb {
  height: 6px;
  background-color: rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity));
  border-radius: 6px;
}

.parentTabs::-webkit-scrollbar-thumb:hover {
  background-color: rgb(var(--v-theme-primary));
  height: 10px;

}
.tab-titles div.active {
  background-color: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary)) !important;
  border-radius: 0.25rem !important;
}

.tab-titles {
  display: flex;
}

.tab-titles div {
  cursor: pointer;
  /* background-color: lightgray; */
  margin-right: 8px;
  height: var(--v-tabs-height);
  padding: 10px 20px;
  text-transform: uppercase;
  font-size: .875rem;
  --v-btn-size: .875rem;
  --v-btn-height: 38px;
  font-weight: 500;
  letter-spacing: .0892857143em;
  line-height: normal;
}

.tab-content {
  margin-top: 16px;
}

</style>
