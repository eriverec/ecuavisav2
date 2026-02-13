export default [
    // {
    //   title: 'Dashboard',
    //   to: { name: 'index' },
    //   icon: { icon: 'tabler-smart-home' },
    // },
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
  ]
