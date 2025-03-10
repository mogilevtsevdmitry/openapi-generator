<template>
  <v-col :cols="leftPanelWidth" class="left-panel" ref="leftPanel" @mousedown.right="startResize">
    <div class="panel-content">
      <v-expansion-panels flat v-model="controllerPanel">
        <v-expansion-panel>
          <v-expansion-panel-title>
            <h3>Контроллеры</h3>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-expansion-panels flat>
              <v-expansion-panel
                  v-for="(methods, tag) in groupedControllers"
                  :key="tag"
                  @click="openEditForm(tag)"
              >
                <v-expansion-panel-title>
                  <strong>{{ tag }}</strong>
                  <v-spacer></v-spacer>
                  <v-tooltip top>
                    <template #activator="{ props }">
                      <v-btn v-bind="props" icon size="x-small" @click.stop="addMethodForController(tag, 'GET')">
                        <v-icon size="x-large" icon="mdi-plus"></v-icon>
                      </v-btn>
                    </template>
                    <span>Добавить метод</span>
                  </v-tooltip>
                </v-expansion-panel-title>
                <v-expansion-panel-text :eager="true">
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
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <h3 v-if="parsedSchema && parsedSchema.components && parsedSchema.components.schemas" class="mt-4">Схемы</h3>
      <div v-if="parsedSchema && parsedSchema.components && parsedSchema.components.schemas" class="schema-list">
        <v-chip v-for="schemaName in Object.keys(parsedSchema.components.schemas)" :key="schemaName" small class="ma-1">
          {{ schemaName }}
        </v-chip>
      </div>
      <div v-else-if="parsedSchema">Схемы не найдены в загруженной спецификации</div>
      <div v-else>Схема не загружена</div>
    </div>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue'

export default defineComponent({
  name: 'LeftPanel',
  setup(props, { emit }) {
    const {
      leftPanelWidth,
      startResize,
      addMethodForController,
      getMethodColor,
      parsedSchema,
      groupedControllers, // Используем groupedControllers из openApiLogic
    } = inject('openApiLogic') as any

    // Состояние данных
    const controllerPanel = ref([0]) // Раскрытие "Контроллеры" по умолчанию

    // Эмиссия события для открытия формы
    const openEditForm = (tag: string) => {
      console.log('Emitting open-edit-form with tag:', tag) // Отладка
      emit('open-edit-form', tag)
    }

    return {
      leftPanelWidth,
      startResize,
      parsedSchema,
      groupedControllers,
      addMethodForController,
      getMethodColor,
      controllerPanel,
      openEditForm,
    }
  },
})
</script>

<style scoped>
/* Стили для выравнивания */
.method-row {
  margin-bottom: 4px;
}

.url-column {
  text-align: left;
  padding-left: 8px;
}

/* Стили для заголовка панели */
.v-expansion-panel-title {
  font-weight: bold;
  background-color: #f5f5f5; /* Легкий серый фон */
  border-radius: 4px;
}
</style>