<script setup>
import { avatarText } from '@core/utils/formatters'
import { parseISO } from 'date-fns'
import { extendMoment } from 'moment-range'
import Moment from 'moment-timezone'
import esLocale from "moment/locale/es"
import { onMounted, ref, watch, computed } from 'vue'

const moment = extendMoment(Moment)
moment.locale('es', [esLocale])
moment.tz.setDefault('America/Guayaquil')

// Referencias reactivas
const totalRegistros = ref(0)
const dataUsuarios = ref([])
const currentPage = ref(1)
const totalPage = ref(0)
const rowPerPage = ref(10)
const semanasItems = ref([])
const desafiosItems = ref([])
const modelCurso = ref(null)
const cursoModelLoading = ref(true)
const videosModel = ref(null)
const loadingUsuarios = ref(false)
const isFullLoading = ref(false)
const configSnackbar = ref({
  message: "Datos guardados",
  type: "success",
  model: false
})

const tipoModel = ref("Escoge una semana")
const selectRefModulo = ref(null)

// Función para obtener las semanas
async function obtenerSemanas() {
    const url = 'https://servicio-desafios.vercel.app/semana/all/get';
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
        const datos = await respuesta.json();
        if (datos && datos.resp && Array.isArray(datos.data)) {
            return datos.data.map(item => ({
                title: item.titulo,
                value: item._id,
                desafios: item.desafios
            }));
        } else {
            throw new Error('La estructura de datos no es la esperada');
        }
    } catch (error) {
        console.error('Error al obtener las semanas:', error);
        return [];
    }
}
// Agregar esta nueva función en la sección de <script setup>
async function exportarTodosRegistros() {
  isFullLoading.value = true;
  try {
    const fechaInicio = moment().subtract(1, 'year').format('YYYY-MM-DD'); // Un año atrás
    const fechaFin = moment().format('YYYY-MM-DD'); // Hoy
    
    var page = 1;
    var limit = 500;
    var usuarios = [];
    while(true){
      const url = `https://servicio-niveles-puntuacion.vercel.app/grafico-backoffice/usuarios-suscritos/?page=${page}&fechai=${fechaInicio}&fechaf=${fechaFin}&limit=${limit}`;
    
      const response = await fetch(url);
      const data = await response.json();

      const batchQuery = data.data;
      if (batchQuery.length === 0) {
          break;
      }
      usuarios.push(...batchQuery);
      page += 1;
    }
    
    
    if (usuarios && Array.isArray(usuarios)) {
      const headUser = ["_id","wylexId", "site", "site_id", "email", "first_name", "last_name","avatar","created_at","logged_at","logged_at_site","updated_at","validated_at","banned_at","country","phone_prefix","phone_number","gender","birth_date","identification_type","identification_number","newsletter_opt_in","provider","platform","created_in_os","created_at_suscriber_course","ciudad","telefono","birthDate","fecha_suscripcion_ecuavisados"];

      const csvContent = [
        headUser,
        ...usuarios.map(user => {
          var users = []
          for(var i in headUser){
            if("fecha_suscripcion_ecuavisados" == headUser[i]){
              users.push(moment(user.subscribed).format("YYYY-MM-DD HH:mm:ss"));
            }else{
              users.push(user.userId[headUser[i]]);
            }
            

            
          }

          return users;
        })
      ].map(e => e.join(",")).join("\n");

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `todos_usuarios_registrados_${moment().format("YYYYMMDD_HHmmss")}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      configSnackbar.value = {
        message: "Exportación de todos los registros completada con éxito.",
        type: "success",
        model: true
      };
    } else {
      throw new Error("Datos no válidos recibidos del servidor");
    }
  } catch (error) {
    console.error('Error al exportar todos los registros:', error);
    configSnackbar.value = {
      message: "Error al exportar todos los registros. Por favor, intente de nuevo.",
      type: "error",
      model: true
    };
  } finally {
    isFullLoading.value = false;
  }
}
// Función para obtener los desafíos
async function obtenerDesafios(ids) {
    const url = 'https://servicio-desafios.vercel.app/desafios/search/ids';
    try {
        const respuesta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ids }),
        });
        if (!respuesta.ok) throw new Error(`HTTP error! status: ${respuesta.status}`);
        const datos = await respuesta.json();
        if (datos && datos.resp && Array.isArray(datos.data)) {
            return datos.data.map(item => ({
                title: item.tituloDesafio,
                value: item._id
            }));
        } else {
            throw new Error('La estructura de datos no es la esperada');
        }
    } catch (error) {
        console.error('Error al obtener los desafíos:', error);
        return [];
    }
}

// Función para obtener usuarios
async function getUsuarios(page = 1, limit = 10, idSemana, idDesafio = null) {
  try {
    if (!idSemana) {
      return false;
    }

    loadingUsuarios.value = true;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    let url = `https://servicio-niveles-puntuacion.vercel.app/grafico-backoffice/usuarios-x-desafio-listado/${idSemana}/${idDesafio || 'null'}?page=${page}&limit=${limit}`;

    var response = await fetch(url, requestOptions);
    const data = await response.json();

    if (data.resp) {
      dataUsuarios.value = data.data.map(item => ({
        ...item.userId,
        subscribed: item.subscribed
      }));
      totalRegistros.value = data.total;
      totalPage.value = Math.ceil(data.total / data.limit);
    }
    loadingUsuarios.value = false;
  } catch (error) {
    configSnackbar.value = {
      message: "No se pudo recuperar los usuarios, recargue de nuevo.",
      type: "error",
      model: true
    };
    loadingUsuarios.value = false;
    console.error(error.message);
  }
}

// Watchers
watch(currentPage, () => {
  if (currentPage.value > totalPage.value) {
    currentPage.value = totalPage.value
  }
  getUsuarios(currentPage.value, rowPerPage.value, modelCurso.value, videosModel.value)
})

watch(rowPerPage, () => {
  currentPage.value = 1
  getUsuarios(currentPage.value, rowPerPage.value, modelCurso.value, videosModel.value)
})

// Modificar el watcher de modelCurso
watch(modelCurso, async (newValue) => {
  if (newValue) {
    currentPage.value = 1
    const semanaSeleccionada = semanasItems.value.find(semana => semana.value === newValue)
    if (semanaSeleccionada && semanaSeleccionada.desafios) {
      const desafiosObtenidos = await obtenerDesafios(semanaSeleccionada.desafios)
      desafiosItems.value = [
        // { title: "Todos", value: null },
        ...desafiosObtenidos
      ]
    }
    videosModel.value = null // Resetear la selección de desafío
    await getUsuarios(currentPage.value, rowPerPage.value, newValue)
  } else {
    desafiosItems.value = []
    dataUsuarios.value = []
    videosModel.value = null
  }
})

watch(videosModel, async (newValue) => {
  if (newValue && modelCurso.value) {
    currentPage.value = 1
    await getUsuarios(currentPage.value, rowPerPage.value, modelCurso.value, newValue)
  }
})

// Computed properties
const paginationData = computed(() => {
  const firstIndex = dataUsuarios.value.length ? (currentPage.value - 1) * rowPerPage.value + 1 : 0
  return `Mostrando ${firstIndex} a ${Math.min(firstIndex + rowPerPage.value - 1, totalRegistros.value)} de ${totalRegistros.value} registros`
})

// Lifecycle hooks
onMounted(async () => {
  cursoModelLoading.value = true
  semanasItems.value = await obtenerSemanas();
  setTimeout(function(){
    modelCurso.value = semanasItems.value[0].value;
  }, 700);
  cursoModelLoading.value = false
})

// Función para exportar datos
async function exportarDatos() {
  if (!modelCurso.value) {
    configSnackbar.value = {
      message: "Seleccione una semana antes de exportar.",
      type: "error",
      model: true
    }
    return
  }

  isFullLoading.value = true
  const allData = []
  let page = 1
  const limit = 100 // Aumentamos el límite para reducir el número de peticiones

  try {
    while (true) {
      const url = `https://servicio-niveles-puntuacion.vercel.app/grafico-backoffice/usuarios-x-desafio-listado/${modelCurso.value}/${videosModel.value || 'null'}?page=${page}&limit=${limit}`
      const response = await fetch(url)
      const data = await response.json()

      if (!data.resp || data.data.length === 0) break

      allData.push(...data.data.map(item => ({
        ...item.userId,
        subscribed: item.subscribed
      })))

      if (data.data.length < limit) break
      page++
    }

    const headUser = ["_id","wylexId", "site", "site_id", "email", "first_name", "last_name","avatar","created_at","logged_at","logged_at_site","updated_at","validated_at","banned_at","country","phone_prefix","phone_number","gender","birth_date","identification_type","identification_number","newsletter_opt_in","provider","platform","created_in_os","created_at_suscriber_course","ciudad","telefono","birthDate","fecha_suscripcion_ecuavisados"];

      const csvContent = [
        headUser,
        ...allData.map(user => {
          var users = []
          for(var i in headUser){
            if("fecha_suscripcion_ecuavisados" == headUser[i]){
              users.push(moment(user.subscribed).format("YYYY-MM-DD HH:mm:ss"));
            }else{
              users.push(user[headUser[i]]);
            }
            
          }

          return users;
        })
      ].map(e => e.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", `usuarios_desafios_${moment().format("YYYYMMDD_HHmmss")}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    configSnackbar.value = {
      message: "Exportación completada con éxito.",
      type: "success",
      model: true
    }
  } catch (error) {
    console.error('Error al exportar datos:', error)
    configSnackbar.value = {
      message: "Error al exportar datos. Por favor, intente de nuevo.",
      type: "error",
      model: true
    }
  } finally {
    isFullLoading.value = false
  }
}
</script>

<template>
  <section>
    <VSnackbar 
      v-model="configSnackbar.model" 
      location="top end" 
      variant="flat" 
      :timeout="configSnackbar.timeout || 2000" 
      :color="configSnackbar.type">
      {{ configSnackbar.message }}
    </VSnackbar>
    
    <VRow>
      <VCol cols="12" sm="12" lg="12">
        <h1>Exportación de usuarios que han cumplido Desafíos por Semana</h1>
        <VCardText class="d-flex py-4 gap-4 px-0 flex-wrap" style="align-items: flex-start;">
          <div class="me-3 d-flex gap-4">
            <VSelect
              class="bg-white"
              v-model="rowPerPage"
              density="compact"
              variant="outlined"
              :items="[10, 20, 30, 50]"
            />
            
            <VSelect
              style="width: 15rem;"
              class="bg-white"
              v-model:menu="selectRefModulo"
              no-data-text="No existen semanas que mostrar"
              :disabled="cursoModelLoading"
              item-text="title"
              item-value="value"
              v-model="modelCurso" 
              :items="semanasItems"
              chips
              label="Seleccionar la semana de desafíos"
              :menu-props="{ maxHeight: '400' }">
              <template #selection="{ item }">
                <div>{{ item.title }}</div>
              </template>
              <template #item="{ item, props }">
                <v-list-item v-bind="props">
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      <p>_id: {{ item.value }}</p>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </VSelect>
            
            <VSelect
              v-if="desafiosItems.length > 0"
              style="width: 12rem;"
              class="bg-white"
              v-model="videosModel"
              :items="desafiosItems"
              item-text="title"
              item-value="value"
              chips
              label="Seleccionar desafío"
              :menu-props="{ maxHeight: '400' }"
            >
              <template #selection="{ item }">
                <div>{{ item.title }}</div>
              </template>
            </VSelect>
          </div>

          <VSpacer />

          <div class="app-user-search-filter d-flex align-top">
          
            <VBtn
              :loading="isFullLoading"
              :disabled="isFullLoading || loadingUsuarios"
              variant="tonal"
              color="info"
              class="mr-3"
              prepend-icon="tabler-database-export"
              @click="exportarTodosRegistros"
            >
              Exportar usuarios registrados
            </VBtn>

            <VBtn
              :loading="isFullLoading"
              :disabled="isFullLoading || loadingUsuarios"
              variant="tonal"
              color="success"
              prepend-icon="tabler-screen-share"
              @click="exportarDatos"
            >
              Exportar selección
            </VBtn>
          
          </div>
        </VCardText>

        <VCard class="mt-1">
          <VTable class="text-no-wrap">
            <thead>
              <tr>
                <th scope="col">Nombres</th>
                <th scope="col">Fecha de nacimiento</th>
                <th scope="col">Teléfono</th>
                <th scope="col">Fecha de registro</th>
                <th scope="col">Ciudad</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody v-if="!loadingUsuarios">
              <tr v-for="user in dataUsuarios" :key="user._id" style="height: 3.75rem;">
                <td>
                  <div class="d-flex align-center">
                    <VAvatar variant="tonal" color="success" class="me-3" size="38">
                      <VImg v-if="user.avatar" :src="user.avatar" />
                      <span v-else>{{ avatarText(`${user.first_name} ${user.last_name}`) }}</span>
                    </VAvatar>
                    <div class="d-flex flex-column">
                      <h6 class="text-base">
                        <RouterLink :to="{ name: 'apps-user-view-id', params: { id: user.wylexId } }" class="font-weight-medium user-list-name">
                          {{ user.first_name }} {{user.last_name}}
                        </RouterLink>
                      </h6>
                      <span class="text-sm text-disabled">@{{ user.email }}</span>
                    </div>
                  </div>
                </td>
                <td><span class="text-base">{{ user.birthDate || user.birth_date || 'N/A' }}</span></td>
                <td><span class="text-base">{{ user.telefono || user.phone_number || 'N/A' }}</span></td>
                <td><span class="text-base">{{ moment(user.subscribed).format("YYYY-MM-DD HH:mm:ss") }}</span></td>
                <td><span class="text-base">{{ user.ciudad || 'N/A' }}</span></td>
                <td class="text-center" style="width: 5rem;">
                  <VBtn icon size="x-small" color="default" variant="text" :to="{ name: 'apps-user-view-id', params: { id: user.wylexId } }">
                    <VIcon size="22" icon="tabler-eye" />
                  </VBtn>
                </td>
              </tr>
            </tbody>
            <tfoot v-show="!dataUsuarios.length && !loadingUsuarios">
            <tr>
              <td colspan="6" class="text-center">No hay datos que mostrar</td>
            </tr>
          </tfoot>
          <tfoot v-show="loadingUsuarios">
            <tr>
              <td colspan="6" class="text-center">Cargando datos, por favor espere un momento...</td>
            </tr>
          </tfoot>
        </VTable>
        <VDivider />
        <VCardText class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5">
          <span class="text-sm text-disabled">{{ paginationData }}</span>
          <VPagination
            v-model="currentPage"
            size="small"
            :total-visible="5"
            :length="totalPage"
          />
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</section>
</template>

<style lang="scss">
.app-user-search-filter {
  // Estilos adicionales si son necesarios
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}

.bg-white .v-field {
  background-color: rgb(var(--v-theme-surface));
  border-radius: 6px;
}

.justify-content-flex-end {
  justify-content: flex-end;
}
</style>