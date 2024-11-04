import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import * as echarts from 'echarts';
import { NumberCard, Echarts } from '@jiaminghi/data-view'; // 引入 DataV 组件

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = axios       //修改内部的$http为axios
Vue.prototype.$echarts = echarts;
// 注册 DataV 组件
Vue.component('dv-number-card', NumberCard);
Vue.component('dv-echarts', Echarts);

//设置Axios 默认请求头
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');  // 从localStorage 中获取 token
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; //将token添加到请求头
  }
  return config;
}, error => {
  return Promise.reject(error);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
