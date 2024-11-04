import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/components/HomePage.vue'
import Login from '@/views/Login.vue'
import Home from '@/views/home/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login,
  },
  // {
  //   path: '/home',
  //   component: HomePage,
  //   meta: { requiresAuth: true } //添加元数据，表示需要身份验证 ,
  // },
  {
    path: '/homes',
    component: Home,
    meta: { requiresAuth: true }  //添加元数据，表示需要身份验证 ,
  },

]

const router = new VueRouter({
  routes,
  mode: 'history'
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token');  // 检查是否有 token
  if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    next({ path: '/login' });  // 如果没有 token，重定向到登录页面
  } else {
    next(); // 继续访问
  }
});


export default router
