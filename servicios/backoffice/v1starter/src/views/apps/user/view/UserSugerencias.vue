<script setup>
import { onMounted } from "vue";

const dataSugerencias = ref([]);
const route = useRoute();

async function fetchSugerencias() {
    await fetch(`https://sugerencias-ecuavisa.vercel.app/all?userId=${route.params.id}`)
      .then(response => response.json())
      .then(resp => {       
        let dataRaw = resp.data;
        let dataSug = Array.from(resp.dataSugerenciasSeguido);
        const finalArray = [];
        for(let i in dataSug){
            let match = dataRaw.find(a => {return a._id == dataSug[i].sugerenciaId});
            finalArray.push(match);
        }
        dataSugerencias.value = finalArray;  
      });
};
onMounted(fetchSugerencias);


</script>

<template>
  
    <VCol cols="6">
      <!-- 👉 Activity timeline -->
      <VCard  title="Sugerencias del usuario"  >
        <VCardText>
          <VTable v-if="dataSugerencias.length" class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>             
                <th scope="col">Título</th>


              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in dataSugerencias"              
                style="height: 3.75rem"
              >
                <!-- 👉 User -->
                <td>
                {{ item.title }}
                </td>
              </tr>
            </tbody>
            
          </VTable>
          <div v-if="!dataSugerencias.length">No hay sugerencias que mostrar.</div>
        </VCardText>
      </VCard>
    </VCol>
    <!--
    <VCol cols="12">
      <UserInvoiceTable />
    </VCol>
     -->

</template>
