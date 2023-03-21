<script setup>
import avatar1 from '@/assets/images/avatars/avatar-1.png'
import avatar2 from '@/assets/images/avatars/avatar-2.png'

const isLoading = ref(true);
const urlCounts = ref([]);


async function fetchData() {
  try {
    const response = await fetch('https://servicio-de-actividad.vercel.app/actividad/trazabilidad/823381932023210427');
    const data = await response.json();
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
    urlCounts.value = Array.from(urlMap.values());
    urlCounts.value.sort((a, b) => {
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

  } catch (error) {
    console.error(error);
  }
  isLoading.value = false;
}

onMounted(fetchData);

</script>

<template>
  <VCardText>
    <div v-if="isLoading">Cargando datos...</div>
    <VTimeline v-else side="end" align="start" truncate-line="both" density="compact"
      class="v-timeline-density-compact mt-5">
      <VTimelineItem dot-color="warning" size="x-small" v-for="item  in urlCounts" :key="item.url">
        <!-- 👉 Header -->
        <div class="d-flex justify-space-between">
          <h6 class="text-base font-weight-semibold me-3">
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
</template>
