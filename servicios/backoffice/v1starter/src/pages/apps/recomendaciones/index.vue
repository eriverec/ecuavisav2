<script setup>
import ChartRecomendaciones from "@/views/charts/ecuavisa/ChartRecomendaciones.vue";
import ChartRecSubsecciones from "@/views/charts/ecuavisa/ChartRecSubsecciones.vue";
import ChartRecMeta from "@/views/charts/ecuavisa/ChartRecMeta.vue";
import ChartRecPais from "@/views/charts/ecuavisa/ChartRecPais.vue";
import { useSelectCalendar, useSelectValueCalendar } from "@/views/apps/otros/useSelectCalendar.js";

// import ChartRecSubsecccion from "@/views/charts/apex-chart/ChartRecSubsecccion.vue";

import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const valoresHoy = useSelectValueCalendar(); //DEFAULT HOY

const fechaIngresada = ref('');
const fechaIngresadaSubseccion = ref('Hoy');
const fechaIngresadaMetadato = ref('Hoy');
const fechaIngresadaPais = ref('Hoy');
const selectedfechaIniFin = ref('Hoy');

const fechaIni = ref(valoresHoy.i.format("YYYY-MM-DD"));
const fechaFin = ref(valoresHoy.f.format("YYYY-MM-DD"));

const fechaIniSub = ref(valoresHoy.i.format("YYYY-MM-DD"));
const fechaFinSub = ref(valoresHoy.f.format("YYYY-MM-DD"));

const fechaIniMeta = ref(valoresHoy.i.format("YYYY-MM-DD"));
const fechaFinMeta = ref(valoresHoy.f.format("YYYY-MM-DD"));

const fechaIniPais = ref(valoresHoy.i.format("YYYY-MM-DD"));
const fechaFinPais = ref(valoresHoy.f.format("YYYY-MM-DD"));

const modelItemsSeccion = ref({ title: 'Todos', value: '0' });
const modelItemsSeccionPais = ref({ title: 'Todos', value: '0' });

const fechaIniFinList = useSelectCalendar();

const initData = () => {
  // let fechai = moment().add(-1, 'days').format("YYYY-MM-DD");
  // let fechaf = moment().format("YYYY-MM-DD");
  // fechaIni.value = fechai;
  // fechaFin.value = fechaf;

  fechaIngresada.value = fechaIni.value + ' a ' + fechaFin.value;
}

const initDataSub = () => {
  // let fechai = moment().add(-1, 'days').format("YYYY-MM-DD");
  // let fechaf = moment().format("YYYY-MM-DD");
  // fechaIniSub.value = fechai;
  // fechaFinSub.value = fechaf;
  fechaIngresada.value = fechaIniSub.value + ' a ' + fechaFinSub.value;
}

const initDataMeta = () => {
  // let fechai = moment().add(-1, 'days').format("YYYY-MM-DD");
  // let fechaf = moment().format("YYYY-MM-DD");
  // fechaIniMeta.value = fechai;
  // fechaFinMeta.value = fechaf;
  fechaIngresada.value = fechaIniMeta.value + ' a ' + fechaFinMeta.value;
}

const initDataPais = () => {
  // let fechai = moment().add(-1, 'days').format("YYYY-MM-DD");
  // let fechaf = moment().format("YYYY-MM-DD");
  // fechaIniPais.value = fechai;
  // fechaFinPais.value = fechaf;
  fechaIngresada.value = fechaIniPais.value + ' a ' + fechaFinPais.value;
}

onMounted(async () => {
  initData();
  initDataSub();
  initDataMeta();
  initDataPais();
});
const items = [
  { title: 'Todos', value: '0' },
  { title: 'Noticias', value: 'noticias' },
  { title: 'Estadio', value: 'estadio' },
  { title: 'Entretenimiento', value: 'entretenimiento' },
  { title: 'Mundo', value: 'mundo' },
  // { title:'Estilo', value:'estilo' }
]

const buttonClicked  = ref("grafico");
const onButtonClicked = () => {
  // console.log('Botón clickeado');
  buttonClicked.value = "btn";
  setTimeout(function(){
    buttonClicked.value = "no-btn";
  }, 1000);
  // Realiza otras acciones aquí
};

