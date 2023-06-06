<script setup>
import { onMounted } from 'vue';

const dataAutores = ref([]);
const dataTemas = ref([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalPages = ref(1);
const isLoading = ref(true);
const subsTableVisible = ref(false);
const selectedAutor = ref('');
const usuariosSuscritos = ref([]);
const usuariosSuscritosLoading = ref(true);

async function getAutores(){
    const result = await fetch ('https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/mirrorAutores.php')
    .then(result => result.json())
    .then(data => {
        return data; 
    });
    return result;
}

async function getTemas(){
    const result = await fetch ('https://ecuavisa-temas.vercel.app/temas/full')
    .then(result => result.json())
    .then(data => {
        return data; 
    })
    return result;
}

async function resolveData (){
    isLoading.value = true;
    const autores = await getAutores();
    const temas = await getTemas();
    const arrayFinal = [];
    for(let i in autores){
        let autorId = autores[i].listid;
        let data ={
            titulo: autores[i].titulo,
            usuarios: []           
        };
        for(let j in temas){
            let encontrado = temas[j].usuario.Temas.find(e => e.idMeta == autorId);
            if(encontrado){
                let usuarioData = {
                    nombre: temas[j].usuario.name,
                    id: temas[j].usuario.id,
                    tema: encontrado
                }
                data.usuarios.push(usuarioData);
            }
        }
        arrayFinal.push(data);
    }

    dataAutores.value = arrayFinal;
    isLoading.value = false;
}
onMounted(resolveData);

const paginatedData = computed(() => {	
    const start = (currentPage.value - 1) * itemsPerPage.value;
	const end = start + itemsPerPage.value;
	let dataF = dataAutores.value.slice(start, end);
	totalPages.value = Math.ceil(dataAutores.value.length / itemsPerPage.value);
	//filteredData =  catag_list;
	return dataF;
});

async function resolveSubs(data){
    usuariosSuscritosLoading.value = true;
    let raw = Object.create(data);
    selectedAutor.value = raw.titulo;
    let usuarios = Array.from(raw.usuarios);
    const usuariosFinal = [];
    for(let i in usuarios){
        let id = usuarios[i].id;
        const usuario = await fetch(`https://data.mongodb-api.com/app/backoffice1-usyys/endpoint/id?id=${id}`)
        .then(result => {return result.json()})
        .catch(error => console.log(error));
        let dataUsuario = {
            wylexId: usuario.wylexId,
            created_at: usuario.created_at,
            first_name: usuario.first_name,
            last_name: usuario.last_name,
            phone_number: usuario.phone_number,
            email: usuario.email,
            site: usuario.site
        };
        usuariosFinal.push(dataUsuario);
    }
    usuariosSuscritos.value = usuariosFinal;
    subsTableVisible.value = true;
    usuariosSuscritosLoading.value = false;

}
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
    wylexId: "wylexId",
    created_at: "created",
    first_name: "first_name",
    last_name: "last_name",
    phone_number: "phone_number",
    email: "email",
    site: "site"
  };
  let doc = [];
  doc = Array.from(usuariosSuscritos.value);
  let title = "users_"+selectedAutor.value.replace(/ /g,"_");
  //console.log("doc", doc);
  //if(usersFull.length > totalUsers){
  exportCSVFile(headers, doc, title);
 // }

};
</script>

<template>
<VRow>
    <VCol cols="12">
 <VCard> 
 <VCardText>
    <VCardTitle>Newsletter</VCardTitle> 
    <VCardText v-if="isLoading">Cargando datos...</VCardText>
    <VCardText v-else>
  <VTable class="text-no-wrap tableNavegacion mb-5" hover="true" >
            <thead>
              <tr>
                <th scope="col">Título</th>
                <th scope="col">Usuarios suscritos</th>
            
              </tr>
            </thead>

            <tbody>
              <tr class="clickable" v-for="item  in paginatedData" @click="resolveSubs(item)">
                <td >
                    {{ item.titulo }}
                </td>
                <td >  
                    {{ item.usuarios.length }}            
                </td>
          
              </tr>
            </tbody>
          </VTable>
          <VDivider />

					<div class="px-4 py-4">
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
							{{ dataAutores.length }} registros</span
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
        </VCardText>
    </VCard>  
</VCol>
    <VCol cols="12" >
    <!-- trazabilidad independiente -->
    <VExpandTransition>
      <VCard v-show="subsTableVisible" v-if="usuariosSuscritos.length > 0">
        <VCardItem class="pb-sm-0" >    
        <div style="display: flex; flex-wrap: wrap;">   
          <div style="margin-right: auto;">
          <VCardTitle >Usuarios suscritos a {{ selectedAutor }}</VCardTitle>  
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
          <VCardText v-if="usuariosSuscritosLoading">Cargando usuarios...</VCardText>
          <VCardText v-else> 
          <VTable class="text-no-wrap tableNavegacion mb-5" >
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Número de teléfono</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="user in usuariosSuscritos">
                <td >
                  {{ user.first_name }} {{ user.last_name }}
                </td>
                <td>
                  {{ user.email }} 
                </td>
                <td>
                  {{ user.phone_number }} 
                </td>
              </tr>
            </tbody>
          </VTable>
        </VCardText>
        </VCardItem>
      </VCard>
    </VExpandTransition>
    </VCol>
</VRow>
</template>

<style scoped>
.clickable { cursor: pointer; }

</style>
