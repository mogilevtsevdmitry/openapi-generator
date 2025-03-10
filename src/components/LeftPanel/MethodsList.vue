<template>
  <v-row v-for="method in methods" :key="method.name" no-gutters align="center" class="method-row">
    <v-col cols="2">
      <v-chip :color="getMethodColor(method.type)" small class="mr-2">
        {{ method.type }}
      </v-chip>
    </v-col>
    <v-col cols="10" class="url-column">
      {{ method.url }}
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'

export default defineComponent({
  name: 'MethodsList',
  props: {
    methods: Array as () => { type: string; name: string; url: string }[],
  },
  setup() {
    const { getMethodColor } = inject('openApiLogic') as any
    return { getMethodColor }
  },
})
</script>

<style scoped>
.method-row {
  margin-bottom: 4px;
}
.url-column {
  text-align: left;
  padding-left: 8px;
}
</style>
