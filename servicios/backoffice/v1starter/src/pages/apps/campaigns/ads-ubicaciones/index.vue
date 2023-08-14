<script setup>
const currentTab = ref('tab-desktop');
const currentTabDesktop = ref('fullBanner');

// -------------------- DESKTOP -------------
const openDesktop = ref([
    "tradicionales", "richMobile"
]);

const desktopTradicionales = [
    {
        title: "Full Banner (Top 1)",
        value: "fullBanner"
    },
    {
        title:"Full Banner (Top 2)",
        value: "adbox"
    },
    {
        title: "Full Banner (Top 3)",
        value: "takeover"
    },
    {
        title: "Floating | Layer",
        value: "zocalo"
    } 
]

/*const desktopRichMedia = [
    {
        title:"Tab",
        value: "tab"
    },
    {
        title: "Push",
        value: "push"
    },
    {
        title: "Super Toma",
        value: "superToma"
    },
    {
        title: "Half Formulario",
        value: "halfFormulario"
    },
    {
        title: "RoadBlock Combinado",
        value: "roadblockCombinado"
    },
    {
        title: "Takeover Interactivo Video",
        value: "takeoverInteractivoVideo"
    },
    {
        title:"Top Expandible",
        value:"topExpandible"
    },
    {
        title:"Leader Video",
        value:"leaderVideo"
    } 
]*/

const desktopData = {
    fullBanner : [
        {
            title: "Dispositivos",
            desc: "Desktop"      
        },
        {
            title: "Tamaños",
            desc: "728x90 - 728x250 - 728x180 pxl"      
        },
        {
            title: "Peso",
            desc: "150 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "JPG - PNG - GIF - HTML(GWD) - TAG"      
        }
    ],
    adbox : [
        {
            title: "Dispositivos",
            desc: "Desktop"      
        },
        {
            title: "Tamaños",
            desc: "728x90 - 728x250 - 728x180 pxl"      
        },
        {
            title: "Peso",
            desc: "150 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "JPG - PNG - GIF - HTML(GWD) - TAG"      
        }
    ],
    takeover : [
        {
            title: "Dispositivos",
            desc: "Desktop"      
        },
        {
            title: "Tamaños",
            desc: "728x90 - 728x250 - 728x180 pxl"      
        },
        {
            title: "Peso",
            desc: "150 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "JPG - PNG - GIF - HTML(GWD) - TAG"      
        }
    ],
    zocalo : [
        {
            title: "Dispositivos",
            desc: "Desktop"      
        },
        {
            title: "Tamaños",
            desc: "728X90 - 970X90 pxl"      
        },
        {
            title: "Peso",
            desc: "150 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "JPG - PNG - GIF - HTML(GWD) - TAG"      
        }
    ],
    tab : [
        {
            title: "Dispositivos",
            desc: "Desktop"      
        },
        {
            title: "Tamaños",
            desc: "100x85 px"      
        },
        {
            title: "Peso",
            desc: "100 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "JPG - PNG - GIF"      
        }
    ],
    push : [
        {
            title: "Dispositivos",
            desc: ["Desktop"]      
        },
        {
            title: "Tamaños",
            desc: ['Principal: 900x600 pxl', 'Contraido: 970x90 pxl' ]      
        },
        {
            title: "Peso",
            desc: ["100 Kb(máx)"]      
        },
        {
            title: "Formato",
            desc: ["JPG - GIF"]      
        }
    ],
    superToma : [
        {
            title: "Dispositivos",
            desc: ["Desktop"]      
        },
        {
            title: "Tamaños",
            desc: ["Top: 970x90px","Skin: 1500x2100px"]     
        },
        {
            title: "Peso",
            desc: ["100 Kb(máx)"]      
        },
        {
            title: "Formato",
            desc: ["JPG - PNG - GIF"]      
        }
    ],
    halfFormulario : [
        {
            title: "Dispositivos",
            desc: "Desktop"      
        },
        {
            title: "Tamaños",
            desc: "300x600px o 300x250px"      
        },
        {
            title: "Peso",
            desc: "100 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "PSD o AI"      
        }
    ],
    roadBlockCombinado : [
        {
            title: "Dispositivos",
            desc: ["Desktop"]      
        },
        {
            title: "Tamaños",
            desc: ["Top: 970x90px","Middle: 300x600 px"]     
        },
        {
            title: "Peso",
            desc: ["100 Kb(máx)"]      
        },
        {
            title: "Formato",
            desc: ["JPG"]      
        }
    ],
    takeoverInteractivo : [
        {
            title: "Dispositivos",
            desc: ["Desktop"]      
        },
        {
            title: "Tamaños",
            desc: ["900x600 px","Vídeos alojados en Youtube duración menor a 15 seg"]     
        },
        {
            title: "Peso",
            desc: ["100 Kb(máx)"]      
        },
        {
            title: "Formato",
            desc: ["JPG - URL Youtube"]      
        }
    ],
    topExpandible : [
        {
            title: "Dispositivos",
            desc: ["Desktop"]      
        },
        {
            title: "Tamaños",
            desc: ["Contraído: 970x90px","Expandido backup: 970x250px"]     
        },
        {
            title: "Peso",
            desc: ["100 Kb(máx)"]      
        },
        {
            title: "Formato",
            desc: ["JPG - Video como URL con peso inferior a 5 Mb"]      
        }
    ],
    leaderVideo : [
        {
            title: "Dispositivos",
            desc: "Desktop"      
        },
        {
            title: "Tamaños",
            desc: "Top: 970x250 px"      
        },
        {
            title: "Peso",
            desc: "150 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "JPG - URL Youtube"      
        }
    ],
}

