<template>
  <div id="app">
    <NavigationBar></NavigationBar>
    <div id="content">
      <router-view />
    </div>
    <!-- 根据路由的 meta 字段判断是否显示页脚 -->
    <Footer v-if="!$route.meta.hideFooter" /> <!-- 如果 hideFooter 为 false，显示页脚 -->
  </div>
</template>

<script>
import NavigationBar from './components/common/NavigationBar.vue';
import Footer from './components/common/Footer.vue';
export default {
  name: 'App',
  components: {
    NavigationBar,
    Footer
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 内容区域 */
#content {
  flex: 1;
  /* 内容区域填充剩余空间 */
  margin-top: 40px;
  /* 为导航栏留出空间，避免内容被遮挡 */
  padding: 10px;
  /* 页面内容的内边距，可根据需要调整 */
}

html,
body {
  height: 100%;
  width: 100%;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>