<template>
    <div class="login-register-container">
        <el-row class="form-container">
            <el-col :span="24" :offset="0">
                <!-- 登录注册切换面板 -->
                <el-card class="login-register-card">
                    <div class="tabs-container">
                        <el-tabs v-model="activeTab" type="border-card">
                            <!-- 登录面板 -->
                            <el-tab-pane label="登录" name="login">
                                <el-form :model="loginForm" :rules="loginRules" ref="loginForm"
                                    @submit.prevent="handleLogin" @keyup.enter.native="handleLogin">
                                    <el-form-item prop="username">
                                        <el-input v-model="loginForm.username" placeholder="请输入用户名">
                                            <template slot="prefix">
                                                <i class="el-icon-user"></i>
                                            </template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码">
                                            <template slot="prefix">
                                                <i class="el-icon-lock"></i>
                                            </template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="handleLogin">登录</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button @click="toggleTab('register')">没有账号？去注册</el-button>
                                    </el-form-item>
                                    <div class="third-party-login">
                                        <img class="third-party-icon qq" src="../../assets/image/qq.png" alt="QQ登录"
                                            @click="handleThirdPartyLogin('qq')" />
                                        <img class="third-party-icon wechat" src="../../assets/image/微信3.png" alt="微信登录"
                                            @click="handleThirdPartyLogin('wechat')" />
                                    </div>
                                </el-form>
                            </el-tab-pane>
                            <!-- 注册面板 -->
                            <el-tab-pane label="注册" name="register">
                                <el-form :model="registerForm" :rules="registerRules" ref="registerForm"
                                    @submit.prevent="handleRegister" @keyup.enter.native="handleRegister">
                                    <el-form-item prop="username">
                                        <el-input v-model="registerForm.username" placeholder="请输入用户名">
                                            <template slot="prefix">
                                                <i class="el-icon-user"></i>
                                            </template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="password">
                                        <el-input v-model="registerForm.password" type="password" placeholder="请输入密码">
                                            <template slot="prefix">
                                                <i class="el-icon-lock"></i>
                                            </template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="phone">
                                        <el-input v-model="registerForm.phone" placeholder="请输入手机号">
                                            <template slot="prefix">
                                                <i class="el-icon-phone"></i>
                                            </template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item prop="verificationCode">
                                        <el-input v-model="registerForm.verificationCode" placeholder="请输入验证码"
                                            class="input-with-prefix-and-append">
                                            <template slot="prefix">
                                                <i class="el-icon-message"></i>
                                            </template>
                                            <template slot="append">
                                                <el-button @click="sendVerificationCode" :loading="loading"
                                                    size="small">获取验证码</el-button>
                                            </template>
                                        </el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button type="primary" @click="handleRegister">注册</el-button>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button @click="toggleTab('login')">已有账号？去登录</el-button>
                                    </el-form-item>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>



