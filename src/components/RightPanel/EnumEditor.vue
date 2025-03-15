// src/components/RightPanel/EnumEditor.vue
<template>
  <v-card class="mt-4">
    <v-card-title
      >Редактирование Enum: {{ enumName || 'Новый Enum' }}</v-card-title
    >
    <v-card-text>
      <v-alert
        v-if="errorMessage"
        type="error"
        dismissible
        @input="errorMessage = ''"
      >
        {{ errorMessage }}
      </v-alert>
      <v-text-field
        v-model="editState.name"
        label="Название Enum"
        outlined
        @input="markDirty"
      ></v-text-field>
      <h4>Значения</h4>
      <v-row v-for="(_, index) in editState.values" :key="index" align="center">
        <v-col cols="9">
          <v-text-field
            v-model="editState.values[index]"
            label="Значение"
            outlined
            @input="markDirty"
          ></v-text-field>
        </v-col>
        <v-col cols="3">
          <v-btn color="error" @click="removeValue(index)">Удалить</v-btn>
        </v-col>
      </v-row>
      <v-btn color="primary" @click="addValue">Добавить значение</v-btn>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="saveEnum">Сохранить</v-btn>
      <v-btn color="secondary" @click="closeForm">Закрыть</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';

export default defineComponent({
  name: 'EnumEditor',
  props: {
    enumName: String,
  },
  emits: ['update-schema', 'close-form'],
  setup(props, { emit }) {
    const { parsedSchema } = inject('openApiLogic') as any;
    const errorMessage = ref<string>('');
    const isDirty = ref(false);

    const editState = ref({
      name: props.enumName || '',
      values: [] as string[],
    });

    // Инициализация значений Enum, если редактируем существующий
    if (
      props.enumName &&
      parsedSchema.value?.components?.schemas[props.enumName]
    ) {
      const enumData = parsedSchema.value.components.schemas[props.enumName];
      editState.value.values = enumData.enum || [];
    }

    const markDirty = () => {
      isDirty.value = true;
    };

    const addValue = () => {
      editState.value.values.push('');
      markDirty();
    };

    const removeValue = (index: number) => {
      editState.value.values.splice(index, 1);
      markDirty();
    };

    const saveEnum = () => {
      if (
        !parsedSchema.value ||
        !editState.value.name ||
        editState.value.values.length === 0
      ) {
        errorMessage.value = 'Название и хотя бы одно значение обязательны!';
        return;
      }

      const oldName = props.enumName;
      const newName = editState.value.name.trim();

      if (
        parsedSchema.value.components?.schemas[newName] &&
        newName !== oldName
      ) {
        errorMessage.value = `Enum с именем "${newName}" уже существует! Выберите другое имя.`;
        return;
      }

      const newSchemas = { ...parsedSchema.value.components.schemas };

      if (oldName && oldName !== newName) {
        delete newSchemas[oldName];
      }

      newSchemas[newName] = {
        type: 'string', // Фиксируем тип как string, как в примере YAML
        enum: [...editState.value.values], // Копируем значения
      };

      parsedSchema.value.components.schemas = newSchemas;
      emit('update-schema', parsedSchema.value);
      isDirty.value = false;
      closeForm(); // Закрываем после сохранения
    };

    const closeForm = () => {
      console.log('Закрытие формы EnumEditor');
      emit('close-form');
    };

    return {
      editState,
      addValue,
      removeValue,
      saveEnum,
      closeForm,
      markDirty,
      errorMessage,
    };
  },
});
</script>
