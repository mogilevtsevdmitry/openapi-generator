// src/App.vue
<template>
  <HeaderComponent
    @add-schema="openNewSchemaEditor"
    @add-enum="openNewEnumEditor"
    @add-controller="openNewControllerEditor"
    @edit-metadata="openMetadataEditor"
  />
  <v-container fluid class="main-container">
    <v-row no-gutters class="window-container">
      <LeftPanel
        @open-edit-form="selectedTag = $event"
        @method-selected="handleMethodSelected"
        @edit-schema="openSchemaEditor"
        @add-method="openNewMethodEditor"
      />
      <ResizeHandle />
      <RightPanel
        @update-schema="updateSchema"
        @clear-selection="clearSelection"
        :selected-tag="selectedTag!"
        :selected-method="selectedMethod"
        :selected-schema="selectedSchema!"
        :selected-enum="selectedEnum!"
        :selected-metadata="selectedMetadata"
      />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue';
import HeaderComponent from './components/HeaderComponent.vue';
import LeftPanel from './components/LeftPanel.vue';
import ResizeHandle from './components/ResizeHandle.vue';
import RightPanel from './components/RightPanel.vue';
import { useOpenApiLogic } from './composables/useOpenApiLogic';

export default defineComponent({
  components: { HeaderComponent, LeftPanel, RightPanel, ResizeHandle },
  setup() {
    const selectedTag = ref<string | null>(null);
    const selectedMethod = ref<{
      type: string;
      name: string;
      url: string;
    } | null>(null);
    const selectedSchema = ref<string | null>(null);
    const selectedEnum = ref<string | null>(null);
    const selectedMetadata = ref<boolean>(false); // Новое состояние для метаданных
    provide('openApiLogic', useOpenApiLogic());

    const updateSchema = (newSchema: any) => {
      console.log('Schema updated:', newSchema);
      const openApiLogic = useOpenApiLogic();
      openApiLogic.parsedSchema.value = newSchema;
    };

    const clearSelection = () => {
      selectedTag.value = null;
      selectedMethod.value = null;
      selectedSchema.value = null;
      selectedEnum.value = null;
      selectedMetadata.value = false;
    };

    const handleMethodSelected = (method: {
      type: string;
      name: string;
      url: string;
    }) => {
      console.log('Тег передан в App.vue:', method);
      selectedMethod.value = method;
      selectedTag.value = null;
      selectedSchema.value = null;
      selectedEnum.value = null;
      selectedMetadata.value = false;
    };

    const openSchemaEditor = (schemaName: string) => {
      selectedSchema.value = schemaName;
      selectedTag.value = null;
      selectedMethod.value = null;
      selectedEnum.value = null;
      selectedMetadata.value = false;
    };

    const openNewSchemaEditor = () => {
      selectedSchema.value = '';
      selectedTag.value = null;
      selectedMethod.value = null;
      selectedEnum.value = null;
      selectedMetadata.value = false;
    };

    const openNewEnumEditor = () => {
      selectedEnum.value = '';
      selectedTag.value = null;
      selectedMethod.value = null;
      selectedSchema.value = null;
      selectedMetadata.value = false;
    };

    const openNewControllerEditor = () => {
      selectedTag.value = '';
      selectedMethod.value = null;
      selectedSchema.value = null;
      selectedEnum.value = null;
      selectedMetadata.value = false;
    };

    const openMetadataEditor = () => {
      selectedMetadata.value = true;
      selectedTag.value = null;
      selectedMethod.value = null;
      selectedSchema.value = null;
      selectedEnum.value = null;
    };

    const openNewMethodEditor = () => {
      selectedMetadata.value = false;
      selectedTag.value = null;
      selectedMethod.value = {
        name: '',
        type: '',
        url: '',
      };
      selectedSchema.value = null;
      selectedEnum.value = null;
    };

    return {
      selectedTag,
      selectedMethod,
      selectedSchema,
      selectedEnum,
      selectedMetadata,
      updateSchema,
      clearSelection,
      handleMethodSelected,
      openSchemaEditor,
      openNewSchemaEditor,
      openNewEnumEditor,
      openNewControllerEditor,
      openMetadataEditor,
      openNewMethodEditor,
    };
  },
});
</script>
