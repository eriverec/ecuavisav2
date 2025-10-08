<script setup>
import { logAction } from "@/middleware/activityLogger";
import { parseISO } from "date-fns";
import debounce from "lodash/debounce";
import { extendMoment } from "moment-range";
import Moment from "moment-timezone";
import esLocale from "moment/locale/es";

const moment = extendMoment(Moment);
moment.locale("es", [esLocale]);
moment.tz.setDefault("America/Guayaquil");

const tipoModel = ref("Por Fecha");
const tipoItems = ref(null);

// const limit = ref(10);
// const page = ref(1);
const totalRegistros = ref(0);
const totalPaginado = ref(0);
const dataParticipantes = ref([]);
const currentPage = ref(1);
const totalPage = ref(0);
const rowPerPage = ref(10);
const modelCurso = ref(null);
const dataCurso = ref("");
const dataCursoCopy = ref("");
const selectRefModulo = ref(null);
const cursoModelLoading = ref(true);
const searchCursoModel = ref("");
const isFullLoading = ref(false);

/*Variables de búsqueda*/
const modelSearch = ref(""); //
const btnDisabled = ref({
	loading: false,
	disabled: false,
});
/*Variables de búsqueda*/

/*VIDEOS*/
const searchVideoModel = ref(null);
const selectRefVideo = ref(null);
const videosModel = ref(null);
const videosModelLoading = ref(false);
const videosItems = ref([]);
const videosItemsCopy = ref([]);
/*VIDEOS*/

const loadingModulo = ref(false);
const fechaFin = moment().format("YYYY-MM-DD");
const fechaInicio = moment().subtract(7, "days").format("YYYY-MM-DD");

const fecha = ref({
	inicio: fechaInicio,
	fin: fechaFin,
});

const configSnackbar = ref({
	message: "Datos guardados",
	type: "success",
	model: false,
});

const urlApiExport = ref("");
const urlTitleExport = ref("usuarios_gamer");
const dominioPrincipal = "https://services.ecuavisa.com/sendpulse/logs/https/listar.php";
// const dominioPrincipal = "http://localhost/ecuavisa/ecuavisav2/servicios/sendpulse/logs/https/listar.php";

const headersGlobal = ref({
	ip: "ip",
	user_agent: "user_agent",
	action: "action",
	datetime: "datetime",
	file: "file",
	campaign: "campaign",
	campaign_title: "campaign_title",
	description: "description",
	send_method: "send_method",
	type: "type",
	cantidad_notas: "cantidad_notas",
});

const optionsDefaultDate = {
	fechasModel: [parseISO(fechaInicio), parseISO(fechaFin)],
	fechasVModel: [parseISO(fechaFin)],
	fechasVConfig: {
		position: "auto right",
		mode: "single",
		minDate: parseISO(fechaFin),
		altFormat: "d F j, Y",
		dateFormat: "l, j \\d\\e F \\d\\e Y",
		valueFormat: "d-m-Y",
		reactive: true,
	},
	fechai: fechaInicio,
	fechaV: fechaFin,
	fechaf: fechaFin,
};

const fechaIFModel = ref(optionsDefaultDate);

// 👉 watching current page

watch(currentPage, async () => {
	if (currentPage.value > totalPage.value) {
		currentPage.value = totalPage.value;
	}
	const type = modelFilterType.value == 'Todos los registros' ? '' : modelFilterType.value;
	await getLogs({
		page: currentPage.value,
		limit: rowPerPage.value,
		fechai: fecha.value.inicio,
		fechaf: fecha.value.fin,
		search: modelSearch.value,
		newsletter: modelFilterNewsletter.value == 'Todos los registros' ? '' : modelFilterNewsletter.value,
		type
	});
});

watch(rowPerPage, async () => {
	currentPage.value = 1;
	await getLogs({
		page: currentPage.value,
		limit: rowPerPage.value,
		fechai: fecha.value.inicio,
		fechaf: fecha.value.fin,
		search: modelSearch.value,
		newsletter: modelFilterNewsletter.value == 'Todos los registros' ? '' : modelFilterNewsletter.value,
		type: modelFilterType.value == 'Todos los registros' ? '' : modelFilterType.value,
	});
});

// 👉 Computing pagination data
const paginationData = computed(() => {
	const firstIndex = dataParticipantes.value.length
		? currentPage.value * rowPerPage.value
		: 0;
	const lastIndex =
		dataParticipantes.value.length + currentPage.value * rowPerPage.value;

	// return `Mostrando ${ firstIndex } de ${ lastIndex } de ${ totalRegistros.value } registros `
	// console.log(rowPerPage.value)
	if (totalRegistros.value < rowPerPage.value) {
		return `Mostrandos ${totalRegistros.value} de ${totalRegistros.value} registros `;
	}
	return `Mostrando ${firstIndex} de ${totalRegistros.value} registros `;
});

