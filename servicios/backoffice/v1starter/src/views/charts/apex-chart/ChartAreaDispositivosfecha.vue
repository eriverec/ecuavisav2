<template>
  <!--<v-switch
  id="switch-visita"
  @change="porVisita" 
  label="Por Visita"
  ></v-switch>--->
  <VCardItem class="header_card_item">
        <div class="d-flex">
          <div class="descripcion">
            <VCardTitle>Resumen de Tecnología</VCardTitle>
            <VCardSubtitle>Categoría de dispositivos, mostrando data desde {{ selectedFecha.i.format("YYYY-MM-DD") }} hasta {{ selectedFecha.f.format("YYYY-MM-DD") }}</VCardSubtitle>
          </div>
        </div>

      <template #append>
        <div class="bg-ecuavisa py-2">
          <div class="date-picker-wrapper" style="width: 250px;">
            <VCombobox :disabled="isLoading" v-model="selectedfechaIniFin" :items="fechaIniFinList" variant="outlined" label="Fecha" persistent-hint
              hide-selected hint="" />
          </div>
        </div>
      </template>
    </VCardItem>
    <VCardText class="d-flex flex-wrap justify-space-between gap-4">
      <VBtnToggle
        density="compact"
        color="primary"
        variant="outlined"
        divided
      >
        <VBtn v-on:click="formatActividadGrafico" class="btn-check">Por páginas vistas</VBtn>
        <VBtn v-on:click="formatVisitaGrafico" >Por Sesión</VBtn>
      </VBtnToggle>

      <!-- <div class="date-picker-wrapper" style="width: 300px;">
        <AppDateTimePicker
          placeholder="Seleccionar un rango de fecha"
          prepend-inner-icon="tabler-calendar"
          density="compact"
          @on-change="obtenerFechaDispositivos"
          :config="{ 
            position: 'auto right',
            mode:'range',
            altFormat: 'F j, Y',
            dateFormat: 'm-d-Y',
            maxDate: new Date()
          }"
        />
      </div> -->
      <div :class="classLoading">
        <div class="v-row">
          <div class="v-col-9">
            <VCardText class=" px-0 mx-0">
              <VueApexCharts
                id="crejemplo"
                type="area"
                height="300"
                :options="chartConfig"
                :series="series"
                @click="handleBarClick"
              />
            </VCardText>
          </div>
          <div class="v-col-3" style="align-items: center;display: flex;">
            <VCardText>
              <VueApexCharts
                type="donut"
                height="310"
                :options="chartConfigDonut"
                :series="chartOptions.series"
              />
            </VCardText>
          </div>
        </div>
        
      </div>
  </VCardText>

</template>

<style>
.custom-tooltip {
  background: linear-gradient(72.47deg, rgb(var(--v-global-theme-primary)) 22.16%, rgba(var(--v-global-theme-primary), 0.7) 76.47%) !important;
  box-shadow: 0px 3px 1px -2px var(--v-shadow-key-umbra-opacity, rgba(0, 0, 0, 0.2)), 0px 2px 2px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.14)), 0px 1px 5px 0px var(--v-shadow-key-penumbra-opacity, rgba(0, 0, 0, 0.12));
  
  color: #fff;
  padding: 10px;
  border-radius: 5px;
}
.title {
  font-weight: bold;
}
.value {
  margin-left: 5px;
}
</style>

