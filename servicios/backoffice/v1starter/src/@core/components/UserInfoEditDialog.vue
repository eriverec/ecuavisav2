<script setup>
const props = defineProps({
   userData: {
    type: Object,
     required: true,
 },
  isDialogVisible: {
    type: Boolean,
    required: true,
  },
});
import { emailValidator, requiredValidator } from "@validators";

const emit = defineEmits([
  "update:modelValue",
  "submit",
  "update:isDialogVisible",
  
]);

//const userData = ref(structuredClone(toRaw(props.userData)))
//const isUseAsBillingAddress = ref(false)

//  watch(props, () => {
//    userData.value = structuredClone(toRaw(props.userData))
//  })

const isFormValid = ref(false);
const refForm = ref();
//const first_name = ref(props.userData.first_name);
//const last_name = ref(props.userData.last_name);
//const contraseña = ref("");
//const newsletter_opt_in = ref(true);
const updateData = ref({
  first_name: props.userData.first_name,
  last_name: props.userData.last_name,
  contraseña: "",
  newsletter_opt_in: props.userData.newsletter_opt_in,
 });
console.log("sin",updateData)
console.log("value",updateData._rawValue)

const onFormSubmit = () => {
  refForm.value?.validate().then(({ valid }) => {
    if (valid) {
      emit("update:modelValue", false);
      emit("update:isDialogVisible", false);
      emit("submit", updateData._rawValue);
      // nextTick(() => {
      //   refForm.value?.reset()
      //   refForm.value?.resetValidation()
      // })
    }
  });
  
  
};

const onFormReset = () => {
  //userData.value = structuredClone(toRaw(props.userData))
  emit("update:isDialogVisible", false);
};

const dialogModelValueUpdate = val => {
  emit("update:isDialogVisible", val);
};
</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 700"
    :model-value="props.isDialogVisible"
    @update:model-value="dialogModelValueUpdate"
  >
    <!-- Dialog close btn -->
    <DialogCloseBtn @click="dialogModelValueUpdate(false)" />

    <VCard class="pa-sm-14 pa-5">
      <VCardItem class="text-center">
        <VCardTitle class="text-h5 mb-3">
          Editar la información del usuario
        </VCardTitle>
        <!--
        <p class="mb-0">
          Updating user details will receive a privacy audit.
        </p>
         -->
      </VCardItem>

      <VCardText>
        <!-- 👉 Form -->
        <VForm
          ref="refForm"
          v-model="isFormValid"
          class="mt-6"
          @submit.prevent="onFormSubmit"
        >
          <VRow>
            <!-- 👉 First Name -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="updateData.first_name"
                :rules="[requiredValidator]"
                label="Nombres"
              />
            </VCol>

            <!-- 👉 Last Name -->
            <VCol cols="12" md="6">
              <VTextField
                v-model="updateData.last_name"
                :rules="[requiredValidator]"
                label="Apellidos"
              />
            </VCol>

            <!--👉 Contraseña -->
            <VCol cols="12" md="6">
              <VTextField v-model="updateData.contraseña" label="Contraseña" />
            </VCol>
            <!--
           // 👉 Status 
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="userData.status"
                label="Status"
              />
            </VCol>

           // 👉 Tax Id 
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="userData.taxId"
                label="Tax Id"
              />
            </VCol>

           // 👉 Contact 
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="userData.contact"
                label="Contact"
              />
            </VCol>

           //👉 Language 
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="userData.language"
                chips
                multiple
                label="Language"
                :items="['English', 'Spanish', 'Portuguese', 'Russian', 'French', 'German']"
              />
            </VCol>

            //👉 Country 
            <VCol
              cols="12"
              md="6"
            >
              <VSelect
                v-model="userData.country"
                label="Country"
                :items="['USA', 'UK', 'Spain', 'Russia', 'France', 'Germany']"
              />
            </VCol>
          -->
            <!-- 👉 Switch -->
            <VCol cols="12">
              <VSwitch
                v-model="updateData.newsletter_opt_in"
                density="compact"
                label="Suscribirse al boletín"
              />
            </VCol>

            <!-- 👉 Submit and Cancel -->
            <VCol cols="12" class="d-flex flex-wrap justify-center gap-4">
              <VBtn type="submit"> Enviar </VBtn>

              <VBtn color="secondary" variant="tonal" @click="onFormReset">
                Cancelar
              </VBtn>
            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
