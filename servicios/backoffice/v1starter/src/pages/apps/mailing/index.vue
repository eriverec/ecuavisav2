<script setup>
import { onMounted } from 'vue';

const itemsPerPage = 8;
// ---------------------------------- AUTH --------------------------------------  //
const token_auth = ref('');

async function sendpulseAuth(){
    var raw = JSON.stringify({
    "grant_type": "client_credentials",
    "client_id": "c79f7382012df0ea4c6fa37afec6374e",
    "client_secret": "164551af334e1ec93e1b3099afd93a88"
    });

    var requestOptions = {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: raw,
    redirect: 'follow'
    };

    const consulta = await fetch("https://api.sendpulse.com/oauth/access_token", requestOptions);
    const consultaJson = await consulta.json();
    token_auth.value = consultaJson.access_token;
}

// ---------------------------------------- 1 ----------------------------------------  //
const currentPageA = ref(1);
const listasCorreos = ref([]);
async function getListasCorreos(){
    try {       
        if(!token_auth.value) return false;

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token_auth.value);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        const consulta = await fetch('https://api.sendpulse.com/addressbooks', requestOptions);
        const consultaJson = await consulta.json();
        listasCorreos.value = consultaJson;
        console.log('consulta 1 ', consultaJson);
        
    } catch (error) {
        console.error(error.message);   
    }
}

const paginatedListasCorreos = computed(() => {
  const start = (currentPageA.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return listasCorreos.value.slice(start, end);
});

const nextPageA = () => {
  if (currentPageA.value * itemsPerPage < listasCorreos.value.length) currentPageA.value++;
};

const prevPageA = () => {
  if (currentPageA.value > 1) currentPageA.value--;
};

// ----------------------------------------- 2 ---------------------------------------  //
const currentPageB = ref(1);
const listaCampaigns = ref([]);
async function getListaCampaigns(){
    try {       
        if(!token_auth.value) return false;

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token_auth.value);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        const consulta = await fetch('https://api.sendpulse.com/campaigns', requestOptions);
        const consultaJson = await consulta.json();
        listaCampaigns.value = consultaJson;
        console.log('consulta 2 ', consultaJson);
        
    } catch (error) {
        console.error(error.message);   
    }
}

const paginatedListaCampaigns = computed(() => {
  const start = (currentPageB.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return listaCampaigns.value.slice(start, end);
});

const nextPageB = () => {
  if (currentPageB.value * itemsPerPage < listaCampaigns.value.length) currentPageB.value++;
};

const prevPageB = () => {
  if (currentPageB.value > 1) currentPageB.value--;
};

// ------------------------------------- 3 -------------------------------------------  //
const currentPageC = ref(1);
const listaPlantillas = ref([]);
async function getListaPlantillas(){
    try {       
        if(!token_auth.value) return false;

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token_auth.value);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        const consulta = await fetch('https://api.sendpulse.com/templates', requestOptions);
        const consultaJson = await consulta.json();
        listaPlantillas.value = consultaJson;
        console.log('consulta 3 ', consultaJson);
        
    } catch (error) {
        console.error(error.message);   
    }
}

const paginatedListaPlantillas = computed(() => {
  const start = (currentPageC.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return listaPlantillas.value.slice(start, end);
});

const nextPageC = () => {
  if (currentPageC.value * itemsPerPage < listaPlantillas.value.length) currentPageC.value++;
};

const prevPageC = () => {
  if (currentPageC.value > 1) currentPageC.value--;
};

// ------------------------------------- 4 -------------------------------------------  //
const currentPageD = ref(1);
const listaPlantillasSistema = ref([]);
async function getListaPlantillasSistema(){
    try {       
        if(!token_auth.value) return false;

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token_auth.value);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        const consulta = await fetch('https://api.sendpulse.com/templates/?owner=sendpulse', requestOptions);
        const consultaJson = await consulta.json();
        listaPlantillasSistema.value = consultaJson;
        console.log('consulta 4 ', consultaJson);
        
    } catch (error) {
        console.error(error.message);   
    }
}

