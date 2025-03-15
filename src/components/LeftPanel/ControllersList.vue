// src/components/LeftPanel/ControllersList.vue
<template>
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
            @click.stop="handleControllerClick(String(tag))"
          >
            <v-expansion-panel-title>
              <strong class="clickable">{{ tag }}</strong>
              <v-spacer></v-spacer>
              <v-btn icon size="x-small" @click.stop="addMethod()">
                <v-icon size="x-large" icon="mdi-plus"></v-icon>
              </v-btn>
            </v-expansion-panel-title>
            <v-expansion-panel-text eager>
              <MethodsList
                :methods="methods"
                @method-selected="handleMethodSelected"
              />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import MethodsList from './MethodsList.vue';

export default defineComponent({
  name: 'ControllersList',
  components: { MethodsList },
  emits: ['open-edit-form', 'method-selected', 'add-method'],
  setup(_, { emit }) {
    const { groupedControllers } = inject(
      'openApiLogic'
    ) as any;
    const controllerPanel = ref([0]); // Открыть первый элемент по умолчанию

    const handleControllerClick = (tag: string) => {
      console.log('Start open-edit-form', tag);
      emit('open-edit-form', tag);
    };

    const addMethod = () => {
      emit('add-method');
    };

    const handleMethodSelected = (method: {
      type: string;
      name: string;
      url: string;
    }) => {
      console.log('Метод передан в ControllersList:', method);
      emit('method-selected', method);
    };

    return {
      groupedControllers,
      controllerPanel,
      handleControllerClick,
      addMethod,
      handleMethodSelected,
    };
  },
});
</script>

<style scoped>
.clickable {
  cursor: pointer;
}
</style>
