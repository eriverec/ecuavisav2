<script setup>
  import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";
  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);

  const dominio = "https://ecuavisa-suscripciones.vercel.app";

  const configSnackbar = ref({
      message: "Datos guardados",
      type: "success",
      model: false
  });

  const mesesDelAnio = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ];

  const headersGlobal = ref({
    _id: "_id",
    wylexId: "wylexId",
    site: "site",
    site_id: "site_id",
    email: "email",
    first_name: "first_name",
    last_name: "last_name",
    avatar: "avatar",
    created_at: "created_at",
    logged_at: "logged_at",
    logged_at_site: "logged_at_site",
    updated_at: "updated_at",
    validated_at: "validated_at",
    banned_at: "banned_at",
    country: "country",
    phone_prefix: "phone_prefix",
    phone_number: "phone_number",
    gender: "gender",
    birth_date: "birth_date",
    identification_type: "identification_type",
    identification_number: "identification_number",
    newsletter_opt_in: "newsletter_opt_in",
    provider: "provider",
    platform: "platform",
    created_in_os: "created_in_os",
    ciudad:"ciudad",
    telefono:"telefono",
    birthDate:"birthDate",
    reembolso_created_at:"reembolso_created_at",
    reembolso_estado:"reembolso_estado",
    transaction_id:"transaction_id",
    package_details_fechaInicio:"package_details_fechaInicio",
    package_details_fechaBaja:"package_details_fechaBaja",
    package_details_prox_pago:"package_details_prox_pago",
    package_details_valorPagar:"package_details_valorPagar",
    package_details_precio_promocion:"package_details_precio_promocion",
    package_details_ciclos_promocion:"package_details_ciclos_promocion",
    package_details_ciclo_promocion_actual:"package_details_ciclo_promocion_actual",
    billing_details_nombres:"billing_details_nombres",
    billing_details_email:"billing_details_email",
    billing_details_apellidos:"billing_details_apellidos",
    billing_details_cedula:"billing_details_cedula",
    billing_details_telefono:"billing_details_telefono",
    billing_details_pais:"billing_details_pais",
    billing_details_ciudad:"billing_details_ciudad",
    billing_details_direccion:"billing_details_direccion",
    billing_details_ndireccion_opcional:"billing_details_ndireccion_opcional",
    transaction_status:"transaction_status",
    transaction_current_status:"transaction_current_status",
    transaction_status_detail:"transaction_status_detail",
    transaction_payment_date:"transaction_payment_date",
    transaction_amount:"transaction_amount",
    transaction_carrier_code:"transaction_carrier_code",
    transaction_message:"transaction_message",
    transaction_authorization_code:"transaction_authorization_code",
    transaction_dev_reference:"transaction_dev_reference",
    transaction_carrier:"transaction_carrier",
    transaction_product_description:"transaction_product_description",
    transaction_payment_method_type:"transaction_payment_method_type",
    transaction_trace_number:"transaction_trace_number",
    transaction_lot_number:"transaction_lot_number",
    mes:"mes",
  });

  const isLoading = ref(false);

  const selectModelAnio = ref(2024);
  const selectAnio = [2025, 2024, 2023, 2022];

  const selectMes = [
    {"title":'Enero',"value":"01"},
    {"title":'Febrero',"value":"02"},
    {"title":'Marzo',"value":"03"},
    {"title":'Abril',"value":"04"},
    {"title":'Mayo',"value":"05"},
    {"title":'Junio',"value":"06"},
    {"title":'Julio',"value":"07"},
    {"title":'Agosto',"value":"08"},
    {"title":'Septiembre',"value":"09"},
    {"title":'Octubre',"value":"10"},
    {"title":'Noviembre',"value":"11"},
    {"title":'Diciembre',"value":"12"}
  ];
  const mesHoy = moment().format("MM");
  const selectModelMes = ref(mesHoy);

  const selectModelPaquete = ref(null);
  const selectItemsPaquete = ref([]);
  const selectItemsPaqueteCopy = ref([]);
  const selectRefPaquete = ref(null);
  const paqueteModelLoading = ref(false);
  const searchPaqueteModel = ref(null);

  const btnLoadingDescargar = ref(false);

  const graficoDisabled = ref(false);
  const dataGrafico = ref([]);

  watch(async () => searchPaqueteModel.value, async () => {
    if (!searchPaqueteModel.value) {
      selectItemsPaquete.value = selectItemsPaqueteCopy.value;
    }else{
      selectItemsPaquete.value = selectItemsPaqueteCopy.value.filter((video) => {
        return video.title.toLowerCase().indexOf(searchPaqueteModel.value.toLowerCase()) > -1;
      });
    }
  });

  watch(selectRefPaquete, (active) => {
    if(!active){
      setTimeout(()=>{
        searchPaqueteModel.value = "";
      }, 1000)
    }
  });

  async function getPaquetes(page = 1, limit= 10){
    try {
        paqueteModelLoading.value = true;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow'
        };

        var response = await fetch(`${dominio}/paquete/backoffice/display-all`, requestOptions);
        const data = await response.json();

        selectItemsPaquete.value = data.data.reduce((acumulador, actual) => {
          acumulador.push({
            title: `${actual.nombre}`,
            value: actual._id,
          });
          return acumulador;
        }, []);
        selectItemsPaqueteCopy.value = selectItemsPaquete.value;
        selectModelPaquete.value = "651c9d012ff9fa09a75e6c16";
        paqueteModelLoading.value = false;
        
    } catch (error) {
        configSnackbar.value = {
            message: "No se pudo recuperar los paquetes, recargue de nuevo.",
            type: "error",
            model: true
        };
        return console.error(error.message);    
    }
  }

  async function getDataGrafico(json = {}){
    try {
      const { anio = null, idPaquete = null, mes = null, estado = 1 } = json;

      graficoDisabled.value = true;
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`${dominio}/backoffice-grafico/reembolsos-realizados-agrupados-por-dia?estado=${estado}&mes=${mes}&anio=${anio}&idPaquete=${idPaquete}`, requestOptions);
      const data = await response.json();

      dataGrafico.value = data.data;
      graficoDisabled.value = false;
        
    } catch (error) {
        configSnackbar.value = {
            message: "No se pudo recuperar los datos, recargue de nuevo.",
            type: "error",
            model: true
        };
        return console.error(error.message);    
    }
  }

  // GRAFICO
  import { hexToRgb } from '@layouts/utils';
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify';

  // 👉 Colors variables
  const colorVariables = themeColors => {
    const themeSecondaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['medium-emphasis-opacity']})`
    const themeDisabledTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['disabled-opacity']})`
    const themeBorderColor = `rgba(${hexToRgb(String(themeColors.variables['border-color']))},${themeColors.variables['border-opacity']})`
    const themePrimaryTextColor = `rgba(${hexToRgb(themeColors.colors['on-surface'])},${themeColors.variables['high-emphasis-opacity']})`
    
    return { themeSecondaryTextColor, themeDisabledTextColor, themeBorderColor, themePrimaryTextColor }
  }

  const vuetifyTheme = useTheme();

  const getAreaChartSplineConfig = themeColors => {
    const areaColors = {
      series3: '#b992fe',
      series2: '#e0cffe',
      series1: '#ab7efd',
    }

    const { themeSecondaryTextColor, themeBorderColor, themeDisabledTextColor } = colorVariables(themeColors)
    
    const seriesTemp = [];
    const seriesTempCategorias = [];
    for(var i in dataGrafico.value){
      const dias = dataGrafico.value[i];
      seriesTemp.push(dias.reembolsos);
      seriesTempCategorias.push(dias.fecha);
    }

    return {
      config: {
        chart: {
          parentHeightOffset: 0,
          toolbar: { show: false },
          type: 'bar',
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            dataLabels: {
              position: 'top', // top, center, bottom
            },
          }
        },
        dataLabels: { 
          enabled: false,
          formatter(val) {
            return `${ val } $`
          },
          offsetY: -20,
        },
        xaxis: {
          axisBorder: { show: false },
          axisTicks: { color: themeBorderColor, show: false },
          crosshairs: {
            stroke: { color: themeBorderColor },
            fill: {
              type: 'gradient',
              gradient: {
                colorFrom: '#D8E3F0',
                colorTo: '#BED1E6',
                stops: [0, 100],
                opacityFrom: 0.4,
                opacityTo: 0.5,
              }
            }
          },
          tooltip: {
            enabled: false,
          },
          labels: {
            style: { colors: themeDisabledTextColor },
          },
          // categories: mesesDelAnio,
          categories: seriesTempCategorias,
          position: 'top',
        },
        yaxis: {
          axisBorder: {
            show: false
          },
          axisTicks: {
            show: false,
          },
          title: {
            text: 'Num. Reembolsos',
            style: {
                fontSize: '11px',
                fontFamily: 'Public Sans',
                color: themeDisabledTextColor
            }
          },
          labels: {
            style: { colors: themeDisabledTextColor },
          },
        },
        // title: {
        //   text: 'Monthly Inflation in Argentina, 2002',
        //   floating: true,
        //   offsetY: 330,
        //   align: 'center',
        //   style: {
        //     color: '#444'
        //   }
        // },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " reembolsos"
            }
          },
          theme: false,
          custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            // series[seriesIndex]
            // console.log(w.globals.labels[dataPointIndex])
            return `<div class="tooltip-content">
              <div class="tooltip-body">
                <div class="tooltip-title">
                  ${moment(w.globals.labels[dataPointIndex], "YYYY-MM-DD").format("MMM Do dddd YYYY")}
                </div>
                <!--<div class="tooltip-subtitle">
                  Campaña
                </div>-->
                <div class="tooltip-data-flex">
                  <div class="tooltip-data-title">
                    ${w.config.series[seriesIndex].name}
                  </div>
                  <div class="tooltip-data-value">
                    ${series[seriesIndex][dataPointIndex]} 
                  </div>
                </div>
              </div>
            </div>`
          }
        },
        stroke: {
          show: false,
          curve: 'straight',
        },
        legend: {
          position: 'top',
          horizontalAlign: 'left',
          labels: { colors: themeSecondaryTextColor },
          markers: {
            offsetY: 1,
            offsetX: -3,
          },
          itemMargin: {
            vertical: 3,
            horizontal: 10,
          },
        },
        colors: [areaColors.series3, areaColors.series2, areaColors.series1],
        fill: {
          opacity: 1,
          type: 'solid',
        },
        grid: {
          show: true,
          borderColor: themeBorderColor,
          xaxis: {
            lines: { show: true },
          },
        },
      },
      series: [
        {
          name: 'Reembolsos realizados',
          data: seriesTemp
        }
      ]
    }
  }

  const chartConfig = computed(() => getAreaChartSplineConfig(vuetifyTheme.current.value))
  // FIN GRAFICO

  // EVENTOS SELECT
  // FIN EVENTOS SELECT

  onMounted(async ()=>{
    isLoading.value = true;
    await getPaquetes();
    isLoading.value = false;
  })

  watch(async () => selectModelAnio.value, async () => {
    if (selectModelAnio.value && selectModelPaquete.value && selectModelMes.value) {
      await getDataGrafico({
        anio: selectModelAnio.value,
        mes:selectModelMes.value,
        idPaquete:selectModelPaquete.value
      });
    }
  });

  watch(async () => selectModelPaquete.value, async () => {
    if (selectModelPaquete.value && selectModelAnio.value && selectModelMes.value) {
      await getDataGrafico({
        anio: selectModelAnio.value,
        mes:selectModelMes.value,
        idPaquete:selectModelPaquete.value
      });
    }
  });

  watch(async () => selectModelMes.value, async () => {
    if (selectModelAnio.value && selectModelPaquete.value && selectModelMes.value) {
      await getDataGrafico({
        anio: selectModelAnio.value,
        mes:selectModelMes.value,
        idPaquete:selectModelPaquete.value
      });
    }
  });

  // DESCARGAR
  const dataFullExportar = ref([]);
  const urlApiExport = ref(dominio + "/backoffice-grafico/descargar/reembolsos-realizados-agrupados-por-dia");
  const urlTitleExport = ref("reembolsos_realizados_dia");

  const docsExportNumberLength = ref({
    tamanioActual : 0,
    tamanioTotal : 0
  });

  // PASO 7
  function convertToCSV(objArray) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "";

      for (var i = 0; i < array.length; i++) {
          var line = "";
          for (var index in array[i]) {
              if (line != "") line += ",";

              // Envolver valores que contienen comas entre comillas dobles
              var value = array[i][index];
              if (typeof value === "string" && value.includes(",")) {
                  value = `"${value}"`;
              }

              line += value;
          }

          str += line + "\r\n";
      }

      return str;
  }

  // PASO 6
  function exportCSVFile(headers, items, fileTitle) {
    // if (headers && items[0].wylexId !== "wylexId") {
    //   items.unshift(headers);
    // }

    items.unshift(headers);
    console.log("items", items)

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

  // PASO 5
  function generateSlug(text) {
      // Crear un mapa de caracteres con tilde y ñ a sus reemplazos
      const map = {
          'á': 'a',
          'é': 'e',
          'í': 'i',
          'ó': 'o',
          'ú': 'u',
          'Á': 'A',
          'É': 'E',
          'Í': 'I',
          'Ó': 'O',
          'Ú': 'U',
          'ñ': 'n',
          'Ñ': 'N'
      };

      // Reemplazar cada carácter del mapa en el texto
      const slug = text.split('').map(char => map[char] || char).join('');

      // Convertir a minúsculas, eliminar caracteres no deseados y reemplazar espacios por guiones
      return slug.toLowerCase()
                 .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres que no sean letras, números, espacios o guiones
                 .replace(/\s+/g, '-')         // Reemplazar espacios por guiones
                 .replace(/-+/g, '-')+"-"+moment().format("YYYY-MM-DD-HH-mm-ss");         // Reemplazar múltiples guiones por uno solo
  }

  // PASO 3
  async function getDataExportarServer(page = 1, limit = 10, estado = 1, idPaquete = null, anio = 2024, mes = null) {
    try {

      if(!idPaquete){
        return false;
      }

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      var response = await fetch(`${urlApiExport.value}?page=${page}&limit=${limit}&anio=${anio}&mes=${mes}&idPaquete=${idPaquete}&estado=${estado}`, requestOptions);
      
      const data = await response.json();

      if(data.resp){
        return data;
      }else{
        configSnackbar.value = {
            message: "No se pudo recuperar los usuarios, recargue de nuevo.",
            type: "error",
            model: true
        };
        btnLoadingDescargar.value = false;
        return null;
      }
    } catch (error) {
      configSnackbar.value = {
          message: "No se pudo recuperar los usuarios, recargue de nuevo.",
          type: "error",
          model: true
      };
      console.error(error.message);
      btnLoadingDescargar.value = false;
      return null;
    }
  }

  // PASO 4
  function eliminarDuplicadosPorWylexId(array) {
      const vistos = new Set();
      return array.filter(item => {
          if (vistos.has(item.wylexId)) {
              return false; // Eliminar duplicado
          } else {
              vistos.add(item.wylexId);
              return true; // Mantener el primer encuentro
          }
      });
  }

  // PASO 2
  async function fetchFullDescargar(){

    docsExportNumberLength.value = {
      tamanioActual : 0,
      tamanioTotal : 0
    };

    dataFullExportar.value = [];
    var estado = 1;
    var anio = 2024;
    var idPaquete = selectModelPaquete.value;
    var mes = selectModelMes.value;
    var pages = 1;
    while(true){
      const res = await getDataExportarServer(
        pages,
        500,
        estado,
        mes,
        idPaquete,
        anio
      );

      const responseData = res.data;
      const totalDataExportar = "-";

      for(var keyUsuarioReembolso in responseData){
        const reembolsosData = responseData[keyUsuarioReembolso];
        const usuariosReembolsos = reembolsosData.user || {};

        // Nuevo objeto para cada elemento de responseData
        let newItem = {}; 

        // Recorremos las claves de usuarios
        for (let key in headersGlobal.value) {
            // Verificamos si la clave existe en item y la agregamos al nuevo objeto
            if (usuariosReembolsos.hasOwnProperty(key)) {
              newItem[key] = usuariosReembolsos[key];
            }else{
              newItem[key] = "";
            }
        }

        for (let key in reembolsosData) {
            // Verificamos si la clave existe en item y la agregamos al nuevo objeto
            if(key != "user"){

              if (key == "created_at") {
                newItem["reembolso_created_at"] = reembolsosData[key];
              }else{
                if (key == "estado") {
                  newItem["reembolso_estado"] = reembolsosData[key];
                }else{
                  newItem[key] = reembolsosData[key];
                }
              }

              if (key == "billing_details_direccion") {
                newItem["billing_details_direccion"] = reembolsosData[key];
              }

            }
        }

        // newItem["reembolso_created_at"] = reembolsosData.created_at;
        // newItem["reembolso_estado"] = reembolsosData.estado;
        // newItem["created_at_reembolso"] = reembolsosData.created_at;
        
        // Agregamos el nuevo objeto a dataFullExportar.value
        dataFullExportar.value.push(newItem);
      }

      // responseData.forEach((usuariosReembolsos) => {
        
      // });

      docsExportNumberLength.value.tamanioActual = dataFullExportar.value.length;
      docsExportNumberLength.value.tamanioTotal = totalDataExportar;

      dataFullExportar.value.sort((a, b) => moment(b.created_at_reembolso, 'DD/MM/YYYY-HH:mm:ss').diff(moment(a.created_at_reembolso, 'DD/MM/YYYY-HH:mm:ss')));

      pages++;

      if(responseData.length < 1){
        break;
      }
    }

    // console.log(dataFullExportar.value)

    return true;
  };

  // PASO 1
  async function downloadSearch() {
    try {

      btnLoadingDescargar.value=true;
      await fetchFullDescargar();
      btnLoadingDescargar.value=false;

      let doc = [];
      doc = dataFullExportar.value
      var title = `${urlTitleExport.value}-`+ generateSlug(selectItemsPaquete.value.find(c => selectModelPaquete.value == c.value).title);

      exportCSVFile(headersGlobal.value, eliminarDuplicadosPorWylexId(doc), title);

    } catch (error) {
        console.log(error)
        configSnackbar.value = {
            message: "No se pudo recuperar los datos de registros para exportar, recargue de nuevo.",
            type: "error",
            model: true
        };
        return false;
    }
  };
  // FIN DESCARGAR

</script>


<template>
  <section>
    <VSnackbar 
      v-model="configSnackbar.model" 
      location="top end" 
      variant="flat" 
      :timeout="configSnackbar.timeout || 2000" 
      :color="configSnackbar.type">
        {{ configSnackbar.message }}
    </VSnackbar>

    <VRow>
      <VCol
        class="mt-0"
        cols="12"
        md="12"
        lg="12"
      >
        
        <VCard>
          <VCardItem>
            <div class="p-0 d-flex flex-column align-items-start">
              <VCardTitle>
                Año {{selectModelAnio}}.<br>Reembolsos realizados por día.
              </VCardTitle>
              <VCardSubtitle>
                Debes seleccionar el paquete para ver los resultados<br> de reembolsos.
              </VCardSubtitle>
            </div>
            <template #append>
              <div class="d-flex align-top justify-content-flex-end flex-wrap flex-column gap-0">
                <VBtn
                  :loading="btnLoadingDescargar"
                  :disabled="btnLoadingDescargar"
                  color="primary"
                  @click="downloadSearch"
                >
                  Descargar
                  <VIcon
                    end
                    icon="tabler-cloud-download"
                  />
                </VBtn>
                <small class="px-0 py-1 text-disabled" v-if="btnLoadingDescargar">
                  Exportando {{ docsExportNumberLength.tamanioActual }} / {{ docsExportNumberLength.tamanioTotal }} registros
                </small>
              </div> 
            </template>
          </VCardItem>

          <VCardText>
            <VCombobox
              class="mb-4"
                v-model="selectModelAnio" 
                :items="selectAnio"
                label="Filtro de año" 
                :menu-props="{ maxHeight: '300' }"
              />
            <div class="p-0 mt-0 mb-3 d-flex align-items-center flex-nowarp gap-3">
              
              <VSelect
                style="width: 45px;"
                v-model="selectModelMes" 
                :items="selectMes"
                label="Filtro de mes" 
                item-text="title"
                item-value="value"
                :menu-props="{ maxHeight: '300' }"
              />
              <VSelect
                  style="width: 275px;"
                  v-model:menu="selectRefPaquete"
                  no-data-text="No existen paquetes que mostrar"
                  append-icon="mdi-refresh"
                  @click:append="getPaquetes"
                  :disabled="paqueteModelLoading"
                  item-text="title"
                  item-value="value"
                  v-model="selectModelPaquete" 
                  :items="selectItemsPaquete"
                  label="Filtro paquetes"
                  :menu-props="{ maxHeight: '400' }">
                  <template v-slot:prepend-item>
                    <v-list-item>
                      <v-list-item-content>
                        <VTextField v-model="searchPaqueteModel" clearable placeholder="Buscar paquetes"/>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>
                  </template>
                  <template #selection="{ item }">
                        <div>
                            {{ item.title }}
                        </div>
                    </template>
                    <template #item="{ item, props }">
                        <v-list-item v-bind="props">
                            <v-list-item-content>
                                <v-list-item-subtitle>
                                    <p>_id: {{ item.value }}</p>
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                </VSelect>
            </div>
            <div v-if="isLoading">Cargando datos...</div>
            <div v-else>
              <VueApexCharts
                type="bar"
                height="300"
                :options="chartConfig.config"
                :series="chartConfig.series"
              />
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style scoped>

</style>