onMounted(async () => {
	// await getCursosAll();
	await getLogs({
		page: currentPage.value,
		limit: rowPerPage.value,
		fechai: fecha.value.inicio,
		fechaf: fecha.value.fin,
		search: modelSearch.value,
		estado: estadoModel.value,
	});
});

async function getLogs(json = {}) {
	let { page = 1, limit = 10, fechai = "", fechaf = "", search = "", newsletter = "", type = "" } = json;
	try {
		let estado = estadoModel.value;
		estado = estado === "Todos" ? "" : `&estado=${estado}`;
		loadingModulo.value = true;
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		var requestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		// var response = null;

		if (tipoModel.value == "Por Fecha") {
			urlApiExport.value = `${dominioPrincipal}?fechai=${fechai}&fechaf=${fechaf}&search=${search}${estado}&newsletter=${newsletter}&type=${type}`;
			urlTitleExport.value = "logs_por_fecha";
		} else {
			urlApiExport.value = `${dominioPrincipal}?fechai=&fechaf=&search=${search}${estado}&newsletter=${newsletter}&type=${type}`;
			urlTitleExport.value = "logs";
		}

		var response = await fetch(
			`${urlApiExport.value}&page=${page}&limit=${limit}`,
			requestOptions
		);
		const data = await response.json();

		dataParticipantes.value = data.data;
		totalRegistros.value = parseInt(data.total);
		totalPage.value = Math.ceil(parseInt(data.total) / parseInt(data.limit));
		return true;
	} catch (error) {
		configSnackbar.value = {
			message: "No se pudo recuperar los usuarios, recargue de nuevo.",
			type: "error",
			model: true,
		};
		return console.error(error.message);
	} finally {
		loadingModulo.value = false;
	}
}

const existeFecha = ref(true);

//Fechas
async function obtenerFechas(selectedDates, dateStr, instance) {
	if (selectedDates.length > 1) {
		videosModel.value = null;
		existeFecha.value = true;
		currentPage.value = 1;
		fechaIFModel.value.fechai = moment(selectedDates[0]).format("DD-MM-YYYY");
		fechaIFModel.value.fechaf = moment(selectedDates[1]).format("DD-MM-YYYY");
		fecha.value.inicio = moment(fechaIFModel.value.fechai, "DD-MM-YYYY").format(
			"YYYY-MM-DD"
		);
		fecha.value.fin = moment(fechaIFModel.value.fechaf, "DD-MM-YYYY").format(
			"YYYY-MM-DD"
		);
		await getLogs({
			page: currentPage.value,
			limit: rowPerPage.value,
			fechai: fecha.value.inicio,
			fechaf: fecha.value.fin,
			search: modelSearch.value,
		});
	}

	if (selectedDates.length == 2) {
		videosModel.value = null;
		fechaIFModel.value.fechasVConfig["minDate"] = selectedDates[1];
		fechaIFModel.value.fechasVModel = [selectedDates[1]];
		existeFecha.value = true;
	}

	if (selectedDates.length == 0) {
		existeFecha.value = false;
		await getLogs({
			page: currentPage.value,
			limit: rowPerPage.value,
			fechai: "",
			fechaf: "",
			search: modelSearch.value,
		});
	}
}

const docsExportNumberLength = ref({
	tamanioActual: 0,
	tamanioTotal: 0,
});

const usersFull = ref([]);

async function getLogsExportar(page = 1, limit = 10) {
	try {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		var requestOptions = {
			method: "GET",
			headers: myHeaders,
			redirect: "follow",
		};

		var response = await fetch(
			`${urlApiExport.value}&page=${page}&limit=${limit}`,
			requestOptions
		);

		const data = await response.json();

		return data;
	} catch (error) {
		configSnackbar.value = {
			message: "No se pudo recuperar los participantes, recargue de nuevo.",
			type: "error",
			model: true,
		};
		console.error(error.message);
		return null;
	}
}

function eliminarDuplicadosPorWylexId(array) {
	const vistos = new Set();
	return array.filter((item) => {
		if (vistos.has(item._id)) {
			return false; // Eliminar duplicado
		} else {
			vistos.add(item._id);
			return true; // Mantener el primer encuentro
		}
	});
}

