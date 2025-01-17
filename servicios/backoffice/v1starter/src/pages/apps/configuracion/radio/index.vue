<script setup>
import { isEqual } from 'lodash';
import { computed, onMounted, ref } from "vue";
import StatusMonitor from './componentes/StatusWidgetRadio.vue';

const loadingSubMessage = ref('');

const estadoSend = ref(false);
const estado = ref(false);
const estadoRaw = ref({ estado: false, titulo: "", label: "" });
const estadoRawOriginal = ref({ estado: false, titulo: "", label: "" });
const horariosOriginal = ref([]);
const embedRawOriginal = ref({ value: "", estadoHtml: false });
const router = useRouter();
const isLoading = ref(false);
const currentTab = ref("tab-detalles");
const diaSelected = ref("");
const horarios = ref([]);
const horariosRaw = ref([]);
const success = ref(false);

// status widget y loading
const statusMonitor = ref(null);
const isLoadingAction = ref(false);
const loadingMessage = ref('');
const loadingProgress = ref(0);
const showSuccessMessage = ref(false);

const codigo = ref("");
const estadoHtml = ref(false);
const embedRaw = ref({ value: "", estadoHtml: false });

const diasTotales = [
  { title: "Lunes", value: 1 },
  { title: "Martes", value: 2 },
  { title: "Miércoles", value: 3 },
  { title: "Jueves", value: 4 },
  { title: "Viernes", value: 5 },
  { title: "Sábado", value: 6 },
  { title: "Domingo", value: 0 },
];

// cargar la configuración directamente
const loadConfiguracion = async () => {
  try {
    const response = await fetch('https://cdn-ecuavisa.pages.dev/envivo/assets-dynamic/envivo_radio.js');
    const text = await response.text();
    
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');
    const configText = text.substring(startIndex, endIndex + 1);
    const config = JSON.parse(configText);
    
    return config;
  } catch (error) {
    console.error('Error cargando configuración:', error);
    return null;
  }
};

// Funciones para el status widget
const handleProgress = ({ step, progress }) => {
  loadingProgress.value = progress;
  switch(step) {
    case 1:
      loadingMessage.value = 'Guardando actualización...';
      loadingSubMessage.value = '';
      break;
    case 2:
      loadingMessage.value = 'Verificando cambios...';
      loadingSubMessage.value = 'Esto puede tardar varios segundos';
      break;
    case 3:
      loadingMessage.value = 'Finalizando actualización...';
      loadingSubMessage.value = '';
      break;
  }
};

// Computed properties para verificar cambios
const hayCambiosHorarios = computed(() => {
    return !isEqual(horarios.value, horariosOriginal.value);
});

const hayForzadoCambios = computed(() => {
    // Comparación más específica para el player forzado
    return !isEqual(estadoRaw.value.estado, estadoRawOriginal.value.estado) ||
           !isEqual(estadoRaw.value.titulo, estadoRawOriginal.value.titulo) ||
           !isEqual(estadoRaw.value.label, estadoRawOriginal.value.label);
});

const hayEmbedCambios = computed(() => {
    // Comparación específica para el código del reproductor
    return !isEqual(embedRaw.value.value, embedRawOriginal.value.value);
});

const handleSuccess = async (newData) => {
    try {
        if (newData.forzado) {
            estadoRawOriginal.value = JSON.parse(JSON.stringify(newData.forzado));
        }
        
        if (Array.isArray(newData.horarios)) {
            horariosOriginal.value = JSON.parse(JSON.stringify(newData.horarios));
        }
        
        if (newData.html) {
            embedRawOriginal.value = JSON.parse(JSON.stringify(newData.html));
        }



    loadingMessage.value = 'Actualización completada con éxito';
    loadingSubMessage.value = '';
    loadingProgress.value = 100;
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    isLoadingAction.value = false;
  } catch (error) {
        console.error('Error actualizando datos locales:', error);
        handleError(error);
    }
};

const handleTimeout = () => {
  isLoadingAction.value = false;
  success.value = false;
  
  getConfig();
  
  loadingMessage.value = 'La actualización está tomando más tiempo de lo esperado';
  
  console.warn('Timeout en la actualización');
};

