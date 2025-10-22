<script setup>
import { onMounted } from "vue";
import { FormWizard, TabContent } from "vue3-form-wizard";
import GruposC from "@/pages/apps/grupos/index.vue";
import CaracteristicasC from "@/pages/apps/caracteristicas/index.vue";
import "vue3-form-wizard/dist/style.css";

const dataPaquetes = ref([]);
const dataCaracteristicas = ref([]);
const isLoading = ref(false);
const dataGrupos = ref([]);
const gruposItems = ref([]);
const sitiosItems = ref([]);
const sitiosRaw = ref([]);
const urlRaw = ref(null);
// dom prueba
// const urlDom = "https://ecuavisa-suscripciones.vercel.app";
const urlDom = "http://localhost:8080";

// Campo switch para verificar Si es VOD o no
const esVODSwitch = ref(false);

// Items del VOD
const vodItems = ref([]);

async function getPaquetes() {
	try {
		isLoading.value = true;
		const consulta = await fetch(urlDom + "/paquete");
		const consultaJson = await consulta.json();
		dataPaquetes.value = consultaJson.data;
		isLoading.value = false;
	} catch (error) {
		console.error(error.message);
	}
}

async function getCaracteristicas() {
	try {
		const consulta = await fetch(urlDom + "/caracteristica");
		const consultaJson = await consulta.json();
		dataCaracteristicas.value = consultaJson.data;
	} catch (error) {
		console.error(error.message);
	}
}

async function getGrupos() {
	try {
		const consulta = await fetch(urlDom + "/grupo");
		const consultaJson = await consulta.json();
		dataGrupos.value = consultaJson.data;

		let grupos = [];
		for (let grupo of consultaJson.data) {
			let item = {
				title: grupo.nombre,
				value: grupo._id,
			};
			grupos.push(item);
		}
		grupos.push({
			title: "Sin grupo",
			value: "no aplica",
		});
		gruposItems.value = grupos;

		//console.log('.value',gruposItems.value);
	} catch (error) {
		console.error(error.message);
	}
}

async function getSitios() {
	try {
		const consulta = await fetch(urlDom + "/sitio/all");
		const consultaJson = await consulta.json();
		sitiosRaw.value = consultaJson.data;

		let sitios = [];
		for (let sitio of consultaJson.data) {
			let item = {
				title: sitio.nombre,
				value: sitio._id,
			};
			sitios.push(item);
		}
		sitiosItems.value = sitios;
	} catch (error) {
		console.error(error.message);
	}
}

onMounted(async () => {
	await getPaquetes();
	await getSitios();
});

const itemsPerPage = 8;
const currentPage = ref(1);

const paginatedPaquetes = computed(() => {
	const start = (currentPage.value - 1) * itemsPerPage;
	const end = start + itemsPerPage;

	return dataPaquetes.value.slice(start, end);
});

const nextPage = () => {
	if (currentPage.value * itemsPerPage < dataPaquetes.value.length)
		currentPage.value++;
};

const prevPage = () => {
	if (currentPage.value > 1) currentPage.value--;
};

// ------------------------------ITEMS----------------------------------------------
const destaqueItems = ["No aplica", "Recomendado", "Mejor precio", "Oferta"];

const periodicidadItems = [
	"No aplica",
	"Diaria",
	"Mensual",
	"Bimestral",
	"Trimestral",
	"Cuatrimestral",
	"5 Meses",
	"Semestral",
	"8 Meses",
	"Anual",
	"18 Meses",
	"Bianual",
];

const tipoPagoItems = [
	{
		title: "Pago único",
		value: "pago unico",
	},
	{
		title: "Recursivo",
		value: "Recursivo",
	},
];

const visibilidadItems = ["Visible", "Oculto"];

const cambioPlanItems = [
	{
		title: "Bloquear cambio de plan",
		value: "bloquear",
	},
	{
		title: "Permitir cambio de plan",
		value: "permitir",
	},
];

const paqueteInternacionalItems = [
	{
		title: "Si",
		value: true,
	},
	{
		title: "No",
		value: false,
	},
];

const paqueteCortesiaItems = [
	{
		title: "Si",
		value: true,
	},
	{
		title: "No",
		value: false,
	},
];

