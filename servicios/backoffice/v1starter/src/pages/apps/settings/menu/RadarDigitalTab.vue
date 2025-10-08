<style scoped>
.text-h6 {
  font-size: 1.05rem !important;
}
</style>

<template>
    <VWindowItem value="tab-radar-digital">
        <div class=" py-5 gap-4 align-items-center">   
            <VCardTitle >Configura el radar digital </VCardTitle>
            <VCardSubtitle> Escoge el ítem que deseas configurar, apagar el radar o forzar el procesamiento de artículos </VCardSubtitle>
        </div>
        <!-- content here -->
        <VRow>
            <VCol cols="12" lg="10" class="mx-auto my-8 align-items-center" >
                <VRow>
                    <VCol cols="12" md="6" >
                        <VCard  flat  border class="py-0">
                            <VCardText class="text-center pb-3 pt-5">
                                <VAvatar rounded size="70" color="primary" variant="tonal" class="p-5 mb-2" >
                                    <VIcon icon="tabler-radar"  size="45" />
                                </VAvatar>
                                <h6 class="text-h6 my-3 mb-0">
                                    Radar Digital
                                </h6>
                                    <!-- Dialog Activator -->

                                    <div class="d-flex align-center flex-column">
                                        <VSwitch
                                            @change="changeStatusRadar"
                                            v-model="insetSwitch1"
                                            inset
                                            :loading="disabledAndLoadingSwitch"
                                            :disabled="disabledAndLoadingSwitch"
                                            class="py-0"
                                            style="margin-bottom: -7px;"
                                        />
                                        <small class="d-flex justify-center gap-2" style="line-height: 2;">
                                            Estado actual del radar: 
                                            <VChip color="primary" v-if="insetSwitch1.toString() == 'true'">
                                                Encendido
                                            </VChip>
                                            <VChip color="error" v-else>
                                                Apagado
                                            </VChip>
                                        </small>
                                    </div>
                            </VCardText>
                        </VCard>
                    </VCol>
                    <VCol cols="12" md="6" >
                        <VCard  flat  border >
                            <VCardText class="text-center pt-3 pb-4">
                                <VAvatar rounded size="70" color="primary" variant="tonal" class="p-5 mb-2" >
                                    <VIcon icon="tabler-file-symlink"  size="45" />
                                </VAvatar>
                                <h6 class="text-h6 my-3 d-flex align-center flex-column">
                                    Forzar actualización de artículos
                                    <small class="text-center" style="line-height: 1.2;color:#666">
                                        <VCardSubtitle>
                                            Artículos faltantes: <span>{{ detailsArticlesAll.data.numSinFechaPublicacion.length }}</span>
                                        </VCardSubtitle>
                                    </small>
                                </h6>
                                
                                <!-- <p>mas info</p> -->
                                <VBtn 
                                    :disabled="detailsBtn.disabled"
                                    :loading="detailsBtn.loading"
                                    @click="forceUpdate()" size="small" variant="tonal" >
                                    Forzar actualización
                                </VBtn>
                                
                                <VAlert
                                    class="mt-4"
                                    variant="tonal"
                                    :type="detailsBtn.alert.type"
                                    v-if="detailsBtn.alert.show"
                                >
                                    {{ detailsBtn.alert.message }}
                                </VAlert>
                            </VCardText>
                        </VCard>
                    </VCol>
                </VRow>
            </VCol>
        </VRow>
    </VWindowItem>
</template>