const paginatedListaPlantillasSistema = computed(() => {
  const start = (currentPageD.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return listaPlantillasSistema.value.slice(start, end);
});

const nextPageD = () => {
  if (currentPageD.value * itemsPerPage < listaPlantillasSistema.value.length) currentPageD.value++;
};

const prevPageD = () => {
  if (currentPageD.value > 1) currentPageD.value--;
};

// ------------------------------------- 5 -------------------------------------------  //
const currentPageE = ref(1);
const listaPlantillasUser = ref([]);
async function getListaPlantillasUser(){
    try {       
        if(!token_auth.value) return false;

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token_auth.value);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        const consulta = await fetch('https://api.sendpulse.com/templates/?owner=me', requestOptions);
        const consultaJson = await consulta.json();
        listaPlantillasUser.value = consultaJson;
        console.log('consulta 5 ', consultaJson);
        
    } catch (error) {
        console.error(error.message);   
    }
}

const paginatedListaPlantillasUser = computed(() => {
  const start = (currentPageE.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return listaPlantillasUser.value.slice(start, end);
});

const nextPageE = () => {
  if (currentPageE.value * itemsPerPage < listaPlantillasUser.value.length) currentPageE.value++;
};

const prevPageE = () => {
  if (currentPageE.value > 1) currentPageE.value--;
};

// ------------------------------------- 6 -------------------------------------------  //
const currentPageF = ref(1);
const listaRemitentes = ref([]);
async function getListaRemitentes(){
    try {       
        if(!token_auth.value) return false;

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token_auth.value);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        const consulta = await fetch('https://api.sendpulse.com/senders', requestOptions);
        const consultaJson = await consulta.json();
        listaRemitentes.value = consultaJson;
        console.log('consulta 6 ', consultaJson);
        
    } catch (error) {
        console.error(error.message);   
    }
}

const paginatedListaRemitentes = computed(() => {
  const start = (currentPageF.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return listaRemitentes.value.slice(start, end);
});

const nextPageF = () => {
  if (currentPageF.value * itemsPerPage < listaRemitentes.value.length) currentPageF.value++;
};

const prevPageF = () => {
  if (currentPageF.value > 1) currentPageF.value--;
};

// ------------------------------------- 7 -------------------------------------------  //
const currentPageG = ref(1);
const listaBlacklist = ref([]);
async function getListaBlacklist(){
    try {       
        if(!token_auth.value) return false;

        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer "+token_auth.value);

        var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
        };

        const consulta = await fetch('https://api.sendpulse.com/blacklist', requestOptions);
        const consultaJson = await consulta.json();
        listaBlacklist.value = consultaJson;
        console.log('consulta 7 ', consultaJson);
        
    } catch (error) {
        console.error(error.message);   
    }
}

