<script setup>
import CardAnalyticsEarningReportsWeeklyOverview from '@/views/pages/cards/card-analytics/CardAnalyticsEarningReportsWeeklyOverview.vue'
import CardAnalyticsEarningReportsYearlyOverview from '@/views/pages/cards/card-analytics/CardAnalyticsEarningReportsYearlyOverview.vue'
import CardAnalyticsProjectStatus from '@/views/pages/cards/card-analytics/CardAnalyticsProjectStatus.vue'
import CardAnalyticsRevenueReport from '@/views/pages/cards/card-analytics/CardAnalyticsRevenueReport.vue'
import CardAnalyticsSales from '@/views/pages/cards/card-analytics/CardAnalyticsSales.vue'
import CardAnalyticsSupportTracker from '@/views/pages/cards/card-analytics/CardAnalyticsSupportTracker.vue'
import CardAnalyticsTotalEarning from '@/views/pages/cards/card-analytics/CardAnalyticsTotalEarning.vue'
</script>

<template>
  <VRow>
    <!-- 👉 Earning Report Weekly Overview -->
    <VCol
      cols="12"
      md="6"
      order-md="1"
      order="1"
    >
      <CardAnalyticsEarningReportsWeeklyOverview />
    </VCol>

    <!-- 👉 Support Tracker -->
    <VCol
      cols="12"
      sm="6"
      order-md="2"
      order="2"
    >
      <CardAnalyticsSupportTracker />
    </VCol>

    <!-- 👉 Sales -->
    <VCol
      cols="12"
      md="4"
      sm="6"
      order-md="3"
      order="3"
    >
      <CardAnalyticsSales />
    </VCol>

    <!-- 👉 Revenue Report -->
    <VCol
      cols="12"
      md="8"
      order-md="4"
      order="4"
    >
      <CardAnalyticsRevenueReport />
    </VCol>

    <!-- 👉 Project Status -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
      order-md="5"
      order="6"
    >
      <CardAnalyticsProjectStatus />
    </VCol>

    <!-- 👉 Earning Reports Yearly Overview -->
    <VCol
      cols="12"
      md="6"
      lg="8"
      order-md="6"
      order="5"
    >
      <CardAnalyticsEarningReportsYearlyOverview />
    </VCol>

    <!-- 👉 Total Earning -->
    <VCol
      cols="12"
      sm="6"
      lg="4"
      order="7"
      order-md="7"
    >
      <CardAnalyticsTotalEarning />
    </VCol>
  </VRow>
</template>
