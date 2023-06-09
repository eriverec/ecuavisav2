export default [
    {
      title: 'Dashboard',
      to: { name: 'index' },
      icon: { icon: 'tabler-smart-home' },
    },
    
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
        // { title: 'Visitas', to: 'apps-visitas' }
      ],
    },
  
  ]
  