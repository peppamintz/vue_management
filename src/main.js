/*
 * @Description: file content
 * @Author: mintZ
 * @Date: 2021-02-15 11:28:47
 * @LastEditors: mintZ
 * @LastEditTime: 2021-02-19 17:53:51
 */
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/css/global.css';

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
