<script setup>
import ChartRecomendaciones from "@/views/charts/ecuavisa/ChartRecomendaciones.vue";
import ChartRecSubsecciones from "@/views/charts/ecuavisa/ChartRecSubsecciones.vue";
import ChartRecMeta from "@/views/charts/ecuavisa/ChartRecMeta.vue";
import ChartRecPais from "@/views/charts/ecuavisa/ChartRecPais.vue";

// import ChartRecSubsecccion from "@/views/charts/apex-chart/ChartRecSubsecccion.vue";

import Moment from 'moment';
import { extendMoment } from 'moment-range';
import esLocale from "moment/locale/es";

const moment = extendMoment(Moment);
moment.locale('es', [esLocale]);

const fechaIngresada = ref('');
const fechaIngresadaSubseccion = ref('Hoy');
const fechaIngresadaMetadato = ref('Hoy');
const fechaIngresadaPais = ref('Hoy');
const selectedfechaIniFin = ref('Hoy');

const fechaIni = ref('');
const fechaFin = ref(moment().add(-1, 'days').format("YYYY-MM-DD"));

const fechaIniSub = ref('');
const fechaFinSub = ref(moment().add(-1, 'days').format("YYYY-MM-DD"));

const fechaIniMeta = ref('');
const fechaFinMeta = ref(moment().add(-1, 'days').format("YYYY-MM-DD"));

const fechaIniPais = ref('');
const fechaFinPais = ref(moment().add(-1, 'days').format("YYYY-MM-DD"));

const modelItemsSeccion = ref({ title: 'Todos', value: '0' });
const modelItemsSeccionPais = ref({ title: 'Todos', value: '0' });

const fechaIniFinList = [
  'Hoy', 'Hace una semana', '15 días atrás', '1 mes atrás'
];

const initData = () => {
  let fechai = moment().add(-1, 'days').format("YYYY-MM-DD");
  let fechaf = moment().add(-1, 'days').format("YYYY-MM-DD");
  fechaIni.value = fechai;
  fechaFin.value = fechaf;
  fechaIngresada.value = fechai + ' a ' + fechaf;
}

const initDataSub = () => {
  let fechai = moment().add(-1, 'days').format("YYYY-MM-DD");
  let fechaf = moment().add(-1, 'days').format("YYYY-MM-DD");
  fechaIniSub.value = fechai;
  fechaFinSub.value = fechaf;
  fechaIngresada.value = fechai + ' a ' + fechaf;
}

const initDataMeta = () => {
  let fechai = moment().add(-1, 'days').format("YYYY-MM-DD");
  let fechaf = moment().add(-1, 'days').format("YYYY-MM-DD");
  fechaIniMeta.value = fechai;
  fechaFinMeta.value = fechaf;
  fechaIngresada.value = fechai + ' a ' + fechaf;
}

