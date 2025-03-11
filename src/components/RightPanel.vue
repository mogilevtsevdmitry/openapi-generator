<template>
  <v-col class="right-panel">
    <div class="panel-content">
      <h3>Редактирование</h3>
      <ControllerEditForm
          v-if="selectedTag"
          :selectedTag="selectedTag"
          @update-schema="updateSchema"
          @close-form="clearSelection"
      />
      <p v-else>Выберите контроллер слева для редактирования</p>
    </div>
  </v-col>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import ControllerEditForm from './RightPanel/ControllerEditForm.vue'

export default defineComponent({
  name: 'RightPanel',
  components: { ControllerEditForm },
  props: {
    selectedTag: String, // Теперь RightPanel принимает selectedTag от родителя
  },
  emits: ['update-schema', 'clear-selection'],
  setup(_, { emit }) {
    const updateSchema = (schema: any) => {
      emit('update-schema', schema)
    }

    const clearSelection = () => {
      emit('clear-selection')
    }

    return { updateSchema, clearSelection }
  },
})
</script>
