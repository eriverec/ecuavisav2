<script setup>
import VueApexCharts from "vue3-apexcharts";
import { hexToRgb } from "@layouts/utils";
import { useTheme } from "vuetify";

import Moment from "moment";
import { extendMoment } from "moment-range";
import esLocale from "moment/locale/es";

const moment = extendMoment(Moment);
moment.locale("es", [esLocale]);
const isLoading = ref(false);
const uniqueKey = ref(0);

const props = defineProps({
	articulos: { type: Array, required: true },
	disabledAll: { type: Boolean, required: true, default: false },
	height: { type: String, required: true, default: 310 },
	typeBar: { type: String, required: true, default: "horizontal" },
});

const availableColors = ["primary", "info", "error", "warning", "success"];
const articulosLocal = ref([]);
const totalValue = ref(0);
const customColors = [
	"#836af9",
	// '#ffe802',
	// '#2c9aff',
	// '#ffcf5c',
	// '#4f5d70',
	// '#299aff',
	// '#d4e157',
	// '#28dac6',
	// '#9e69fd',
	// '#ff9800',
	// '#26c6da',
	// '#ff8131',
	// '#28c76f',
	// '#ffbd1f',
	// '#84d0ff',
	// '#edf1f4',
	// '#ff9f43',
];

async function agruparYFiltrarPorTiempo(data, tiempo = "") {
	if (!tiempo) {
		tiempo = moment().startOf("day");
	}

	// Obtener sitios únicos de los datos
	const uniqueSites = [...new Set(data.map((item) => item.sitio))];

	// Crear configuración de colores para los sitios
	const sitiosEsperados = uniqueSites.map((sitio, index) => ({
		sitio,
		color: customColors[index % customColors.length],
	}));

	// Filtrar los registros cuya fechaPublicacion sea de tiempo
	const datosFiltrados = props.disabledAll
		? data
		: data.filter(({ fechaPublicacion }) => {
				const fecha = moment(fechaPublicacion, "DD/MM/YYYY HH:mm:ss", true); // modo estricto
				if (!fecha.isValid()) return false;

				const fechaSinSegundos = fecha.startOf("minute");
				return fechaSinSegundos.isSameOrAfter(moment(tiempo).startOf("minute"));
		  });

	// Agrupar por sitio y color, incluyendo la lista de artículos
	const agrupados = datosFiltrados.reduce((acc, item) => {
		const { sitio } = item;
		const siteConfig = sitiosEsperados.find((s) => s.sitio === sitio);

		if (siteConfig) {
			const key = `${sitio}-${siteConfig.color}`;
			if (!acc[key]) {
				acc[key] = {
					sitio,
					color: siteConfig.color,
					total: 0,
					articulos: [],
				};
			}
			acc[key].total++;
			acc[key].articulos.push(item); // Agregar el artículo a la lista
		}
		return acc;
	}, {});

	// Convertir a array, completar sitios que falten y ordenar de mayor a menor
	return sitiosEsperados
		.map(
			({ sitio, color }) =>
				agrupados[`${sitio}-${color}`] || {
					sitio,
					color,
					total: 0,
					articulos: [],
				}
		)
		.sort((a, b) => b.total - a.total);
}

const dataChart = ref([]);
const dateNowF = ref(moment().format("DD/MM/YYYY HH:mm:ss").toString());
const vuetifyTheme = useTheme();

// 👉 Colors variables
const colorVariables = (themeColors) => {
	const currentTheme = themeColors.colors;
	const variableTheme = themeColors.variables;
	const themeSecondaryTextColor = `rgba(${hexToRgb(
		themeColors.colors["on-surface"]
	)},${themeColors.variables["medium-emphasis-opacity"]})`;
	const themeDisabledTextColor = `rgba(${hexToRgb(
		themeColors.colors["on-surface"]
	)},${themeColors.variables["disabled-opacity"]})`;
	const themeBorderColor = `rgba(${hexToRgb(
		String(themeColors.variables["border-color"])
	)},${themeColors.variables["border-opacity"]})`;
	const themePrimaryTextColor = `rgba(${hexToRgb(
		themeColors.colors["on-surface"]
	)},${themeColors.variables["high-emphasis-opacity"]})`;
	const labelColor = `rgba(${hexToRgb(currentTheme["on-surface"])},${
		variableTheme["disabled-opacity"]
	})`;

	return {
		themeSecondaryTextColor,
		themeDisabledTextColor,
		themeBorderColor,
		themePrimaryTextColor,
		labelColor,
	};
};

