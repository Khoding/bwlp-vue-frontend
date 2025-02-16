import '@/assets/css/main.css';
import 'beercss';
import 'material-dynamic-colors';
import dayjs from 'dayjs';

import { createApp } from '@vue/runtime-dom';
import {createPinia} from 'pinia';

import App from '@/App.vue';
import router from '@/router';
import i18n from '@/i18n';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.use(i18n);

app.config.globalProperties.$dayjs = dayjs;
// app.config.globalProperties.$sat1Server = 'bwlp-pxe.ruf.uni-freiburg.de';
app.config.globalProperties.$sat1Server = '10.4.9.57';

app.mount('#app');
