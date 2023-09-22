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

const dataTest = ref([]);
const selectedPlan = ref('');
const selectedRecursivo = ref('all');
const selectedTarjeta = ref('');

const dataCC = [
	{
		tipoTarjeta: "Visa",
		montos: 20,
		fecha: "2023-05-01",
		plan: "plan1",
		recursivo: true
	},
	{
		tipoTarjeta: "Visa",
		montos: 55,
		fecha: "2023-06-02",
		plan: "plan2",
		recursivo: true
	},
	{
		tipoTarjeta: "Visa",
		montos: 83,
		fecha: "2023-07-25",
		plan: "plan3",
		recursivo: false
	},
	{
		tipoTarjeta: "American Express",
		montos: 62,
		fecha: "2023-05-21",
		plan: "plan2",
		recursivo: false
	},
	{
		tipoTarjeta: "American Express",
		montos: 94,
		fecha: "2023-06-01",
		plan: "plan1",
		recursivo: true
	},
	{
		tipoTarjeta: "American Express",
		montos: 86,
		fecha: "2023-07-14",
		plan: "plan3",
		recursivo: true
	},
	{
		tipoTarjeta: "Mastercard",
		montos: 36,
		fecha: "2023-05-11",
		plan: "plan1",
		recursivo: false
	},
	{
		tipoTarjeta: "Mastercard",
		montos: 91,
		fecha: "2023-06-21",
		plan: "plan2",
		recursivo: true
	},
	{
		tipoTarjeta: "Mastercard",
		montos: 74,
		fecha: "2023-07-01",
		plan: "plan3",
		recursivo: true
	},
	{
		tipoTarjeta: "Dinners",
		montos: 42,
		fecha: "2023-05-21",
		plan: "plan1",
		recursivo: true
	},
	{
		tipoTarjeta: "Dinners",
		montos: 84,
		fecha: "2023-06-14",
		plan: "plan2",
		recursivo: false
	},
	{
		tipoTarjeta: "Dinners",
		montos: 78,
		fecha: "2023-07-27",
		plan: "plan3",
		recursivo: true
	}
]

const planes = [
	{
		title: "Plan 1",
		value: "plan1"
	},
	{
		title: "Plan 2",
		value: "plan2"
	},
	{
		title: "Plan 3",
		value: "plan3"
	}
]

const recursivo = [
	{
		title: "Si",
		value: "si"
	},
	{
		title: "No",
		value: "no"
	},
	{
		title: "Todos",
		value: "all"
	}
]

const tarjetas = [
	"Visa", "Mastercard", "Dinners", "American Express"
]

function resolveDataRaw() {
	let resultado = dataCC;

	let fechaInicio = new Date(fechaFrom.value);
	let fechaFin = new Date(fechaTo.value);

	// Filtra los elementos del array según el rango de fechas
	resultado = dataCC.filter(item => {
		const fechaItem = new Date(item.fecha);
		return fechaItem >= fechaInicio && fechaItem <= fechaFin;
	});

	if (selectedRecursivo.value !== "all") {
		let isRecursive;
		selectedRecursivo.value === "si" ? isRecursive = true : isRecursive = false;
		resultado = resultado.filter(item => item.recursivo === isRecursive);
	}

	if (selectedPlan.value !== "") {
		resultado = resultado.filter(item => item.plan === selectedPlan.value);
	}

	if (selectedTarjeta.value !== "") {
		resultado = resultado.filter(item => item.tipoTarjeta === selectedTarjeta.value);
	}


	dataTest.value = resultado;
	console.log('dataTest ', dataTest.value);
}

onMounted(async () => {
	resolveDataRaw();
});


</script>


<template>
	<div class="d-flex gap-2">
		<VSelect style="width:100%;" v-model="selectedPlan" :items="planes" label="Plan"
			@update:modelValue="resolveDataRaw" />
		<VSelect style="width:100%;" v-model="selectedTarjeta" :items="tarjetas" label="Tarjeta de Crédito"
			@update:modelValue="resolveDataRaw" />
		<VSelect style="width:100%;" v-model="selectedRecursivo" :items="recursivo" label="Recursivo"
			@update:modelValue="resolveDataRaw" />
	</div>
</template>
