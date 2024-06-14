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

async function getDesafios(page = 1, limit = 10) {
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


async function onClickDesafiosUser(id) {
  const dataUser = await fetch('https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/id?id=' + id);
  const dataUserJson = await dataUser.json();
  userSelected.value.nombre = dataUserJson.first_name + ' ' + dataUserJson.last_name;
  userSelected.value.id = id;
  await getDesafiosUser(id);
}
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

async function mostrarNombreUsuario(id, index) {
  const dataUser = await fetch('https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/id?id=' + id);
  const dataUserJson = await dataUser.json();
  dataDesafios.value[index].nombre = dataUserJson.first_name + ' ' + dataUserJson.last_name;
  nombreUsuarioVisible.value.push(index);
}

function copyUrl(id) {
  navigator.clipboard.writeText('https://ecuavisa-desafio-trivias.vercel.app/trivia/get/' + id);

  configSnackbar.value = {
    message: "Enlace copiado en el portapapeles",
    timeout: 1000,
    type: "success",
    model: true
  };
}

const reset = async () => {
  searchTerm.value = '';
  await getTrivias();
}

const startSearch = () => {
  currentPage.value = 1;
  search();
};

const search = async () => {
  isLoading.value = true;

  try {

    const response = await fetch(`https://ecuavisa-desafio-trivias.vercel.app/trivia/search/name?nombre=${searchTerm.value}`);
    const data = await response.json();
    if (data.resp) {
      dataTrivias.value = data.data;

    } else {
      dataTrivias.value = [];
      console.log("no hay nada para mostrar");
      //isSnackbarVisible.value = true;
    }
  } catch (error) {
    console.error('Error al realizar la búsqueda:', error);
  } finally {
    isLoading.value = false;
  }
};

const itemsPerPage = 20;


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
    const send = await fetch('https://ecuavisa-servicio-votacion.vercel.app/detalle/insert', requestOptions);
    const respuesta = await send.json();
    if (respuesta.resp) {
      // configSnackbar.value = {
      //   message: "Detalle de voto creado correctamente",
      //   type: "success",
      //   model: true
      // };
    } else {
      // configSnackbar.value = {
      //   message: respuesta.mensaje,
      //   type: "error",
      //   model: true
      // };
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
      // configSnackbar.value = {
      //   message: "Detalle de voto editado correctamente",
      //   type: "success",
      //   model: true
      // };
    } else {
      // configSnackbar.value = {
      //   message: respuesta.mensaje,
      //   type: "error",
      //   model: true
      // };
    }

  }
  // isDialogActive.value = false;
  // await onInit();
}



</script>

<template>
  <section>
    <VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">

        <VRow>
          <VCol cols="12" sm="12" lg="12">

            <VSnackbar v-model="configSnackbar.model" location="top end" variant="flat"
              :timeout="configSnackbar.timeout || 2000" :color="configSnackbar.type">
              {{ configSnackbar.message }}
            </VSnackbar>

            <VCard class="mt-4">
              <VCardTitle class="pt-4 pl-6">Listado Categorias</VCardTitle>

              <VCardItem v-if="isLoading">
                Cargando datos...
              </VCardItem>
              <VCardItem v-else-if="!isLoading && dataDesafios.length > 0">

                <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                  <thead>
                    <tr>
                      <th scope="col">Titulo</th>
                      <th scope="col">Imagen</th>
                      <th scope="col">Estado</th>
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
                          <VBtn icon size="x-small" color="default" variant="text"
                            @click="onConfirmUsersDeleteActive(user.wylexId)">
                            <VIcon size="22" icon="tabler-trash" />
                          </VBtn>
                        </div>

                        {{ item.estadoDesafio }}
                      </td>
                    </tr>
                  </tbody>
                </VTable>
                <VPagination :disabled="disabledPagination" v-model="currentPage" :length="totalRegistros" class="mt-4"
                  @click="handlePaginationClick" />
              </VCardItem>
              <VCardItem v-if="!isLoading && dataDesafios.length === 0">
                No se han encontrado datos
              </VCardItem>

            </VCard>
          </VCol>

          <VCol v-if="isDesafiosUserVisible == true" cols="12" sm="12" lg="12">
            <VCard>
              <VCardTitle class="pt-4 pl-6">Desafíos de {{ userSelected.nombre }}</VCardTitle>

              <VCardItem v-if="desafiosUser.length > 0">

                <VTable class="text-no-wrap tableNavegacion mb-5">
                  <thead>
                    <tr>
                      <th scope="col">Desafío</th>
                      <th scope="col">Estado</th>

                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(r, index) in desafiosUser">
                      <td class="text-medium-emphasis">
                        {{ r.idDesafio }}
                      </td>
                      <td class="text-medium-emphasis">
                        {{ r.estadoDesafio }}
                      </td>

                    </tr>
                  </tbody>
                </VTable>
                <VPagination :disabled="disabledPaginationDesafiosUser" v-model="currentPageDesafiosUser"
                  :length="totalRegistrosDesafiosUser" class="mt-4" @click="handlePaginationClickDesafiosUser" />

              </VCardItem>
              <VCardItem v-else-if="desafiosUser.length == 0">
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
                </VCol>


                <VCol cols="12">
                  <VTextField v-model="image" label="Imágen" />
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


  </section>
</template>

<style>
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