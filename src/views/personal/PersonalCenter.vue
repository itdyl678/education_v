<template>
    <div class="personal-center">
        <!-- 个人信息卡片 -->
        <el-card class="box-card profile-card">
            <div slot="header" class="clearfix">
                <span>个人中心</span>
            </div>
            <div class="user-info">
                <el-avatar :src="$store.state.userAvatar" size="large"></el-avatar>
                <div class="info">
                    <el-button type="primary" @click="editProfile">编辑个人信息</el-button>
                </div>
                <el-tag type="success">用户状态：正常</el-tag>
            </div>
        </el-card>


        <!-- 成就展示 -->
        <el-card class="box-card achievements">
            <div slot="header" class="clearfix">
                <span>我的成就</span>
            </div>
            <div class="achievements-list">
                <el-row :gutter="20">
                    <el-col :span="8" v-for="(achievement, index) in achievements" :key="index">
                        <div class="achievement">
                            <i :class="achievement.icon" :style="{ color: achievement.color }"></i>
                            <p>{{ achievement.title }}</p>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </el-card>

        <!-- 学习计划 -->
        <el-card class="box-card learning-plan">
            <div slot="header" class="clearfix">
                <span>学习计划</span>
            </div>
            <el-calendar>
                <template slot="dateCell" slot-scope="{ data }">
                    <p :class="data.isSelected ? 'is-selected' : ''">
                        {{ data.day.split('-').slice(1).join('-') }}
                        {{ data.isSelected ? ' ✓' : '' }}
                    </p>
                </template>
            </el-calendar>
            <el-button type="primary" @click="addPlan">新增计划</el-button>
        </el-card>

        <!-- 学习统计 -->
        <el-card class="box-card learning-stats">
            <div slot="header" class="clearfix">
                <span>学习统计</span>
            </div>
            <el-row :gutter="20">
                <el-col :span="12">
                    <div class="stat-box">
                        <p>总学习时间</p>
                        <h2>{{ totalStudyTime }} 小时</h2>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="stat-box">
                        <p>完成课程数</p>
                        <h2>{{ completedCourses }}</h2>
                    </div>
                </el-col>
            </el-row>
            <el-chart :options="chartOptions" style="width: 100%; height: 300px;"></el-chart>
        </el-card>

        <!-- 社区互动 -->
        <el-card class="box-card community">
            <div slot="header" class="clearfix">
                <span>社区互动</span>
            </div>
            <el-tabs v-model="activeTab">
                <el-tab-pane label="最新帖子" name="latest">
                    <el-table :data="latestPosts" style="width: 100%">
                        <el-table-column prop="title" label="标题"></el-table-column>
                        <el-table-column prop="author" label="作者"></el-table-column>
                        <el-table-column prop="date" label="日期"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="viewPost(scope.row)">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="热门帖子" name="hot">
                    <el-table :data="hotPosts" style="width: 100%">
                        <el-table-column prop="title" label="标题"></el-table-column>
                        <el-table-column prop="author" label="作者"></el-table-column>
                        <el-table-column prop="date" label="日期"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="viewPost(scope.row)">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
            <el-button type="primary" @click="createPost">发帖</el-button>
        </el-card>

        <!-- 个性化推荐 -->
        <el-card class="box-card personalized-recommendations">
            <div slot="header" class="clearfix">
                <span>个性化推荐</span>
            </div>
            <el-row :gutter="20">
                <el-col :span="8" v-for="(item, index) in recommendations" :key="index">
                    <el-card :body-style="{ padding: '0px' }">
                        <img :src="item.cover" class="image">
                        <div style="padding: 14px;">
                            <span>{{ item.title }}</span>
                            <div class="bottom clearfix">
                                <time class="time">{{ item.date }}</time>
                                <el-button type="text" class="button" @click="goToResource(item)">了解更多</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </el-card>

        <!-- 消息中心 -->
        <el-card class="box-card message-center">
            <div slot="header" class="clearfix">
                <span>消息中心</span>
            </div>
            <el-table :data="messages" style="width: 100%">
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="content" label="内容"></el-table-column>
                <el-table-column prop="date" label="日期"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="readMessage(scope.row)">查看详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 设置与偏好 -->
        <el-card class="box-card settings">
            <div slot="header" class="clearfix">
                <span>设置与偏好</span>
            </div>
            <el-form :model="settingsForm" label-width="120px">
                <el-form-item label="接收邮件通知">
                    <el-switch v-model="settingsForm.receiveEmailNotifications"></el-switch>
                </el-form-item>
                <el-form-item label="界面主题">
                    <el-select v-model="settingsForm.theme" placeholder="请选择界面主题">
                        <el-option label="默认主题" value="default"></el-option>
                        <el-option label="暗黑模式" value="dark"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="字体大小">
                    <el-slider v-model="settingsForm.fontSize" :min="12" :max="24"></el-slider>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveSettings">保存设置</el-button>
                </el-form-item>
            </el-form>
        </el-card>

    </div>
