<script setup>
import { integerValidator, requiredValidator } from '@validators'
  import { extendMoment } from 'moment-range';
import Moment from 'moment-timezone';
import esLocale from "moment/locale/es";

  const moment = extendMoment(Moment);
  moment.locale('es', [esLocale]);
  moment.tz.setDefault('America/Guayaquil');

  /**
   * Inicio variables para paginado
   */
  const rowPerPage = ref(10);
  const totalPage = ref(0);
  const currentPage = ref(1);
  const totalRegistros = ref(0);
  const totalPaginado = ref(0);
  const dataServices = ref([]);
  const dataServicesTable = ref([]);
  const loadingServices = ref(false);
  /**
   * Fin variables para paginado
   */

  /**
   * Inicio variables para paginado
  */
  const selectRepos = ref(["Todos los repositorios"]);
  const modelRepos = ref("Todos los repositorios");
  const selectSSH = ref([]);
  const modelSSH = ref(null);

  const visibilitySSH = ref(false);

  /**
   * Fin variables para paginado
   */

   /**
   * Inicio variables para búsqueda
  */
  const searchQuery = ref("");
  /**
   * Fin variables para búsqueda
   */

  /**
   * Inicio variables para mensajes de notificacion
   */
  const configSnackbar = ref({
    message: "Datos guardados",
    type: "success",
    model: false
  });
  /**
   * Fin variables para mensajes de notificacion
   */

   /**
   * Inicio función, listar servicios node activos
   */
  const itemsModelSSH = function(repos){
    try {
      return repos.map(repo => {
        const fullPathRemote = repo.remoteUrl
        return fullPathRemote;
      });
    } catch (error) {
      return [];
    }
  }

  const itemsModelRepos = function(repos){
    try {
      return repos.map(repo => {
        const fullPathRemote = repo.remoteUrl.split(':');
        const user = fullPathRemote[1].split('/')[0];
        const fullPath = fullPathRemote[1].split('/')[1].split('.')[0];
        const repoGit = fullPathRemote[1].split('/')[1].split('.')[1];
        return `/${fullPath}`;
      });
    } catch (error) {
      return [];
    }
  }

  const servicesList = function(type="all", value = ""){
    try {
      const servicesAll = [];
      if(type == "all"){
        for(var i in dataServices.value){
          const services = dataServices.value[i].services;
          for(var j in services){
            services[j]["pathPimary"] = dataServices.value[i].remoteUrl.split(':')[1];
            servicesAll.push(services[j]);
          }
        }
        return servicesAll;
      }else{
        for(var i in dataServices.value){
          if(dataServices.value[i].remoteUrl.includes(value)){
            const services = dataServices.value[i].services;
            for(var j in services){
              services[j]["pathPimary"] = dataServices.value[i].remoteUrl.split(':')[1];
              servicesAll.push(services[j]);
            }
          }
        }
        return servicesAll;
      }
    } catch (error) {
      return [];
    }
  }

  const resolveDataServicesTable = computed(() => {
    return dataServicesTable.value;
  })

  const listarServiciosNode = async () => {
    loadingServices.value = true;
    try {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      const response = await fetch("http://3.90.78.123:3000/backoffice/list-services", requestOptions);
      const result = await response.json();
    //   const result = {
    //     "resp": true,
    //     "data": {
    //         "repos": [
    //             {
    //                 "remoteUrl": "git@github.com:redyman/prueba-crud-assets.git",
    //                 "branch": "main",
    //                 "path": "/www/wwwroot/micro-servicio-node/prueba-crud-assets",
    //                 "services": [
    //                     {
    //                         "id": 27010,
    //                         "name": "servicio_1",
    //                         "path": "servicio_1",
    //                         "ssl": false,
    //                         "port": 27010,
    //                         "watchPaths": [
    //                             "servicio_1/"
    //                         ],
    //                         "init": "api/index.js",
    //                         "domain": "3.90.78.123"
    //                     },
    //                     {
    //                         "id": 27011,
    //                         "name": "servicio_2",
    //                         "path": "servicio_2",
    //                         "port": 27011,
    //                         "ssl": false,
    //                         "domain": "3.90.78.123",
    //                         "init": "api/index.js",
    //                         "watchPaths": [
    //                             "servicio_2/"
    //                         ]
    //                     }
    //                 ]
    //             }
    //         ]
    //     }
    // };

      dataServices.value = result.data.repos;
      selectRepos.value = ["Todos los repositorios", ...itemsModelRepos(result.data.repos)];
      selectSSH.value = itemsModelSSH(result.data.repos);

      dataServicesTable.value = servicesList("all");

      loadingServices.value = false;
      await getAllPort();
      return true;
    } catch (error) {
      console.log(error)
      configSnackbar.value = {
          message: "No se pudo recuperar los servicios node, recargue de nuevo.",
          type: "error",
          model: true
      };
      loadingServices.value = false;
      return null;
    }
  }
   /**
   * Fin función, listar servicios node activos
   */

   /**
    * Inicio get ports
   */
   const getAllPort = async () => {
    try {
        const response = await fetch('http://3.90.78.123:3000/backoffice/list-ports', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Incluir token si es necesario
                'Authorization': 'Bearer 3CUAVISaNhWVCRNPofjXtWMk1D99LOoFzMf6LfoNlkiN8dGDkd' 
            }
        });
        const data = await response.json();
        selectPuerto.value = data.data;
        return data;
    } catch (error) {
        configSnackbar.value = {
            message: "Existe un error en la conexión para listar los puertos." + error,
            type: "error",
            model: true
        };
        return null;    
    }
  };
  /**Fin get ports */
  /**
   * Inicio watch modelRepos
   */
   watch(modelRepos, async (value, oldValue) => {
    const servicesAll = [];
    if(value && value == "Todos los repositorios"){
      dataServicesTable.value = servicesList("all");
      return true;
    }else if(value){
      dataServicesTable.value = servicesList("remoteUrl", value);
      return true;
    }
    dataServicesTable.value = [];
    return true;
  });
  /**
   * Fin watch modelRepos
   */

   /**
   * Inicio variables modalAddServices
   */
  const dialogAddServices = ref(false);
  /**
   * Fin variables modalAddServices
   */

    /**
   * Inicio variables formulario
   */
  const modelMain = ref('main');
  const modelPuerto = ref("");
  const selectPuerto = ref([]);
  const modelSSL = ref(false);
  const modelDomain = ref("3.90.78.123");
  const modelInit = ref("api/index.js");
  const modelName = ref("");
  const modelPath = ref("");
  const visibleConsole = ref(false);
  /**
   * Fin variables formulario
   */

  /**
   * Inicio variables formulario validador
   */
    const textFieldRefModelPuerto = ref(null);
    const respSaveService = ref([]);
    const respSaveServiceFinal = ref(false);
    const respSaveServiceTitle = ref("Enviando...");
    const consoleRef = ref(null);

    async function createService(serviceData) {
      try {
          const response = await fetch('http://3.90.78.123:3000/backoffice/create-service-with-progress/', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  // Incluir token si es necesario
                  'Authorization': 'Bearer 3CUAVISaNhWVCRNPofjXtWMk1D99LOoFzMf6LfoNlkiN8dGDkd' 
              },
              body: JSON.stringify(serviceData)
          });

          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
              const { value, done } = await reader.read();
              if (done) {
                respSaveServiceFinal.value = true;
                break;
              }
              
              const text = decoder.decode(value);
              const messages = text.split('\n\n').filter(Boolean);

              for (const message of messages) {
                  if (message.startsWith('data: ')) {
                      try {
                          const data = JSON.parse(message.slice(6));

                          if(data.type == 'info'){
                            respSaveServiceTitle.value = data.message;
                          }else if(data.type == 'progress'){
                            if(data.stage == 'start' || data.stage == 'installing'){
                              respSaveServiceTitle.value = data.output;
                            }else{
                              respSaveServiceTitle.value = `Ejecutando: [${data?.command}]`;
                              respSaveService.value.push({
                                message: data?.output
                              });
                            }
                          }else if(data.type == 'completed'){
                            respSaveServiceTitle.value = data.output;
                            respSaveService.value.push({
                              message: data.output
                            });
                          }else if(data.type == 'success'){
                            respSaveServiceFinal.value = true;
                          }else{
                            if(data.type == 'error'){
                              console.error('Error:', data);
                              configSnackbar.value = {
                                  message: "Existe un error en las respuestas del servidor..."+ JSON.stringify(data),
                                  type: "error",
                                  model: true
                              };

                              respSaveService.value.push({
                                message: data.message
                              });
                            }else{
                              respSaveService.value.push({
                                message: data.output
                              });
                            }
                            
                          }
                      } catch (e) {
                          console.log('Error parsing message:', e);
                          respSaveService.value.push({
                            message: 'Error parsing message:'+ e
                          });
                          configSnackbar.value = {
                              message: "Existe un error en las respuestas del servidor.",
                              type: "error",
                              model: true
                          };
                      }
                  }
              }
          }
      } catch (error) {
          console.error('Error en la conexión:', error);
          configSnackbar.value = {
              message: "Existe un error en la conexión." + error,
              type: "error",
              model: true
          };
          return null;
      }
    }

    const onSubmit = async () => {
      // const validPort = await textFieldRefModelPuerto.value?.validate();
      // if (Object.keys(validPort).length > 0) {
      //   configSnackbar.value = {
      //       message: "Error, el campo Puerto no es el correcto.",
      //       type: "error",
      //       model: true
      //   };
      //   return true;
      // }

      if(!modelPuerto.value){
        configSnackbar.value = {
            message: "Error, el campo Puerto es obligatorio.",
            type: "error",
            model: true
        };
        return true;
      }

      if(!modelMain.value){
        configSnackbar.value = {
            message: "Error, el campo Branch es obligatorio.",
            type: "error",
            model: true
        };
        return true;
      }

      if(!modelName.value){
        configSnackbar.value = {
            message: "Error, el campo Nombre es obligatorio.",
            type: "error",
            model: true
        };
        return true;
      }

      if(!modelPath.value){
        configSnackbar.value = {
            message: "Error, el campo para el nombre de la carpeta principal es obligatorio.",
            type: "error",
            model: true
        };
        return true;
      }

      if(!modelInit.value){
        configSnackbar.value = {
            message: "Error, el campo de Inicio de su application, es obligatorio.",
            type: "error",
            model: true
        };
        return true;
      }

      if(!modelDomain.value){
        configSnackbar.value = {
            message: "Error, el campo para el nombre del dominio es obligatorio.",
            type: "error",
            model: true
        };
        return true;
      }

      const remoteUrl = modelSSH.value;
      const branch = modelMain.value;
      const name = modelName.value;
      const path = modelPath.value.replace(/^\/|\/$/g, '');
      const init = modelInit.value.replace(/^\/|\/$/g, '');
      const domain = modelDomain.value;
      const ssl = modelSSL.value;
      const port = modelPuerto.value;

      // const ejempResp = {
      //   name:"prueba"
      // }

      // setInterval(function(){
      //   respSaveService.value.push(ejempResp);
      //   const element = consoleRef.value
      //   element.scrollTop = element.scrollHeight
      // }, 1000);
      
      visibleConsole.value = true;
      loadingServices.value = true;

      await createService({remoteUrl, branch, name, path, init, domain, ssl, port});
      await listarServiciosNode();

      loadingServices.value = false;
      dialogAddServices.value = false;

      return true;
    }
  /**
   * Fin variables formulario validador
   */


  watch(modelPath, (newValue) => {
    if(newValue){
      modelPath.value = newValue.replace(/\s+/g, '/')
    }
  })

  // Función para mantener el scroll abajo
  const scrollToBottom = () => {
    if (consoleRef.value) {
      const element = consoleRef.value
      element.scrollTop = element.scrollHeight
    }
  }

  // Observar cambios en el contenido
  watch(() => consoleRef.value?.innerHTML, () => {
    nextTick(() => {
      scrollToBottom()
    })
  })

  /**Inicio eliminar registro */
  const idService = ref(0);
  const isDialogVisibleDelete = ref(false);
  const eliminarRegistro = async (id) => {
    console.log(id)
    isDialogVisibleDelete.value = true;
    idService.value = id;
  };

  const eliminarRegistroSi = async () => {
    try {
        loadingServices.value = true;
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const response = await fetch('http://3.90.78.123:3000/backoffice/delete-service/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                // Incluir token si es necesario
                'Authorization': 'Bearer 3CUAVISaNhWVCRNPofjXtWMk1D99LOoFzMf6LfoNlkiN8dGDkd' 
            },
            body: JSON.stringify({
              "serviceId": idService.value
            })
        });
        const data = await response.json();

        await listarServiciosNode();
        loadingServices.value = false;
        isDialogVisibleDelete.value = false;

    } catch (error) {
        configSnackbar.value = {
            message: "Existe un error en la conexión." + error,
            type: "error",
            model: true
        };
        loadingServices.value = false;
        return console.error(error.message);    
    }
  };
  /**Fin eliminar registro */

  

  /**
   * Inicio watch modalAddServices
   */

  watch(() => dialogAddServices.value, (newValue) => {
    if(newValue){
      visibleConsole.value = false;
      loadingServices.value = false;
      modelSSH.value = "";
      modelMain.value = "";
      modelName.value = "";
      modelPath.value = "";
      modelInit.value = "api/index.js";
      modelDomain.value = "3.90.78.123";
      modelSSL.value = false;
      modelPuerto.value = "";

      respSaveService.value = [];
      respSaveServiceFinal.value = false;
      respSaveServiceTitle.value = "Enviando...";
    }
  })
  /**
   * Fin watch modalAddServices
   */

  /**
   * Inicio onMounted
   */

  onMounted(async () => {
    await listarServiciosNode();
  });
  /**
   * Fin onMounted
   */
