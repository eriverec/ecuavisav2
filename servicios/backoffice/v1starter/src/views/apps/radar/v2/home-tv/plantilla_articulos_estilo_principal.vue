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

const props = defineProps({
	filtrosActivos: { type: Array, required: true },
	articulos: { type: Array, required: true },
	modoSimple: { type: Boolean, required: true, default: false },
	selecteDisplay: { type: Boolean, required: true, default: true },
});

const filteredData = ref([]);

const customColors = [
	"#836af9",
	"#ffe802",
	"#2c9aff",
	"#ffcf5c",
	"#4f5d70",
	"#299aff",
	"#d4e157",
	"#28dac6",
	"#9e69fd",
	"#ff9800",
	"#26c6da",
	"#ff8131",
	"#28c76f",
	"#ffbd1f",
	"#84d0ff",
	"#edf1f4",
	"#ff9f43",
];

function getDefaultDate() {
	return moment("2025-01-01 12:00:00", "YYYY-MM-DD HH:mm:ss");
}

function replaceAmp(input) {
	return input.replace(/&amp;/g, "&");
}

const formatDate = (dateString) => {
	const date = moment(dateString, "DD/MM/YYYY HH:mm:ss", true); // modo estricto
	return date.isValid() ? date.format("DD/MM/YYYY HH:mm:ss") : "Actualizando";
};

/*
  INICIO - FUNCIONALIDAD
  */

// INICIO DE EVENTO CLICK GRAFICO 1
const isDialogVisibleKeyWords = ref({
	modal: false,
	search: null,
	data: {
		title: "",
		items: [],
	},
});

const containsKeywordLocal = (keywords, keyword) => {
	if (!keywords || !keyword) return false;

	try {
		let parsedKeywords = [];

		if (typeof keywords === "string") {
			parsedKeywords = keywords
				.split(",")
				.map((k) => k.trim())
				.filter(Boolean);
		} else if (Array.isArray(keywords)) {
			parsedKeywords = keywords
				.map((k) => (typeof k === "string" ? k.trim() : String(k)))
				.filter(Boolean);
		} else if (typeof keywords === "object") {
			parsedKeywords = [String(keywords)].filter(Boolean);
		}

		return parsedKeywords.includes(keyword.trim());
	} catch (err) {
		console.warn("Error parsing keywords:", err);
		return false;
	}
};

const clickKeywordLocal = (keyword) => {
	try {
		isDialogVisibleKeyWords.value.modal = true;
		let objeto = [];

		// console.log("props.dataListArticles", props.dataListArticles)

		// Iterar sobre cada artículo en props.dataListArticles
		// Object.values(filteredData.value).forEach(article => {
		//     // console.log("containsKeywordLocal(article.keywords, keyword)", containsKeywordLocal(article.keywords, keyword))
		//     // console.log("containsKeywordLocal(article.keywords, keyword) article.keywords", article.keywords, keyword)
		//     if (article.hasOwnProperty("keywords") && containsKeywordLocal(article.keywords, keyword)) {
		//         objeto.push(article); // Agregar el artículo directamente si contiene la palabra clave
		//     }
		// });

		// let objeto = [];
		const dataKeywordsAll = allKeywords.value;
		for (var i in dataKeywordsAll) {
			if (dataKeywordsAll[i].label == keyword) {
				isDialogVisibleKeyWords.value.data.items = dataKeywordsAll[i].articles;
				isDialogVisibleKeyWords.value.data.search = null;
				isDialogVisibleKeyWords.value.data.title = keyword.toUpperCase();
				return true;
			}
		}

		// Limpiar la búsqueda anterior

		// Ordenar los artículos por fecha de publicación (de más reciente a más antiguo)
		// isDialogVisibleKeyWords.value.data.items = objeto.sort((a, b) => {

		//     const dateA = moment(a.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");
		//     const dateB = moment(b.fechaPublicacion, "DD/MM/YYYY HH:mm:ss");

		//     return dateB - dateA;
		// });

		// Actualizar título y mostrar el modal
		// isDialogVisibleKeyWords.value.data.items = objeto;
		// isDialogVisibleKeyWords.value.data.search = null;
		// isDialogVisibleKeyWords.value.data.title = keyword.toUpperCase();

		// console.log("objeto",objeto);
		return objeto;
	} catch (error) {
		console.error("Error en clickKeywordLocal:", error);
		return [];
	}
};

