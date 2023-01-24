export default [
  {
    title: 'Dashboard',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
  },
  // {
  //   title: 'Usuarios',
  //   to: { name: 'usersList' },
  //   icon: { icon: 'tabler-user' },
  // },
  {
    title: 'Usuarios',
    icon: { icon: 'tabler-user' },
    children: [
      { title: 'Lista', to: 'apps-user-list' },
      // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
    ],
  },

  {
    title: 'Modulos',
    to: { name: 'modulos' },
    //icon: { icon: 'tabler-smart-home' },
  },

  {
    title: 'Periodos',
    to: { name: 'periodos' },
    //icon: { icon: 'tabler-smart-home' },
  },

  {
    title: 'Paquetes',
    to: { name: 'paquetes' },
    //icon: { icon: 'tabler-smart-home' },
  },
 
  {
    title: 'Cerrar sesión',
    to: { name: 'login' },
    icon: { icon: 'tabler-logout' },
  },
]
