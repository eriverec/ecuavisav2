<script setup>
import { useUserListStore } from '@/views/apps/user/useUserListStore'
import {
  avatarText
} from '@core/utils/formatters'

const userListStore = useUserListStore()
const route = useRoute()
const mensajeNodefinido = "No configurado";
//const updateData = ref()

const emit = defineEmits([
  'reload',
])

const props = defineProps({
  userData: {
    type: Object,
    required: true,
  },
})

const resolveUserProvider = provider => {
  if (provider === "google")
    return {
      color: "warning",
      icon: '<svg aria-hidden="true" class="native svg-icon iconGoogle" width="2rem" height="2rem" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18Z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17Z" fill="#34A853"></path><path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07Z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3Z" fill="#EA4335"></path></svg>',
    };
  if (provider === "facebook")
    return {
      color: "success",
      icon: '<svg width="2rem" height="2rem" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.4922 3.29117 17.2155 7.59375 17.8906V11.6016H5.30859V9H7.59375V7.01719C7.59375 4.76156 8.9374 3.51562 10.9932 3.51562C11.9779 3.51562 13.0078 3.69141 13.0078 3.69141V5.90625H11.8729C10.7549 5.90625 10.4062 6.6 10.4062 7.31175V9H12.9023L12.5033 11.6016H10.4062V17.8906C14.7088 17.2155 18 13.4922 18 9Z" fill="#1877F2"/></svg>',
    };

  return {
    color: "primary",
    icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33.39 14" width="2rem" height="2rem"><g id="Capa_2" data-name="Capa 2"><g id="logo"><path d="M14.19,12.16a1.66,1.66,0,0,0-1.66-1.66H1.66a1.66,1.66,0,0,0,0,3.32H12.53A1.66,1.66,0,0,0,14.19,12.16Z" style="fill:#7367f0"/><path d="M32.52.19a1.68,1.68,0,0,0-2.25.68L25.09,9.14,20.23.77A1.72,1.72,0,0,0,18.77.08H7.82a1.66,1.66,0,0,0,0,3.32h9.53a1,1,0,0,1,.78.36l5.39,9.3a1.71,1.71,0,0,0,.71.75,1.66,1.66,0,0,0,2.25-.68L33.19,2.44A1.67,1.67,0,0,0,32.52.19Z" style="fill:#7367f0"/><path d="M19.25,13.83a1.65,1.65,0,0,0,.79-2.2s-2.38-4-3.24-5.74a1.12,1.12,0,0,0-1-.63H4.48a1.66,1.66,0,0,0,0,3.32H14a.65.65,0,0,1,.58.29C15.41,10.55,17,13,17,13.05A1.65,1.65,0,0,0,19.25,13.83Z" style="fill:#7367f0"/></g></g></svg>',
  };
};
const isUserInfoEditDialogVisible = ref(false);
const isUpgradePlanDialogVisible = ref(false);
const isUpdatePassVisible = ref(false);
const password = ref({
  new: '',
  confirm: ''
})
const passwordsDifferent = ref(false);
const mensaje = ref('');
const mensajeActivo = ref(false);
const mailIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="2rem" height="2rem" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="#7367f0" d="M4 20q-.825 0-1.412-.587Q2 18.825 2 18V6q0-.825.588-1.412Q3.175 4 4 4h16q.825 0 1.413.588Q22 5.175 22 6v12q0 .825-.587 1.413Q20.825 20 20 20Zm8-7.175q.125 0 .262-.038q.138-.037.263-.112L19.6 8.25q.2-.125.3-.312q.1-.188.1-.413q0-.5-.425-.75T18.7 6.8L12 11L5.3 6.8q-.45-.275-.875-.013Q4 7.05 4 7.525q0 .25.1.437q.1.188.3.288l7.075 4.425q.125.075.263.112q.137.038.262.038Z"/></svg>'



const updateUser = userData => {
  console.log('datos a enviar', userData);
  console.log('id', route.params.id);
  userListStore.updateUser(userData, route.params.id);
  emit('reload');
  // refetch User

};

