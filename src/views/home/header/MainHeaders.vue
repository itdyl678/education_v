<template>
    <div class="main-header">
        <el-header>
            <div class="header-content">
                <span class="home-text" @click="goHome">
                    <i class="el-icon-s-data"></i>
                    首页
                    <i class="el-icon-arrow-right"></i>
                </span>
                <span class="path-text">
                    {{ currentPath }}
                </span>
            </div>
        </el-header>
    </div>
</template>

<script>
export default {
    name: 'MainHeaders',
    props: {
        currentPath: {
            type: String,
            default: ''
        }
    },
    methods: {
        goHome() {
            // 检查当前路由是否已是'/homes'
            if (this.$route.path !== '/homes') {
                this.$router.push('/homes'); // 跳转到 homes 页面
            } else {
                window.location.reload(); // 如果已经在'/homes'，则刷新页面
            }
        }
    }
}
</script>

<style scoped>
.main-header {
    width: 100%;
    background-color: rgb(193, 243, 221);
    display: flex;
    align-items: center;
}


.home-text:hover {
    color: rgb(139, 114, 241);
    /* 鼠标悬停时改变颜色 */
    transform: scale(1.1);
    /* 鼠标悬停时放大 */
}

.header-content {
    margin-top: 18px;
    align-items: center;
    height: 60px;
    padding-left: 20px;
}

.home-text {
    font-size: 20px;
    color: rgb(29, 28, 28);
    letter-spacing: 1px;
    cursor: pointer;
    /* 添加鼠标指针样式 */
    transition: color 0.3s, transform 0.3s;
    /* 添加过渡效果 */
}

.path-text {
    font-size: 14px;
    color: #0851be;
    transition: color 0.3s;
    cursor: pointer;
}

.path-text:hover {
    color: rgb(139, 114, 241);
}
</style>
