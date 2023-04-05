<script setup>
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";
import { hexToRgb } from "@layouts/utils";
import { Spanish } from 'flatpickr/dist/l10n/es.js';


import Moment from 'moment';
import esLocale from "moment/locale/es";
import { extendMoment } from 'moment-range';

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

// 👉 Colors variables
const colorVariables = (themeColors) => {
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

  return {
    themeSecondaryTextColor,
    themeDisabledTextColor,
    themeBorderColor,
    themePrimaryTextColor,
  };
};

const vuetifyTheme = useTheme();
const chartConfig = computed(() =>
  getAreaChartSplineConfig(vuetifyTheme.current.value)
);

const expenseRationChartConfig = computed(() => getDonutChartConfigPieDispositivos(vuetifyTheme.current.value))

// ESTE ES el Dispositivos
const getAreaChartSplineConfig = (themeColors) => {
  const areaColors = {
    series3: "#e0cffe",
    series2: "#b992fe",
    series1: "#ab7efd",
  };

  const { themeSecondaryTextColor, themeBorderColor, themeDisabledTextColor } =
    colorVariables(themeColors);

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
      type: "solid",
    },
    grid: {
      show: true,
      borderColor: themeBorderColor,
      xaxis: {
        lines: { show: true },
      },
    },
    yaxis: {
      labels: {
        style: { colors: themeDisabledTextColor },
      },
    },
    xaxis: {
      /**/axisBorder: { show: false },
      axisTicks: { color: themeBorderColor },
      crosshairs: {
        stroke: { color: themeBorderColor },
      },
      labels: {
        style: { colors: themeDisabledTextColor },
      },
      categories: [],
    },
  };
};

