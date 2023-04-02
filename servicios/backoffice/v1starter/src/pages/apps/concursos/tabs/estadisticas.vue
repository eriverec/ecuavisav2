
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
</style>
<template>
  <VCol cols="12" class=" mx-0 px-0">
      <!-- 👉 Recent devices -->
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between gap-4  px-0 py-0" id="id-card-actividad">
          
          <VCardItem class="pt-0 pb-0">
            <VCardTitle>Estadísticas</VCardTitle>
            <VCardSubtitle>De usuarios que se inscribieron de los últimos 7 días</VCardSubtitle>
          </VCardItem>
          
          <!-- <input type="text" id="date-picker" ref="datePicker" /> -->
          <VCardText class="d-flex flex-wrap py-4 gap-4 align-items-center" style="justify-content: end;">
            <div class="me-3">
              <VBtn color="secondary" @click="clearSelection" :disabled="selectedTrivia == null"> Reiniciar </VBtn>
            </div>

            <div class="d-flex align-center flex-wrap gap-2 bg-light">
              <!-- 👉 Reset button -->
              <VSelect style="width: 190px;background-color: #fff;"
                v-model="selectedTrivia"
                :items="trivias"
                label="Trivias"
                clearable
                clear-icon="tabler-x"
                :searchable="true"
              />
              <!-- 👉 Export button -->
              <VBtn
                variant="tonal"
                color="success"
                prepend-icon="tabler-search"
                @click="btn_filter"
              >
                Buscar
              </VBtn>
              <!-- 👉 Add user button -->
            </div>

            <div class="d-flex align-center flex-wrap gap-2">
              <div class="date-picker-wrapper" style="width: 233px">
                  <AppDateTimePicker id="date-picker" placeholder="Seleccionar una fecha" prepend-inner-icon="tabler-calendar"
                    density="compact" 
                    v-model="dateRangeModel"
                    @on-change="onChangeRange"
                    :config="{ 
                      position:'left',
                      mode:'range',
                      altFormat: 'F j, Y',
                      dateFormat: 'Y-m-d',
                      maxDate: new Date()
                    }"
                  />
              </div>
            </div>

          </VCardText>
          
        </VCardText>
      </VCard>
    </VCol>
  <div id="id-card-estadistica">
    <v-select
      :items="options"
      label="Select an option"
      v-model="selectedOption"
      @change="handleChange"
    ></v-select>

    <p>Selected option: {{ selectedOption }}</p>


    <div v-if="isLoading" class="mt-6">Cargando datos...</div>
    <div v-for="(pregunta, index) in preguntas" :key="index" class="mt-6" v-else>
      <VCard>
        <VCardItem class="pb-sm-0">
          <VCardTitle><strong><small>Trivia #00{{ preguntasData[index].idTrivia }}</small></strong> - {{ pregunta }}</VCardTitle>
          <div ref="chart" style="height:250px"></div>
        </VCardItem>
      </VCard>
    </div>
  </div>
</template>