// INICIO DE EVENTO CLICK GRAFICO 1
const isDialogVisibleChart1 = ref({
	modal: false,
	search: null,
	data: {
		title: "",
		items: [],
	},
});

const filteredDataModalChart1 = computed(() => {
	if (!isDialogVisibleChart1.value.data.search) {
		return isDialogVisibleChart1.value.data.items;
	}

	const query = isDialogVisibleChart1.value.data.search.toLowerCase();
	return isDialogVisibleChart1.value.data.items.filter((item) => {
		return (
			item.title.toLowerCase().includes(query) ||
			item.sitio.toLowerCase().includes(query)
		);
	});
});

// FIN DE EVENTO CLICK GRAFICO 1

const eventClick = function (event, chartContext, opts) {
	// console.log(event, chartContext, opts)
	// console.log(opts.dataPointIndex)
	// console.log(opts.config.xaxis.categories)
	if (opts.dataPointIndex > -1) {
		isDialogVisibleChart1.value.modal = true;
		const sitio = opts.config.xaxis.categories[opts.dataPointIndex];
		const articulos = articulosLocal.value.find((e) => e.sitio == sitio);
		isDialogVisibleChart1.value.data.items = articulos.articulos;
		isDialogVisibleChart1.value.data.search = null;
		isDialogVisibleChart1.value.data.title = sitio.toUpperCase();

		// console.log(opts.config.xaxis.categories[opts.dataPointIndex])
	}
};

const resolveData = computed(() => {
	const { themeBorderColor, themeDisabledTextColor, labelColor } =
		colorVariables(vuetifyTheme.current.value);

	const totalValueLocal = articulosLocal.value.reduce(
		(sum, item) => sum + item.total,
		0
	);
	totalValue.value = totalValueLocal;
	const series = articulosLocal.value.map((item) => item.total);
	const colors = articulosLocal.value.map((item, index) => {
		if (customColors.length < index) {
			return customColors[index % customColors.length];
		}
		return customColors[index];
	});

	const seriesFormat = {
		name: props.disabledAll ? "Artículos" : "Artículos de hoy",
		data: series,
	};

	const categoriesRaw = articulosLocal.value.map((item) => item.sitio);
	const rangoHora = getTimeRange();

	const options = {
		chart: {
			parentHeightOffset: 0,
			toolbar: { show: false },
			// events: {
			//   selection: function(chartContext, { xaxis, yaxis }) {
			//     // ...
			//     alert()
			//   },
			//   click: function(event, chartContext, opts) {
			//     alert()
			//     // The last parameter opts contains additional information like `seriesIndex` and `dataPointIndex` for cartesian charts
			//   }
			// }
		},
		dataLabels: {
			enabled: true,
			formatter: (val) => {
				if (props.disabledAll) {
					return val;
				}
				return val;
			},
		},
		colors: colors,
		plotOptions: {
			bar: {
				borderRadius: 0,
				barHeight: "30%",
				horizontal: props.typeBar == "bar",
				startingShape: "rounded",
			},
		},
		grid: {
			borderColor: themeBorderColor,
			xaxis: {
				lines: { show: true },
			},
			padding: {
				top: -10,
			},
		},
		yaxis: {
			title: {
				text: "Número de artículos",
				style: {
					fontSize: "11px",
					fontFamily: "Public Sans",
					color: labelColor,
				},
			},
			labels: {
				style: { colors: themeDisabledTextColor },
			},
		},
		xaxis: {
			title: {
				text: props.disabledAll
					? undefined
					: `Desde ${
							rangoHora.inicio.hoy ? "" : rangoHora.inicio.fecha + ","
					  } ${rangoHora.inicio.hora} hasta ${
							rangoHora.inicio.hoy ? "" : "Hoy,"
					  } ${rangoHora.final.hora}`,
				style: {
					fontSize: "11px",
					fontFamily: "Public Sans",
					color: labelColor,
					cssClass: "apexcharts-xaxis-laber-cursor",
					cursor: "pointer",
				},
			},
			axisBorder: { show: false },
			axisTicks: { color: themeBorderColor },
			categories: categoriesRaw,
			labels: {
				style: {
					cssClass: "apexcharts-xaxis-laber-cursor",
				},
				show: true,
				style: { colors: themeDisabledTextColor },

				formatter: function (value, timestamp, opts) {
					if (value) {
						return value.toString().toUpperCase();
					} else {
						return value;
					}
				},
			},
		},
		tooltip: {
			y: {
				formatter: function (val) {
					return val + " Artículos";
				},
			},
			theme: false,
			custom: function ({ series, seriesIndex, dataPointIndex, w }) {
				// series[seriesIndex]
				// console.log()
				return `<div class="tooltip-content">
              <div class="tooltip-body">
                <div class="tooltip-title">
                  ${w.config.series[seriesIndex].name}
                </div>
                <!--<div class="tooltip-subtitle">
                  Campaña
                </div>-->
                <div class="tooltip-data-flex">
                  <div class="tooltip-data-title">
                    ${w.config.xaxis.categories[dataPointIndex]?.toUpperCase()}:
                  </div>
                  <div class="tooltip-data-value">
                    ${series[seriesIndex][dataPointIndex]}
                  </div>
                </div>
              </div>
            </div>`;
			},
		},
	};

	return { series: [seriesFormat], options: options, intereses: categoriesRaw };
});

