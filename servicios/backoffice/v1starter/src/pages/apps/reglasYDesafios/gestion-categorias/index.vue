<script setup>
import { onMounted } from 'vue';
import 'vue3-form-wizard/dist/style.css';

const dataDesafios = ref([]);
const isLoading = ref(false);
const searchTerm = ref('');
const disabledPagination = ref(false);
const totalRegistros = ref(1);
const currentPage = ref(1);

const configSnackbar = ref({
  message: "Datos guardados",
  type: "success",
  model: false
});

async function getDesafios(page = 1, limit = 5) {
  try {
    isLoading.value = true;
    const consulta = await fetch(`https://servicio-niveles-puntuacion.vercel.app/categoria/all?page=${page}&limit=${limit}`);
    const consultaJson = await consulta.json();
    dataDesafios.value = consultaJson.data;
    console.log(dataDesafios.value);
    totalRegistros.value = Math.ceil(consultaJson.total / consultaJson.limit);
    isLoading.value = false;
  } catch (error) {
    console.error(error.message);
  }
}

onMounted(async () => {
  isLoading.value = true;
  await getDesafios();
  isLoading.value = false;
})



//------------------- FUNCIONES  ---------------------

const nombreUsuarioVisible = ref([]);

const isLoadingDesafiosUser = ref(false);
const isDesafiosUserVisible = ref(false);
const desafiosUser = ref([]);
const userSelected = ref({
  nombre: '',
  id: 0
});

const disabledPaginationDesafiosUser = ref(false);
const totalRegistrosDesafiosUser = ref(1);
const currentPageDesafiosUser = ref(1);



async function getDesafiosUser(id, page = 1, limit = 10) {
  try {
    isLoadingDesafiosUser.value = true;
    const consulta = await fetch(`https://servicio-niveles-puntuacion.vercel.app/historico-desafio-logrados/userid?userId=${id}&page=${page}&Limit=${limit}`);
    const consultaJson = await consulta.json();
    desafiosUser.value = consultaJson.data;
    totalRegistrosDesafiosUser.value = Math.ceil(consultaJson.total / consultaJson.limit);
    //console.log('clicked',dataDesafiosUser.value);
    isDesafiosUserVisible.value = true;
    isLoadingDesafiosUser.value = false;
  } catch (error) {
    console.error(error.message);
    isLoadingDesafiosUser.value = false;
    isDesafiosUserVisible.value = false;
  }
}

const handlePaginationClickDesafiosUser = async () => {

  disabledPaginationDesafiosUser.value = true;
  await getDesafiosUser(userSelected.value.id, currentPageDesafiosUser.value);
  disabledPaginationDesafiosUser.value = false;
};


const handlePaginationClick = async () => {

  disabledPagination.value = true;
  nombreUsuarioVisible.value = [];
  await getDesafios(currentPage.value)
  disabledPagination.value = false;
};


const itemsPerPage = 5;


const paginatedTrivias = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return dataTrivias.value.slice(start, end);
});

