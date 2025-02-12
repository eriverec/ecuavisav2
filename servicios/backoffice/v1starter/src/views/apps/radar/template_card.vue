<template>
  <VRow>
    <VCol
      v-for="item in items"
      :key="item.id"
      cols="12"
      sm="4"
      md="4"
      :lg="vertical === 'Últimas noticias' ? '2' : '4'"
    >
      <div class="d-flex flex-column card-column">
        <a class="img" title="Ir a la página" :href="item.enlace" target="_blank">
          <img v-if="item.picture" :src="replaceAmp(item.picture)" class="fixed-avatar rounded-top" />
          <VIcon v-else icon="tabler-news" size="120" />
        </a>

        <div class="d-flex flex-column px-2 pb-2">
          <div class="text-vertical py-2 d-flex gap-2 align-center justify-space-between">
            <VChip size="x-small">{{ item.vertical.toUpperCase() }}</VChip>
            <VBtn title="Ir a la página" :href="item.enlace" target="_blank" color="primary" variant="tonal" size="small">
              <VIcon icon="tabler-external-link" /> Ir
            </VBtn>
          </div>

          <div class="d-flex gap-2 align-center otros-detalles py-2">
            <span class="text-xs" title="Fecha de publicación de la nota">{{ formatDate(item.fechaPublicacion) || 'Sin fecha' }}</span>
            <VChip v-if="item.subVertical" class="ml-2" size="x-small" color="secondary">{{ item.subVertical }}</VChip>
          </div>

          <div class="h4 titulo">
            {{ item.titulo }}
          </div>

          <VDivider class="mt-3" />

          <div class="text-vertical pt-2 d-flex gap-2 align-center justify-space-between">
            <div class="autor-ec d-flex align-center gap-1" title="Autor">
              <VIcon icon="tabler-user" size="15" /> <small class="text-xs" style="line-height: 1.2;">{{ item.autor }}</small>
            </div>
            <div class="article-type-ec d-flex align-center gap-1" title="Tipo de artículo">
              <VIcon icon="tabler-article" size="15" /> <small>{{ item.tipo }}</small>
            </div>
          </div>
        </div>
      </div>
    </VCol>
  </VRow>
</template>

<script setup>
import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import esLocale from "moment/locale/es";
import { defineProps } from "vue";

const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);
    moment.tz.setDefault('America/Guayaquil');

const props = defineProps({
  items: { type: Array, required: true },
  vertical: { type: String, required: true },
});

const replaceAmp = (url) => url.replace(/&amp;/g, "&");
const hoy = moment().format('DD/MM/YYYY');

const formatDate = (dateString) => {
  // if( moment(dateString, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY') == hoy ) return 'Hoy, '+ moment(dateString, 'DD/MM/YYYY HH:mm:ss').format('HH:mm');
  return moment(dateString, 'DD/MM/YYYY HH:mm:ss').format('DD/MM/YYYY HH:mm')
}
</script>


<style scoped>
.card-column {
  border: 1px solid #eeeeee;
  padding: 0px;
  border-radius: 8px;
}

img.fixed-avatar.rounded-top {
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
}
.sectionprimicias .v-card-item {
  font-size: 24px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  height: 400px;
  display: block;
  overflow-y: auto;
}

.content-title {
  justify-content: space-between;
  align-items: center;
}

.board-content {
  height: 500px;
  overflow-y: auto;
}

th,
td {
  /* border: 1px solid #ddd; */
  padding: 8px;
  text-align: left;
}

.fixed-avatar {
    width: 100%;
    height: 130px;
    object-fit: cover;
    object-position: center;
}

.h4.titulo {
    font-size: 13px;
    line-height: 1.3;
}



.disabled-card {
  pointer-events: none;
  cursor: default;
  opacity: 0.6;
}

/* th {
  background-color: #f2f2f2;
} */
</style>