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
    title: 'Suscripciones',
    icon: { icon: 'tabler-rosette-discount-check' },

    // to: { name: 'apps-concursos' },
    children: [
      { title: 'Usuarios', to: 'apps-suscriptores-usuarios' },
      { title: 'Transacciones', to: 'apps-suscriptores-transacciones' },
      { title: 'Analítica', to: 'apps-suscriptores-analitica' },
    ],
  },

  {
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
    title: 'Radar Digital',
    icon: { icon: 'tabler-radar' },
    children: [
      { title: 'Dashboard', to: 'apps-radar-home' },
      { title: 'Últimas noticias', to: 'apps-radar-ultimas-noticias' },
      { title: 'Ecuavisa', to: 'apps-radar-ecuavisa' },
      { title: 'Primicias', to: 'apps-radar-primicias' },
      { title: 'El Expreso', to: 'apps-radar-el-expreso' },
      { title: 'El Comercio', to: 'apps-radar-el-comercio' },
      { title: 'El Universo', to: 'apps-radar-el-universo' },
      { title: 'TC Televisión', to: 'apps-radar-tc' },
      { title: 'Infobae', to: 'apps-radar-infobae' },
    ],
  },

  {
    title: 'Gestión E-learning',
    icon: { icon: 'tabler-notes' },
    children: [
      { title: 'Cursos', to: 'apps-elearning-gestion-cursos' },
      { title: 'Módulos', to: 'apps-elearning-gestion-modulos' },
      { title: 'Videos', to: 'apps-elearning-gestion-videos' },
      { title: 'Cuestionarios', to: 'apps-cuestionarios' },
      { title: 'Usuarios registrados', to: 'apps-elearning-usuarios-cursos' },
      { title: 'Analítica', to: 'apps-elearning-graficos-estudiantes' },
      
    ],
  },

  {
    title: 'Ecuavisados',
    icon: { icon: 'tabler-bulb' },
    children: [
      { title: 'Fidelización', to: 'apps-reglasYDesafios-gestion-full' },
      { title: 'Analítica', to: 'apps-reglasYDesafios-analitica' },
      { title: 'Ganadores', to: 'apps-reglasYDesafios-gestion-ganadores' },

      
    ],
  },

  // {
  //   title: 'Recompensas',
  //   icon: { icon: 'tabler-award-filled' },
  //   children: [
  //     { title: 'Historial', to: 'apps-reglasYDesafios-recompensas' },
      
  //   ],
  // },

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
