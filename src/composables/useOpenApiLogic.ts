import { ref, onMounted, computed } from 'vue'
import * as yaml from 'js-yaml'
import json5 from 'json5'

export function useOpenApiLogic() {
    const leftPanelWidth = ref(4)
    const isResizing = ref(false)
    const fileInput = ref<HTMLInputElement | null>(null)
    const parsedSchema = ref<any>(null)

    // Загрузка сохраненной ширины из localStorage
    onMounted(() => {
        const savedWidth = localStorage.getItem('leftPanelWidth')
        if (savedWidth) leftPanelWidth.value = parseInt(savedWidth, 10)
    })

    // Начало изменения размера
    const startResize = (e: MouseEvent) => {
        isResizing.value = true
        document.addEventListener('mousemove', resize)
        document.addEventListener('mouseup', stopResize)
    }

    // Изменение размера
    const resize = (e: MouseEvent) => {
        if (!isResizing.value) return
        const totalWidth = window.innerWidth
        const newWidth = (e.clientX / totalWidth) * 12
        if (newWidth >= 2 && newWidth <= 10) leftPanelWidth.value = Math.round(newWidth)
    }

    // Остановка изменения размера
    const stopResize = () => {
        isResizing.value = false
        localStorage.setItem('leftPanelWidth', leftPanelWidth.value.toString())
        document.removeEventListener('mousemove', resize)
        document.removeEventListener('mouseup', stopResize)
    }

    // Обработчики кнопок
    const addSchema = () => console.log('Добавить схему')
    const exportYaml = () => console.log('Выгрузить YAML')
    const addController = () => console.log('Добавить контроллер')

    // Загрузка схемы
    const uploadSchema = () => {
        if (fileInput.value) {
            fileInput.value.click()
            console.log('Клик по загрузке схемы выполнен')
        } else {
            console.error('fileInput не инициализирован')
        }
    }

    const handleFileUpload = (event: Event) => {
        const target = event.target as HTMLInputElement
        console.log('Событие загрузки файла:', event)
        if (target.files && target.files.length > 0) {
            const file = target.files[0]
            console.log('Выбран файл:', file.name)
            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target?.result as string
                console.log('Содержимое файла:', content.substring(0, 100) + '...')
                try {
                    let parsed
                    if (file.name.endsWith('.yaml') || file.name.endsWith('.yml')) {
                        parsed = yaml.load(content)
                        console.log('Парсинг YAML успешен:', parsed)
                    } else if (file.name.endsWith('.json')) {
                        parsed = json5.parse(content)
                        console.log('Парсинг JSON успешен:', parsed)
                    }
                    if (parsed) {
                        parsedSchema.value = parsed
                        console.log('Схема загружена в parsedSchema:', parsedSchema.value)
                    } else {
                        console.error('Парсинг не вернул данные')
                    }
                } catch (error) {
                    console.error('Ошибка парсинга:', error)
                }
            }
            reader.readAsText(file)
        } else {
            console.error('Файл не выбран или произошла ошибка при чтения')
        }
    }

    // Добавление метода для контроллера
    const addMethodForController = (controllerTag: string, methodType: string) => {
        console.log(`Добавить метод ${methodType} для контроллера: ${controllerTag}`)
    }

    // Группировка контроллеров по тегам с методами как тип + URL
    const groupedControllers = computed(() => {
        if (!parsedSchema.value || !parsedSchema.value.paths) {
            console.log('Нет данных paths в схеме:', parsedSchema.value)
            return {}
        }
        const grouped: { [key: string]: { type: string; url: string; name?: string }[] } = {}
        for (const [path, methods] of Object.entries(parsedSchema.value.paths)) {
            for (const [method, details] of Object.entries(methods as any)) {
                const tag = details.tags?.[0] || 'Uncategorized'
                if (!grouped[tag]) grouped[tag] = []
                grouped[tag].push({
                    type: method.toUpperCase(),
                    url: path,
                    name: details.summary || `${method.toUpperCase()} ${path}`,
                })
            }
        }
        console.log('Группировка контроллеров:', grouped)
        return grouped
    })

    // Цвета для типов методов
    const getMethodColor = (method: string) => {
        switch (method.toUpperCase()) {
            case 'GET': return 'green lighten-2'
            case 'POST': return 'blue lighten-2'
            case 'PUT': return 'orange lighten-2'
            case 'DELETE': return 'red lighten-2'
            case 'PATCH': return 'purple lighten-2'
            default: return 'grey lighten-2'
        }
    }

    return {
        leftPanelWidth,
        startResize,
        addSchema,
        exportYaml,
        addController,
        uploadSchema,
        handleFileUpload,
        fileInput,
        parsedSchema,
        groupedControllers,
        addMethodForController,
        getMethodColor,
    }
}