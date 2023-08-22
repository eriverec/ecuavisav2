<script setup>
import { computed, onMounted } from 'vue';

const estadoSend = ref(false);
const estado = ref(false);
const estadoRaw = ref(false);
//const titulo = ref('');
const router = useRouter();
//const isError = ref(false);
const isLoading = ref(false);
const currentTab = ref('');
const diaSelected = ref('');
const horarios = ref([]);
const horariosRaw = ref([]);

const tituloForzado = ref('');
const labelForzado = ref('');

const diasTotales = [
    {
        title: "Lunes",
        value: 1
    },
    {
        title: "Martes",
        value: 2
    },
    {
        title: "Miércoles",
        value: 3
    },
    {
        title: "Jueves",
        value: 4
    },
    {
        title: "Viernes",
        value: 5
    },

    {
        title: "Sábado",
        value: 6
    },
    {
        title: "Domingo",
        value: 7
    },
]

async function getConfig () {
    isLoading.value = true;
    const consultaDesktop = await fetch('https://configuracion-service.vercel.app/configuracion/horarioRadio');
    const data = await consultaDesktop.json();
    console.log('dataRAW: ', data);
    estado.value = data.forzado; 
    estadoRaw.value = data.forzado; 
    horarios.value = Array.from(data.horarios);
    horariosRaw.value =  Array.from(data.horarios);
    //console.log('horario llega ', horarios.value);  
    isLoading.value = false;
}

onMounted(() => { 
    authorizedCheck(); 
    getConfig(); 
});

const diasDisponibles = computed( ()=>{
    if(horarios.value.length > 0){
        horarios.value = horarios.value.sort(function (a, b) {return a.dia - b.dia;}); 
        //console.log('horario sorted', horarios.value);
        const diasHorarios = horarios.value.map(item => item.dia);
        let diferencia = diasTotales.filter(item => !diasHorarios.includes(item.value));
        //console.log('dif', diferencia);
        return diferencia;
    }
})

function resolveDia (dia) {
    let diaSolved = diasTotales.filter(item => dia === item.value );
    return diaSolved[0].title;
}

// ---------------- DIA ------------------
const addDia = () => {
    if(diaSelected.value){
        let diaNuevo = {
            dia: diaSelected.value,
            estadoDia: true,
            horas: [
                {
                    tituloPrograma: '',
                    estadoHorario: true,
                    inicio: "12:00",
                    fin: "14:00"
                }
            ]
        }
        horarios.value.push(diaNuevo);
        diaSelected.value = '';
    }
}

const elimDia = (index) =>{
    horarios.value.splice(index, 1);
};

// ---------------- HORA ------------------

const addHora = (index) => {  
        let horaNuevo = {  
            tituloPrograma: '',
            estadoHorario: true,      
            inicio: "12:00",
            fin: "14:00"  
        }
        horarios.value[index].horas.push(horaNuevo);
}

const elimHora = (index, indexHora) =>{
    horarios.value[index].horas.splice(indexHora, 1);
};


const authorizedCheck = () => {
    let rol = localStorage.getItem('role');
    if(rol !== 'administrador' && rol !== 'webmaster'){
        router.push({ path: '/pages/errors/not-authorized' })
    }
}

// ------------ ENVIAR ------------
const success = ref(false);

async function enviar (){

        let nuevaConfiguracion = {
            "key": "horarioRadio",
            "estructura": 
                {                    
            "forzado": estadoRaw.value,
            "horarios": horarios.value 
        }
        };

        console.log('datos a enviar ',nuevaConfiguracion );
     
        var myHeaders = new Headers();
		myHeaders.append("Content-Type", "application/json");
		var raw = JSON.stringify(nuevaConfiguracion);
		var requestOptions = {
				method: 'PUT',
				headers: myHeaders,
				body: raw,
				redirect: 'follow'
		};
		await fetch(`https://configuracion-service.vercel.app/update`, requestOptions)
		.then(response => response.json())
        .then(async(responseJson) => {
            console.log('respuesta POST ',responseJson);
            if(responseJson == 'Configuración actualizada correctamente'){
                success.value = true;
                await getConfig();
            }
        })
        .catch(error => console.error('error', error));
}

async function enviarForzado (){

let nuevaConfiguracion = {
    "key": "horarioRadio",
    "estructura": 
        {                    
            "forzado": {
                "estado": estado.value,
                "titulo": tituloForzado.value,
                "textoLabel": labelForzado.value
            },
            "horarios": horariosRaw.value 
        }
};

console.log('datos a enviar ',nuevaConfiguracion );

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
var raw = JSON.stringify(nuevaConfiguracion);
var requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
};
await fetch(`https://configuracion-service.vercel.app/update`, requestOptions)
.then(response => response.json())
.then(async(responseJson) => {
    console.log('respuesta POST ',responseJson);
    if(responseJson == 'Configuración actualizada correctamente'){
        success.value = true;
        await getConfig();
    }
})
.catch(error => console.error('error', error));
}

</script>

