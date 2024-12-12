<template>
    <div class="settings-container" v-loading="loading">
        <el-tabs v-model="activeTab" tab-position="left" style="height: 100%;">
            <el-tab-pane label="个人信息" name="profile">
                <div class="profile-settings">
                    <el-form :model="userProfile" label-width="120px" label-position="top"
                        style="max-width: 800px; margin: 0 auto;">
                        <el-row :gutter="20">
                            <el-col :span="12" class="form-item-center">
                                <el-form-item label="用户名">
                                    <el-input v-model="userProfile.username"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="form-item-center">
                                <el-form-item label="密码">
                                    <el-input v-model="userProfile.password" type="password" placeholder="输入新密码"
                                        disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12" class="form-item-center">
                                <el-form-item label="性别">
                                    <el-radio-group v-model="userProfile.gender">
                                        <el-radio label="男">男</el-radio>
                                        <el-radio label="女">女</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="form-item-center">
                                <el-form-item label="年龄">
                                    <el-input-number v-model="userProfile.age" :min="0" :max="100"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12" class="form-item-center">
                                <el-form-item label="身份证号">
                                    <el-input v-model="userProfile.idCard"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="form-item-center">
                                <el-form-item label="电话">
                                    <el-input v-model="userProfile.phone"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12" class="form-item-center">
                                <el-form-item label="邮箱">
                                    <el-input v-model="userProfile.email"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" class="form-item-center">
                                <el-form-item label="头像">
                                    <el-upload class="avatar-uploader" action="http://localhost:8089/upload/avatar"
                                        :show-file-list="false" :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload">
                                        <img v-if="userProfile.avatar" :src="userProfile.avatar" class="avatar">
                                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                    </el-upload>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-button type="primary" @click="saveProfile"
                            style="width: 100%; margin-top: 20px;">保存并修改</el-button>
                    </el-form>
                </div>
            </el-tab-pane>

            <el-tab-pane label="安全设置" name="security">
                <div class="security-settings">
                    <el-form label-width="120px" label-position="top" style="max-width: 400px; margin: 0 auto;">
                        <el-form-item label="修改密码">
                            <el-input v-model="passwordForm.oldPassword" placeholder="旧密码" type="password"></el-input>
                            <el-input v-model="passwordForm.newPassword" placeholder="新密码" type="password"
                                style="margin-top: 10px;"></el-input>
                            <el-input v-model="passwordForm.confirmPassword" placeholder="确认新密码" type="password"
                                style="margin-top: 10px;"></el-input>
                            <el-button type="primary" @click="changePassword"
                                style="margin-top: 10px; width: 100%;">修改密码</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>

            <el-tab-pane label="通知设置" name="notifications">
                <div class="notifications-settings">
                    <el-form label-width="150px" label-position="top" style="max-width: 400px; margin: 0 auto;">
                        <el-form-item label="电子邮件通知">
                            <el-switch v-model="notificationSettings.email"></el-switch>
                        </el-form-item>
                        <el-form-item label="短信通知">
                            <el-switch v-model="notificationSettings.sms"></el-switch>
                        </el-form-item>
                        <el-form-item label="推送通知">
                            <el-switch v-model="notificationSettings.push"></el-switch>
                        </el-form-item>
                        <el-button type="primary" @click="saveNotificationSettings"
                            style="width: 100%;">保存通知设置</el-button>
                    </el-form>
                </div>
            </el-tab-pane>

            <el-tab-pane label="隐私设置" name="privacy">
                <div class="privacy-settings">
                    <el-form label-width="150px" label-position="top" style="max-width: 400px; margin: 10px auto;">
                        <el-form-item label="允许搜索">
                            <el-switch v-model="privacySettings.allowSearch"></el-switch>
                        </el-form-item>
                        <el-form-item label="分享学习记录">
                            <el-switch v-model="privacySettings.shareStudyRecord"></el-switch>
                        </el-form-item>
                        <el-button type="primary" @click="savePrivacySettings" style="width: 100%;">保存隐私设置</el-button>
                    </el-form>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Setting',
    data() {
        return {
            loading: false, // 添加加载状态
            activeTab: 'profile',
            userProfile: {
                username: '',
                password: '',
                gender: '',
                age: '',
                idCard: '',
                phone: '',
                email: '',
                avatar: ''
            },
            passwordForm: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            notificationSettings: {
                email: true,
                sms: false,
                push: true
            },
            privacySettings: {
                allowSearch: true,
                shareStudyRecord: false
            }
        };
    },
    mounted() {
        this.fetchUserData();
    },
    methods: {
        //获取用户数据
        async fetchUserData() {
            const id = localStorage.getItem('id');
            const token = localStorage.getItem('token');
            if (!id || !token) {
                this.$message.error('用户未登录或用户ID不存在');
                return;
            }
            this.loading = true;
            try {
                const response = await axios.get(`http://localhost:8089/users/${id}`);
                const data = response.data;

                //打印后端传入的对象信息
                console.dir(data);

                //更新用户个人信息
                this.userProfile = {
                    username: data.username,
                    password: '', //密码通常不返回
                    gender: data.gender,
                    age: data.age,
                    idCard: data.idCard,
                    phone: data.phone,
                    email: data.email,
                    avatar: data.avatar
                };
            } catch (error) {
                console.error('获取用户数据失败：', error);
                this.$message.error('获取用户数据失败，请稍后重试')
            } finally {
                this.loading = false;
            }
        },

        async saveProfile() {
            const userId = localStorage.getItem('id');
            try {
                const response = await axios.put(`http://localhost:8089/users/updateUser/${userId}`, this.userProfile)

                if (response.data != null) {
                    //获取后端传过来的头像信息
                    const newAvatar = response.data;

                    //更新Vuex和localSorage中的头像
                    this.$store.commit('setUser', {
                        isLoggedIn: true,
                        userName: this.$store.state.userName,
                        userAvatar: newAvatar,
                    });

                    localStorage.setItem('avatar', newAvatar);
                }
                this.$message.success('个人信息已保存');
            } catch (error) {
                console.error('保存个人信息失败：', error);
                this.$message.error('保存个人信息失败,请稍后重试。')
            }
        },
        async changePassword() {
            if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
                this.$message.error('两次输入的新密码不一致');
                return;
            }
            try {
                await axios.post('', {
                    oldPassword: this.passwordForm.oldPassword,
                    newPassword: this.passwordForm.newPassword
                });
                this.$message.success('密码已修改');
                //清空密码表单
                this.passwordForm.oldPassword = '',
                    this.passwordForm.newPassword = '',
                    this.passwordForm.confirmPassword = ''
            } catch (error) {
                console.error('修改密码失败', error);
                this.$message.error('修改密码失败,请稍后重试');
            }

            // 调用API修改密码
        },
        saveNotificationSettings() {
            this.$message.success('通知设置已保存');
            // 调用API保存通知设置
        },
        savePrivacySettings() {
            this.$message.success('隐私设置已保存');
            // 调用API保存隐私设置
        },
        // 上传成功回调，response里应该包含图片的访问URL
        handleAvatarSuccess(response) {
            // 假设后端返回: { code: 0, url: 'http://localhost:8089/uploads/xxxx.jpg' }
            if (response && response.code === 0) {
                this.userProfile.avatar = response.url;
                console.log('头像地址' + response.url)
                this.$message.success('头像上传成功');
            } else {
                this.$message.error('头像上传失败，请稍后重试');
            }
        },
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
        }
    }
};
</script>

<style scoped>
.settings-container {
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
}

.profile-settings {
    margin-left: 350px;
}

.el-tabs {
    flex-grow: 1;
    display: flex;
}

.el-tabs__content {
    flex-grow: 1;
    overflow-y: auto;
}

.el-tab-pane {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* 居中对齐表单 */
}

.el-form {
    width: 100%;
}

.form-item-center {
    display: flex;
    justify-content: center;
    align-items: center;
}

.el-form-item {
    margin-bottom: 20px;
    width: 100%;
    /* 确保表单项占据整个宽度 */
}

.el-button {
    margin-top: 20px;
    width: 100%;
    /* 确保按钮占据整个宽度 */
}

.avatar-uploader {
    width: 100px;
    height: 100px;
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    overflow: hidden;
    position: relative;
}

.avatar {
    width: 100%;
    height: 100%;
    display: block;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    line-height: 100px;
    text-align: center;
}
</style>