const filteredDataModalKeyWord = computed(() => {
	if (!isDialogVisibleKeyWords.value.data.search) {
		return isDialogVisibleKeyWords.value.data.items;
	}

	const query = isDialogVisibleKeyWords.value.data.search.toLowerCase();
	return isDialogVisibleKeyWords.value.data.items.filter((item) => {
		return (
			item.title.toLowerCase().includes(query) ||
			item.sitio.toLowerCase().includes(query)
		);
	});
});

// FIN DE EVENTO CLICK GRAFICO 1

/*
  FIN - FUNCIONALIDAD
  */

/*
  INICIO - FUNCIONALIDAD PAGINADO
  */

const currentPage = ref(1);
const pageSize = ref(10); // Valor por defecto

watch(pageSize, () => {
	currentPage.value = 1;
});

const paginatedData = computed(() => {
	const start = (currentPage.value - 1) * pageSize.value;
	return filteredData.value.slice(start, start + pageSize.value);
});

/*
  FIN - FUNCIONALIDAD PAGINADO
  */

/*
  INICIO - FUNCIONALIDAD PAGINADO ModalKeyWord
  */

const currentPageModalKeyWord = ref(1);
const pageSizeModalKeyWord = ref(10); // Valor por defecto

watch(pageSizeModalKeyWord, () => {
	currentPageModalKeyWord.value = 1;
});

const paginatedDataModalKeyWord = computed(() => {
	const start =
		(currentPageModalKeyWord.value - 1) * pageSizeModalKeyWord.value;
	return filteredDataModalKeyWord.value.slice(
		start,
		start + pageSizeModalKeyWord.value
	);
});

/*
  FIN - FUNCIONALIDAD PAGINADOModalKeyWord
  */

/*
  @INICIO SELECTOR DE TIEMPO
  */
async function agruparYFiltrarPorTiempo(data, tiempo = "") {
	if (!tiempo) {
		return props.articulos;
	}

	// Get unique sites from the data
	const uniqueSites = [...new Set(data.map((item) => item.sitio))];

	// Create dynamic sitiosEsperados
	// const sitiosEsperados = uniqueSites.map((sitio, index) => ({
	//   sitio,
	//   color: customColors[index % customColors.length]
	// }));

	// Filtrar los registros cuya fechaPublicacion sea de tiempo
	const datosFiltrados = data.filter(({ fechaPublicacion, sitio }) => {
		const fechaSinSegundos = moment(
			fechaPublicacion,
			"DD/MM/YYYY HH:mm:ss"
		).startOf("minute");
		return fechaSinSegundos.isSameOrAfter(moment(tiempo).startOf("minute"));
	});

	return datosFiltrados;
}

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
	{ title: "Todos", value: "" },
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
			filteredData.value = resultado;
			procesarKeywordsAndTags(filteredData.value);
			isLoading.value = false;
			currentPage.value = 1;
		}
	}
);
/*
  @FIN SELECTOR DE TIEMPO
  */

watch(
	() => props.articulos,
	async (newValue) => {
		if (newValue) {
			isLoading.value = true;
			filteredData.value = props.articulos;
			procesarKeywordsAndTags(filteredData.value);
			model_select_hora.value = {
				title: "Hoy",
				value: moment().startOf("day"),
			};
			isLoading.value = false;
			currentPage.value = 1;
		}
	}
);

onMounted(async () => {
	isLoading.value = true;
	filteredData.value = props.articulos;
	procesarKeywordsAndTags(filteredData.value);
	model_select_hora.value = { title: "Hoy", value: moment().startOf("day") };
	isLoading.value = false;
});

