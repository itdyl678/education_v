<template>
    <div class="login-container">
        <div class="login-box">
            <p>智慧教育后台登录</p>
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="18%"
                @keyup.enter.native="submitForm('ruleForm')"> <!--绑定键盘回车事件-->
                <el-form-item label=" 用户名" prop="name">
                    <el-input v-model="ruleForm.name" autocomplete="off" clearable placeholder="请输入用户名"
                        suffix-icon="el-icon-user-solid"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="checkPass">
                    <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off" placeholder="请输入密码"
                        suffix-icon="el-icon-unlock"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="success" @click="submitForm('ruleForm')">登录</el-button>
                    <el-button @click="resetForm('ruleForm')" type="warning">重置</el-button>
                </el-form-item>
                <div v-if="ruleForm.errorMessage" class="error-message">{{ ruleForm.errorMessage }}</div> <!-- 错误提示 -->
            </el-form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex'; // 确保这里引入了 mapActions
export default {
    name: 'Login',
    data() {
        // 验证规则的逻辑
        var checkName = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('用户名不能为空')); // 回调函数
            }
            if (value.length >= 15) {
                return callback(new Error('用户名过长'));
            } else {
                callback();
            }
        };
        var validatePass = (rule, value, callback) => {
            const passwordRegex = /^[a-zA-Z0-9_]+$/; // 正则表达式
            if (value === '') {
                callback(new Error('请输入密码'));
            }
            if (!passwordRegex.test(value)) {
                return callback(new Error('密码只能包含大小写字母、数字和下划线'));
            } else {
                callback();
            }
        };
        return {
            ruleForm: {
                checkPass: '123456',
                name: 'zhangsan',
                errorMessage: ''
            },
            rules: {
                checkPass: [
                    { validator: validatePass, trigger: 'blur' } // 'blur' 表示失去焦点时触发
                ],
                name: [
                    { validator: checkName, trigger: 'blur' }
                ]
            }
        };
    },

    methods: {
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.login();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        ...mapActions(['setUsername', 'setAvatar']),
        async login() {
            try {
                const loginData = {
                    name: this.ruleForm.name,
                    password: this.ruleForm.checkPass
                };

                const response = await axios.post('http://localhost:8089/admin/login', loginData);
                console.log('Response:', response); // 打印完整的响应
                console.log('Response data:', response.data);

                if (response.status === 200) {
                    const { token, name, avatar } = response.data; // 检查 response.data是否包含 token和name(必须和后端的属性格式一样)
                    const username = name;  //取个别名
                    console.log('Token:', token); // 打印 token
                    console.log("############" + username);
                    console.log("++++++++++++++" + avatar);

                    if (token) {
                        sessionStorage.setItem('token', token); // 保存 token 到 sessionStorage
                        // sessionStorage.setItem('username', username);  //已经在vuex中做了处理
                        // sessionStorage.setItem('avatar', avatar);
                        this.setAvatar(avatar);
                        this.setUsername(username)  //更新Vuex状态 ,保存用户名到 Vuex Store
                    } else {
                        console.error('Token is undefined or null'); // 处理 token 为 undefined 的情况
                    }

                    // 登录成功后，会重定向到用户管理页面
                    this.$router.push('/homes');


                    // 提示框
                    this.$message({
                        message: '登录成功',
                        type: 'success',
                        duration: 1000,
                        center: true
                    });
                }
            } catch (error) {
                this.ruleForm.errorMessage = "登录失败,请检查用户名和密码！";
                console.error('Login error:', error); // 打印错误信息
            }
        }
    }
}
</script>

<style scrop>
* {
    margin: 0px;
    padding: 0px;
}

.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f0f2f5;
    background-image: url('../assets/login.webp');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

.login-box {
    width: 300px;
    padding: 40px;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-box p {
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
    font-weight: bold;
    text-align: center;
}

.error-message {
    color: red;
    /* 错误信息颜色设置为红色 */
    font-size: 14px;
    margin-top: 10px;
    /* 增加与表单项的间距 */
}
</style>
