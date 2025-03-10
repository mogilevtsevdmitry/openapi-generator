<template>
  <HeaderComponent />
  <v-container fluid class="main-container">
    <v-row no-gutters class="window-container">
      <LeftPanel @open-edit-form="selectedTag = $event" />
      <ResizeHandle />
      <RightPanel :selectedTag="selectedTag" @update-schema="updateSchema" @clear-selection="selectedTag = ''" />
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, provide } from 'vue'
import LeftPanel from '@/components/LeftPanel.vue'
import RightPanel from '@/components/RightPanel.vue'
import { useOpenApiLogic } from '@/composables/useOpenApiLogic'
import HeaderComponent from '@/components/HeaderComponent.vue'
import ResizeHandle from '@/components/ResizeHandle.vue'

export default defineComponent({
  components: { ResizeHandle, HeaderComponent, LeftPanel, RightPanel },
  setup() {
    const selectedTag = ref<string | null>(null)
    provide('openApiLogic', useOpenApiLogic())

    const updateSchema = (newSchema: any) => {
      console.log('Schema updated:', newSchema)
    }

    return { selectedTag, updateSchema }
  },
})
</script>