/*
 ******* INICIO FILTRO pastelWordCloud
 */
const topKeywords = ref([]);
const topTags = ref([]);
const allKeywords = ref([]);
const allTags = ref([]);

const parseItems = (items) => {
	if (!items) return [];

	try {
		if (typeof items === "string") {
			return items
				.split(",")
				.map((i) => i.trim())
				.filter(Boolean);
		} else if (Array.isArray(items)) {
			return items
				.map((i) => (typeof i === "string" ? i.trim() : String(i)))
				.filter(Boolean);
		} else if (typeof items === "object") {
			return [String(items)].filter(Boolean);
		}
	} catch (err) {
		console.warn("Error al procesar items:", err);
	}

	return [];
};

const procesarItems = (articles, key) => {
	if (!articles || !Array.isArray(articles) || articles.length === 0) {
		console.warn(`No hay artículos para procesar ${key}`);
		return { topItems: [], allItems: [] };
	}

	try {
		const itemData = {};

		articles.forEach((article) => {
			if (article && article[key]) {
				const items = parseItems(article[key]);
				items.forEach((item) => {
					if (!itemData[item]) {
						itemData[item] = { count: 0, articles: [] };
					}
					itemData[item].count += 1;
					itemData[item].articles.push(article);
				});
			}
		});

		// Ordenar por frecuencia
		const sortedItems = Object.entries(itemData)
			.filter(([item]) => item && item.trim())
			.sort(([, a], [, b]) => b.count - a.count);

		// Formatear los datos
		const topItems = sortedItems.slice(0, 10).map(([label, data]) => ({
			label,
			value: data.count,
			articles: data.articles,
		}));

		const allItems = sortedItems.map(([label, data]) => ({
			label,
			value: data.count,
			articles: data.articles,
		}));

		// console.log(`Procesadas ${allItems.length} ${key}, top 10 ${key}:`, topItems);

		return { topItems, allItems };
	} catch (err) {
		console.error(`Error al procesar ${key}:`, err);
	}
};

// Uso para keywords y tags

// Wrappers específicos
const procesarKeywords = (articles) => {
	// procesarMetadatos(articles, 'keywords', topKeywords, allKeywords);
	const resp = procesarItems(articles, "keywords");
	allKeywords.value = resp.allItems;
	topKeywords.value = resp.topItems;
};

const procesarTags = (articles) => {
	// procesarMetadatos(articles, 'tags', topTags, allTags);
	const resp = procesarItems(articles, "tags");
	allTags.value = resp.allItems;
	topTags.value = resp.topItems;
};

function procesarKeywordsAndTags(articles) {
	procesarKeywords(articles);
	procesarTags(articles);
}

/*
 ******* FIN FILTRO pastelWordCloud
 */
