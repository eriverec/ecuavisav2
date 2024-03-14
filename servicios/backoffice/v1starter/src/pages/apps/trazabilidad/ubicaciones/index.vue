<script setup>
import { logAction } from '@/middleware/activityLogger';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";

const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);

const cities = ref([]);
const fecha = ref({});
const isLoading = ref(true);
const orderField = ref("");
const countryUsers = ref([]);
const cityUsers = ref([]);
const itemsPerPage = 8;
const dateNowF = ref(moment().format("DD/MM/YYYY HH:mm:ss").toString());
const userBackoffice = ref(JSON.parse(localStorage.getItem('userData')));

fecha.value = {
  i: moment().add(-2, 'days'),
  f: moment(),
}

onMounted(async () => {
  /*
    await accionBackoffice({
   "usuario": userBackoffice.value.email,   
   "pagina": "trazabilidad-ubicaciones",
    "fecha": dateNowF.value
					});
   */
    await getData();
    
});

async function getData (){
    var Arr = [];
    let page = 1;
    while (true) {

     const response = await fetch(
        `https://servicio-de-actividad.vercel.app/ubicaciones/dataUsuarios/all?fechai=${(fecha.value.i).format('MM-DD-YYYY')}&fechaf=${(fecha.value.f).format('MM-DD-YYYY')}&page=${page}`
     );
     const data = await response.json();
     
     if (data.data.length === 0) {
                break;
     }
        Arr.push(...data.data);
        //console.log("data" + page,Arr.length)
        cities.value = Array.from(Arr);
        page += 1;
        if(cities.value === 0){
         isLoading.value = true;
        }else{
         isLoading.value = false; 
        }
    }  

/*
  const response = await fetch(
    `https://servicio-de-actividad.vercel.app/ubicaciones/demograficos/v2/all?fechai=${(fecha.value.i).format('MM-DD-YYYY')}&fechaf=${(fecha.value.f).format('MM-DD-YYYY')}`
  );
  const data = await response.json();
  await accionBackoffice();
  // orderDirection.value = orderDirection.value === 'desc' ? 'desc' : 'asc'
  cities.value = Array.from(data.data);
  isLoading.value = false;  
  console.log(cities.value);
  */
}

async function accionBackoffice (logData){
	if(userBackoffice.value.email !== 'admin@demo.com' ){
  var myHeaders = new Headers();
			myHeaders.append("Content-Type", "application/json");
			var log = JSON.stringify(logData);
			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: log,
				redirect: 'follow'
			};
			await fetch(`https://servicio-logs.vercel.app/accion`, requestOptions)
			.then(response =>{			
			}).catch(error => console.log('error', error));
		}
};

const sortedCities = computed(() => {
  if (orderField.value) {
    return cities.value;
  } else {
    return cities.value;
  }
});

// ----------------- Usuarios por país  -------------------   
const usuariosPorPais = ref(false);
const paisSelected = ref('');

const resolveUsuariosPorPais = (country) => {
    if(paisSelected.value !== country){
        paisSelected.value = country;
        const dataRaw = Array.from(cities.value);
        let filteredData = dataRaw.filter(item => item.country === country);

        let groupedData = [];
        filteredData.forEach(item => {
        item.data.forEach(cityData => {
            cityData.dataUsers.forEach(userData => {
                let data = {
                    userId: userData.userId,
                    first_name: userData.first_name,
                    last_name: userData.last_name,
                    totalNavigationRecordUser: userData.totalNavigationRecordUser,
                    sesionesUser: userData.sesionesUser,
                    city: cityData.city
                }
                groupedData.push(data);
            });
        });
        });

        let grouped = {};

        for (let item of groupedData) {
            let key = `${item.userId}-${item.first_name}-${item.last_name}`;
            
            if (!grouped[key]) {
                grouped[key] = {
                    userId: item.userId,
                    first_name: item.first_name,
                    last_name: item.last_name,
                    totalNavigationRecordUser: item.totalNavigationRecordUser,
                    sesionesUser: item.sesionesUser,
                    city: item.city
                };
            } else {
                grouped[key].totalNavigationRecordUser += item.totalNavigationRecordUser;
                grouped[key].sesionesUser += item.sesionesUser;
            }
        }

        let usuariosAgrupado = Object.values(grouped);

        countryUsers.value = usuariosAgrupado;
        currentPageCountry.value = 1;
        if(countryUsers.value.length > 0){
            usuariosPorPais.value = true;
        }
    }
}

    // ----------------- Paginación Usuarios por país  -------------------
const currentPageCountry = ref(1);