</template>


<script>
import axios from 'axios';

export default {
    name: 'PersonalCenter',
    data() {
        return {
            user: {
                avatar: '',
            },
            courses: [],
            achievements: [
                { icon: 'el-icon-trophy-1', title: '完成课程 10 个', color: '#f56c6c' },
                { icon: 'el-icon-document-checked', title: '获得证书 5 份', color: '#e6a23c' },
                { icon: 'el-icon-star-on', title: '收藏课程 20 门', color: '#67c23a' }
            ],
            recommendedCourses: [
                { cover: 'https://via.placeholder.com/150', title: 'Python基础教程', date: '2024-01-01' },
                { cover: 'https://via.placeholder.com/150', title: 'JavaScript高级编程', date: '2024-02-01' }
            ],
            totalStudyTime: 0,
            completedCourses: 0,
            chartOptions: {
                title: { text: '学习时间分布' },
                tooltip: {},
                xAxis: { data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"] },
                yAxis: {},
                series: [{ name: '学习时间', type: 'bar', data: [120, 200, 150, 80, 70, 110, 130] }]
            },
            activeTab: 'latest',
            latestPosts: [],
            hotPosts: [],
            messages: [
                { title: '新课程上线', content: 'Python进阶课程已上线！', date: '2024-01-01' },
                { title: '系统维护通知', content: '系统将于今晚12点进行维护，预计持续1小时。', date: '2024-01-02' }
            ],
            recommendations: [
                { cover: 'https://via.placeholder.com/150', title: 'Python基础教程', date: '2024-01-01' },
                { cover: 'https://via.placeholder.com/150', title: 'JavaScript高级编程', date: '2024-02-01' },
                { cover: 'https://via.placeholder.com/150', title: 'React入门指南', date: '2024-03-01' }
            ],
            editDialogVisible: false,
            settingsForm: {
                receiveEmailNotifications: true,
                theme: 'default',
                fontSize: 16
            }
        };
    },
    methods: {
        fetchUserInfo() {
            axios
                .get('/api/user/info')
                .then((response) => {
                    this.user = response.data;
                })
                .catch((error) => {
                    this.$message.error('获取用户信息失败');
                });
        },
        fetchUserCourses() {
            axios
                .get('/api/user/courses')
                .then((response) => {
                    this.courses = response.data;
                })
                .catch((error) => {
                    this.$message.error('获取课程信息失败');
                });
        },
        fetchLearningStats() {
            axios
                .get('/api/user/stats')
                .then((response) => {
                    this.totalStudyTime = response.data.totalStudyTime;
                    this.completedCourses = response.data.completedCourses;
                    this.chartOptions.series[0].data = response.data.dailyStudyTime;
                })
                .catch((error) => {
                    this.$message.error('获取学习统计信息失败');
                });
        },
        fetchCommunityPosts() {
            axios
                .get('/api/community/posts')
                .then((response) => {
                    this.latestPosts = response.data.latest;
                    this.hotPosts = response.data.hot;
                })
                .catch((error) => {
                    this.$message.error('获取社区帖子失败');
                });
        },
        editProfile() {
            this.$router.push('/settings')
        },
        submitEdit() {
            axios
                .post('/api/user/update', this.editForm)
                .then((response) => {
                    this.$message.success('个人信息更新成功');
                    this.editDialogVisible = false;
                    this.fetchUserInfo();
                })
                .catch((error) => {
                    this.$message.error('更新失败');
                });
        },
        goToCourse(course) {
            this.$router.push({ name: 'CourseDetail', params: { id: course.id } });
        },
        addPlan() {
            this.$router.push({ name: 'AddPlan' });
        },
        viewPost(post) {
            this.$router.push({ name: 'PostDetail', params: { id: post.id } });
        },
        createPost() {
            this.$router.push({ name: 'CreatePost' });
        },
        goToResource(resource) {
            if (resource.type === 'course') {
                this.$router.push({ name: 'CourseDetail', params: { id: resource.id } });
            } else if (resource.type === 'article') {
                window.open(resource.url, '_blank');
            } else if (resource.type === 'video') {
                window.open(resource.url, '_blank');
            }
        },
        readMessage(message) {
            this.$router.push({ name: 'MessageDetail', params: { id: message.id } });
        },
        saveSettings() {
            axios
                .post('/api/user/settings', this.settingsForm)
                .then((response) => {
                    this.$message.success('设置保存成功');
                })
                .catch((error) => {
                    this.$message.error('保存设置失败');
                });
        }
    },
    mounted() {
        this.fetchUserInfo();
        this.fetchUserCourses();
        this.fetchLearningStats();
        this.fetchCommunityPosts();
    }
};
</script>

<style scoped>
.personal-center {
    padding: 20px;
    background-color: #f9f9f9;
    min-height: 100vh;
}

.box-card {
    margin-bottom: 20px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.box-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.profile-card .user-info {
    display: flex;
    align-items: center;
    padding: 20px;
}

.profile-card .user-info .el-avatar {
    margin-right: 20px;
}

.profile-card .user-info .info {
    flex-grow: 1;
}

.profile-card .user-info h2 {
    margin: 0;
    font-size: 24px;
    color: #333;
}

.profile-card .user-info p {
    margin: 5px 0;
    color: #666;
}

.learning-plan .el-calendar {
    margin-bottom: 20px;
}

.learning-plan .is-selected {
    color: #1989fa;
}

.learning-stats .stat-box {
    text-align: center;
    padding: 20px;
    border: 1px solid #ebebeb;
    border-radius: 4px;
    transition: all 0.3s ease;
}

.learning-stats .stat-box:hover {
    background-color: #f5f7fa;
    transform: scale(1.05);
}

.community .el-table th {
    background-color: #f5f7fa;
}

.personalized-recommendations .el-card__body {
    padding: 14px;
}

.personalized-recommendations .image {
    width: 100%;
    display: block;
}

.personalized-recommendations .bottom {
    margin-top: 13px;
    line-height: 12px;
}

.personalized-recommendations .button {
    padding: 0;
    float: right;
}

.personalized-recommendations .time {
    font-size: 13px;
    color: #999;
}

.personalized-recommendations .clearfix:before,
.personalized-recommendations .clearfix:after {
    display: table;
    content: "";
}

.personalized-recommendations .clearfix:after {
    clear: both
}

.message-center .el-table th {
    background-color: #f5f7fa;
}

.settings .el-form-item {
    margin-bottom: 20px;
}

.settings .el-form-item__label {
    font-weight: bold;
}

.dialog-footer {
    text-align: right;
}

.el-table .el-button {
    margin-left: 5px;
}

.achievements .achievement:hover {
    background-color: #f5f7fa;
    transform: scale(1.05);
}

.achievements .achievement i {
    font-size: 48px;
    margin-bottom: 10px;
}

.achievements .achievement p {
    font-size: 16px;
    color: #666;
}
</style>