</script>
<template>
	<VDialog v-model="isDialogVisibleKeyWords.modal" scrollable max-width="650">
		<!-- Dialog close btn -->
		<DialogCloseBtn
			@click="isDialogVisibleKeyWords.modal = !isDialogVisibleKeyWords.modal"
		/>

		<!-- Dialog Content -->
		<VCard>
			<VCardItem>
				<div class="d-flex content-title flex-wrap">
					<div class="d-flex gap-3">
						<div class="d-flex flex-column" style="line-height: 1.3">
							<h3 class="h2">
								{{ isDialogVisibleKeyWords.data.title }}
							</h3>
							<div class="d-flex gap-2 align-center mt-2">
								<small style="font-size: 10px">Artículos</small>
								<VChip size="x-small" color="primary">
									{{ filteredDataModalKeyWord.length }} Artículo(s)
								</VChip>
							</div>
						</div>
					</div>

					<VTextField
						v-model="isDialogVisibleKeyWords.data.search"
						label="Buscar.."
						prepend-inner-icon="tabler-search"
						density="compact"
						style="max-width: 300px; padding: 0px 0"
						clearable
					/>
				</div>
			</VCardItem>
			<VCardText style="max-height: 550px">
				<VList lines="two" class="py-4">
					<div v-if="filteredDataModalKeyWord.length">
						<VSelect
							style="width: 170px"
							v-model="pageSizeModalKeyWord"
							:items="[10, 20, 100, 200, 500]"
							label="Registros por página"
							dense
							outlined
							class="mb-2 mt-5 d-block"
						/>

						<template v-for="item in paginatedDataModalKeyWord">
							<VListItem
								class="article-card elevation-0 border-1 rounded no-truncate px-4 py-2 mb-3"
							>
								<template #prepend>
									<VAvatar
										v-if="item.picture"
										:image="replaceAmp(item.picture)"
										size="64"
										rounded
									/>
									<VIcon v-else icon="tabler-news" size="32" />
								</template>
								<VChip
									v-if="item.sitio"
									class="mb-2"
									size="x-small"
									color="dark"
									>{{ item.sitio.toUpperCase() }}</VChip
								>
								<VTooltip location="top">
									<template v-slot:activator="{ props }">
										<VListItemTitle v-bind="props" class="text-truncate">
											{{ item.title || item.titulo }}
										</VListItemTitle>
									</template>
									<span>{{ item.title || item.titulo }}</span>
								</VTooltip>
								<VListItemSubtitle>
									<div class="d-flex gap-2 align-center">
										<span class="text-xs">{{
											formatDate(item.fechaPublicacion) || "Sin fecha"
										}}</span>
										<VChip
											v-if="item.subseccion"
											class="ml-2"
											size="small"
											color="success"
											>{{ item.subseccion }}</VChip
										>
										<small
											style="font-size: 10px"
											v-if="seccion == 'Últimas noticias'"
											>Página: {{ item.seccion }}</small
										>
										<div
											title="Autor"
											class="align-center mt-1"
											v-if="item.autor"
											style="font-size: 12px"
										>
											<VIcon icon="tabler-user" size="15" />
											<small style="margin-top: 5px">{{ item.autor }}</small>
										</div>
									</div>
								</VListItemSubtitle>
								<template #append>
									<VBtn
										:href="item.link"
										target="_blank"
										icon
										variant="text"
										size="small"
									>
										<VIcon icon="tabler-external-link" />
									</VBtn>
								</template>
							</VListItem>
						</template>
						<VPagination
							class="mt-5"
							v-model="currentPageModalKeyWord"
							:length="
								Math.ceil(
									filteredDataModalKeyWord.length / pageSizeModalKeyWord
								)
							"
							total-visible="5"
						/>
					</div>
					<div v-else>
						<td colspan="4" class="no-results">No se encontraron resultados</td>
					</div>
				</VList>
			</VCardText>

			<VCardText class="py-4">
				<VBtn class="my-4" @click="isDialogVisibleKeyWords.modal = false">
					Cerrar modal.
				</VBtn>
			</VCardText>
		</VCard>
	</VDialog>
	<VRow>
		<VCol cols="12" md="12" lg="12" class="pb-0">
			<VCard
				:class="
					props.modoSimple
						? 'article-card elevation-0 border-0 rounded no-truncate px-0'
						: ''
				"
			>
				<VCardItem
					:class="props.modoSimple ? 'header_card_item px-2 py-0' : ''"
				>
					<div class="d-flex justify-space-between">
						<div class="descripcion" v-if="!props.modoSimple">
							<VCardTitle>Listado de artículos</VCardTitle>
							<VCardSubtitle>
								Mostrando {{ paginatedData.length }} artículos de
								{{ filteredData.length }}
							</VCardSubtitle>
							<VCardSubtitle class="mt-3" v-if="props.filtrosActivos?.busqueda">
								<b> Filtro de búsqueda activo: </b>
								{{ props.filtrosActivos.busqueda }}
							</VCardSubtitle>
							<VCardSubtitle
								class="mt-1"
								v-if="props.filtrosActivos?.sitio.length > 0"
							>
								<b> Filtro de medio activo: </b>
								{{ props.filtrosActivos?.sitio.map((e) => e.title).join(",") }}
							</VCardSubtitle>
							<VCardSubtitle
								class="mt-1"
								v-if="props.filtrosActivos?.seccion.length > 0"
							>
								<b> Filtro de sección activo: </b>
								{{ props.filtrosActivos?.seccion.join(",") }}
							</VCardSubtitle>
							<VCardSubtitle
								class="mt-1"
								v-if="props.filtrosActivos?.subseccion.length > 0"
							>
								<b> Filtro de subsección activo: </b>
								{{ props.filtrosActivos?.subseccion.join(",") }}
							</VCardSubtitle>
						</div>
						<div class="pt-2 d-flex gap-2 align-start">
							<VSelect
								style="min-width: 150px"
								label="Filtrar por hora"
								v-model="model_select_hora"
								:items="items_select_hora"
								item-text="title"
								item-title="title"
								item-value="value"
								return-object
								:class="!props.selecteDisplay ? 'd-none' : 'd-none'"
							/>

							<VSelect
								style="min-width: 150px"
								v-model="pageSize"
								:items="[10, 20, 100, 200, 500]"
								label="Registros por página"
								dense
								outlined
								class="mb-4 d-none"
							/>
						</div>
					</div>
				</VCardItem>

				<VCardText
					v-if="paginatedData.length > 0"
					:class="props.modoSimple ? 'px-2' : ''"
				>
					<VRow :disabled="isLoading">
						<VCol
							cols="12"
							class="py-0 pb-1"
							v-for="(item, index) in paginatedData"
							:key="item.enlace"
						>
							<VCard
								class="article-card elevation-0 border rounded no-truncate"
							>
								<VCardText class="d-flex align-center gap-2 px-1 py-1">
									<!-- Imagen -->
									<div class="img-content">
										<img
											v-if="item.picture"
											:src="replaceAmp(item.picture)"
											class="fixed-avatar rounded"
											alt="Article image"
										/>
										<VIcon v-else icon="tabler-news" size="40" />
									</div>

									<!-- Contenido -->
									<div class="article-content w-100">
										<!-- Fila 1: medio, fecha y categoría -->
										<div class="mb-0 grupoTopInfo">
											<div class="article-meta d-flex align-center gap-2 mb-0">
												<VChip
													variant="elevated"
													size="x-small"
													:color="item.color"
                          class="article-meta-v-chip"
												>
													{{ item.sitio }}
												</VChip>
												<span class="text-caption v2-home">{{
													formatDate(item.fechaPublicacion)
												}}</span>
												<VChip size="x-small" class="article-meta-v-chip">{{ item.vertical }}</VChip>
												<div class="autor-ec " title="Autor">
													<VIcon icon="tabler-user" size="15" />
													<small>{{ item.autor }}</small>
												</div>
												<div
													class="article-type-ec article-meta-v-chip"
													title="Tipo de artículo"
													v-if="!props.modoSimple"
												>
													<VIcon icon="tabler-article" size="15" />
													<small>{{ item.tipo }}</small>
												</div>
											</div>
											<div v-if="item.keywords && !props.modoSimple">
												<VChip
													style="cursor: pointer"
													@click="clickKeywordLocal(keyword)"
													v-for="(keyword, index) in item.keywords
														.split(',')
														.slice(0, 2)"
													:key="keyword"
													size="x-small"
													class="mr-2"
													variant="outlined"
													:color="item.color"
												>
													{{ keyword.trim() }}
												</VChip>

												<VMenu
													v-if="item.keywords.split(',').length > 2"
													class="bloqueToogle"
													:close-on-content-click="false"
												>
													<template v-slot:activator="{ props }">
														<VChip
															size="x-small"
															variant="outlined"
															:color="item.color"
															v-bind="props"
														>
															+{{ item.keywords.split(",").length - 2 }}
														</VChip>
													</template>
													<VList density="compact" class="pa-2">
														<template
															v-for="keyword in item.keywords
																.split(',')
																.slice(2)"
															:key="keyword"
														>
															<VChip
																style="cursor: pointer"
																@click="clickKeywordLocal(keyword)"
																size="x-small"
																variant="outlined"
																color="secondary"
																class="ma-1"
															>
																{{ keyword.trim() }}
															</VChip>
														</template>
													</VList>
												</VMenu>
											</div>
										</div>

										<!-- Fila 2: título y botón -->
										<div
											class="d-flex justify-space-between align-center gap-2"
										>
											<h4 class="article-title mb-0">{{ item.titulo }}</h4>
											<VBtn
												:href="item.enlace"
												target="_blank"
												variant="tonal"
												size="x-small"
												class="ml-2 flex-shrink-0 botoncito d-none"
											>
												<VIcon icon="tabler-external-link" size="16" />
												<label v-if="!props.modoSimple"> Ver artículo </label>
											</VBtn>
										</div>
									</div>
								</VCardText>
							</VCard>
						</VCol>
					</VRow>

					<VPagination
						class="mt-5"
						v-model="currentPage"
						:length="Math.ceil(filteredData.length / pageSize)"
						total-visible="5"
					/>
				</VCardText>
				<VCardText v-else>
					No existen datos que mostrar con el filtro seleccionado
				</VCardText>
			</VCard>
		</VCol>
	</VRow>
