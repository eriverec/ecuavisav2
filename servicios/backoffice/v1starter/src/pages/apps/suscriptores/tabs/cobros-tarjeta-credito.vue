<template>
    <div>
        <VCardTitle class="pt-4 pl-6">Montos cobrados por tipo de tarjeta</VCardTitle>
        <div class="text-center py-3" v-if="isLoading">Cargando...</div>
        <VTable  v-else hover="true">
            <thead>
                <tr>
                    <th>Tipo de Tarjeta</th>
                    <th>Suma de Montos</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(monto, tipo) in montosPorTarjeta" :key="tipo">
                    <td>{{ tipo }}</td>
                    <td>{{ monto }}</td>
                </tr>
            </tbody>
        </VTable>
    </div>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const isLoading = ref(true);
const montosPorTarjeta = ref({});

onMounted(async () => {
    try {
        const response = await axios.get('https://api-configuracion.vercel.app/web/suscriptores-conf');
        const data = response.data.result;

        // Calcular la suma de montos por tipo de tarjeta
        const montos = {};
        data.forEach((item) => {
            const tipo = item['Tipo de Tarjeta'];
            const monto = parseFloat(item['Monto']);
            if (!isNaN(monto)) {
                if (!montos[tipo]) {
                    montos[tipo] = 0;
                }
                montos[tipo] += monto;
            }
        });

        montosPorTarjeta.value = montos;
        isLoading.value = false;
    } catch (error) {
        console.error('Error al obtener datos del API', error);
        isLoading.value = false;
    }
});
</script>
  