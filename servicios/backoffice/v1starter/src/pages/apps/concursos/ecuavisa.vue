<script setup>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
import { onMounted } from 'vue';
const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const dataUsuarios = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = ref(1);
const isLoading = ref(true);

async function getUsuarios() {
  isLoading.value = true;
  await fetch('https://estadisticas.ecuavisa.com/sites/services/global/dataForm.php')
    .then(result => result.json())
    .then(data => {
      console.log(data);
      dataUsuarios.value = data;
      isLoading.value = false;
    });
}


onMounted(async () => {
  await getUsuarios();
  await accionBackoffice();
});

async function accionBackoffice() {
  let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
  let userData = JSON.parse(localStorage.getItem('userData'));
  if (userData.email !== 'admin@demo.com') {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var log = JSON.stringify({
      "usuario": userData.email,
      "pagina": "concursos-gavilanes",
      "fecha": dateNow
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: log,
      redirect: 'follow'
    };
    await fetch(`https://servicio-logs.vercel.app/accion`, requestOptions)
      .then(response => {
      }).catch(error => console.log('error', error));
  }
}

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  let dataF = dataUsuarios.value.slice(start, end);
  totalPages.value = Math.ceil(dataUsuarios.value.length / itemsPerPage.value);
  //filteredData =  catag_list;
  return dataF;
});

function convertToCSV(objArray) {
  var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
  var str = "";

  for (var i = 0; i < array.length; i++) {
    var line = "";
    for (var index in array[i]) {
      if (line != "") line += ",";

      line += array[i][index];
    }

    str += line + "\r\n";
  }

  return str;
}

function exportCSVFile(headers, items, fileTitle) {
  if (headers && items[0].wylexId !== "wylexId") {
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

async function downloadSelection() {

  let headers = {
    nombres: "nombres",
    cedula: "cedula",
    telefono: "telefono",
    departamento: "departamento",
    imagen: "imagen"
  };
  let doc = [];
  doc = Array.from(dataUsuarios.value);
  let title = "users_concurso_ecuavisa";
  //console.log("doc", doc);
  //if(usersFull.length > totalUsers){
  let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
  let userData = JSON.parse(localStorage.getItem('userData'));
  if (userData.email !== 'admin@demo.com') {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var log = JSON.stringify({
      "usuario": userData.email,
      "pagina": "concursos-ecuavisa",
      "accion": "export",
      "fecha": dateNow
    });
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: log,
      redirect: 'follow'
    };
    await fetch(`https://servicio-logs.vercel.app/accion`, requestOptions)
      .then(response => {
      }).catch(error => console.log('error', error));
  }

  exportCSVFile(headers, doc, title);
  // }

};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <!-- trazabilidad independiente -->

      <VCard>
        <VCardItem class="pb-sm-0">
          <div style="display: flex; flex-wrap: wrap;">
            <div style="margin-right: auto;">
              <VCardTitle>Usuarios</VCardTitle>
            </div>
            <div style="margin-left: auto;">
              <VBtn color="primary" @click="downloadSelection">
                Exportar
              </VBtn>
            </div>
          </div>
        </VCardItem>
        <VCardItem class="pb-sm-0">
          <VCardText v-if="isLoading">Cargando usuarios...</VCardText>
          <VCardText v-else>
            <VTable class="text-no-wrap tableNavegacion">
              <thead>
                <tr>
                  <th scope="col">Departamento</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Cedula</th>
                  <th scope="col">Teléfono</th>
                  <th scope="col">URL de imágen</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="user in paginatedData">
                  <td>
                  {{ user.departamento }} 
                </td>
                  <td>
                    {{ user.nombres }}
                  </td>
                  <td>
                    {{ user.cedula }}
                  </td>
                  <td>
                    {{ user.telefono }}
                  </td>
                  <td>
                    <a class="pt-2 pb-2" style="display:block"
                      :href="'https://phpstack-1011861-3575405.cloudwaysapps.com/servicios/concursosRH/' + user.imagen"
                      target="_blank">
                      <img :src="'https://phpstack-1011861-3575405.cloudwaysapps.com/servicios/concursosRH/' + user.imagen"
                        width="105" class="img-gavilanes">
                    </a>
                  </td>
                </tr>
              </tbody>
            </VTable>
            <VDivider />

            <div class="px-4 py-4 mt-5">
              <v-btn :disabled="currentPage === 1" @click="currentPage -= 1" size="small" color="primary">
                Anterior
              </v-btn>
              <span class="px-2">{{ currentPage }} de {{ totalPages }} de un total de
                {{ dataUsuarios.length }} registros</span>

              <v-btn :disabled="currentPage === totalPages" @click="currentPage += 1" size="small" color="primary">
                Siguiente
              </v-btn>
            </div>
          </VCardText>
        </VCardItem>
      </VCard>
    </VCol>
  </VRow>
</template>
