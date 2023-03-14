<script setup>
import ChartAreaDispositivosFecha from "@/views/charts/apex-chart/ChartAreaDispositivosfecha.vue";
import ChartAreaDispositivos from "@/views/charts/apex-chart/ChartAreaDispositivos.vue";

const isNewPasswordVisible = ref(false);
const isConfirmPasswordVisible = ref(false);
const smsVerificationNumber = ref("+1(968) 819-2547");
const isTwoFactorDialogOpen = ref(false);

const chartJsCustomColors = {
  white: "#fff",
  yellow: "#ffe802",
  primary: "#836af9",
  areaChartBlue: "#2c9aff",
  barChartYellow: "#ffcf5c",
  polarChartGrey: "#4f5d70",
  polarChartInfo: "#299aff",
  lineChartYellow: "#d4e157",
  polarChartGreen: "#28dac6",
  lineChartPrimary: "#9e69fd",
  lineChartWarning: "#ff9800",
  horizontalBarInfo: "#26c6da",
  polarChartWarning: "#ff8131",
  scatterChartGreen: "#28c76f",
  warningShade: "#ffbd1f",
  areaChartBlueLight: "#84d0ff",
  areaChartGreyLight: "#edf1f4",
  scatterChartWarning: "#ff9f43",
};

const recentDevices = [
  {
    browser: "Windows",
    icon: "tabler-brand-windows",
    color: "info",
    device: "HP Spectre 360",
    location: "Switzerland",
    activity: "10, July 2021 20:07",
  },
  {
    browser: "Chrome on iPhone",
    icon: "tabler-device-mobile",
    color: "error",
    device: "iPhone 12x",
    location: "Australia",
    activity: "13, July 2021 10:10",
  },
  {
    browser: "Chrome on Android",
    icon: "tabler-brand-android",
    color: "success",
    device: "Oneplus 9 Pro",
    location: "Dubai",
    activity: "14, July 2021 15:15",
  },
  {
    browser: "Chrome on MacOS",
    icon: "tabler-brand-apple",
    color: "secondary",
    device: "Apple iMac",
    location: "India",
    activity: "16, July 2021 16:17",
  },
  {
    browser: "Chrome on Windows",
    icon: "tabler-brand-windows",
    color: "info",
    device: "HP Spectre 360",
    location: "Switzerland",
    activity: "20, July 2021 21:01",
  },
  {
    browser: "Chrome on Android",
    icon: "tabler-brand-android",
    color: "success",
    device: "Oneplus 9 Pro",
    location: "Dubai",
    activity: "20, July 2021 21:01",
  },
];

const iconDevices = [
  {
    browser: "Windows",
    icon: "tabler-brand-windows",
    color: "info",
  },
  {
    browser: "MacOS",
    icon: "tabler-brand-apple",
    color: "secondary",
  },
  {
    browser: "Android",
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
    const timestamp = new Date(item.data[0].timestamp);
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
  const response = await fetch('https://servicio-de-actividad.vercel.app/dispositivos/all/X@2023');
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
            <VCardTitle>Area Chart</VCardTitle>
            <VCardSubtitle>Commercial networks</VCardSubtitle>
          </VCardItem>
          <ChartAreaDispositivosFecha />
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <!-- 👉 Recent devices -->
      <VCard title="Table API Dinamica">
        <label for="date-picker">Filtrar por fecha:</label>
        <!-- <input type="text" id="date-picker" ref="datePicker" /> -->
        <div class="date-picker-wrapper" style="width: 233px">
            <AppDateTimePicker id="date-picker" placeholder="Seleccionar una fecha" prepend-inner-icon="tabler-calendar"
              density="compact" @on-change="updateTable" :config="{
                position: 'auto right',
                locale: Spanish,
                mode: 'range',
                altFormat: 'F j, Y',
                dateFormat: 'm-d-Y',
              }" />
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
            <tr id="getDispTable" v-for="device in filteredData.data" :key="device.browser">
              <td>
                <span v-for="iconD in iconDevices" :key="iconD.browser">
                  <VAvatar v-if="device.data[0].os === iconD.browser" :size="22" class="me-3">
                    <VIcon :color="iconD.color" :icon="iconD.icon" />
                  </VAvatar>
                </span>
                <span class="font-weight-medium">{{ device.data[0].browser }} on {{ device.data[0].os }}</span>
              </td>

              <td class="text-medium-emphasis">
                {{ device.data[0].user }}
              </td>

              <td class="text-medium-emphasis">
                {{ device.data[0].ip }}
              </td>

              <td class="text-medium-emphasis">
                {{ device.data[0].timestamp }}
              </td>
            </tr>
          </tbody>
        </VTable>
        <!-- <VDivider />
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
                      <tr v-for="device in recentDevices" :key="device.browser">
                        <td>
                          <VAvatar :size="22" class="me-3">
                            <VIcon :color="device.color" :icon="device.icon" />
                          </VAvatar>
                          <span class="font-weight-medium">{{ device.browser }}</span>
                        </td>

                        <td class="text-medium-emphasis">
                          {{ device.device }}
                        </td>

                        <td class="text-medium-emphasis">
                          {{ device.location }}
                        </td>

                        <td class="text-medium-emphasis">
                          {{ device.activity }}
                        </td>
                      </tr>
                    </tbody>
                  </VTable> -->
      </VCard>
    </VCol>
  </VRow>

  <!-- 👉 Enable One Time Password Dialog -->
  <EnableOneTimePasswordDialog v-model:isDialogVisible="isTwoFactorDialogOpen" :mobile-number="smsVerificationNumber" />
</template>
