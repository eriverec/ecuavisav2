<script setup>
import avatar5 from '@/assets/images/avatars/logox108.png'

import { initialAbility } from '@/plugins/casl/ability'
import { useAppAbility } from '@/plugins/casl/useAppAbility'
import Moment from 'moment'
import { extendMoment } from 'moment-range'
import esLocale from "moment/locale/es"
const moment = extendMoment(Moment);
    moment.locale('es', [esLocale]);
const router = useRouter()
const ability = useAppAbility()
const userData = JSON.parse(localStorage.getItem('userData') || 'null')

async function logout () {
  await accionBackoffice();
  // Remove "userData" from localStorage
  localStorage.removeItem('userData')

  // Remove "accessToken" from localStorage
  localStorage.removeItem('accessToken')
  router.push('/login').then(() => {

    // Remove "userAbilities" from localStorage
    localStorage.removeItem('userAbilities')

    // Reset ability to initial ability
    ability.update(initialAbility)
  })
}

async function accionBackoffice (){
  let dateNow = moment().format("DD/MM/YYYY HH:mm:ss").toString();
  let userData = JSON.parse(localStorage.getItem('userData'));
  if(userData.email !== 'admin@demo.com' ){
  var myHeaders = new Headers();
				myHeaders.append("Content-Type", "application/json");
			var log = JSON.stringify({
            "usuario": userData.email,   
            "pagina": "logout",
            "fecha": dateNow
					});
			var requestOptions = {
				method: 'POST',
				headers: myHeaders,
				body: log,
				redirect: 'follow'
			};
			await fetch(`https://servicio-logs.vercel.app/accion`, requestOptions)
			.then(response =>{			
			}).catch(error => console.log('error', error));
    }
}
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
      variant="tonal"
    >
      <VImg :src="avatar5" />

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    color="primary"
                    variant="tonal"
                  >
                    <VImg :src="avatar5" />
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              ecuavisa
            </VListItemTitle>
            <VListItemSubtitle>Administrador</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-user"
                size="22"
              />
            </template>

            <VListItemTitle>Perfil</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-settings"
                size="22"
              />
            </template>

            <VListItemTitle>Ajustes</VListItemTitle>
          </VListItem>

          <!-- 👉 Pricing -->
          <!--
            <VListItem link>
            <template #prepend>
            <VIcon
            class="me-2"
            icon="tabler-currency-dollar"
            size="22"
            />
            </template>

            <VListItemTitle>Pricing</VListItemTitle>
            </VListItem> 
          -->

          <!-- 👉 FAQ -->
          <!--
            <VListItem link>
            <template #prepend>
            <VIcon
            class="me-2"
            icon="tabler-help"
            size="22"
            />
            </template>

            <VListItemTitle>FAQ</VListItemTitle>
            </VListItem> 
          -->

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem
            link
            @click="logout"
          >
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Salir</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>
