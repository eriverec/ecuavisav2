<script setup>
const shortcuts = [
  {
    icon: 'mdi-calendar',
    title: 'Calendar',
    subtitle: 'Appointments',
    to: { name: 'apps-calendar' },
  },
  {
    icon: 'mdi-file-document-outline',
    title: 'Invoice App',
    subtitle: 'Manage Accounts',
    to: { name: 'apps-invoice-list' },
  },
  {
    icon: 'mdi-account-outline',
    title: 'Usuarios',
    subtitle: 'Manage Users',
    to: { name: 'apps-user-list' },
  },
  {
    icon: 'mdi-account-outline',
    title: 'Trazabilidad',
    subtitle: 'Manage Users',
    to: { name: 'apps-trazabilidad-list' },
  },
  {
    icon: 'mdi-view-dashboard-outline',
    title: 'Dashboard',
    subtitle: 'Dashboard Analytics',
    to: { name: 'dashboards-analytics' },
  },
  {
    icon: 'mdi-cog-outline',
    title: 'Ajustes',
    subtitle: 'Account Settings',
    to: {
      name: 'pages-account-settings-tab',
      params: { tab: 'account' },
    },
  },
  {
    icon: 'mdi-help-circle-outline',
    title: 'Help Center',
    subtitle: 'FAQs & Articles',
    to: { name: 'pages-help-center' },
  },
]
</script>

<template>
  <Shortcuts :shortcuts="shortcuts" />
</template>
