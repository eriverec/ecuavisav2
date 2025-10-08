<script setup>
  const tab = ref('tab-meta-data')
  import Moment from 'moment';
  import { extendMoment } from 'moment-range';
  import esLocale from "moment/locale/es";
  import { onMounted } from 'vue';
  import { useTheme } from 'vuetify';
  const vuetifyTheme = useTheme()
  const moment = extendMoment(Moment);
      moment.locale('es', [esLocale]);

  const fechaIni = ref('');
  const fechaFin = ref('');
  const isDialogVisible = ref(false)



import avatar1 from '@/assets/images/avatars/logox108.png'
import avatar2 from '@/assets/images/avatars/logox108.png'
import avatar3 from '@/assets/images/avatars/logox108.png'
import avatar4 from '@/assets/images/avatars/logox108.png'

const users = [
  {
    avatar: avatar1,
    name: 'Deportes',
    status: 'Online',
    lastVisited: '13',
  },
  {
    avatar: avatar2,
    name: 'Alfred Copeland',
    status: 'Away',
    lastVisited: '11 minutes ago',
  },
]

</script>

<template>
  <VCard title="Metadatos, navegación de usuarios" >
    <VTabs v-model="tab">
      <VTab value="tab-meta-data">
        Trazabilidad
      </VTab>
      <!-- <VTab value="account-details">
        Account Details
      </VTab>
      <VTab value="social-links">
        Social Links
      </VTab> -->
    </VTabs>
    <VDivider />

    <VCard flat>
      <VCardText>
        <VWindow v-model="tab">
          <VWindowItem value="tab-meta-data">
            <VRow>
              <VCol
                cols="12"
                md="12"
              >
                <VList
                  lines="two"
                  border
                >
                  <template
                    v-for="(user, index) of users"
                    :key="user.name"
                  >
                    <VListItem>
                      <template #prepend>
                        <VAvatar :image="user.avatar" />
                      </template>
                      <VListItemTitle>
                        {{ user.name }}
                      </VListItemTitle>
                      <VListItemSubtitle class="mt-1">
                        <span class="">N. Visitas:</span>
                        <span class="text-xs text-disabled ms-1">{{ user.lastVisited }}</span>
                      </VListItemSubtitle>

                      <template #append>
                        <VBtn>
                          Usuarios
                          <VIcon
                            end
                            icon="mdi-account-multiple"
                          />

                        </VBtn>
                      </template>
                    </VListItem>
                    <VDivider v-if="index !== users.length - 1" />
                  </template>
                </VList>


                <VDialog
                  v-model="isDialogVisible"
                  width="500"
                >
                  <!-- Activator -->
                  <template #activator="{ props }">
                    <VBtn v-bind="props">
                      Click Me
                    </VBtn>
                  </template>

                  <!-- Dialog close btn -->
                  <DialogCloseBtn @click="isDialogVisible = !isDialogVisible" />

                  <!-- Dialog Content -->
                  <VCard title="Privacy Policy">
                    <VCardText>
                      Bear claw pastry cotton candy jelly toffee. Pudding chocolate cake shortbread bonbon biscuit sweet. Lemon drops cupcake muffin brownie fruitcake. Pastry pastry tootsie roll jujubes chocolate cake gummi bears muffin pudding caramels. Jujubes lollipop gummies croissant shortbread. Cupcake dessert marzipan topping gingerbread apple pie chupa chups powder. Cake croissant halvah candy canes gummies.
                    </VCardText>

                    <VCardText class="d-flex justify-end">
                      <VBtn @click="isDialogVisible = false">
                        I accept
                      </VBtn>
                    </VCardText>
                  </VCard>
                </VDialog>
              </VCol>
              <VCol
                cols="12"
                md="12"
              >
              <VDivider />
              <br>
                <h3 class="pb-2">Usuarios</h3>
                <VList
                  lines="two"
                  border
                >
                  <template
                    v-for="(user, index) of users"
                    :key="user.name"
                  >
                    <VListItem>
                      <template #prepend>
                        <VAvatar :image="user.avatar" />
                      </template>
                      <VListItemTitle>
                        {{ user.name }}
                      </VListItemTitle>
                      <VListItemSubtitle class="mt-1">
                        <span class="">N. Visitas:</span>
                        <span class="text-xs text-disabled ms-1">{{ user.lastVisited }}</span>
                      </VListItemSubtitle>

                      <template #append>
                        <VBtn>
                          Usuarios
                          <VIcon
                            end
                            icon="mdi-account-multiple"
                          />

                        </VBtn>
                      </template>
                    </VListItem>
                    <VDivider v-if="index !== users.length - 1" />
                  </template>
                </VList>
              </VCol>
            </VRow>

          </VWindowItem>

          <!-- <VWindowItem value="account-details">
            Soy detalis  ssss
          </VWindowItem>

          <VWindowItem value="social-links">
            Soy social sdddsdd
          </VWindowItem> -->
        </VWindow>
      </VCardText>
    </VCard>

  </VCard>
</template>
<style scoped>

</style>
