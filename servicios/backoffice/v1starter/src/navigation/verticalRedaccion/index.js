export default [
    
    {
    title: 'Newsletter',
    icon: { icon: 'tabler-mail' },
    children: [
      { title: 'Editar Newsletter', to: 'apps-mailing-tabs-edit' },
      { title: 'Forzar Newsletter', to: 'apps-mailing-forzado' }

      // { title: 'Ads Ubicaciones', to: 'apps-miecuavisa-ads-ubicaciones' },
      // { title: 'Eventos', to: 'apps-configuracion-add' },
      //{ title: 'Player Forzado', to: 'apps-configuracion-player' }
    ]
  },
  {
    title: 'Concursos',
    icon: { icon: 'tabler-balloon' },
    // to: { name: 'apps-concursos' },
    children: [
      // { title: 'Desafío a la Fama', to: 'apps-votos-detalle' },
      // { title: 'Click click boom', to: 'apps-concursos' },
      // { title: 'Gavilanes', to: 'apps-concursos-gavilanes' },
      // {
      //   title: 'Hija del embajador',
      //   to: null,
      //   children: [
      //     {
      //       title: 'Usuarios registrados',
      //       to: 'apps-concursos-hija-embajador',
      //     },
      //     {
      //       title: 'Analítica',
      //       to: 'apps-concursos-hija-embajador-metricas',
      //     },
      //   ],
      // },
      {
        title: 'Intercolegial Viva La Paz',
        to: null,
        children: [
          {
            title: 'Registrados',
            to: 'apps-concursos-colegio',
          },
          {
            title: 'Analítica',
            to: 'apps-concursos-colegio-metricas',
          }
        ],
      }
      // { title: 'Ecuavisa', to: 'apps-concursos-ecuavisa' },

    ],
  },
  {
    title: 'Radar Digital',
    icon: { icon: 'tabler-radar' },
    children: [
      { title: 'Dashboard', to: 'apps-radar-buscar-home' },
      { title: 'Últimas noticias', to: 'apps-radar-buscar-ultimas-noticias' },
      { title: 'Histórico', to: 'apps-radar-buscar-historico' },
      { title: 'Configuración', to: 'apps-radar-buscar-pro' },
      // { title: 'Dashboard', to: 'apps-radar-home' },
      // { title: 'Últimas noticias', to: 'apps-radar-ultimas-noticias' },
      // { title: 'Ecuavisa', to: 'apps-radar-ecuavisa' },
      // { title: 'Primicias', to: 'apps-radar-primicias' },
      // { title: 'El Expreso', to: 'apps-radar-el-expreso' },
      // { title: 'El Comercio', to: 'apps-radar-el-comercio' },
      // { title: 'El Universo', to: 'apps-radar-el-universo' },
      // { title: 'TC Televisión', to: 'apps-radar-tc' },
      // { title: 'Infobae', to: 'apps-radar-infobae' },
      // { title: 'Teleamazonas', to: 'apps-radar-teleamazonas' },
    ],
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
  
  ]
  
  