import '@mdi/font/css/materialdesignicons.css';
import { createApp } from 'vue';

// @ts-ignore
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

// @ts-ignore
import App from './App.vue';
import './assets/styles.css'; // Подключаем стили

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
  },
});

createApp(App).use(vuetify).mount('#app');
