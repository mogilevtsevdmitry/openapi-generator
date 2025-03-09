<template>
  <v-toolbar color="primary" dark elevation="2">
    <v-toolbar-title>OpenAPI Generator</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn @click="addSchema" variant="outlined" class="ma-1">Добавить схему</v-btn>
    <v-btn @click="exportYaml" variant="outlined" class="ma-1">Выгрузить YAML</v-btn>
    <v-btn @click="addController" variant="outlined" class="ma-1">Добавить контроллер</v-btn>
    <v-btn @click="uploadSchema" variant="outlined" class="ma-1">
      Загрузить схему
      <input type="file" ref="fileInput" @change="handleFileUpload" style="display: none;" accept=".yaml,.yml,.json" />
    </v-btn>
  </v-toolbar>
</template>

<script lang="ts">
import { defineComponent, ref, inject } from 'vue'

export default defineComponent({
  name: 'HeaderComponent',
  setup() {
    const { addSchema, exportYaml, addController, uploadSchema, handleFileUpload, fileInput } = inject('openApiLogic') as any

    return {
      addSchema,
      exportYaml,
      addController,
      uploadSchema,
      handleFileUpload,
      fileInput,
    }
  },
})
</script>