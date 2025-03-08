<template>
  <section>
    <VSnackbar v-model="success" color="success" transition="scale-transition" location="top center">
      <h3>Se ha guardado la configuración correctamente</h3>
    </VSnackbar>

    <VCard class="mt-5" title="Configuración de Reproductores">
      <VCardText v-if="isLoading"> Cargando configuración... </VCardText>
      <VCardText v-else class="py-4 gap-0 w-100">
        <VRow>
          <VCol cols="12">
            <VBtn color="primary" @click="addPlayer">
              Añadir Reproductor
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>

    <VExpansionPanels class="mt-5">
      <Draggable v-model="players" tag="div" item-key="index" @end="onDragEnd">
        <template #item="{ element, index }">
          <VExpansionPanel :key="index" :value="index">
            <VExpansionPanelTitle>
              {{ element.name || `Reproductor ${index + 1}` }}
              <VSwitch style="padding: 0 10px;" v-model="element.playerActivo" label="" />
            </VExpansionPanelTitle>
            <VExpansionPanelText>
              <VCard flat>
                <VCardTitle>
                  Configuración de {{ element.name || `Reproductor ${index + 1}` }}
                  <VBtn icon size="small" color="error" class="float-right mb-0" @click="removePlayer(index)">
                    <VIcon>mdi-delete</VIcon>
                  </VBtn>
                </VCardTitle>
                <VCardText>
                  <VRow>
                    <VCol cols="6">
                      <VTextField class="mb-5" v-model="element.name" label="Nombre del reproductor" />
                    </VCol>
                    <VCol cols="3">
                      <VTextField class="mb-5" v-model="element.subtituloFecha" label="Subtitulo Fecha" />
                    </VCol>
                    <VCol cols="3">
                      <VTextField class="mb-5" v-model="element.subtituloHora" label="Subtitulo Hora" />
                    </VCol>
                  </VRow>
                  <VTextarea v-model="element.iframe" label="Código iframe" rows="3" />
                  <VSwitch v-model="element.forzado" label="Activar forzado" />
                  <VTextField v-if="element.forzado" v-model="element.tituloForzado" label="Título forzado" />
                  <VTextField v-if="element.forzado" v-model="element.labelForzado" label="Label forzado" />
                  <VDivider class="my-4" />
                  <h3 class="mb-5">Configuración de Horarios</h3>
                  <VRow>
                    <VCol cols="4">
                      <VSelect v-model="diaSelected" :items="diasDisponibles(element)" label="Día de la semana" />
                    </VCol>
                    <VCol cols="8">
                      <VBtn color="primary" @click="addDia(element)" :disabled="!diaSelected">
                        Añadir día
                      </VBtn>
                    </VCol>
                  </VRow>
                  <VExpansionPanels>
                    <VExpansionPanel v-for="(horario, indexDia) in element.horarios" :key="indexDia">
                      <VExpansionPanelTitle>
                        {{ resolveDia(horario.dia) }}
                        <VChip :color="horario.estadoDia ? 'success' : 'warning'" class="ml-2">
                          {{ horario.estadoDia ? "Activo" : "Inactivo" }}
                        </VChip>
                      </VExpansionPanelTitle>
                      <VExpansionPanelText>
                        <VSwitch v-model="horario.estadoDia" label="Activar día" />
                        <VBtn color="primary" @click="addHora(element, indexDia)">
                          Añadir hora
                        </VBtn>
                        <VBtn color="error" @click="elimDia(element, indexDia)">
                          Eliminar día
                        </VBtn>
                        <VTable>
                          <thead>
                            <tr>
                              <th>Título</th>
                              <th>Inicio</th>
                              <th>Fin</th>
                              <th>Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(hora, indexHora) in horario.horas" :key="indexHora">
                              <td>
                                <VTextField v-model="hora.tituloPrograma" />
                              </td>
                              <td>
                                <VTextField v-model="hora.inicio" type="time" />
                              </td>
                              <td>
                                <VTextField v-model="hora.fin" type="time" />
                              </td>
                              <td>
                                <VBtn icon small color="error" @click="elimHora(element, indexDia, indexHora)">
                                  <VIcon>mdi-delete</VIcon>
                                </VBtn>
                              </td>
                            </tr>
                          </tbody>
                        </VTable>
                      </VExpansionPanelText>
                    </VExpansionPanel>
                  </VExpansionPanels>
                </VCardText>
              </VCard>
            </VExpansionPanelText>
          </VExpansionPanel>
        </template>
      </Draggable>
    </VExpansionPanels>

    <VRow class="m-5 d-inline">
      <VCol cols="12" class="text-end">
        <VBtn color="success" @click="enviar" :loading="isLoading">
          Guardar Configuración
        </VBtn>
      </VCol>
    </VRow>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import Draggable from 'vuedraggable';

