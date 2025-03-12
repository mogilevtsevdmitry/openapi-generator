// src/App.vue
<template>
  <HeaderComponent />
  <v-container fluid class="main-container">
    <v-row no-gutters class="window-container">
      <LeftPanel
        @open-edit-form="selectedTag = $event"
        @method-selected="handleMethodSelected"
      />
      <ResizeHandle />
      <RightPanel
        @update-schema="updateSchema"
        @clear-selection="clearSelection"
        :selected-tag="selectedTag!"
        :selected-method="selectedMethod"
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
    provide('openApiLogic', useOpenApiLogic());

    const updateSchema = (newSchema: any) => {
      console.log('Schema updated:', newSchema);
    };

    const clearSelection = () => {
      selectedTag.value = null;
      selectedMethod.value = null; // Очищаем метод при сбросе
    };

    const handleMethodSelected = (method: {
      type: string;
      name: string;
      url: string;
    }) => {
      selectedMethod.value = method;
      selectedTag.value = null; // Сбрасываем контроллер, если выбран метод
      console.log('Выбран метод в App.vue:', method);
    };

    return {
      selectedTag,
      selectedMethod,
      updateSchema,
      clearSelection,
      handleMethodSelected,
    };
  },
});
</script>
