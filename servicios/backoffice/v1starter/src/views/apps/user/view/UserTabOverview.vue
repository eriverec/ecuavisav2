<script setup>
//import UserInvoiceTable from './UserInvoiceTable.vue'
import avatar2 from "@/assets/images/avatars/avatar-2.png";
import figma from "@/assets/images/icons/project-icons/figma.png";
import html5 from "@/assets/images/icons/project-icons/html5.png";
import python from "@/assets/images/icons/project-icons/python.png";
import react from "@/assets/images/icons/project-icons/react.png";
import sketch from "@/assets/images/icons/project-icons/sketch.png";
import vue from "@/assets/images/icons/project-icons/vue.png";
import xamarin from "@/assets/images/icons/project-icons/xamarin.png";
import { avatarText, kFormatter } from "@core/utils/formatters";

const p = defineProps({
  userData: {
    type: Object,
    required: true,
  },
});
const createD = ref(0);
const updateD = ref(0);
const loginD = ref(0);

const formatDate = function(date){
  let dateF;
  if (date.includes("T")) {
    let splitT = date.split("T");
    if(splitT[1].includes('-')){
      let splitF = splitT[1].split('-');
      dateF = splitT[0] + " " + splitF[0];
    }else{
      dateF = splitT[0] + " " + splitT[1];
    }
  } else {
    dateF = date;
  }
return dateF;
};


var timeSince = function(date) {
  if (date){
  if (typeof date !== 'object') {
    date = new Date(date);
  }


  var seconds = Math.floor((new Date() - date) / 1000);
  console.log('1',date);
  console.log('2',new Date());
  var intervalType;

  var interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'año';
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = 'mes';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'día';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = "hora";
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = "minuto";
          } else {
            interval = seconds;
            intervalType = "segundo";
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    if(intervalType == "mes"){intervalType += 'es';}
    else{intervalType += 's';}
  }

  return 'Hace '+ interval + ' ' + intervalType;

}else return null;
};

//console.log(createD);
/*
const projects = [
  {
    logo: react,
    name: 'BGC eCommerce App',
    project: 'React Project',
    totalTask: '122/240',
    progress: 78,
    hours: '18:42',
  },
  {
    logo: figma,
    name: 'Falcon Logo Design',
    project: 'Figma Project',
    totalTask: '09/56',
    progress: 18,
    hours: '20:42',
  },
  {
    logo: vue,
    name: 'Dashboard Design',
    project: 'Vuejs Project',
    totalTask: '290/320',
    progress: 62,
    hours: '120:87',
  },
  {
    logo: xamarin,
    name: 'Foodista mobile app',
    project: 'Xamarin Project',
    totalTask: '290/320',
    progress: 8,
    hours: '120:87',
  },
  {
    logo: python,
    name: 'Dojo Email App',
    project: 'Python Project',
    totalTask: '120/186',
    progress: 49,
    hours: '230:10',
  },
  {
    logo: sketch,
    name: 'Blockchain Website',
    project: 'Sketch Project',
    totalTask: '99/109',
    progress: 92,
    hours: '342:41',
  },
  {
    logo: html5,
    name: 'Hoffman Website',
    project: 'HTML Project',
    totalTask: '98/110',
    progress: 88,
    hours: '12:45',
  },
]
*/
const resolveUserProgressVariant = (progress) => {
  if (progress <= 25) return "error";
  if (progress > 25 && progress <= 50) return "warning";
  if (progress > 50 && progress <= 75) return "primary";
  if (progress > 75 && progress <= 100) return "success";

  return "secondary";
};
</script>

