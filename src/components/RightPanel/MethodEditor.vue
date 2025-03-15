// src/components/RightPanel/MethodEditor.vue
<template>
  <v-card v-if="method" class="mt-4">
    <v-card-title>Редактирование метода: {{ method.name }}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="editState.url"
        label="URL"
        outlined
        @input="markDirty"
      ></v-text-field>
      <v-select
        v-model="editState.type"
        :items="['GET', 'POST', 'PUT', 'DELETE', 'PATCH']"
        label="Тип метода"
        outlined
        @change="markDirty"
      ></v-select>
      <v-text-field
        v-model="editState.summary"
        label="Описание (summary)"
        outlined
        @input="markDirty"
      ></v-text-field>

      <!-- Параметры пути -->
      <h4>Параметры пути</h4>
      <v-row v-for="(param, index) in editState.parameters" :key="index" align="center">
        <v-col cols="4">
          <v-text-field
            v-model="param.name"
            label="Имя"
            outlined
            @input="markDirty"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="param.type"
            :items="simpleTypes"
            label="Тип"
            outlined
            @change="markDirty"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-btn color="error" @click="removeParameter(index)">Удалить</v-btn>
        </v-col>
      </v-row>
      <v-btn color="primary" @click="addParameter">Добавить параметр пути</v-btn>

      <!-- Query параметры -->
      <h4>Query параметры</h4>
      <v-row v-for="(query, index) in editState.queryParams" :key="'query' + index" align="center">
        <v-col cols="4">
          <v-text-field
            v-model="query.name"
            label="Имя"
            outlined
            @input="markDirty"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-select
            v-model="query.type"
            :items="allTypes"
            label="Тип"
            outlined
            @change="markDirty"
          ></v-select>
        </v-col>
        <v-col cols="2">
          <v-btn color="error" @click="removeQueryParam(index)">Удалить</v-btn>
        </v-col>
      </v-row>
      <v-btn color="primary" @click="addQueryParam">Добавить query параметр</v-btn>

      <!-- Request Body -->
      <h4 v-if="editState.type !== 'GET'">Request Body</h4>
      <v-combobox
        v-if="editState.type !== 'GET'"
        v-model="editState.requestBody"
        :items="schemaTypes"
        label="Схемы для тела запроса (множественный выбор)"
        multiple
        chips
        outlined
        @change="markDirty"
      ></v-combobox>

      <!-- Ответы -->
      <h4>Ответы</h4>
      <v-row v-for="(response, index) in editState.responses" :key="'response' + index" align="center">
        <v-col cols="3">
          <v-text-field
            v-model="response.status"
            label="Код ответа"
            outlined
            @input="markDirty"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-combobox
            v-model="response.types"
            :items="allTypes"
            label="Типы данных (множественный выбор)"
            multiple
            chips
            outlined
            @change="markDirty"
          ></v-combobox>
        </v-col>
        <v-col cols="2">
          <v-btn color="error" @click="removeResponse(index)">Удалить</v-btn>
        </v-col>
      </v-row>
      <v-btn color="primary" @click="addResponse">Добавить ответ</v-btn>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="saveMethod">Сохранить</v-btn>
      <v-btn color="error" @click="deleteMethod">Удалить</v-btn>
      <v-btn color="secondary" @click="confirmClose">Закрыть</v-btn>
    </v-card-actions>

    <!-- Диалог подтверждения закрытия -->
    <v-dialog v-model="closeDialog" max-width="400px">
      <v-card>
        <v-card-title>Подтверждение</v-card-title>
        <v-card-text>Схема была изменена, но не сохранена. Сохранить перед закрытием?</v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveAndClose">Сохранить и закрыть</v-btn>
          <v-btn color="error" @click="closeWithoutSaving">Закрыть без сохранения</v-btn>
          <v-btn color="secondary" @click="closeDialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Диалог подтверждения удаления -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Подтверждение удаления</v-card-title>
        <v-card-text>Вы уверены, что хотите удалить метод {{ method?.type }} {{ method?.url }}?</v-card-text>
        <v-card-actions>
          <v-btn color="error" @click="confirmDelete">Удалить</v-btn>
          <v-btn color="secondary" @click="deleteDialog = false">Отмена</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Уведомление об успешном сохранении -->
    <v-alert
      v-model="showSuccessAlert"
      type="success"
      dismissible
      class="success-alert"
    >
      Метод успешно сохранен!
    </v-alert>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, inject, ref, watch } from 'vue';

