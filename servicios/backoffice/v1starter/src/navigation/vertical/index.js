
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
    title: 'Suscripciones',
    icon: { icon: 'tabler-rosette-discount-check' },

    // to: { name: 'apps-concursos' },
    children: [
      { title: 'Usuarios', to: 'apps-suscriptores-usuarios' },
      { title: 'Transacciones', to: 'apps-suscriptores-transacciones' },
      { title: 'Analítica', to: 'apps-suscriptores-analitica' },
      { title: 'Reembolsos', to: 'apps-suscriptores-reembolsos' },
      { title: 'Players', to: 'apps-configuracion-suscripciones-player' },
      { title: 'Players Internacional', to: 'apps-configuracion-suscripciones-player-internacional' }, 
      { title: 'Características', to: 'apps-caracteristicas' },
      { title: 'Paquetes', to: 'apps-paquetes' },
      { title: 'Gestión de conexiones', to: 'apps-suscriptores-userdevice' },
      { title: 'Límite de dispositivos', to: 'apps-suscriptores-dispositivos' },
      { title: 'Previa Players', to: 'apps-suscriptores-time-player' },
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
    title: 'Trazabilidad',
    icon: { icon: 'tabler-database' },
    children: [
      // { title: 'Lista de Usuarios', to: 'apps-trazabilidad-list' },
      { title: 'Visitas', to: 'apps-visitas-list' },
      { title: 'Permanencia', to: 'apps-trazabilidad-permanencia' },
      { title: 'Metadatos', to: 'apps-metadatos' },
      // { title: 'Dispositivos', to: 'apps-dispositivos' },
      { title: 'Recomendaciones', to: 'apps-recomendaciones' },

      // modulos por salir
      //{ title: 'Trazabilidad usuarios', to: 'apps-trazabilidad-users' },
      //{ title: 'Trazabilidad usuarios', to: 'apps-trazabilidad-ubicaciones' },
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
      // { title: 'Modal Ondemand', to: 'apps-miecuavisa-ondemand' },

      // { title: 'Ads Ubicaciones', to: 'apps-miecuavisa-ads-ubicaciones' },
      // { title: 'Eventos', to: 'apps-configuracion-add' },
      //{ title: 'Player Forzado', to: 'apps-configuracion-player' }
    ],
  },

  {
    title: 'Newsletter',
    icon: { icon: 'tabler-mail' },
    children: [
      { title: 'Editar Newsletter', to: 'apps-mailing-tabs-edit' },
      { title: 'Forzar Newsletter', to: 'apps-mailing-forzado' },
      // { title: 'Churnrate', to: 'apps-mailing-churnrate' }

      // { title: 'Ads Ubicaciones', to: 'apps-miecuavisa-ads-ubicaciones' },
      // { title: 'Eventos', to: 'apps-configuracion-add' },
      //{ title: 'Player Forzado', to: 'apps-configuracion-player' }
    ],
  },

  {
    title: 'Campañas / Ads',
    icon: { icon: 'tabler-ad' },
    children: [
      { title: 'Lista de campañas', to: 'apps-campaigns-list' },
      { title: 'Crear campaña', to: 'apps-campaigns-create' },
      { title: 'Posiciones', to: 'apps-campaigns-ads-ubicaciones' },
      { title: 'Analítica General', to: 'apps-campaigns-audit' },
      
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