async function fetchFullRegistros() {
	docsExportNumberLength.value = {
		tamanioActual: 0,
		tamanioTotal: 0,
	};

	usersFull.value = [];

	var pages = 1;
	while (true) {
		const res = await getLogsExportar(pages, 500);

		const array = res.data;
		const totalUser = res.total;

		array.forEach((item) => {
			let newItem = {};
			// Asignamos valores específicamente para cada cabecera
			let estadoText = estadoItems.value;

			newItem.ip = item.ip || "";
			newItem.user_agent = item.user_agent || "";
			newItem.action = (item.action == "view_campaign" ? "Vista previa" : item.action) || "";
			newItem.datetime = item.datetime || "";
			newItem.file = item.file || "";
			newItem.campaign = item.campaign || "";
			newItem.campaign_title = item.campaign_title || "";
			newItem.description = item.description || "";
			newItem.send_method = item.send_method || "";
			newItem.type = item.type || "";
			newItem.cantidad_notas = funcNotas(item.notas || []) || 0;
			usersFull.value.push(newItem);
		});

		docsExportNumberLength.value.tamanioActual = usersFull.value.length;
		docsExportNumberLength.value.tamanioTotal = totalUser;

		usersFull.value.sort((a, b) =>
			moment(b.created_at_campaign, "DD/MM/YYYY-HH:mm:ss").diff(
				moment(a.created_at_campaign, "DD/MM/YYYY-HH:mm:ss")
			)
		);

		pages++;

		if (array.length < 1) {
			break;
		}
	}

	return true;
}

