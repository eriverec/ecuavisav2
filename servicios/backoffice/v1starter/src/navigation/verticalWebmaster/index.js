export default [
    {
      title: 'Dashboard',
      to: { name: 'index' },
      icon: { icon: 'tabler-smart-home' },
    },
    // {
    //   title: 'Usuarios',
    //   to: { name: 'usersList' },
    //   icon: { icon: 'tabler-user' },
    // },
    {
      title: 'Usuarios',
      icon: { icon: 'tabler-user' },
      children: [
        { title: 'Lista', to: 'apps-user-list' },
        // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
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
  
   // {
    //   title: 'Trazabilidad',
    //   icon: { icon: 'tabler-database' },
    //   to: { name: 'apps-trazabilidad-list' },
    //   // children: [
    //   //   { title: 'Lista', to: 'apps-trazabilidad-list' },
    //   //   // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
    //   // ],
    // },
  
    {
      title: 'Concursos',
      icon: { icon: 'tabler-balloon' },
      // to: { name: 'apps-concursos' },
      children: [
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
      //   // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
      ],
    },
    
    {
      title: 'Trazabilidad',
      icon: { icon: 'tabler-database' },
      // to: { name: 'apps-trazabilidad-list' },
      children: [
        // { title: 'Lista de Usuarios', to: 'apps-trazabilidad-list' },
        // { title: 'View', to: { name: 'apps-user-view-id', params: { id: 21 } } },
        // modulos por salir 
        // { title: 'Dispositivos', to: 'apps-dispositivos' },
        // { title: 'Visitas', to: 'apps-visitas' }
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
  
    // {
    //   title: 'Newsletter',
    //   icon: { icon: 'tabler-news' },
    //   to: { name: 'apps-newsletter' }
    // },
  
    // {
    //   title: 'Colecciones',
    //   icon: { icon: 'tabler-database-cog' },
    //   to: { name: 'coleccion' }
    // }
  
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
    // modulo por salir filtros
  //   {
  //     title: 'Filtros',
  //    icon: { icon: 'tabler-database-cog' },
  //     to: { name: 'apps-filtros' }
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
  ]
  