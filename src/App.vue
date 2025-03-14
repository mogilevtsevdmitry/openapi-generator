// src/App.vue
<template>
  <HeaderComponent
    @add-schema="openNewSchemaEditor"
    @add-enum="openNewEnumEditor"
    @add-controller="openNewControllerEditor"
  />
  <v-container fluid class="main-container">
    <v-row no-gutters class="window-container">
      <LeftPanel
        @open-edit-form="selectedTag = $event"
        @method-selected="handleMethodSelected"
        @edit-schema="openSchemaEditor"
      />
      <ResizeHandle />
      <RightPanel
        @update-schema="updateSchema"
        @clear-selection="clearSelection"
        :selected-tag="selectedTag"
        :selected-method="selectedMethod"
        :selected-schema="selectedSchema"
        :selected-enum="selectedEnum"
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
    };

    const handleMethodSelected = (method: {
      type: string;
      name: string;
      url: string;
    }) => {
      selectedMethod.value = method;
      selectedTag.value = null;
      selectedSchema.value = null;
      selectedEnum.value = null;
    };

    const openSchemaEditor = (schemaName: string) => {
      selectedSchema.value = schemaName;
      selectedTag.value = null;
      selectedMethod.value = null;
      selectedEnum.value = null;
    };

    const openNewSchemaEditor = () => {
      selectedSchema.value = '';
      selectedTag.value = null;
      selectedMethod.value = null;
      selectedEnum.value = null;
    };

    const openNewEnumEditor = () => {
      selectedEnum.value = '';
      selectedTag.value = null;
      selectedMethod.value = null;
      selectedSchema.value = null;
    };

    const openNewControllerEditor = () => {
      selectedEnum.value = null;
      selectedTag.value = '';
      selectedMethod.value = null;
      selectedSchema.value = null;
    };

    return {
      selectedTag,
      selectedMethod,
      selectedSchema,
      selectedEnum,
      updateSchema,
      clearSelection,
      handleMethodSelected,
      openSchemaEditor,
      openNewSchemaEditor,
      openNewEnumEditor,
      openNewControllerEditor,
    };
  },
});
</script>