<template>
  <VRow>
    <!--
    <VCol cols="12">
      <VCard title="User's Projects List">
        <VDivider />
        <VTable class="text-no-wrap">
          <thead>
            <tr>
              <th scope="col">
                PROJECT
              </th>
              <th scope="col">
                TOTAL TASK
              </th>
              <th scope="col">
                PROGRESS
              </th>
              <th scope="col">
                HOURS
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="project in projects"
              :key="project.name"
              style="height: 3.75rem;"
            >
              <td>
                <div class="d-flex align-center">
                  <VAvatar
                    :size="38"
                    class="me-3"
                    :image="project.logo"
                  />
                  <div>
                    <p class="text-base mb-0">
                      {{ project.name }}
                    </p>
                    <p class="text-sm text-disabled mb-0">
                      {{ project.project }}
                    </p>
                  </div>
                </div>
              </td>
              <td>
                {{ project.totalTask }}
              </td>
              <td>
                <span>{{ project.progress }}%</span>
                <VProgressLinear
                  :height="8"
                  :model-value="project.progress"
                  rounded
                  :color="resolveUserProgressVariant(project.progress)"
                />
              </td>
              <td class="text-medium-emphasis">
                {{ project.hours }}
              </td>
            </tr>
          </tbody>
        </VTable>
      </VCard>
    </VCol>
    -->
    <VCol cols="12">
      <!-- 👉 Activity timeline -->
      <VCard title="Actividad del Usuario">
        <VCardText>
          <VTimeline
            density="compact"
            align="start"
            truncate-line="both"
            class="v-timeline-density-compact"
          > <!--
            <VTimelineItem dot-color="error" size="x-small">
              <div class="d-flex justify-space-between align-center flex-wrap">
                <h4 class="text-base font-weight-semibold me-1">
                  12 Invoices have been paid
                </h4>
                <span class="text-sm text-disabled text-no-wrap"
                  >12 min ago</span
                >
              </div>
              <p class="mb-2">Invoices have been paid to the company</p>
              <div class="d-flex align-center mt-2">
                <VIcon
                  color="error"
                  icon="tabler-file"
                  size="18"
                  class="me-2"
                />
                <h6 class="font-weight-semibold text-sm">Invoices.pdf</h6>
              </div>
            </VTimelineItem>
 -->
            <VTimelineItem dot-color="primary" size="x-small">
              <div class="d-flex justify-space-between align-center flex-wrap">
                <h4 class="text-base font-weight-semibold me-1">
                  Último inicio de sesión
                </h4>
                <span class="text-sm text-disabled text-no-wrap"
                  >{{timeSince(p.userData.logged_at)}}</span
                >
              </div>

              <p class="mb-1">{{ formatDate(p.userData.logged_at) }}</p>
              <!--
              <div class="d-flex align-center mt-3">
                <VAvatar size="34" class="me-2" :image="avatar2" />
                <div>
                  <h6 class="text-sm font-weight-semibold mb-0">
                    John Doe (Client)
                  </h6>
                  <span>CEO of Kelly Group</span>
                </div>
              </div>
               -->
            </VTimelineItem>

            <VTimelineItem dot-color="info" size="x-small">
              <div class="d-flex justify-space-between align-center flex-wrap">
                <h4 class="text-base font-weight-semibold me-1">
                  Última modificación del usuario
                </h4>
                <span class="text-sm text-disabled text-no-wrap"
                  >{{timeSince(p.userData.updated_at)}}</span
                >
              </div>
              <p class="mb-0">{{ formatDate(p.userData.updated_at)  || 'No se han realizado modificaciones'}}</p>
            </VTimelineItem>

            <VTimelineItem dot-color="success" size="x-small">
              <div class="d-flex justify-space-between align-center flex-wrap">
                <h4 class="text-base font-weight-semibold me-1">
                  Creación del usuario
                </h4>
                <span class="text-sm text-disabled text-no-wrap"
                  >{{timeSince(p.userData.created_at)}}</span
                >
              </div>
              <p class="mb-0">
                {{ formatDate(p.userData.created_at) }}
              </p>
            </VTimelineItem>
          </VTimeline>
        </VCardText>
      </VCard>
    </VCol>
    <!--
    <VCol cols="12">
      <UserInvoiceTable />
    </VCol>
     -->
  </VRow>
</template>
