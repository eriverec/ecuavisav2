export default [{
  title: 'Concursos',
  icon: { icon: 'tabler-balloon' },

    // to: { name: 'apps-concursos' },
    children: [
      { title: 'Desafío a la Fama', to: 'apps-votos-detalle' },
      { title: 'Click click boom', to: 'apps-concursos' },
      { title: 'Gavilanes', to: 'apps-concursos-gavilanes' },
      {
        title: 'Hija del embajador',
        to: null,
        children: [
          {
            title: 'Usuarios registrados',
            to: 'apps-concursos-hija-embajador',
          },
          {
            title: 'Analítica',
            to: 'apps-concursos-hija-embajador-metricas',
          },
        ],
      }
      // { title: 'Ecuavisa', to: 'apps-concursos-ecuavisa' },

    ],
  },
  {
    title: 'Radar informativo',
    icon: { icon: 'tabler-radar' },
    children: [
      { title: 'Últimas noticias', to: 'apps-radar-ultimas-noticias' },
      { title: 'Ecuavisa', to: 'apps-radar-ecuavisa' },
      { title: 'Primicias', to: 'apps-radar-primicias' },
      { title: 'El Expreso', to: 'apps-radar-el-expreso' },
      { title: 'El Comercio', to: 'apps-radar-el-comercio' },
      { title: 'El Universo', to: 'apps-radar-el-universo' },
    ],
  },
]
  
  