<script>


  import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";
  import { hexToRgb } from '@layouts/utils';
  import Moment from 'moment';
  import { extendMoment } from 'moment-range';
  import esLocale from "moment/locale/es";
  import VueApexCharts from 'vue3-apexcharts';
  import { useTheme } from 'vuetify';
  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);


  export default {
    components: {
      VueApexCharts
    },
    setup() {
      const vuetifyTheme = useTheme();
      const themeColors = vuetifyTheme.current.value;
      const themeSecondaryTextColor = `rgba(${hexToRgb(
      themeColors.colors["on-surface"]
      )},${themeColors.variables["medium-emphasis-opacity"]})`;

      const themeDisabledTextColor = `rgba(${hexToRgb(
        themeColors.colors["on-surface"]
      )},${themeColors.variables["disabled-opacity"]})`;

      const themeBorderColor = `rgba(${hexToRgb(
        String(themeColors.variables["border-color"])
      )},${themeColors.variables["border-opacity"]})`;

      const themePrimaryTextColor = `rgba(${hexToRgb(
        themeColors.colors["on-surface"]
      )},${themeColors.variables["high-emphasis-opacity"]})`;

      const columnColors = {
        series1: '#826af9',
        series2: '#d2b0ff',
        bg: '#f8d3ff',
      };

      return {
        themeSecondaryTextColor,
        themeDisabledTextColor,
        themeBorderColor,
        themePrimaryTextColor,
      }
    },
    data() {
      return {
        selectedFecha:useSelectValueCalendar("Ayer"),
        selectedfechaIniFin:"Ayer",
        fechaIniFinList:[],
        fechai:"",
        fechaf:"",
        getDataFetch:[],
        dataFormateada:[],
        getData:[],
        visita:true,
        isLoading: true,
        preguntas: [],
        preguntasData: [],
        preguntasConCount: [],
        params: {},
        trivias: [],
        dateRangeModel: null,
        chartList: [],
        series: [],
        chartOptions: {
          series: [],
          labels: [],
        },
      };
    },
    computed: {
      classLoading() {
        return this.isLoading ? 'w-100 disabled' : 'w-100'
      },
      chartConfig() {
        var vuetifyTheme_2 = useTheme();
        var themeColors_2 = vuetifyTheme_2.current.value;
        var themeSecondaryTextColor_2 = `rgba(${hexToRgb(
        themeColors_2.colors["on-surface"]
        )},${themeColors_2.variables["medium-emphasis-opacity"]})`;

        var themeDisabledTextColor_2 = `rgba(${hexToRgb(
          themeColors_2.colors["on-surface"]
        )},${themeColors_2.variables["disabled-opacity"]})`;

        var themeBorderColor_2 = `rgba(${hexToRgb(
          String(themeColors_2.variables["border-color"])
        )},${themeColors_2.variables["border-opacity"]})`;

        var themePrimaryTextColor_2 = `rgba(${hexToRgb(
          themeColors_2.colors["on-surface"]
        )},${themeColors_2.variables["high-emphasis-opacity"]})`;

        this.themeSecondaryTextColor= themeSecondaryTextColor_2;
        this.themeDisabledTextColor= themeDisabledTextColor_2;
        this.themeBorderColor= themeBorderColor_2;
        this.themePrimaryTextColor= themePrimaryTextColor_2;

        const areaColors = {
          series3: "#e0cffe",
          series2: "#b992fe",
          series1: "#ab7efd",
        };

        return {
          visita:this.visita,
          chart: {
            id: "crejemplo",
            //type: "area",
            parentHeightOffset: 0,
            zoom: { enabled: false },
            toolbar: { show: false },
          },
          plotOptions: {
            bar: {
              distributed: true,
              dataLabels: {
                style: {
                  cursor: 'pointer'
                }
              }
            }
          },
          tooltip: {
            shared: false,
            enabled: true,
            custom: function({series, seriesIndex, dataPointIndex, w}) {
              //this.ctx.xaxis.categories[dataPointIndex] 
              var value = series[seriesIndex][dataPointIndex];
              var text = !w.config.visita?"Sesiones":"Páginas visitadas";
              if(value<2){
                text = !w.config.visita?"Sesión":"Página visitada";
              }
              return '<div class="custom-tooltip">' +
                '<span class="title">Día:</span>' +
                '<span class="value">' + w.globals.categoryLabels[dataPointIndex]+ '</span>' +
                '<br>' +
                //'<span class="title">Ventas:</span>' +
                '<span class="value">' + value +" " +text +'</span>' +
              '</div>'
            },
            /*y: {
              formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
                return 'Ventas: $' + value
              }
            },*/
            style: {
              fontSize: "12px",
              fontFamily: undefined,
            },
          },

          dataLabels: { enabled: false },
          stroke: {
            show: false,
            curve: "smooth",
          },
          legend: {
            position: "top",
            horizontalAlign: "left",
            labels: { colors: this.themeSecondaryTextColor },
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
            type: "solid",
          },
          grid: {
            show: true,
            borderColor: this.themeBorderColor,
            xaxis: {
              lines: { show: true },
            },
          },
          yaxis: {
            labels: {
              style: { colors: this.themeDisabledTextColor },
            },
          },
          xaxis: {
            /**/axisBorder: { show: false },
            axisTicks: { color: this.themeBorderColor },
            crosshairs: {
              stroke: { color: this.themeBorderColor },
            },
            labels: {
              style: { colors: this.themeDisabledTextColor },
            },
            categories: [],
          },
        };
      },
      chartConfigDonut(){
        var vuetifyTheme_2 = useTheme();
        var themeColors_2 = vuetifyTheme_2.current.value;
        var themeSecondaryTextColor_2 = `rgba(${hexToRgb(
        themeColors_2.colors["on-surface"]
        )},${themeColors_2.variables["medium-emphasis-opacity"]})`;

        var themeDisabledTextColor_2 = `rgba(${hexToRgb(
          themeColors_2.colors["on-surface"]
        )},${themeColors_2.variables["disabled-opacity"]})`;

        var themeBorderColor_2 = `rgba(${hexToRgb(
          String(themeColors_2.variables["border-color"])
        )},${themeColors_2.variables["border-opacity"]})`;

        var themePrimaryTextColor_2 = `rgba(${hexToRgb(
          themeColors_2.colors["on-surface"]
        )},${themeColors_2.variables["high-emphasis-opacity"]})`;

        this.themeSecondaryTextColor= themeSecondaryTextColor_2;
        this.themeDisabledTextColor= themeDisabledTextColor_2;
        this.themeBorderColor= themeBorderColor_2;
        this.themePrimaryTextColor= themePrimaryTextColor_2;
        
        const donutColors = {
          series1: '#6152d9',
          series2: '#00d4bd',
          series3: '#826bf8',
          series4: '#32baff',
          series5: '#5288d9',
        }
        return {
          chart: {
            type: 'donut',
          },
          stroke: { width: 0 },
          labels: this.chartOptions.labels,
          series: this.chartOptions.series,
          colors: [donutColors.series1, donutColors.series5, donutColors.series3, donutColors.series2],
          dataLabels: {
            enabled: true,
            formatter: val => `${parseInt(val, 10)}%`,
          },
          legend: {
            position: 'bottom',
            markers: { offsetX: -3 },
            labels: { colors: this.themeSecondaryTextColor },
            itemMargin: {
              vertical: 3,
              horizontal: 10,
            },
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1.5rem',
                  },
                  value: {
                    fontSize: '0.8rem',
                    color: this.themeSecondaryTextColor,
                    formatter: val => `${parseInt(val, 10)} dispositivos`,
                  },
                  total: {
                    show: false,
                    fontSize: '1.5rem',
                    label: 'Total',
                    formatter: () => '37%',
                    color: this.themePrimaryTextColor,
                  },
                },
              },
            },
          },
          responsive: [
            {
              breakpoint: 992,
              options: {
                chart: {
                  height: 380,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
            {
              breakpoint: 576,
              options: {
                chart: {
                  height: 320,
                },
                plotOptions: {
                  pie: {
                    donut: {
                      labels: {
                        show: true,
                        name: {
                          fontSize: '1rem',
                        },
                        value: {
                          fontSize: '1rem',
                        },
                        total: {
                          fontSize: '1rem',
                        },
                      },
                    },
                  },
                },
              },
            },
          ],
        }
      }
    },
    methods: {
      handleBarClick(event, chartContext, config) {
        // Aquí puedes manejar la lógica cuando se hace clic en una barra del gráfico
        // Puedes acceder a la información sobre la barra clicada utilizando la variable "config"
        // console.log(config.dataPointIndex); // Índice de la barra clicada
        // console.log(config.seriesIndex); // Índice de la barra clicada
        // console.log(config); // Valor en el eje X de la barra clicada
        // console.log(config.globals.categoryLabels[config.dataPointIndex]); // Valor en el eje X de la barra clicada
        // console.log(config.globals.seriesNames[config.seriesIndex]); // Valor en el eje X de la barra clicada
      },
      groupBy(collection, property){
        var i = 0, val, index,
        values = [], result = [];
        for (; i < collection.length; i++) {
            val = collection[i][property];
            index = values.indexOf(val);
            if (index > -1)
                result[index].push(collection[i]);
            else {
                values.push(val);
                result.push([collection[i]]);
            }
        }
        return result;
      },
      existeFecha (list, fecha){
        for(var i in list){
          if(list[i].x == fecha){
            return {resp:true,index:i,value:list[i].y};
          }
        }
        return {resp:false};
      },
      async getDataTrazabilidad(data) {
        var trazabilidad = data;
        var grafico = [];
        
        // Paso 1: Identificar fecha mínima y máxima
        var minDate = Infinity;
        var maxDate = -Infinity;
        
        for (var i in trazabilidad) {
          var principal = trazabilidad[i];

          for (var j in principal.data) {
            var datosDentro = principal.data[j];
            var date = new Date(datosDentro.timestamp);
            if (date < minDate) {
              minDate = date;
            }
            if (date > maxDate) {
              maxDate = date;
            }
          }
        }
        
        // Paso 2: Crear conjunto de fechas únicas
        var uniqueDates = [];
        var currentDate = new Date(minDate);
        
        while (currentDate <= maxDate) {
          uniqueDates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        
        for (var i in trazabilidad) {
          var principal = trazabilidad[i];
          var dataTemp = [];
          var totalSesiones = 0;
          var totalNavegaciones = 0;
          
          // Paso 3: Agregar fechas faltantes con valor de 0
          for (var j in uniqueDates) {
            var date = uniqueDates[j];
            var foundData = principal.data.find(d => new Date(d.timestamp).getTime() === date.getTime());
            if (foundData) {
              dataTemp.push({
                "x": foundData.timestamp,
                "y": this.visita ? foundData.totalNavigationRecord : foundData.sesiones
              });
              totalSesiones += foundData.sesiones * 1;
              totalNavegaciones += foundData.totalNavigationRecord * 1;
            } else {
              dataTemp.push({
                "x": moment(date).format("YYYY-MM-DD"),
                "y": 0
              });
            }
          }
          
          // Paso 4: Ordenar por fecha
          dataTemp.sort((a, b) => (new Date(a.x) - new Date(b.x)));
          
          grafico.push({
            "name": principal.device,
            "data": dataTemp,
            "total": parseInt(this.visita ? totalSesiones : totalNavegaciones)
          });
        }
        
        return grafico.sort((a, b) => (b.total - a.total));
      },
      async getInitGraficoDispositivos(){
        // var fechai = moment().add(-6, 'days').format("MM/DD/YYYY");
        // var fechaf = moment().add(1, 'days').format("MM/DD/YYYY");
        //var panelGrafico = document.querySelector("#apexchartscrejemplo");
        //panelGrafico.classList.add("disabled");

        this.selectedFecha = useSelectValueCalendar("Ayer");
        // console.log(selected)
        this.fechai = this.selectedFecha.i.format("MM/DD/YYYY");
        this.fechaf = this.selectedFecha.f.format("MM/DD/YYYY");

        this.isLoading = true;

        this.getData = await this.getDataGrafico(this.fechai, this.fechaf);
        //panelGrafico.classList.remove("disabled");

        this.isLoading = false;
        this.dataFormateada = await this.getDataTrazabilidad(this.getData);

        ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
        this.formatGraficoDonutVisita();
        return true;
      },
      async getDataGrafico(fechai, fechaf) {
        /*FORMATO DE FECHA A ENVIAR ES MM/DD/AAAA*/
        // var raw = JSON.stringify({
        //     "fechai": fechai,
        //     "fechaf": fechaf
        // });
        var resp = await fetch(`https://servicio-de-actividad.vercel.app/dispositivos/v2/all?fechai=${fechai}&fechaf=${fechaf}`,{
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
          },
          // body: raw
        }); 
        // var resp = await fetch(`https://servicio-de-actividad.vercel.app/grafico/dispositivos`,{
        //   method: 'POST',
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: raw
        // }); 
        var obtener = await resp.json();
        this.getDataFetch = obtener.data;
        return obtener.data;
      },
      async obtenerFechaDispositivos(selectedDates, dateStr, instance){
        //var respJson = await nuevoArchivoJson(archivoJson);
        if(selectedDates.length > 1){
          this.fechai = moment(selectedDates[0]).format('MM/DD/YYYY');
          this.fechaf = moment(selectedDates[1]).format('MM/DD/YYYY');
          //var panelGrafico = document.querySelector("#apexchartscrejemplo");
          //panelGrafico.classList.add("disabled");

          this.isLoading = true;
          this.getData = await this.getDataGrafico(this.fechai, this.fechaf);
          this.isLoading = false;
          //panelGrafico.classList.remove("disabled");
          this.formatGraficoDonutSesion();
          this.dataFormateada = await this.getDataTrazabilidad(this.getData);
          ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
          this.formatGraficoDonutVisita();
        }
      },
      async formatVisitaGrafico(){
        if(this.dataFormateada.length > 0 || true){
          this.isLoading = true;
          this.visita = false;
          this.dataFormateada = await this.getDataTrazabilidad(this.getData);
          ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
          this.formatGraficoDonutSesion();
          this.isLoading = false;
        }
      },
      async formatActividadGrafico(){
        if(this.dataFormateada.length > 0 || true){
          this.visita = true;
          this.isLoading = true;
          this.dataFormateada = await this.getDataTrazabilidad(this.getData);
          ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
          this.isLoading = false;
          this.formatGraficoDonutVisita();
        }
      },
      formatGraficoDonutSesion(){
        var trazabilidad = this.getDataFetch;
        var grafico = [];
        var seriesTemp = [];
        var labelsTemp = [];
        for(var i in trazabilidad){
          var principal = trazabilidad[i];
          var totalSesiones = 0;
          var totalNavegaciones = 0;

          for(var j in principal.data){
            var datosDentro = principal.data[j];
            totalSesiones += datosDentro.sesiones *1;
            totalNavegaciones += datosDentro.totalNavigationRecord *1;
          }
          
          labelsTemp.push(principal.device);
          seriesTemp.push(parseInt(!this.visita?totalSesiones:totalNavegaciones));

        }

        this.chartOptions.series = seriesTemp;
        this.chartOptions.labels = labelsTemp;
      },
      formatGraficoDonutVisita(){
        var trazabilidad = this.getDataFetch;
        var grafico = [];
        var seriesTemp = [];
        var labelsTemp = [];
        for(var i in trazabilidad){
          var principal = trazabilidad[i];
          var totalSesiones = 0;
          var totalNavegaciones = 0;

          for(var j in principal.data){
            var datosDentro = principal.data[j];
            totalSesiones += datosDentro.sesiones *1;
            totalNavegaciones += datosDentro.totalNavigationRecord *1;
          }
          
          labelsTemp.push(principal.device);
          seriesTemp.push(parseInt(!this.visita?totalSesiones:totalNavegaciones));
        }

        this.chartOptions.series = seriesTemp;
        this.chartOptions.labels = labelsTemp;
      }
    },
    async mounted() {
      this.selectedFecha = useSelectValueCalendar("Ayer");
      const valoresItemsCalendar = useSelectValueCalendar();
      this.fechaIniFinList = useSelectCalendar();

      var resp = await this.getInitGraficoDispositivos();
    },
    updated() {
      //console.log("El DOM ha sido actualizado");
    },

    watch: {
      async selectedfechaIniFin(newFecha, oldFecha) {
        this.selectedFecha = useSelectValueCalendar(newFecha);
        // console.log(selected)
        this.fechai = this.selectedFecha.i.format("MM/DD/YYYY");
        this.fechaf = this.selectedFecha.f.format("MM/DD/YYYY");
        
        // this.fechai = moment(selectedDates[0]).format('MM/DD/YYYY');
        // this.fechaf = moment(selectedDates[1]).format('MM/DD/YYYY');
        //var panelGrafico = document.querySelector("#apexchartscrejemplo");
        //panelGrafico.classList.add("disabled");

        this.isLoading = true;
        this.getData = await this.getDataGrafico(this.fechai, this.fechaf);
        this.isLoading = false;
        //panelGrafico.classList.remove("disabled");
        this.formatGraficoDonutSesion();
        this.dataFormateada = await this.getDataTrazabilidad(this.getData);
        ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
        this.formatGraficoDonutVisita();
      }
    }
  }
</script>