const direccionCompraItems = [
	{
		title: "Solicitar dirección completa",
		value: "completa",
	},
	{
		title: "Solicitar solamente localidad",
		value: "local",
	},
	{
		title: "No solicitar",
		value: "no solicitar",
	},
];
// -------------------------------ACCIONES------------------------------------------
const isDialogActive = ref(false);
const accionForm = ref("");
//-----DATOS FORM----
const nombre = ref("");
const codigoInterno = ref("");
const tipoPago = ref("");
const precio = ref(0);
const periodicidad = ref("");
const ciclosPromocion = ref(0);
const precioPromocional = ref(0);
const descripcionPrecios = ref("");
const grupo = ref("no aplica");
const sitio = ref("");
const activoDesde = ref("");
const activoHasta = ref("");
const color = ref("");
const destaque = ref("No aplica");
const clasesCss = ref("");

const url_imagen = ref("");
const visibilidad = ref("");
const cambioPlan = ref("");
const paqueteCortesia = ref(false);
const paqueteInternacional = ref(false);
const direccionCompra = ref("");
const descripcionCustom = ref("");
//const caracteristicas = ref([]);

const caracteristicasSelected = ref([]);

const configSnackbar = ref({
	message: "Datos guardados",
	type: "success",
	model: false,
});
const loadingWizard = ref(false);

const caracteristicasItems = ref([]);
//------FUNCIONES

function resolveSitio(id) {
	let sitioMap = sitiosRaw.value.find((item) => item._id == id);
	return sitioMap;
}

function resolveCaracteristicasItems() {
	let caracteristicasRaw = Array.from(dataCaracteristicas.value);
	let items = [];
	for (const item of caracteristicasRaw) {
		let data = {
			title: item.nombre,
			value: item._id,
		};
		items.push(data);
	}
	caracteristicasItems.value = items;
}

function resetForm() {
	nombre.value = "";
	codigoInterno.value = "";
	tipoPago.value = "";
	precio.value = null;
	periodicidad.value = "";
	ciclosPromocion.value = null;
	precioPromocional.value = null;
	descripcionPrecios.value = "";
	grupo.value = "no aplica";
	sitio.value = "";
	activoDesde.value = "";
	activoHasta.value = "";
	color.value = "";
	destaque.value = "No aplica";
	clasesCss.value = "";
	caracteristicasSelected.value = [];

	url_imagen.value = "";
	urlRaw.value = "";
	visibilidad.value = "Visible";
	cambioPlan.value = "bloquear";
	paqueteCortesia.value = false;
	paqueteInternacional.value = "No";
	direccionCompra.value = "no solicitar";
	descripcionCustom.value = "";
	esVODSwitch.value = false;
	vodModel.value = null;
}

async function handleValidation(isValid, tabIndex) {
	if (
		tabIndex == 0 &&
		isValid == true &&
		caracteristicasItems.value.length < 1
	) {
		if (dataCaracteristicas.value.length < 1) {
			await getCaracteristicas();
		}
		resolveCaracteristicasItems();
	}
	//console.log('Tab: '+tabIndex+ ' valid: '+isValid)
	return false;
}

async function handleValidationChange(prevIndex, nextIndex) {
	// console.log('prevIndex: '+prevIndex+ ' nextIndex: '+nextIndex)
	return false;
}

async function setLoading(value) {
	loadingWizard.value = value;
}

async function validateAsync() {
	let nombreValid = nombre.value;
	var codigoInternoValid = codigoInterno.value;

	if (!nombreValid || nombreValid == "") {
		configSnackbar.value = {
			message: "Debe añadir un nombre",
			type: "error",
			model: true,
		};
		return false;
	}

	if (!codigoInternoValid || codigoInternoValid == "") {
		configSnackbar.value = {
			message: "Debe añadir un código interno",
			type: "error",
			model: true,
		};
		return false;
	}

	if (!vodModel.value && esVODSwitch.value) {
		configSnackbar.value = {
			message: "Debe seleccionar un paquete VOD",
			type: "error",
			model: true,
		};
		return false;
	}

	return true;
}

function closeDiag() {
	resetForm();
	isDialogActive.value = false;
}
// ----------ADD-------------
async function onAddPaquete() {
	resetForm();
	accionForm.value = "add";
	await getCaracteristicas();
	await getGrupos();
	isDialogActive.value = true;
}

// ----------EDIT-------------
const idToEdit = ref("");

