<template>
  <v-app>
    <HeaderComponent />
    <v-container fluid class="main-container">
      <v-row no-gutters class="window-container">
        <LeftPanel @open-edit-form="handleEditForm" />
        <ResizeHandle />
        <RightPanel
            :selectedTag="selectedTag"
            @update-schema="updateSchema"
            @close-form="closeForm"
        />
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'
import HeaderComponent from '@/components/HeaderComponent.vue'
import LeftPanel from '@/components/LeftPanel.vue'
import ResizeHandle from '@/components/ResizeHandle.vue'
import RightPanel from '@/components/RightPanel.vue'
import { useOpenApiLogic } from '@/composables/useOpenApiLogic'

export default defineComponent({
  name: 'App',
  components: {
    HeaderComponent,
    LeftPanel,
    ResizeHandle,
    RightPanel,
  },
  setup() {
    const openApiLogic = useOpenApiLogic()
    provide('openApiLogic', openApiLogic)

    const selectedTag = ref<string | null>(null)

    const handleEditForm = (tag: string) => {
      console.log('Received open-edit-form with tag:', tag) // Отладка
      selectedTag.value = tag
    }

    const updateSchema = (schema: any) => {
      openApiLogic.parsedSchema.value = schema
    }

    const closeForm = () => {
      console.log('Closing form, resetting selectedTag') // Отладка
      selectedTag.value = null
    }

    return {
      selectedTag,
      handleEditForm,
      updateSchema,
      closeForm,
    }
  },
})
</script>

<style>
@import '@/assets/styles.css';
</style>