const paginatedCountryUsers = computed(() => {
  const start = (currentPageCountry.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return countryUsers.value.slice(start, end);
});

const nextPageCountry = () => {
  if (currentPageCountry.value * itemsPerPage < countryUsers.value.length) currentPageCountry.value++;
};

const prevPageCountry = () => {
  if (currentPageCountry.value > 1) currentPageCountry.value--;
};
    

// ----------------- Usuarios por ciudad  -------------------   

const usuariosPorCiudad = ref(false);
const ciudadSelected = ref('')

const resolveUsuariosPorCiudad = (city) => {
    if(ciudadSelected.value !== city){

        ciudadSelected.value = city;
        const dataRaw = Array.from(cities.value);

        let groupedData = dataRaw
        .flatMap(countryData => countryData.data)
        .find(cityData => cityData.city === city).dataUsers;

        let grouped = {};

        for (let item of groupedData) {
            let key = `${item.userId}-${item.first_name}-${item.last_name}`;
            
            if (!grouped[key]) {
                grouped[key] = {
                    userId: item.userId,
                    first_name: item.first_name,
                    last_name: item.last_name,
                    totalNavigationRecordUser: item.totalNavigationRecordUser,
                    sesionesUser: item.sesionesUser
                };
            } else {
                grouped[key].totalNavigationRecordUser += item.totalNavigationRecordUser;
                grouped[key].sesionesUser += item.sesionesUser;
            }
        }

        let usuariosAgrupado = Object.values(grouped);

        cityUsers.value = usuariosAgrupado;
        currentPageCity.value = 1;
        if(countryUsers.value.length > 0){
            usuariosPorCiudad.value = true;
        }
    }
}

     // ----------------- Paginación Usuarios por ciudad  -------------------
const currentPageCity = ref(1);

const paginatedCityUsers = computed(() => {
  const start = (currentPageCity.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return cityUsers.value.slice(start, end);
});

const nextPageCity = () => {
  if (currentPageCity.value * itemsPerPage < cityUsers.value.length) currentPageCity.value++;
};

const prevPageCity = () => {
  if (currentPageCity.value > 1) currentPageCity.value--;
};
      

// ------------------------- Sección Exportar --------------

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

async function downloadPorPais() {

  let headers = {
    userId: "userId",
    first_name: "first_name",
    last_name: "last_name",
    totalNavigationRecordUser: "totalNavigationRecordUser",
    sesionesUser: "sesionesUser",
    city: "city"
  };
  let doc = [];
  doc = Array.from(countryUsers.value);
  let title = "usuarios_" + paisSelected.value.replace(/[^A-Z0-9]+/ig, "_");
  //console.log("doc", doc);
  //if(usersFull.length > totalUsers){

  logAction("export-usersCountry");  
  /*
  await accionBackoffice({
   "usuario": userBackoffice.value.email,   
   "pagina": "trazabilidad-ubicaciones-export-usersCountry",
   "accion": "export",
   "fecha": dateNowF.value
	});  
  */
  exportCSVFile(headers, doc, title);
  // }

};

async function downloadPorCiudad() {

let headers = {
  userId: "userId",
  first_name: "first_name",
  last_name: "last_name",
  totalNavigationRecordUser: "totalNavigationRecordUser",
  sesionesUser: "sesionesUser"
};
let doc = [];
doc = Array.from(cityUsers.value);
let title = "usuarios_" + ciudadSelected.value.replace(/[^A-Z0-9]+/ig, "_");
//console.log("doc", doc);
//if(usersFull.length > totalUsers){
logAction("export-usersCity");   
/*
await accionBackoffice({
 "usuario": userBackoffice.value.email,   
 "pagina": "trazabilidad-ubicaciones-export-usersCity",
 "accion": "export",
 "fecha": dateNowF.value
  });  
  */
exportCSVFile(headers, doc, title);
// }

};

</script>

<template>
<VRow>
  <VCol lg="6" cols="12" sm="6">
  <VCard title="Resumen de datos demográficos de los últimos 30 días" :subtitle="'Datos de usuarios registrados desde '+fecha.i.format('YYYY-MM-DD')+' hasta '+fecha.f.format('YYYY-MM-DD') ">
    <VCardText>
      <div v-if="isLoading">Cargando datos...</div>
      <VList class="card-list" v-else>
        <VExpansionPanels variant="accordion" >
          <VExpansionPanel
            v-for="country in sortedCities"
            :key="country.country"
            @click="resolveUsuariosPorPais(country.country)"
          >
            <VExpansionPanelTitle class="d-flex flex-wrap justify-space-between gap-4">
              <div>
                <VAvatar class="ava" size="34" :image=" 'https://www.countryflagicons.com/FLAT/64/' + country.countryCode + '.png' " /> {{ country.country }} 
              </div>
              <div style="" :class="`d-flex align-center text-secondary`">
                <VChip label>{{ country.data.length }} {{ country.data.length > 1?"Ciudades":"Ciudad" }} </VChip>
              </div>
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <div style="border:1px solid rgba(var(--v-theme-on-background), var(--v-disabled-opacity));border-radius: 7px;">
                <VTable class="text-no-wrap" hover>
                  <thead>
                    <tr>
                      <th scope="col">Ciudad</th>
                      <th scope="col">Sesiones</th>
                      <th scope="col">Visitas de Páginas</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="clickable" v-for="city in country.data" :key="city.city" @click="resolveUsuariosPorCiudad(city.city)">
                      <td> {{ city.city }} </td>
                      <td>
                        <div :class="`d-flex align-center font-weight-semibold ${city.sesiones > 0 ? 'text-success' : 'text-error' }`">
                          <VChip label>{{ city.sesiones }} </VChip>
                        </div>
                      </td>

                      <td>
                        <div :class="`d-flex align-center font-weight-semibold ${city.sesiones > 0 ? 'text-warning' : 'text-error' }`">
                          <VChip label>{{ city.totalNavigationRecord }} </VChip>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </div>
            </VExpansionPanelText>
          </VExpansionPanel>
        </VExpansionPanels>
      </VList>
    </VCardText>

  </VCard>
    </VCol>
    <VCol lg="6" cols="12" sm="6">
            <!-- Usuarios por país -->
            <div>
              <VCard v-show="usuariosPorPais" v-if="paginatedCountryUsers.length === 0" >No existen datos</VCard>
              <VCard v-show="usuariosPorPais" v-else >
                <VCardItem class="pb-sm-0">
                  <div style="display: flex; flex-wrap: wrap;">
                    <div style="width: max-content;">
                      <VCardTitle>Usuarios de {{ paisSelected }}</VCardTitle>
                    </div>
                    <div style="margin-left: auto; margin-top: 1rem; margin-bottom: 1rem;">
                      <VBtn color="success" @click="downloadPorPais">
                        Exportar
                      </VBtn>
                    </div>
                  </div>

                  <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                    <thead>
                      <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Ciudad</th>
                        <th scope="col">Sesiones</th>
                        <th scope="col">Visitas de Páginas</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="user in paginatedCountryUsers">
                        <td class="text-high-emphasis">
                          {{ user.first_name }} {{ user.last_name }}
                        </td>
                        <td class="text-medium-emphasis">
                          {{ user.city }}
                        </td>
                        <td class="text-medium-emphasis">
                          {{ user.sesionesUser }}
                        </td>
                        <td class="text-medium-emphasis">
                          {{ user.totalNavigationRecordUser }}
                        </td>         
                      </tr>
                    </tbody>
                  </VTable>
                </VCardItem>
                <VCardItem>
                    <div class="d-flex align-center justify-space-between botonescurrentPage" >
                  <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageCountry" :disabled="currentPageCountry === 1"></VBtn>
                  Página {{ currentPageCountry }}
                  <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageCountry"
                    :disabled="(currentPageCountry * itemsPerPage) >= countryUsers.length">
                  </VBtn>
                </div>
                </VCardItem>
              </VCard>
            </div>
            <div class="mt-5">
              <!-- Usuarios por ciudad-->
              <VCard v-show="usuariosPorCiudad" v-if="paginatedCityUsers.length === 0" >No existen datos</VCard>
              <VCard v-show="usuariosPorCiudad" v-else >
                <VCardItem class="pb-sm-0">
                  <div style="display: flex; flex-wrap: wrap;">
                    <div style="width: max-content;">
                      <VCardTitle>Usuarios de la ciudad de {{ ciudadSelected }}</VCardTitle>
                    </div>
                    <div style="margin-left: auto; margin-top: 1rem; margin-bottom: 1rem;">
                      <VBtn color="success" @click="downloadPorCiudad">
                        Exportar
                      </VBtn>
                    </div>
                  </div>

                  <VTable class="text-no-wrap tableNavegacion mb-5" hover="true">
                    <thead>
                      <tr>
                        <th scope="col">Nombre</th>
                        <th scope="col">Sesiones</th>
                        <th scope="col">Visitas de Páginas</th>
                      </tr>
                    </thead>

                    <tbody>
                      <tr v-for="user in paginatedCityUsers">
                        <td class="text-high-emphasis">
                          {{ user.first_name }} {{ user.last_name }}
                        </td>
                        <td class="text-medium-emphasis">
                          {{ user.sesionesUser }}
                        </td>
                        <td class="text-medium-emphasis">
                          {{ user.totalNavigationRecordUser }}
                        </td>         
                      </tr>
                    </tbody>
                  </VTable>
                </VCardItem>
                <VCardItem>
                    <div class="d-flex align-center justify-space-between botonescurrentPage" >
                  <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageCity" :disabled="currentPageCity === 1"></VBtn>
                  Página {{ currentPageCity }}
                  <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageCity"
                    :disabled="(currentPageCity * itemsPerPage) >= cityUsers.length">
                  </VBtn>
                </div>
                </VCardItem>
              </VCard>
            </div>
          </VCol>    
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 19px;
}

.grupoBotones {
  display: flex;
  justify-content: center;
}

.v-avatar {
  border-radius: initial !important;
}

.ava {
  margin-inline-end: 16px;
}

.clickable {
  cursor: pointer;
}
</style>