watch(
	() => props.articulos,
	async (newValue) => {
		if (newValue) {
			isLoading.value = true;
			const resultado = await agruparYFiltrarPorTiempo(props.articulos);
			articulosLocal.value = resultado;
			model_select_hora.value = {
				title: "Hoy",
				value: moment().startOf("day"),
			};
			isLoading.value = false;
		}
	}
);

onMounted(async () => {
	isLoading.value = true;
	const resultado = await agruparYFiltrarPorTiempo(props.articulos);
	articulosLocal.value = resultado;
	isLoading.value = false;
});

function generarIDHora() {
	const ahora = new Date();

	const horas = ahora.getHours().toString().padStart(2, "0");
	const minutos = ahora.getMinutes().toString().padStart(2, "0");
	const segundos = ahora.getSeconds().toString().padStart(2, "0");
	const milisegundos = ahora.getMilliseconds().toString().padStart(3, "0");

	return `${horas}${minutos}${segundos}${milisegundos}`;
}

/*
  @INICIO SELECTOR DE TIEMPO
  */
function getTimeRange() {
	const momentValue = model_select_hora.value.value;
	return {
		inicio: {
			hoy: moment().format("YYYY-MM-DD") == momentValue.format("YYYY-MM-DD"),
			hora: momentValue.format("hh:mm A"),
			fecha: momentValue.format("YYYY-MM-DD"),
		},
		final: {
			hoy: true,
			hora: moment().format("hh:mm A"),
			fecha: moment().format("YYYY-MM-DD"),
		},
	};
}

const model_select_hora = ref({ title: "Hoy", value: moment().startOf("day") });
const items_select_hora = ref([
	{ title: "Hoy", value: moment().startOf("day") },
	{ title: "Hace 15 minutos", value: moment().subtract(15, "minutes") },
	{ title: "Hace 30 minutos", value: moment().subtract(30, "minutes") },
	{ title: "Hace 1 hora", value: moment().subtract(1, "hours") },
	{ title: "Hace 3 horas", value: moment().subtract(3, "hours") },
	{ title: "Hace 5 horas", value: moment().subtract(5, "hours") },
	{ title: "Hace 12 horas", value: moment().subtract(12, "hours") },
	{ title: "Hace 20 horas", value: moment().subtract(20, "hours") },
]);

watch(
	() => model_select_hora.value,
	async (newValue) => {
		if (newValue) {
			isLoading.value = true;
			const resultado = await agruparYFiltrarPorTiempo(
				props.articulos,
				newValue.value
			);
			articulosLocal.value = resultado;
			isLoading.value = false;
		}
	}
);
/*
  @FIN SELECTOR DE TIEMPO
  */