export default defineComponent({
  name: 'MethodEditor',
  props: {
    method: Object as () => { type: string; name: string; url: string } | null,
  },
  emits: ['update-schema', 'close-form'],
  setup(props, { emit }) {
    const { parsedSchema } = inject('openApiLogic') as any;
    const isDirty = ref(false);
    const closeDialog = ref(false);
    const deleteDialog = ref(false);
    const showSuccessAlert = ref(false);
    let alertTimeout: number | null = null;

    const simpleTypes = ['string', 'number', 'boolean', 'integer'];
    const schemaTypes = Object.keys(parsedSchema.value?.components?.schemas || {});
    const allTypes = [...simpleTypes, ...schemaTypes];

    const editState = ref({
      url: props.method?.url || '',
      type: props.method?.type.toUpperCase() || 'GET',
      summary: props.method?.name || '',
      parameters: [] as { name: string; type: string }[],
      queryParams: [] as { name: string; type: string }[],
      requestBody: [] as string[],
      responses: [] as { status: string; types: string[] }[], // Изменено с type на types
    });

    const updateUrlWithParameters = () => {
      let baseUrl = editState.value.url
        .split('/')
        .filter((part) => !part.startsWith('{') && !part.endsWith('}'))
        .join('/');
      const paramParts = editState.value.parameters.map(
        (p) => `{${p.name || `param${editState.value.parameters.indexOf(p) + 1}`}}`
      );
      editState.value.url = `${baseUrl}/${paramParts.join('/')}`.replace('//', '/');
    };

    const initializeState = () => {
      if (
        !props.method ||
        !parsedSchema.value?.paths[props.method.url]?.[props.method.type.toLowerCase()]
      ) {
        return;
      }
      const methodData = parsedSchema.value.paths[props.method.url][props.method.type.toLowerCase()];

      editState.value.url = props.method.url;
      editState.value.type = props.method.type.toUpperCase();
      editState.value.summary = methodData.summary || '';
      editState.value.parameters = (methodData.parameters || [])
        .filter((p: any) => p.in === 'path')
        .map((p: any) => ({ name: p.name, type: p.schema.type }));
      editState.value.queryParams = (methodData.parameters || [])
        .filter((p: any) => p.in === 'query')
        .map((p: any) => ({
          name: p.name,
          type: p.schema.type || p.schema.$ref?.split('/').pop(),
        }));
      editState.value.requestBody = methodData.requestBody?.content['application/json']?.schema.oneOf
        ? methodData.requestBody.content['application/json'].schema.oneOf.map(
            (s: any) => s.$ref.split('/').pop()
          )
        : methodData.requestBody?.content['application/json']?.schema.$ref
        ? [methodData.requestBody.content['application/json'].schema.$ref.split('/').pop()]
        : [];
      editState.value.responses = Object.entries(methodData.responses || {}).map(
        ([status, resp]: [string, any]) => ({
          status,
          types: resp.content?.['application/json']?.schema.oneOf
            ? resp.content['application/json'].schema.oneOf.map((s: any) => s.$ref.split('/').pop())
            : resp.content?.['application/json']?.schema.$ref
            ? [resp.content['application/json'].schema.$ref.split('/').pop()]
            : [resp.content?.['application/json']?.schema.type || 'string'],
        })
      );
    };

    watch(() => props.method, initializeState, { immediate: true });

    const markDirty = () => {
      isDirty.value = true;
      updateUrlWithParameters();
    };

    const addParameter = () => {
      const newParam = { name: '', type: 'string' };
      editState.value.parameters.push(newParam);
      if (newParam.name) {
        editState.value.url = `${editState.value.url}/{${newParam.name}}`;
      } else {
        editState.value.url = `${editState.value.url}/{param${editState.value.parameters.length}}`;
      }
      markDirty();
    };

    const removeParameter = (index: number) => {
      editState.value.parameters.splice(index, 1);
      updateUrlWithParameters();
      markDirty();
    };

    const addQueryParam = () => {
      editState.value.queryParams.push({ name: '', type: 'string' });
      markDirty();
    };

    const removeQueryParam = (index: number) => {
      editState.value.queryParams.splice(index, 1);
      markDirty();
    };

    const addResponse = () => {
      editState.value.responses.push({ status: '200', types: ['string'] });
      markDirty();
    };

    const removeResponse = (index: number) => {
      editState.value.responses.splice(index, 1);
      markDirty();
    };

    const saveMethod = () => {
      if (!parsedSchema.value || !props.method) return;

      const oldUrl = props.method.url;
      const oldType = props.method.type.toLowerCase();
      const newUrl = editState.value.url;
      const newType = editState.value.type.toLowerCase();

      const newPaths = { ...parsedSchema.value.paths };
      const tag = newPaths[oldUrl]?.[oldType]?.tags?.[0] || 'Uncategorized';

      if (oldUrl !== newUrl || oldType !== newType) {
        delete newPaths[oldUrl][oldType];
        if (Object.keys(newPaths[oldUrl]).length === 0) delete newPaths[oldUrl];
      }

      if (!newPaths[newUrl]) newPaths[newUrl] = {};
      newPaths[newUrl][newType] = {
        summary: editState.value.summary,
        tags: [tag],
        parameters: [
          ...editState.value.parameters.map((p) => ({
            name: p.name,
            in: 'path',
            required: true,
            schema: { type: p.type },
          })),
          ...editState.value.queryParams.map((q) => ({
            name: q.name,
            in: 'query',
            required: false,
            schema: simpleTypes.includes(q.type)
              ? { type: q.type }
              : { $ref: `#/components/schemas/${q.type}` },
          })),
        ],
        responses: editState.value.responses.reduce((acc, resp) => {
          acc[resp.status] = {
            description: '',
            content: {
              'application/json': {
                schema:
                  resp.types.length > 1
                    ? {
                        oneOf: resp.types.map((type) =>
                          simpleTypes.includes(type)
                            ? { type }
                            : { $ref: `#/components/schemas/${type}` }
                        ),
                      }
                    : simpleTypes.includes(resp.types[0])
                    ? { type: resp.types[0] }
                    : { $ref: `#/components/schemas/${resp.types[0]}` },
              },
            },
          };
          return acc;
        }, {} as any),
      };

      if (editState.value.type !== 'GET' && editState.value.requestBody.length > 0) {
        newPaths[newUrl][newType].requestBody = {
          required: true,
          content: {
            'application/json': {
              schema:
                editState.value.requestBody.length > 1
                  ? {
                      oneOf: editState.value.requestBody.map((s) => ({
                        $ref: `#/components/schemas/${s}`,
                      })),
                    }
                  : { $ref: `#/components/schemas/${editState.value.requestBody[0]}` },
            },
          },
        };
      }

      parsedSchema.value = { ...parsedSchema.value, paths: newPaths };
      emit('update-schema', parsedSchema.value);
      isDirty.value = false;

      showSuccessAlert.value = true;
      if (alertTimeout) clearTimeout(alertTimeout);
      alertTimeout = setTimeout(() => {
        showSuccessAlert.value = false;
      }, 5000) as any;
    };

    const deleteMethod = () => {
      deleteDialog.value = true;
    };

    const confirmDelete = () => {
      if (!parsedSchema.value || !props.method) return;

      const url = props.method.url;
      const type = props.method.type.toLowerCase();
      const newPaths = { ...parsedSchema.value.paths };
      delete newPaths[url][type];
      if (Object.keys(newPaths[url]).length === 0) delete newPaths[url];

      parsedSchema.value = { ...parsedSchema.value, paths: newPaths };
      emit('update-schema', parsedSchema.value);
      deleteDialog.value = false;
      emit('close-form');
    };

    const confirmClose = () => {
      if (isDirty.value) {
        closeDialog.value = true;
      } else {
        emit('close-form');
      }
    };

    const saveAndClose = () => {
      saveMethod();
      emit('close-form');
    };

    const closeWithoutSaving = () => {
      closeDialog.value = false;
      emit('close-form');
    };

    return {
      editState,
      simpleTypes,
      allTypes,
      schemaTypes,
      addParameter,
      removeParameter,
      addQueryParam,
      removeQueryParam,
      addResponse,
      removeResponse,
      saveMethod,
      deleteMethod,
      confirmClose,
      saveAndClose,
      closeWithoutSaving,
      closeDialog,
      markDirty,
      showSuccessAlert,
      deleteDialog,
      confirmDelete,
    };
  },
});
</script>

<style scoped>
.success-alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  width: 300px;
}
</style>