export default [
    {
      title: 'Dashboard',
      to: { name: 'index' },
      icon: { icon: 'tabler-smart-home' },
    },
    {
      title: 'Últimas noticias', 
      to: 'apps-radar-ultimas-noticias',
      icon: { icon: 'tabler-radar' },
    },
    {
      title: 'Suscripciones',
      icon: { icon: 'tabler-rosette-discount-check' },
      children: [
        { title: 'Usuarios', to: 'apps-suscriptores-usuarios' },
        { title: 'Transacciones', to: 'apps-suscriptores-transacciones' },
        { title: 'Analítica', to: 'apps-suscriptores-analitica' },
      ],
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
      //{ title: 'Permanencia', to: 'apps-trazabilidad-permanencia' },
      // { title: 'Metadatos', to: 'apps-metadatos' },
      // { title: 'Dispositivos', to: 'apps-dispositivos' },
       { title: 'Recomendaciones', to: 'apps-recomendaciones' },

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
  