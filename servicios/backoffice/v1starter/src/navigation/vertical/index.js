export default [
  {
    title: 'Dashboard',
    to: { name: 'index' },
    icon: { icon: 'tabler-smart-home' },
  },
  {
    title: 'Usuarios',
    icon: { icon: 'tabler-user' },
    children: [
      { title: 'Lista', to: 'apps-user-list' },
      // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
    ],
  },

  {
    title: 'Concursos',
    icon: { icon: 'tabler-balloon' },
    // to: { name: 'apps-concursos' },
    children: [
      { title: 'Click click boom', to: 'apps-concursos' },
      { title: 'Gavilanes', to: 'apps-concursos-gavilanes' }
    ],
  },
  
  {
    title: 'Trazabilidad',
    icon: { icon: 'tabler-database' },
    children: [
      { title: 'Lista de Usuarios', to: 'apps-trazabilidad-list' },
      { title: 'Visitas', to: 'apps-visitas-list' },
      { title: 'Metadatos', to: 'apps-metadatos' },
      { title: 'Dispositivos', to: 'apps-dispositivos' },
      // modulos por salir 
      //{ title: 'Trazabilidad usuarios', to: 'apps-trazabilidad-users' },
      // { title: 'Trazabilidad usuarios', to: 'apps-notas-recomendadas'}, //apps/notas-recomendadas

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

  //########################
  // módulos no visibles
  //########################

  // {
  //   title: 'Newsletter',
  //   icon: { icon: 'tabler-news' },
  //   to: { name: 'apps-newsletter' }
  // },
  // {
  //   title: 'Colecciones',
  //   icon: { icon: 'tabler-database-cog' },
  //   to: { name: 'coleccion' }
  // },  
  // {
  //   title: 'Backoffice',
  //   icon: { icon: 'tabler-settings-2' },
  //   children: [
  //     { title: 'Usuarios y Roles', to: 'apps-backoffice' },
  //     { title: 'Actividad', to: 'apps-backoffice-actividad' },
  //   ],
  // },
  // {
  //   title: 'Filtros Guardados',
  //  icon: { icon: 'tabler-database-cog' },
  //   to: { name: 'apps-filtros' }
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
  // {
  //   title: 'Utilidades',
  //   icon: { icon: 'tabler-settings-2' },
  //   children: [
  //     { title: 'Herramienta de Apis', to: 'apps-apicustom' },
  //   ],
  // },
]
