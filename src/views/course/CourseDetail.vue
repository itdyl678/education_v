<template>
    <div id="app">
        <!-- 背景图模块 -->
        <div class="course-background">
            <img :src="courseBackgroundImage" alt="Course Background" class="background-image" />
            <!-- 新增的内容覆盖在背景图上 -->
            <div class="background-content">
                <div class="background-left">
                    <img :src="courseImage" style="width: 120px; height: 40px;margin-bottom: 10px;">
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
                <!-- 视频播放区域 -->
                <div class="video-container" @click="playVideo">
                    <img :src="videoCoverImage" alt="课程视频封面" class="video-cover">
                    <div class="play-icon"></div>
                </div>
            </div>
        </div>

        <!-- 课程详细介绍模块 -->
        <div class="course-details">
            <h2>课程详情</h2>
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
                    <p class="instructor-title">{{ instructorTitle }}</p>
                    <p class="instructor-description">{{ instructorDescription }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'CourseDetail',
    data() {
        return {
            // 背景图
            courseBackgroundImage: require('../../assets/course/课程详情背景图.png'), // 请替换为实际的背景图路径

            // 课程信息
            courseTitle: '', // 课程主题
            courseStartDate: '', // 开课时间
            enrolledStudents: '', // 已报名人数
            courseDescription: '',
            courseImage: 'https://proxt-cdn.xuetangx.com/fe-proxtassets/xuetangX/240314/ylkc.png',
            // 课程详细介绍
            courseDetailedDescription: '',
            courseContent: [],
            videoCoverImage: '', // 视频封面图URL
            playIconImage: '',   // 播放图标URL

            // 讲师信息
            instructorPhoto: '', // 请替换为实际的老师照片路径
            instructorName: '',
            instructorTitle: '',
            instructorDescription: '',
        };
    },
    mounted() {
        // 获取课程ID
        const courseId = this.$route.params.id;
        // 使用课程ID从后端获取课程的详细信息
        this.fetchCourseDetail(courseId);
    },
    methods: {
        async fetchCourseDetail(courseId) {
            try {
                const response = await axios.get(`http://localhost:8089/course/${courseId}`);
                // console.log("课程信息和教师信息：" + JSON.stringify(response.data, null, 2))
                const courseData = response.data;
                console.log("----" + JSON.stringify(courseData, null, 2));

                // 使用解构赋值简化赋值操作
                const {
                    title,
                    description,
                    joinCount,
                    courseStartTime,
                    detail,
                    instructorName,
                    instructorTitle,
                    instructorDescription,
                    instructorPhoto,
                    img
                } = courseData;

                // 更新课程信息
                this.courseTitle = title;
                this.courseDescription = description;
                this.enrolledStudents = joinCount;
                this.courseStartDate = courseStartTime;
                this.courseDetailedDescription = detail;
                this.courseContent = detail.split('。').filter(item => item.trim() !== ''); // 通过分割课程详细描述来创建课程内容列表
                this.instructorName = instructorName || "暂无教师";
                this.instructorTitle = instructorTitle || "暂无职称";
                this.instructorDescription = instructorDescription || "暂无描述";
                this.instructorPhoto = instructorPhoto || require('../../assets/image/default-instructor.png'); // 默认图片
                // 设置视频封面图和播放图标
                this.videoCoverImage = img; // 默认图片
                this.playIconImage = playIcon || require('../../assets/image/viewlog.png'); // 默认图片
            } catch (error) {
                console.error('获取课程详情失败', error);
                // 这里可以处理错误响应，比如显示错误信息
            }
        },
        registerCourse() {
            // 处理报名逻辑，例如跳转到报名页面
            window.location.href = '/register'; // 请替换为实际的报名链接
        },
        playVideo() {
            // 处理视频播放逻辑，例如跳转到视频播放页面或打开视频播放器
            window.location.href = '/course-video'; // 请替换为实际的视频链接
        },
        goToCourseDetail(courseId) {
            // 使用 Vue Router 跳转到课程详情页面，并传递课程ID
            this.$router.push({ name: 'courseDetail', params: { id: courseId } });
        }
    },
};
</script>

<style scoped>
/* 页面总体样式 */
#app {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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

/* 覆盖在背景图上的内容 */
.background-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    color: #fff;
    background: rgba(0, 0, 0, 0.4);
    /* 添加半透明遮罩，提升文本可读性 */
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
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.course-start-date,
.course-enrollment {
    font-size: 20px;
    margin-top: 10px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.background-right {
    width: 300px;
    padding: 50px 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.register-button {
    font-size: 20px;
    padding: 10px 30px;
    border-radius: 5px;
}

/* 课程介绍模块 */
.course-intro-container {
    display: flex;
    flex-wrap: wrap;
    padding: 40px 20px;
    background-color: #f9f9f9;
}

.course-intro-left,
.course-intro-right {
    flex: 1;
    min-width: 300px;
    padding: 20px;
}

.course-intro-left h2 {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 10px;
}

.course-intro-left p {
    font-size: 18px;
    color: #555;
    line-height: 1.6;
}

.video-container {
    width: 100%;
    position: relative;
    cursor: pointer;
    border: 2px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
    /* 确保 img 不会溢出容器 */
}

.video-cover {
    display: block;
    width: 100%;
    height: 450px;
    /* 保持图片的宽高比 */
    opacity: 0.65;
    /* 设置图片透明度，值范围是 0 到 1，0 为完全透明，1 为不透明 */

}

.play-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 64px;
    height: 64px;
    background: url('../../assets/image/播放器1.png') no-repeat center;
    background-size: contain;
}

/* 课程详细介绍模块 */
.course-details {
    padding: 40px 20px;
    background-color: #ffffff;
    text-align: center;
}

.course-details h2 {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
}

.course-details ul {
    list-style-type: disc;
    padding-left: 40px;
    max-width: 800px;
    margin: 0 auto;
    /* 居中 */
    text-align: left;
    /* 左对齐列表内容 */
}

.course-details ul li {
    font-size: 16px;
    color: #555;
    margin-bottom: 10px;
    line-height: 1.6;
}

/* 课程老师简介模块 */
.instructor-section {
    padding: 40px 20px;
    background-color: #f9f9f9;
    text-align: center;
}

.instructor-section h2 {
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 20px;
}

.instructor-info {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.instructor-photo {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
    border: 3px solid #ddd;
}

.instructor-details {
    max-width: 600px;
}

.instructor-details h3 {
    font-size: 24px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
}

.instructor-title {
    font-size: 18px;
    color: #777;
    margin-bottom: 10px;
}

.instructor-description {
    font-size: 16px;
    color: #555;
    line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .background-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
    }

    .background-left,
    .background-right {
        padding: 20px;
    }

    .background-right {
        width: 100%;
    }

    .course-intro-container {
        flex-direction: column;
    }

    .course-intro-left,
    .course-intro-right {
        padding: 10px;
    }

    .course-details ul {
        padding-left: 20px;
    }
}
</style>