const nextPage = () => {
  if (currentPage.value * itemsPerPage < dataTrivias.value.length) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

/*CODIGO ERI */



const isDialogActive = ref(false);
const formAccion = ref('');
const idToEdit = ref('');
const title = ref('');
const descripcion = ref('');
const etiqueta = ref('');
const image = ref('');
const categoria = ref('');



async function onEditDetalleVoto(id) {
  isDialogActive.value = true;
  formAccion.value = 'editar'
  const consulta = await fetch('https://servicio-niveles-puntuacion.vercel.app/categoria/get/' + id);
  const consultaJson = await consulta.json();
  const detalle = consultaJson.data;

  idToEdit.value = detalle._id;
  title.value = detalle.title;
  image.value = detalle.image;
}

async function onAddDetalleVoto() {
  formAccion.value = 'agregar'
  title.value = '';
  image.value = '';
  isDialogActive.value = true;
}


async function onSubmit() {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  if (formAccion.value === 'agregar') {

    let dataEnviar = {
      "title": title.value,
      "image": image.value,
    }

    var raw = JSON.stringify(dataEnviar);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    const send = await fetch('https://servicio-niveles-puntuacion.vercel.app/categoria/create', requestOptions);
    const respuesta = await send.json();
    if (respuesta.resp) {
      configSnackbar.value = {
        message: "Creado correctamente",
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
      "title": title.value,
      "image": image.value,
    }


    var raw = JSON.stringify(dataEnviar);

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };
    const send = await fetch(`https://servicio-niveles-puntuacion.vercel.app/categoria/update/${idToEdit.value}`, requestOptions);
    const respuesta = await send.json();
    console.log(respuesta);
    if (respuesta.resp) {
      configSnackbar.value = {
        message: "Editado correctamente",
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
  await getDesafios();
}


function resetForm() {
  isDialogActive.value = false;
  title.value = '';
  image.value = '';
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

  const deleted = await fetch('https://servicio-niveles-puntuacion.vercel.app/categoria/delete/' + idToDelete.value, requestOptions);
  const respuesta = await deleted.json();
  if (respuesta.resp) {
    configSnackbar.value = {
      message: "Eliminado correctamente",
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
  await getDesafios();
  isDialogVisibleDelete.value = false;
}



</script>

<template>
  <section>
    <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat" :color="configSnackbar.type">
      {{ configSnackbar.message }}
    </VSnackbar>
    <VRow>
      <VCol class="" cols="12" md="12" lg="12">

        <VRow>
          <VCol cols="12" sm="12" lg="12">

            <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat"
              :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
              {{ configSnackbar.message }}
            </VSnackbar>

            <VCard class="mt-4">
              <VCardTitle class="pt-4 pl-6">Listado Categorias</VCardTitle>


              <VCardItem>
                <VBtn prepend-icon="tabler-user-plus" color="success" variant="tonal" class="ml-auto"
                  @click="onAddDetalleVoto">Agregar</VBtn>

              </VCardItem>

              <VCardItem v-if="isLoading">
                Cargando datos...
              </VCardItem>
              <VCardItem v-else-if="!isLoading && dataDesafios.length > 0">

                <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                  <thead>
                    <tr>
                      <th scope="col">Titulo</th>
                      <th scope="col">Imagen</th>
                      <th scope="col">Acción</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(item, index) in dataDesafios">
                      <td class="text-medium-emphasis">

                        <div class="d-flex align-center gap-4 mt-6 ml-4 mb-2" style="height: 20px; ">
                          <div>
                            <h4>{{ item.title }}</h4>
                          </div>
                        </div>
                      </td>
                      <td class="text-medium-emphasis">
                        <img width="50" :src="`${item.image}`" :alt="`${item.title}`">

                      </td>
                      <td class="text-medium-emphasis">

                        <div>
                          <VBtn icon size="x-small" color="default" variant="text" @click="onEditDetalleVoto(item._id)">

                            <VIcon size="22" icon="tabler-pencil" />

                          </VBtn>
                          <VBtn icon size="x-small" color="default" variant="text" @click="onDelete(item._id)">
                            <VIcon size="22" icon="tabler-trash" />
                          </VBtn>
                        </div>

                        {{ item.estadoDesafio }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
                <VPagination size="small" :disabled="disabledPagination" v-model="currentPage" :length="totalRegistros"
                  class="mt-4" @click="handlePaginationClick" />
              </VCardItem>
              <VCardItem v-if="!isLoading && dataDesafios.length === 0">
                No se han encontrado datos
              </VCardItem>

            </VCard>
          </VCol>


        </VRow>

      </VCol>
    </VRow>

    <VDialog v-model="isDialogActive" persistent max-width="600">

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogActive = !isDialogActive" />

      <VCard class="pa-sm-14 pa-5">
        <VCardItem class="text-center">
          <VCardTitle class="text-h5 mb-3">
            {{ formAccion === "agregar" ? "Agregar una categoria" : "Editar " + title }}
          </VCardTitle>
        </VCardItem>

        <VCardText>

          <!-- 👉 Form -->
          <VForm class="mt-6" @submit.prevent="onSubmit">
            <VRow class="d-flex flex-wrap justify-center gap-4">
              <VRow>
                <!-- 👉 Nombre -->
                <VCol cols="6">
                  <VTextField v-model="title" label="Nombre" />
                  <VTextField class="mt-4" v-model="image" label="URL de la Imágen" />
                </VCol>


                <VCol cols="6">
                  <VAvatar rounded="sm" class="img-e-a">
                    <VImg v-if="image" :src="image" />
                    <div v-else>Previsualizar la Imágen</div>
                  </VAvatar>
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

.img-e-a {
  width: 100% !important;
  height: 100px !important;
}
.clickable {
  cursor: pointer;
}

.item-cards {
  background: rgba(var(--v-border-color), var(--v-hover-opacity));
  box-shadow: none !important;
  border-radius: 6px;
}

.item-cards-small {
  background: rgba(var(--v-border-color), var(--v-hover-opacity));
  box-shadow: none !important;
  border-radius: 2px;
}

.boton-eleminar-itemsCards {
  height: 38px;
  width: 38px;
  display: block;
  margin: -11px;
}

.v-theme--light .item-cards {
  background: #f2f2f2;
}

.v-theme--light.v-field {
  background: #fff;
}

.v-card-text {
  padding: 0px 10px;
}

@media screen and (max-width: 1000px) {
  .container {
    min-width: 90svw;
  }

  .mdContainer {
    min-width: 100px;
  }
}

.open.flatpickr-calendar {
  z-index: 100000;
}
</style>