<script setup>
import { onMounted } from 'vue';

const dataUsuarios = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = ref(1);
const isLoading = ref(true);

async function getUsuarios(){
    isLoading.value = true;
    await fetch ('https://phpstack-1011861-3575405.cloudwaysapps.com/servicios/gavilanes/registros.php')
    .then(result => result.json())
    .then(data => {
        dataUsuarios.value = data; 
        isLoading.value = false;
    });
}


onMounted(getUsuarios);

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

function downloadSelection () {
   
  let headers = {
    nombre: "nombre",
    id_usuario: "id_usuario",
    telefono: "telefono",
    correo: "correo",
    url_imagen: "url_imagen"
  };
  let doc = [];
  doc = Array.from(dataUsuarios.value);
  let title = "users_concurso_gavilanes";
  //console.log("doc", doc);
  //if(usersFull.length > totalUsers){
  exportCSVFile(headers, doc, title);
 // }

};
</script>

<template>
<VRow>
    <VCol cols="12" >
    <!-- trazabilidad independiente -->
    
      <VCard >
        <VCardItem class="pb-sm-0" >    
        <div style="display: flex; flex-wrap: wrap;">   
          <div style="margin-right: auto;">
          <VCardTitle >Usuarios</VCardTitle>  
        </div>
          <div style="margin-left: auto;">
          <VBtn 
            color="primary"							
            @click="downloadSelection"
            >
            Exportar
          </VBtn>
        </div>
    </div> 
        </VCardItem>
          <VCardItem class="pb-sm-0"> 
          <VCardText v-if="isLoading">Cargando usuarios...</VCardText>
          <VCardText v-else> 
          <VTable class="text-no-wrap tableNavegacion" >
            <thead>
              <tr>
                <th scope="col">Id de usuario</th>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Teléfono</th>  
                <th scope="col">URL de imágen</th>               
              </tr>
            </thead>

            <tbody>
              <tr v-for="user in paginatedData">
                <td>
                  {{ user.id_usuario }} 
                </td>
                <td >
                  {{ user.nombre }} 
                </td>
                <td>
                  {{ user.correo }} 
                </td>
                <td>
                  {{ user.telefono }} 
                </td>
                <td>
                  <a class="pt-2 pb-2" style="display:block" :href="'https://phpstack-1011861-3575405.cloudwaysapps.com/servicios/gavilanes/'+user.url_imagen" target="_blank">
                    <img :src="'https://phpstack-1011861-3575405.cloudwaysapps.com/servicios/gavilanes/'+user.url_imagen" width="105" class="img-gavilanes">
                  </a>
                </td>
              </tr>
            </tbody>
          </VTable>
          <VDivider />

<div class="px-4 py-4 mt-5">
    <v-btn
        :disabled="currentPage === 1"
        @click="currentPage -= 1"
        size="small"
        color="primary"
    >
        Anterior
    </v-btn>
    <span class="px-2"
        >{{ currentPage }} de {{ totalPages }} de un total de
        {{ dataUsuarios.length }} registros</span
    >

    <v-btn
        :disabled="currentPage === totalPages"
        @click="currentPage += 1"
        size="small"
        color="primary"
    >
        Siguiente
    </v-btn>
</div>
        </VCardText>
        </VCardItem>
      </VCard>
    </VCol>
</VRow>
</template>
