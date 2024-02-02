<script setup>
    const isDialogDateRange = ref(false);
    const obtenerFechaDispositivos = function (selectedDates, dateStr, instance){
        //var respJson = await nuevoArchivoJson(archivoJson);
        if(selectedDates.length > 1){
          alert()
        }
      }
</script>
<template>
    <VDialog v-model="isDialogDateRange" persistent max-width="600">
        <!-- Dialog Activator -->
        <template #activator="{ props }">
          <VBtn v-bind="props" style="display: none;">
            Open Dialog
          </VBtn>
        </template>

        <!-- Dialog close btn -->
        <DialogCloseBtn @click="isDialogDateRange = !isDialogDateRange" />

        <!-- Dialog Content -->
        <VCard title="User Profile">
          <VCardText>
            <VRow>
              <VCol cols="12" sm="12" md="3" >
                <div class="space-divider">
                    <VBtn variant="text" block class="text-left">
                      Hoy
                    </VBtn>
                    <VBtn variant="text" block>
                      Ayer
                    </VBtn>
                    <VBtn variant="text" block>
                      Hace 7 días
                    </VBtn>
                    <VBtn variant="text" block>
                      Este mes
                    </VBtn>
                    <VBtn variant="text" block>
                      El mes pasado
                    </VBtn>
                </div>
              </VCol>
              <VCol cols="12" sm="12" md="9" >
                
                <AppDateTimePicker
                  prepend-inner-icon="tabler-calendar"
                  @on-change="obtenerFechaDispositivos"
                  :config="{ 
                    inline: true,
                    mode:'range',
                    altFormat: 'F j, Y',
                    dateFormat: 'm-d-Y',
                    maxDate: new Date()
                  }"
                />
              </VCol>
              <VCol cols="12" sm="12" md="12">
                
              </VCol>
            </VRow>
          </VCardText>

          <VCardText class="d-flex justify-end flex-wrap gap-3">
            <VBtn
              variant="tonal"
              color="secondary"
              @click="isDialogVisible = false"
            >
              Close
            </VBtn>
            <VBtn @click="isDialogVisible = false">
              Save
            </VBtn>
          </VCardText>
        </VCard>
  </VDialog>
</template>