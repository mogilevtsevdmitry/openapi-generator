// src/components/LeftPanel/MethodsList.vue
<template>
  <v-row
    v-for="method in methods"
    :key="method.name"
    no-gutters
    align="center"
    class="method-row"
    @click="handleMethodClick(method)"
  >
    <v-col cols="2">
      <v-chip :color="getMethodColor(method.type)" small class="mr-2">
        {{ method.type }}
      </v-chip>
    </v-col>
    <v-col cols="10" class="url-column">
      {{ method.url }}
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'MethodsList',
  props: {
    methods: Array as () => { type: string; name: string; url: string }[],
  },
  emits: ['method-selected'], // Добавляем событие для передачи выбранного метода
  setup(_, { emit }) {
    const { getMethodColor } = inject('openApiLogic') as any;

    const handleMethodClick = (method: {
      type: string;
      name: string;
      url: string;
    }) => {
      console.log('Выбран метод:', method);
      emit('method-selected', method); // Передаем данные о методе вверх
    };

    return { getMethodColor, handleMethodClick };
  },
});
</script>

<style scoped>
.method-row {
  margin-bottom: 4px;
  cursor: pointer; /* Указываем, что строка кликабельна */
}

.method-row:hover {
  background-color: #f5f5f5; /* Подсветка при наведении */
}

.url-column {
  text-align: left;
  padding-left: 8px;
}
</style>
