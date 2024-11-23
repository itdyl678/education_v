import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginRegister from '@/views/login/LoginRegister.vue'
import Homes from '@/views/home/Homes.vue'
import CourseCenter from '@/views/course/CourseCenter.vue'
import CommunityIndex from '@/views/community/CommunityIndex.vue'
import TeacherIndex from '@/views/teacherInfo/TeacherIndex.vue'
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
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
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

  next(); // 继续路由跳转
});
export default router