async function onEditPaquete(id) {
	resetForm();
	accionForm.value = "edit";
	await getCaracteristicas();
	await getGrupos();
	const consulta = await fetch(urlDom + "/paquete/" + id);
	const consultaJson = await consulta.json();
	const paquete = consultaJson.data;
	//console.log(paquete);
	idToEdit.value = paquete._id;
	nombre.value = paquete.nombre;
	codigoInterno.value = paquete.codigoInterno;
	tipoPago.value = paquete.tipoPago;
	precio.value = paquete.precio;
	periodicidad.value = paquete.periodicidad;
	ciclosPromocion.value = paquete.ciclosPromocion;
	precioPromocional.value = paquete.precioPromocional;
	descripcionPrecios.value = paquete.descripcionPrecios;
	grupo.value = paquete.grupo;
	sitio.value = paquete.sitio._id;
	activoDesde.value = paquete.activoDesde;
	activoHasta.value = paquete.activoHasta;
	color.value = paquete.color;
	destaque.value = paquete.destaque;
	clasesCss.value = paquete.clasesCss;
	caracteristicasSelected.value = paquete.caracteristicas;

	url_imagen.value = paquete.url_imagen;
	urlRaw.value = paquete.url;
	visibilidad.value = paquete.visibilidad;
	cambioPlan.value = paquete.cambioPlan;
	paqueteCortesia.value = paquete.paqueteCortesia;
	paqueteInternacional.value = paquete.paqueteInternacional;
	direccionCompra.value = paquete.direccionCompra;
	descripcionCustom.value = paquete.descripcionCustom;

	
	esVODSwitch.value = paquete.is_vod == "1";
	vodModel.value = vodItems.value.find(item => item.value == paquete.id_vod_catalogo);

	isDialogActive.value = true;
}

// ------------SEND--------------
async function onComplete() {
	try {
		var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");

		if (accionForm.value === "add") {
			const { value:id_vod_catalogo = '' } = vodModel.value ?? {};
			let jsonEnviar = {
				nombre: nombre.value,
				codigoInterno: codigoInterno.value,
				tipoPago: tipoPago.value,
				precio: precio.value,
				periodicidad: periodicidad.value,
				ciclosPromocion: ciclosPromocion.value,
				precioPromocional: precioPromocional.value,
				descripcionPrecios: descripcionPrecios.value,
				grupo: grupo.value,
				sitio: resolveSitio(sitio.value),
				activoDesde: activoDesde.value,
				activoHasta: activoHasta.value,
				color: color.value,
				destaque: destaque.value,
				clasesCss: clasesCss.value,
				caracteristicas: caracteristicasSelected.value,
				url_imagen: url_imagen.value,
				url: urlRaw.value,
				visibilidad: visibilidad.value,
				cambioPlan: cambioPlan.value,
				paqueteCortesia: paqueteCortesia.value,
				paqueteInternacional: paqueteInternacional.value,
				direccionCompra: direccionCompra.value,
				descripcionCustom: descripcionCustom.value,
				is_vod: esVODSwitch.value ? '1' : '0',
				id_vod_catalogo: id_vod_catalogo
			};

			var raw = JSON.stringify(jsonEnviar);
			//console.log('jsonEnviar ', jsonEnviar);
			var requestOptions = {
				method: "POST",
				headers: myHeaders,
				body: raw,
				redirect: "follow",
			};
			const send = await fetch(urlDom + "/paquete", requestOptions);
			const respuesta = await send.json();
			if (respuesta.resp) {
				configSnackbar.value = {
					message: "Paquete creado correctamente",
					type: "success",
					model: true,
				};
			} else {
				configSnackbar.value = {
					message: respuesta.mensaje,
					type: "error",
					model: true,
				};
			}
		} else if (accionForm.value === "edit") {
			const { value:id_vod_catalogo = '' } = vodModel.value ?? {};
			let jsonEnviar = {
				id: idToEdit.value,
				nombre: nombre.value,
				codigoInterno: codigoInterno.value,
				tipoPago: tipoPago.value,
				precio: precio.value,
				periodicidad: periodicidad.value,
				ciclosPromocion: ciclosPromocion.value,
				precioPromocional: precioPromocional.value,
				descripcionPrecios: descripcionPrecios.value,
				grupo: grupo.value,
				sitio: resolveSitio(sitio.value),
				activoDesde: activoDesde.value,
				activoHasta: activoHasta.value,
				color: color.value,
				destaque: destaque.value,
				clasesCss: clasesCss.value,
				caracteristicas: caracteristicasSelected.value,
				url_imagen: url_imagen.value,
				url: urlRaw.value,
				visibilidad: visibilidad.value,
				cambioPlan: cambioPlan.value,
				paqueteCortesia: paqueteCortesia.value,
				paqueteInternacional: paqueteInternacional.value,
				direccionCompra: direccionCompra.value,
				descripcionCustom: descripcionCustom.value,
				is_vod: esVODSwitch.value ? '1' : '0',
				id_vod_catalogo: id_vod_catalogo
			};

			var raw = JSON.stringify(jsonEnviar);

			var requestOptions = {
				method: "PUT",
				headers: myHeaders,
				body: raw,
				redirect: "follow",
			};
			const send = await fetch(urlDom + "/paquete", requestOptions);
			const respuesta = await send.json();
			if (respuesta.resp) {
				configSnackbar.value = {
					message: "Paquete editado correctamente",
					type: "success",
					model: true,
				};
			} else {
				configSnackbar.value = {
					message: respuesta.mensaje,
					type: "error",
					model: true,
				};
			}
		}
		await getPaquetes();
		isDialogActive.value = false;
	} catch (error) {
		console.error(error.message);
	}
}