const initDataPais = () => {
  let fechai = moment().add(-1, 'days').format("YYYY-MM-DD");
  let fechaf = moment().add(-1, 'days').format("YYYY-MM-DD");
  fechaIniPais.value = fechai;
  fechaFinPais.value = fechaf;
  fechaIngresada.value = fechai + ' a ' + fechaf;
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


watch(async () => selectedfechaIniFin.value, async () => {
  let selectedCombo = selectedfechaIniFin.value
  // console.log("selectedCombo:",selectedCombo);
  if (selectedCombo === 'Hoy') {
    fechaIni.value = moment().add(-1, 'days').format("YYYY-MM-DD");
    fechaFin.value = moment().add(-1, 'days').format("YYYY-MM-DD");
    // console.log(fechaIni.value +'--a--'+ fechaFin.value )
  }
  if (selectedCombo === 'Hace una semana') {
    fechaIni.value = moment().add(-7, 'days').format("YYYY-MM-DD");
    fechaFin.value = moment().format("YYYY-MM-DD");
    // console.log(fechaIni.value +'--a--'+ fechaFin.value )
  }
  if (selectedCombo === '15 días atrás') {
    fechaIni.value = moment().add(-15, 'days').format("YYYY-MM-DD");
    fechaFin.value = moment().format("YYYY-MM-DD");
    // console.log(fechaIni.value +'--a--'+ fechaFin.value )
  }
  if (selectedCombo === '1 mes atrás') {
    fechaIni.value = moment().add(-30, 'days').format("YYYY-MM-DD");
    fechaFin.value = moment().format("YYYY-MM-DD");
    // console.log(fechaIni.value +'--a--'+ fechaFin.value )
  }
});

watch(async () => fechaIngresadaMetadato.value, async () => {
  let selectedCombo = fechaIngresadaMetadato.value
  if (selectedCombo === 'Hoy') {
    fechaIniMeta.value = moment().add(-1, 'days').format("YYYY-MM-DD");
    fechaFinMeta.value = moment().add(-1, 'days').format("YYYY-MM-DD");
  }
  if (selectedCombo === 'Hace una semana') {
    fechaIniMeta.value = moment().add(-7, 'days').format("YYYY-MM-DD");
    fechaFinMeta.value = moment().format("YYYY-MM-DD");
  }
  if (selectedCombo === '15 días atrás') {
    fechaIniMeta.value = moment().add(-15, 'days').format("YYYY-MM-DD");
    fechaFinMeta.value = moment().format("YYYY-MM-DD");
  }
  if (selectedCombo === '1 mes atrás') {
    fechaIniMeta.value = moment().add(-30, 'days').format("YYYY-MM-DD");
    fechaFinMeta.value = moment().format("YYYY-MM-DD");
  }
});

watch(async () => fechaIngresadaSubseccion.value, async () => {
  let selectedCombo = fechaIngresadaSubseccion.value
  if (selectedCombo === 'Hoy') {
    fechaIniSub.value = moment().add(-1, 'days').format("YYYY-MM-DD");
    fechaFinSub.value = moment().add(-1, 'days').format("YYYY-MM-DD");
  }
  if (selectedCombo === 'Hace una semana') {
    fechaIniSub.value = moment().add(-7, 'days').format("YYYY-MM-DD");
    fechaFinSub.value = moment().format("YYYY-MM-DD");
  }
  if (selectedCombo === '15 días atrás') {
    fechaIniSub.value = moment().add(-15, 'days').format("YYYY-MM-DD");
    fechaFinSub.value = moment().format("YYYY-MM-DD");
  }
  if (selectedCombo === '1 mes atrás') {
    fechaIniSub.value = moment().add(-30, 'days').format("YYYY-MM-DD");
    fechaFinSub.value = moment().format("YYYY-MM-DD");
  }
});

watch(async () => fechaIngresadaPais.value, async () => {
  let selectedCombo = fechaIngresadaPais.value
  if (selectedCombo === 'Hoy') {
    fechaIniPais.value = moment().add(-1, 'days').format("YYYY-MM-DD");
    fechaFinPais.value = moment().add(-1, 'days').format("YYYY-MM-DD");
  }
  if (selectedCombo === 'Hace una semana') {
    fechaIniPais.value = moment().add(-7, 'days').format("YYYY-MM-DD");
    fechaFinPais.value = moment().format("YYYY-MM-DD");
  }
  if (selectedCombo === '15 días atrás') {
    fechaIniPais.value = moment().add(-15, 'days').format("YYYY-MM-DD");
    fechaFinPais.value = moment().format("YYYY-MM-DD");
  }
  if (selectedCombo === '1 mes atrás') {
    fechaIniPais.value = moment().add(-30, 'days').format("YYYY-MM-DD");
    fechaFinPais.value = moment().format("YYYY-MM-DD");
  }
});


const clickSeccion = () => {
  const dataToSend = {
    fecha: selectedfechaIniFin.value,
    criterio: 'seccion',
    datei: fechaIni.value,
    datef: fechaFin.value
  };
  console.log(dataToSend);
};

const clickSub = () => {
  const dataToSend = {
    fecha: fechaIngresadaSubseccion.value,
    criterio: 'subseccion',
    datei: fechaIniSub.value,
    datef: fechaFinSub.value
  };
  console.log(dataToSend);
};

const clickMeta = () => {
  const dataToSend = {
    fecha: fechaIngresadaMetadato.value,
    criterio: 'metadatos',
    datei: fechaIniMeta.value,
    datef: fechaFinMeta.value
  };
  console.log(dataToSend);
};

const clickPais = () => {
  const dataToSend = {
    fecha: fechaIngresadaPais.value,
    criterio: 'pais',
    datei: fechaIniPais.value,
    datef: fechaFinPais.value
  };
  console.log(dataToSend);
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
              <VCardTitle>Las 5 secciones que más navegan <br>los usuarios</VCardTitle>
              <VCardSubtitle>Datos desde: {{ fechaIni }} hasta {{ fechaFin }}</VCardSubtitle>
            </div>
          </div>

          <template #append>
            <div class="date-picker-wrapper" >
              <VBtn icon color="success" variant="tonal" @click="clickSeccion">
                <VIcon size="22" icon="tabler-download" />
              </VBtn>

            </div>
          </template>
        </VCardItem>

        <VCardItem class="pt-0">
          <div class="date-picker-wrapper" style="width: 250px;">
            <VCombobox v-model="selectedfechaIniFin" :items="fechaIniFinList" variant="outlined" label="" persistent-hint
              hide-selected hint="" />
          </div>
        </VCardItem>

        <VCardText>
          <ChartRecomendaciones :fechaIni="fechaIni" :fechaFin="fechaFin" />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard>
        <VCardItem class="header_card_item">
          <div class="d-flex">
            <div class="descripcion">
              <VCardTitle>Las 5 subsecciones que <br> más navegan los usuarios</VCardTitle>
              <VCardSubtitle>Datos desde: {{ fechaIni }} hasta {{ fechaFin }}</VCardSubtitle>
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
          <div class="date-picker-wrapper" style="width: 250px;">
            <VCombobox v-model="fechaIngresadaSubseccion" :items="fechaIniFinList" variant="outlined" label=""
                persistent-hint hide-selected hint="" />
          </div>
        </VCardItem>

        <VCardText>
          <ChartRecSubsecciones :fechaIniSub="fechaIniSub" :fechaFinSub="fechaFinSub" />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard>
        <VCardItem class="header_card_item">
          <div class="d-flex">
            <div class="descripcion">
              <VCardTitle>Los metadatos que más navegan <br>los usuarios</VCardTitle>
              <VCardSubtitle>Datos desde: {{ fechaIni }} hasta {{ fechaFin }}</VCardSubtitle>
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
          <div class="date-picker-wrapper" style="width: 250px;">
            <VCombobox v-model="fechaIngresadaMetadato" :items="fechaIniFinList" variant="outlined" label=""
                persistent-hint hide-selected hint="" />
              <VSelect class="mt-3" :items="items" label="Secciones" v-model="modelItemsSeccion" />

          </div>
        </VCardItem>

        <VCardText>
          <ChartRecMeta :fechaIniMeta="fechaIniMeta" :fechaFinMeta="fechaFinMeta"
            :modelItemsSeccion="modelItemsSeccion" />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12" md="6">
      <VCard>
        <VCardItem class="header_card_item">
          <div class="d-flex">
            <div class="descripcion">
              <VCardTitle>Los paises que más navegan los usuarios</VCardTitle>
              <VCardSubtitle>Datos desde: {{ fechaIni }} hasta {{ fechaFin }}</VCardSubtitle>
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

        <VCardItem class="pt-0">
          <div class="date-picker-wrapper" style="width: 250px;">
            <VCombobox v-model="fechaIngresadaPais" :items="fechaIniFinList" variant="outlined" label="" persistent-hint
                hide-selected hint="" />
              <VSelect class="mt-3" :items="items" label="Secciones" v-model="modelItemsSeccionPais" />
          </div>
        </VCardItem>

        <VCardText>
          <ChartRecPais :fechaIniPais="fechaIniPais" :fechaFinPais="fechaFinPais"
            :modelItemsSeccionPais="modelItemsSeccionPais" />
        </VCardText>
      </VCard>
    </VCol>

  </VRow>
</template>