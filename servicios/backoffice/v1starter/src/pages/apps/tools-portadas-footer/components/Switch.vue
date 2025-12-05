<template>
  <v-switch
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', !modelValue)"
    color="primary"
    hide-details
  ></v-switch>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    required: true
  }
});

defineEmits(['update:modelValue']);
</script>