<template>

    <VSnackbar
        v-model="success"
        color="success"
        transition="scale-transition"
        location="top center"
        >
        <h3>Se ha guardado la configuración exitosamente</h3>
    </VSnackbar>
  <VTabs v-model="currentTab" class="v-tabs-pill">
        <VTab value="tab-config" >Configuración</VTab>
        <VTab value="tab-forzado" >Forzado</VTab>
  </VTabs>
  <VWindow v-model="currentTab">
                <VWindowItem value="tab-config">
     
                    <VCard class="mt-5" title="Configuración de los horarios" >	
                        <VCardText v-if="isLoading">
                                Cargando configuración...
                        </VCardText>      
                        <VCardText class="py-4 gap-0 w-100" v-else>	
                        <VRow> 
                            <VCol cols="12" style="display: flex; flex-wrap: wrap; align-items: center;">
                                <VCol cols="4">
                                
                                <VSelect v-model="diaSelected" :items="diasDisponibles" :disabled="diasDisponibles.length===0" label="Día de la semana" />
                                </VCol>    
                                <VCol cols="6" class="d-flex gap-4">
                                    <VBtn
                                    color="primary"
                                    @click="addDia()"
                                    :disabled="diasDisponibles.length===0 || !diaSelected"
                                    >
                                    Añadir día
                                    </VBtn>

                                    <VBtn
                                    color="primary"
                                    @click="enviar()"                                 
                                    >
                                    Guardar configuración
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
                                           <h3> {{ resolveDia(horario.dia) }} </h3>
                                           <VChip :color="horario.estadoDia == true ? 'success' : 'warning'" class="mr-4" >{{ horario.estadoDia == true ? 'Activo' : 'Inactivo' }} </VChip>
                                        </VExpansionPanelTitle>
                                        <VExpansionPanelText class="d-flex flex-wrap justify-space-between">
                                            <div style="padding: 1rem; border:1px solid rgba(var(--v-theme-on-background), var(--v-disabled-opacity));border-radius: 7px;">
                                            <VTable class="w-full">
                                            <thead>
                                                <tr>
                                                <th scope="col" style="width: 300px;">Título</th>    
                                                <th scope="col" style="width: 170px;">Hora de inicio</th>
                                                <th scope="col" style="width: 170px;">Hora de fin</th>
                                                <th scope="col" class="d-flex gap-4 pb-4">

                                                    <VSwitch
                                                        v-model="horario.estadoDia"
                                                        color="success"
                                                        :label="horario.estadoDia == true ? 'Día activo' : 'Día inactivo'"
                                                    />

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
                                            </thead>
                                            <tbody>
                                                <tr v-for="hora,indexHora in horario.horas" :key="indexHora">      
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
                                                    :config="{ enableTime: true, noCalendar: true , dateFormat: 'H:i'}"
                                                    />
                                                </td>
                                                <td class="py-4">
                                                    <div class="d-flex gap-4 py-4">
                                                    <VSwitch
                                                        v-model="hora.estadoHorario"
                                                        color="success"
                                                        :label="hora.estadoHorario == true ? 'Horario activo' : 'Horario inactivo'"
                                                    />
                                 
                                                    <VBtn v-if="horario.horas.length>1" color="error" @click="elimHora(index,indexHora)"><VIcon icon="tabler-trash"></VIcon></VBtn>  
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
                    <VCard class="mt-5" title="Player Forzado">	
                    <VCardText class="py-4 gap-0 w-100">	
                    <VRow> 
                        <VCol cols="12" style="display: flex; flex-wrap: wrap; align-items: center;">
                    
                    
                    <div style="width: 650px; margin-top: 1rem; margin-bottom: 1rem;" class="d-flex flex-row gap-2">
                        <VTextField
                            v-model="tituloForzado"
                            label="Título"
                            placeholder="Escriba el título..."
                            class="ms-0 me-1 chat-list-search"
                        >
                        </VTextField>
                        <VTextField
                            v-model="labelForzado"
                            label="Label"
                            placeholder="Escriba el label..."
                            class="ms-0 me-1 chat-list-search"
                        >
                        </VTextField>
                        </div>
                        <div style="display: flex; margin: 1rem;">
                        <div>
                        <VSwitch
                            v-model="estado"
                            color="success"
                            :label="estado == true ? 'Activo' : 'Inactivo'"
                        />
                        </div>
                        <div style="margin-left: 2rem;">
                        <VBtn
                                                    color="primary"
                                                    @click="enviarForzado"
                                                >
                                                    Enviar
                                                </VBtn>
                        </div>
                        </div>
                    
                    
                        </VCol>
                        <VCol cols="12"  style="display: flex; align-items: center;" >
                            
                                <div>
                                <span>Estado del player: </span>
                                </div>
                                <div style="margin-left: 2rem;">
                                <VChip :color="estadoRaw == true ? 'success' : 'warning'" class="mr-4" >{{ estadoRaw == true ? 'Activo' : 'Inactivo' }} </VChip>
                                </div>    
                            
                        </VCol>
                        </VRow>
                    </VCardText>
                </VCard>
                </VWindowItem>
            </VWindow>
  
			
           
            
  			

  
</template>



