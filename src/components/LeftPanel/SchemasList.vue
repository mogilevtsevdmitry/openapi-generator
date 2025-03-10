<template>
  <div v-if="hasSchemas">
    <h3 class="mt-4">Схемы</h3>
    <div class="schema-list">
      <v-chip v-for="schemaName in schemaNames" :key="schemaName" small class="ma-1">
        {{ schemaName }}
      </v-chip>
    </div>
  </div>
  <div v-else-if="parsedSchema">Схемы не найдены в загруженной спецификации</div>
  <div v-else>Схема не загружена</div>
</template>

<script lang="ts">
import { defineComponent, computed, inject } from 'vue'

export default defineComponent({
  name: 'SchemasList',
  setup() {
    const { parsedSchema } = inject('openApiLogic') as any
    const schemaNames = computed(() =>
        parsedSchema.value?.components?.schemas ? Object.keys(parsedSchema.value.components.schemas) : []
    )
    const hasSchemas = computed(() => schemaNames.value.length > 0)

    return { parsedSchema, schemaNames, hasSchemas }
  },
})
</script>
