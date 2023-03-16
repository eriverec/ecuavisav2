<script setup>
import ChartAreaDispositivosFecha from "@/views/charts/apex-chart/ChartAreaDispositivosfecha.vue";
import ChartAreaDispositivos from "@/views/charts/apex-chart/ChartAreaDispositivos.vue";

const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const smsVerificationNumber = ref("+1(968) 819-2547");
const isTwoFactorDialogOpen = ref(false);

const iconDevices = [
  {
    browser: "Chrome",
    os: "Windows",
    icon: "tabler-brand-windows",
    color: "info",
  },
  {
    browser: "Safari",
    os: "Mac OS",
    icon: "tabler-brand-apple",
    color: "secondary",
  },
  {
    browser: "Chrome",
    os: "Android",
    icon: "tabler-brand-android",
    color: "success",
  },
];

// console.log(recentDevices);

// const listItems = ref([]);

/*
async function getData() {
  const res = await fetch(
    "https://servicio-de-actividad.vercel.app/dispositivos/all/X@2023"
  );
  const finalRes = await res.json();

  const nivelget = finalRes;
  // console.log(nivelget);

  listItems.value = nivelget;
}

getData();
*/
const state = reactive({
  data: [],
  startDate: "",
  endDate: "",
});

const filteredData = computed(() => {
  if (!state.startDate || !state.endDate) {
    return state.data;
  }
  // device.data[0].timestamp
  return state.data.filter((item) => {
    const timestamp = new Date(item.timestamp);
    return (
      timestamp >= new Date(state.startDate) &&
      timestamp <= new Date(state.endDate)
    );
  });
});

function updateTable() {
  filteredData.value;
}

onMounted(async () => {
  const response = await fetch('https://servicio-de-actividad.vercel.app/dispositivos/all');
  state.data = await response.json();
  console.log(state.data);
});


</script>

<style type="text/css">
.disabled {
  opacity: 0.1;
  pointer-events: none;
}
</style>
<template>
  <VRow>
    <!-- 👉  Area chart -->
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex flex-wrap justify-space-between gap-4">
          <VCardItem class="pt-0 pb-0">
            <VCardTitle>Actividad</VCardTitle>
            <VCardSubtitle>De dispositivos</VCardSubtitle>
          </VCardItem>
          <ChartAreaDispositivosFecha />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Recent devices -->
      <VCard title="Table API Dinamica">
   
        <!-- <input type="text" id="date-picker" ref="datePicker" /> -->
        <div class="date-picker-wrapper" style="width: 233px">
            <AppDateTimePicker id="date-picker" placeholder="Seleccionar una fecha" prepend-inner-icon="tabler-calendar"
              density="compact" @on-change="updateTable" />
          </div>
          
 
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">BROWSER</th>
              <th scope="col">DEVICE</th>
              <th scope="col">LOCATION</th>
              <th scope="col">RECENT ACTIVITY</th>
            </tr>
          </thead>

          <tbody>
            <tr id="getDispTable" v-for="disp in filteredData.data" :key="disp.browser">
              <td>
                <span v-for="iconD in iconDevices" :key="iconD.browser">
                  <VAvatar v-if="disp.os === iconD.os" :size="22" class="me-3">
                    <VIcon :color="iconD.color" :icon="iconD.icon" />
                  </VAvatar>
                </span>
                <span class="font-weight-medium">{{ disp.browser }} on {{ disp.os }}</span>
              </td>

              <td class="text-medium-emphasis">
                {{ disp.device }}
              </td>

              <td class="text-medium-emphasis">
                {{ disp.country }}
              </td>

              <td class="text-medium-emphasis">
                {{ disp.timestamp }}
              </td>
            </tr>
          </tbody>
        </VTable>
   
      </VCard>
    </VCol>
  </VRow>

  <!-- 👉 Enable One Time Password Dialog -->
  <EnableOneTimePasswordDialog v-model:isDialogVisible="isTwoFactorDialogOpen" :mobile-number="smsVerificationNumber" />
</template>
