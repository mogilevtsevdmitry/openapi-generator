<template>
  <v-card class="mt-4">
    <v-card-title>Редактирование схемы: {{ schemaName }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="editState.name"
        label="Название схемы"
        outlined
        @input="markDirty"
      ></v-text-field>
      <h4>Поля</h4>
      <v-row
        v-for="(field, index) in editState.fields"
        :key="index"
        align="center"
      >
        <v-col cols="3">
          <v-text-field
            v-model="field.name"
            label="Имя поля"
            outlined
            @input="markDirty"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-select
            v-model="field.type"
            :items="allTypes"
            label="Тип"
            outlined
            @change="markDirty"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-checkbox
            v-model="field.required"
            label="Обязательное"
            @change="markDirty"
          ></v-checkbox>
        </v-col>
        <v-col cols="3">
          <v-text-field
            v-model="field.description"
            label="Описание"
            outlined
            @input="markDirty"
          ></v-text-field>
        </v-col>
        <v-col cols="1">
          <v-btn color="error" @click="removeField(index)">Удалить</v-btn>
        </v-col>
      </v-row>
      <v-btn color="primary" @click="addField">Добавить поле</v-btn>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="saveSchema">Сохранить</v-btn>
      <v-btn color="error" @click="deleteSchema">Удалить</v-btn>
      <v-btn color="secondary" @click="closeForm">Закрыть</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, inject, ref, computed } from 'vue';

export default defineComponent({
  name: 'SchemaEditor',
  props: {
    schemaName: String,
  },
  emits: ['update-schema', 'close-form'],
  setup(props, { emit }) {
    const { parsedSchema } = inject('openApiLogic') as any;
    const isDirty = ref(false);

    const simpleTypes = ['string', 'number', 'boolean', 'integer', 'array'];
    const schemaTypes = computed(() =>
      Object.keys(parsedSchema.value?.components?.schemas || {}).filter(
        (name) =>
          name !== props.schemaName &&
          !parsedSchema.value.components.schemas[name].enum
      )
    );
    const enumTypes = computed(() =>
      Object.keys(parsedSchema.value?.components?.schemas || {}).filter(
        (name) => parsedSchema.value.components.schemas[name].enum
      )
    );
    const allTypes = computed(() => [
      ...simpleTypes,
      ...schemaTypes.value,
      ...enumTypes.value,
    ]);

    const editState = ref({
      name: props.schemaName || '',
      fields: [] as {
        name: string;
        type: string;
        required: boolean;
        description: string;
      }[],
    });

    // Инициализация полей схемы
    if (
      props.schemaName &&
      parsedSchema.value?.components?.schemas[props.schemaName]
    ) {
      const schema = parsedSchema.value.components.schemas[props.schemaName];
      editState.value.fields = Object.entries(schema.properties || {}).map(
        ([name, prop]: [string, any]) => ({
          name,
          type: prop.type || prop.$ref?.split('/').pop(),
          required: schema.required?.includes(name) || false,
          description: prop.description || '',
        })
      );
    }

    const markDirty = () => {
      isDirty.value = true;
    };

    const addField = () => {
      editState.value.fields.push({
        name: '',
        type: 'string',
        required: false,
        description: '',
      });
      markDirty();
    };

    const removeField = (index: number) => {
      editState.value.fields.splice(index, 1);
      markDirty();
    };

    const saveSchema = () => {
      if (!parsedSchema.value) return;

      const oldName = props.schemaName;
      const newName = editState.value.name;
      const newSchemas = { ...parsedSchema.value.components.schemas };

      if (oldName && oldName !== newName) {
        delete newSchemas[oldName];
      }

      newSchemas[newName] = {
        type: 'object',
        properties: editState.value.fields.reduce((acc, field) => {
          if (enumTypes.value.includes(field.type)) {
            acc[field.name] = {
              $ref: `#/components/schemas/${field.type}`,
              description: field.description,
            };
          } else if (field.type.startsWith('array')) {
            acc[field.name] = {
              type: 'array',
              items: { type: field.type.replace('array of ', '') },
            };
          } else if (simpleTypes.includes(field.type)) {
            acc[field.name] = {
              type: field.type,
              description: field.description,
            };
          } else {
            acc[field.name] = {
              $ref: `#/components/schemas/${field.type}`,
              description: field.description,
            };
          }
          return acc;
        }, {} as any),
        required: editState.value.fields
          .filter((f) => f.required)
          .map((f) => f.name),
      };

      parsedSchema.value.components.schemas = newSchemas;
      emit('update-schema', parsedSchema.value);
      isDirty.value = false;
    };

    const deleteSchema = () => {
      if (!parsedSchema.value || !props.schemaName) return;
      delete parsedSchema.value.components.schemas[props.schemaName];
      emit('update-schema', parsedSchema.value);
      emit('close-form');
    };

    const closeForm = () => {
      emit('close-form');
    };

    return {
      editState,
      allTypes,
      addField,
      removeField,
      saveSchema,
      deleteSchema,
      closeForm,
      markDirty,
    };
  },
});
</script>