const handleError = (error) => {
  isLoadingAction.value = false;
  success.value = false;
  loadingMessage.value = 'Error en la actualización';
  
  console.error('Error en la actualización:', error);
  
  getConfig();
};

async function getConfig() {
  isLoading.value = true;
  try {
    const config = await loadConfiguracion();
    
    if (!config) {
      throw new Error('No se pudo cargar la configuración');
    }

    console.log('Configuración cargada:', config);
    
    estado.value = config.forzado?.estado || false;
    estadoRaw.value = config.forzado || { estado: false, titulo: "", label: "" };
    estadoRawOriginal.value = JSON.parse(JSON.stringify(estadoRaw.value));
    
    horarios.value = Array.isArray(config.horarios) ? [...config.horarios] : [];
    horariosRaw.value = Array.isArray(config.horarios) ? [...config.horarios] : [];
    horariosOriginal.value = JSON.parse(JSON.stringify(horarios.value));
    
    codigo.value = config.html?.value || "";
    estadoHtml.value = config.html?.estadoHtml || false;
    embedRaw.value = config.html || { value: "", estadoHtml: false };
    embedRawOriginal.value = JSON.parse(JSON.stringify(embedRaw.value));

  } catch (error) {
    console.error('Error al obtener configuración:', error);
  }
  isLoading.value = false;
}

// transformar los datos para el envío
const transformDataForNewEndpoint = (data) => {
  return {
    data_string: {
      html: {
        value: data.html.value || "",
        estadoHtml: data.html.estadoHtml || false
      },
      forzado: {
        estado: data.forzado.estado || false,
        titulo: data.forzado.titulo || "",
        label: data.forzado.label || ""
      },
      horarios: data.horarios || []
    }
  };
};

async function enviarNuevoEndpoint(datos) {
  try {
    const transformedData = transformDataForNewEndpoint(datos);
    const response = await fetch('https://servicio-github-dynamic.vercel.app/live-web/radio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(transformedData)
    });

    if (!response.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    return true;
  } catch (error) {
    console.error('Error al enviar datos:', error);
    return false;
  }
}

async function enviar() {
  isLoadingAction.value = true;
  loadingProgress.value = 0;
  loadingMessage.value = 'Iniciando actualización...';
  
  try {
    const configuracion = {
      html: embedRaw.value,
      forzado: estadoRaw.value,
      horarios: horarios.value,
    };
    
    const enviado = await enviarNuevoEndpoint(configuracion);
    
    if (enviado) {
      statusMonitor.value?.startMonitoring();
    } else {
      isLoadingAction.value = false;
    }
  } catch (error) {
    console.error('Error al enviar:', error);
    isLoadingAction.value = false;
  }
}

async function enviarForzado() {
  isLoadingAction.value = true;
  loadingProgress.value = 0;
  loadingMessage.value = 'Iniciando actualización de player forzado...';

  try {
    const configuracion = {
      html: embedRaw.value,
      forzado: estadoRaw.value,
      horarios: horariosRaw.value,
    };
    
    const enviado = await enviarNuevoEndpoint(configuracion);
    
    if (enviado) {
      statusMonitor.value?.startMonitoring();
    } else {
      isLoadingAction.value = false;
    }
  } catch (error) {
    console.error('Error al enviar datos de player:', error);
    isLoadingAction.value = false;
  }
}

async function enviarEmbed() {
  isLoadingAction.value = true;
  loadingProgress.value = 0;
  loadingMessage.value = 'Actualizando código del reproductor...';

  try {
    const configuracion = {
      html: embedRaw.value,
      forzado: estadoRaw.value,
      horarios: horariosRaw.value,
    };
    
    const enviado = await enviarNuevoEndpoint(configuracion);
    
    if (enviado) {
      statusMonitor.value?.startMonitoring();
    } else {
      isLoadingAction.value = false;
    }
  } catch (error) {
    console.error('Error al enviar nuevo código del reproductor:', error);
    isLoadingAction.value = false;
  }
}

const diasDisponibles = computed(() => {
  if (horarios.value && horarios.value.length > 0) {
    const diasHorarios = horarios.value.map((item) => item.dia);
    return diasTotales.filter((item) => !diasHorarios.includes(item.value));
  }
  return diasTotales;
});

