<template>
  <div class="home-page">
    <Headers></Headers>
    <el-container>
      <el-container class="main-container">
        <Sidebars />
        <el-container class="content-container">
          <MainHeaders :currentPath="currentPath"></MainHeaders> <!-- 当前路径标题 -->
          <el-main class="main-content">
            <router-view></router-view> <!--显示路由对应的组件-->
          </el-main>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import TableMain from './dataTable/TableMain.vue'; // 导入数据表组件
import Headers from './header/Headers.vue'; // 导入头部组件
import Sidebars from './sidebarMenu/Sidebars .vue';
import MainHeaders from './header/MainHeaders.vue'; // 导入主头部组件
import UserInfo from './sidebarMenu/siderInfo/UserInfo.vue'; // 用户信息组件
import UserFeedBcak from './sidebarMenu/siderInfo/UserFeedBcak.vue'; // 用户反馈组件

export default {
  name: "Home",
  data() {
    return {
      currentPath: '' // 当前路径
    }
  },

  components: {
    TableMain,
    Sidebars,
    Headers,
    MainHeaders,
    UserInfo,
    UserFeedBcak
  },
  watch: {
    // 监听路由变化，更新 currentPath
    $route(to) {
      this.currentPath = to.path;
    },
  },
  created() {
    this.currentPath = this.$route.path;
  },
};
</script>

<style scoped>
/* 禁止全局滚动，确保页面固定 */
html,
body {
  height: 100%;
  /* 设置高度为100%，使页面充满整个视口 */
  margin: 0;
  /* 去除默认的外边距 */
  padding: 0;
  /* 去除默认的内边距 */
}

.home-page {
  height: 100vh;
  /* 设置主容器占满全屏高度 */
  display: flex;
  /* 使用 Flexbox 布局 */
  flex-direction: column;
  /* 垂直方向排列子元素 */
}

/* 头部固定 */
.Headers {
  position: fixed;
  /* 固定定位，使头部在页面滚动时不移动 */
  top: 0;
  /* 距离顶部0 */
  left: 0;
  /* 距离左边0 */
  right: 0;
  /* 距离右边0 */
  z-index: 1000;
  /* 设置较高的层级，确保头部在其他元素上方 */
  background-color: #a5bddc;
  /* 背景颜色 */
  color: #333;
  /* 字体颜色 */
}

/* 主容器 */
.main-container {
  display: flex;
  /* 使用 Flexbox 布局 */
  flex-direction: row;
  /* 水平方向排列子元素 */
  height: calc(100vh - 80px);
  /* 减去头部的高度，确保主容器占满剩余空间 */
}

/* 侧边栏固定 */
.sidebar {
  width: 200px;
  /* 设置侧边栏宽度 */
  height: 100%;
  /* 设置高度为100%，使其充满可用空间 */
  background-color: rgb(139, 114, 241);
  /* 背景颜色 */
  transition: width 0.3s;
  /* 设置宽度变化时的过渡效果 */
  overflow-y: hidden;
  /* 禁止侧边栏内容的垂直滚动 */
  position: fixed;
  /* 固定定位，使侧边栏在页面滚动时不移动 */
  top: 60px;
  /* 距离顶部60px（头部的高度） */
  bottom: 0;
  /* 距离底部0 */
  left: 0;
  /* 距离左边0 */
  z-index: 999;
  /* 设置较高的层级，确保侧边栏在其他元素上方 */
}

/* 内容容器 */
.content-container {
  flex-grow: 1;
  /* 占满剩余空间 */
  display: flex;
  /* 使用 Flexbox 布局 */
  flex-direction: column;
  /* 垂直方向排列子元素 */
  margin-left: 200px;
  /* 留出侧边栏的宽度 */
  height: 100%;
  /* 设置高度为100%，使内容容器充满可用空间 */
}

/* 主内容区域滚动 */
.main-content {
  padding: 20px;
  /* 内边距，给内容留出空间 */
  overflow: auto;
  /* 设置滚动属性，允许内容区域滚动 */
  flex-grow: 1;
  /* 占满剩余空间 */
}

/* 侧边栏菜单样式 */
.sidebar .el-menu {
  height: 100%;
  /* 设置高度为100%，使菜单充满侧边栏 */
  background-color: rgb(139, 114, 241) !important;
  /* 背景颜色 */
  margin: 0;
  /* 去除默认的外边距 */
  padding: 0;
  /* 去除默认的内边距 */
}

.sidebar .el-menu-item,
.sidebar .el-submenu__title {
  background-color: rgb(139, 114, 241) !important;
  /* 背景颜色 */
  color: white !important;
  /* 字体颜色 */
}
</style>