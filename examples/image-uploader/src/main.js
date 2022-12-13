import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from './App.vue';
import router from './router';

import './assets/main.css';
import { createHead } from '@vueuse/head';

const app = createApp(App);
const head = createHead();

app.use(createPinia());
app.use(router);
app.use(Toast);
app.use(head);

app.mount('#app');