<script>
import axios from 'axios';
export default {
    name: 'LoginRegister',
    data() {
        // 手机号正则表达式
        const validatePhone = (rule, value, callback) => {
            const phoneRegex = /^1[3-9]\d{9}$/;
            if (!value) {
                return callback(new Error('请输入手机号'));
            } else if (!phoneRegex.test(value)) {
                return callback(new Error('请输入有效的手机号'));
            } else {
                callback();
            }
        };

        // 验证码校验（6位数字）
        const validateCode = (rule, value, callback) => {
            const codeRegex = /^\d{6}$/;
            if (!value) {
                return callback(new Error('请输入验证码'));
            } else if (!codeRegex.test(value)) {
                return callback(new Error('验证码为6位数字'));
            } else {
                callback();
            }
        };

        return {
            activeTab: 'login', // 默认显示登录页面
            loginForm: {
                username: '张三',
                password: '123456',
            },
            loginRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 15, message: '用户名长度在3到15个字符', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' },
                ],
            },
            registerForm: {
                username: '',
                password: '',
                phone: '',
                verificationCode: '',
            },
            registerRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 2, max: 15, message: '用户名长度在2到15个字符', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' },
                ],
                phone: [
                    { required: true, validator: validatePhone, trigger: 'blur' },
                ],
                verificationCode: [
                    { required: true, validator: validateCode, trigger: 'blur' },
                ],
            },
            loading: false, // 控制验证码按钮的加载状态
        };
    },
    methods: {
        // 切换登录和注册页面
        toggleTab(tab) {
            this.activeTab = tab;
        },
        // 发送验证码（模拟发送）
        sendVerificationCode() {
            // 校验手机号是否正确
            this.$refs.registerForm.validateField('phone', (valid) => {
                if (valid) {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        this.$message.success('验证码已发送');
                    }, 2000);
                } else {
                    this.$message.error('请输入有效的手机号');
                }
            });
        },
        // 登录处理
        handleLogin() {
            this.$refs.loginForm.validate(async (valid) => {
                if (valid) {
                    console.log('登录信息:', this.loginForm.username, this.loginForm.password);
                    try {
                        const response = await axios.post('http://localhost:8089/users/login', {
                            username: this.loginForm.username,
                            password: this.loginForm.password,
                        });
                        // 打印整个响应对象，以查看其具体内容
                        console.log('Response:', response);
                        //处理后端返回的结果，例如保存token
                        if (response.data.success) {
                            this.$message.success('登录成功');
                            //保存token到本地存储
                            localStorage.setItem('token', response.data.data.token);
                            localStorage.setItem('username', response.data.data.name);
                            localStorage.setItem('avatar', response.data.data.avatar);


                            this.$store.dispatch('login', {
                                username: response.data.data.name,
                                avatar: response.data.data.avatar,
                            });

                            //跳转到主页
                            this.$router.push('/home');
                        } else {
                            this.$message.error(response.data.message || '登录失败');
                        }
                    } catch (error) {
                        console.error('登录请求出错', error);
                        this.$message.error('登录失败,请重试');
                    }
                } else {
                    this.$message.error('请检查输入信息');
                    return false;
                }
            });
        },
        // 注册处理
        handleRegister() {
            this.$refs.registerForm.validate((valid) => {
                if (valid) {
                    console.log('注册信息:', this.registerForm.username, this.registerForm.phone, this.registerForm.password, this.registerForm.verificationCode);
                    // 模拟请求
                    this.$message.success('注册成功');
                } else {
                    this.$message.error('请检查输入信息');
                    return false;
                }
            });
        },
        // 处理第三方登录（模拟请求）
        handleThirdPartyLogin(platform) {
            if (platform === 'qq') {
                this.$message.success('QQ登录成功');
            } else if (platform === 'wechat') {
                this.$message.success('微信登录成功');
            }
        }
    },
};
</script>

<style scoped>
/* 设置背景图片 */
.login-register-container {
    background-image: url('../../assets/course/背景图.png');
    /* 设置背景图片 */
    background-size: cover;
    /* 背景填充整个容器 */
    background-position: center;
    /* 背景居中 */
    min-height: 100vh;
    /* 页面最小高度 */
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    position: relative;
}

/* 半透明遮罩层，确保背景图片不干扰内容的可读性 */
.login-register-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    /* 半透明黑色遮罩 */
    z-index: -1;
    /* 背景层在下面 */
}

.form-container {
    width: 100%;
    max-width: 450px;
    padding: 20px;
    box-sizing: border-box;
}

.tabs-container {
    padding: 20px;
}

.el-card {
    border-radius: 8px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.el-tabs__header {
    margin-bottom: 20px;
}

.el-form-item {
    margin-bottom: 20px;
}

.el-input {
    height: 40px;
}

.el-input .el-input__inner {
    padding-left: 40px;
    /* 为前置图标留出空间 */
}

.el-input .el-input__prefix {
    left: 10px;
}

.el-input .el-input__prefix i {
    font-size: 18px;
    color: #909399;
}

.el-button {
    width: 100%;
    height: 40px;
    margin-top: 10px;
}

.el-button.primary {
    background-color: #409eff;
    border-color: #409eff;
}

.el-icon-message {
    margin-top: 10px;
}

.el-button.primary:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
}

.el-message {
    font-size: 14px;
}

.third-party-login {
    margin-top: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
}

.third-party-login .third-party-icon {
    cursor: pointer;
    transition: transform 0.3s ease;
}

.third-party-login .third-party-icon.qq {
    width: 50px;
    height: 50px;
    border-radius: 50%;
}

.third-party-login .third-party-icon.wechat {
    width: 40px;
    height: 40px;
    border-radius: 10px;
}

.third-party-login .third-party-icon:hover {
    transform: scale(1.1);
}

@media (max-width: 768px) {
    .form-container {
        max-width: 100%;
        padding: 15px;
    }
}
</style>
