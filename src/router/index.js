import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/components/HomePage.vue'
import Login from '@/views/Login.vue'
import Home from '@/views/home/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'  // 默认重定向到登录页面
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/homes',
    component: Home,
    meta: { requiresAuth: true }  // 添加元数据，表示需要身份验证
  },
  {
    path: '/homepage',
    component: HomePage,
    meta: { requiresAuth: true }  // 添加元数据，表示需要身份验证
  }
]

const router = new VueRouter({
  routes,
  mode: 'history' // 使用历史模式
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!sessionStorage.getItem('token'); // 从 sessionStorage 检查是否有 token

  if (to.path === '/login' && isAuthenticated) {
    // 如果用户已登录且试图访问登录页面，重定向到首页
    next('/homes');
  } else if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
    // 如果目标路由需要身份验证且用户没有 token，重定向到登录页面
    next('/login');
  } else {
    // 否则放行
    next();
  }
});

export default router;