const paginatedListaBlacklist = computed(() => {
  const start = (currentPageG.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  return listaBlacklist.value.slice(start, end);
});

const nextPageG = () => {
  if (currentPageG.value * itemsPerPage < listaBlacklist.value.length) currentPageG.value++;
};

const prevPageG = () => {
  if (currentPageG.value > 1) currentPageG.value--;
};

// --------------------------------------------------------------------------------  //
onMounted(async()=>{
    await sendpulseAuth();
    await getListasCorreos();
    await getListaCampaigns();
    await getListaPlantillas();
    await getListaPlantillasSistema();
    await getListaPlantillasUser();
    await getListaRemitentes();
    await getListaBlacklist();

})
</script>


<template>
<section>

    <VRow>
        <VCol cols="6">
            <VCard >
                <VCardTitle class="pt-4 pl-6">Listas de correo</VCardTitle>
                <VCardItem v-if="listasCorreos.length>0">
                <VTable class="text-no-wrap tableNavegacion mb-5" >
                    <thead>
                        <tr>
                        <th scope="col">Id</th>    
                        <th scope="col">Nombre</th>
                        <th scope="col">Cantidad total</th>
                        <th scope="col">Cantidad activos</th>
                        <th scope="col">Cantidad inactivos</th>
                        <th scope="col">Fecha de creación</th>
                        <th scope="col">Estado</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr class="clickable" v-for="item in paginatedListasCorreos">
                        <td class="text-medium-emphasis">
                            {{ item.id}}
                        </td>      
                        <td class="text-medium-emphasis">
                            {{ item.name}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.all_email_qty}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.active_email_qty}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.inactive_email_qty}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.creationdate}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.status_explain}}
                        </td>               
                        </tr>
                    </tbody>
                </VTable>
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageA" :disabled="currentPageA === 1"></VBtn>
                Página {{ currentPageA }}
                <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageA"
                    :disabled="(currentPageA * itemsPerPage) >= listasCorreos.length">
                </VBtn>
                </div>
                </VCardItem>  
                <VCardItem v-else>
                Cargando datos...
                </VCardItem>      
            </VCard>
        </VCol>

        <VCol cols="6">
            <VCard>
                <VCardTitle class="pt-4 pl-6">Lista de las campañas</VCardTitle>
                <VCardItem v-if="listaCampaigns.length>0">
                <VTable class="text-no-wrap tableNavegacion mb-5" >
                    <thead>
                        <tr>
                        <th scope="col">Id</th>    
                        <th scope="col">Nombre</th>
                        <th scope="col">Nombre del remitente</th>
                        <th scope="col">Email del remitente</th>
                        <th scope="col">Asunto</th>
                        <th scope="col">Enviados</th>
                        <th scope="col">Entregados</th>
                        <th scope="col">Abiertos</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr class="clickable" v-for="item in paginatedListaCampaigns">
                        <td class="text-medium-emphasis">
                            {{ item.id}}
                        </td>    
                        <td class="text-medium-emphasis">
                            {{ item.name}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.message.sender_name}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.message.sender_email}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.message.subject}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.statistics.sent}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.statistics.delivered}}
                        </td> 
                        <td class="text-medium-emphasis">
                            {{ item.statistics.opening}}
                        </td>               
                        </tr>
                    </tbody>
                </VTable>
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageB" :disabled="currentPageB === 1"></VBtn>
                Página {{ currentPageB }}
                <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageB"
                    :disabled="(currentPageB * itemsPerPage) >= listaCampaigns.length">
                </VBtn>
                </div>
                </VCardItem>  
                <VCardItem v-else>
                Cargando datos...
                </VCardItem>
            </VCard>
        </VCol>

        <VCol cols="6">
            <VCard>
                <VCardTitle class="pt-4 pl-6">Lista de plantillas</VCardTitle>
                <VCardItem v-if="listaPlantillas.length>0">
                <VTable class="text-no-wrap tableNavegacion mb-5" >
                    <thead>
                        <tr>
                        <th scope="col">Id</th>    
                        <th scope="col">Nombre</th>
                        <th scope="col">Categoría</th>
                        <th scope="col">Fecha de creación</th>
                        <th scope="col">propietario</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr class="clickable" v-for="item in paginatedListaPlantillas">
                        <td class="text-medium-emphasis">
                            {{ item.id}}
                        </td>    
                        <td class="text-medium-emphasis">
                            {{ item.name}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.category}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.created}}
                        </td>  
                        <td class="text-medium-emphasis">
                            {{ item.owner}}
                        </td>          
                        </tr>
                    </tbody>
                </VTable>
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageC" :disabled="currentPageC === 1"></VBtn>
                Página {{ currentPageC }}
                <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageC"
                    :disabled="(currentPageC * itemsPerPage) >= listaPlantillas.length">
                </VBtn>
                </div>
                </VCardItem> 
                <VCardItem v-else>
                Cargando datos...
                </VCardItem>

            </VCard>
        </VCol>

        <VCol cols="6">
            <VCard>
                <VCardTitle class="pt-4 pl-6">Lista de plantillas del sistema</VCardTitle>
                <VCardItem v-if="listaPlantillasSistema.length>0">
                <VTable class="text-no-wrap tableNavegacion mb-5" >
                    <thead>
                        <tr>
                        <th scope="col">Id</th>    
                        <th scope="col">Nombre</th>
                        <th scope="col">Categoría</th>
                        <th scope="col">Fecha de creación</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr class="clickable" v-for="item in paginatedListaPlantillasSistema">
                        <td class="text-medium-emphasis">
                            {{ item.id}}
                        </td>    
                        <td class="text-medium-emphasis">
                            {{ item.name}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.category}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.created}}
                        </td>                             
                        </tr>
                    </tbody>
                </VTable>
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageD" :disabled="currentPageD === 1"></VBtn>
                Página {{ currentPageD }}
                <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageD"
                    :disabled="(currentPageD * itemsPerPage) >= listaPlantillasSistema.length">
                </VBtn>
                </div>
                </VCardItem> 
                <VCardItem v-else>
                Cargando datos...
                </VCardItem>

            </VCard>
        </VCol>

        <VCol cols="6">
            <VCard>
                <VCardTitle class="pt-4 pl-6">Lista de plantillas de ecuavisa</VCardTitle>
                <VCardItem v-if="listaPlantillasUser.length>0">
                <VTable class="text-no-wrap tableNavegacion mb-5" >
                    <thead>
                        <tr>
                        <th scope="col">Id</th>    
                        <th scope="col">Nombre</th>
                        <th scope="col">Categoría</th>
                        <th scope="col">Fecha de creación</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr class="clickable" v-for="item in paginatedListaPlantillasUser">
                        <td class="text-medium-emphasis">
                            {{ item.id}}
                        </td>    
                        <td class="text-medium-emphasis">
                            {{ item.name}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.category}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.created}}
                        </td>                             
                        </tr>
                    </tbody>
                </VTable>
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageE" :disabled="currentPageE === 1"></VBtn>
                Página {{ currentPageE }}
                <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageE"
                    :disabled="(currentPageE * itemsPerPage) >= listaPlantillasUser.length">
                </VBtn>
                </div>
                </VCardItem> 
                <VCardItem v-else>
                Cargando datos...
                </VCardItem>

            </VCard>
        </VCol>

        <VCol cols="6">
            <VCard>
                <VCardTitle class="pt-4 pl-6">Lista de todos los remitentes</VCardTitle>
                <VCardItem v-if="listaRemitentes.length>0">
                <VTable class="text-no-wrap tableNavegacion mb-5" >
                    <thead>
                        <tr>
                        <th scope="col">Nombre</th>    
                        <th scope="col">Email</th>
                        <th scope="col">Estado</th>
                        <th scope="col">Permiso para SMTP</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr class="clickable" v-for="item in paginatedListaRemitentes">
                        <td class="text-medium-emphasis">
                            {{ item.name}}
                        </td>    
                        <td class="text-medium-emphasis">
                            {{ item.email}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.status}}
                        </td>
                        <td class="text-medium-emphasis">
                            {{ item.is_allowed_for_smtp}}
                        </td>                             
                        </tr>
                    </tbody>
                </VTable>
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageF" :disabled="currentPageF === 1"></VBtn>
                Página {{ currentPageF }}
                <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageF"
                    :disabled="(currentPageF * itemsPerPage) >= listaRemitentes.length">
                </VBtn>
                </div>
                </VCardItem> 
                <VCardItem v-else>
                Cargando datos...
                </VCardItem>

            </VCard>
        </VCol>

        <VCol cols="6">
            <VCard>
                <VCardTitle class="pt-4 pl-6">Lista de usuarios blacklisted</VCardTitle>
                <VCardItem v-if="listaBlacklist.length>0">
                <VTable class="text-no-wrap tableNavegacion mb-5" >
                    <thead>
                        <tr>
                        <th scope="col">Email</th>    
                        </tr>
                    </thead>

                    <tbody>
                        <tr class="clickable" v-for="item in paginatedListaBlacklist">
                        <td class="text-medium-emphasis">
                            {{ item }}
                        </td>                                 
                        </tr>
                    </tbody>
                </VTable>
                <div class="d-flex align-center justify-space-between botonescurrentPage">
                <VBtn icon="tabler-arrow-big-left-lines" @click="prevPageG" :disabled="currentPageG === 1"></VBtn>
                Página {{ currentPageG }}
                <VBtn icon="tabler-arrow-big-right-lines" @click="nextPageG"
                    :disabled="(currentPageG * itemsPerPage) >= listaBlacklist.length">
                </VBtn>
                </div>
                </VCardItem> 
                <VCardItem v-else>
                Cargando datos...
                </VCardItem>

            </VCard>
        </VCol>

    
    </VRow>

</section>
</template>