function resolveDia(dia) {
  const diaSolved = diasTotales.find((item) => dia === item.value);
  return diaSolved ? diaSolved.title : '';
}

const addDia = () => {
  if (diaSelected.value) {
    let diaNuevo = {
      dia: diaSelected.value,
      estadoDia: true,
      horas: [
        {
          tituloPrograma: "",
          estadoHorario: true,
          inicio: "12:00",
          fin: "14:00",
        },
      ],
    };
    horarios.value.push(diaNuevo);
    diaSelected.value = "";
  }
};

const elimDia = (index) => {
  horarios.value.splice(index, 1);
};

const addHora = (index) => {
  let horaNuevo = {
    tituloPrograma: "",
    estadoHorario: true,
    inicio: "12:00",
    fin: "14:00",
  };
  horarios.value[index].horas.push(horaNuevo);
};

const elimHora = (index, indexHora) => {
  horarios.value[index].horas.splice(indexHora, 1);
};

const authorizedCheck = () => {
  let rol = localStorage.getItem("role");
  if (rol !== "administrador" && rol !== "webmaster") {
    router.push({ path: "/pages/errors/not-authorized" });
  }
};

// Manejo de usuarios en línea
const isNavDrawerOpen = ref(false);
const rol = localStorage.getItem("role");
const usersData = ref([]);

const pusher = () => {
  let a = JSON.parse(localStorage.getItem("userData"));
  let email = a.email;
  const pusher = new Pusher("69f5e107f97ef8dcc25f", {
    cluster: "us2",
    forceTLS: true,
    channelAuthorization: {
      paramsProvider: () => ({ param1: email }),
      endpoint: "https://pusher-auth-mocha.vercel.app/pusher/auth",
    },
  });

  const channel = pusher.subscribe("presence-configuracion");

  channel.bind("pusher:subscription_succeeded", () =>
    channel.members.each((member) => usersData.value.push({ email: member.id }))
  );

  channel.bind("pusher:member_added", (member) => {
    usersData.value.push({ email: member.id });
  });

  channel.bind("pusher:member_removed", (member) => {
    let array = Array.from(usersData.value);
    const index = array.findIndex((u) => u.email === member.id);
    if (index !== -1) {
      usersData.value.splice(index, 1);
    }
  });
};

onMounted(async () => {
  console.log('Componente montado, iniciando carga...');
  try {
    await getConfig();
    console.log('Configuración cargada correctamente');
    pusher();
    authorizedCheck();
  } catch (error) {
    console.error('Error en la inicialización:', error);
  }
});



</script>