<script>
  import { useTheme } from 'vuetify'
  import { hexToRgb } from '@layouts/utils';
  import VueApexCharts from 'vue3-apexcharts';
  import ApexCharts from 'apexcharts'
  export default {
    setup() {
      const vuetifyTheme = useTheme();
      const currentTheme = vuetifyTheme.current.value.colors;
      const variableTheme = vuetifyTheme.current.value.variables;
      const labelPrimaryColor = `rgba(${hexToRgb(currentTheme.primary)},${variableTheme['dragged-opacity']})`;
      const legendColor = `rgba(${hexToRgb(currentTheme['on-background'])},${variableTheme['high-emphasis-opacity']})`;
      const borderColor = `rgba(${hexToRgb(String(variableTheme['border-color']))},${variableTheme['border-opacity']})`;
      const labelColor = `rgba(${hexToRgb(currentTheme['on-surface'])},${variableTheme['disabled-opacity']})`;
      
      const columnColors = {
        series1: '#826af9',
        series2: '#d2b0ff',
        bg: '#f8d3ff',
      };

      return { 
        vuetifyTheme,
        currentTheme,
        variableTheme,
        labelPrimaryColor,
        legendColor,
        borderColor,
        labelColor,
        columnColors
      }
    },
    data() {
      return {
        isLoading:true,
        preguntas:[],
        preguntasData:[],
        preguntasConCount:[],
        params:{},
        trivias: [],
        dateRangeModel:null,
        selectedTrivia: {title:`Trivia: 1`,value:1},
        chartList: [],


        options: [
          'Option 1',
          'Option 2',
          'Option 3'
        ],
        selectedOption: 'Option 1'
      };
    },
    computed: {
      chartConfigs() {
        return this.preguntas.map(pregunta => {
          return {
            chartOptions: {
              chart: {
                parentHeightOffset: 0,
                type: 'bar',
                toolbar: { show: false }
              },
              plotOptions: {
                bar: {
                  columnWidth: '32%',
                  startingShape: 'rounded',
                  borderRadius: 4,
                  distributed: true,
                  dataLabels: { position: 'center' }
                }
              },
              grid: {
                show: true,
                padding: { top: 0, bottom: 0, left: -10, right: -10 }
              },
              colors: [this.columnColors.series2, this.columnColors.series1],
              dataLabels: {
                enabled: true,
                formatter(val) { return `${val}` },
                offsetY: 0,
                style: {
                  fontSize: '15px',
                  colors: [this.legendColor],
                  fontWeight: '600'
                }
              },
              legend: {
                show: true,
                position: 'top',
                horizontalAlign: 'left',
                labels: { colors: this.labelColor },
              },
              tooltip: { enabled: true },
              xaxis: {
                categories: this.preguntasConCount[pregunta].map(respuesta => respuesta.respuesta),
                axisBorder: { show: true, color: this.borderColor },
                axisTicks: { show: false },
                labels: {
                  style: { colors: this.labelColor, fontSize: '14px' }
                }
              },
              yaxis: {
                labels: {
                  offsetX: -15,
                  formatter(val) { return `${parseInt(val / 1)}` },
                  style: { fontSize: '14px', colors: this.labelColor },
                  min: 0,
                  max: 60000,
                  tickAmount: 6
                }
              }
            },
            series: [{ data: this.preguntasConCount[pregunta].map(respuesta => respuesta.count) }]
          }
        })
      }
    },
    methods: {
      handleChange() {
        console.log('Selected option:', this.selectedOption)
      },
      async fetchData(param = "") {
        var carActividad = document.querySelector("#id-card-estadistica");
        carActividad.classList.add("disabled");

        var params = this.encodeDataToURL(this.params);
        const response = await fetch('https://showandevents-service.vercel.app/all?' + params)
        const data = await response.json();
        this.preguntas = [];
        this.preguntasConCount = [];
        this.preguntasData = [];
        data.data.forEach(trivia => {
          trivia.data.forEach(datos => {
            datos.trivia.forEach(pregunta => {
              if (this.preguntas.includes(pregunta.pregunta)) {
                const respuesta = this.preguntasConCount[pregunta.pregunta].find(
                  item => item.respuesta === pregunta.respuesta
                )
                if (respuesta !== undefined) respuesta.count++
                else {
                  this.preguntasConCount[pregunta.pregunta].push({
                    respuesta: pregunta.respuesta,
                    count: 1
                  })
                }
              } else {
                this.preguntas.push(pregunta.pregunta)
                this.preguntasData.push(datos)
                this.preguntasConCount[pregunta.pregunta] = [{
                  respuesta: pregunta.respuesta,
                  count: 1
                }]
              }
            })
          })
        })
        this.isLoading = false;
      },
      createChart(chartConfig, element) {
        chartConfig.chartOptions.chart['height'] = 350;
        var seriesOptions = [
          {
            name: "Num de usuarios que respondieron",
            data: chartConfig.series[0].data
          }
        ];
        chartConfig.chartOptions["series"] = seriesOptions;
        const chart = new ApexCharts(element, chartConfig.chartOptions);
        this.chartList.push(chart);

        chart.render();

        var elementEstadistica = document.querySelector("#id-card-estadistica");
        elementEstadistica.classList.remove("disabled");
      },
      initChart() {
        for(var i in this.chartList){
          const chart = this.chartList[i];
          if (chart) {
            chart.destroy()
          }
        }

        if(this.chartConfigs.length > 0){
          const elements = this.$refs.chart;
          for (let i = 0; i < elements.length; i++) {
            /*var optionsValues = this.chartConfigs[i].chartOptions;
            var seriesValues = this.chartConfigs[i].series;*/
            this.createChart(this.chartConfigs[i], elements[i]);
          }
        }
      },
      async getListTrivia() {
        var params = this.encodeDataToURL(this.params);
        const response = await fetch('https://showandevents-service.vercel.app/group?' + params)
        const data = await response.json();
        this.itemsIdTrivias = [];
        var trivias = [];
        if(data.resp){
          this.trivias = data.data.map((trivia) => {
            return {title:`Trivia: `+trivia._id,value:trivia._id};
          });
        }
      },
      generateURL() {
        const encodedParams = this.encodeDataToURL(this.params);
        this.url = `https://example.com?${encodedParams}`;
      },
      encodeDataToURL(data) {
        return Object
              .keys(data)
              .map(value => `${value}=${encodeURIComponent(data[value])}`)
              .join('&');
      },
      async clearSelection() {
        this.selectedTrivia = null;
        this.params = {};
        this.preguntas = [];
        await this.fetchData();
        this.initChart();
      },
      async btn_filter() {
        this.params["idTrivia"] = this.selectedTrivia;
        await this.fetchData();
        this.initChart();
      },
      onChangeRange(selectedDates, dateStr, instance) {
        // Do something when the user selects a country
        console.log("Selected country:", selectedDates);
      },
    },
    async mounted() {
      this.getListTrivia();
      this.params["idTrivia"] = this.selectedTrivia.value;
      await this.fetchData();
      this.initChart();
    },
  };
</script>