</script>

<template>
  <section>
    <VSnackbar 
      v-model="configSnackbar.model" 
      location="top end" 
      variant="flat" 
      :timeout="configSnackbar.timeout || 2000" 
      :color="configSnackbar.type"
    >
        {{ configSnackbar.message }}
    </VSnackbar>

    <VDialog
      v-model="isDialogVisibleDelete"
      persistent
      class="v-dialog-sm"
    >

      <!-- Dialog close btn -->
      <DialogCloseBtn @click="isDialogVisibleDelete = !isDialogVisibleDelete" />

      <!-- Dialog Content -->
      <VCard title="Eliminar registro">
        <VCardText>
          ¿Desea eliminar el registro?
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            @click="isDialogVisibleDelete = false"
          >
            No, Cerrar
          </VBtn>
          <VBtn @click="eliminarRegistroSi" :loading="loadingServices" :disabled="loadingServices">
            Si, eliminar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VDialog
      v-model="dialogAddServices"
      persistent
      class="v-dialog-sm"
    >

      <!-- Dialog Content -->
      <VCard title="Agregar servicio">
        <VCardText>
          <VForm v-if="!visibleConsole">
            <VRow>
              <VCol cols="12" sm="12" lg="12" >
                <label for="">SSH(Remote URL)</label>
                <VSelect v-if="!visibilitySSH"
                  style="min-width: 10rem;"
                  :disabled="loadingServices"
                  class="bg-white"
                  v-model="modelSSH"
                  density="compact"
                  variant="outlined"
                  :items="selectSSH"
                  append-icon="tabler-circle-plus"
                  @click:append="visibilitySSH = true"
                />

                <VTextField
                  v-else
                  clearable
                  :disabled="loadingServices"
                  v-model="modelSSH"
                  prepend-inner-icon="mdi-github"
                  placeholder="SSH(Remote URL)"
                  append-icon="tabler-arrow-back"
                  @click:append="visibilitySSH = false"
                />
              </VCol>
              <VCol cols="12" sm="12" lg="12" >
                <label for="">Nombre del servicio</label>
                <VTextField
                  :disabled="loadingServices"
                  clearable
                  placeholder="Nombre del servicio"
                  v-model="modelName"
                />
              </VCol>
              <VCol cols="12" sm="12" lg="6" >
                <label for="">Switch branches/tags</label>
                <VSelect 
                  style="min-width: 10rem;"
                  :disabled="loadingServices"
                  class="bg-white"
                  v-model="modelMain"
                  density="compact"
                  variant="outlined"
                  prepend-inner-icon="mdi-source-branch"
                  :items="['main']"
                />
              </VCol>
              <VCol cols="12" sm="12" lg="6" >
                <label for="">Seleccione un puerto</label>
                <VSelect
                  style="min-width: 100%;"
                  :disabled="loadingServices"
                  class="bg-white"
                  v-model="modelPuerto"
                  density="compact"
                  variant="outlined"
                  :items="selectPuerto"
                />
              </VCol>
              <VCol cols="12" sm="12" lg="12" >
                <label for="">Nombre de la carpeta principal</label>
                <VTextField
                  :disabled="loadingServices"
                  class="pl-0 classs-path"
                  clearable
                  v-model="modelPath"
                  placeholder=""
                >
                <!-- Prepend inner-->
                <template #prepend-inner>
                  <div class="d-flex align-center" v-if="modelSSH" style="font-size: 13px;padding-top: 3px;min-width: 3rem;width: 100%;text-overflow: ellipsis;overflow: hidden;white-space: pre;" >
                    <VIcon
                        :size="17"
                        icon="tabler-folder-open"
                        class="mr-1"
                      /> {{modelSSH.split(':')[1].split('/')[1].split('.')[0]}}/
                  </div>
                </template>
                </VTextField>
              </VCol>
              <VCol cols="12" sm="12" lg="6" >
                <label for="">Inicio de su application</label>
                <VTextField
                  :disabled="loadingServices"
                  clearable
                  v-model="modelInit"
                  placeholder=" ejm.(api/index.js)"
                />
              </VCol>
              <VCol cols="12" sm="12" lg="6" >
                <label for="">Dominio o dirección ip</label>
                <VTextField
                  :disabled="loadingServices"
                  clearable
                  v-model="modelDomain"
                  placeholder="3.90.78.123"
                />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>

        <VCardText v-if="visibleConsole">
          <VRow>
            <VCol cols="12" sm="12" lg="12" >
              <div v-if="!respSaveServiceFinal">
                <div class="d-flex align-center ">
                  <div class="progress-spinner"></div>
                  <span class="ml-2 text-capitalize">{{respSaveServiceTitle}}</span>
                </div>
                <small>
                  Por favor, espera un momento, no cierre esta ventana. 
                  <VIcon
                      :size="22"
                      icon="tabler-alert-triangle"
                      class="ml-1"
                      color="warning"
                    />
                </small>
              </div>
              <div class="d-flex align-center d-none" v-else>
                <VIcon
                    :size="32"
                    icon="tabler-check"
                    class="mr-2"
                    color="success"
                  />
                <span class="ml-2">Proceso finalizado con éxito</span>
              </div>
            </VCol>
          </VRow>
          <div ref="consoleRef" class="console-service v-theme--dark px-3  py-3">
            <VRow>
              <VCol cols="12" sm="12" lg="12" v-for="(resp, index) of respSaveService" :key="index">
                <div class="details-console">
                  {{resp.message}}
                </div>
              </VCol>
            </VRow>
          </div>
        </VCardText>

        <VCardText class="d-flex justify-end gap-3 flex-wrap">
          <VBtn
            color="secondary"
            variant="tonal"
            :disabled="loadingServices"
            @click="dialogAddServices = false"
          >
            No, Cerrar
          </VBtn>
          <VBtn @click="onSubmit" :loading="loadingServices" :disabled="loadingServices">
            Si, guardar
          </VBtn>
        </VCardText>
      </VCard>
    </VDialog>

    <VRow>
      <VCol cols="12" sm="12" lg="12" >
        <h1 class="mb-4">Servicios NodeJS activos AWS</h1>
        <VCardText class="d-flex py-4 gap-4 px-0 flex-wrap" style="align-items: flex-start;" >
          <div class="me-3 d-flex gap-4">
            <VSelect
              :disabled="loadingServices"
              class="bg-white"
              v-model="rowPerPage"
              density="compact"
              variant="outlined"
              :items="[10, 20, 30, 50]"
            />

            <VSelect
              style="min-width: 10rem;"
              label="Repositorios"
              :disabled="loadingServices"
              class="bg-white"
              v-model="modelRepos"
              density="compact"
              variant="outlined"
              :items="selectRepos"
            />

            <VTextField
              clearable
              title="Buscar servicio"
              :disabled="loadingServices"
              class="bg-white"
              v-model="searchQuery"
              label="Buscar servicio"
              prepend-inner-icon="mdi-magnify"
              single-line
              hide-details
              @input="" 
              @click:clear=""
              style="min-width: 26rem;"
            />
    
          </div>
          <VSpacer />

          <div class="app-user-search-filter d-flex align-top justify-content-flex-end flex-wrap flex-column gap-0">
            <VBtn
              :disabled="loadingServices"
              variant="tonal"
              color="success"
              prepend-icon="tabler-circle-plus"
              @click="dialogAddServices = true"
            >
              <span style="cursor:pointer" class="px-0 py-p m-0">Crear servicio</span>
            </VBtn>
          </div>
        </VCardText>
        <VRow id="card_services" class="mt-1">
          <VCol v-for="(service, index) of resolveDataServicesTable" :key="index" cols="12" sm="6" lg="4" >
            <VCard class="v-card--flat border border-1 rounded">
              <VCardItem class="header_card_item align-start pb-2">
                <div class="d-flex align-center">
                  <div class="image pb-2">
                    <VIcon
                      :size="32"
                      icon="tabler-brand-nodejs"
                      class="mr-2"
                      color="success"
                    />
                  </div>
                  <div class="descripcion">
                    <VCardTitle class="text-wrap lh-sm">{{service.name}}</VCardTitle>
                    <VCardSubtitle class="">/{{service.path}}</VCardSubtitle>
                  </div>
                </div>

                <template #append>
                  <div class="btn-acions" title="Acciones sobre el servicio">
                    <VBtn
                      icon
                      variant="plain"
                      color="default"
                      size="x-small"
                    >
                      <VIcon
                        :size="22"
                        icon="tabler-dots-vertical"
                      />
                      <VMenu activator="parent">
                        <VList density="compact">
                          <VListItem href="#" disabled>
                            <VIcon size="22" class="mr-1" icon="mdi-refresh" />
                            Redeploy
                          </VListItem>
                          <VListItem href="#" disabled>
                            <VIcon size="22" class="mr-1" icon="mdi-pencil" />
                            Editar servicio
                          </VListItem>
                          <VListItem :href="service.ssl ? 'https://' : 'http://' + service.domain + ':' + service.port" target="_blank">
                            <VIcon size="22" class="mr-1" icon="tabler-link" />
                            Visitar
                          </VListItem>
                          <VListItem href="#" @click="eliminarRegistro(service.id)">
                            <VIcon size="22" class="mr-1" icon="mdi-trash" color="error" />
                            Eliminar servicio
                          </VListItem>
                        </VList>
                      </VMenu>
                    </VBtn>
                  </div>
                </template>
              </VCardItem>
              <VCardText class="pb-3">
                <div class="repo-github-name pb-5">
                  <VChip>
                    <div class="image-git-name">
                      <VIcon
                        class=""
                        start
                        size="22"
                        icon="mdi-github"
                      />
                    </div>
                    {{service.pathPimary}}
                  </VChip>
                </div>

                <div class="repo-github-name pb-2">
                  <VBtn
                    v-if="!service.ssl"
                    color="secondary"
                    size="x-small"
                    variant="text"
                    class="px-0 py-0 text-decoration-underline text-capitalize"
                    disabled
                  >
                  Activar certificado SSL
                    <VIcon
                        class=""
                        end
                        color="success"
                        size="15"
                        icon="mdi-power-standby"
                      />
                  </VBtn>
                  <div class="estado-certificado" v-else>
                    SSL: <VChip size="x-small" :color="service.ssl ? 'success' : 'error'">{{service.ssl ? 'Si' : 'No'}}</VChip>
                  </div>
                </div>

                <div class="info-repo d-flex align-center justify-content-between pb-0">
                  <div class="repo-info-name d-flex align-center" title="Puerto en ejecución">
                    <div class="image-git-name">
                      <VIcon
                        class=""
                        start
                        size="20"
                        icon="mdi-console-line"
                      />
                    </div>
                    :{{service.port}}
                  </div>
                  <div class="repo-info-name d-flex align-center">
                    <div class="image-git-name">
                      <VIcon
                        class=""
                        start
                        size="19"
                        icon="mdi-source-branch"
                      />
                    </div>
                    main
                  </div>
                </div>

                
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VCol>
    </VRow>
  </section>
