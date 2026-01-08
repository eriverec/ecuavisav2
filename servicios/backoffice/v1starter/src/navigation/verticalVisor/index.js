export default [
    {
      title: 'Dashboard',
      to: { name: 'index' },
      icon: { icon: 'tabler-smart-home' },
    },
    {
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
    {
      title: 'Suscripciones',
      icon: { icon: 'tabler-rosette-discount-check' },
      children: [
        { title: 'Usuarios', to: 'apps-suscriptores-usuarios' },
        { title: 'Transacciones', to: 'apps-suscriptores-transacciones' },
        { title: 'Analítica', to: 'apps-suscriptores-analitica' },
      ],
    },
    // {
    //   title: 'NewsLetter',
    //   to: { name: 'apps-mailing-tabs-edit' },
    //   icon: { icon: 'tabler-mail' },
    // },

    {
      title: 'Newsletter',
      icon: { icon: 'tabler-mail' },
      children: [
        { title: 'Editar Newsletter', to: 'apps-mailing-tabs-edit' },
        { title: 'Alertas de newsletters', to: 'apps-mailing-list-logs' },
        { title: 'Asignación de notas', to: 'apps-tools-newsletter' },
        { title: 'Generador de códigos', to: 'apps-code-generator' },
      ],
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
    {
      title: 'Concursos',
      icon: { icon: 'tabler-balloon' },
      // to: { name: 'apps-concursos' },
      children: [
        // { title: 'Click click boom', to: 'apps-concursos' },
        // { title: 'Gavilanes', to: 'apps-concursos-gavilanes' },
        { title: 'Netlife Gaming', to: 'apps-concursos-gamer' },
      ],
    },
    
  
  ]
  