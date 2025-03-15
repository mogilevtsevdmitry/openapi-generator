import { ref, onMounted, computed, watch } from 'vue';
import * as yaml from 'js-yaml';
import json5 from 'json5';

export function useOpenApiLogic() {
  const leftPanelWidth = ref(4);
  const isResizing = ref(false);
  const fileInput = ref<HTMLInputElement | null>(null);
  const parsedSchema = ref<any>(null);

  // Загрузка сохраненной ширины из localStorage
  onMounted(() => {
    const savedWidth = localStorage.getItem('leftPanelWidth');
    if (savedWidth) leftPanelWidth.value = parseInt(savedWidth, 10);

    // Загрузка сохраненной схемы из localStorage
    const savedSchema = localStorage.getItem('openApiSchema');
    if (savedSchema) {
      try {
        parsedSchema.value = yaml.load(savedSchema);
        console.log('Схема загружена из localStorage:', parsedSchema.value);
      } catch (e) {
        console.error('Ошибка загрузки схемы из localStorage:', e);
      }
    } else {
      // Тестовая схема при первом запуске
      const testSchema = {
        paths: {
          '/api/v3/test-controller': {
            get: { tags: ['TestController'], summary: 'Тестовый GET' },
            post: { tags: ['TestController'], summary: 'Тестовый POST' },
          },
        },
        components: {
          schemas: {
            TestSchema: {
              type: 'object',
              properties: { id: { type: 'string' } },
            },
          },
          securitySchemes: {
            bearerAuth: {
              type: 'http',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      };
      parsedSchema.value = testSchema;
      console.log('Тестовая схема загружена:', parsedSchema.value);
    }

    // Добавляем securitySchemes, если его нет
    if (parsedSchema.value && !parsedSchema.value.components) {
      parsedSchema.value.components = {};
    }
    if (parsedSchema.value && !parsedSchema.value.components.securitySchemes) {
      parsedSchema.value.components.securitySchemes = {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      };
    }
  });

  // Сохранение схемы в localStorage при изменении
  watch(parsedSchema, (newSchema) => {
    if (newSchema) {
      const yamlString = yaml.dump(newSchema);
      localStorage.setItem('openApiSchema', yamlString);
      console.log('Схема сохранена в localStorage:', newSchema);
    }
  });

  // Начало изменения размера
  const startResize = (e: MouseEvent) => {
    isResizing.value = true;
    document.addEventListener('mousemove', () => resize(e));
    document.addEventListener('mouseup', stopResize);
  };

  // Изменение размера
  const resize = (e: MouseEvent) => {
    if (!isResizing.value) return;
    const totalWidth = window.innerWidth;
    const newWidth = (e.clientX / totalWidth) * 12;
    if (newWidth >= 2 && newWidth <= 10)
      leftPanelWidth.value = Math.round(newWidth);
  };

  // Остановка изменения размера
  const stopResize = () => {
    isResizing.value = false;
    localStorage.setItem('leftPanelWidth', leftPanelWidth.value.toString());
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  };

  // Выгрузка схемы в YAML
  const exportYaml = () => {
    if (!parsedSchema.value) {
      console.error('Нет схемы для выгрузки');
      return;
    }

    try {
      const schemaWithMeta = {
        openapi: parsedSchema.value.openapi || '1.0.0',
        info: parsedSchema.value.info || {
          title: 'Generated OpenAPI Schema',
          version: '1.0.0',
        },
        servers: parsedSchema.value.servers || [],
        paths: parsedSchema.value.paths || {},
        components: parsedSchema.value.components || {},
      };
      // Преобразуем объект parsedSchema в строку YAML
      const yamlString = yaml.dump(schemaWithMeta, {
        indent: 2, // Устанавливаем отступ для читаемости
        noRefs: true, // Избегаем циклических ссылок
      });

      // Создаем Blob с содержимым YAML
      const blob = new Blob([yamlString], { type: 'text/yaml' });

      // Создаем временную ссылку для скачивания
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'openapi-schema.yaml'; // Имя файла по умолчанию
      document.body.appendChild(link);
      link.click();

      // Очищаем после скачивания
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('YAML успешно выгружен');
    } catch (error) {
      console.error('Ошибка при выгрузке YAML:', error);
    }
  };

  // Загрузка схемы
  const uploadSchema = () => {
    if (fileInput.value) {
      fileInput.value.click();
      console.log('Клик по загрузке схемы выполнен');
    } else {
      console.error('fileInput не инициализирован');
    }
  };

  const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    console.log('Событие загрузки файла:', event);
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      console.log('Выбран файл:', file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('Содержимое файла:', content.substring(0, 100) + '...');
        try {
          let parsed;
          if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
            parsed = yaml.load(content);
            console.log('Парсинг YAML успешен:', parsed);
          } else if (file.name.endsWith('.json')) {
            parsed = json5.parse(content);
            console.log('Парсинг JSON успешен:', parsed);
          }
          if (parsed) {
            parsedSchema.value = parsed;
            // Добавляем securitySchemes, если его нет
            if (!parsedSchema.value.components) {
              parsedSchema.value.components = {};
            }
            if (!parsedSchema.value.components.securitySchemes) {
              parsedSchema.value.components.securitySchemes = {
                bearerAuth: {
                  type: 'http',
                  scheme: 'bearer',
                  bearerFormat: 'JWT',
                },
              };
            }
            console.log('Схема загружена в parsedSchema:', parsedSchema.value);
          } else {
            console.error('Парсинг не вернул данные');
          }
        } catch (error) {
          console.error('Ошибка парсинга:', error);
        }
      };
      reader.readAsText(file);
    } else {
      console.error('Файл не выбран или произошла ошибка при чтении');
    }
  };

  // Группировка контроллеров по тегам с методами как тип + URL
  const groupedControllers = computed(() => {
    if (!parsedSchema.value || !parsedSchema.value.paths) {
      console.log('Нет данных paths в схеме:', parsedSchema.value);
      return {};
    }
    const grouped: {
      [key: string]: { type: string; url: string; name?: string }[];
    } = {};
    for (const [path, methods] of Object.entries(parsedSchema.value.paths)) {
      for (const [method, details] of Object.entries(methods as any)) {
        const tag = (details as any).tags?.[0] || 'Uncategorized';
        if (!grouped[tag]) grouped[tag] = [];
        grouped[tag].push({
          type: method.toUpperCase(),
          url: path,
          name: (details as any).summary || `${method.toUpperCase()} ${path}`,
        });
      }
    }
    console.log('Группировка контроллеров:', grouped);
    return grouped;
  });

  // Цвета для типов методов
  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'green lighten-2';
      case 'POST':
        return 'blue lighten-2';
      case 'PUT':
        return 'orange lighten-2';
      case 'DELETE':
        return 'red lighten-2';
      case 'PATCH':
        return 'purple lighten-2';
      default:
        return 'grey lighten-2';
    }
  };

  return {
    leftPanelWidth,
    startResize,
    exportYaml,
    uploadSchema,
    handleFileUpload,
    fileInput,
    parsedSchema,
    groupedControllers,
    getMethodColor,
  };
}
