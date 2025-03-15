// src/components/LeftPanel.vue
<template>
  <v-col :cols="leftPanelWidth" class="left-panel">
    <div class="panel-content">
      <ControllersList
        @open-edit-form="openEditForm"
        @method-selected="handleMethodSelected"
        @add-method="addMethod"
      />
      <SchemasList @edit-schema="handleEditSchema" />
    </div>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import SchemasList from './LeftPanel/SchemasList.vue';
import ControllersList from './LeftPanel/ControllersList.vue';

export default defineComponent({
  name: 'LeftPanel',
  components: { ControllersList, SchemasList },
  emits: ['open-edit-form', 'method-selected', 'edit-schema', 'add-method'],
  setup(_, { emit }) {
    const { leftPanelWidth } = inject('openApiLogic') as any;

    const openEditForm = (tag: string) => {
      console.log('handle open edit form', tag);
      emit('open-edit-form', tag);
    };

    const handleEditSchema = (schemaName: string) => {
      console.log('Событие edit-schema в LeftPanel:', schemaName);
      emit('edit-schema', schemaName);
    };

    const addMethod = () => {
      console.log('Вызвана функция addMethod в LeftPanel');
      emit('add-method');
    };

    const handleMethodSelected = (method: {
      type: string;
      name: string;
      url: string;
    }) => {
      console.log('Метод передан в LeftPanel:', method);
      emit('method-selected', method); // Передаем событие в App.vue
    };

    return {
      leftPanelWidth,
      openEditForm,
      handleMethodSelected,
      handleEditSchema,
      addMethod,
    };
  },
});
</script>
