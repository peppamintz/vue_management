/*
 * @Description: file content
 * @Author: mintZ
 * @Date: 2021-02-15 11:28:47
 * @LastEditors: mintZ
 * @LastEditTime: 2021-03-04 10:30:26
 */
import Vue from 'vue';
import ElementUI, { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid';
import App from './App.vue';
import router from './router';
import store from './store';
import '@/assets/css/global.css';
// 导入全局样式表
import './assets/fonts/iconfont.css';

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// config是请求对象
axios.interceptors.request.use((config) => {
  console.log('____________', config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // config.headers.Authorization = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjUwMCwicmlkIjowLCJpYXQiOjE1ODMyODgxNjMsImV4cCI6MTU4MzM3NDU2M30.LBFXgTMuRJ-D3ozdcdhqRQ10Uou91V-Fuk98PoneaPA';
  // 在最后必须 return config
  return config;
});
Vue.prototype.$http = axios;

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.component('tree-table', TreeTable);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