</template>
<style lang="scss">
  @import url(https://fonts.googleapis.com/css?family=Cousine);
  // #card_services .v-card--flat:hover{
  //   // cursor: pointer;
    
  // }
  #card_services .v-card .v-card-title {
    line-height: 1.1;
  }

  #card_services .justify-content-between {
      justify-content: space-between;
  }

  #card_services .repo-info-name{
    font-size: 12px;
  }

  .bg-white .v-field{
    background-color: rgb(var(--v-theme-surface));
    border-radius: 6px;
  }

  .estado-certificado{
    font-size: 12px;
  }

  .console-service {
      font-family: 'Cousine', 'monospace';
      background-color:#2f3349;
      margin-bottom:20px;
      height: 330px;
      overflow-y:auto;
      overflow-x: hidden; /* Previene scroll horizontal */
      padding-bottom:20px;
      border-radius: 8px;
      margin-top: 11px;
      font-size:10px;
      line-height:1.2;

      /* Añadir estas propiedades */
      // display: flex;
      // flex-direction: column-reverse;
  }

  /* Si necesitas mantener el orden original del contenido */
  // .console-service > * {
  //   flex-direction: column;
  // }

  .console-service h3 {
      padding-bottom:10px;
  }

  .details-console{
      padding-top:10px;
  }

  .console-service * {
      color:#fff;
  }

  .console-service  hr {
      border-color:#ffffff5e;
  }

  .progress-spinner {
      width: 20px;
      height: 20px;
      border: 2px solid #f3f3f3;
      border-top: 2px solid #2f3349;
      border-radius: 50%;
      animation: spin 1s linear infinite;
  }

  @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
  }
  
</style>
