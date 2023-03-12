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

const series = [
  {
    name: "Mobile",
    data: [{
            x: '2022-02-01',
            y: 21,
          },
          {
            x: '2022-02-12',
            y: 40,
          },
          {
            x: '2022-02-15',
            y: 1,
        }]
  }
];
/*ESCRIPT*/
flatpickr.setDefaults({
  disableMobile: true
});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;
    return [year, month, day].join('-');
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

function getDataTrazabilidad(){
  var data = [{
    "ip": "157.100.91.13",
    "os": "Windows",
    "browser": "Chrome",
    "url": "https://www.ecuavisa.com/deportes",
    "timestamp": "10/3/2023, 22:41:44",
    "navigationRecord": [
        {
          "id": 1,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "2:03:38"
        },
        {
          "id": 2,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "14:40:16"
        },
        {
          "id": 3,
          "url": "https://www.ecuavisa.com/mundo",
          "fecha": "10/3/2023",
          "hora": "22:05:19"
        },
        {
          "id": 4,
          "url": "https://www.ecuavisa.com/noticias/ecuador",
          "fecha": "10/3/2023",
          "hora": "22:40:16"
        },
        {
          "id": 5,
          "url": "https://www.ecuavisa.com/deportes",
          "fecha": "10/3/2023",
          "hora": "22:41:44"
      }
    ]
  },
  {
    "ip": "157.100.91.13",
    "os": "Windows",
    "browser": "Opera",
    "url": "https://www.ecuavisa.com/deportes",
    "timestamp": "10/4/2023, 22:41:44",
    "navigationRecord": [
        {
          "id": 1,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "2:03:38"
        },
        {
          "id": 2,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "14:40:16"
        },
        {
          "id": 4,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "14:40:16"
        }
    ]
  },
  {
    "ip": "157.100.91.13",
    "os": "Windows",
    "browser": "Opera",
    "url": "https://www.ecuavisa.com/deportes",
    "timestamp": "10/3/2023, 22:41:44",
    "navigationRecord": [
        {
          "id": 1,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "2:03:38"
        },
        {
          "id": 2,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "14:40:16"
        },
        {
          "id": 2,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "14:40:16"
        },
        {
          "id": 2,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "14:40:16"
        },
        {
          "id": 2,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "14:40:16"
        }
    ]
  },
  {
    "ip": "157.100.91.13",
    "os": "Windows",
    "browser": "Safari",
    "url": "https://www.ecuavisa.com/deportes",
    "timestamp": "10/3/2023, 22:41:44",
    "navigationRecord": [
        {
          "id": 1,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "2:03:38"
        },
        {
          "id": 1,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "2:03:38"
        },
        {
          "id": 1,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "2:03:38"
        },
        {
          "id": 1,
          "url": "https://www.ecuavisa.com/",
          "fecha": "10/3/2023",
          "hora": "2:03:38"
        }
    ]
  }];

  var dataGroupBrowser = groupBy(data, "browser");
  var serieTotal = [];
  
  var dataFormat = [];
  for(var i in dataGroupBrowser){
    var serieData = [];
    var nameSerie = '';
    var total = 0;
    for(var j in dataGroupBrowser[i]){
      var renderData = dataGroupBrowser[i][j];
      nameSerie = renderData.browser;
      var count = Math.floor(Math.random()*2000);
      var fecha = formatDate(renderData.timestamp);
      total += count;
      serieTotal.push(fecha);
      serieData.push({
        x: fecha,
        y: count//renderData.navigationRecord.length
      });
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
  //console.log(dataFormat.sort((a, b) => (a.topSpeed - b.topSpeed)))
  return dataFormat.sort((a, b) => ( b.total - a.total));
}

function obtenerFecha(selectedDates, dateStr, instance){
  //console.log(formatDate(selectedDates[0]))
  // actualiza la serie de datos filtrados y vuelve a renderizar el gráfico
  var filteredChartSeries = [

    {
        "name": "Safari",
        "data": [
            {
                "x": "2023-10-03",
                "y": 907
            },
            {
                "x": "2023-10-04",
                "y": 907
            }
        ]
    },
    {
        "name": "Opera",
        "data": [
            {
                "x": "2023-10-03",
                "y": 652
            },
            {
                "x": "2023-10-04",
                "y": 856
            }
        ]
    },
    {
        "name": "Chrome",
        "data": [
            {
                "x": "2023-10-03",
                "y": 640
            },
            {
                "x": "2023-10-04",
                "y": 0
            }
        ]
    }
];
ApexCharts.exec("crejemplo", "updateSeries", getDataTrazabilidad());
}

</script>

<template>
  <div class="date-picker-wrapper">
    <AppDateTimePicker
      model-value="2022-06-09"
      prepend-inner-icon="tabler-calendar"
      density="compact"
      @on-change="obtenerFecha"
      :config="{ 
        position: 'auto right',
        locale: Spanish,
        mode:'range'
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