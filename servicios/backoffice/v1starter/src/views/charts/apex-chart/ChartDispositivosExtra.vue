<template>
    <!--<v-switch
    id="switch-visita"
    @change="porVisita" 
    label="Por Visita"
    ></v-switch>--->
  
  <!--  <VBtnToggle
      density="compact"
      color="primary"
      variant="outlined"
      divided
    >
      <VBtn v-on:click="formatActividadGrafico" class="btn-check">Por páginas vistas</VBtn>
      <VBtn v-on:click="formatVisitaGrafico" >Por Sesión</VBtn>
    </VBtnToggle>--->
    

    <VRow>
      <VCol cols="12">
  <VBtnToggle    
        v-model="btnFiltros"
        color="primary"
        variant="outlined"
        divided
      >
   <VBtn :value="item._id" @click="resolveFiltroSelection(item._id)" v-for="item  in filtrosDispositivos">
    {{ item.nombre }}
   </VBtn>

   </VBtnToggle>

    </VCol>
    <VCol sm="4" cols="12">
    <VSelect
    v-model="selectedDispositivo"
    :items="itemDispositivos"
    label="Dispositivos"
    @update:modelValue="resolveChart"
     />
        </VCol>
        <VCol sm="4" cols="12">
    <VSelect
    v-model="selectedActividad"
    :items="itemActividad"
    label="Actividad"
    @update:modelValue="resolveChart"
     />
        </VCol>
        <VCol sm="4" cols="12">
    <VSelect
    v-model="selectedOs"
    :items="itemOs"
    label="Sistema operativo"
    @update:modelValue="resolveChart"
     />
        </VCol>
        <VCol sm="4" cols="12">
    <VSelect
    v-model="selectedBrowser"
    :items="itemBrowser"
    label="Browser"
    @update:modelValue="resolveChart"
     />
        </VCol>
   
    <VCol sm="4" cols="12" >
    <div class="date-picker-wrapper" style="width: 100%;">
      <AppDateTimePicker
        
        prepend-inner-icon="tabler-calendar"
        density="compact"
        v-model="fechaIngesada"
        show-current= true
        @on-change="obtenerFechaDispositivos"
        :config="{ 
          position: 'auto right',
          mode:'range',
          altFormat: 'F j, Y',
          dateFormat: 'm-d-Y',
          maxDate: new Date(),
          reactive :true
          
        }"
      />
    </div>
  </VCol>
  <VCol sm="4" cols="12" >
    <VBtn color="success" @click="reset"> Reiniciar filtros</VBtn>
     </VCol>
  </VRow>

    <div :class="classLoading">
      <div class="v-row">
        <div class="v-col-12">
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
        <!--
        <div class="v-col-3" style="align-items: center;display: flex;">
          <VCardText>
            <VueApexCharts
              type="donut"
              height="410"
              :options="chartConfigDonut"
              :series="chartOptions.series"
            />
          </VCardText>
        </div>--->
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
          itemActividad :[
            {
            title: "Por sesión",
            value: "sesion",
            },
            {
            title: "Por páginas vistas",
            value: "visita",
         },],
          itemDispositivos: [
            {
            title: "Movil",
            value: "movil",
            },
            {
            title: "Desktop",
            value: "desktop",
            }
          ],
          itemOs: [
            {
            title: "Windows",
            value: "Windows",
            },
            {
            title: "Mac OS",
            value: "Mac OS",
            },
            {
            title: "Linux",
            value: "Linux",
            },
            {
            title: "Android",
            value: "Android",
            },  
            {
            title: "Todos",
            value: "todos",
            }   
                       
          ],
          itemBrowser: [
            {
            title: "Chrome",
            value: "Chrome",
            },
            {
            title: "Safari",
            value: "Safari",
            },
            {
            title: "Firefox",
            value: "Firefox",
            },
            {
            title: "Todos",
            value: "todos",
            }               
          ],
          selectedActividad: "sesion",
          selectedDispositivo: "",
          selectedOs: "todos",
          selectedBrowser: "todos",
          fechaIngesada: "",
          activityData: [],
          filtrosDispositivos: [],
          filtroSelected: {},
          btnFiltros: '',
          filtroDefault: {}

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
        groupByF( array , f )
            {
            var groups = {};
            array.forEach( function( o )
            {
                var group = JSON.stringify( f(o) );
                groups[group] = groups[group] || [];
                groups[group].push( o );  
            });
            return Object.keys(groups).map( function( group )
            {
                return groups[group]; 
            })
            },

        existeFecha (list, fecha){
          for(var i in list){
            if(list[i].x == fecha){
              return {resp:true,index:i,value:list[i].y};
            }
          }
          return {resp:false};
        },
        async getDataTrazabilidadDevice2(data){
          var dataGroupBrowser = [data];
          
          if(data.length > 1){
            dataGroupBrowser = this.groupBy(data, "device")
            console.log("dataGroupBrowser", dataGroupBrowser);
          }

        

        let prueba2 = this.groupByF(data, function(item)
         {
          return [item.os, item.device, item.browser];
          });
              
       
       console.log("prueba2", prueba2);
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

        async getDataTrazabilidadFull2(data){
          console.log('primero',data)
          var serieTotal = [];
          let query = "";
          if(this.selectedOs == "Android" &&  this.selectedDispositivo == "movil"){
            if(query !== ""){
              query += " && e.device == this.selectedDispositivo && e.os == 'Linux' ";
            }else{
              query += "e.device == this.selectedDispositivo && e.os == 'Linux'";
            }  
          }else if(this.selectedOs == "Android" &&  this.selectedDispositivo == "desktop"){
            if(query !== ""){
              query += " && e.device == 'x' && e.os == 'x' ";
            }else{
              query += "e.device == 'x' && e.os == 'x' ";
            } 
          }else if(this.selectedOs == "Linux" &&  this.selectedDispositivo == "desktop"){
            if(query !== ""){
              query += " && e.device == this.selectedDispositivo && e.os == 'Linux' ";
            }else{
              query += "e.device == this.selectedDispositivo && e.os == 'Linux'";
            } 
          }else if(this.selectedOs == "Linux" &&  this.selectedDispositivo == "movil"){
            if(query !== ""){
              query += " && e.device == 'x' && e.os == 'x' ";
            }else{
              query += "e.device == 'x' && e.os == 'x' ";
            } 
          }else if(this.selectedOs == "Linux" || this.selectedOs == "Android"){
            if(query !== ""){
              query += " && e.os == 'Linux' ";
            }else{
              query += "e.os == 'Linux' ";
            } 
          }
          else{
            if(this.selectedOs !== ""){
              if(this.selectedOs !== "todos"){
              if(query !== ""){
                query += " && e.os == this.selectedOs";
              }else{
                query += "e.os == this.selectedOs";
              }  
              }
            }
            if(this.selectedDispositivo !== ""){
              if(query !== ""){
                query += " && e.device == this.selectedDispositivo";
              }else{
                query += "e.device == this.selectedDispositivo";
              }   
            }
          }
          
          if(this.selectedBrowser !== ""){
            if(this.selectedBrowser !== "todos"){
            if(query !== ""){
              query += " && e.browser == this.selectedBrowser";
            }else{
              query += "e.browser == this.selectedBrowser";
            }  
           }
            }
          
          let dataGroupBrowser;
          if(query!== ""){
            dataGroupBrowser = data.filter(e => {
              return eval(query);
            });
          }else{
            dataGroupBrowser = data;
          }
          this.activityData = dataGroupBrowser;
          //console.log('filtro',dataGroupBrowser)
          //console.log("query", query)
          //console.log("prueba", dataGroupBrowser)
          //DDDD/MM/AAAA TO AAAA/DD/MM 
            var serieData = [];
            var nameSerie = 'Total dispositivos';
            var total = 0;
            
            for(var i in dataGroupBrowser){
               
              var renderData = dataGroupBrowser[i];
              //nameSerie = renderData.device;
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
            
          var dataFormat = {
              name: nameSerie,
              data: serieData.sort((a, b) => ( b.x - a.x)),
              total: parseInt(total)
            }
           
          let seriTotalFiltrada = serieTotal.filter((item,index)=>{
            return serieTotal.indexOf(item) === index;
          });
   
            if(dataFormat.data.length != seriTotalFiltrada.length){
              for(var z in seriTotalFiltrada){
                var existe = false;
                for(var j in dataFormat[i].data){
                  if(seriTotalFiltrada[z] == dataFormat.data[j].x){
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
          //console.log('Final FUll' ,[dataFormat])
          
          return [dataFormat];
        },
  
        async getInitGraficoDispositivos(){
          await this.fetchFiltros();
          let fechai;
          let fechaf;
          if(!this.filtroDefault){
          let formatI = moment().add(-29, 'days').format("MM-DD-YYYY");
          let formatF = moment().format("MM-DD-YYYY");
          this.fechaIngesada = String(formatI+' a '+formatF);
          fechai = moment().add(-28, 'days').format("MM-DD-YYYY");
          fechaf = moment().add(1, 'days').format("MM-DD-YYYY");
          }else{
          let fechas = this.filtroDefault.fecha.split('a');
          fechai = moment(fechas[0]).add(+1, 'days').format('MM/DD/YYYY');
          fechaf = moment(fechas[1]).add(-1, 'days').format('MM/DD/YYYY');  
          }
          await this.resolveActividad();
          //var panelGrafico = document.querySelector("#apexchartscrejemplo");
          //panelGrafico.classList.add("disabled");
          this.isLoading = true;
          this.getData = await this.getDataGrafico(fechai, fechaf);         
          this.dataFormateada = await this.getDataTrazabilidadFull2(this.getData);
          ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
          this.isLoading = false;
          //console.log("data format",this.dataFormateada)
          
          return true;
        },


        async getDataNoFilter(){
        await this.resolveActividad();  
        let formatI = moment().add(-29, 'days').format("MM-DD-YYYY");
        let formatF = moment().format("MM-DD-YYYY");
        this.fechaIngesada = String(formatI+' a '+formatF);
        var fechai = moment().add(-28, 'days').format("MM-DD-YYYY");
        var fechaf = moment().add(1, 'days').format("MM-DD-YYYY"); 
        this.isLoading = true;
        this.getData = await this.getDataGrafico(fechai, fechaf);         
        this.dataFormateada = await this.getDataTrazabilidadFull2(this.getData);
        ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
        this.isLoading = false;
        return true; 
        },

        async getDataGrafico1(fechai, fechaf) {
          /*FORMATO DE FECHA A ENVIAR ES MM/DD/AAAA*/
          var raw = JSON.stringify({
              "fechai": fechai,
              "fechaf": fechaf
          });
          var resp = await fetch(`https://servicio-de-actividad.vercel.app/dispositivos/full`,{
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
            },
            body: raw
          }); 
          var obtener = await resp.json();
          this.getDataFetch = obtener.grafico;
          //console.log('res fetch',this.getDataFetch)
          return obtener;
        },

        async getDataGrafico(fechai, fechaf) {
   
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var fechasCount = JSON.stringify({
              "fechai": fechai,
              "fechaf": fechaf
          });

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: fechasCount,
      redirect: 'follow'
    };        
    
    const resp = await fetch('https://servicio-de-actividad.vercel.app/count',requestOptions)
    .then(response => response.text())
    .then(async count => { 
            let pages = parseInt(count); 
            const fullArray = []; 
            
            var myHeaders2 = new Headers();
            myHeaders2.append("Content-Type", "application/json");
        
            for (let i = 1; i < pages+1; i++){  
            var fechasFetch = JSON.stringify({
                      "fechai": fechai,
                      "fechaf": fechaf,
                      "page": i
                  });      
             var requestOptions2 = {
                    method: 'POST',
                    headers: myHeaders2,
                    body: fechasFetch,
                    redirect: 'follow'
             };       
            await fetch('https://servicio-de-actividad.vercel.app/dispositivos/full',requestOptions2)
                  .then(response => response.json())
                  .then(async response=>{
                    let array = Array.from(response.grafico);
                    array.forEach(e => fullArray.push(e));                       
                  }).catch((error) => {return error});       
          }
          
          return fullArray;                   
        }).catch((error) => {return error});  
        let obtener = resp;
        this.getDataFetch =  obtener;
        console.log("data",obtener);
        return obtener;
},
        async obtenerFechaDispositivos(selectedDates, dateStr, instance){
          await this.resolveActividad();
          //var respJson = await nuevoArchivoJson(archivoJson);
          if(selectedDates.length > 1){
            this.fechai = moment(selectedDates[0]).add(+1, 'days').format('MM/DD/YYYY');
            this.fechaf = moment(selectedDates[1]).add(-1, 'days').format('MM/DD/YYYY');
            //var panelGrafico = document.querySelector("#apexchartscrejemplo");
            //panelGrafico.classList.add("disabled");
            //console.log('fecha ingresada',this.fechaIngesada)
            //console.log(typeof this.fechaIngesada);
            this.isLoading = true;
            this.getData = await this.getDataGrafico(this.fechai, this.fechaf);
            this.isLoading = false;
            //panelGrafico.classList.remove("disabled");
            this.dataFormateada = await this.getDataTrazabilidadFull2(this.getData);
            ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
            this.emitData();
            
          }
        },
        async formatVisitaGrafico(){
          if(this.dataFormateada.length > 0 || true){
            this.isLoading = true;
            this.visita = true;
            this.dataFormateada = await this.getDataTrazabilidadFull(this.getData);
            ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
            
            this.isLoading = false;
          }
        },
        async formatActividadGrafico(){
          if(this.dataFormateada.length > 0 || true){
            /**/
            this.visita = false;
            this.isLoading = true;
            this.dataFormateada = await this.getDataTrazabilidadFull(this.getData);
            ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
            this.isLoading = false;
            
          }
        },

        async resolveActividad(){
            
            if(this.selectedActividad == "visita"){
                this.visita = false;               
            };
            if(this.selectedActividad == "sesion"){
                this.visita = true;                
            };
        },
        async resolveChart(){
            
            if(this.selectedActividad == "visita"){
                this.visita = false;
                this.isLoading = true;
                this.dataFormateada = await this.getDataTrazabilidadFull2(this.getData);
                ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
                this.isLoading = false;  
                this.emitData();
            };
            if(this.selectedActividad == "sesion"){
                this.visita = true;
                this.isLoading = true;
                this.dataFormateada = await this.getDataTrazabilidadFull2(this.getData);
                ApexCharts.exec("crejemplo", "updateSeries", this.dataFormateada);
                this.isLoading = false; 
                this.emitData();
            };
        },

        async fetchFiltros(){
          await fetch('https://servicio-filtros.vercel.app/dispositivos/grafico/all')
        .then(response => response.json())
        .then(data => {
        this.filtrosDispositivos = Array.from(data);
         })
        .catch(error => {return error});
         
        let filtros = Array.from(this.filtrosDispositivos);
        if(filtros.length > 0){
        let checkDefault = filtros.filter(a => a.isDefault === true );
        this.filtroDefault = checkDefault[0];
        this.btnFiltros = checkDefault[0]._id;
        this.selectedBrowser = checkDefault[0].browser;
        this.selectedOs = checkDefault[0].os;
        this.selectedDispositivo = checkDefault[0].device;
        this.selectedActividad = checkDefault[0].actividad;
        this.fechaIngesada = String(checkDefault[0].fecha);
        }
        },

        async resolveFiltroSelection(id){

         await fetch('https://servicio-filtros.vercel.app/dispositivos/grafico/id?' + new URLSearchParams({ id: id }))
        .then(response => response.json())
        .then(data => {
        this.filtroSelected = data;        
        })
        .catch(error => {return error}); 
        let filtro = this.filtroSelected;
        this.selectedBrowser = filtro.browser;
        this.selectedOs = filtro.os;
        this.selectedDispositivo = filtro.device;
        this.selectedActividad = filtro.actividad;
        this.fechaIngesada = String(filtro.fecha);
        await this.obtenerFechaDispositivos(filtro.fecha);        
        
        },
        async reset(){
          this.btnFiltros = "";
          this.selectedBrowser ="";
          this.selectedOs ="";
          this.selectedDispositivo ="";
          this.fechaIngesada= "";
          this.selectedActividad = "sesion";
          await this.getDataNoFilter();
          this.emitData();
        },
        emitData(){
          //console.log(this.activityData);
          let full = {
            data: this.activityData,
            visita: this.visita 
          }
          this.$emit('activityData',full );
        }
      
      },
      async mounted() {
        var resp = await this.getInitGraficoDispositivos();
        this.emitData();
        
      },
      updated() {
        //console.log("El DOM ha sido actualizado");
      }
    }
  </script>
  