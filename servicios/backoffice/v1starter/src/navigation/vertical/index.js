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


 // {
  //   title: 'Trazabilidad',
  //   icon: { icon: 'tabler-database' },
  //   to: { name: 'apps-trazabilidad-list' },
  //   // children: [
  //   //   { title: 'Lista', to: 'apps-trasabilidad-list' },
  //   //   // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
  //   // ],
  // },

  {
    title: 'Concursos',
    icon: { icon: 'tabler-balloon' },
    to: { name: 'apps-concursos' },
    // children: [
    //   { title: 'Lista', to: 'apps-trasabilidad-list' },
    //   // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
    // ],
  },
  
  {
    title: 'Trazabilidad',
    icon: { icon: 'tabler-database' },
    // to: { name: 'apps-trazabilidad-list' },
    children: [
      { title: 'Lista de Usuarios', to: 'apps-trazabilidad-list' },
      // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
    ],
  },


  // {
  //   title: 'Paquetes',
  //   children: [
  //     { title: 'Listar paquetes',
  //     to:   'paquetes'  },
  //     { title: 'Periodos',
  //     to:   'periodos'  },
  //     { title: 'Modulos',
  //     to:   'modulos'  },
      
  //   ],

  // },
]
