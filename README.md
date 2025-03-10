# OpenAPI Generator

`Vue.js`-приложение для визуализации и управления OpenAPI-спецификациями. Позволяет загружать YAML/JSON-файлы, отображать конечные точки в виде дерева и добавлять контроллеры/методы.

### Запуск:

Склонировать репозиторий:

```bash
git clone https://github.com/your-username/openapi-generator.git
cd openapi-generator
```

Установить зависимости:

```bash
npm install
```

Запустить:

```bash
npm run dev
```

Открыть в браузере: http://localhost:5173.

### Использование:

Нажать "Загрузить схему", выбрать файл (.yaml, .yml, .json).

Развернуть "Контроллеры", чтобы увидеть методы (например, GET /api/v3/test).

Добавить контроллер через кнопку в шапке ("Добавить контроллер").

Добавить метод через "+" у тега (с tooltip "Добавить метод").

Просмотреть схемы в разделе "Схемы".

Технологии:

<table width="100%">
  <tr>
    <td align="center" valign="middle" width="17%">
      <a href="https://vuejs.org/">
        <img height="50" alt="Vue.js" src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1200px-Vue.js_Logo_2.svg.png"/>
      </a>
      <br />
      Vue.js
    </td>
    <td align="center" valign="middle" width="17%">
      <a href="https://www.npmjs.com/package/@mdi/js">
        <img height="50" alt="Material Design Icons" src="https://pictogrammers.com/images/libraries/mdi.svg"/>
      </a>
      <br />
      Material Design Icons
    </td>
    <td align="center" valign="middle" width="17%">
      <a href="https://www.npmjs.com/package/js-yaml">
        <img height="50" alt="js-yaml" src="https://preview.redd.it/5elcxk7aymf21.png?width=200&format=png&auto=webp&s=6278cd426f8618ccd6512cf7b77e95e0234960f2"/>
      </a>
      <br />
      js-yaml
    </td>
    </tr>
</table>
