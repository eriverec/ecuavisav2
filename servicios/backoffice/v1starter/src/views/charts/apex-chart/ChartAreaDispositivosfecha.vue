<template>
  <!--<v-switch
  id="switch-visita"
  @change="porVisita" 
  label="Por Visita"
  ></v-switch>--->

  <VBtnToggle
    density="compact"
    color="primary"
    variant="outlined"
    divided
  >
    <VBtn v-on:click="formatActividadGrafico" class="btn-check">Por páginas vistas</VBtn>
    <VBtn v-on:click="formatVisitaGrafico" >Por Sesión</VBtn>
  </VBtnToggle>

  <div class="date-picker-wrapper" style="width: 300px;">
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
  </div>
  <div :class="classLoading">
    <div class="v-row">
      <div class="v-col-9">
        <VCardText>
          <VueApexCharts
            id="crejemplo"
            type="area"
            height="400"
            :options="chartConfig"
            :series="series"
          />
        </VCardText>
      </div>
      <div class="v-col-3" style="align-items: center;display: flex;">
        <VCardText>
          <VueApexCharts
            type="donut"
            height="410"
            :options="chartConfigDonut"
            :series="chartOptions.series"
          />
        </VCardText>
      </div>
    </div>
    
  </div>
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
        fechai:"",
        fechaf:"",
        getDataFetch:[],
        dataFormateada:[],
        getData:[],
        visita:false,
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
          tooltip: {
            shared: false,
            enabled: true,
            custom: function({series, seriesIndex, dataPointIndex, w}) {
              //this.ctx.xaxis.categories[dataPointIndex] 
              var value = series[seriesIndex][dataPointIndex];
              var text = w.config.visita?"Sesiones":"Páginas visitadas";
              if(value<2){
                text = w.config.visita?"Sesión":"Página visitada";
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
      async getDataTrazabilidad(data){
        var dataGroupBrowser = [data];
        if(data.length > 1){
          dataGroupBrowser = this.groupBy(data, "device")
        }
        var serieTotal = [];
        
        var dataFormat = [];
        //DDDD/MM/AAAA TO AAAA/DD/MM
        for(var i in dataGroupBrowser){
          var serieData = [];
          var nameSerie = '';
          var total = 0;
          for(var j in dataGroupBrowser[i]){
            var renderData = dataGroupBrowser[i][j];
            nameSerie = renderData.device;
            var count = 1;//Math.floor(Math.random()*2000);
            if(!this.visita){
              count = renderData.navigationRecord;
            }

            //console.log(renderData, renderData.timestamp)
            const cadena = renderData.timestamp;
            const nuevaCadena = cadena.replace(/[-]/g, "/");
            renderData.timestamp = nuevaCadena;
            renderData.timestamp = renderData.timestamp.split(",")[0];

            var fecha = moment(renderData.created_at).format("YYYY-MM-DD");

            //var fecha = moment(renderData.created_at).format("YYYY-MM-DD");
            total += count;
            serieTotal.push(fecha);


            var procrosarFecha = this.existeFecha(serieData, fecha);
            if(!procrosarFecha.resp){
              serieData.push({
                x: fecha,
                y: parseInt(count)//renderData.navigationRecord.length
              });
            }else{
              var dataTempFecha = serieData[procrosarFecha.index];
              serieData[procrosarFecha.index] = {
                x: fecha,
                y: parseInt(count * 1 + procrosarFecha.value * 1)//renderData.navigationRecord.length
              }
            }
            
          }

          dataFormat.push({
            name:nameSerie,
            data: serieData.sort((a, b) => ( b.x - a.x)),
            total: parseInt(total)
          });
        }

        let seriTotalFiltrada = serieTotal.filter((item,index)=>{
          return serieTotal.indexOf(item) === index;
        });

        for(var i in dataFormat){

          if(dataFormat[i].data.length != seriTotalFiltrada.length){
            for(var z in seriTotalFiltrada){
              var existe = false;
              for(var j in dataFormat[i].data){
                if(seriTotalFiltrada[z] == dataFormat[i].data[j].x){
                  existe = true;
                }
              }
              if(!existe){
                dataFormat[i].data.push({
                  x: seriTotalFiltrada[z],
                  y:0
                })
              }
            }

            dataFormat[i].data.sort(function(a, b) {
              var timestampA = new Date(moment(a.x, "YYYY-MM-DD"));
              var timestampB = new Date(moment(b.x, "YYYY-MM-DD"));
              return  timestampA - timestampB;
            });
            
          }
        }
        //console.log(dataFormat.sort((a, b) => (a.total - b.total)))
        return dataFormat.sort((a, b) => ( b.total - a.total));
      },
      async getInitGraficoDispositivos(){
        var fechai = moment().add(-5, 'days').format("MM/DD/YYYY");
        var fechaf = moment().add(1, 'days').format("MM/DD/YYYY");
        //var panelGrafico = document.querySelector("#apexchartscrejemplo");
        //panelGrafico.classList.add("disabled");

        this.isLoading = true;

        this.getData = await this.getDataGrafico(fechai, fechaf);
        //panelGrafico.classList.remove("disabled");

        this.isLoading = false;
        this.dataFormateada = await this.getDataTrazabilidad(this.getData.grafico);
        ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
        this.formatGraficoDonutVisita();
        return true;
      },
      async getDataGrafico(fechai, fechaf) {
        /*FORMATO DE FECHA A ENVIAR ES MM/DD/AAAA*/
        var raw = JSON.stringify({
            "fechai": fechai,
            "fechaf": fechaf
        });
        var resp = await fetch(`https://servicio-de-actividad.vercel.app/grafico/dispositivos`,{
          method: 'POST',
          headers: {
            "Content-Type": "application/json",
          },
          body: raw
        }); 
        var obtener = await resp.json();
        this.getDataFetch = obtener.grafico;
        return obtener;
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
          this.dataFormateada = await this.getDataTrazabilidad(this.getData.grafico);
          ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
          this.formatGraficoDonutVisita();
        }
      },
      async formatVisitaGrafico(){
        if(this.dataFormateada.length > 0 || true){
          this.isLoading = true;
          this.visita = true;
          this.dataFormateada = await this.getDataTrazabilidad(this.getData.grafico);
          ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
          this.formatGraficoDonutSesion();
          this.isLoading = false;
        }
      },
      async formatActividadGrafico(){
        if(this.dataFormateada.length > 0 || true){
          /**/
          this.visita = false;
          this.isLoading = true;
          this.dataFormateada = await this.getDataTrazabilidad(this.getData.grafico);
          ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
          this.isLoading = false;
          this.formatGraficoDonutVisita();
        }
      },
      formatGraficoDonutSesion(){
        var data = this.getDataFetch;
        // Agrupamos los objetos por el valor de su propiedad 'device'
        const groupedData = data.reduce((result, current) => {
          // Si aún no existe un grupo para el valor de 'device' actual, lo creamos
          if (!result[current.device]) {
            result[current.device] = [];
          }
          // Agregamos el objeto actual al grupo correspondiente
          result[current.device].push(current);
          return result;
        }, {});

        // Calculamos el total de objetos para cada grupo
        const deviceTotals = Object.keys(groupedData).map(device => {
          return {
            device: device,
            total: groupedData[device].length
          };
        });

        var seriesTemp = [];
        var labelsTemp = [];

        for(var i in deviceTotals){
          seriesTemp.push(deviceTotals[i].total);
          labelsTemp.push(deviceTotals[i].device);
        }

        this.chartOptions.series = seriesTemp;
        this.chartOptions.labels = labelsTemp;
      },
      formatGraficoDonutVisita(){
        var data = this.getDataFetch;
        const deviceTotals = data.reduce((acc, obj) => {
          const device = obj.device.toString();
          const navigationRecordLength = obj.navigationRecord ? obj.navigationRecord : 0;
          acc[device] = (acc[device] || 0) + navigationRecordLength;
          return acc;
        }, {});
        var seriesTemp = [];
        var labelsTemp = [];

        Object.keys(deviceTotals).forEach(function(key) {
          const value = deviceTotals[key];
          seriesTemp.push(value);
          labelsTemp.push(key);
        });
        this.chartOptions.series = seriesTemp;
        this.chartOptions.labels = labelsTemp;

      }
    },
    async mounted() {
      var resp = await this.getInitGraficoDispositivos();
    },
    updated() {
      //console.log("El DOM ha sido actualizado");
    }
  }
</script>
