<script setup>
const currentTab = ref('tab-desktop');

// ----- DESKTOP --------
const currentTabDesktop = ref('');
const openDesktop = ref([]);
const optionsDesktop = ref([]);
const dataRawDesktop = ref([]);
const dataDesktop = ref([]);

// ----- MOBILE ------------
const currentTabMobile = ref('');
const openMobile = ref([]);
const optionsMobile = ref([]);
const dataRawMobile = ref([]);
const dataMobile = ref([]);


async function getDataDesktop () {
    const consultaDesktop = await fetch('https://configuracion-service.vercel.app/configuracion/adsDesktop');
    const data = await consultaDesktop.json();
    //console.log('data Desktop RAW: ', data);
    const options = Array.from(data.options);
    const dataFull = Array.from(data.data);

    dataRawDesktop.value = data; 
    optionsDesktop.value = options;
    dataDesktop.value = dataFull; 
    openDesktop.value = options.map(item => item.value);
    currentTabDesktop.value = dataFull[0].value;

    //console.log('currentTabDesktop ', currentTabDesktop.value);
}

async function getDataMobile () {
    const consultaMobile = await fetch('https://configuracion-service.vercel.app/configuracion/adsMobile');
    const data = await consultaMobile.json();
    //console.log('data Mobile RAW: ', data);
    const options = Array.from(data.options);
    const dataFull = Array.from(data.data);

    dataRawMobile.value = data; 
    optionsMobile.value = options;
    dataMobile.value = dataFull; 
    openMobile.value = options.map(item => item.value);
    currentTabMobile.value = dataFull[0].value;
    //console.log('currentTabMobile ', currentTabMobile.value);
}


onMounted(async()=>{
    await getDataDesktop();
    await getDataMobile();
});

const changeTabDesktop = (item) =>{
    currentTabDesktop.value = item;
}
const changeTabMobile = (item) =>{
    currentTabMobile.value = item;
}
</script>

<template>
<VRow>
      <VCol class="mt-6" cols="12" md="12" lg="12">

        <VTabs v-model="currentTab" class="v-tabs-pill">
          <VTab value="tab-desktop" >Desktop</VTab>
          <VTab value="tab-mobile" >Mobile</VTab>
        </VTabs>

        <VCard class="mt-5">
          <VCardText>
            <VWindow v-model="currentTab">
              <VWindowItem value="tab-desktop">
                <VRow class="d-flex flex-wrap">
                    <VCol cols="3" md="3" lg="3">
                        <VList v-model="openDesktop">
                            
                            <VListGroup v-for="itemDesktop in optionsDesktop" :value="itemDesktop.value">
                            <template #activator="{ props }">
                                <VListItem
                                v-bind="props"                             
                                >
                                <h3>{{itemDesktop.title}}</h3>
                                </VListItem>
                            </template>
                            <VListItem   
                                v-for="item, i in dataRawDesktop[itemDesktop.value]"
                                :key="i"
                                :value="item.value"
                                :title="item.title"
                                @click="changeTabDesktop(item.value)"
                                />
                            </VListGroup>  
                        </VList>
                    </VCol>
                    <VCol cols="9" md="9" lg="9">
                        <VWindow v-model="currentTabDesktop">
                            <VWindowItem v-for="dataD in dataDesktop" :value="dataD.value" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="1/1"
                                        cover
                                        :src= dataD.data.img
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem>
                                    <p><h3>Dispositivos</h3></p>
                                    <p>{{ dataD.data.Dispositivos }}</p>
                                    <VDivider/>
                                    </VListItem>  
                                    <VListItem>
                                    <p><h3>Tamaños</h3></p>
                                    <p>{{ dataD.data.Tamaños }}</p>
                                    <VDivider/>
                                    </VListItem>  
                                    <VListItem>
                                    <p><h3>Peso</h3></p>
                                    <p>{{ dataD.data.Peso }}</p>
                                    <VDivider/>
                                    </VListItem>  
                                    <VListItem>
                                    <p><h3>Formato</h3></p>
                                    <p>{{ dataD.data.Formato }}</p>
                                
                                    </VListItem> 
                                    <div class="text-center">
                                    <VBtn
                                    :href= dataD.data.demo
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem> 
                        
                        </VWindow>
                    </VCol>    

                </VRow>
              </VWindowItem>       

              <!-------------------     TAB MOBILE  ----------------------->

              <VWindowItem value="tab-mobile">
                <VRow class="d-flex flex-wrap">
                    <VCol cols="3" md="3" lg="3">
                        <VList v-model="openMobile">
                            
                            <VListGroup v-for="itemMobile in optionsMobile" :value="itemMobile.value">
                            <template #activator="{ props }">
                                <VListItem
                                v-bind="props"                             
                                >
                                <h3>{{itemMobile.title}}</h3>
                                </VListItem>
                            </template>
                            <VListItem   
                                v-for="item, i in dataRawMobile[itemMobile.value]"
                                :key="i"
                                :value="item.value"
                                :title="item.title"
                                @click="changeTabMobile(item.value)"
                                />
                            </VListGroup>  
                        </VList>
                    </VCol>
                    <VCol cols="9" md="9" lg="9">
                        <VWindow v-model="currentTabMobile">
                            <VWindowItem v-for="dataM in dataMobile" :value="dataM.value" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="1/1"
                                        cover
                                        :src= dataM.data.img
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem>
                                    <p><h3>Dispositivos</h3></p>
                                    <p>{{ dataM.data.Dispositivos }}</p>
                                    <VDivider/>
                                    </VListItem>  
                                    <VListItem>
                                    <p><h3>Tamaños</h3></p>
                                    <p>{{ dataM.data.Tamaños }}</p>
                                    <VDivider/>
                                    </VListItem>  
                                    <VListItem>
                                    <p><h3>Peso</h3></p>
                                    <p>{{ dataM.data.Peso }}</p>
                                    <VDivider/>
                                    </VListItem>  
                                    <VListItem>
                                    <p><h3>Formato</h3></p>
                                    <p>{{ dataM.data.Formato }}</p>
                                
                                    </VListItem> 
                                    <div class="text-center">
                                    <VBtn
                                    :href= dataM.data.demo
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem> 
                        
                        </VWindow>
                    </VCol>    

                </VRow>
              </VWindowItem>    

            </VWindow>
          </VCardText>
        </VCard>

      </VCol>
    </VRow>
</template>


