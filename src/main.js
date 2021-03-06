/*
 * @Description: file content
 * @Author: mintZ
 * @Date: 2021-02-15 11:28:47
 * @LastEditors: mintZ
 * @LastEditTime: 2021-03-06 21:18:55
 */
import Vue from 'vue';
import ElementUI, { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid';
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';// import styles
import 'quill/dist/quill.snow.css'; // for snow theme
import 'quill/dist/quill.bubble.css'; // for bubble theme

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
// 将富文本编辑器，注册稍为全局可用的组件
Vue.use(VueQuillEditor);
Vue.component('tree-table', TreeTable);
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  // padStart是字符串的方法，所以要先转换为字符串，作用是如果月份不足两位就在前面补个0
  const m = (dt.getMonth() + 1 + '').padStart(2, '0');
  const d = (dt.getDate() + 1 + '').padStart(2, '0');

  const hh = (dt.getHours() + '').padStart(2, '0');
  const mm = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');

  return `${y}-${m}-${d} ${hh}-${mm}-${ss}`;
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
