// src/components/RightPanel/MethodEditor.vue
<template>
  <v-card v-if="method" class="mt-4">
    <v-card-title>Редактирование метода: {{ method.name }}</v-card-title>
    <v-card-text>
      <v-text-field v-model="editState.url" label="URL" outlined></v-text-field>
      <v-select
        v-model="editState.type"
        :items="['GET', 'POST', 'PUT', 'DELETE', 'PATCH']"
        label="Тип метода"
        outlined
      ></v-select>
      <v-text-field
        v-model="editState.summary"
        label="Описание (summary)"
        outlined
      ></v-text-field>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="saveMethod">Сохранить</v-btn>
      <v-btn color="error" @click="deleteMethod">Удалить</v-btn>
      <v-btn color="secondary" @click="closeForm">Закрыть</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';

export default defineComponent({
  name: 'MethodEditor',
  props: {
    method: Object as () => { type: string; name: string; url: string } | null,
  },
  emits: ['update-schema', 'close-form'],
  setup(props, { emit }) {
    const { parsedSchema } = inject('openApiLogic') as any;

    const editState = ref({
      url: props.method?.url || '',
      type: props.method?.type || 'GET',
      summary: props.method?.name || '',
    });

    const saveMethod = () => {
      if (!parsedSchema.value || !props.method) return;

      const oldUrl = props.method.url;
      const oldType = props.method.type.toLowerCase();
      const newUrl = editState.value.url;
      const newType = editState.value.type.toLowerCase();

      const newPaths = { ...parsedSchema.value.paths };
      const tag = newPaths[oldUrl][oldType]?.tags[0];
      if (oldUrl !== newUrl || oldType !== newType) {
        // Удаляем старую запись
        delete newPaths[oldUrl][oldType];
        if (Object.keys(newPaths[oldUrl]).length === 0) delete newPaths[oldUrl];
      }

      // Добавляем или обновляем новую запись
      if (!newPaths[newUrl]) newPaths[newUrl] = {};
      newPaths[newUrl][newType] = {
        ...newPaths[oldUrl]?.[oldType],
        summary: editState.value.summary,
        tags: [tag || 'Uncategorized'],
      };

      parsedSchema.value = { ...parsedSchema.value, paths: newPaths };
      emit('update-schema', parsedSchema.value);
      emit('close-form');
    };

    const deleteMethod = () => {
      if (!parsedSchema.value || !props.method) return;

      const url = props.method.url;
      const type = props.method.type.toLowerCase();
      const newPaths = { ...parsedSchema.value.paths };
      delete newPaths[url][type];
      if (Object.keys(newPaths[url]).length === 0) delete newPaths[url];

      parsedSchema.value = { ...parsedSchema.value, paths: newPaths };
      emit('update-schema', parsedSchema.value);
      emit('close-form');
    };

    const closeForm = () => {
      emit('close-form');
    };

    return { editState, saveMethod, deleteMethod, closeForm };
  },
});
</script>
