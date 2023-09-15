<script setup>
import { onMounted } from 'vue';

const dataDetalleVoto = ref([]);
const searchQuery = ref("");
const isLoading = ref(false);

async function getDataDetalleVoto() {
    try {

        var Arr = [];
        let page = 1;
        //let limit = 1000;
        while (true) {
            const consulta = await fetch('https://ecuavisa-servicio-votacion.vercel.app/detalle/get/all?page=' + page);
            const consultaJson = await consulta.json();
            const data = consultaJson.data;
            if (data.length === 0) {
                break;
            }
            Arr.push(...data);
            dataDetalleVoto.value = Array.from(Arr);
            page += 1;
        }

    } catch (error) {
        console.error(error.message);
    }
}


async function onInit() {
    isLoading.value = true;
    await getDataDetalleVoto();
    isLoading.value = false;
}

onMounted(async () => {
    await onInit();
})

const itemsPerPage = 8;
const currentPage = ref(1);

async function searchByName() {
    if (searchQuery.value != '') {
        isLoading.value = true;
        const consulta = await fetch('https://ecuavisa-servicio-votacion.vercel.app/detalle/get/nombre/?nombre=' + searchQuery.value);
        const consultaJson = await consulta.json();
        dataDetalleVoto.value = consultaJson.data;
        isLoading.value = false;
    }
}

async function reiniciarSearch() {
    if (searchQuery.value != '') {
        searchQuery.value = ''
        await onInit();
    }
}

const paginatedDataVotos = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;

    return dataDetalleVoto.value.slice(start, end);
});

const nextPage = () => {
    if (currentPage.value * itemsPerPage < dataDetalleVoto.value.length) currentPage.value++;
};

const prevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};
// -------------------------------FORM-----------------------------------//
const isDialogActive = ref(false);
const formAccion = ref('');
const idToEdit = ref('');
const nombre = ref('');
const descripcion = ref('');
const etiqueta = ref('');
const urlImagen = ref('');
const categoria = ref('');

const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
});

const categorias = [
    {
        title: "Desafío a la fama",
        value: "desafio a la fama"
    }
]


async function onEditDetalleVoto(id) {
    isDialogActive.value = true;
    formAccion.value = 'editar'
    const consulta = await fetch('https://ecuavisa-servicio-votacion.vercel.app/detalle/' + id);
    const consultaJson = await consulta.json();
    const detalle = consultaJson.data;

    idToEdit.value = detalle._id;
    nombre.value = detalle.nombre;
    descripcion.value = detalle.descripcion;
    etiqueta.value = detalle.etiqueta;
    urlImagen.value = detalle.urlImagen;
    categoria.value = detalle?.categoria;
}

async function onAddDetalleVoto() {
    formAccion.value = 'agregar'
    nombre.value = '';
    descripcion.value = '';
    etiqueta.value = '';
    urlImagen.value = '';
    categoria.value = '';
    isDialogActive.value = true;
}

async function onSubmit() {

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (formAccion.value === 'agregar') {

        let dataEnviar = {
           "nombre": nombre.value,
           "descripcion": descripcion.value,
           "etiqueta": etiqueta.value,
           "urlImagen": urlImagen.value,
           "categoria": categoria.value 
        }

        var raw = JSON.stringify(dataEnviar);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://ecuavisa-servicio-votacion.vercel.app/detalle/insert', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Detalle de voto creado correctamente",
                type: "success",
                model: true
            };
        } else {
            configSnackbar.value = {
                message: respuesta.mensaje,
                type: "error",
                model: true
            };
        }

    } else if (formAccion.value === 'editar') {

        let dataEnviar = {
           "id": idToEdit.value,
           "nombre": nombre.value,
           "descripcion": descripcion.value,
           "etiqueta": etiqueta.value,
           "urlImagen": urlImagen.value, 
           "categoria": categoria.value 
        }

        var raw = JSON.stringify(dataEnviar);

        var requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
        const send = await fetch('https://ecuavisa-servicio-votacion.vercel.app/detalle/update', requestOptions);
        const respuesta = await send.json();
        if (respuesta.resp) {
            configSnackbar.value = {
                message: "Detalle de voto editado correctamente",
                type: "success",
                model: true
            };
        } else {
            configSnackbar.value = {
                message: respuesta.mensaje,
                type: "error",
                model: true
            };
        }

    }
    isDialogActive.value = false;
    await onInit();
}

function resetForm() {
    isDialogActive.value = false;
    nombre.value = '';
    descripcion.value = '';
    etiqueta.value = '';
    urlImagen.value = '';
    categoria.value = '';
}


// -------------------------------DELETE-----------------------------------//
const isDialogVisibleDelete = ref(false);
const idToDelete = ref('');

function onDelete(id) {
    isDialogVisibleDelete.value = true;
    idToDelete.value = id;
}

async function deleteDetalleVoto() {
    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };

    const deleted = await fetch('https://ecuavisa-servicio-votacion.vercel.app/detalle/delete?id=' + idToDelete.value, requestOptions);
    const respuesta = await deleted.json();
    if (respuesta.resp) {
        configSnackbar.value = {
            message: "Detalle de voto eliminado correctamente",
            type: "success",
            model: true
        };
    } else {
        configSnackbar.value = {
            message: respuesta.mensaje,
            type: "error",
            model: true
        };
    }
    await onInit();
    isDialogVisibleDelete.value = false;
}
</script>

