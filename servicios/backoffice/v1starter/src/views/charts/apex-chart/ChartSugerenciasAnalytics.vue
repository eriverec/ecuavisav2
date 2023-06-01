<script setup>
import { hexToRgb } from '@layouts/utils';
import { onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

const colorVariables = themeColors => {
  const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
  const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
  const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
  const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`
  
  return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
}

const vuetifyTheme = useTheme()
const data = ref([]);
const dataUsuarios = ref([]);
const { themeBorderColor, themeDisabledTextColor } = colorVariables(vuetifyTheme.current.value);
const fechaIngresada = ref([]);
const fechaSelected = ref('');
const isUsersTableVisible = ref(false);
const selectedInteres = ref('');
async function fetchData (){ 
    await fetch('https://sugerencias-ecuavisa.vercel.app/all')
      .then(response => response.json())
      .then(resp => {     
       let filtro = resp.data.filter(a=>{ return a.users_suscribed > 0});   
       data.value = filtro;  
       console.log('data',data.value);
      });
     
}
onMounted(fetchData);

const getSelectedDates =(dates)=>{
    if(dates.length > 1){
   fechaIngresada.value = dates;
    }
}

const resolveData = computed(() => {
let dataRaw;
let arrayFecha = Array.from(fechaIngresada.value);
if(arrayFecha.length > 0){
    
    let fechai = new Date(arrayFecha[0]);
    let fechaf = new Date(arrayFecha[1]);
    let dataIn = Array.from(data.value);   
    dataRaw = dataIn.filter((item) => {
        let fecha = new Date(item.created_at);
    return fecha.getTime() >= fechai.getTime() &&
           fecha.getTime() <= fechaf.getTime();
});

    

}else{
    dataRaw = Array.from(data.value);
}
const seriesFormat = {
    data: []
};

const categoriesRaw = [];
for (let i in dataRaw) {
    let num = parseInt(dataRaw[i].users_suscribed);
    seriesFormat.data.push(num);
    categoriesRaw.push(dataRaw[i].title);   
}

const options= {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false },
    },
    //colors: ['#00cfe8'],
    dataLabels: { 
      enabled: false
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '60%',
        horizontal: true,
      },
    },
    grid: {
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: false },
      },
      padding: {
        top: -10,
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor },
      },
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      categories: categoriesRaw,
      labels: {
        style: { colors: themeDisabledTextColor },
      },
    }
      }

return {series: [seriesFormat], options: options, intereses: categoriesRaw};
});

async function resolveUsuarios(value){
    let filter = data.value.filter(e=> e.title == value); 
    let id = filter[0]._id;
   
    await fetch('https://sugerencias-ecuavisa.vercel.app/sugerencia/group/usuario?' + new URLSearchParams({idSugerencia : id}))
      .then(response => response.json())
      .then(resp => {         
       dataUsuarios.value = resp.data;  
      });
    isUsersTableVisible.value = true;  
}

const resetFiltro = () =>{
    fechaIngresada.value = [];
    fechaSelected.value = '';
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
   
   //console.log('usersFull.value',usersFull.value);
  let headers = {
    userId: "userId",
    interesId: "interesId",
    meta_existe: "meta_existe",
    created_at: "created",
    first_name: "first_name",
    last_name: "last_name",
    phone_number: "phone_number",
    email: "email",
    site: "site"
  };
  let doc = [];
  doc = Array.from(dataUsuarios.value);
  let title = "users_"+selectedInteres.value.replace(/ /g,"_");
  console.log("usersFull", dataUsuarios.value);
  //console.log("doc", doc);
  //if(usersFull.length > totalUsers){
  exportCSVFile(headers, doc, title);
 // }

};
</script>

<template>
    <VRow style="display: flex; flex-wrap: wrap; row-gap: 0.1em; padding-top: 5px;">
              <VCol cols="4" >
					<div class="date-picker-wrapper" style="width:100%;" >
					<AppDateTimePicker
						prepend-inner-icon="tabler-calendar"
						density="compact"
						v-model="fechaSelected"
						show-current= true
						@on-change="getSelectedDates"
						:config="{ 	
						mode:'range',												
						altFormat: 'F j, Y',
						dateFormat: 'd-m-Y',
						maxDate: new Date(),										
						}"
					/>
					</div>
        </VCol>
          <VCol cols="3" >      
					<VSelect style="width:100%;"
                            v-model="selectedInteres"
                            :items="resolveData.intereses"
                            label="Sugerencias"
                            @update:modelValue="resolveUsuarios"
                            />
						
                </VCol>

                <VCol cols="5" style="display: flex; flex-wrap: wrap; column-gap: 0.2em; row-gap: 0.2em;" >					
						<VBtn
							color="primary"							
							@click="resetFiltro"
              :disabled="isExportLoading"
							>
							Reinciar filtro
						</VBtn>	
       
          <VBtn
            color="primary"							
            @click="downloadSelection"
            >
            Exportar
          </VBtn>
        
              </VCol>
               					
                </VRow>
  <VueApexCharts
    type="bar"
    height="400"
    :options="resolveData.options"
    :series="resolveData.series"
  />
  <VCardText v-show="isUsersTableVisible">
  <VCardTitle>Usuarios suscritos a {{ selectedInteres }}</VCardTitle> 
  <VTable class="text-no-wrap tableNavegacion mb-5" hover="true" >
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Email</th>
                <th scope="col">Número de teléfono</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item  in dataUsuarios" >
                <td >
                   {{ item.first_name}} {{ item.last_name}} 
                </td>
                <td >
                  {{ item.email }}
                </td>
                <td >
                  {{ item.phone_number }}
                </td>
                
              </tr>
            </tbody>
          </VTable>
        </VCardText>
</template>
<style type="text/css">
.bg-light {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 7px;
}

.align-items-center {
  align-items: center;
}

.disabled {
  opacity: 0.5;
  pointer-events: none;
}

/* De tema Dark a Light */
.v-theme--light .apexcharts-legend-series .apexcharts-legend-text{
  color: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
}

.v-theme--light .apexcharts-xaxis .apexcharts-xaxis-texts-g text {
  fill: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
}

.v-theme--light .apexcharts-yaxis .apexcharts-yaxis-texts-g text {
  fill: rgba(var(--v-theme-on-surface), var(--v-medium-emphasis-opacity)) !important;
}

/* De tema Light a Dark */
.v-theme--dark .apexcharts-legend-series .apexcharts-legend-text{
  color: rgba(228, 230, 244, 0.38) !important;
}
.v-theme--dark .apexcharts-xaxis .apexcharts-xaxis-texts-g text {
  fill: rgba(228, 230, 244, 0.38) !important;
}

.v-theme--dark .apexcharts-yaxis .apexcharts-yaxis-texts-g text {
  fill: rgba(228, 230, 244, 0.38) !important;
}


</style>