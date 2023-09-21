<template>
	<section>
		<VRow>
			<VCol cols="12">
				<div class="tab-titles parentTabs">
					<div class="" @click="selectTab(0)" :class="{ active: selectedTab === 0 }">Tarjeta de credio</div>
					<div @click="selectTab(1)" :class="{ active: selectedTab === 1 }">Cobros por paquete</div>
					<div @click="selectTab(2)" :class="{ active: selectedTab === 2 }">Cobros rechazados</div>
					<div @click="selectTab(3)" :class="{ active: selectedTab === 3 }">Alta de suscriptores</div>
				</div>
				<VCard>
					

					<div class="tab-content">
						<div v-if="selectedTab === 0" class="tab-item">
							<TarjetaCredito />
						</div>
						<div v-if="selectedTab === 1" class="tab-item">
							<div>paquetes</div>
						</div>
						<div v-if="selectedTab === 2" class="tab-item">
							<div>rechazados</div>
						</div>
						<div v-if="selectedTab === 3" class="tab-item">
							<div>alta</div>
						</div>

					</div>


				</VCard>

			</VCol>

		</VRow>



	</section>
</template>



  
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import TarjetaCredito from '@/pages/apps/suscriptores/tabs/cobros-tarjeta-credito.vue';

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

<style scoped>
.parentTabs {
  overflow: auto;
  white-space: nowrap;
  display: flex;
  align-items: flex-start;
  align-items: center;
  justify-content: space-between;
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
