<script setup>
import { onMounted } from "vue";

const dataIntereses = ref([]);
const route = useRoute();

async function fetchIntereses() {
    await fetch(`https://sugerencias-ecuavisa.vercel.app/interes/all?userId=${route.params.id}`)
      .then(response => response.json())
      .then(resp => {       
        let dataRaw = resp.data;
        let dataInt = Array.from(resp.dataInteresSeguido);
        const finalArray = [];
        for(let i in dataInt){
            let match = dataRaw.find(a => {return a.interesId == dataInt[i].interesId});
            finalArray.push(match);
        }
        dataIntereses.value = finalArray;  

      });
};
onMounted(fetchIntereses);


</script>

<template>

    <VCol cols="6">
      <!-- 👉 Activity timeline -->
      <VCard  title="Intereses del usuario"  >
        <VCardText>
          <VTable v-if="dataIntereses.length" class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>             
                <th scope="col">Título</th>


              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in dataIntereses"              
                style="height: 3.75rem"
              >
                <!-- 👉 User -->
                <td>
                {{ item.title }}
                </td>
              </tr>
            </tbody>
            
          </VTable>
          <div v-if="!dataIntereses.length">No hay intereses que mostrar.</div>
        </VCardText>
      </VCard>
    </VCol>
    <!--
    <VCol cols="12">
      <UserInvoiceTable />
    </VCol>
     -->

</template>
