// src/components/Headers.vue
<template>
    <div>
        <el-header class="header1">
            <div class="header-content">
                <div class="left-content">
                    <i class="el-icon-s-home"></i>
                    智慧教育后台管理
                </div>

                <div class="right-content">
                    <span class="bell">
                        <i class="el-icon-bell"></i>
                    </span>
                    <span>
                        <img src="../../../assets/image/OIP.jpg" alt="头像" class="avatar" />
                        <span> {{ username }} &nbsp; | </span>
                    </span>
                    <el-dropdown>
                        <span class="language-toggle">
                            <i class="el-icon-sort"></i>
                            切换语言
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>中文繁体</el-dropdown-item>
                            <el-dropdown-item>英语 & English</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>

                    <el-dropdown>
                        <span class="language-toggle">
                            退出
                            <i class="el-icon-position"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>
                                <el-link type="success" :underline="false">修改密码</el-link>
                            </el-dropdown-item>
                            <el-dropdown-item>
                                <el-link type="danger" :underline="false" @click="logout()">退出登录</el-link>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </el-header>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'; // 引入 mapGetters

export default {
    name: 'Headers',
    computed: {
        ...mapGetters(['getUsername']), // 映射 getUsername getter
        username() {
            return this.getUsername;
        }
    },
    methods: {
        logout() {
            this.$confirm('确定要退出登录吗？是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                localStorage.removeItem('token');  // 清除存储的 token
                this.$router.push('/login')
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消成功！'
                });
            });
        }
    }
}
</script>

<style scoped>
.header1 {
    background-color: rgb(68, 80, 102);
    color: #333;
    line-height: 60px;
}

.linkTo {
    color: rgb(232, 243, 251);
    margin-left: 10px;
    font-size: 12px;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    /* 添加左右内边距 */
}

.page-content {
    color: rgb(232, 243, 251);
    margin-right: 20px;
}

.left-content {
    font-size: 22px;
    font-weight: bold;
    margin-left: 0px;
    color: rgb(232, 243, 251);
}

.bell {
    margin-right: 50px;
}

.right-content {
    display: flex;
    align-items: center;
    color: rgb(232, 243, 251);
    margin-right: 20px;
}

.language-toggle {
    margin-left: 20px;
    color: rgb(232, 243, 251);
}

.avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    transform: translateY(10px);
    /* 向下移动10px */
}
</style>