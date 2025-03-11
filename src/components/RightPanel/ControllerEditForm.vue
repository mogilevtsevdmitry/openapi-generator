<template>
  <v-card v-if="isEditing" class="mt-4">
    <v-card-title>Редактирование контроллера: {{ editState.tag }}</v-card-title>
    <v-card-text>
      <v-text-field v-model="editState.tag" label="Тег" outlined></v-text-field>
      <v-checkbox v-model="editState.requiresAuth" label="Требуется авторизация"></v-checkbox>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="saveController">Сохранить</v-btn>
      <v-btn color="error" @click="openDeleteDialog">Удалить</v-btn>
    </v-card-actions>
  </v-card>

  <!-- Модальное окно подтверждения удаления -->
  <v-dialog v-model="deleteDialog" max-width="400px">
    <v-card>
      <v-card-title>Подтвердите удаление</v-card-title>
      <v-card-text>Вы уверены, что хотите удалить контроллер "{{ editState.tag }}"?</v-card-text>
      <v-card-actions>
        <v-btn color="secondary" @click="deleteDialog = false">Отмена</v-btn>
        <v-btn color="error" @click="deleteController">Удалить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, inject, ref, watch } from 'vue'

export default defineComponent({
  name: 'ControllerEditForm',
  props: {
    selectedTag: String, // Передаем выбранный контроллер
  },
  emits: [ 'update-schema', 'close-form' ], // События для обновления схемы и закрытия формы
  setup(props, { emit }) {
    const {parsedSchema, groupedControllers} = inject('openApiLogic') as any

    const isEditing = ref(false)
    const deleteDialog = ref(false)

    // Локальное состояние формы
    const initialState = ref<{ tag: string; requiresAuth: boolean }>({ tag: '', requiresAuth: false })
    const editState = ref<{ tag: string; requiresAuth: boolean }>({ tag: '', requiresAuth: false })

    // Следим за `selectedTag` и загружаем данные
    watch(
        () => props.selectedTag,
        (newTag) => {
          if (newTag) {
            isEditing.value = true
            let requiresAuth = false

            if (parsedSchema.value?.paths) {
              for (const methods of Object.values(parsedSchema.value.paths) as any[]) {
                for (const details of Object.values(methods)) {
                  if (details.tags?.[ 0 ] === newTag && details.security) {
                    requiresAuth = true
                    break
                  }
                }
              }
            }

            initialState.value = { tag: newTag, requiresAuth }
            editState.value = { ...initialState.value }
          } else {
            isEditing.value = false
            initialState.value = { tag: '', requiresAuth: false }
            editState.value = { ...initialState.value }
          }
        },
        { immediate: true },
    )

    // Сохранение изменений
    const saveController = () => {
      if (!parsedSchema.value || !editState.value.tag) return

      const oldTag = initialState.value.tag
      const newTag = editState.value.tag

      if (!groupedControllers.value[ oldTag ]) return

      const newPaths = Object.fromEntries(
          Object.entries(parsedSchema.value.paths).map(([ path, details ]: [ string, any ]) => {
            const newDetails = { ...details }
            for (const method of Object.keys(newDetails)) {
              const methodDetails = newDetails[ method ]
              if (methodDetails.tags?.[ 0 ] === oldTag) {
                methodDetails.tags[ 0 ] = newTag
                if (editState.value.requiresAuth) {
                  methodDetails.security = [ { bearerAuth: [] } ]
                } else {
                  delete methodDetails.security
                }
              }
            }
            return [ path, newDetails ]
          }),
      )

      parsedSchema.value = { ...parsedSchema.value, paths: newPaths }
      emit('update-schema', parsedSchema.value)
      emit('close-form')
      isEditing.value = false
    }

    // Удаление контроллера
    const openDeleteDialog = () => {
      deleteDialog.value = true
    }

    const deleteController = () => {
      if (parsedSchema.value && editState.value.tag) {
        const newPaths = Object.fromEntries(
            Object.entries(parsedSchema.value.paths).filter(([ _, details ]: [ string, any ]) =>
                !Object.values(details).some((methodDetails: any) => methodDetails.tags?.[ 0 ] === editState.value.tag),
            ),
        )
        parsedSchema.value = { ...parsedSchema.value, paths: newPaths }
        delete groupedControllers.value[ editState.value.tag ]

        emit('update-schema', parsedSchema.value)
        emit('close-form')
      }
      deleteDialog.value = false
      isEditing.value = false
    }

    return {
      isEditing,
      editState,
      deleteDialog,
      saveController,
      openDeleteDialog,
      deleteController,
    }
  },
})
</script>
