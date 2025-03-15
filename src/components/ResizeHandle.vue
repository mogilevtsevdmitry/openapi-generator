<template>
  <div class="resize-handle" @mousedown="startResize"></div>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'ResizeHandle',
  setup() {
    const { startResize } = inject('openApiLogic') as any

    return {
      startResize,
    }
  },
})
</script>