function convertToCSV(objArray) {
	var array = typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
	var str = "";

	for (var i = 0; i < array.length; i++) {
		var line = "";
		for (var index in array[i]) {
			if (line != "") line += ",";

			// Escapamos comillas dobles y envolvemos el valor en comillas
			let value = array[i][index] !== null ? array[i][index].toString() : "";
			value = value.replace(/"/g, '""'); // Escapar comillas dobles
			line += `"${value}"`; // Envolver valor
		}
		str += line + "\r\n";
	}

	return str;
}

function exportCSVFile(headers, items, fileTitle) {
	if (headers && items[0]._id !== "_id") {
		items.unshift(headers);
	}

	// Convert Object to JSON
	var jsonObject = JSON.stringify(items);

	var csv = convertToCSV(jsonObject);

	var exportedFilenmae = fileTitle + ".csv" || "export.csv";

	var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
	if (navigator.msSaveBlob) {
		// IE 10+
		navigator.msSaveBlob(blob, exportedFilenmae);
	} else {
		var link = document.createElement("a");
		if (link.download !== undefined) {
			// feature detection
			// Browsers that support HTML5 download attribute
			var url = URL.createObjectURL(blob);
			link.setAttribute("href", url);
			link.setAttribute("download", exportedFilenmae);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
}

function generateSlug(text) {
	// Crear un mapa de caracteres con tilde y ñ a sus reemplazos
	const map = {
		á: "a",
		é: "e",
		í: "i",
		ó: "o",
		ú: "u",
		Á: "A",
		É: "E",
		Í: "I",
		Ó: "O",
		Ú: "U",
		ñ: "n",
		Ñ: "N",
	};

	// Reemplazar cada carácter del mapa en el texto
	const slug = text
		.split("")
		.map((char) => map[char] || char)
		.join("");

	// Convertir a minúsculas, eliminar caracteres no deseados y reemplazar espacios por guiones
	return (
		slug
			.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, "") // Eliminar caracteres que no sean letras, números, espacios o guiones
			.replace(/\s+/g, "-") // Reemplazar espacios por guiones
			.replace(/-+/g, "-") +
		"-" +
		moment().format("YYYY-MM-DD-HH-mm-ss")
	); // Reemplazar múltiples guiones por uno solo
}

async function downloadSearch() {
	try {
		if (dataParticipantes.value.length < 1) {
			configSnackbar.value = {
				message: "No hay datos que exportar.",
				type: "error",
				model: true,
			};
			return false;
		}
		// loadingModulo.value = true;
		isFullLoading.value = true;
		await fetchFullRegistros();
		isFullLoading.value = false;
		// loadingModulo.value = false;

		let doc = [];
		doc = usersFull.value;
		var title = `${urlTitleExport.value}`;

		logAction("descarga-completa-logs");

		exportCSVFile(headersGlobal.value, doc, title);
	} catch (error) {
		console.log(error);
		configSnackbar.value = {
			message:
				"No se pudo recuperar los datos recargue de nuevo {{downloadSearch}}.",
			type: "error",
			model: true,
		};
		isFullLoading.value = false;
		// loadingModulo.value = false;
		return false;
	}
}

watch(tipoModel, async () => {
	currentPage.value = 1;
	if (tipoModel.value) {
		await getLogs({
			page: currentPage.value,
			limit: rowPerPage.value,
			fechai: fecha.value.inicio,
			fechaf: fecha.value.fin,
			search: modelSearch.value,
		});
	}
});

/*video*/

/****************************************************************/
/****************************************************************/
// INICIO BUSCADOR
/****************************************************************/
/****************************************************************/

const searchQuery = ref("");

// Función para realizar la consulta
const buscarUsuarios = async () => {
	try {
		modelSearch.value = searchQuery.value?.toLowerCase();
		//disabledPagination.value = true;
		currentPage.value = 1;
		await getLogs({
			page: currentPage.value,
			limit: rowPerPage.value,
			fechai: fecha.value.inicio,
			fechaf: fecha.value.fin,
			search: modelSearch.value,
		});
		//disabledPagination.value = false;
	} catch (error) {
		console.error("Error en buscarUsuarios:", error);
		configSnackbar.value = {
			message: "No se pudo recuperar los datos recargue de nuevo.",
			type: "error",
			model: true,
		};
		return null;
	}
};

// Crear una función con debounce
const buscarUsuariosDebounced = debounce(buscarUsuarios, 500); // 500ms de retraso

/****************************************************************/
/****************************************************************/
// FIN BUSCADOR
/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/
// INICIO CÓDIGO DE ELIMINAR
/****************************************************************/
/****************************************************************/
const isDialogVisibleDelete = ref(false);
const idUserCampaign = ref(false);
const disabledViewList = ref(false);
const idUserListModel = ref({});
// Función para manejar el cambio de paginación
const eliminarRegistro = async (id) => {
	isDialogVisibleDelete.value = true;
	idUserCampaign.value = id;
	// console.log(id)
};

const eliminarRegistroSi = async () => {
	try {
		if (!idUserCampaign.value) {
			configSnackbar.value = {
				message: "Id no especificado para eliminar",
				type: "error",
				model: true,
			};
			return false;
		}
		disabledViewList.value = true;
		isFullLoading.value = true;
		idUserListModel.value[idUserCampaign.value] = true;
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		var requestOptions = {
			method: "DELETE",
			headers: myHeaders,
			redirect: "follow",
		};

		var response = await fetch(
			`${dominioPrincipal}/backoffice/delete-concurso/${idUserCampaign.value}`,
			requestOptions
		);
		const data = await response.json();

		if (data.resp) {
			currentPage.value = 1;
			await getLogs({
				page: currentPage.value,
				limit: rowPerPage.value,
				fechai: fecha.value.inicio,
				fechaf: fecha.value.fin,
				search: modelSearch.value,
			});
		} else {
			configSnackbar.value = {
				message: "No se pudo eliminar el registro, intente de nuevo",
				type: "error",
				model: true,
			};
		}

		idUserCampaign.value = null;
		isFullLoading.value = false;
		disabledViewList.value = false;
		idUserListModel.value[idUserCampaign.value] = false;
		isDialogVisibleDelete.value = false;
		return true;
	} catch (error) {
		configSnackbar.value = {
			message: "No se pudo eliminar el registro, intente de nuevo",
			type: "error",
			model: true,
		};

		isFullLoading.value = false;
		idUserListModel.value[idUserCampaign.value] = false;
		isDialogVisibleDelete.value = false;
		disabledViewList.value = false;

		return console.error(error.message);
	}
};

/****************************************************************/
/****************************************************************/
// FIN CÓDIGO DE ELIMINAR
/****************************************************************/
/****************************************************************/

/****************************************************************/
/****************************************************************/
// CÓDIGO PARA CAMBIAR EL ESTADO
/****************************************************************/
/****************************************************************/

const btnEstadoModel = ref([]);
const btnEstadoLoading = ref([]);
const btnEstadoDisabled = ref(false);

const actualizarEstado = async (id, status) => {
	try {
		const userBackoffice = JSON.parse(localStorage.getItem("userData"));
		if (!id) {
			configSnackbar.value = {
				message: "Id no especificado para eliminar",
				type: "error",
				model: true,
			};
			return false;
		}

		btnEstadoDisabled.value = true;
		btnEstadoLoading.value[id] = true;
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		const requestData = {
			status: status,
			user: userBackoffice.email || "",
		};

		var requestOptions = {
			method: "POST",
			headers: myHeaders,
			body: JSON.stringify(requestData),
			redirect: "follow",
		};

		var response = await fetch(
			`${dominioPrincipal}/backoffice/update-status-concurso/${id}`,
			requestOptions
		);
		const data = await response.json();

		if (data.resp) {
			currentPage.value = 1;
			await getLogs({
				page: currentPage.value,
				limit: rowPerPage.value,
				fechai: fecha.value.inicio,
				fechaf: fecha.value.fin,
				search: modelSearch.value,
			});
		} else {
			configSnackbar.value = {
				message: "No se pudo eliminar el registro, intente de nuevo",
				type: "error",
				model: true,
			};
		}

		btnEstadoDisabled.value = false;
		btnEstadoLoading.value[id] = false;
		return true;
	} catch (error) {
		configSnackbar.value = {
			message: "No se pudo eliminar el registro, intente de nuevo",
			type: "error",
			model: true,
		};

		btnEstadoDisabled.value = false;
		btnEstadoLoading.value[id] = false;

		return console.error(error.message);
	}
};

/****************************************************************/
/****************************************************************/
// FIN CÓDIGO PARA CAMBIAR EL ESTADO
/****************************************************************/
/****************************************************************/
const estadoModel = ref("Todos");
const estadoItems = ref([
	{ title: "Todos", value: "Todos" },
	{ title: "No revisado", value: "0" },
	{ title: "Revisado, aprobado", value: "1" },
	{ title: "Rechazado", value: "2" },
]);
watch(estadoModel, async () => {
	currentPage.value = 1;
	if (estadoModel.value) {
		await getLogs({
			page: currentPage.value,
			limit: rowPerPage.value,
			fechai: fecha.value.inicio,
			fechaf: fecha.value.fin,
			search: modelSearch.value,
		});
	}
});


// Filtros extras

const modelFilterNewsletter = ref('Todos los registros');
watch(modelFilterNewsletter, async () => {
	currentPage.value = 1;
	if (modelFilterNewsletter.value) {
		await getLogs({
			page: currentPage.value,
			limit: rowPerPage.value,
			fechai: fecha.value.inicio,
			fechaf: fecha.value.fin,
			newsletter: modelFilterNewsletter.value == 'Todos los registros' ? '' : modelFilterNewsletter.value,
			type: modelFilterType.value == 'Todos los registros' ? '' : modelFilterType.value,
			search: modelSearch.value,
		});
	}
});

const modelFilterType = ref('Todos los registros');
watch(modelFilterType, async () => {
	currentPage.value = 1;
	if (modelFilterType.value) {
		await getLogs({
			page: currentPage.value,
			limit: rowPerPage.value,
			fechai: fecha.value.inicio,
			fechaf: fecha.value.fin,
			search: modelSearch.value,
			newsletter: modelFilterNewsletter.value == 'Todos los registros' ? '' : modelFilterNewsletter.value,
			type: modelFilterType.value == 'Todos los registros' ? '' : modelFilterType.value,
		});
	}
});

// Funciones extras
const funcNotas = (notas) => {
	try {
		const notasArray = Array.isArray(notas) ? notas : Object.values(notas);
		const total = notasArray.reduce((acc, nota) => {
			return acc + nota.length;
		}, 0);
		return total;
	} catch (error) {
		return 0;
	}
}

//Modal

const isDialogVisibleNotas = ref({
	modal: false,
	data: [],
});

const onClickNotas = (notas) => {
    try {
        const notasArray = Array.isArray(notas) ? notas : Object.values(notas);

        // total sumando la longitud de cada sub-array
        const total = notasArray.reduce((acc, nota) => {
            return acc + nota.length;
        }, 0);

        // Aquí aplano para que listado sea solo un array plano con todos los objetos
        const listado = notasArray.flat();

        isDialogVisibleNotas.value.modal = true;
        isDialogVisibleNotas.value.data = listado;

        return {
            total,
            listado
        };
    } catch (error) {
        return {
            total: 0,
            listado: []
        };
    } finally {
        isDialogVisibleNotas.value.modal = true;
    }
};

const cortarStringConEtiquetas = (string, numPalabras) => {
  let palabrasContadas = 0;
  let resultado = '';
  let dentroEtiqueta = false;
  let palabraActual = '';

  for (let i = 0; i < string.length; i++) {
    const char = string[i];

    if (char === '<') {
      dentroEtiqueta = true;
    }

    if (dentroEtiqueta) {
      // Añadimos el caracter a resultado directamente
      resultado += char;
      if (char === '>') {
        dentroEtiqueta = false;
        palabraActual = ''; // reiniciamos palabra actual al salir de etiqueta
      }
    } else {
      // Estamos fuera de etiqueta: construir palabra
      if (char === ' ' || char === '\n' || char === '\t') {
        // Espacio: palabra terminada
        if (palabraActual.length > 0) {
          palabrasContadas++;
          if (palabrasContadas > numPalabras) break;
          resultado += palabraActual + char;
          palabraActual = '';
        } else {
          // Espacios múltiples consecutivos, agregarlos
          resultado += char;
        }
      } else {
        // Construyendo palabra
        palabraActual += char;
      }
    }
  }

  // Si terminó el string o se rompió por límite, añadir palabra actual si cabe
  if (palabrasContadas < numPalabras && palabraActual.length > 0) {
    palabrasContadas++;
    if (palabrasContadas <= numPalabras) resultado += palabraActual;
  }

  return resultado.trim();
};




</script>

<template>
	<section>
		<VDialog
			v-model="isDialogVisibleNotas.modal"
			scrollable
			max-width="650"
		>

		<!-- Dialog close btn -->
		<DialogCloseBtn @click="isDialogVisibleNotas.modal = !isDialogVisibleNotas.modal" />

		<!-- Dialog Content -->
		<VCard>
			<VCardItem >
				<div class="d-flex content-title flex-wrap">
					<h2 class="mb-3 d-flex flex-wrap gap-2 text-black">
						Notas recuperadas
					</h2>
				</div>
			</VCardItem>
			<VCardText>
			<div class="d-flex flex-column mb-3" style="line-height: 1.3;max-height: 550px;">
				<VRow>
					<VCol cols="12" md="12" lg="12" v-for="item in isDialogVisibleNotas.data" :key="item">
						<VCard class="d-flex flex-row border" outlined elevation="0">
							
							<!-- Imagen -->
							<VImg
								:src="item?.image"
								width="75"
								class="rounded-l-lg notas-col-1"
								cover
								style="width: 20px"
							></VImg>

							<!-- Contenido -->
							<VCardText class="flex-grow-1 pa-2 pl-4 notas-col-2">
								<h4 class="mb-1" style="line-height: 1.2;">
									{{ item?.titulo }}
								</h4>
								<div class="text-muted mb-1" style="font-size: 12px;" v-html="cortarStringConEtiquetas(item?.descripcion, 20)"></div>
								<VBtn
									variant="tonal"
									color="primary"
									:href="item?.link"
									target="_blank"
									size="small"
								>
									Ir a la nota
									<VIcon icon="tabler-arrow-right" />
								</VBtn>
							</VCardText>
						</VCard>
					</VCol>
				</VRow>
			</div>
			
			</VCardText>

			<VCardText class="py-4">
				<VBtn class="my-4" @click="isDialogVisibleNotas.modal = false">
					Cerrar modal
				</VBtn>
			</VCardText>
		</VCard>
		</VDialog>
		<VDialog v-model="isDialogVisibleDelete" persistent class="v-dialog-sm">
			<!-- Dialog close btn -->
			<DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

			<!-- Dialog Content -->
			<VCard title="Eliminar registro">
				<VCardText> ¿Desea eliminar el registro? </VCardText>

				<VCardText class="d-flex justify-end gap-3 flex-wrap">
					<VBtn
						color="secondary"
						variant="tonal"
						@click="isDialogVisibleDelete = false"
					>
						No, Cerrar
					</VBtn>
					<VBtn
						@click="eliminarRegistroSi"
						:loading="disabledViewList"
						:disabled="disabledViewList"
					>
						Si, eliminar
					</VBtn>
				</VCardText>
			</VCard>
		</VDialog>
		<VSnackbar
			v-model="configSnackbar.model"
			location="top end"
			variant="flat"
			:timeout="configSnackbar.timeout || 2000"
			:color="configSnackbar.type"
		>
			{{ configSnackbar.message }}
		</VSnackbar>
		<VRow>
			<VCol cols="12" sm="12" lg="12">
				<h1>Panel de Monitoreo de Newsletters</h1>
				<!-- <small class="mb-4 d-block">
          "Formulario de registro Juegos"
        </small> -->
				<VCardText
					class="d-flex py-4 gap-4 px-0 flex-wrap"
					style="align-items: flex-start"
				>
					<div
						:class="
							'me-3 d-flex gap-4 flex-wrap' + (isFullLoading ? ' disabled' : '')
						"
					>
						<VSelect
							:disabled="loadingModulo"
							class="bg-white"
							v-model="rowPerPage"
							density="compact"
							variant="outlined"
							:items="[10, 20, 30, 50]"
						/>

						<VSelect
							:disabled="loadingModulo"
							label="Mostrar"
							item-text="title"
							style="min-width: 9rem"
							item-value="value"
							class="bg-white"
							density="compact"
							v-model="tipoModel"
							variant="outlined"
							:items="['Todos los registros', 'Por Fecha']"
						/>

						<AppDateTimePicker
							v-if="tipoModel == 'Por Fecha' && !loadingModulo"
							clearable
							class="bg-white"
							style="width: 19rem"
							label="Buscar por fecha de registro"
							prepend-inner-icon="tabler-calendar"
							density="compact"
							v-model="fechaIFModel.fechasModel"
							show-current="true"
							@on-change="obtenerFechas"
							:config="{
								position: 'auto right',
								mode: 'range',
								altFormat: 'd F j, Y',
								maxDate: new Date(),
								dateFormat: 'l, j \\d\\e F \\d\\e Y',
								valueFormat: 'd-m-Y',
								reactive: true,
							}"
						/>

						<VSelect
							:disabled="loadingModulo"
							label="Buscar por revisón"
							item-text="title"
							style="min-width: 9rem"
							item-value="value"
							class="bg-white d-none"
							density="compact"
							v-model="estadoModel"
							variant="outlined"
							:items="estadoItems"
						/>

						<VTextField
							clearable
							title="Buscar por registros"
							:disabled="loadingModulo"
							class="bg-white"
							v-model="searchQuery"
							label="Buscar por registros"
							prepend-inner-icon="mdi-magnify"
							single-line
							hide-details
							@input="buscarUsuariosDebounced"
							@click:clear="buscarUsuariosDebounced"
							style="min-width: 16rem"
						/>
					</div>

					<div
						:class="
							'me-3 d-flex gap-4 flex-wrap' + (isFullLoading ? ' disabled' : '')
						"
					>
						<VSelect
							:disabled="loadingModulo"
							class="bg-white"
							v-model="modelFilterNewsletter"
							density="compact"
							variant="outlined"
							label="Filtrar por newsletter"
							:items="['Todos los registros', 'boletin-opinion.json', 'boletin-estadio.json', 'boletin-ultimahora.json', 'boletin-entretenimiento.json', 'boletin-diario-5pm.json', 'boletin-diario.json']"
						/>

						<VSelect
							:disabled="loadingModulo"
							label="Tipo de respuesta"
							item-text="title"
							style="min-width: 9rem"
							item-value="value"
							class="bg-white"
							density="compact"
							v-model="modelFilterType"
							variant="outlined"
							:items="['Todos los registros', 'success', 'error']"
						/>

					</div>

					<VSpacer />

					<div
						class="app-user-search-filter d-flex align-top justify-content-flex-end flex-wrap flex-column gap-0"
					>
						<!-- 👉 Search  -->

						<!-- 👉 Export button -->
						<VBtn
							title="Exportar registros según los filtros aplicados"
							:loading="isFullLoading"
							:disabled="isFullLoading || loadingModulo"
							variant="tonal"
							color="success"
							prepend-icon="tabler-screen-share"
							@click="downloadSearch"
						>
							<span style="cursor: pointer" class="px-0 py-p m-0"
								>Exportar</span
							>
						</VBtn>
						<small class="px-0 py-1 text-disabled" v-if="isFullLoading">
							Exportando {{ docsExportNumberLength.tamanioActual }} /
							{{ docsExportNumberLength.tamanioTotal }}
							registros
						</small>
					</div>
				</VCardText>

				<!-- 👉 Add user button -->

				<small v-if="tipoModel == 'Por Fecha'" class="text-disabled"
					>Se ha filtrado
					<b>{{
						modelCurso
							? dataCurso.length > 0
								? dataCurso.filter((c) => modelCurso.includes(c.value))[0].title
								: ""
							: ""
					}}</b>
					, desde {{ fechaIFModel.fechai }} hasta {{ fechaIFModel.fechaf }} con
					un total de {{ totalRegistros }}
					registros
				</small>

				<VCard class="mt-1">
					<VTable class="text-no-wrap">
						<!-- 👉 table head -->
						<thead>
							<tr>
								<!-- <th scope="col" title="Nombre de la unidad educativa">
                  <div class="d-flex flex-column">
                    Documentación revisada
                    <div class="d-flex" style="align-items: center;">
                      <VIcon icon="tabler-click" color="disabled" size="15" />
                      <small class="text-disabled" style="line-height: 1;">Click para cambiar el estado</small>
                    </div>
                  </div>
                </th> -->
								<th scope="col">Respuesta</th>
								<th scope="col">Fecha del registro</th>
								<th scope="col" title="Nombres">Acción</th>
								<!-- <th scope="col" title="Apellidos">IP</th> -->
								<th scope="col" title="Edad">Newsletter</th>
								<th scope="col" title="E-mail de contacto">
									Nombre de la campaña
								</th>
								<th scope="col" title="E-mail de contacto">
								Cantidad de notas
								</th>
								<!-- <th scope="col" title="Link del DEMO(YouTube)">
                  Link del DEMO(YouTube)
                </th> -->
								<th scope="col">Método de envío</th>
							</tr>
						</thead>
						<!-- 👉 table body -->
						<tbody v-if="loadingModulo == false">
							<tr
								v-for="registro in dataParticipantes"
								:key="registro._id"
								style="height: 3.75rem"
							>
								<td>
									<VChip
										:color="registro?.type == 'success' ? 'success' : 'error'"
										:icon="
											registro?.type == 'success' ? 'tabler-check' : 'tabler-x'
										"
										class="text-base"
									>
										{{ registro?.type }}
									</VChip>
									<VTooltip
										activator="parent"
										v-if="registro?.type != 'success'"
									>
										<template #activator="{ props }">
											<VBtn
												v-bind="props"
												icon
												color="error"
												size="x-small"
												class="mr-0"
												variant="text"
											>
												<VIcon size="22" icon="tabler-info-circle" />
											</VBtn>
										</template>
										<span>{{ registro?.description }}</span>
									</VTooltip>
								</td>
								<td>
									<span class="text-base">{{ registro.datetime }}</span>
								</td>

								<td>
                  
									<VTooltip
										activator="parent"
										v-if="registro?.type != 'success'"
									>
										<template #activator="{ props }">
											<VBtn
												v-bind="props"
												icon
												color="info"
												size="x-small"
												class="mr-0"
												variant="text"
											>
												<VIcon size="22" icon="tabler-info-circle" />
											</VBtn>
										</template>
										<div v-html="registro?.description"></div>
									</VTooltip>
									<span class="text-base">{{ registro?.action == "view_campaign" ? "Vista previa" : registro?.action }}</span>
								</td>

								<!-- <td>
									<span class="text-base">{{ registro?.ip }}</span>
								</td> -->

								<td>
									<span class="text-base">{{ registro?.campaign }}</span>
								</td>

								<td>
									<span class="text-base">{{ registro?.campaign_title }}</span>
								</td>

								<td>
									<span class="text-base">
										{{ funcNotas(registro?.notas) }}
										<VBtn
											title="Ver notas"
											:loading="isFullLoading"
											:disabled="isFullLoading || loadingModulo"
											variant="tonal"
											color="success"
											icon="tabler-info-circle"
											size="small"
											@click="onClickNotas(registro?.notas)"
										/>
									</span>
								</td>

								<td>
									<span class="text-base">{{ registro?.send_method }}</span>
								</td>
							</tr>
						</tbody>

						<!-- 👉 table footer  -->
						<tfoot v-show="!dataParticipantes.length && loadingModulo == false">
							<tr>
								<td colspan="9" class="text-center">
									No hay datos que mostrar
								</td>
							</tr>
						</tfoot>

						<tfoot v-show="loadingModulo">
							<tr>
								<td colspan="9" class="text-center">
									Cargando datos, por favor espere un momento...
								</td>
							</tr>
						</tfoot>
					</VTable>
					<VDivider />

					<VCardText
						class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"
					>
						<span class="text-sm text-disabled">
							{{ paginationData }}
						</span>

						<VPagination
							v-model="currentPage"
							size="small"
							:total-visible="5"
							:length="totalPage"
						/>
					</VCardText>
				</VCard>
			</VCol>
		</VRow>
	</section>
</template>
<style lang="scss">
// .app-user-search-filter {
//   inline-size: 31.6rem;
// }

.text-capitalize {
	text-transform: capitalize;
}

.user-list-name:not(:hover) {
	color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.bg-white .v-field {
	background-color: rgb(var(--v-theme-surface));
	border-radius: 6px;
}

.justify-content-flex-end {
	justify-content: flex-end;
}

.notas-col-2 {
	max-width: 400px;
}

.notas-col-1{
	max-width:100%
}
</style>
