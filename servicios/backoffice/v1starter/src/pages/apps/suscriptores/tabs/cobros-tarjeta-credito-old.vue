  
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { hexToRgb } from '@layouts/utils';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

const isLoading = ref(true);
const montosPorTarjeta = ref({});

const colorVariables = themeColors => {
	const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
	const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
	const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
	const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`

	return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const vuetifyTheme = useTheme()
const { themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value);

const chartOptions = ref({
	chart: {
		parentHeightOffset: 0,
		toolbar: { show: false },
	},
	plotOptions: {
		bar: {
			borderRadius: 8,
			barHeight: '60%',
			horizontal: true,
		},
	},
	grid: {
		borderColor: themeBorderColor,
		xaxis: {
			lines: { show: false },
		},
	},
	yaxis: {
		labels: {
			style: { colors: themeDisabledTextColor },
		},
	},
	xaxis: {
		axisBorder: { show: false },
		axisTicks: { color: themeBorderColor },
		labels: {
			style: { colors: themeDisabledTextColor },
		},
	},
});

const chartSeries = ref([
	{
		name: 'Total',
		data: [],
	},
]);

onMounted(async () => {

	const response = await fetch('https://api-configuracion.vercel.app/web/suscriptores-conf');
	if (!response.ok) {
		throw new Error('Error en la solicitud HTTP');
	}
	const data = await response.json();
	console.log(data);

	// Calcular la suma de montos por tipo de tarjeta
	// const montosRes = {};
	// const nombresTarjeta = {};
	const montos = data.resultForChart.mounts;

	
	setTimeout(function () {
		chartOptions.value.xaxis.categories = Object.keys(montos);
		chartSeries.value[0].data = Object.values(montos);
	}, 1000);

	montosPorTarjeta.value = montos;
	isLoading.value = false;

});
</script>
  

<template>
	<div>
		<VCardTitle class="pt-4 pl-6">Montos cobrados por tipo de tarjeta</VCardTitle>

		<VueApexCharts type="bar" height="400" :options="chartOptions" :series="chartSeries" />

		<div class="text-center py-3" v-if="isLoading">Cargando...</div>
		<VTable v-else hover="true">
			<thead>
				<tr>
					<th>Tipo de Tarjeta</th>
					<th>Suma de Montos</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(monto, tipo) in montosPorTarjeta" :key="tipo">
					<td>{{ tipo }}</td>
					<td>{{ monto }}</td>
				</tr>
			</tbody>
		</VTable>
	</div>
</template>


<style>
/* De tema Dark a Light */
.v-theme--light .apexcharts-legend-series .apexcharts-legend-text {
	color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
}

.v-theme--light .apexcharts-xaxis .apexcharts-xaxis-texts-g text {
	fill: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
}

.v-theme--light .apexcharts-yaxis .apexcharts-yaxis-texts-g text {
	fill: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
}

/* De tema Light a Dark */
.v-theme--dark .apexcharts-legend-series .apexcharts-legend-text {
	color: rgba(228, 230, 244, 0.38) !important;
}

.v-theme--dark .apexcharts-xaxis .apexcharts-xaxis-texts-g text {
	fill: rgba(228, 230, 244, 0.38) !important;
}

.v-theme--dark .apexcharts-yaxis .apexcharts-yaxis-texts-g text {
	fill: rgba(228, 230, 244, 0.38) !important;
}
</style>