// -------------------------------DELETE-----------------------------------//
const isDialogVisibleDelete = ref(false);
const idToDelete = ref("");

function onDelete(id) {
	isDialogVisibleDelete.value = true;
	idToDelete.value = id;
}

async function deletePaquete() {
	var requestOptions = {
		method: "DELETE",
		redirect: "follow",
	};

	const deleted = await fetch(
		urlDom + "/paquete/" + idToDelete.value,
		requestOptions
	);
	const respuesta = await deleted.json();
	if (respuesta.resp) {
		configSnackbar.value = {
			message: "Paquete eliminado correctamente",
			type: "success",
			model: true,
		};
	} else {
		configSnackbar.value = {
			message: respuesta.mensaje,
			type: "error",
			model: true,
		};
	}
	await getPaquetes();
	isDialogVisibleDelete.value = false;
}

// Configuracion de tabs
const currentTabPaquete = ref(0);

// VOD
const loadingComponent = ref(false);
const vodModel = ref(null);

async function getVODs() {
    try {
        const consulta = await fetch(`https://vod-api.vercel.app/backoffice/catalogo`);

		if (!consulta.ok) {
			throw new Error("Error al obtener los VODs");
		}

        const consultaJson = await consulta.json();
		const { data: { catalogo = [], resp= false } } = consultaJson;
        vodItems.value = catalogo.map(item => ({
			title: `(${item.id}) - ${item.titulo}`,
			value: item.id,
		})) ?? [];
    } catch (error) {
        console.error(error.message);
		vodItems.value = [];
    }
}

async function validarVODs(idpaquete = '') {
    try {
		const isEdit = accionForm.value === "edit";
		const idEdit = isEdit ? idToEdit.value ?? '' : '';
		if(!idpaquete){
			throw new Error("Se necesita un idpaquete");
		}

        const consulta = await fetch(`${urlDom}/backoffice/existe-id-vod/${idpaquete}?idEdit=${idEdit}`);

		if (!consulta.ok) {
			throw new Error("Error al obtener los VODs");
		}

        const consultaJson = await consulta.json();
		return consultaJson ?? null;
    } catch (error) {
        console.error(error.message);
		return null;
    }
}

watch(vodModel, async (newValue) => {
	if(loadingComponent.value && newValue){
		const { value:idPaquete = '' } = newValue ?? {};
		const respValidarIdPaquete = await validarVODs(idPaquete);
		if(respValidarIdPaquete){
			const { data = {} , resp = true} = respValidarIdPaquete;
			if(resp){
				configSnackbar.value = {
					message: "El id del paquete ya está vinculado en otro paquete, "+ data?.nombre,
					type: "error",
					model: true,
				};
				vodModel.value = null;
			}
		}
	}
});

onMounted(async () => {
    await getVODs();
	await new Promise(resolve => setTimeout(resolve, 2000));
	loadingComponent.value = true;
});
</script>

