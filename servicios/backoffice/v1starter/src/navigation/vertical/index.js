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
    title: 'Paquetes',
    children: [
      { title: 'Listar paquetes',
      to:   'paquetes'  },
      { title: 'Periodos',
      to:   'periodos'  },
      { title: 'Modulos',
      to:   'modulos'  },
      
    ],

  },

  {
    title: 'Cerrar sesión',
    to: { name: 'login' },
    icon: { icon: 'tabler-logout' },
  },
]
