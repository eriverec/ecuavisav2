<template>
  <section>
    <VSnackbar v-model="success" color="success" transition="scale-transition" location="top center">
      <h3>Se ha guardado la configuración correctamente</h3>
    </VSnackbar>

    <VCard class="mt-5" title="Configuración de Reproductores Internacionales">
      <VCardText v-if="isLoading"> Cargando configuración... </VCardText>
      <VCardText v-else class="py-4 gap-0 w-100">
        <VRow>
          <VCol cols="12">
            <VBtn color="primary" @click="addPlayer">
              Añadir Reproductor
            </VBtn>
          </VCol>
        </VRow>

   

        <VTabs v-model="activeTab">
          <VTab v-for="(player, index) in players" :key="index" :value="index">
            {{ player.name || `Reproductor ${index + 1}` }}
          </VTab>
        </VTabs>

        <VWindow v-model="activeTab">
          <VWindowItem v-for="(player, index) in players" :key="index" :value="index">
            <VCard flat>
              <VCardTitle>
                Configuración de {{ player.name || `Reproductor ${index + 1}` }}
                <VBtn icon small color="error" class="float-right" @click="removePlayer(index)">
                  <VIcon>mdi-delete</VIcon>
                </VBtn>
              </VCardTitle>
              <VCardText>
                <VRow>
                  <VCol cols="6">
                    <VTextField class="mb-5" v-model="player.name" label="Nombre del reproductor" />

                  </VCol>
                  <VCol cols="3">
                    <VTextField class="mb-5" v-model="player.subtituloFecha" label="Subtitulo Fecha" />

                  </VCol>
                  <VCol cols="3">
                    <VTextField class="mb-5" v-model="player.subtituloHora" label="Subtitulo Hora" />

                  </VCol>
                </VRow>


                <VTextarea v-model="player.iframe" label="Código iframe" rows="3" />
                <VSwitch v-model="player.playerActivo" label="Activar Player" />
                <VSwitch v-model="player.forzado" label="Activar forzado" />
                <VTextField v-if="player.forzado" v-model="player.tituloForzado" label="Título forzado" />
                <VTextField v-if="player.forzado" v-model="player.labelForzado" label="Label forzado" />

                <VDivider class="my-4" />

                <h3 class="mb-5">Configuración de Horarios</h3>


                

                <VRow>
                  <VCol cols="4">
                    <VSelect v-model="diaSelected" :items="diasDisponibles(player)" label="Día de la semana" />
                  </VCol>
                  <VCol cols="8">
                    <VBtn color="primary" @click="addDia(player)" :disabled="!diaSelected">
                      Añadir día
                    </VBtn>
                  </VCol>
                </VRow>

                <VExpansionPanels>
                  <VExpansionPanel v-for="(horario, indexDia) in player.horarios" :key="indexDia">
                    <VExpansionPanelTitle>
                      {{ resolveDia(horario.dia) }}
                      <VChip :color="horario.estadoDia ? 'success' : 'warning'" class="ml-2">
                        {{ horario.estadoDia ? "Activo" : "Inactivo" }}
                      </VChip>
                    </VExpansionPanelTitle>
                    <VExpansionPanelText>
                      <VSwitch v-model="horario.estadoDia" label="Activar día" />
                      <VBtn color="primary" @click="addHora(player, indexDia)">
                        Añadir hora
                      </VBtn>
                      <VBtn color="error" @click="elimDia(player, indexDia)">
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
                              <VBtn icon small color="error" @click="elimHora(player, indexDia, indexHora)">
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
          </VWindowItem>
        </VWindow>

        <VRow class="mt-4">
          <VCol cols="12">
            <VBtn color="success" @click="enviar" :loading="isLoading">
              Guardar Configuración
            </VBtn>
          </VCol>
        </VRow>
      </VCardText>
    </VCard>
  </section>
</template>

<script setup>
import { ref } from 'vue';

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

async function getConfig() {
  isLoading.value = true;
  try {
    const response = await fetch(
      "https://micuenta.ecuavisa.com/suscripciones/player/config2.php?api=web&key=premiunPlayerInternacional"
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
          key: "premiunPlayerInternacional",
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
</style>