// const clickSeccion = () => {
//   // const dataToSend = {
//   //   fecha: selectedfechaIniFin.value,
//   //   criterio: 'seccion',
//   //   datei: fechaIni.value,
//   //   datef: fechaFin.value
//   // };
//   // console.log(dataToSend);
// };

watch(async () => selectedfechaIniFin.value, async () => {
  let selectedCombo = useSelectValueCalendar(selectedfechaIniFin.value);
  fechaIni.value = selectedCombo.i.format("YYYY-MM-DD");
  fechaFin.value = selectedCombo.f.format("YYYY-MM-DD");
  buttonClicked.value = "grafico";
});

watch(async () => fechaIngresadaMetadato.value, async () => {
  let selectedCombo = useSelectValueCalendar(fechaIngresadaMetadato.value);
  fechaIniMeta.value = selectedCombo.i.format("YYYY-MM-DD");
  fechaFinMeta.value = selectedCombo.f.format("YYYY-MM-DD");

  metaClicked.value = "grafico";
});

watch(async () => modelItemsSeccion.value, async () => {
  metaClicked.value = "grafico";
});

watch(async () => fechaIngresadaSubseccion.value, async () => {
  let selectedCombo = useSelectValueCalendar(fechaIngresadaSubseccion.value);
  fechaIniSub.value = selectedCombo.i.format("YYYY-MM-DD");
  fechaFinSub.value = selectedCombo.f.format("YYYY-MM-DD");

  
  subClicked.value = "grafico";
});

watch(async () => fechaIngresadaPais.value, async () => {
  let selectedCombo = useSelectValueCalendar(fechaIngresadaPais.value);
  fechaIniPais.value = selectedCombo.i.format("YYYY-MM-DD");
  fechaFinPais.value = selectedCombo.f.format("YYYY-MM-DD");

  paisClicked.value = "grafico";
});

watch(async () => modelItemsSeccionPais.value, async () => {
  paisClicked.value = "grafico";
});

const subClicked  = ref("grafico");
const clickSub = () => {
  // const dataToSend = {
  //   fecha: fechaIngresadaSubseccion.value,
  //   criterio: 'subseccion',
  //   datei: fechaIniSub.value,
  //   datef: fechaFinSub.value
  // };
  // console.log(dataToSend);
  subClicked.value = "btn";
  setTimeout(function(){
    subClicked.value = "no-btn";
  }, 1000);
};

const metaClicked  = ref("grafico");
const clickMeta = () => {
  // const dataToSend = {
  //   fecha: fechaIngresadaMetadato.value,
  //   criterio: 'metadatos',
  //   datei: fechaIniMeta.value,
  //   datef: fechaFinMeta.value
  // };
  // console.log(dataToSend);
  metaClicked.value = "btn";
  setTimeout(function(){
    metaClicked.value = "no-btn";
  }, 1000);
};

const paisClicked  = ref("grafico");
const clickPais = () => {
  // const dataToSend = {
  //   fecha: fechaIngresadaPais.value,
  //   criterio: 'pais',
  //   datei: fechaIniPais.value,
  //   datef: fechaFinPais.value
  // };
  // console.log(dataToSend);
  paisClicked.value = "btn";
  setTimeout(function(){
    paisClicked.value = "no-btn";
  }, 1000);
};

</script>

<style type="text/css">
.disabled {
  opacity: 0.1;
  pointer-events: none;
}

.clickable {
  cursor: pointer;
}