const getDonutChartConfigPieDispositivos = (themeColors) => {
  const donutColors = {
    series1: '#fdd835',
    series2: '#00d4bd',
    series3: '#826bf8',
    series4: '#32baff',
    series5: '#ffa1a1',
  }

  const { themeSecondaryTextColor, themePrimaryTextColor } = colorVariables(themeColors)
  
  return {
    stroke: { width: 0 },
    labels: ['Operational', 'Networking', 'Hiring', 'R&D'],
    colors: [donutColors.series1, donutColors.series5, donutColors.series3, donutColors.series2],
    dataLabels: {
      enabled: true,
      formatter: val => `${parseInt(val, 10)}%`,
    },
    legend: {
      position: 'bottom',
      markers: { offsetX: -3 },
      labels: { colors: themeSecondaryTextColor },
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
              color: themeSecondaryTextColor,
              formatter: val => `${parseInt(val, 10)}`,
            },
            total: {
              show: true,
              fontSize: '1.5rem',
              label: 'Operational',
              formatter: () => '31%',
              color: themePrimaryTextColor,
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

var fechai = '';
var fechaf = '';
var dataFormateada = [];
var getData = [];
var visita = false;

function addDays(date, sumarDias=0) {
  var result = new Date(date);
  result.setDate(date.getDate() + sumarDias);
  return result;
}

function getDate(fecha='',sumarDias=0) {
  var date_ob = new Date();
  if(fecha != ''){
    //FORMATO dd/mm/aaaa
    date_ob = new Date(fecha);
  }
  var newFecha = addDays(date_ob, sumarDias);
  return (newFecha.getMonth() + 1) + '-' + newFecha.getDate() + '-' + newFecha.getFullYear();
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, day, month].join('-');
}

function groupBy(collection, property) {
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
}

async function getDataGrafico(fechai, fechaf) {
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
  return obtener;
}

var existeFecha = function(list, fecha){
  for(var i in list){
    if(list[i].x == fecha){
      return {resp:true,index:i,value:list[i].y};
    }
  }
  return {resp:false};
}

async function getDataTrazabilidad(data){

  var dataGroupBrowser = [data];
  if(data.length > 1){
    dataGroupBrowser = groupBy(data, "device")
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
      if(!visita){
        count = renderData.navigationRecord.length;
      }
      var fecha = renderData.timestamp.split(',')[0];
      fecha = fecha.split("/");
      fecha = `${fecha[2]}-${fecha[0]}-${fecha[1]}`;
      total += count;
      serieTotal.push(fecha);

      var procrosarFecha = existeFecha(serieData, fecha);
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
}

async function getInitGraficoDispositivos(){
  var fechai = getDate("",-7);
  var fechaf = getDate("",1);
  var panelGráfico = document.querySelector("#apexchartscrejemplo");
  panelGráfico.classList.add("disabled");

  getData = await getDataGrafico(fechai, fechaf);
  panelGráfico.classList.remove("disabled");
  var dataFormateada = await getDataTrazabilidad(getData.grafico);
  ApexCharts.exec("crejemplo", "updateSeries", dataFormateada);
  return true;
}

const series = [];

setTimeout(async function(){
    var resp = await getInitGraficoDispositivos();
}, 1000);
/*ESCRIPT*/
flatpickr.setDefaults({
  disableMobile: true
});

async function obtenerFechaDispositivos(selectedDates, dateStr, instance){

  //var respJson = await nuevoArchivoJson(archivoJson);
  if(selectedDates.length > 1){
    var dateI = selectedDates[0];
    fechai = (dateI.getMonth() + 1) + '/' + dateI.getDate() + '/' + dateI.getFullYear();
    var dateF = selectedDates[1];
    fechaf = (dateF.getMonth() + 1) + '/' + dateF.getDate() + '/' + dateF.getFullYear();

    var panelGráfico = document.querySelector("#apexchartscrejemplo");
    panelGráfico.classList.add("disabled");
    getData = await getDataGrafico(fechai, fechaf);
    panelGráfico.classList.remove("disabled");
    dataFormateada = await getDataTrazabilidad(getData.grafico);
    ApexCharts.exec("crejemplo", "updateSeries", dataFormateada);
  }
  //console.log(formatDate(selectedDates[0]))
  // actualiza la serie de datos filtrados y vuelve a renderizar el gráfico
  
}

async function formatVisitaGráfico(){
  if(dataFormateada.length > 0 || true){
    var panelGráfico = document.querySelector("#apexchartscrejemplo");
    visita = true;
    dataFormateada = await getDataTrazabilidad(getData.grafico);
    ApexCharts.exec("crejemplo", "updateSeries", dataFormateada);
    panelGráfico.classList.remove("disabled");


    ApexCharts.exec("crejemplopie", "updateSeries", [
      185,
      16,
      50,
      50,
    ]);


  }
}

async function formatActividadGráfico(){
  if(dataFormateada.length > 0 || true){
    visita = false;
    var panelGráfico = document.querySelector("#apexchartscrejemplo");
    dataFormateada = await getDataTrazabilidad(getData.grafico);
    ApexCharts.exec("crejemplo", "updateSeries", dataFormateada);
    panelGráfico.classList.remove("disabled");
  }
}

const porVisita = (item) => {
  if(item.target.checked){
    formatVisitaGráfico()
  }else{
    formatActividadGráfico()
  }
};

</script>

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
    <VBtn v-on:click="formatActividadGráfico" class="btn-check">Por Visita</VBtn>
    <VBtn v-on:click="formatVisitaGráfico" >Por Actividad</VBtn>
  </VBtnToggle>

  <div class="date-picker-wrapper" style="width: 233px;">
    <AppDateTimePicker
      placeholder="Seleccionar una fecha"
      prepend-inner-icon="tabler-calendar"
      density="compact"
      @on-change="obtenerFechaDispositivos"
      :config="{ 
        position: 'auto right',
        locale: Spanish,
        mode:'range',
        altFormat: 'F j, Y',
        dateFormat: 'm-d-Y',
        maxDate: new Date()
      }"
    />
  </div>
  <div class="w-100">
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
            id="crejemplopie"
            type="donut"
            height="410"
            :options="expenseRationChartConfig"
            :series="[
              85,
              16,
              50,
              50,
            ]"
          />
        </VCardText>
      </div>
    </div>
    
  </div>
</template>