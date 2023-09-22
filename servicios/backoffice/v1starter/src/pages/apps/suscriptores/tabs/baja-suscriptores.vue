<script setup>
import { hexToRgb } from '@layouts/utils';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const colorVariables = themeColors => {
	const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
	const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
	const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
	const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`

	return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const vuetifyTheme = useTheme()
const data = ref([]);
const { themeBorderColor, themeDisabledTextColor,themeSecondaryTextColor } = colorVariables(vuetifyTheme.current.value);
const fechaIngresada = ref([]);
const fechaSelected = ref(moment().subtract(1, 'days').format("DD-MM-YYYY").toString() + ' a ' + moment().format("DD-MM-YYYY").toString());
const isLoading = ref(true);
const montosPorTarjeta = ref({});

const fechaFrom = ref(moment().format('YYYY-MM-DD'));
const fechaTo = ref(moment().subtract(1, 'days').format('YYYY-MM-DD'));

const selectedPaquetes = ref(null); // Valor seleccionado en el VSelect
const paquetes = ref([]); // Almacenará los nombres de los paquetes
const totalAmount = ref(0);

const chartOptionsPie = ref({
	chart: {
		type: 'donut',
	},
	labels: [],
	legend: {
		position: 'bottom',
		markers: { offsetX: -3 },
		labels: { colors: themeSecondaryTextColor },
		itemMargin: {
			vertical: 3,
			horizontal: 10,
		},
	},
});


const chartSeriesPie = ref([]);

async function graficoTorta() {
	const response = await fetch(`https://api-configuracion.vercel.app/web/baja-suscriptores?from=${fechaFrom.value}&to=${fechaTo.value}`);
		const dataPie = await response.json();

		if (dataPie.status === 'ok') {
			const resultForChart = dataPie.resultForChart;

			// Recuperar los valores de mounts
			const mountsData = resultForChart.mounts;

			// Convertir los datos en un formato adecuado para el gráfico
			const labels = Object.keys(mountsData);
			const series = Object.values(mountsData);

			chartOptionsPie.value.labels = labels;
			chartSeriesPie.value = series;

			const sortedMontos = Object.entries(mountsData)
				.sort((b, a) => a[1] - b[1])
				.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
				dataPie.value = sortedMontos;

			montosPorTarjeta.value = sortedMontos;
			totalAmount.value = Object.values(mountsData).reduce((acc, val) => acc + val, 0);
			// isLoading.value = false;

		} else {
			console.error('Error en la respuesta de la API');
		}
}


async function fetchData() {
	await fetch(`https://api-configuracion.vercel.app/web/baja-suscriptores?from=${fechaFrom.value}&to=${fechaTo.value}`)
		.then(response => response.json())
		.then(resp => {
			// console.log(resp);
			const montos = resp.resultForChart.mounts;
			const sortedMontos = Object.entries(montos)
				.sort((b, a) => a[1] - b[1])
				.reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
			data.value = sortedMontos;
			montosPorTarjeta.value = sortedMontos;

			totalAmount.value = Object.values(montos).reduce((acc, val) => acc + val, 0);


			isLoading.value = false;
		});
}

async function getPaquetes() {
	const response = await fetch('https://ecuavisa-modulos.vercel.app/paquete');
	const data = await response.json();

	if (data.resp && data.data && data.data.length > 0) {
		// Mapear los nombres de los paquetes
		paquetes.value = data.data.map(item => item.nombre);
	} else {
		console.error('Error en la respuesta de la API');
	}
}

onMounted(async () => {
	await fetchData();
	await graficoTorta();
	await getPaquetes();
});

const getSelectedDates = async (dates) => {
	if (dates.length > 1) {
		fechaIngresada.value = dates;
		let arrayFecha = Array.from(fechaIngresada.value);
		fechaFrom.value = moment(arrayFecha[0]).format('YYYY-MM-DD');
		fechaTo.value = moment(arrayFecha[1]).format('YYYY-MM-DD');
		await fetchData();
	}
}

const resolveData = computed(() => {
	let dataRaw;
	let arrayFecha = Array.from(fechaIngresada.value);
	// console.log(arrayFecha);
	if (arrayFecha.length > 0) {
		dataRaw = (data.value);

	} else {
		dataRaw = (data.value);
	}

	const seriesFormat = {
		name: 'Total',
		data: []
	};

	var categoriesRaw = [];
	categoriesRaw = Object.keys(dataRaw);
	seriesFormat.data = Object.values(dataRaw);

	const options = {
		chart: {
			parentHeightOffset: 0,
			toolbar: { show: false },
		},
		dataLabels: {
			enabled: true
		},
		plotOptions: {
			bar: {
				borderRadius: 8,
				barHeight: '60%',
				horizontal: true,
				distributed: true,
			},
		},
		grid: {
			borderColor: themeBorderColor,
			xaxis: {
				lines: { show: false },
			},
			padding: {
				top: -10,
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
			categories: categoriesRaw,
			labels: {
				style: { colors: themeDisabledTextColor },
			},
		}
	}
	return { series: [seriesFormat], options: options };
});



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
    <VCardTitle class="pt-4 pl-6">Baja de suscriptores por paquete de suscripción</VCardTitle>
		<VCardTitle class="pt-4 pl-6">
			<VRow>
				<VCol cols="4">
					<AppDateTimePicker prepend-inner-icon="tabler-calendar" density="compact" v-model="fechaSelected"
						show-current=true @on-change="getSelectedDates" :config="{
							mode: 'range',
							altFormat: 'F j, Y',
							dateFormat: 'd-m-Y',
							maxDate: new Date(),
							position: 'auto right',
							reactive: true
						}" />

				</VCol>
				<VCol cols="8">
					<VSelect style="width:100%;" v-model="selectedPaquetes" :items="paquetes" label="Paquetes" />
				</VCol>
			</VRow>

		</VCardTitle>

		<div class="tab-titles parentTabs">
			<div class="" @click="selectTab(0)" :class="{ active: selectedTab === 0 }"> <VIcon :size="22" icon="tabler-chart-bar" /></div>
			<div @click="selectTab(1)" :class="{ active: selectedTab === 1 }"> <VIcon :size="22" icon="tabler-chart-pie" /></div>
		</div>

		<div class="tab-content">
			<div v-if="selectedTab === 0" class="tab-item">
				<VueApexCharts type="bar" height="500" :options="resolveData.options" :series="resolveData.series" />
			</div>
			<div v-if="selectedTab === 1" class="tab-item">
				<VueApexCharts type="donut" height="500" :options="chartOptionsPie" :series="chartSeriesPie" />
			</div>

		</div>

		<div class="text-center py-5" v-if="isLoading">Cargando...</div>
		<VTable v-else hover="true" class="text-no-wrap tableNavegacion mx-5 my-5">
			<thead>
				<tr>
					<th>Paquetes</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="(monto, tipo) in montosPorTarjeta" :key="tipo">
					<td>{{ tipo }}</td>
					<td>{{ monto }}</td>
				</tr>
				<tr>
					<td>TOTAL</td>
					<td>{{ totalAmount }}</td>
				</tr>
			</tbody>
		</VTable>
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
  padding-top: 15px;

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