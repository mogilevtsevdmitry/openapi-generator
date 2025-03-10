<template>
  <v-col class="right-panel">
    <div class="panel-content">
      <h3>Редактирование</h3>
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
      <p v-else>Выберите контроллер слева для редактирования</p>

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
    </div>
  </v-col>
</template>

<script lang="ts">
import { defineComponent, ref, inject, watch, computed } from 'vue'
import * as yaml from 'js-yaml'

export default defineComponent({
  name: 'RightPanel',
  props: {
    selectedTag: String,
  },
  setup(props, { emit }) {
    const {
      parsedSchema,
      groupedControllers,
      addMethodForController,
      getMethodColor,
    } = inject('openApiLogic') as any

    // Состояние формы
    const isEditing = ref(false)
    const deleteDialog = ref(false)

    // Объекты для состояния
    const initialState = ref<{ tag: string; requiresAuth: boolean }>({
      tag: '',
      requiresAuth: false,
    })
    const editState = ref<{ tag: string; requiresAuth: boolean }>({
      tag: '',
      requiresAuth: false,
    })

    // Синхронизация с пропсом selectedTag и загрузка requiresAuth
    watch(
        () => props.selectedTag,
        (newTag) => {
          console.log('selectedTag changed to:', newTag, { initialState: initialState.value, editState: editState.value }) // Отладка
          if (newTag) {
            isEditing.value = true
            // Проверяем requiresAuth в parsedSchema
            let requiresAuth = false
            if (parsedSchema.value && parsedSchema.value.paths) {
              for (const [_, methods] of Object.entries(parsedSchema.value.paths) as [string, any]) {
                for (const [_, details] of Object.entries(methods)) {
                  if (details.tags?.[0] === newTag && details.security) {
                    requiresAuth = true
                    break
                  }
                }
                if (requiresAuth) break
              }
            }
            initialState.value = { tag: newTag, requiresAuth } // Сохраняем исходное состояние
            editState.value = { ...initialState.value } // Копируем в редактируемое состояние
          } else {
            isEditing.value = false
            initialState.value = { tag: '', requiresAuth: false }
            editState.value = { ...initialState.value }
          }
        },
        { immediate: true } // Выполнить сразу при монтировании
    )

    // Сохранение контроллера
    const saveController = () => {
      console.log('Start saveController', {
        parsedSchema: parsedSchema.value,
        editState: editState.value,
        initialState: initialState.value,
        groupedControllers: groupedControllers.value,
      })
      if (!parsedSchema.value) {
        console.warn('parsedSchema is null')
        return
      }
      if (!editState.value.tag) {
        console.warn('editState.tag is empty')
        return
      }

      const oldTag = initialState.value.tag
      const newTag = editState.value.tag

      if (!groupedControllers.value[oldTag]) {
        console.warn('Old tag not found in groupedControllers:', oldTag, groupedControllers.value)
        return
      }

      console.log('Saving controller: oldTag=', oldTag, 'newTag=', newTag, 'requiresAuth=', editState.value.requiresAuth) // Отладка
      // Обновляем теги и security в parsedSchema
      const newPaths = Object.fromEntries(
          Object.entries(parsedSchema.value.paths).map(([path, details]: [string, any]) => {
            const newDetails = { ...details }
            Object.keys(newDetails).forEach((method) => {
              const methodDetails = newDetails[method]
              if (methodDetails.tags?.[0] === oldTag) {
                // Обновляем тег
                methodDetails.tags[0] = newTag
                // Обновляем security
                if (editState.value.requiresAuth) {
                  methodDetails.security = [{ bearerAuth: [] }] // Пример схемы авторизации
                } else {
                  delete methodDetails.security
                }
              }
            })
            return [path, newDetails]
          })
      )
      const newSchema = { ...parsedSchema.value, paths: newPaths }
      console.log('New schema before update:', newSchema)
      parsedSchema.value = newSchema // Обновляем весь объект
      console.log('parsedSchema updated:', parsedSchema.value)
      emit('update-schema', parsedSchema.value)
      emit('close-form') // Сбрасываем форму
      isEditing.value = false
    }

    // Удаление контроллера
    const openDeleteDialog = () => {
      deleteDialog.value = true
    }

    const deleteController = () => {
      if (parsedSchema.value && editState.value.tag) {
        console.log('Deleting controller:', editState.value.tag) // Отладка
        const newPaths = Object.fromEntries(
            Object.entries(parsedSchema.value.paths).filter(([_, details]: [string, any]) => {
              return !Object.values(details).some((methodDetails: any) => methodDetails.tags?.[0] === editState.value.tag)
            })
        )
        const newSchema = { ...parsedSchema.value, paths: newPaths }
        parsedSchema.value = newSchema // Обновляем весь объект
        delete groupedControllers.value[editState.value.tag]
        emit('update-schema', parsedSchema.value)
        emit('close-form') // Сбрасываем форму
      }
      deleteDialog.value = false
      isEditing.value = false
    }

    return {
      isEditing,
      editState,
      requiresAuth: computed(() => editState.value.requiresAuth), // Для совместимости с шаблоном
      deleteDialog,
      saveController,
      openDeleteDialog,
      deleteController,
    }
  },
})
</script>

<style scoped>
/* Стили для панели */
.panel-content {
  padding: 16px;
}
</style>