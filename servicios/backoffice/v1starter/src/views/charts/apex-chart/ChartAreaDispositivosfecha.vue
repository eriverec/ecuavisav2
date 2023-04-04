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

  <div class="date-picker-wrapper" style="width: 233px;">
    <AppDateTimePicker
      placeholder="Seleccionar una fecha"
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
      <div class="v-col-3">
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

<script>
import VueApexCharts from 'vue3-apexcharts';
import { useTheme } from 'vuetify'
import { hexToRgb } from '@layouts/utils';
import Moment from 'moment';
import esLocale from "moment/locale/es";
import { extendMoment } from 'moment-range';
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
      const areaColors = {
        series3: "#e0cffe",
        series2: "#b992fe",
        series1: "#ab7efd",
      };

      return {
        chart: {
          id: "crejemplo",
          //type: "area",
          parentHeightOffset: 0,
          zoom: { enabled: true },
          toolbar: { show: false },
        },
        tooltip: {
          shared: false,
          enabled: true,
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
      const donutColors = {
        series1: '#fdd835',
        series2: '#00d4bd',
        series3: '#826bf8',
        series4: '#32baff',
        series5: '#ffa1a1',
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
                  fontSize: '1.5rem',
                  color: this.themeSecondaryTextColor,
                  formatter: val => `${parseInt(val, 10)}`,
                },
                total: {
                  show: true,
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
            count = renderData.navigationRecord.length;
          }
          var fecha = renderData.timestamp.split(',')[0];
          fecha = fecha.split("/");
          fecha = `${fecha[2]}-${fecha[0]}-${fecha[1]}`;
          total += count;
          serieTotal.push(fecha);

          var procrosarFecha = this.existeFecha(serieData, fecha);
          if(!procrosarFecha.resp){
            serieData.push({
              x: fecha,
              y: count//renderData.navigationRecord.length
            });
          }else{
            var dataTempFecha = serieData[procrosarFecha.index];
            serieData[procrosarFecha.index] = {
              x: fecha,
              y: (count * 1 + procrosarFecha.value * 1)//renderData.navigationRecord.length
            }
          }
          
        }

        dataFormat.push({
          name:nameSerie,
          data: serieData.sort((a, b) => ( b.x - a.x)),
          total:total
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
            var timestampA = new Date(moment(a.x, "YYYY-DD-MM"));
            var timestampB = new Date(moment(b.x, "YYYY-DD-MM"));
            return  timestampA - timestampB;
          });
          
        }
      }
      //console.log(dataFormat.sort((a, b) => (a.total - b.total)))
      return dataFormat.sort((a, b) => ( b.total - a.total));
    },
    async getInitGraficoDispositivos(){
      var fechai = moment().add(-7, 'days').format("MM/DD/YYYY");
      var fechaf = moment().add(1, 'days').format("MM/DD/YYYY");
      //var panelGrafico = document.querySelector("#apexchartscrejemplo");
      //panelGrafico.classList.add("disabled");

      this.isLoading = true;

      this.getData = await this.getDataGrafico(fechai, fechaf);
      //panelGrafico.classList.remove("disabled");

      this.isLoading = false;
      this.dataFormateada = await this.getDataTrazabilidad(this.getData.grafico);
      ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
      this.formatGraficoDonutSesion();
      return true;
    },
    async getDataGrafico(fechai, fechaf) {
      /*FORMATO DE FECHA A ENVIAR ES MM/DD/AAAA*/
      var raw = JSON.stringify({
          "fechai": fechai,
          "fechaf": fechaf
      });
      var resp = await fetch(`https://servicio-de-actividad.vercel.app/dispositivos`,{
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
        const navigationRecordLength = obj.navigationRecord ? obj.navigationRecord.length : 0;
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
  }
};
</script>
