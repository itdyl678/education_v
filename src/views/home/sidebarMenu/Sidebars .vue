<template>
    <div class="sidebar">
        <el-menu :default-active="activeIndex" @select="handleSelect" background-color="rgb(68, 80, 102)"
            text-color="#fff" active-text-color="yellow" unique-opened>
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-user-solid main-menu-icon"></i>
                    <span class="main-menu-title">用户管理</span>
                </template>
                <router-link tag="el-menu-item" :to="{ path: '/homes/user-info' }" class="sub-menu-item">
                    用户信息
                </router-link>
                <router-link tag="el-menu-item" :to="{ path: '/homes/user-feedback' }" class="sub-menu-item">
                    用户反馈
                </router-link>
                <!-- 其他菜单项 -->
            </el-submenu>
            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-reading main-menu-icon"></i>
                    <span class="main-menu-title">课程管理</span>
                </template>
                <router-link tag="el-menu-item" :to="{ path: '/homes/course-Info' }" class="sub-menu-item">
                    课程信息
                </router-link>
                <el-menu-item index="course-option2" class="sub-menu-item">选项2</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-video-play main-menu-icon"></i>
                    <span class="main-menu-title">视频管理</span>
                </template>
                <el-menu-item index="videos-option1" class="sub-menu-item">视频信息</el-menu-item>
                <el-menu-item index="videos-option2" class="sub-menu-item">选项2</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-s-comment main-menu-icon"></i>
                    <span class="main-menu-title">社区管理</span>
                </template>
                <el-menu-item index="community-option1" class="sub-menu-item">社区信息</el-menu-item>
                <el-menu-item index="community-option2" class="sub-menu-item">选项2</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
                <template slot="title">
                    <i class="el-icon-user-solid main-menu-icon"></i>
                    <span class="main-menu-title">教师管理</span>
                </template>
                <el-menu-item index="community-option1" class="sub-menu-item">教师信息</el-menu-item>
                <el-menu-item index="community-option2" class="sub-menu-item">选项2</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-s-comment main-menu-icon"></i>
                    <span class="main-menu-title">评论管理</span>
                </template>
                <el-menu-item index="community-option1" class="sub-menu-item">教师评论</el-menu-item>
                <el-menu-item index="community-option2" class="sub-menu-item">课程评论</el-menu-item>
                <el-menu-item index="community-option3" class="sub-menu-item">直播评论</el-menu-item>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
export default {
    name: 'Sidebars',
    data() {
        return {
            activeIndex: '1',
        };
    },
    methods: {
        handleSelect(index) {
            this.$emit('select', index); // 触发选中事件
        },
        updatePath(main, sub) {
            this.$emit('update-path', `${main}/${sub}`); // 更新路径
        }
    }
};
</script>

<style scoped>
.sidebar {
    width: 200px;
    height: 100vh;
    /* 侧边栏高度 */
    transition: width 0.3s;
    /* 过渡动画 */
    overflow-y: hidden;
    /* 禁止滚动 */
}

.el-menu {
    height: 100%;
    border-right: none;
    /* 去掉右边框 */
}

.main-menu-title {
    font-size: 16px;
    font-weight: bold;
    margin-left: 15px;
}

.main-menu-icon {
    color: #fff;
}

.sub-menu-item {
    padding-left: 80px !important;
    /* 子菜单项缩进 */
    color: #fff;
}

.sub-menu-item:hover {
    color: rgb(255, 242, 5);
    /* 鼠标悬停时颜色 */
}

.el-menu-item,
.el-submenu__title {
    margin: 0;
    padding: 0;
    border: none;
    /* 去掉边框 */
}
</style>