const changeTabDesktop = (item) =>{
    currentTabDesktop.value = item;
}

// -------------------- MOBILE -------------
const currentTabMobile = ref('fullBanner');

const openMobile = ref([
    "tradicionales", "richMobile"
]);
const mobileTradicionales = [
{
        title: "Full Banner (Top 1)",
        value: "fullBanner"
    },
    {
        title:"Full Banner (Top 2)",
        value: "adbox"
    },
    {
        title: "Full Banner (Top 2)",
        value: "takeover"
    }
    ,
    {
       title: "Layer | Floating | Takeover",
        value: "zocalo"
    }  
]

const mobileRichMedia = [
    /*{
       title:"Push",
       value:"push"
   },
    {
        title:"Half Formulario",
        value:"halfFormulario"
    },
    {
        title:"Takeover Interactivo Video",
        value:"takeoverInteractivoVideo"
    },
    {
        title:"Inpage Expandible a Intersitial",
        value:"inpageExpandibleIntersitial"
    },
    {
        title:"Video Parallax",
        value:"videoParallax"
    },
    {
        title:"Takeover Interactivo",
        value:"takeoverInteractivo"
    },*/
    {
        title:"Parallax",
        value:"parallax"
    } 
]

const mobileData = {
    fullBanner : [
        {
            title: "Dispositivos",
            desc: "Mobile"      
        },
        {
            title: "Tamaños",
            desc: "300x50 - 300x100 - 320x50 - 320x100 px"      
        },
        {
            title: "Peso",
            desc: "150 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "PNG - GIF - JPG - MP4 - HTML - TAG"      
        }
    ], 
    adbox : [
        {
            title: "Dispositivos",
            desc: "Mobile"      
        },
        {
            title: "Tamaños",
            desc: "300x50 - 300x100 - 320x50 - 320x100 px"      
        },
        {
            title: "Peso",
            desc: "150 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "PNG - GIF - JPG - MP4 - HTML - TAG"      
        }
    ], 
    takeover : [
        {
            title: "Dispositivos",
            desc: "Mobile"      
        },
        {
            title: "Tamaños",
            desc: "300x50 - 300x100 - 320x50 - 320x100 px"      
        },
        {
            title: "Peso",
            desc: "150 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "PNG - GIF - JPG - MP4"      
        }
    ], 
    zocalo : [
        {
            title: "Dispositivos",
            desc: "Mobile"      
        },
        {
            title: "Tamaños",
            desc: "300x50 - 300x100 - 320x50 - 320x100 px"      
        },
        {
            title: "Peso",
            desc: "150 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "PNG - GIF - JPG - MP4 - HTML - TAG"      
        }
    ], 
    push : [
        {
            title: "Dispositivos",
            desc: ["Mobile"]      
        },
        {
            title: "Tamaños",
            desc: ['Principal: 320x480 px', 'Contraido: 320x100 px' ]      
        },
        {
            title: "Peso",
            desc: ["100 Kb(máx)"]      
        },
        {
            title: "Formato",
            desc: ["JPG - GIF"]      
        }
    ],
    halfFormulario : [
        {
            title: "Dispositivos",
            desc: "Mobile"      
        },
        {
            title: "Tamaños",
            desc: "300x600px o 300x250px"      
        },
        {
            title: "Peso",
            desc: "100 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "PSD o AI"      
        }
    ],
    takeoverInteractivoVideo : [
        {
            title: "Dispositivos",
            desc: ["Mobile"]      
        },
        {
            title: "Tamaños",
            desc: ['320x480 px', 'Vídeos alojados en Youtube duración menor a 15 seg' ]      
        },
        {
            title: "Peso",
            desc: ["100 Kb(máx)"]      
        },
        {
            title: "Formato",
            desc: ["JPG - URL Youtube"]      
        }
    ], 
    inpageExpandible : [
        {
            title: "Dispositivos",
            desc: ["Mobile"]      
        },
        {
            title: "Tamaños",
            desc: ['Contraído: 300x250 px', 'Expandido: 330x600 px' ]      
        },
        {
            title: "Peso",
            desc: ["100 Kb(máx)"]      
        },
        {
            title: "Formato",
            desc: ["PNG, GIF y JPG"]      
        }
    ], 
    videoParallax : [
        {
            title: "Dispositivos",
            desc: ["Mobile"]      
        },
        {
            title: "Tamaños",
            desc: ['Versión Recomendada: Video de ratio 9:16 - duración máxima 15', 'Versión alterna: Video de ratio 16:9 - duración máximo de 15 seg.' ]      
        },
        {
            title: "Peso",
            desc: ["3 Mb(máx)"]      
        },
        {
            title: "Formato",
            desc: ["PNG, GIF y JPG"]      
        }
    ], 
    takeoverInteractivo : [
        {
            title: "Dispositivos",
            desc: "Mobile"      
        },
        {
            title: "Tamaños",
            desc: "350x600 px"      
        },
        {
            title: "Peso",
            desc: "100 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "PSD o AI"      
        }
    ],
    parallax : [
        {
            title: "Dispositivos",
            desc: "Mobile"      
        },
        {
            title: "Tamaños",
            desc: "Box de 315x720px o 300x600px"      
        },
        {
            title: "Peso",
            desc: "100 Kb(máx)"      
        },
        {
            title: "Formato",
            desc: "JPG - GIF"      
        }
    ],
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
                            
                            <VListGroup value="tradicionales">
                            <template #activator="{ props }">
                                <VListItem
                                v-bind="props"
                                
                                >
                                <h3>Tradicionales</h3>
                                </VListItem>
                            </template>
                            <VListItem   
                                v-for="item, i in desktopTradicionales"
                                :key="i"
                                :value="item.value"
                                :title="item.title"
                                @click="changeTabDesktop(item.value)"
                                />
                            </VListGroup>  

                           <!-- <VListGroup value="richMedia">
                                <template #activator="{ props }">
                                <VListItem
                                    v-bind="props"
                                >
                                <h3>Rich Media</h3>
                                </VListItem>
                                </template>
                                <VListItem 
                                v-for="item, i in desktopRichMedia"
                                :key="i"
                                :value="item.value"
                                :title="item.title"
                                @click="changeTabDesktop(item.value)"
                                />
                            </VListGroup>-->
                        </VList>
                    </VCol>

                    <VCol cols="9" md="9" lg="9">
                        <VWindow v-model="currentTabDesktop">
                            <VWindowItem value="fullBanner" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="1/1"
                                        cover
                                        src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos/Posiciones/top1.png"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in desktopData.fullBanner"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>  
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/noticias/ecuador/remdesivir-muestra-efecto-claro-contra-covid-19-segun-estudio-CKEC595676?demo=fullbanner"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem> 
                            <VWindowItem value="adbox" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos/Posiciones/top2.png"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in desktopData.adbox"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>  
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/entretenimiento/victoria-beckham-criticada-pedir-ayuda-del-gobierno-AKEC595476?demo=adbox"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>             
                                </Vcol>
                            </div>
                            </VWindowItem>     
                            <VWindowItem value="takeover" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos/Posiciones/top3.png"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in desktopData.takeover"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>     
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/?demo=takeover"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>         
                                </Vcol>
                            </div>
                            </VWindowItem>    
                            <VWindowItem value="zocalo" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos/Posiciones/floating.png"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in desktopData.zocalo"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>      
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/estadio?demo=zocalo"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem> 
                            <VWindowItem value="tab" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in desktopData.tab"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>      
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/?demo=tab"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem>    
                            <VWindowItem value="push" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in desktopData.push"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>

                                    <div v-if="item.desc.length > 1">
                                        <p>{{ item.desc[0] }}</p>
                                        <p>{{ item.desc[1] }}</p>
                                    </div>
                                    <div v-else>
                                        <p>{{ item.desc[0] }}</p>
                                    </div>

                                    <VDivider v-if="i!==3" />
                                    </VListItem>      
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/estadio?demo=push"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem>    
                            <VWindowItem value="superToma" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in desktopData.superToma"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>

                                    <div v-if="item.desc.length > 1">
                                        <p>{{ item.desc[0] }}</p>
                                        <p>{{ item.desc[1] }}</p>
                                    </div>
                                    <div v-else>
                                        <p>{{ item.desc[0] }}</p>
                                    </div>

                                    <VDivider v-if="i!==3" />
                                    </VListItem>      
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/?demo=super-toma"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem>   
                            <VWindowItem value="halfFormulario" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in desktopData.halfFormulario"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>      
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/noticias?demo=half-formulario"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem>    
                            <VWindowItem value="roadblockCombinado" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in desktopData.roadBlockCombinado"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>

                                    <div v-if="item.desc.length > 1">
                                        <p>{{ item.desc[0] }}</p>
                                        <p>{{ item.desc[1] }}</p>
                                    </div>
                                    <div v-else>
                                        <p>{{ item.desc[0] }}</p>
                                    </div>

                                    <VDivider v-if="i!==3" />
                                    </VListItem>      
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/entretenimiento/lady-gaga-maluma-otras-estrellas-daran-concierto-LLEC587491?demo=pyccajul2019"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem> 
                            <VWindowItem value="takeoverInteractivoVideo" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in desktopData.takeoverInteractivo"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>

                                    <div v-if="item.desc.length > 1">
                                        <p>{{ item.desc[0] }}</p>
                                        <p>{{ item.desc[1] }}</p>
                                    </div>
                                    <div v-else>
                                        <p>{{ item.desc[0] }}</p>
                                    </div>

                                    <VDivider v-if="i!==3" />
                                    </VListItem>      
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/entretenimiento?demo=takeover-interactivo-video"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem>  
                            <VWindowItem value="topExpandible" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in desktopData.topExpandible"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>

                                    <div v-if="item.desc.length > 1">
                                        <p>{{ item.desc[0] }}</p>
                                        <p>{{ item.desc[1] }}</p>
                                    </div>
                                    <div v-else>
                                        <p>{{ item.desc[0] }}</p>
                                    </div>

                                    <VDivider v-if="i!==3" />
                                    </VListItem>      
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/entretenimiento/jk-rowling-autora-harry-potter-asegura-haberse-JLEC587961?demo=top_expand-video"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem> 
                            <VWindowItem value="leaderVideo" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in desktopData.leaderVideo"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>      
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/entretenimiento?demo=leader-video"
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

            <!----------------------- TAB MOBILE -------------------------->

              <VWindowItem value="tab-mobile">
                <VRow class="d-flex flex-wrap">
                    <VCol cols="3" md="3" lg="3">
                        <VList v-model="openMobile">
                            
                            <VListGroup value="tradicionales">
                            <template #activator="{ props }">
                                <VListItem
                                v-bind="props"  
                                >
                                <h3>Tradicionales</h3>
                                </VListItem>
                            </template>
                            <VListItem   
                                v-for="item, i in mobileTradicionales"
                                :key="i"
                                :value="item.value"
                                :title="item.title"
                                @click="changeTabMobile(item.value)"
                                />
                            </VListGroup>  

                           <!-- <VListGroup value="richMedia">
                                <template #activator="{ props }">
                                <VListItem
                                    v-bind="props"
                                >
                                <h3>Rich Media</h3>
                                </VListItem>
                                </template>
                                <VListItem 
                                v-for="item, i in mobileRichMedia"
                                :key="i"
                                :value="item.value"
                                :title="item.title"
                                @click="changeTabMobile(item.value)"
                                />
                            </VListGroup>-->
                        </VList>
                    </VCol>

                    <VCol cols="9" md="9" lg="9">
                        <VWindow v-model="currentTabMobile">
                            <VWindowItem value="fullBanner" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos/Posiciones/top1-m.png"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in mobileData.fullBanner"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>  
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/noticias/ecuador/remdesivir-muestra-efecto-claro-contra-covid-19-segun-estudio-CKEC595676?demo=fullbanner"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem> 

                            <VWindowItem value="adbox" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos/Posiciones/top2-m.png"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in mobileData.adbox"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>  
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/noticias?demo=adbox"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem> 

                            <VWindowItem value="takeover" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos/Posiciones/top3-m.png"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in mobileData.takeover"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>  
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/?demo=takeover"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem>

                            <VWindowItem value="zocalo" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="1/1"
                                        cover
                                        src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos/Posiciones/m-floating.png"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in mobileData.zocalo"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>  
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/estadio?demo=zocalo"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem>

                            <VWindowItem value="push" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in mobileData.push"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>

                                    <div v-if="item.desc.length > 1">
                                        <p>{{ item.desc[0] }}</p>
                                        <p>{{ item.desc[1] }}</p>
                                    </div>
                                    <div v-else>
                                        <p>{{ item.desc[0] }}</p>
                                    </div>

                                    <VDivider v-if="i!==3" />
                                    </VListItem>      
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/estadio?demo=push"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem>   

                            <VWindowItem value="halfFormulario" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in mobileData.halfFormulario"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>  
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/noticias?demo=half-formulario"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem>
                            
                            <VWindowItem value="takeoverInteractivoVideo" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in mobileData.takeoverInteractivoVideo"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>

                                    <div v-if="item.desc.length > 1">
                                        <p>{{ item.desc[0] }}</p>
                                        <p>{{ item.desc[1] }}</p>
                                    </div>
                                    <div v-else>
                                        <p>{{ item.desc[0] }}</p>
                                    </div>

                                    <VDivider v-if="i!==3" />
                                    </VListItem>      
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/entretenimiento?demo=takeover-interactivo-video"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem>  

                            <VWindowItem value="inpageExpandibleIntersitial" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in mobileData.inpageExpandible"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>

                                    <div v-if="item.desc.length > 1">
                                        <p>{{ item.desc[0] }}</p>
                                        <p>{{ item.desc[1] }}</p>
                                    </div>
                                    <div v-else>
                                        <p>{{ item.desc[0] }}</p>
                                    </div>

                                    <VDivider v-if="i!==3" />
                                    </VListItem>      
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/entretenimiento?demo=inpage-expandible"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem>

                            <VWindowItem value="videoParallax" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in mobileData.videoParallax"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>

                                    <div v-if="item.desc.length > 1">
                                        <p>{{ item.desc[0] }}</p>
                                        <p>{{ item.desc[1] }}</p>
                                    </div>
                                    <div v-else>
                                        <p>{{ item.desc[0] }}</p>
                                    </div>

                                    <VDivider v-if="i!==3" />
                                    </VListItem>      
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/entretenimiento/muere-coronavirus-actor-saga-star-wars-PLEC585921?demo=Parallax-video"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem>

                            <VWindowItem value="takeoverInteractivo" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in mobileData.takeoverInteractivo"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>  
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/?demo=takeover-interactivo"
                                    target="_blank"
                                    >Ver demo
                                    </VBtn>   
                                    </div>        
                                </Vcol>
                            </div>
                            </VWindowItem>

                            <VWindowItem value="parallax" >
                                <div style="padding-left: 5%;" class="d-flex flex-wrap gap-10">
                                <Vcol cols="4" md="4" lg="4">
                                    <VImg
                                        :width="500"
                                        aspect-ratio="16/9"
                                        cover
                                        src="https://estadisticas.ecuavisa.com/sites/gestor/Recursos/Posiciones/m-parallax.png"
                                    ></VImg>  
                                </Vcol>
                                <Vcol style="width: 400px;" cols="5" md="5" lg="5">
                                    <VListItem 
                                        v-for="item, i  in mobileData.parallax"
                                    >
                                    <p><h3>{{ item.title }}</h3></p>
                                    <p>{{ item.desc }}</p>
                                    <VDivider v-if="i!==3" />
                                    </VListItem>  
                                    <div class="text-center">
                                    <VBtn
                                    href="https://www.ecuavisa.com/entretenimiento/kylie-jenner-vuelve-ser-multimillonaria-mas-joven-del-CLEC588381?demo=parallax"
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