async function updatePass() {
  //console.log('datos a enviar',password.value);
  //console.log('email', props.userData.email);
  try {
    if (password.value.new && password.value.confirm) {
      if (password.value.new !== password.value.confirm) {
        passwordsDifferent.value = true;
        return mensaje.value = 'Las contraseñas no coinciden';
      }

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        "email": props.userData.email,
        "password": password.value.new
      });

      var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
      await fetch('https://micuenta.ecuavisa.com/loginservice/changePassword', requestOptions)
        .then(response => response.json())
        .then((result) => {
          //console.log('resultado',result.mensaje);
          mensaje.value = result.mensaje;
          mensajeActivo.value = true;
          onPasswordUpdateReset();
        })
        .catch(error => console.log('error', error));

    }
  } catch (error) {
    console.error(error.message);
  }
};

const dialogPasswordValueUpdate = (value) => {
  isUpdatePassVisible.value = value;
  if (value === false) {
    password.value.new = '';
    password.value.confirm = '';
  }
}

const onPasswordUpdateReset = () => {
  password.value.new = '';
  password.value.confirm = '';
  isUpdatePassVisible.value = false;
}


/*
const standardPlan = {
  plan: 'Standard',
  price: 99,
  benefits: [
    '10 Users',
    'Up to 10GB storage',
    'Basic Support',
  ],
}



const resolveUserStatusVariant = stat => {
  if (stat === 'pending')
    return 'warning'
  if (stat === 'active')
    return 'success'
  if (stat === 'inactive')
    return 'secondary'
  
  return 'primary'
}

const resolveUserRoleVariant = role => {
  if (role === 'subscriber')
    return {
      color: 'warning',
      icon: 'tabler-user',
    }
  if (role === 'author')
    return {
      color: 'success',
      icon: 'tabler-circle-check',
    }
  if (role === 'maintainer')
    return {
      color: 'primary',
      icon: 'tabler-chart-pie-2',
    }
  if (role === 'editor')
    return {
      color: 'info',
      icon: 'tabler-pencil',
    }
  if (role === 'admin')
    return {
      color: 'secondary',
      icon: 'tabler-server-2',
    }
  
  return {
    color: 'primary',
    icon: 'tabler-user',
  }
}
*/

const valLetter = ref('');
const dataNewsLetter = ref('');