<script setup>
    const insetSwitch1 = ref(true);
    const disabledAndLoadingSwitch = ref(false);

    const fetchRadar = async (url, options = {}) => {
        try {
            disabledAndLoadingSwitch.value = true;
            const res = await fetch(url, options);
            const data = await res.json();
            return data;
        } catch (error) {
            console.error(error.message);
            return null;
        } finally {
            disabledAndLoadingSwitch.value = false;
        }
    };

    const getStatusRadar = () => fetchRadar(`https://services.ecuavisa.com/gestor/competencias/scrappin/dinamico/view-status-radar.php`);

    const setStatusRadar = (estado) => fetchRadar(`https://services.ecuavisa.com/gestor/competencias/scrappin/dinamico/main-switch.php`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
    });

    // watch(insetSwitch1, async (newVal, oldVal) => {
    //   if (newVal != null) {
    //     const resp = await setStatusRadar(newVal.toString());
    //     if (!resp?.resp) insetSwitch1.value = !newVal;
    //   }
    // });

    const changeStatusRadar = async () => {
        try {
            const valor = insetSwitch1.value.toString();
            const resp = await setStatusRadar(valor);
            if (!resp?.resp){
                insetSwitch1.value = !valor;
                alert(resp?.message || "Ocurrió un error al intentar editar");
            };
        } catch (e) {
            alert("Ocurrió un error al intentar editar")
            return false;
        }
    }

    //Lógica para el botón de forzar actualización
    const detailsBtn = ref({
        disabled: false,
        loading: false,
        alert: {
            type: "success",
            message: "",
            show: false
        }
    });

    const detailsArticlesAll = ref({
        data: {
            all: [],
            numFechaPublicacion: 0,
            numSinFechaPublicacion: 0
        },
        loading: false,
        lastUpdate: "",
        alert: {
            type: "success",
            message: "",
            show: false
        }
    });

    function agruparPorAtributo(data, atributo) {
        if(!atributo){
            return [];
        }

        return data.reduce((agrupado, item) => {
            const valor = item[atributo] || "";
            if (!agrupado[valor]) {
                agrupado[valor] = [];
            }
            agrupado[valor].push(item);
            return agrupado;
        }, {});
    }

    const getArticlesAllRadar = async function () {
        try {
            detailsArticlesAll.value.loading = true;

            const endpoints = "https://services.ecuavisa.com/gestor/competencias/scrappin/dinamico/config.php?api=all";
            const response = await fetch(endpoints);
            const data = await response.json();

            if(!response.ok){
                detailsArticlesAll.value.alert.message = data.message || "Ocurrió un error al intentar forzar la actualización";
                detailsArticlesAll.value.alert.type = "error";
                return false;
            }

            const allResults = [];

            for(var i in data){
                if(data[i]?.articles){
                    for(var j in data[i].articles){
                        if(!data[i]?.articles[j].hasOwnProperty("getArticle") && data[i]?.articles[j].category != "Rd Mundo" && data[i]?.articles[j].seccion != "metadatos"){
                            allResults.push(data[i].articles[j]);
                        }
                    }
                }
            }

            detailsArticlesAll.value.data.all = allResults;
            detailsArticlesAll.value.data.numFechaPublicacion = allResults.filter(e => {
                const { fechaPublicacion = "", title = "" } = e;
                return fechaPublicacion != "" && title != "";
            }).length;
            detailsArticlesAll.value.data.numSinFechaPublicacion = allResults.filter(e => {
                const { fechaPublicacion = "", title = "" } = e;
                return fechaPublicacion == "" && title == "";
            });

            console.log(detailsArticlesAll.value.data.numSinFechaPublicacion)
            return true;
        } catch (error) {
            console.log(error)
            return null;
        }finally{
            detailsArticlesAll.value.loading = false;
        }
    }

    const forceUpdate = async () => {
        detailsBtn.value.disabled = true;
        detailsBtn.value.loading = true;
        try {
            const urlEndpoint = "https://services.ecuavisa.com/gestor/competencias/scrappin/dinamico/procesar_articulos.php";
            
            const response = await fetch(urlEndpoint);
            const data = await response.json();

            if(!response.ok){
                detailsBtn.value.alert.message = data.message || "Ocurrió un error al intentar forzar la actualización";
                detailsBtn.value.alert.type = "error";
                return false;
            }

            if(data && !Array.isArray(data)){
                //Si data no es un array
                const { mensaje = null } = data;
                if(mensaje){
                    detailsBtn.value.alert.message = "No existen artículos por procesar";
                    detailsBtn.value.alert.type = "info";
                    await getArticlesAllRadar();
                    return true;
                }
            }

            detailsBtn.value.alert.message = "Actualización forzada correctamente";
            detailsBtn.value.alert.type = "success";
            await getArticlesAllRadar();
            return true;
            
        } catch (error) {
            detailsBtn.value.alert.message = "Ocurrió un error al intentar forzar la actualización: " + error.message;
            detailsBtn.value.alert.type = "error";
            console.log(error);
            return false;
        } finally {
            detailsBtn.value.disabled = false;
            detailsBtn.value.loading = false;
            detailsBtn.value.alert.show = true;
            setTimeout(() => {
                detailsBtn.value.alert.show = false;
            }, 5000);
        }
    }

    onMounted(async () => {
        const status = await getStatusRadar();
        await getArticlesAllRadar();
        insetSwitch1.value = status?.run ?? true;
        
    });
</script>						