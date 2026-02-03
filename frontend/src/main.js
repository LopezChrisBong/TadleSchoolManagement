import { createApp } from 'vue';
import App from './App.vue';
import './assets/css/global.css';
import vuetify from './plugins/vuetify.js';
import 'vuetify/styles';
import router from './router';
import store from './store';
import mixins from './mixins1.js';
import VueJsonToCsv from "vue-json-to-csv";
import FadeAwayMessage from './components/Alerts/FadeAwayMessage.vue'; // Use .vue directly for simplicity

const app = createApp(App);
window.addEventListener('error', (e) => {
  if (e.message.includes('ResizeObserver loop limit exceeded') || 
      e.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    e.stopImmediatePropagation();
    console.warn('ResizeObserver warning ignored');
  }
});
// Register global component
app.config.productionTip = false;
app.component('fade-away-message-component', FadeAwayMessage);
app.component("vue-json-to-csv", VueJsonToCsv);

app.use(vuetify);
app.use(router);
app.use(store);
app.mixin(mixins);

app.mount('#app');