.header_card_item{
  display: flex;
    justify-content: space-between;
    align-items: flex-start;
}
</style>
<template>
  <VRow>
    <VCol cols="12" md="6">
      <VCard>
        <VCardItem class="header_card_item">
          <div class="d-flex">
            <div class="descripcion">
              <VCardTitle>Las 5 secciones que más navegan los usuarios</VCardTitle>
              <VCardSubtitle>Datos desde: {{ fechaIni }} hasta {{ fechaFin }}</VCardSubtitle>
            </div>
          </div>

          <template #append>
            <div class="date-picker-wrapper" >
              <VBtn icon color="success" variant="tonal" @click="onButtonClicked">
                <VIcon size="22" icon="tabler-download" />
              </VBtn>
            </div>
          </template>
        </VCardItem>

        <VCardItem class="pt-0">
          <div class="bg-ecuavisa py-2">
            <div class="date-picker-wrapper" style="width: 250px;">
              <VCombobox v-model="selectedfechaIniFin" :items="fechaIniFinList" variant="outlined" label="Fecha" persistent-hint
                hide-selected hint="" />
            </div>
          </div>
        </VCardItem>

        <VCardText>
          <ChartRecomendaciones :fechaIni="fechaIni" :fechaFin="fechaFin" :buttonClicked="buttonClicked" />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard>
        <VCardItem class="header_card_item">
          <div class="d-flex">
            <div class="descripcion">
              <VCardTitle>Las 5 subsecciones que más navegan los usuarios</VCardTitle>
              <VCardSubtitle>Datos desde: {{ fechaIniSub }} hasta {{ fechaFinSub }}</VCardSubtitle>
            </div>
          </div>

          <template #append>
            <div class="date-picker-wrapper">
              <VBtn icon color="success" variant="tonal" @click="clickSub">
                <VIcon size="22" icon="tabler-download" />
              </VBtn>

            </div>

          </template>
        </VCardItem>

        <VCardItem class="pt-0">
          <div class="bg-ecuavisa py-2">
            <div class="date-picker-wrapper" style="width: 250px;">
              <VCombobox v-model="fechaIngresadaSubseccion" :items="fechaIniFinList" variant="outlined" label="Fecha"
                  persistent-hint hide-selected hint="" />
            </div>
          </div>
          
        </VCardItem>

        <VCardText>
          <ChartRecSubsecciones :fechaIniSub="fechaIniSub" :fechaFinSub="fechaFinSub" :subClicked="subClicked" />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard>
        <VCardItem class="header_card_item">
          <div class="d-flex">
            <div class="descripcion">
              <VCardTitle>Los metadatos que más navegan los usuarios</VCardTitle>
              <VCardSubtitle>Datos desde: {{ fechaIniMeta }} hasta {{ fechaFinMeta }}</VCardSubtitle>
            </div>
          </div>

          <template #append>
            <div class="date-picker-wrapper">
              <VBtn icon color="success" variant="tonal" @click="clickMeta">
                <VIcon size="22" icon="tabler-download" />
              </VBtn>
            </div>
          </template>
        </VCardItem>

        <VCardItem class="pt-0">
          <div class="date-picker-wrapper d-flex gap-4 py-2" style="width: 295px;">

            <VCombobox v-model="fechaIngresadaMetadato" :items="fechaIniFinList" variant="outlined" label="Fecha"
                 hide-selected  />
            
            <VSelect class="" :items="items" label="Secciones" v-model="modelItemsSeccion" />

          </div>
        </VCardItem>

        <VCardText>
          <ChartRecMeta :fechaIniMeta="fechaIniMeta" :fechaFinMeta="fechaFinMeta"
            :modelItemsSeccion="modelItemsSeccion" :metaClicked="metaClicked" />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard>
        <VCardItem class="header_card_item">
          <div class="d-flex">
            <div class="descripcion">
              <VCardTitle>Países que más navegan los usuarios por sección</VCardTitle>
              <VCardSubtitle>Datos desde: {{ fechaIniPais }} hasta {{ fechaFinPais }}</VCardSubtitle>
            </div>
          </div>

          <template #append>
            <div class="date-picker-wrapper">
              <VBtn icon color="success" variant="tonal" @click="clickPais">
                <VIcon size="22" icon="tabler-download" />
              </VBtn>
            </div>
          </template>
        </VCardItem>

        <VCardItem class="pt-0 py-2">
          <div class="date-picker-wrapper d-flex gap-4 py-2" style="width: 295px;">
            <VCombobox v-model="fechaIngresadaPais" :items="fechaIniFinList" variant="outlined" label="Fecha" persistent-hint
                hide-selected hint="" />
              <VSelect class="" :items="items" label="Secciones" v-model="modelItemsSeccionPais" />
          </div>
        </VCardItem>

        <VCardText class="py-3">
          <ChartRecPais :fechaIniPais="fechaIniPais" :fechaFinPais="fechaFinPais"
            :modelItemsSeccionPais="modelItemsSeccionPais" :paisClicked="paisClicked" />
        </VCardText>
      </VCard>
    </VCol>

  </VRow>
</template>

<style type="text/css">
  /*.bg-ecuavisa {
      background: rgb(var(--v-theme-background));
      padding: 12px;
      border-radius: 7px;
  }
  .date-picker-wrapper {
      background: rgb(var(--v-theme-surface));
  }*/
</style>