</template>
<style scoped>
.sectionprimicias .v-card-item {
	font-size: 24px;
}

.content-title {
	justify-content: space-between;
	align-items: center;
}

.v-menu .v-overlay__content > .v-card,
.v-menu .v-overlay__content > .v-sheet,
.v-menu .v-overlay__content > .v-list {
	max-width: 300px;
}

.board-content {
	height: auto;
}

/* Estilos para las cards de artículos */
.article-card {
	border: 1px solid #eee;
}

.v-theme--dark.article-card {
	border: 1px solid #5d5d5d69;
}

.article-card .v-card-text {
	padding: 8px 16px;
}

.img-content {
	min-width: 35px;
	width: 35px;
}

.fixed-avatar {
	width: 35px;
	height: 30px;
	object-fit: cover;
	object-position: center;
}

.article-content {
	min-width: 0;
}

.article-meta {
	font-size: 0.8rem;
}

.article-title {
	font-size: 0.6rem;
	line-height: 1.3;
	margin: 0;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

/* Estado deshabilitado */
.disabled-card {
	pointer-events: none;
	cursor: default;
	opacity: 0.6;
}

.bloqueToogle .v-theme--light .text-secondary {
	color: #2e2e2e !important;
}

.v-theme--light.v-menu .v-overlay__content > .v-card,
.v-theme--light.v-menu .v-overlay__content > .v-sheet,
.v-theme--light.v-menu .v-overlay__content > .v-list {
	margin-top: 10px;
	border: 1px solid #ddd;
}

.grupoTopInfo {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.article-meta-v-chip,
.v2-home.text-caption {
	font-size: calc(0.55rem - 8%) !important;
}

.autor-ec{
  font-size: calc(0.65rem - 8%) !important;
}

.v-chip.v-chip--size-x-small{
  --v-chip-height: 12px;
}

.v-card .v-card-text {
    line-height: 1;
}

@media (max-width: 991px) {
	.grupoTopInfo {
		flex-direction: column;
		align-items: flex-start;
	}
}

/* Ajustes responsivos */
@media (max-width: 600px) {
	.img-content {
		min-width: 25px;
		width: 25px;
	}

	.fixed-avatar {
		width: 30px;
		height: 30px;
	}

	.article-title {
		font-size: 0.7rem;
	}

	.article-card .v-card-text {
		padding: 8px;
	}

	.text-caption {
		font-size: 0.55rem !important;
	}

	.v-chip.v-chip--size-x-small {
		font-size: 0.55rem;
	}

	.botoncito {
		font-size: 0.5rem !important;
	}
}
</style>