const isLoading = ref(false);
const success = ref(false);
const players = ref([]);
const activeTab = ref(0);
const diaSelected = ref('');

const diasTotales = [
  { title: "Lunes", value: 1 },
  { title: "Martes", value: 2 },
  { title: "Miércoles", value: 3 },
  { title: "Jueves", value: 4 },
  { title: "Viernes", value: 5 },
  { title: "Sábado", value: 6 },
  { title: "Domingo", value: 0 },
];

function diasDisponibles(player) {
  const diasOcupados = player.horarios.map(h => h.dia);
  return diasTotales.filter(d => !diasOcupados.includes(d.value));
}

function resolveDia(dia) {
  return diasTotales.find(d => d.value === dia)?.title || '';
}

function addPlayer() {
  players.value.push({
    name: `Reproductor ${players.value.length + 1}`,
    iframe: '',
    forzado: false,
    tituloForzado: '',
    labelForzado: '',
    horarios: []
  });
  activeTab.value = players.value.length - 1;
}

function removePlayer(index) {
  players.value.splice(index, 1);
  if (activeTab.value >= players.value.length) {
    activeTab.value = players.value.length - 1;
  }
}

function addDia(player) {
  if (diaSelected.value) {
    player.horarios.push({
      dia: diaSelected.value,
      estadoDia: true,
      horas: []
    });
    diaSelected.value = '';
  }
}

function elimDia(player, index) {
  player.horarios.splice(index, 1);
}

function addHora(player, indexDia) {
  player.horarios[indexDia].horas.push({
    tituloPrograma: '',
    inicio: '12:00',
    fin: '13:00'
  });
}

function elimHora(player, indexDia, indexHora) {
  player.horarios[indexDia].horas.splice(indexHora, 1);
}

function onDragEnd() {
  // Aquí puedes agregar cualquier lógica adicional que necesites después de que se complete el arrastrar y soltar
}

async function getConfig() {
  isLoading.value = true;
  try {
    const response = await fetch(
      "https://micuenta.ecuavisa.com/suscripciones/player/config2.php?api=web&key=premiunPlayer1"
    );
    const data = await response.json();
    players.value = data.players || [];
    // Asegurarse de que cada reproductor tenga un array de horarios
    players.value.forEach(player => {
      if (!player.horarios) {
        player.horarios = [];
      }
    });
  } catch (error) {
    console.error("Error al cargar la configuración:", error);
  } finally {
    isLoading.value = false;
  }
}

async function enviar() {
  isLoading.value = true;
  try {
    const config = {
      players: players.value
    };

    const response = await fetch(
      "https://micuenta.ecuavisa.com/suscripciones/player/config2.php?api=update",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "premiunPlayer1",
          estructura: config
        }),
      }
    );

    const result = await response.json();
    console.log("result", result);
    if (result === "Configuración actualizada correctamente") {
      success.value = true;
    }
  } catch (error) {
    console.error("Error al guardar la configuración:", error);
  } finally {
    isLoading.value = false;
  }
}

// Cargar la configuración inicial
getConfig();
</script>

<style scoped>
.v-btn {
  margin-right: 8px;
  margin-bottom: 8px;
}

.v-expansion-panels {
  display: block;
}
</style>