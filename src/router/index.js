import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginRegister from '@/views/login/LoginRegister.vue'
import Homes from '@/views/home/Homes.vue'
import CourseCenter from '@/views/course/CourseCenter.vue'
import CommunityIndex from '@/views/community/CommunityIndex.vue'
import TeacherIndex from '@/views/teacherInfo/TeacherIndex.vue'
import store from '@/store'; // 引入 Vuex store 来检查登录状态
import PersonalCenter from '@/views/personal/PersonalCenter.vue'
import LiveBroadcast from '@/views/live/LiveBroadcast.vue'
import AITool from '@/views/AItool/AITool.vue'
import Setting from '@/views/personal/Setting.vue'
import CourseDetail from '@/views/course/CourseDetail.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    component: LoginRegister,
    meta: { hideFooter: true }, // 登录页面不显示页脚
  },
  {
    path: '/home',
    component: Homes
  },
  {
    path: '/courses',     //课程安排
    component: CourseCenter,

  },
  {
    path: '/community',    //社区路由
    component: CommunityIndex,

  },
  {
    path: '/teachers',    //师资力量
    component: TeacherIndex,
  },
  {
    path: '/personal',    //个人中心
    component: PersonalCenter
  },
  {
    path: '/live',    //直播组件
    component: LiveBroadcast
  },
  {
    path: '/ai-helper',    //直播组件
    component: AITool
  },
  {
    path: '/settings',
    component: Setting
  },
  {
    path: '/courseDetail',
    component: CourseDetail
  }
]

const router = new VueRouter({
  routes,
  mode: 'history',
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { x: 0, y: 0 };
  },
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  // 判断目标路由的 meta 是否包含 hideFooter 字段
  if (to.meta.hideFooter) {
    // 如果目标页面设置了 hideFooter 为 true，则隐藏页脚
    document.body.classList.add('hide-footer');
  } else {
    // 否则，显示页脚
    document.body.classList.remove('hide-footer');
  }
  // 判断用户是否已登录
  const isLoggedIn = store.state.isLoggedIn || (localStorage.getItem('token') && isTokenValid(localStorage.getItem('token')));

  if (to.path !== '/login' && to.path !== '/home' && !isLoggedIn) {
    // 如果用户未登录，且访问的页面不是登录页或首页，则跳转到登录页
    Vue.prototype.$message({
      message: '请先登录',
      type: 'warning',
      duration: 1000, // 显示 1秒
    });
    next('/login');
  } else {
    // 用户已登录，或访问的是登录页/首页，允许继续跳转
    next();
  }
});

// 判断 token 是否有效
function isTokenValid(token) {
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));  // 解码 JWT token
    const expirationTime = decoded.exp * 1000;  // 将过期时间转换为毫秒
    return expirationTime > Date.now();  // 如果 token 过期时间大于当前时间，则有效
  } catch (e) {
    return false;  // 如果解析 token 失败，认为无效
  }
}

export default router;
