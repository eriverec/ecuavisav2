if (ECUAVISA_EC.login()) {
    console.info("LiveRadio - Si estas logueado - v3");

    const eventLun_Vie = [
        { inicio: "05:55:00", fin: "06:55:00", titulo: "Televistazo en la comunidad" },
        { inicio: "06:55:00", fin: "07:30:00", titulo: "Contacto Directo" },
        {inicio: "07:30:00",fin: "09:00:00",titulo: "Televistazo en la comunidad",},
        // { inicio: "10:30:00", fin: "13:00:00", titulo: "En Contacto" },
        { inicio: "13:00:00", fin: "15:00:00", titulo: "Televistazo 13h00" },
        // { inicio: "14:00:00", fin: "15:30:00", titulo: "Los hackers de la farándula" },//hachers
        { inicio: "19:00:00", fin: "20:30:00", titulo: "Televistazo 19h00" },
      ];
    
      const eventSab = [
        { inicio: "19:00:00", fin: "19:30:00", titulo: "Televistazo 19h00" },
      ];
    
      const eventDom = [
        { inicio: "10:30:00", fin: "11:30:00", titulo: "Políticamente Correcto" },
        { inicio: "16:00:00", fin: "20:00:00", titulo: "Televistazo 19h00" },
      ];

    function mostrarProgramacion() {
        const ahora = new Date();
        const dia = ahora.getDay();
        const hora = ahora.getHours().toString().padStart(2, "0") + ":" + ahora.getMinutes().toString().padStart(2, "0") + ":" + ahora.getSeconds().toString().padStart(2, "0");

        let programacion = [];
        let enProg = false;

        // Elegir programación según día de la semana
        if (dia === 0) {
            programacion = eventDom;
        } else if (dia === 6) {
            programacion = eventSab;
        } else {
            programacion = eventLun_Vie;
        }

        // Verificar si estamos dentro del horario de programación
        for (let i = 0; i < programacion.length; i++) {
            const programa = programacion[i];
            if (hora >= programa.inicio && hora <= programa.fin) {
                enProg = true;
                tituloPrograma = programa.titulo;
            }
        }

        // Mostrar u ocultar elementos según corresponda
        const selectDivRad = document.getElementById("parent_radio");
        if (selectDivRad) {
            if (enProg) {
                selectDivRad.setAttribute('style','display: block');
            } else {
                selectDivRad.setAttribute('style','display: none');
            }
        }

        // Llamar a la función de nuevo cada medio minuto
        setTimeout(mostrarProgramacion, 2000);
    }

    var btest=navigator.userAgent.toLowerCase();
    
    if ( /(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/i.test(btest) ) {
      // Iniciar el ciclo de verificación
      mostrarProgramacion();

    } else if( /(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds|archos|skyfire|puffin|blazer|bolt|gobrowser|iris|maemo|semc|teashark|uzard)/i.test(btest) ) {
      // Iniciar el ciclo de verificación
      mostrarProgramacion();
  
    } else {
      // Iniciar el ciclo de verificación
      mostrarProgramacion();  
    }


} else {
    console.warn("LiveRadio - no estas logueado");
}
