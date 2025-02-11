<template>

  <VRow>
    <VCol cols="12" md="12" :lg="12">
      <VCard>
        <VCardItem>
          <div class="d-flex content-title flex-wrap">
            <div class="d-flex gap-3">
              <div class="d-flex flex-column">
                Octoparse
              </div>
            </div>
          </div>
        </VCardItem>
        <VDivider />
        <VCardText>
          <VRow class="mb-4">
            <VCol cols="12" md="12" :lg="12" class="pb-0">
              <div class="w-100 mt-4 d-flex gap-5" style="align-items: center;">
                <VTextField placeholder="Ingrese URL" prepend-inner-icon="tabler-search" density="compact"
                  style="max-width: 300px; padding: 0px 0;" clearable />
                <VBtn target="_blank" color="success" variant="tonal" size="small">
                  <VIcon icon="tabler-rocket" /> Procesar
                </VBtn>
              </div>
            </VCol>

          </VRow>

          <div class="cont" style="position: relative;">
            <VBtn style="position: absolute; right: 0;" @click="copiarContenido" :class="{ 'active': copied, 'copiado-5s': copied && timedOut }" :icon="copied ? 'tabler-copy-check' : 'tabler-copy'"  variant="text" :color="copied ? 'success' : 'secondary'" />
            <pre>{{ data }}</pre>

          </div>

          
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
  <div>




  </div>
</template>


<style>
pre {

  background-color: #141414;
  padding: 10px;
  border-radius: 5px;
  overflow-x: auto;
}


</style>


<script setup>
let timedOut = false;
const copied = ref(false);
const data = ref(`
{
  "title": "Jorge Hernández",
  "link": "https://www.ecuavisa.com/autores-ecuavisa/jorge-hernandez-LY7155490",
  "guid": {
      "isPermaLink": "false",
      "__text": "0fa9c51d-57bb-4682-af8a-43e53a9590db"
  },
  "pubDate": "Fri, 01 Mar 2024 19:10:00 GMT",
  "source": {
      "url": "https://www.ecuavisa.com/rss/getautores",
      "__text": "Ecuavisa"
  },
  "description": {
      "readingtime": "8",
      "__text": "medio ambiente para medios nacionales e internacionales"
  },
  "content": {
      "medium": "image",
      "url": "https://www.ecuavisa.com/binrepository/jorge-andre-hernandez-763024-20221230_1472778_20240412141349.png",
      "title": "Community Manager"
}
      `
);


// función para copiar contenido al portapapeles
function copiarContenido() {
  navigator.clipboard.writeText(data.value);
  console.log('contenido copiado');
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
    timedOut = true;
  }, 3000); // esperar 5 segundos
}
</script>
