<script setup>
import auFlag from '@/assets/images/icons/countries/au.png'
import brFlag from '@/assets/images/icons/countries/br.png'
import cnFlag from '@/assets/images/icons/countries/cn.png'
import frFlag from '@/assets/images/icons/countries/fr.png'
import inFlag from '@/assets/images/icons/countries/in.png'
import usFlag from '@/assets/images/icons/countries/us.png'
import ecFlag from '@/assets/images/icons/countries/ec.svg'
// import { useAsync } from '@vueuse/core';

const salesByCountries = [
  {
    avatarImg: brFlag,
    stats: '$2,415k',
    subtitle: 'Brazil',
    profitLoss: -6.2,
  },
  {
    avatarImg: inFlag,
    stats: '$865k',
    subtitle: 'India',
    profitLoss: 12.4,
  },
  {
    avatarImg: auFlag,
    stats: '$745k',
    subtitle: 'Australia',
    profitLoss: -11.9,
  },
  {
    avatarImg: frFlag,
    stats: '$45',
    subtitle: 'France',
    profitLoss: 16.2,
  },
  {
    avatarImg: cnFlag,
    stats: '$12k',
    subtitle: 'China',
    profitLoss: 14.8,
  },
]

const countriesUbicaciones = [
  {
    country: 'Ecuador',
    avatarImg: ecFlag,
  },
  {
    country: 'USA',
    avatarImg: ecFlag,
  },
  {
    country: 'Brazil',
    avatarImg: brFlag,
  },
  {
    country: 'India',
    avatarImg: inFlag,
  },
  {
    country: 'Australia',
    avatarImg: auFlag,
  },
  {
    country: 'Francia',
    avatarImg: frFlag,
  },
  {
    country: 'China',
    avatarImg: cnFlag,
  },
]

const apiUrl = 'https://servicio-de-actividad.vercel.app/dispositivos/all'
const activities = ref([])
const cityCounts = ref({})
const isLoading = ref(true)
const sortedCityCounts = ref([])
const tableRows = ref([])

onMounted(async () => {
  const response = await fetch(apiUrl)
  const data = await response.json()
  activities.value = data.data
  console.log(activities.value)

  for (const activity of activities.value) {
    const cityKey = `${activity.country}-${activity.city}-${activity.countryCode}`
    cityCounts.value[cityKey] = (cityCounts.value[cityKey] || 0) + 1
  }
  sortedCityCounts.value = Object.entries(cityCounts.value).sort((a, b) => b[1] - a[1])

  tableRows.value = sortedCityCounts.value.map(([cityKey, count]) => {
    const [country, city, countryCode] = cityKey.split('-')
    return { country, city, count, countryCode }
  })

  isLoading.value = false
})

function sortByDesc() {
  sortedCityCounts.value = Object.entries(cityCounts.value).sort((a, b) => b[1] - a[1])
  updateTableRows()
}

function sortByAsc() {
  sortedCityCounts.value = Object.entries(cityCounts.value).sort((a, b) => a[1] - b[1])
  updateTableRows()
}

function updateTableRows() {
  tableRows.value = sortedCityCounts.value.map(([cityKey, count]) => {
    const [country, city, countryCode] = cityKey.split('-')
    return { country, city, count, countryCode }
  })
}


</script>

<template>
  <VCard title="Dispositivos por Países">
    <VCardText>
      <div v-if="isLoading">
        Cargando datos...
      </div>
      <VList class="card-list" v-else>
        <VBtnToggle class="grupoBotones mb-5" density="compact" color="primary" variant="outlined" divided>
          <VBtn @click="sortByAsc" class="btn-check">Ascendente</VBtn>
          <VBtn @click="sortByDesc">Descendente</VBtn>
        </VBtnToggle>
        <VListItem v-for="(row, index) in tableRows" :key="index">
          <template #prepend>
            <VAvatar class="ava" size="34"
              :image="'https://www.countryflagicons.com/FLAT/64/' + row.countryCode + '.png'" />
          </template>
          <VListItemTitle class="font-weight-medium d-block">
            {{ row.country }}
          </VListItemTitle>
          <VListItemSubtitle class="opacity-100 text-disabled">
            {{ row.city }}
          </VListItemSubtitle>
          <template #append>
            <div :class="`d-flex align-center font-weight-semibold ${row.count > 0 ? 'text-success' : 'text-error'}`">
              <!-- <span>{{ row.count }} </span> -->
              <VChip label >{{ row.count }} {{row.count === 1 ? 'Visita' : 'Visitas'}} </VChip>
            </div>
          </template>
        </VListItem>

      </VList>
    </VCardText>

    <!-- <template #append>
          <div class="mt-n4 me-n2">
            <VBtn icon color="default" size="x-small" variant="plain">
              <VIcon size="22" icon="tabler-dots-vertical" />

              <VMenu activator="parent">
                <VList>
                  <VListItem v-for="(item, index) in ['Refresh', 'Download', 'View All']" :key="index" :value="index">
                    <VListItemTitle>{{ item }}</VListItemTitle>
                  </VListItem>
                </VList>
              </VMenu>
            </VBtn>
          </div>
        </template> -->

    <!-- <VCardText>
            <VList class="card-list">
              <VListItem v-for="country in salesByCountries" :key="country.stats">
                <template #prepend>
                  <VAvatar size="34" color="secondary" variant="tonal" :image="country.avatarImg" />
                </template>

                <VListItemTitle class="font-weight-medium">
                  {{ country.stats }}
                </VListItemTitle>
                <VListItemSubtitle class="opacity-100 text-disabled">
                  {{ country.subtitle }}
                </VListItemSubtitle>

                <template #append>
                  <div
                    :class="`d-flex align-center font-weight-semibold ${country.profitLoss > 0 ? 'text-success' : 'text-error'}`">
                    <VIcon :icon="country.profitLoss > 0 ? 'tabler-chevron-up' : 'tabler-chevron-down'" size="18"
                      class="me-1" />
                    <span>{{ Math.abs(country.profitLoss) }}%</span>
                  </div>
                </template>
              </VListItem>
            </VList>
          </VCardText> -->
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 19px;
}

.grupoBotones{
  display: flex;
  justify-content: center;
}

.v-avatar {
  border-radius: initial !important;
}

.ava {
  margin-inline-end: 16px;
}
</style>
