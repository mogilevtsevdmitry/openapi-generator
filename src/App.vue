<template>
  <v-app>
    <HeaderComponent />
    <v-container fluid class="main-container">
      <v-row no-gutters class="window-container">
        <LeftPanel />
        <ResizeHandle />
        <RightPanel />
      </v-row>
    </v-container>
  </v-app>
</template>

<script lang="ts">
import { defineComponent, provide } from 'vue'
import HeaderComponent from './components/HeaderComponent.vue'
import LeftPanel from './components/LeftPanel.vue'
import ResizeHandle from './components/ResizeHandle.vue'
import RightPanel from './components/RightPanel.vue'
import { useOpenApiLogic } from './composables/useOpenApiLogic'

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

    return {}
  },
})
</script>

<style>
@import './assets/styles.css';
</style>