// src/components/HeaderComponent.vue
<template>
  <v-toolbar color="primary" dark elevation="2">
    <v-toolbar-title>OpenAPI Generator (DEMO)</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn @click="addController" variant="outlined" class="ma-1"
      >Добавить контроллер</v-btn
    >
    <v-btn @click="addSchema" variant="outlined" class="ma-1"
      >Добавить схему</v-btn
    >
    <v-btn @click="addEnum" variant="outlined" class="ma-1"
      >Добавить ENUM</v-btn
    >
    <v-btn @click="editMetadata" variant="outlined" class="ma-1"
      >Редактировать метаданные</v-btn
    >
    <v-btn @click="exportYaml" variant="outlined" class="ma-1"
      >Выгрузить YAML</v-btn
    >
    <v-btn @click="uploadSchema" variant="outlined" class="ma-1">
      Загрузить схему
      <input
        type="file"
        ref="fileInput"
        @change="handleFileUpload"
        style="display: none"
        accept=".yaml,.yml,.json"
      />
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'HeaderComponent',
  setup(_, { emit }) {
    const { exportYaml, uploadSchema, handleFileUpload, fileInput } = inject(
      'openApiLogic'
    ) as any;

    const addSchema = () => emit('add-schema');
    const addEnum = () => emit('add-enum');
    const addController = () => emit('add-controller');
    const editMetadata = () => emit('edit-metadata');

    return {
      addSchema,
      exportYaml,
      addController,
      uploadSchema,
      handleFileUpload,
      fileInput,
      addEnum,
      editMetadata,
    };
  },
});
</script>
