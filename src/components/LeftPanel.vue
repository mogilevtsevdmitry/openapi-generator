<template>
  <v-col :cols="leftPanelWidth" class="left-panel">
    <div class="panel-content">
      <ControllersList @open-edit-controller-form="openEditForm" />
      <SchemasList />
    </div>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue'
import ControllersList from '@/components/LeftPanel/ControllersList.vue'
import SchemasList from '@/components/LeftPanel/SchemasList.vue'

export default defineComponent({
  name: 'LeftPanel',
  components: { ControllersList, SchemasList },
  setup(_, { emit }) {
    const { leftPanelWidth } = inject('openApiLogic') as any

    const openEditForm = (tag: string) => {
      console.log('handle open edit form', tag)
      emit('open-edit-form', tag)
    }

    return { leftPanelWidth, openEditForm }
  },
})
</script>
