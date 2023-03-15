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

// const data = [
//   { city: 'New York', country: 'USA', device: 'iPhone' },
//   { city: 'Los Angeles', country: 'USA', device: 'Samsung' },
//   { city: 'London', country: 'Japan', device: 'Google Pixel' },
//   { city: 'Paris', country: 'Australia', device: 'iPhone' },
//   { city: 'Tokyo', country: 'Japan', device: 'OnePlus' },
//   { city: 'Sydney', country: 'Australia', device: 'Samsung' },
//   { city: 'Toronto', country: 'Canada', device: 'Google Pixel' },
//   { city: 'Berlin', country: 'Germany', device: 'iPhone' },
//   { city: 'Mumbai', country: 'Australia', device: 'OnePlus' },
//   { city: 'Moscow', country: 'Australia', device: 'Samsung' }
// ];
// const countryCounts = {};

// console.log('countryCounts:', countryCounts)
// data.forEach((datum) => {
//   if (countryCounts[datum.country]) {
//     countryCounts[datum.country]++;
//   } else {
//     countryCounts[datum.country] = 1;
//   }
// });

const apiUrl = 'https://servicio-de-actividad.vercel.app/all/X@2023'
const activities = ref([])
const cityCounts = ref({})

console.log('activities', activities)

onMounted(async () => {
  const response = await fetch(apiUrl)
  const data = await response.json()
  activities.value = data.data
  console.log(activities.value)

  for (const activity of activities.value) {
    const cityKey = `
      <VListItemTitle class="font-weight-medium d-block">
        ${activity.country}
      </VListItemTitle>
      <VListItemSubtitle class="opacity-100 text-disabled">
        ${activity.city}
      </VListItemSubtitle>`
    cityCounts.value[cityKey] = (cityCounts.value[cityKey] || 0) + 1
  }
})

</script>

<template>
  <VCard title="Sales by Countries" subtitle="Monthly Sales Overview">
    <VCardText>
      <VList class="card-list">
        <VListItem v-for="(count, city, country) in cityCounts " :key="city">
          <template #prepend>
            <span v-for="ubi in countriesUbicaciones" :key="ubi.country">
              <span v-if="ubi.country === 'Ecuador'">
                <VAvatar class="ava" size="34" color="secondary" variant="tonal" :image="ubi.avatarImg" />
              </span>
            </span>
          </template>

          <div v-html="city"></div>

          <template #append>
            <div :class="`d-flex align-center font-weight-semibold ${count > 0 ? 'text-success' : 'text-error'}`">
              <VIcon :icon="count > 0 ? 'tabler-chevron-up' : 'tabler-chevron-down'" size="18" class="me-1" />
              <span>{{ count }}%</span>
            </div>
          </template>
        </VListItem>

      </VList>


    </VCardText>

    <template #append>
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
    </template>

    <VCardText>
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
    </VCardText>
  </VCard>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 19px;
}

.v-img__img--contain {
  object-fit: cover !important;
}

.ava {
  margin-inline-end: 16px;
}
</style>
