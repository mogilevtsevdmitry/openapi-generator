<template>
  <HeaderComponent />
  <v-container fluid class="main-container">
    <v-row no-gutters class="window-container">
      <LeftPanel @open-edit-form="selectedTag = $event" />
      <ResizeHandle />
      <RightPanel
        @update-schema="updateSchema"
        @clear-selection="selectedTag = ''"
        :selected-tag="selectedTag!"
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
    provide('openApiLogic', useOpenApiLogic());

    const updateSchema = (newSchema: any) => {
      console.log('Schema updated:', newSchema);
    };

    return { selectedTag, updateSchema };
  },
});
</script>