</script>
<template>
	<VDialog v-model="isDialogVisibleChart1.modal" scrollable max-width="650">
		<!-- Dialog close btn -->
		<DialogCloseBtn
			@click="isDialogVisibleChart1.modal = !isDialogVisibleChart1.modal"
		/>

		<!-- Dialog Content -->
		<VCard>
			<VCardItem>
				<div class="d-flex content-title flex-wrap">
					<div class="d-flex gap-3">
						<div class="d-flex flex-column" style="line-height: 1.3">
							<h3 class="h2">
								{{ isDialogVisibleChart1.data.title }}
							</h3>
							<div class="d-flex gap-2 align-center mt-2">
								<small style="font-size: 10px">Artículos</small>
								<VChip size="x-small" color="primary">
									{{ filteredDataModalChart1.length }} Artículo(s)
								</VChip>
							</div>
						</div>
					</div>

					<VTextField
						v-model="isDialogVisibleChart1.data.search"
						label="Buscar.."
						prepend-inner-icon="tabler-search"
						density="compact"
						style="max-width: 300px; padding: 0px 0"
						clearable
					/>
				</div>
			</VCardItem>
			<VCardText style="max-height: 450px">
				<VList lines="two" class="py-4">
					<div v-if="filteredDataModalChart1.length"></div>
					<div v-else>
						<td colspan="4" class="no-results">No se encontraron resultados</td>
					</div>
				</VList>
			</VCardText>

			<VCardText class="py-4">
				<VBtn class="my-4" @click="isDialogVisibleChart1.modal = false">
					Cerrar modal.
				</VBtn>
			</VCardText>
		</VCard>
	</VDialog>
	<VRow>
		<VCol cols="12" md="12" :class="isLoading ? 'disabled' : ''">
			<VCard
				:class="
					props.disabledAll ? 'elevation-0 border rounded no-truncate' : ''
				"
			>
				<VCardItem class="header_card_item px-2 py-2" v-if="!props.disabledAll">
					<div class="d-flex">
						<div class="descripcion">
							<VCardTitle>Artículos: {{ model_select_hora.title }}</VCardTitle>
							<VCardSubtitle>
								Agrupados por medios digitales según la fecha de publicación de
								los artículos
							</VCardSubtitle>
						</div>
					</div>

					<template #append>
						<VSelect
							style="min-width: 150px"
							label="Filtrar por hora"
							v-model="model_select_hora"
							:items="items_select_hora"
							item-text="title"
							item-title="title"
							item-value="value"
							return-object
						/>
					</template>
				</VCardItem>

				<VCardText>
					<VueApexCharts
						v-if="articulosLocal.length > 0"
						:key="generarIDHora()"
						type="bar"
						:height="props.height * 1"
						:options="resolveData.options"
						:series="resolveData.series"
					/>

					<div
						class="d-flex gap-2 mt-0 flex-column pb-3"
						v-if="props.disabledAll"
					>
						<!-- <small style="font-size: 13px;">Medios digitales</small> -->
						<div class="d-flex align-center gap-2 mt-0 flex-wrap">
							<div
								v-for="(item, index) in articulosLocal"
								:key="item.sitio"
								class="d-flex align-center"
							>
								<VChip size="x-small" :color="item.color">
									{{ item.sitio.toUpperCase() }}: {{ item.total }} Artículo(s)
								</VChip>
								<small style="font-size: 15px">{{
									articulosLocal.length > index + 1 ? ", " : ""
								}}</small>
							</div>
						</div>
					</div>
				</VCardText>
			</VCard>
		</VCol>
	</VRow>
</template>

<style scoped>
svg#wordCloud {
	display: block;
	margin: auto;
	width: 100%;
	height: auto;
}
</style>
<style scoped>
.sectionprimicias .v-card-item {
	font-size: 24px;
}

table {
	width: 100%;
	border-collapse: collapse;
	margin-bottom: 2rem;
	height: 400px;
	display: block;
	overflow-y: auto;
}

.content-title {
	justify-content: space-between;
	align-items: center;
}

.board-content {
	height: 500px;
	overflow-y: auto;
}

th,
td {
	/* border: 1px solid #ddd; */
	padding: 8px;
	text-align: left;
}

.fixed-avatar {
	width: 100%;
	height: 130px;
	object-fit: cover;
	object-position: center;
}

.h4.titulo {
	font-size: 13px;
	line-height: 1.3;
}

.apexcharts-xaxis-laber-cursor {
	cursor: pointer;
}

.disabled-card {
	pointer-events: none;
	cursor: default;
	opacity: 0.6;
}

/* th {
  background-color: #f2f2f2;
} */
</style>
