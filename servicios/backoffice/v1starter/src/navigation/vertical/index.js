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
      // { title: 'Usuarios Backoffice', to: 'apps-backoffice' },
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
    // to: { name: 'apps-concursos' },
    children: [
      { title: 'Click click boom', to: 'apps-concursos' },
      { title: 'Gavilanes', to: 'apps-concursos-gavilanes' },
    //   // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
    ],
  },
  
  {
    title: 'Trazabilidad',
    icon: { icon: 'tabler-database' },
    // to: { name: 'apps-trazabilidad-list' },
    children: [
      { title: 'Lista de Usuarios', to: 'apps-trazabilidad-list' },
      // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
      // modulos por salir 
      // { title: 'Dispositivos', to: 'apps-dispositivos' },
      { title: 'Visitas', to: 'apps-visitas' },
      { title: 'Metadatos', to: 'apps-metadatos' },
      //{ title: 'Trazabilidad usuarios', to: 'apps-trazabilidad-users' }
    ],
  },

  {
    title: 'Intereses y Sug.',
    icon: { icon: 'tabler-status-change' },
    children: [
      { title: 'Agregar sugerencias', to: 'apps-sugerencias-add' },
      { title: 'Lista Sugerencias', to: 'apps-sugerencias-list' },
      { title: 'Lista Intereses', to: 'categorias' },
    ],
  },

  // {
  //   title: 'Newsletter',
  //   icon: { icon: 'tabler-news' },
  //   to: { name: 'apps-newsletter' }
  // },

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
      { title: 'Banner Slider', to: 'apps-miecuavisa-list' },
      // { title: 'Eventos', to: 'apps-configuracion-add' },
      //{ title: 'Player Forzado', to: 'apps-configuracion-player' }
    ],
  },
  /* {
    title: 'Backoffice',
    to: { name: 'apps-backoffice' },
    icon: { icon: 'tabler-settings-2' },
  }, */
  // modulo por salir filtros
//   {
//     title: 'Filtros',
//    icon: { icon: 'tabler-database-cog' },
//     to: { name: 'apps-filtros' }
// },
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
