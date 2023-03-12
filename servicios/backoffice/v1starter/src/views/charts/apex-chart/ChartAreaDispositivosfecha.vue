<script setup>
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from "vuetify";
import { hexToRgb } from "@layouts/utils";
import { Spanish } from 'flatpickr/dist/l10n/es.js'
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
    dataGroupBrowser = groupBy(data, "browser")
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
      nameSerie = renderData.browser;
      var count = renderData.navigationRecord.length;//Math.floor(Math.random()*2000);
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
      data:serieData,
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
    }
  }
  //console.log(dataFormat.sort((a, b) => (a.total - b.total)))
  return dataFormat.sort((a, b) => ( b.total - a.total));
}

async function getInitGraficoDispositivos(){
  var fechai = getDate();
  var fechaf = getDate("",1);
  var panelGráfico = document.querySelector("#apexchartscrejemplo");
  panelGráfico.classList.add("disabled");
  var getData = {grafico:[
  {
    "idActivity": "82338",
    "user": "82338",
    "ip": "200.24.135.16",
    "os": "Windows",
    "browser": "Chrome",
    "url": "https://www.ecuavisa.com/",
    "timestamp": "12/3/2023, 11:14:56",
    "navigationRecord": [
      {
        "id": 1,
        "url": "https://www.ecuavisa.com/mundo",
        "fecha": "12/3/2023",
        "hora": "10:33:51"
      }
    ]
  },
  {
    "idActivity": "82331",
    "user": "82338",
    "ip": "200.24.135.16",
    "os": "Windows",
    "browser": "Chrome",
    "url": "https://www.ecuavisa.com/",
    "timestamp": "12/3/2023, 11:14:56",
    "navigationRecord": [
      {
        "id": 1,
        "url": "https://www.ecuavisa.com/mundo",
        "fecha": "12/3/2023",
        "hora": "10:33:51"
      },
      {
        "id": 2,
        "url": "https://www.ecuavisa.com/",
        "fecha": "12/3/2023",
        "hora": "11:14:56"
      }
    ]
  },
  {
    "idActivity": "82333",
    "user": "82338",
    "ip": "200.24.135.16",
    "os": "Windows",
    "browser": "Firefox",
    "url": "https://www.ecuavisa.com/",
    "timestamp": "12/3/2023, 11:14:56",
    "navigationRecord": [
      {
        "id": 1,
        "url": "https://www.ecuavisa.com/mundo",
        "fecha": "12/3/2023",
        "hora": "10:33:51"
      },
      {
        "id": 2,
        "url": "https://www.ecuavisa.com/",
        "fecha": "12/3/2023",
        "hora": "11:14:56"
      },
      {
        "id": 3,
        "url": "https://www.ecuavisa.com/",
        "fecha": "12/3/2023",
        "hora": "11:14:56"
      }
    ]
  },
  {
    "idActivity": "82334",
    "user": "82338",
    "ip": "200.24.135.16",
    "os": "Windows",
    "browser": "Firefox",
    "url": "https://www.ecuavisa.com/",
    "timestamp": "13/3/2023, 11:14:56",
    "navigationRecord": [
      {
        "id": 1,
        "url": "https://www.ecuavisa.com/mundo",
        "fecha": "12/3/2023",
        "hora": "10:33:51"
      },
      {
        "id": 2,
        "url": "https://www.ecuavisa.com/",
        "fecha": "12/3/2023",
        "hora": "11:14:56"
      },
      {
        "id": 3,
        "url": "https://www.ecuavisa.com/",
        "fecha": "12/3/2023",
        "hora": "11:14:56"
      }
    ]
  }
]}//await getDataGrafico(fechai, fechaf);
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
    var fechai = (dateI.getMonth() + 1) + '/' + dateI.getDate() + '/' + dateI.getFullYear();
    var dateF = selectedDates[1];
    var fechaf = (dateF.getMonth() + 1) + '/' + dateF.getDate() + '/' + dateF.getFullYear();

    var panelGráfico = document.querySelector("#apexchartscrejemplo");
    panelGráfico.classList.add("disabled");
    var getData = await getDataGrafico(fechai, fechaf);
    panelGráfico.classList.remove("disabled");
    var dataFormateada = await getDataTrazabilidad(getData.grafico);
    ApexCharts.exec("crejemplo", "updateSeries", dataFormateada);
  }
  //console.log(formatDate(selectedDates[0]))
  // actualiza la serie de datos filtrados y vuelve a renderizar el gráfico
  
}

</script>

<template>
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
        dateFormat: 'm-d-Y'
      }"
    />
  </div>
  <div class="w-100">
    <VCardText>
      <VueApexCharts
        id="nuevocomponente"
        type="area"
        height="400"
        :options="chartConfig"
        :series="series"
      />
    </VCardText>
    
  </div>
</template>