<template>
    <div class="main-header">
        <el-header>
            <div class="header-content">
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item @click.native="goHome" class="breadcrumb-link">
                        <i class="el-icon-s-home"></i>
                        <span :class="{ 'home-text': true, 'home-clicked': homeClicked }">首页（仪表盘）</span>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="index"
                        :class="{ 'breadcrumb-link': item.clickable }" @click.native="navigateTo(item)">
                        {{ item.meta.title }}
                    </el-breadcrumb-item>
                </el-breadcrumb>
            </div>
        </el-header>
    </div>
</template>

<script>
export default {
    name: 'MainHeaders',
    data() {
        return {
            breadcrumbList: [],
            homeClicked: false, // 用于控制首页点击的视觉效果
        };
    },
    watch: {
        // 监听路由变化，更新面包屑
        $route: {
            immediate: true,
            handler() {
                this.updateBreadcrumb();
            }
        }
    },
    methods: {
        updateBreadcrumb() {
            // 获取当前匹配的路由记录
            const matched = this.$route.matched.filter(item => item.meta && item.meta.title);
            this.breadcrumbList = matched.map((item, index) => {
                return {
                    path: item.path ? this.resolvePath(item.path) : '',
                    meta: item.meta,
                    clickable: index !== matched.length - 1  // 最后一项不可点击
                };
            });
        },
        resolvePath(path) {
            // 处理相对路径，生成完整路径
            let basePath = '';
            for (let i = 1; i < this.$route.matched.length; i++) {
                basePath += '/' + this.$route.matched[i].path;
            }
            return basePath;
        },
        goHome() {
            if (this.$route.path !== '/homes') {
                this.$router.push('/homes');
            } else {
                // 如果已经在首页，添加视觉效果
                this.homeClicked = true;
                setTimeout(() => {
                    this.homeClicked = false;
                }, 500); // 0.5秒后恢复
            }
        },
        navigateTo(item) {
            if (item.clickable) {
                this.$router.push(item.path);
            }
        }
    }
};
</script>

<style scoped>
.main-header {
    width: 100%;
    background-color: rgb(193, 243, 221);
    display: flex;
    align-items: center;
}

.header-content {
    margin-top: 20px;
    align-items: center;
    height: 60px;
    padding-left: 20px;
}

.breadcrumb-link {
    cursor: pointer;
    color: #0851be;
    transition: color 0.3s;
}

.breadcrumb-link:hover {
    color: rgb(139, 114, 241);
}

/* 首页文字样式 */
.home-text {
    transition: transform 0.3s;
}

.home-clicked {
    animation: click-animation 0.5s;
}

@keyframes click-animation {
    0% {
        transform: scale(1);
        color: #0851be;
    }

    50% {
        transform: scale(1.2);
        color: rgb(139, 114, 241);
    }

    100% {
        transform: scale(1);
        color: #0851be;
    }
}
</style>