<template>
<section>
    <VOverlay
        v-model="isLoadingAction"
        class="align-center justify-center"
        persistent
        >
    <VCard color="primary" width="300">
        <VCardText class="text-center">
        <VProgressCircular
            v-if="loadingProgress < 100"
            indeterminate
            color="white"
            class="mb-4"
        ></VProgressCircular>
        <VIcon
            v-else
            icon="tabler-check"
            color="white"
            size="32"
            class="mb-4"
        ></VIcon>
        
        <div class="text-h6 guarda white--text mb-2">
            {{ loadingMessage }}
        </div>
        
        <div v-if="loadingSubMessage" class="text-body-2 guarda white--text mb-4 text-opacity-70">
            {{ loadingSubMessage }}
        </div>
        
        <VProgressLinear
            v-model="loadingProgress"
            color="white"
            height="8"
            rounded
        ></VProgressLinear>
        </VCardText>
    </VCard>
    </VOverlay>

    <StatusMonitor
        ref="statusMonitor"
        asset-url="https://cdn-ecuavisa.pages.dev/envivo/assets-dynamic/envivo_radio.js"
        :poll-interval="2000"
        :max-attempts="30"
        @progress="handleProgress"
        @success="handleSuccess"
        @timeout="handleTimeout"
        @error="handleError"
    />

    <VBtn v-if="rol== 'administrador'"
        icon
        size="small"
        class="app-custom-toggler rounded-s-lg rounded-0"
        style="z-index: 1001;"
        @click="isNavDrawerOpen = true"
    >
        <VIcon icon="tabler-users" />
    </VBtn>

    <VNavigationDrawer
        v-if="rol== 'administrador'"
        v-model="isNavDrawerOpen"
        temporary
        location="end"
        width="400"
        :scrim="false"
        class="app-customizer"
    >
        <!-- 👉 Header -->
        <div class="custom-heading d-flex align-center justify-space-between">
            <div>
                <h6 class="text-h6 py-4 pl-4">
                    Usuarios activos en configuración
                </h6>
                <span class="text-body-1"></span>
            </div>
            <VBtn
                icon
                variant="text"
                color="secondary"
                size="x-small"
                @click="isNavDrawerOpen = false"
            >
                <VIcon
                    icon="tabler-x"
                    size="20"
                />
            </VBtn>
        </div>

        <VDivider />
        <div style="padding: 1rem;">
            <PerfectScrollbar
                tag="ul"
                :options="{ wheelPropagation: false }"
            >
                <VList
                    lines="two"
                    border
                >
                    <template
                        v-for="(user, index) of usersData"
                        :key="user.email"
                    >
                        <VListItem>
                            <VListItemTitle>
                                {{ user.email }}
                            </VListItemTitle>
                            <VListItemSubtitle class="mt-1">
                                <VBadge
                                    dot
                                    location="start center"
                                    offset-x="2"
                                    color="success"
                                    class="me-3"
                                >
                                    <span class="ms-4">Online</span>
                                </VBadge>     
                            </VListItemSubtitle>       
                        </VListItem>
                        <VDivider v-if="index !== usersData.length - 1" />
                    </template>
                </VList>
            </PerfectScrollbar>
        </div>
    </VNavigationDrawer> 

    <VTabs v-model="currentTab" class="v-tabs-pill">
        <VTab value="tab-config">Configuración de Horarios</VTab>
        <VTab value="tab-forzado">Player Forzado</VTab>
        <VTab value="tab-embed">Código del reproductor</VTab>
    </VTabs>

    <VWindow v-model="currentTab">
        <VWindowItem value="tab-config">
            <VCard class="mt-5" title="Configuración de los horarios">	
                <VCardText v-if="isLoading">
                    Cargando configuración...
                </VCardText>      
                <VCardText class="py-4 gap-0 w-100" v-else>	
                    <VRow> 
                        <VCol cols="12" style="display: flex; flex-wrap: wrap; align-items: center;">
                            <VCol cols="4">
                                <VSelect 
                                    v-model="diaSelected" 
                                    :items="diasDisponibles" 
                                    :disabled="diasDisponibles.length===0" 
                                    label="Día de la semana" 
                                />
                            </VCol>    
                            <VCol cols="6" class="d-flex gap-4">
                                <VBtn
                                    color="primary"
                                    @click="addDia()"
                                    :disabled="diasDisponibles.length===0 || !diaSelected"
                                >
                                    Añadir día
                                </VBtn>
                            </VCol>  
                        </VCol>

                        <VCol cols="12">
                            <VList class="card-list">
                                <VExpansionPanels variant="accordion" multiple>
                                    <VExpansionPanel
                                        v-for="horario,index in horarios"
                                        :key="index"                        
                                    >
                                        <VExpansionPanelTitle class="d-flex flex-wrap justify-space-between gap-4">
                                            <h3>{{ resolveDia(horario.dia) }}</h3>
                                            <VChip 
                                                :color="horario.estadoDia ? 'success' : 'warning'" 
                                                class="mr-4"
                                            >
                                                {{ horario.estadoDia ? 'Activo' : 'Inactivo' }}
                                            </VChip>
                                            <VSwitch
                                                v-model="horario.estadoDia"
                                                color="success"
                                                :label="horario.estadoDia ? 'Día activo' : 'Día inactivo'"
                                            />
                                        </VExpansionPanelTitle>
                                        <VExpansionPanelText class="d-flex flex-wrap justify-space-between">
                                            <div style="padding: 1rem; border:1px solid rgba(var(--v-theme-on-background), var(--v-disabled-opacity));border-radius: 7px;">
                                                <VTable class="w-full">
                                                    <thead>
                                                        <tr>
                                                            <th scope="col" class="d-flex gap-4 pb-4">
                                                                <VBtn
                                                                    color="primary"
                                                                    @click="addHora(index)"                                              
                                                                >
                                                                    Añadir hora
                                                                </VBtn>
                                                                                                                                                                                                        
                                                                <VBtn     
                                                                    style="margin-left: 0.5rem;"                                          
                                                                    color="error"
                                                                    @click="elimDia(index)"                                              
                                                                >
                                                                    Eliminar día
                                                                </VBtn>
                                                            </th> 
                                                        </tr>
                                                        <tr>
                                                            <th scope="col" style="width: 300px;">Título</th>    
                                                            <th scope="col" style="width: 170px;">Hora de inicio</th>
                                                            <th scope="col" style="width: 170px;">Hora de fin</th>
                                                            <th scope="col" class="d-flex gap-4 pb-4"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="hora,indexHora in horario.horas.sort((b, a) => b.inicio.localeCompare(a.inicio))" :key="indexHora">      
                                                            <td class="py-4">
                                                                <VTextField
                                                                    v-model="hora.tituloPrograma"
                                                                    label="Título del horario"
                                                                    placeholder="Escriba el título..."
                                                                    class="ms-0 me-1 chat-list-search"
                                                                />
                                                            </td>   
                                                            <td class="py-4">
                                                                <AppDateTimePicker
                                                                    v-model="hora.inicio"
                                                                    label="Hora Inicio"
                                                                    :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"
                                                                />
                                                            </td>
                                                            <td class="py-4">
                                                                <AppDateTimePicker
                                                                    v-model="hora.fin"
                                                                    label="Hora Fin"                                              
                                                                    :config="{ enableTime: true, noCalendar: true, dateFormat: 'H:i' }"
                                                                />
                                                            </td>
                                                            <td class="py-4">
                                                                <div class="d-flex gap-4 py-4">
                                                                    <VSwitch
                                                                        v-model="hora.estadoHorario"
                                                                        color="success"
                                                                        :label="hora.estadoHorario ? 'Horario activo' : 'Horario inactivo'"
                                                                    />
                                                                    <VBtn 
                                                                        v-if="horario.horas.length>1" 
                                                                        color="error" 
                                                                        @click="elimHora(index,indexHora)"
                                                                    >
                                                                        <VIcon icon="tabler-trash"></VIcon>
                                                                    </VBtn>  
                                                                </div>        
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </VTable>
                                            </div>
                                        </VExpansionPanelText>
                                    </VExpansionPanel>
                                </VExpansionPanels>
                            </VList>
                        </VCol>
                    </VRow>
                </VCardText>
            </VCard>
        </VWindowItem>

        <VWindowItem value="tab-forzado">
            <VCard class="mt-5" title="Player Forzado" subtitle="Para transmisiones emergentes, este módulo permitirá activar el reproductor de forma forzada">
                <VCardText class="py-4 gap-0 w-100">	
                    <VRow> 
                        <VCol cols="8">
                            <div style="width: 650px; margin-top: 1rem; margin-bottom: 1rem;" class="d-flex flex-row gap-3">
                                <VTextField
                                    v-model="estadoRaw.titulo"
                                    label="Título sobre el player"
                                    placeholder="Escriba el título que mostrará sobre el reproductor..."
                                    class="ms-0 me-1 chat-list-search"
                                />
                                <VTooltip location="top">
                                    <template #activator="{ props }">
                                        <VIcon v-bind="props" size="30" icon="tabler-alert-circle" />
                                    </template>
                                    <span>Este titular aparecerá en lugar del título del programa sobre el reproductor</span>
                                </VTooltip>
                            </div>
                            <div style="width: 650px; margin-top: 1rem; margin-bottom: 1rem;" class="d-flex flex-row gap-3">
                                <VTextField
                                    v-model="estadoRaw.label"
                                    label="Texto del Indicador"
                                    placeholder="Escriba el texto que deseas en el indicador parpadeante..."
                                    class="ms-0 me-1 chat-list-search"
                                />
                                <VTooltip location="top">
                                    <template #activator="{ props }">
                                        <VIcon v-bind="props" size="30" icon="tabler-alert-circle" />
                                    </template>
                                    <span>Este texto es el que aparece en el indicador que parpadea sobre el header</span>
                                </VTooltip>
                            </div>
                        </VCol>

                        <VCol cols="4" style="display: flex; flex-wrap: wrap; align-items: center;">
                            <div style="display: flex; margin: 1rem;">
                                <div>
                                    <VSwitch
                                        v-model="estadoRaw.estado"
                                        color="success"
                                        :label="estadoRaw.estado ? 'Activo' : 'Inactivo'"
                                    />
                                </div>
                                <div style="margin-left: 2rem;">
                                  <div class="d-inline-block">
                                  <VBtn 
                                      color="primary" 
                                      @click="enviarForzado"
                                      :disabled="!hayForzadoCambios"
                                  >
                                      ENVIAR
                                  </VBtn>
                                  <VTooltip 
                                      activator="parent"
                                      location="top"
                                      :open-on-hover="!hayForzadoCambios"
                                  >
                                      No hay cambios que guardar
                                  </VTooltip>
                              </div>
