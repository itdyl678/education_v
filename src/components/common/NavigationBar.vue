<template>
    <div class="navigation-bar">
        <div class="nav-container">
            <!-- Logo 区域 -->
            <div class="logo-container">
                <router-link to="/">
                    <img src="../../assets/image/首页logo1.jpg" alt="Logo" class="logo" />
                </router-link>
            </div>

            <!-- 导航菜单 -->
            <div class="menu-container">
                <el-menu :default-active="activeIndex" mode="horizontal" background-color="transparent"
                    text-color="rgb(63,63,63)" active-text-color="#409EFF" @select="handleSelect">
                    <el-menu-item index="1"><router-link to="/">首页</router-link></el-menu-item>
                    <el-menu-item index="2"><router-link to="/courses">课程中心</router-link></el-menu-item>
                    <el-menu-item index="3"><router-link to="/teachers">师资力量</router-link></el-menu-item>
                    <el-menu-item index="4"><router-link to="/community">学习社区</router-link></el-menu-item>
                    <el-menu-item index="5"><router-link to="/ai-helper">AI 助手</router-link></el-menu-item>
                    <el-menu-item index="6"><router-link to="/live">直播</router-link></el-menu-item>
                    <!-- “更多”下拉菜单 -->
                    <el-submenu index="7" class="more-submenu">
                        <template slot="title">更多</template>
                        <el-menu-item index="7-1"><router-link to="/option1">选项一</router-link></el-menu-item>
                        <el-menu-item index="7-2"><router-link to="/option2">选项二</router-link></el-menu-item>
                        <el-menu-item index="7-3"><router-link to="/option3">选项三</router-link></el-menu-item>
                    </el-submenu>
                    <!-- “我的”栏目 -->
                    <el-menu-item index="8" v-if="isLoggedIn"><router-link to="/profile">我的</router-link></el-menu-item>
                </el-menu>
            </div>

            <!-- 搜索框 -->
            <div class="search-container">
                <el-input placeholder="搜索" prefix-icon="el-icon-search" v-model="searchQuery" size="medium"
                    @keyup.enter.native="handleSearch"></el-input>
            </div>

            <!-- 语言切换下拉框 -->
            <div class="language-switcher">
                <el-select v-model="language" size="medium" @change="handleLanguageChange">
                    <el-option label="中文" value="zh"></el-option>
                    <el-option label="English" value="en"></el-option>
                </el-select>
            </div>

            <!-- 用户操作区域 -->
            <div class="user-container">
                <div v-if="!isLoggedIn">
                    <!-- 移除了未登录状态下的头像 -->
                    <el-button type="text" @click="goToLogin" class="login-button">登录&注册</el-button>
                </div>
                <div v-else class="user-dropdown">
                    <el-dropdown @command="handleCommand">
                        <span class="el-dropdown-link">
                            <img :src="userAvatar" alt="User Avatar" class="avatar" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                            <el-dropdown-item command="study-record">学习记录</el-dropdown-item>
                            <el-dropdown-item command="settings">设置</el-dropdown-item>
                            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                            <el-dropdown-item command="switch-account">切换账号</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'NavigationBar',
    data() {
        return {
            activeIndex: '1',
            searchQuery: '', // 搜索框的内容
            language: 'zh', // 默认语言
        };
    },
    computed: {
        isLoggedIn() {
            return this.$store.state.isLoggedIn;
        },
        userAvatar() {
            return this.$store.state.userAvatar;
        },
    },

    mounted() {
        console.log('Token:', localStorage.getItem('token'));
        console.log('Is Logged In:', this.isLoggedIn);
    },

    methods: {
        handleSelect(key, keyPath) {
            this.activeIndex = key;
        },
        goToLogin() {
            if (this.$router.currentRoute.path !== '/login') {
                this.$router.push('/login');
            }
        },
        goToRegister() {
            if (this.$router.currentRoute.path !== '/register') {
                this.$router.push('/register');
            }
        },
        handleCommand(command) {
            if (command === 'logout') {
                this.logout();
            } else if (command === 'profile') {
                this.$router.push('/profile');
            } else if (command === 'settings') {
                this.$router.push('/settings');
            } else if (command === 'study-record') {
                this.$router.push('/study-record');
            } else if (command === 'switch-account') {
                this.switchAccount();
            }
        },
        logout() {
            // 退出登录,清除本地存储中的信息
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('avatar');

            // 使用 Vuex 更新状态
            this.$store.commit('setUser', {
                isLoggedIn: false,
                userName: '',
                userAvatar: '',
            });

            if (this.$router.currentRoute.path !== '/home') {
                this.$router.push('/home');
            }
            this.$message.success('已退出登录');
        },
        handleSearch() {
            // 处理搜索逻辑，可以根据 searchQuery 进行路由跳转或发起请求
            this.$router.push({ path: '/search', query: { q: this.searchQuery } });
        },
        handleLanguageChange(value) {
            // 处理语言切换逻辑
            this.$message.success(`语言已切换为 ${value === 'zh' ? '中文' : 'English'}`);
            // 实际应用中，您需要在这里实现语言切换的功能
        },
        switchAccount() {
            // 切换账号逻辑
            this.$message.info('切换账号');
            // 实际应用中，您可以在这里实现切换账号的逻辑
        },
    },
};
</script>

