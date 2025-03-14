// src/components/RightPanel.vue
<template>
  <v-col class="right-panel">
    <div class="panel-content">
      <h3>Редактирование</h3>
      <ControllerEditForm
        v-if="
          selectedTag !== null &&
          selectedMethod !== null &&
          selectedSchema !== null
        "
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
      <MetadataEditor
        v-else-if="selectedMetadata"
        @update-schema="updateSchema"
        @close-form="clearSelection"
      />
      <p v-else>
        Выберите контроллер, метод, схему, enum или метаданные для
        редактирования
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
import MetadataEditor from './RightPanel/MetadataEditor.vue';

export default defineComponent({
  name: 'RightPanel',
  components: {
    ControllerEditForm,
    MethodEditor,
    SchemaEditor,
    EnumEditor,
    MetadataEditor,
  },
  props: {
    selectedTag: String,
    selectedMethod: Object as () => {
      type: string;
      name: string;
      url: string;
    } | null,
    selectedSchema: String,
    selectedEnum: String,
    selectedMetadata: Boolean,
  },
  emits: ['update-schema', 'clear-selection'],
  setup(props, { emit }) {
    console.log('RP selectedMethod', props.selectedMethod);
    const updateSchema = (schema: any) => emit('update-schema', schema);
    const clearSelection = () => emit('clear-selection');
    return { updateSchema, clearSelection };
  },
});
</script>
