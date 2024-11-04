<!-- <template>
    <div style="text-align: center;">
        <h1>后台页面展示</h1>
        <el-button type="danger" @click="logout()" style="width: 8%;">退出登录</el-button>
        <el-button type="success" @click="gotohome()" style="width: 8%;">去后台看看吧</el-button>
    </div>
</template>

<script>
export default {
    name: 'HomePage',
    data() {
        return {

        }
    },
    methods: {
        logout() {
            if (confirm("确认要退出登录吗？")) {
                localStorage.removeItem('token');  //清楚存储的token
                this.$router.push('/login')
            }
        },
        gotohome() {
            this.$router.push('/homes')
        }
    }

}
</script>

<style></style> -->