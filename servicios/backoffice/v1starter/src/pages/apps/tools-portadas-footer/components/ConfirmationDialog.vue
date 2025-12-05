<template>
  <VDialog
    :model-value="isOpen"
    @update:model-value="$emit('update:isOpen', $event)"
    max-width="500"
    persistent
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="$emit('close')" />

    <VCard class="text-h6" :title="title">
      
      <v-card-text>
        <p class="text-body-1">{{ message }}</p>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="secondary"
          variant="text"
          @click="$emit('close')"
        >
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          @click="$emit('confirm')"
        >
          Confirmar
        </v-btn>
      </v-card-actions>
    </VCard>
  </VDialog>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});

defineEmits(['update:isOpen', 'close', 'confirm']);
</script>