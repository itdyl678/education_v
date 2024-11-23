<template>
  <div id="app">
    <NavigationBar></NavigationBar>
    <router-view />
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