</div>
                   </div>
                        </VCol>

                        <VCol cols="12" style="display: flex; align-items: center;">
                            <div>
                                <span>Estado del player: </span>
                            </div>
                            <div style="margin-left: 2rem;">
                                <VChip :color="estadoRaw.estado ? 'success' : 'warning'" class="mr-4">
                                    {{ estadoRaw.estado ? 'Activo' : 'Inactivo' }}
                                </VChip>
                            </div>    
                        </VCol>
                    </VRow>
                </VCardText>
            </VCard>
        </VWindowItem>

        <VWindowItem value="tab-embed">
            <VCard class="mt-5" title="Embed player" subtitle="Proporciona el código HTML del reproductor que presentará embebido en la seccion de audio">	
                <VCardText class="py-4 gap-0 w-100">	
                    <VRow> 
                      <VCol cols="12" style="display: flex; flex-wrap: wrap; align-items: center;">
    <div style="width: 100%; margin-top: 1rem; margin-bottom: 1rem;" class="d-flex flex-row gap-2">
        <VTextarea
            v-model="embedRaw.value"
            label="Código"
            placeholder="Escriba el código html del reproductor..."
            class="ms-0 me-1 chat-list-search"
            auto-grow
        />
    </div>
    <div class="d-inline-block">
    <VBtn 
        color="primary" 
        class="text-uppercase"
        @click="enviarEmbed"
        :disabled="!hayEmbedCambios"
    >
        ENVIAR
    </VBtn>
    <VTooltip 
        activator="parent"
        location="top"
        :open-on-hover="!hayEmbedCambios"
    >
        No hay cambios que guardar
    </VTooltip>