onMounted(async () => {
  try {
    // Obtener el token
    const responseToken = await fetch("https://estadisticas.ecuavisa.com/sites/gestor/Tools/sendpulse/token.php");
    const token = await responseToken.text();
    const email_ = props.userData.email;

    // Obtener los detalles del correo electrónico
    const responseDetails = await fetch(`https://api.sendpulse.com/emails/${email_}/details`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      redirect: "follow",
    });

    const result = await responseDetails.json();

    // Obtener el valor de valLetter
    const valLetterValue = result.map(user => user.list_name);

    // Verificar si hay más de un elemento en la lista
    
    // Asignar el valor a la variable reactiva
    valLetter.value = valLetterValue;
    // console.log(valLetter.value);
    if (valLetter.value.length >= 1) {
      dataNewsLetter.value = "True";
    }else{
      dataNewsLetter.value = "False";
      return false;
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

</script>

<template>
  <VRow>

    <VSnackbar v-model="passwordsDifferent" color="error" transition="scale-transition" location="top center">
      {{ mensaje }}
    </VSnackbar>

    <VSnackbar v-model="mensajeActivo" color="success" transition="scale-transition" location="top center">
      {{ mensaje }}
    </VSnackbar>

    <!-- SECTION User Details -->
    <VCol cols="12">
      <VCard v-if="props.userData">
        <VCardText class="text-center pt-15">
          <!-- 👉 Avatar -->
          <VAvatar rounded :size="120" color="primary" variant="tonal">
            <VImg v-if="props.userData.avatar" :src="props.userData.avatar" />
            <span v-else class="text-5xl font-weight-semibold">
              {{ avatarText(props.userData.first_name + ' ' + props.userData.last_name) }}
            </span>
          </VAvatar>

          <!-- 👉 User fullName -->
          <h6 class="text-h6 mt-4">
            {{ props.userData.first_name + ' ' + props.userData.last_name }}
          </h6>

          <!-- 👉 Role chip -->
          <!--
          <span
            label
            :color="resolveUserRoleVariant(props.userData.role).color"
            size="small"
            class="text-capitalize mt-4"
          >
            {{ props.userData.role }}
          </span>
           -->
        </VCardText>

        <VCardText class="d-flex justify-center flex-wrap mt-3">
          <!-- 👉 Newsletter -->
          <div class="d-flex align-center me-4 mb-2">
            <VAvatar v-html="mailIcon" rounded color="primary" variant="tonal" class="me-3" />



            <div>
              <h6 class="text-base font-weight-semibold">
                Newsletter
              </h6>
              <!-- <span class="text-sm">{{ props.userData.newsletter_opt_in }}</span> -->
                  <span id="newsletter_list_user" class="text-body-2 ">{{ dataNewsLetter }}</span>

            </div>
          </div>

          <!-- 👉 Provider -->
          <div class="d-flex align-center  me-4 mb-2">
            <VAvatar v-html="resolveUserProvider(props.userData.provider).icon" size="38" rounded color="primary"
              variant="tonal" class="me-3" />



            <div>
              <h6 class="text-base font-weight-semibold">
                Proveedor
              </h6>
              <span class="text-sm">{{ props.userData.provider }}</span>
            </div>
          </div>
        </VCardText>

        <VDivider />

        <!-- 👉 Details -->
        <VCardText>
          <p class="text-sm text-uppercase text-disabled">
            Detalles
          </p>

          <!-- 👉 User Details list -->
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle class="item_news">
                <h6 class="text-base font-weight-semibold">
                  Newsletter:
                  <!-- <span id="newsletter_list_user" class="text-body-2 ">{{ valLetter }}</span> -->
                  <span class="text-body-2">
                    <VChip v-if="valLetter.length" class="block_news" v-for="(item, index) in valLetter" :key="index">
                      {{ item }}
                    </VChip>
                    <div v-else > <VChip>Cargando...</VChip></div>
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>
            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Nombre:
                  <span class="text-body-2">
                    {{ props.userData.first_name + ' ' + props.userData.last_name }}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Email:
                  <span class="text-body-2">{{ props.userData.email }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem style="display: none;">
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Prefijo teléfono:

                  <span v-if="props.userData.phone_prefix.length > 0" class="text-capitalize text-body-2">
                    {{ props.userData.phone_prefix }}
                  </span>
                  <span v-else class="text-body-2" label color="warning">{{ mensajeNodefinido }}</span>
                  
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Teléfono:
                  <span v-if="props.userData.phone_number.length > 0" class="text-capitalize text-body-2">
                    {{ props.userData.phone_number }}
                  </span>
                  <span v-else class="text-body-2" label color="warning">{{ mensajeNodefinido }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Género:
                  <span v-if="props.userData.gender.length > 0" class="text-body-2">
                    {{ props.userData.gender }}
                  </span>
                  <span v-else class="text-body-2" label color="warning">{{ mensajeNodefinido }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Nacimiento:
                  <span v-if="props.userData.birth_date.length > 0" class="text-body-2">{{ props.userData.birth_date
                  }}</span>
                  <span v-else class="text-body-2" label color="warning">{{ mensajeNodefinido }}</span>

                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Tipo de ID:
                  <span v-if="props.userData.identification_type.length > 0" class="text-body-2">{{ props.userData.identification_type }}</span>
                  <span v-else class="text-body-2" label color="warning">{{ mensajeNodefinido }}</span>
                </h6>
              </VListItemTitle>
            </VListItem>

            <VListItem>
              <VListItemTitle>
                <h6 class="text-base font-weight-semibold">
                  Número de ID:
                  <span v-if="props.userData.identification_number.length > 0" class="text-body-2">{{ props.userData.identification_number || '' }}</span>
                  <span v-else class="text-body-2" label color="warning">{{ mensajeNodefinido }}</span>

                </h6>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>

        <!-- 👉 Edit and Suspend button -->
        <VCardText class="d-flex justify-center">
          <VBtn variant="elevated" class="me-3" @click="isUpdatePassVisible = true">
            Actualizar contraseña
          </VBtn>

          <VBtn variant="elevated" class="me-3 d-none" @click="isUserInfoEditDialogVisible = true">
            Editar
          </VBtn>
          <VBtn variant="tonal" class="d-none" color="error">
            Suspender
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
    <!-- !SECTION -->

    <!-- SECTION Current Plan -->
    <!--
    <VCol cols="12">
      <VCard>
        <VCardText class="d-flex">
         // 👉 Standard Chip 
          <span
            label
            color="primary"
            size="small"
          >
            Standard
          </span>

          <VSpacer />

          // 👉 Current Price  
          <div class="d-flex align-center">
            <sup class="text-primary text-sm font-weight-regular">$</sup>
            <h3 class="text-h3 text-primary font-weight-semibold">
              99
            </h3>
            <sub class="mt-3"><h6 class="text-sm font-weight-regular">/ month</h6></sub>
          </div>
        </VCardText>

        <VCardText>
         //  👉 Price Benefits 
          <VList class="card-list">
            <VListItem
              v-for="benefit in standardPlan.benefits"
              :key="benefit"
            >
              <VIcon
                size="12"
                color="#A8AAAE"
                class="me-2"
                icon="tabler-circle"
              />
              <span>{{ benefit }}</span>
            </VListItem>
          </VList>

         // 👉 Days 
          <div class="my-6">
            <div class="d-flex font-weight-semibold mt-3 mb-2">
              <h6 class="text-base font-weight-semibold">
                Days
              </h6>
              <VSpacer />
              <h6 class="text-base font-weight-semibold">
                26 of 30 Days
              </h6>
            </div>

           // 👉 Progress 
            <VProgressLinear
              rounded
              rounded-bar
              :model-value="65"
              height="8"
              color="primary"
            />

            <p class="mt-2">
              4 days remaining
            </p>
          </div>

         // 👉 Upgrade Plan 
          <VBtn
            block
            @click="isUpgradePlanDialogVisible = true"
          >
            Upgrade Plan
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
        -->
    <!-- !SECTION -->
  </VRow>

  <!-- 👉 Edit user info dialog -->
  <UserInfoEditDialog v-model:isDialogVisible="isUserInfoEditDialogVisible" :user-data="props.userData"
    @submit="updateUser" />
  <!-- 👉 Actualizar password -->
  <VDialog :width="$vuetify.display.smAndDown ? 'auto' : 700" :model-value="isUpdatePassVisible"
    @update:model-value="dialogPasswordValueUpdate">
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogPasswordValueUpdate(false)" />

    <VCard class="pa-sm-14 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          Actualizar contraseña
        </VCardTitle>
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm class="mt-6" @submit.prevent="updatePass()">
          <VRow class="d-flex flex-wrap justify-center gap-4">
            <!-- 👉 Nombre -->
            <VCol cols="8">
              <VTextField v-model="password.new" label="Contraseña nueva" />
            </VCol>

            <VCol cols="8">
              <VTextField v-model="password.confirm" label="Confirmar contraseña" />
            </VCol>

            <!-- 👉 Submit and Cancel -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn type="submit"> Enviar </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onPasswordUpdateReset">
                Cancelar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>

  <!-- 👉 Upgrade plan dialog -->
  <!--
  <UserUpgradePlanDialog v-model:isDialogVisible="isUpgradePlanDialogVisible" />
   -->
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.7rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}

</style>

<style scoped>
.item_news {
  white-space: initial ;
}

.block_news {
  margin: 5px 5px;
}
</style>