<template>
    <section>
        <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :color="configSnackbar.type">
            {{ configSnackbar.message }}
        </VSnackbar>
        <VRow>
            <VCol cols="12" sm="12" lg="12">
                <VCard>
                    <VCardTitle class="pt-4 pl-6">Lista de detalles de voto</VCardTitle>
                    <VCardText>
                        <div class="d-flex flex-wrap gap-4 mt-10">
                            <div style="width: 15rem">
                                <VTextField @keyup.enter="searchByName" v-model="searchQuery" placeholder="Buscar..." density="compact" />
                            </div>
                            <!-- 👉 Search button -->
                            <VBtn prepend-icon="tabler-search" @click="searchByName">
                                Buscar
                            </VBtn>
                            <VBtn @click="reiniciarSearch" :disabled="!searchQuery">
                                Reiniciar
                            </VBtn>
                            <VBtn prepend-icon="tabler-user-plus" color="success" variant="tonal" class="ml-auto" @click="onAddDetalleVoto">
                                Agregar participante
                            </VBtn>
                        </div>
    
                    </VCardText>
                </VCard>
            </VCol>

            <VCardItem v-if="isLoading">
                Cargando datos...
            </VCardItem> 

            <VCardItem v-else-if="dataDetalleVoto.length === 0">
                No existen datos para mostrar.
            </VCardItem>

            <VCol v-else cols="12" sm="6" lg="3" v-for="item in paginatedDataVotos">
                <VCard>

                    <VImg class="immm__" :width="200" aspect-ratio="1/1" :src=item.urlImagen cover />
                    <VCardText class="position-relative">
                        <div class="d-flex justify-space-between flex-wrap pt-8">
                            <div class="me-2 mb-2">

                                <VCardTitle class="pa-0"> {{ item.nombre }}</VCardTitle>

                                <VCardSubtitle class="text-base pa-0">
                                    {{ item.descripcion }}
                                </VCardSubtitle>
                                <VCardSubtitle class="text-base pa-0">
                                    {{ item.etiqueta }}
                                    <br>
                                    Votos: {{ item.votosTotales }}
                                </VCardSubtitle>

                                <VCardTitle class="pa-0"> </VCardTitle>

                            </div>
                        </div>

                    </VCardText>



                    <VCardText>
                        <!-- {{ item._id }} -->
                        <VBtn class="mr-3" color="success" variant="tonal" icon  @click="onEditDetalleVoto(item._id)">
                            <VIcon size="22" icon="tabler-edit" />
                        </VBtn>

                        <VBtn icon  color="error" variant="tonal" @click="onDelete(item._id)">
                            <VIcon size="22" icon="tabler-trash" />
                        </VBtn>
                    </VCardText>

                </VCard>
            </VCol>
        </VRow>
        <VCard class="mt-5">
            <VCardText>
                <div class="d-flex align-center justify-space-evenly botonescurrentPage">
                    <VBtn icon="tabler-arrow-big-left-lines" @click="prevPage" :disabled="currentPage === 1"></VBtn>
                    Página {{ currentPage }}
                    <VBtn icon="tabler-arrow-big-right-lines" @click="nextPage"
                        :disabled="(currentPage * itemsPerPage) >= dataDetalleVoto.length">
                    </VBtn>
                </div>

            </VCardText>
        </VCard>

        <VDialog v-model="isDialogActive" persistent max-width="600">

            <!-- Dialog close btn -->
            <DialogCloseBtn @click="isDialogActive = !isDialogActive" />

            <VCard  class="pa-sm-14 pa-5">
                <VCardItem class="text-center">
                    <VCardTitle class="text-h5 mb-3">
                        {{ formAccion === "agregar" ? "Agregar un detalle de voto" : "Editar " + nombre }}
                    </VCardTitle>
                </VCardItem>

                <VCardText>

                    <!-- 👉 Form -->
                    <VForm class="mt-6" @submit.prevent="onSubmit">
                        <VRow class="d-flex flex-wrap justify-center gap-4">
                            <VRow>
                                <!-- 👉 Nombre -->
                                <VCol cols="6">
                                    <VTextField v-model="nombre" label="Nombre" />
                                </VCol>

                                <VCol cols="6">
                                    <VTextField v-model="descripcion" label="Descripción" />
                                </VCol>
                                <VCol cols="5">
                                    <VTextField v-model="etiqueta" label="Etiqueta" />
                                </VCol>
                                <VCol cols="7" >
											<VSelect
												v-model="categoria"
												label="Categoría"
                                                :items="categorias"
											/>
										</VCol>
                                <VCol cols="12">
                                    <VTextField v-model="urlImagen" label="Imágen" />
                                </VCol>

                            </VRow>
                            <!-- 👉 Submit and Cancel -->
                            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
                                <VBtn type="submit"> Guardar </VBtn>

                                <VBtn color="secondary" variant="tonal" @click="resetForm">
                                    Cancelar
                                </VBtn>
                            </VCol>
                        </VRow>
                    </VForm>
                </VCardText>
            </VCard>
        </VDialog>
        <VDialog v-model="isDialogVisibleDelete" persistent class="v-dialog-sm">

            <!-- Dialog close btn -->
            <DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

            <!-- Dialog Content -->
            <VCard title="Eliminar registro">
                <VCardText>
                    ¿Desea eliminar el registro?
                </VCardText>

                <VCardText class="d-flex justify-end gap-3 flex-wrap">
                    <VBtn color="secondary" variant="tonal" @click="isDialogVisibleDelete = false">
                        No, Cerrar
                    </VBtn>
                    <VBtn @click="deleteDetalleVoto">
                        Si, eliminar
                    </VBtn>
                </VCardText>
            </VCard>
        </VDialog>
    </section>
</template>


<style>
.immm__{
    margin: auto !important;
}

</style>