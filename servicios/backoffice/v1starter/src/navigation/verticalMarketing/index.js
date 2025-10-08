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
      },
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
      },
      { title: 'Netlife Gaming', to: 'apps-concursos-gamer' },
      { title: 'Wow', to: 'apps-concursos-wow' },

      // { title: 'Ecuavisa', to: 'apps-concursos-ecuavisa' },

    ],
  },{
    title: 'Radar Digital',
    icon: { icon: 'tabler-radar' },
    children: [
      { title: 'Dashboard TV', to: 'apps-radar-digital-home-tv' },
      { title: 'Últimas noticias', to: 'apps-radar-digital' },
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
]
  
  