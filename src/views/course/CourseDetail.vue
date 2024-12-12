<template>
    <div id="app">
        <!-- 背景图模块 -->
        <div class="course-background">
            <img :src="courseBackgroundImage" alt="Course Background" class="background-image" />
            <!-- 新增的内容覆盖在背景图上 -->
            <div class="background-content">
                <div class="background-left">
                    <h2 class="course-title">{{ courseTitle }}</h2>
                    <p class="course-start-date">开课时间：{{ courseStartDate }}</p>
                    <p class="course-enrollment">已报名人数：{{ enrolledStudents }}人</p>
                </div>
                <div class="background-right">
                    <el-button type="primary" class="register-button" @click="registerCourse">
                        立即报名
                    </el-button>
                </div>
            </div>
        </div>

        <!-- 课程介绍模块 -->
        <div class="course-intro-container">
            <div class="course-intro-left">
                <h2>课程介绍</h2>
                <p>{{ courseDescription }}</p>
            </div>
            <div class="course-intro-right">
                <!-- 修改开始：将视频播放区域改为可点击，并添加播放图标 -->
                <div class="video-player-mockup" @click="playVideo">
                    <div class="play-icon"></div>
                </div>
                <!-- 修改结束 -->
            </div>
        </div>

        <!-- 课程详细介绍模块 -->
        <div class="course-details">
            <h2>课程详情</h2>
            <p>{{ courseDetailedDescription }}</p>
            <ul>
                <li v-for="(item, index) in courseContent" :key="index">{{ item }}</li>
            </ul>
        </div>

        <!-- 课程老师简介模块 -->
        <div class="instructor-section">
            <h2>课程讲师</h2>
            <hr>
            <div class="instructor-info">
                <img :src="instructorPhoto" alt="Instructor Photo" class="instructor-photo" />
                <div class="instructor-details">
                    <h3>{{ instructorName }}</h3>
                    <p>{{ instructorTitle }}</p>
                    <p>{{ instructorDescription }}</p>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    name: 'CourseDetail',
    data() {
        return {
            // 背景图
            courseBackgroundImage: require('../../assets/course/课程详情背景图.png'), // 请替换为实际的背景图路径

            // 课程信息
            courseTitle: '心理学基础导论', // 课程主题
            courseStartDate: '2024年1月10日', // 开课时间
            enrolledStudents: 120, // 已报名人数
            courseDescription: '本课程为心理学基础导论课，以心理学的经典理论和最新实证研究为蓝本...',

            // 课程详细介绍
            courseDetailedDescription: '本课程将帮助学生全面理解心理学的基础理论，介绍心理学的研究方法及应用...',
            courseContent: [
                '第一章：心理学的基础',
                '第二章：积极心理学',
                '第三章：心理学研究方法',
                '第四章：情绪与行为',
                '第五章：期末总结'
            ],

            // 讲师信息
            instructorPhoto: require('../../assets/image/qq.png'), // 请替换为实际的老师照片路径
            instructorName: '张教授',
            instructorTitle: '心理学博士',
            instructorDescription: '张教授，长期从事心理学基础研究，具有丰富的教学经验...',
        };
    },
    methods: {
        registerCourse() {
            // 处理报名逻辑，例如跳转到报名页面
            window.location.href = '/register'; // 请替换为实际的报名链接
        },
        playVideo() {
            // 处理视频播放逻辑，例如跳转到视频播放页面或打开视频播放器
            window.location.href = '/course-video'; // 请替换为实际的视频链接
        },
    },
};
</script>

<style scoped>
/* 页面总体样式 */
#app {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
}

/* 背景图模块 */
.course-background {
    position: relative;
    width: 100%;
    height: 400px;
    overflow: hidden;
}

.background-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* 新增的覆盖在背景图上的内容 */
.background-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    color: #fff;
}

.background-left {
    flex: 1;
    padding: 50px 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.course-title {
    font-size: 40px;
    font-weight: bold;
    margin: 0;
}

.course-start-date,
.course-enrollment {
    font-size: 20px;
    margin-top: 10px;
}

.background-right {
    width: 300px;
    padding: 50px 80px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.register-button {
    font-size: 20px;
    padding: 10px 30px;
}

/* 课程介绍模块 */
.course-intro-container {
    display: flex;
    padding: 40px 20px;
    background-color: #f9f9f9;
}

.course-intro-left,
.course-intro-right {
    flex: 1;
    padding: 0 20px;
}

.course-intro-left h2 {
    font-size: 28px;
    font-weight: bold;
}

.course-intro-left p {
    font-size: 18px;
    color: #555;
    margin-top: 10px;
}

/* 修改开始：视频播放区域样式 */
.video-player-mockup {
    width: 100%;
    padding-top: 56.25%;
    /* 16:9 aspect ratio */
    background: #000 url('../../assets/course/UI.png') no-repeat center;
    /* 请替换为实际的视频缩略图路径 */
    background-size: cover;
    border: 2px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: relative;
    cursor: pointer;
}

.play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 64px;
    height: 64px;
    background: url('../../assets/image/viewlog.png') no-repeat center;
    /* 请替换为实际的播放图标路径 */
    background-size: contain;
}

/* 修改结束 */

/* 课程详细介绍模块 */
.course-details {
    padding: 40px 20px;
    background-color: #ffffff;
}

.course-details h2 {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
}

.course-details p {
    font-size: 18px;
    text-align: center;
    line-height: 1.8;
    color: #333;
}

.course-details ul {
    padding-left: 20px;
}

.course-details ul li {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
}

/* 课程老师简介模块 */
.instructor-section {
    padding: 40px 20px;
    background-color: #f9f9f9;
}

.instructor-section h2 {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
}

.instructor-info {
    margin-top: 20px;
    text-align: center;
    /* 居中对齐 */
}

.instructor-photo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
}

.instructor-details {
    display: inline-block;
    /* 使内容适应内容宽度 */
    max-width: 600px;
    text-align: center;
}

.instructor-details h3 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
}

.instructor-details p {
    font-size: 16px;
    color: #555;
    line-height: 1.6;
    margin-top: 5px;
}
</style>
