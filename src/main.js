import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';  // 引入 Element UI 的样式

// 在 Vue 实例化之前恢复 Vuex 状态
store.dispatch('initializeStore');
Vue.config.productionTip = false
// 将 axios 添加到 Vue 原型上，这样在组件中可以直接通过 this.$axios 使用
Vue.prototype.$axios = axios;
Vue.use(ElementUI);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
