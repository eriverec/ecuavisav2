export default [
    {
      title: 'Dashboard',
      to: { name: 'index' },
      icon: { icon: 'tabler-smart-home' },
    },
    {
      title: 'NewsLetter',
      to: { name: 'apps-mailing-tabs-edit' },
      icon: { icon: 'tabler-mail' },
    },
  
  {
    title: 'Trazabilidad',
    icon: { icon: 'tabler-database' },
    children: [
      // { title: 'Lista de Usuarios', to: 'apps-trazabilidad-list' },
      // { title: 'Visitas', to: 'apps-visitas-list' },
      { title: 'Permanencia', to: 'apps-trazabilidad-permanencia' },
      // { title: 'Metadatos', to: 'apps-metadatos' },
      // { title: 'Dispositivos', to: 'apps-dispositivos' },
      // { title: 'Recomendaciones', to: 'apps-recomendaciones' },

      // modulos por salir
      //{ title: 'Trazabilidad usuarios', to: 'apps-trazabilidad-users' },
      //{ title: 'Trazabilidad usuarios', to: 'apps-trazabilidad-ubicaciones' },
      // { title: 'Trazabilidad usuarios', to: 'apps-notas-recomendadas'}, //apps/notas-recomendadas

    ],
  },    
    // {
    //   title: 'Concursos',
    //   icon: { icon: 'tabler-balloon' },
    //   // to: { name: 'apps-concursos' },
    //   children: [
    //     { title: 'Click click boom', to: 'apps-concursos' },
    //     { title: 'Gavilanes', to: 'apps-concursos-gavilanes' },
    //   ],
    // },
    
  
  ]
  