</div>
</VCol>
                    </VRow>
                </VCardText>
            </VCard>
        </VWindowItem>
    </VWindow>
   
    <div class="d-inline-block boton-fija" v-if="currentTab === 'tab-config'">
        <VBtn
            rounded="pill"
            color="success"
            @click="enviar"
            :disabled="!hayCambiosHorarios"
        >
            <VIcon size="30" icon="tabler-device-floppy"></VIcon>
        </VBtn>
        <VTooltip 
            activator="parent"
            location="top"
            :open-on-hover="!hayCambiosHorarios"
        >
            No hay cambios que guardar
        </VTooltip>
    </div>

</section>
</template>

<style>.boton-fija {
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 30px;
  z-index: 9999;
}

.app-custom {
  .customizer-section {
    padding: 1.25rem;
  }

  .custom-heading {
    padding-block: 0.875rem;
    padding-inline: 1.25rem;
  }

  .v-navigation-drawer__content {
    display: flex;
    flex-direction: column;
  }
}

.app-custom-toggler {
  position: fixed !important;
  inset-block-start: 60%;
  inset-inline-end: 0;
  transform: translateY(-50%);

  &:active {
    transform: translateY(-50%) !important;
  }
}

.guarda {
  color: #ffffff;
}


.v-tooltip > .v-overlay__content {
    background: rgba(0, 0, 0, 0.8) !important;
    color: white !important;
    padding: 5px 8px !important;
    border-radius: 4px !important;
    font-size: 12px !important;
}

.v-tooltip {
    z-index: 10000 !important;
}

.v-expansion-panel {
    box-shadow: none !important;
    /* border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity)) !important; */
}


</style>