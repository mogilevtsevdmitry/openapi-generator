<template>
  <div v-if="method">
    <h3>Редактирование метода</h3>
    <p><strong>URL:</strong> {{ method.url }}</p>
    <v-btn color="success" @click="saveMethod">Сохранить</v-btn>
    <v-btn color="error" @click="deleteMethod">Удалить</v-btn>
  </div>
  <div v-else>
    <p>Выберите метод для редактирования</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  props: {
    method: Object as PropType<{ url: string } | null>
  },
  methods: {
    saveMethod() {
      console.log('Сохранение метода', this.method);
    },
    deleteMethod() {
      console.log('Удаление метода', this.method);
    }
  }
});
</script>