<style scoped>
/* 导航栏整体样式 */
.navigation-bar {
    background-color: #ffffff;
    color: rgb(63, 63, 63);
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
}

/* 导航栏内部容器样式 */
.nav-container {
    position: relative;
    left: -30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    /* 添加此行以均匀分布子元素 */
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Logo容器样式 */
.logo-container {
    position: relative;
    flex: 0 0 auto;
    left: -10px;
    /* 可根据需要设置固定宽度，例如：
    flex: 0 0 150px;
    */
}

/* Logo图片样式 */
.logo {
    margin-top: 30px;
    height: 250px;
    /* 将Logo图片的高度调整为40像素 */
}

/* 菜单容器样式 */
.menu-container {
    flex: 1;
    margin-right: 30px;
}

/* 菜单样式 */
.el-menu {
    background-color: transparent;
    border-bottom: none;
    display: flex;
    align-items: center;
}

/* 菜单项和子菜单标题的字体大小 */
.el-menu-item,
.el-submenu__title {
    font-size: 16px;
}

/* 菜单链接和子菜单标题的文字样式 */
.el-menu-item a,
.el-submenu__title {
    color: rgb(63, 63, 63);
    text-decoration: none;
}

/* 激活状态下的菜单项样式 */
.el-menu-item.is-active a,
.el-submenu.is-active>.el-submenu__title {
    color: #409EFF;
}

/* 悬停效果 */
.el-menu-item:hover>a,
.el-submenu__title:hover {
    color: #409EFF;
}

/* 针对“更多”菜单项的样式调整 */
.more-submenu .el-submenu__title {
    font-size: 16px;
}

/* 搜索框容器样式 */
.search-container {
    flex: 0 0 200px;
    margin-top: 5px;
    margin-right: 10px;
}

/* 搜索框输入框样式 */
.search-container .el-input__inner {
    background-color: #f5f5f5;
    color: #333;
    border-color: #dcdfe6;
}

/* 搜索框占位符样式 */
.search-container .el-input__inner::placeholder {
    color: #999;
    opacity: 1;
}

/* 搜索框前缀图标样式 */
.search-container .el-input__prefix {
    color: #999;
}

/* 语言切换器容器样式 */
.language-switcher {
    flex: 0 0 auto;
    margin-top: 5px;
    /* 去除左侧外边距 */
    margin-left: 0;
}

/* 语言选择框样式 */
.language-switcher .el-select {
    width: 100px;
}

/* 用户操作区域容器样式 */
.user-container {
    position: relative;
    right: -20px;
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    /* 去除左侧外边距 */
    margin-left: 0;
}

/* 用户操作区域内按钮的样式 */
.user-container .el-button {
    margin-left: 10px;
}

/* 用户头像样式 */
.avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    cursor: pointer;
}

/* 用户下拉菜单触发器样式 */
.user-dropdown .el-dropdown-link {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    color: rgb(63, 63, 63);
}

/* 用户头像在下拉菜单中的样式 */
.user-dropdown .avatar {
    margin-right: 5px;
}

/* 下拉菜单项样式 */
.el-dropdown-menu__item {
    text-align: center;
}

/* 下拉菜单项的悬停效果 */
.el-dropdown-menu__item:hover {
    background-color: #f5f7fa;
}

/* 响应式布局：当视口宽度小于等于768像素时 */
@media (max-width: 768px) {

    /* 导航容器样式调整 */
    .nav-container {
        flex-wrap: wrap;
    }

    /* 菜单容器样式调整 */
    .menu-container {
        order: 3;
        width: 100%;
        margin-top: 10px;
    }

    /* 菜单样式调整 */
    .el-menu {
        justify-content: center;
    }

    /* 搜索框容器样式调整 */
    .search-container {
        order: 4;
        width: 100%;
        margin-top: 10px;
    }

    /* 语言切换器容器样式调整 */
    .language-switcher {
        order: 5;
        width: 100%;
        margin-top: 10px;
    }

    /* 用户操作区域容器样式调整 */
    .user-container {
        order: 2;
        width: 100%;
        justify-content: flex-end;
        margin-top: 10px;
    }
}
</style>
