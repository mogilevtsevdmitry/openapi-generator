// src/components/RightPanel/MetadataEditor.vue
<template>
  <v-card class="mt-4">
    <v-card-title>Редактирование метаданных OpenAPI</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="editState.openapi"
        label="OpenAPI Version"
        outlined
        @input="markDirty"
      ></v-text-field>

      <h4>Информация</h4>
      <v-text-field
        v-model="editState.info.title"
        label="Title"
        outlined
        @input="markDirty"
      ></v-text-field>
      <v-text-field
        v-model="editState.info.version"
        label="Version"
        outlined
        @input="markDirty"
      ></v-text-field>
      <v-textarea
        v-model="editState.info.description"
        label="Description"
        outlined
        @input="markDirty"
      ></v-textarea>

      <h4>Серверы</h4>
      <div
        v-for="(server, index) in editState.servers"
        :key="index"
        class="mb-4"
      >
        <v-text-field
          v-model="server.url"
          label="URL"
          outlined
          @input="markDirty"
        ></v-text-field>
        <v-row v-if="server.variables">
          <v-col v-for="(variable, varName) in server.variables" :key="varName">
            <v-text-field
              v-model="variable.default"
              :label="`Default (${varName})`"
              outlined
              @input="markDirty"
            ></v-text-field>
            <v-combobox
              v-model="variable.enum"
              label="Enum Values"
              multiple
              chips
              outlined
              @input="markDirty"
            ></v-combobox>
          </v-col>
        </v-row>
        <v-btn color="error" @click="removeServer(index)">Удалить сервер</v-btn>
      </div>
      <v-btn color="primary" @click="addServer">Добавить сервер</v-btn>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="saveMetadata">Сохранить</v-btn>
      <v-btn color="secondary" @click="closeForm">Закрыть</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';

export default defineComponent({
  name: 'MetadataEditor',
  emits: ['update-schema', 'close-form'],
  setup(_, { emit }) {
    const { parsedSchema } = inject('openApiLogic') as any;
    const isDirty = ref(false);

    const editState = ref({
      openapi: parsedSchema.value?.openapi || '3.0.0',
      info: {
        title: parsedSchema.value?.info?.title || '',
        version: parsedSchema.value?.info?.version || '',
        description: parsedSchema.value?.info?.description || '',
      },
      servers: parsedSchema.value?.servers
        ? JSON.parse(JSON.stringify(parsedSchema.value.servers)) // Глубокая копия
        : [{ url: '', variables: { environment: { default: '', enum: [] } } }],
    });

    const markDirty = () => {
      isDirty.value = true;
    };

    const addServer = () => {
      editState.value.servers.push({
        url: '',
        variables: { environment: { default: '', enum: [] } },
      });
      markDirty();
    };

    const removeServer = (index: number) => {
      editState.value.servers.splice(index, 1);
      markDirty();
    };

    const saveMetadata = () => {
      if (!parsedSchema.value) return;

      parsedSchema.value.openapi = editState.value.openapi;
      parsedSchema.value.info = { ...editState.value.info };
      parsedSchema.value.servers = JSON.parse(
        JSON.stringify(editState.value.servers)
      ); // Глубокая копия

      emit('update-schema', parsedSchema.value);
      isDirty.value = false;
      closeForm();
    };

    const closeForm = () => {
      emit('close-form');
    };

    return {
      editState,
      markDirty,
      addServer,
      removeServer,
      saveMetadata,
      closeForm,
    };
  },
});
</script>
