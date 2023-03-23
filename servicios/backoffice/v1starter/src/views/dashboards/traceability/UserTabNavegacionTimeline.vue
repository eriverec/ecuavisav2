<script setup>
import { debounce } from 'lodash';
import Moment from 'moment';
import esLocale from "moment/locale/es";
import { extendMoment } from 'moment-range';
import avatar1 from '@/assets/images/avatars/avatar-1.png'
import avatar2 from '@/assets/images/avatars/avatar-2.png'


</script>
<style type="text/css">
  ul.busqueda-anticipada {
    position: absolute;
    top: 3rem;
    background-color: #fff;
    padding: 20px 15px;
    z-index: 999;
    border: 1px solid #fefe;
    border-radius: 7px;
    width: 100%;
    left: 0;
    max-height: 200px;
    overflow-y: auto;
}
ul.busqueda-anticipada li {
    padding: 5px 10px;
    border-radius: 7px;
    cursor: pointer;
}

ul.busqueda-anticipada li:hover {
    background: #f1f1f1;
}
.title-list-ultimas-noticias span {
    width: 300px;
    display: block;
    overflow: auto;
}
</style>
<template>
  <div id="panel-ultimas-visitas">
    <VCardText class="py-4 gap-0 w-100">
      <div style="width: 100%" class="d-flex gap-1 px-0  position-relative">
          <VTextField
            v-model="query"
            @input="search"
            @blur="hideResults"
            pattern="\d*" @keypress="onlyIntegers"
            placeholder="Buscar..."
            class="ms-0 me-1 chat-list-search"
          >
          </VTextField>
          <ul class="busqueda-anticipada" v-if="showResults">
            <li v-for="(result, index) in results" :key="index" @click="selectResult(result)">{{ result.idActivity }}</li>
          </ul>
          <VBtn prepend-icon="tabler-search" @click="btnBuscar">
            Buscar
          </VBtn>
        </div>
    </VCardText>
    <VCardText>
      <div v-if="isLoading">Cargando datos...</div>
      <VTimeline v-else side="end" align="start" truncate-line="both" density="compact"
        class="v-timeline-density-compact mt-5">
        <VTimelineItem dot-color="warning" size="x-small" v-for="item  in urlCounts" :key="item.url">
          <!-- 👉 Header -->
          <div class="d-flex justify-space-between">
            <h6 class="text-base font-weight-semibold me-3 title-list-ultimas-noticias">
              <span> <a :href="item.url" target="_blank"> {{ item.title ? item.title : item.url }}</a> </span>
            </h6>
            <div><span class="text-sm text-disabled"> {{ item.hora }}</span></div>

          </div>
        </VTimelineItem>
      </VTimeline>
      <div class="d-flex justify-end mt-5">
        <VChip label color="success">
          <div class="feData"></div>
        </VChip>
      </div>
    </VCardText>
  </div>
</template>
<script>

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);
//alert(moment(new Date(), "YYYY-MM-DD").format('YYYY-MM-DD'))
export default {
  data() {
    return {
      urlCounts:[],
      isLoading:true,
      query: '',
      results: [],
      showResults: false,
    };
  },
  mounted() {
    var carActividad = document.querySelector("#panel-ultimas-visitas");
    carActividad.classList.add("disabled");
    this.fetchData();
  },
  methods: {
    async fetchData(idActivity='sort') {
      const response = await fetch('https://servicio-de-actividad.vercel.app/actividad/trazabilidad/'+idActivity);
      const data = await response.json();
        
      var carActividad = document.querySelector("#panel-ultimas-visitas");
      carActividad.classList.remove("disabled");

      if(!data.resp){
        this.urlCounts = [];
        return false;
      }

      const urlMap = new Map();
      const fechaUnico = data.data[0].date
      const qu = document.querySelector('.feData')
      qu.innerHTML = fechaUnico
      const fechaArray = fechaUnico.split('/');
      const fechaFormateada = `${fechaArray[2]}-${fechaArray[1].padStart(2, '0')}-${fechaArray[0].padStart(2, '0')}`;

      for (const activity of data.data[0].navigationRecord) {
        const url = activity.url;
        const title = activity.title;
        const hora = activity.hora;
        const fechaString = activity.fecha;
        if (urlMap.has(url)) {
          urlMap.get(url).count++;
        } else {
          urlMap.set(url, { url, title, hora, fechaString, fechaFormateada, count: 1 });
        }
      }
      this.urlCounts = Array.from(urlMap.values());
      this.urlCounts.sort((a, b) => {
        // b.hora - a.hora
        const horaA = new Date(`${fechaFormateada}T${a.hora}`);
        const horaB = new Date(`${fechaFormateada}T${b.hora}`);
        if (horaA < horaB) {
          return 1; // Si la hora de A es menor, A va después que B
        } else if (horaA > horaB) {
          return -1; // Si la hora de A es mayor, A va antes que B
        } else {
          return 0; // Si las horas son iguales, no se cambia el orden
        }
      });
      this.isLoading = false;
      return true;
    },
    search: debounce(function() {
      fetch(`https://servicio-de-actividad.vercel.app/actividad/search/activity/${this.query}`)
        .then(response => response.json())
        .then(data => {
          if(data.resp){
            this.results = data.data;
          }else{
            this.results = [];
          }
          if (this.results.length > 0) {
            this.showResults = true;
          } else {
            this.showResults = false;
          }
        })
    }, 500),
    selectResult(result) {
      this.query = result.idActivity;
      this.showResults = false;
      setTimeout(function(){
      }, 700);
    },
    hideResults() {
      
    },
    onlyIntegers(event) {
      const charCode = event.which ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        event.preventDefault();
      }
    },
    btnBuscar() {
      var idActivity = this.query;
      var carActividad = document.querySelector("#panel-ultimas-visitas");
      carActividad.classList.add("disabled");
      this.fetchData(idActivity);
    }
  },
};
</script>