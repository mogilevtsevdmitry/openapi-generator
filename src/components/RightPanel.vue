// src/components/RightPanel.vue
<template>
  <v-col class="right-panel">
    <div class="panel-content">
      <h3>Редактирование</h3>
      <ControllerEditForm
        v-if="selectedTag !== null"
        :selected-tag="selectedTag"
        @update-schema="updateSchema"
        @close-form="clearSelection"
      />
      <MethodEditor
        v-else-if="selectedMethod"
        :method="selectedMethod"
        @update-schema="updateSchema"
        @close-form="clearSelection"
      />
      <SchemaEditor
        v-else-if="selectedSchema !== null"
        :schema-name="selectedSchema"
        @update-schema="updateSchema"
        @close-form="clearSelection"
      />
      <EnumEditor
        v-else-if="selectedEnum !== null"
        :enum-name="selectedEnum"
        @update-schema="updateSchema"
        @close-form="clearSelection"
      />
      <p v-else>
        Выберите контроллер, метод, схему или enum слева для редактирования
      </p>
    </div>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ControllerEditForm from './RightPanel/ControllerEditForm.vue';
import MethodEditor from './RightPanel/MethodEditor.vue';
import SchemaEditor from './RightPanel/SchemaEditor.vue';
import EnumEditor from './RightPanel/EnumEditor.vue';

export default defineComponent({
  name: 'RightPanel',
  components: { ControllerEditForm, MethodEditor, SchemaEditor, EnumEditor },
  props: {
    selectedTag: String,
    selectedMethod: Object as () => {
      type: string;
      name: string;
      url: string;
    } | null,
    selectedSchema: String,
    selectedEnum: String,
  },
  emits: ['update-schema', 'clear-selection'],
  setup(_, { emit }) {
    const updateSchema = (schema: any) => {
      emit('update-schema', schema);
    };

    const clearSelection = () => {
      emit('clear-selection');
    };

    return { updateSchema, clearSelection };
  },
});
</script>
