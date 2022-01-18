import Vue from 'vue';
import store from './store';
import vuetify from './plugins/vuetify';
import App from './App.vue';
import './styles/styles.scss';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false;

new Vue({
    vuetify,
    store,
    render: h => h(App)
}).$mount('#app');
