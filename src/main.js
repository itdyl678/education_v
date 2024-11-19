import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import * as echarts from 'echarts';
import { NumberCard, Echarts } from '@jiaminghi/data-view'; // 引入 DataV 组件

Vue.config.productionTip = false   //关闭生产模式的提示
Vue.use(ElementUI)
Vue.prototype.$http = axios       //修改内部的$http为axios
Vue.prototype.$echarts = echarts;
// 注册 DataV 组件
Vue.component('dv-number-card', NumberCard);
Vue.component('dv-echarts', Echarts);

// 设置 Axios 默认请求头
axios.interceptors.request.use(config => {
  const token = sessionStorage.getItem('token');  // 从 sessionStorage 中获取 token
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // 将 token 添加到请求头
  }
  return config;
}, error => {
  return Promise.reject(error); // 对请求错误进行处理
});

// 响应拦截器
axios.interceptors.response.use(response => {
  return response; // 对响应成功的情况进行处理
}, error => {
  if (error.response && error.response.status === 401) {
    // 如果 Token 过期或无效，重定向到登录页面
    // window.location.href = "/login";
  }
  return Promise.reject(error); // 对响应错误进行处理
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
