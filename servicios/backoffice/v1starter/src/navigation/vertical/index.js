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
  //   //   { title: 'Lista', to: 'apps-trazabilidad-list' },
  //   //   // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
  //   // ],
  // },

  {
    title: 'Concursos',
    icon: { icon: 'tabler-balloon' },
    to: { name: 'apps-concursos' },
    // children: [
    //   { title: 'Lista', to: 'apps-trazabilidad-list' },
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
      { title: 'Dispositivos', to: 'apps-dispositivos' },
      { title: 'Visitas', to: 'apps-visitas' }
    ],
  },

  {
    title: 'Intereses y Sug.',
    icon: { icon: 'tabler-status-change' },
    children: [
      { title: 'Ver sugerencias', to: 'apps-sugerencias-list' },
      { title: 'Agregar sugerencias', to: 'apps-sugerencias-add' },
      { title: 'Ver Intereses', to: 'categorias' },
    ],
  },

  // {
  //   title: 'Colecciones',
  //   icon: { icon: 'tabler-database-cog' },
  //   to: { name: 'coleccion' }
  // }

  {
    title: 'Ecuavisa.com',
    icon: { icon: 'tabler-settings-2' },
    children: [
      { title: 'Módulos', to: 'apps-configuracion-list' },
      // { title: 'Eventos', to: 'apps-configuracion-add' },
    ],
  },
<<<<<<< Updated upstream

=======
  {
       title: 'Intereses',
      icon: { icon: 'tabler-database-cog' },
       to: { name: 'categorias' }
  },
  {
    title: 'Filtros',
   icon: { icon: 'tabler-database-cog' },
    to: { name: 'apps-filtros' }
},
>>>>>>> Stashed changes
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