<template>
	<section>
		<VSnackbar
			v-model="configSnackbar.model"
			location="top end"
			variant="flat"
			:color="configSnackbar.type"
		>
			{{ configSnackbar.message }}
		</VSnackbar>
		
		<VTabs
			v-model="currentTabPaquete"
			class="v-tabs-pill"
		>
			<VTab>Paquetes</VTab>
			<VTab>Grupos</VTab>
			<VTab>Características</VTab>
		</VTabs>
		<VWindow v-model="currentTabPaquete" class="mt-5">
			<VWindowItem :key="0">
				<VRow>
					<VCol cols="12" sm="12" lg="12">
						<VCard>
							<VCardTitle class="pt-4 pl-6">Lista de paquetes</VCardTitle>

							<VCardText style="margin-bottom: -2rem">
								<div class="d-flex flex-wrap gap-4 mt-10">
									<VBtn
										prepend-icon="tabler-user-plus"
										color="success"
										variant="tonal"
										class="ml-auto"
										@click="onAddPaquete"
									>
										Crear paquete
									</VBtn>
								</div>
							</VCardText>

							<VCardItem v-if="isLoading"> Cargando datos... </VCardItem>
							<VCardItem v-else>
								<VTable class="text-no-wrap tableNavegacion mb-5">
									<thead>
										<tr>
											<th scope="col">Nombre</th>
											<th scope="col">Código interno</th>
											<th scope="col">Acciones</th>
										</tr>
									</thead>

									<tbody>
										<tr v-for="item in paginatedPaquetes">
											<td class="text-medium-emphasis">
												{{ item.nombre }}
											</td>
											<td class="text-medium-emphasis">
												{{ item.codigoInterno }}
											</td>
											<td class="text-medium-emphasis">
												<VBtn
													color="success"
													variant="text"
													icon
													@click="onEditPaquete(item._id)"
												>
													<VIcon size="22" icon="tabler-edit" />
												</VBtn>

												<VBtn
													icon
													color="error"
													variant="text"
													@click="onDelete(item._id)"
												>
													<VIcon size="22" icon="tabler-trash" />
												</VBtn>
											</td>
										</tr>
									</tbody>
								</VTable>
								<div
									class="d-flex align-center justify-space-between botonescurrentPage"
								>
									<VBtn
										icon="tabler-arrow-big-left-lines"
										@click="prevPage"
										:disabled="currentPage === 1"
									></VBtn>
									Página {{ currentPage }}
									<VBtn
										icon="tabler-arrow-big-right-lines"
										@click="nextPage"
										:disabled="currentPage * itemsPerPage >= dataPaquetes.length"
									>
									</VBtn>
								</div>
							</VCardItem>
						</VCard>
					</VCol>
				</VRow>
			</VWindowItem>
			<VWindowItem :key="1">
				<GruposC/>
			</VWindowItem>
			<VWindowItem :key="2">
				<CaracteristicasC />
			</VWindowItem>
		</VWindow>

		<VDialog
			v-model="isDialogActive"
			persistent
			no-click-animation
			max-width="800"
		>
			<!-- Dialog close btn -->
			<DialogCloseBtn @click="closeDiag" />

			<VCard>
				<VCardItem class="text-center">
					<VCardTitle class="text-h5 mb-3">
						{{ accionForm === "add" ? "Crear un paquete" : "Editar " + nombre }}
					</VCardTitle>
				</VCardItem>

				<VCardText class="px-5 py-3">
					<!-- inicio lista de Módulos -->

					<form-wizard
						:class="loadingPanel ? 'disabled' : ''"
						@on-complete="onComplete"
						@on-loading="setLoading"
						color="#7367F0"
						@on-validate="handleValidation"
						@on-change="handleValidationChange"
						validate-on-back="true"
						nextButtonText="Siguiente"
						backButtonText="Anterior"
						finishButtonText="Guardar paquete"
					>
						<tab-content
							title="Detalles del paquete"
							:before-change="validateAsync"
						>
							<VRow class="pb-5">
								<VCol cols="12">
									<VRow>
										<VCol cols="7" md="7">
											<VTextField v-model="nombre" label="Nombre" />
										</VCol>
										<VCol cols="5" md="5">
											<VTextField
												v-model="codigoInterno"
												label="Código interno"
											/>
										</VCol>
									</VRow>
								</VCol>

								<span class="mt-4">Pagos</span>
								<VDivider class="my-2" />
								<VCol cols="12">
									<VRow>
										<VCol cols="6" md="6">
											<VSelect
												v-model="tipoPago"
												label="Tipo de pago"
												:items="tipoPagoItems"
											/>
										</VCol>
										<VCol cols="6" md="6">
											<VTextField
												v-model="precio"
												label="Precio"
												type="number"
											/>
										</VCol>
									</VRow>
								</VCol>

								<VCol cols="12">
									<VRow class="d-flex flex-wrap">
										<VCol cols="4" md="4" class="mdContainer">
											<VSelect
												v-model="periodicidad"
												label="Periodicidad"
												:items="periodicidadItems"
											/>
										</VCol>

										<VCol cols="4" md="4" class="mdContainer">
											<VTextField
												v-model="ciclosPromocion"
												label="Ciclos de Promoción"
												type="number"
											/>
										</VCol>

										<VCol cols="4" md="4" class="mdContainer">
											<VTextField
												v-model="precioPromocional"
												label="Precio promocional"
												type="number"
											/>
										</VCol>
									</VRow>
								</VCol>

								<VCol cols="12">
									<VTextField
										v-model="descripcionPrecios"
										label="Descripción de precios"
									/>
								</VCol>
								<span class="mt-4">Otras configuraciónes</span>
								<VDivider class="my-2" />
								<VCol cols="12">
									<VRow class="mb-4">
										<VCol v-if="accionForm == 'add'" cols="6" md="6">
											<VSelect
												v-model="grupo"
												label="Grupo"
												:items="gruposItems"
											/>
										</VCol>

										<VCol cols="6" md="6">
											<VSelect
												v-model="sitio"
												label="Sitio"
												:items="sitiosItems"
											/>
										</VCol>
										<VCol cols="6" md="6" class="">
											<VTextField
												v-model="urlRaw"
												label="Ingresa la url del paquete, si dispone"
											/>
										</VCol>
									</VRow>

									<VRow class="mb-4">
										<VCol cols="6" md="6" class="mdContainer">
											<AppDateTimePicker
												prepend-inner-icon="tabler-calendar"
												density="compact"
												v-model="activoDesde"
												show-current="true"
												label="Activo desde"
												:config="{
													position: 'auto right',
													altFormat: 'F j, Y',
													dateFormat: 'd/m/Y',
													// maxDate: new Date(),
													reactive: true,
												}"
											/>
										</VCol>

										<VCol cols="6" md="6" class="mdContainer">
											<AppDateTimePicker
												prepend-inner-icon="tabler-calendar"
												density="compact"
												v-model="activoHasta"
												show-current="true"
												label="Activo hasta"
												:config="{
													position: 'auto right',
													altFormat: 'F j, Y',
													dateFormat: 'd/m/Y',
													// maxDate: new Date(),
													reactive: true,
												}"
											/>
										</VCol>
									</VRow>

									<VRow class="d-flex flex-wrap mb-4">
										<VCol cols="6" md="6" class="smContainer d-none">
											<VSelect
												v-model="destaque"
												label="Destaque"
												:items="destaqueItems"
											/>
										</VCol>

										<VCol cols="12" md="12" class="mdContainer">
											<VTextField v-model="clasesCss" label="Clases CSS" />
										</VCol>

										<VCol cols="4" md="4" class="lgContainer">
											<span>Visibilidad</span>
											<VRadioGroup v-model="visibilidad">
												<VRadio
													v-for="(vis, indexV) in visibilidadItems"
													:key="indexV"
													:label="vis"
													:value="vis"
												/>
											</VRadioGroup>
										</VCol>

										<VCol cols="4" md="4" class="lgContainer">
											<span>¿Es un paquete internacional?</span>
											<VRadioGroup v-model="paqueteInternacional">
												<VRadio
													v-for="(paqCor, indexPc) in paqueteInternacionalItems"
													:key="indexPc"
													:label="paqCor.title"
													:value="paqCor.title"
												/>
											</VRadioGroup>
										</VCol>

										<VCol cols="4" md="4" class="lgContainer">
											<span>¿Es un paquete VOD?</span>
											<VSwitch
												v-model="esVODSwitch"
											/>
										</VCol>

										<VCol cols="12" md="12" class="lgContainer" v-if="esVODSwitch">
											<span>Seleccione el catálogo VOD vinculado</span>
											<VSelect
												v-model="vodModel"
												:items="vodItems"
												item-title="title"
												item-value="value"
												return-object
											/>
										</VCol>

										<VCol cols="6" md="6" class="lgContainer d-none">
											<span>Cambio de plan</span>
											<VRadioGroup v-model="cambioPlan">
												<VRadio
													v-for="(plan, indexP) in cambioPlanItems"
													:key="indexP"
													:label="plan.title"
													:value="plan.value"
												/>
											</VRadioGroup>
										</VCol>

										<VCol cols="6" md="6" class="lgContainer d-none">
											<span>¿Es un paquete de cortesía?</span>
											<VRadioGroup v-model="paqueteCortesia">
												<VRadio
													v-for="(paqCor, indexPc) in paqueteCortesiaItems"
													:key="indexPc"
													:label="paqCor.title"
													:value="paqCor.value"
												/>
											</VRadioGroup>
										</VCol>

										<VCol cols="6" md="6" class="lgContainer d-none">
											<span>¿Solicitar dirección durante la compra?</span>
											<VRadioGroup v-model="direccionCompra">
												<VRadio
													v-for="(dir, indexD) in direccionCompraItems"
													:key="indexD"
													:label="dir.title"
													:value="dir.value"
												/>
											</VRadioGroup>
										</VCol>

										<VCol cols="12" md="12">
											<VTextarea
												rows="1"
												v-model="url_imagen"
												label="Url de imágen"
												auto-grow
											/>
										</VCol>

										<VCol cols="12" md="12">
											<VTextarea
												rows="2"
												v-model="descripcionCustom"
												label="Descripción personalizada"
												auto-grow
											/>
										</VCol>
									</VRow>
								</VCol>
							</VRow>
						</tab-content>
						<tab-content
							title="Asignación de características"
							:before-change="validateAsyncInsercion"
						>
							<VRow>
								<VCol class="mb-1" cols="12">
									<p>Características</p>
								</VCol>

								<VCol cols="6">
									<VCol
										style="margin-top: -1.5rem"
										v-for="item in caracteristicasItems"
										cols="6"
									>
										<VCheckbox
											v-model="caracteristicasSelected"
											:label="item.title"
											:value="item.value"
										/>
									</VCol>
								</VCol>
							</VRow>
						</tab-content>

						<div class="loader" v-if="loadingWizard"></div>
					</form-wizard>
					<!-- fin lista usuarios -->
				</VCardText>
			</VCard>
		</VDialog>

		<VDialog v-model="isDialogVisibleDelete" persistent class="v-dialog-sm">
			<!-- Dialog close btn -->
			<DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

			<!-- Dialog Content -->
			<VCard title="Eliminar registro">
				<VCardText> ¿Desea eliminar el paquete? </VCardText>

				<VCardText class="d-flex justify-end gap-3 flex-wrap">
					<VBtn
						color="secondary"
						variant="tonal"
						@click="isDialogVisibleDelete = false"
					>
						No, Cerrar
					</VBtn>
					<VBtn @click="deletePaquete"> Si, eliminar </VBtn>
				</VCardText>
			</VCard>
		</VDialog>
	</section>
</template>

<style>
/* This is a css loader. It's not related to vue-form-wizard */
.loader,
.loader:after {
	border-radius: 50%;
	width: 10em;
	height: 10em;
}
.loader {
	margin: 60px auto;
	font-size: 10px;
	position: relative;
	text-indent: -9999em;
	border-top: 1.1em solid rgba(255, 255, 255, 0.2);
	border-right: 1.1em solid rgba(255, 255, 255, 0.2);
	border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
	border-left: 1.1em solid #e74c3c;
	-webkit-transform: translateZ(0);
	-ms-transform: translateZ(0);
	transform: translateZ(0);
	-webkit-animation: load8 1.1s infinite linear;
	animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}
@keyframes load8 {
	0% {
		-webkit-transform: rotate(0deg);
		transform: rotate(0deg);
	}
	100% {
		-webkit-transform: rotate(360deg);
		transform: rotate(360deg);
	}
}

@media screen and (max-width: 1000px) {
	.smContainer {
		min-width: 100px;
	}
	.mdContainer {
		min-width: 200px;
	}
	.lgContainer {
		min-width: 300px;
	}
}

.flatpickr-calendar.open {
	z-index: 100000;
}
</style>
