<script setup>
import { onMounted } from 'vue';

const estadoSend = ref(false);
const estado = ref(false);
const titulo = ref('');
const router = useRouter();
const isError = ref(false);
async function configPlayer(){
    if(titulo.value == '') return isError.value = true;
    
   var raw = JSON.stringify({
                "titulo": titulo.value,
                "estadoActivo": estado.value
            });
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw
            };
            await fetch("https://estadisticas.ecuavisa.com/sites/gestor/Tools/envivo/configprocess.php", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
            await getConfig();
    
}

const authorizedCheck = () => {
    let rol = localStorage.getItem('role');
    if(rol !== 'administrador' && rol !== 'webmaster'){
        router.push({ path: '/pages/errors/not-authorized' })
    }
}
onMounted(() => { 
    authorizedCheck(); 
    getConfig(); 
});

async function getConfig(){
    var xhr = new XMLHttpRequest();
            
            var url = "https://estadisticas.ecuavisa.com/sites/gestor/Tools/envivo/getforcedplayer.php";
            xhr.open("GET", url, true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var datoJson = JSON.parse(xhr.responseText);
                    estadoSend.value = datoJson.estadoActivo;
                    estado.value = datoJson.estadoActivo;           
                }
            };
            xhr.send();
}

</script>

<template>
  <VCard class="mt-5" title="Player Forzado">	
									
  			<VCardText class="py-4 gap-0 w-100">	
                <VRow>
                    <VSnackbar
                    v-model="isError"
                    color="error"
                    transition="scale-transition"
                    location="top center"
                    >
                    <h3>Se necesita un título</h3>
                    </VSnackbar>
                    <VCol cols="12" style="display: flex; flex-wrap: wrap; align-items: center;">
				
			      <div style="width: 325px; margin-top: 1rem; margin-bottom: 1rem;">
			          <VTextField
			            v-model="titulo"
			            placeholder="Escriba el título..."
			            class="ms-0 me-1 chat-list-search"
			          >
			          </VTextField>
                    </div>
                    <div style="display: flex; margin: 1rem;">
                     <div>
                      <VSwitch
                        v-model="estadoSend"
                        color="success"
                        :label="estadoSend == true ? 'Activo' : 'Inactivo'"
                       />
                    </div>
                    <div style="margin-left: 2rem;">
                       <VBtn
												color="primary"
												@click="configPlayer"
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
                    <VChip :color="estado == true ? 'success' : 'warning'" class="mr-4" >{{ estado == true ? 'Activo' : 'Inactivo' }} </VChip>
                     </div>    
                  
            </VCol>
                </VRow>
		    </VCardText>

  </VCard>
</template>



