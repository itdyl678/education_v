<template>
    <div class="home-page">
        <div class="carousel-wrapper">
            <!-- 轮播图区域 -->
            <el-carousel :interval="5000" arrow="always" indicator-position="outside" height="400px"
                class="carousel-content">
                <el-carousel-item v-for="(item, index) in carouselImages" :key="index">
                    <img :src="item" alt="Carousel Image" class="carousel-image" @click="goToCourse()" />
                </el-carousel-item>
            </el-carousel>
        </div>

        <!-- 图片展示区域 -->
        <div class="image-showcase">
            <h2 class="section-title">高校合作</h2>
            <el-row :gutter="20">
                <el-col :span="6" v-for="(image, index) in showcaseImages" :key="index">
                    <img :src="image.src" :alt="image.alt" class="showcase-image" />
                </el-col>
            </el-row>
        </div>

        <!-- 课程分类区域 -->
        <div class="category-section">
            <h2 class="section-title">课程分类</h2>
            <div class="categories">
                <div class="category-item" v-for="(category, index) in categories" :key="index"
                    @mouseover="hoverCategory = index" @mouseleave="hoverCategory = null">
                    <img :src="category.image" alt="Category Image" class="category-image"
                        :class="{ 'hover-effect': hoverCategory === index }" @click="goToCourse()" />
                    <h3>{{ category.name }}</h3>
                </div>
            </div>
        </div>

        <!-- 推荐课程区域 -->
        <div class="featured-courses">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <h2 class="section-title">推荐课程</h2>

                <!-- 更多课程按钮 -->
                <div class="more-courses-button" style="text-align: center;margin-top: 10px;">
                    <el-button type="primary" @click="goToCourse()">
                        <i class="el-icon-d-arrow-right" style="margin-right: 5px;"></i> 更多课程</el-button>
                </div>
            </div>

            <el-row :gutter="20">
                <el-col :span="6" v-for="(course, index) in featuredCourses" :key="index">
                    <el-card :body-style="{ padding: '0px' }" shadow="hover" class="beijing">
                        <img :src="course.img" class="course-image" alt="Course Image"
                            @click="goToCourseDetail(course.id)" />
                        <div style="padding: 14px;">
                            <h3>{{ course.title }}</h3>
                            <p>{{ course.description }}</p>
                            <!-- <div class="course-footer">
                                <span>价格: <span style="color: red;">¥{{ course.price }}</span></span>
                                <el-button type="primary" size="small" @click="purchase(course)">购买</el-button>
                            </div> -->
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <div class="evaluation-section">
            <h2 style="color: white;margin-left: 40px;font-size: 32px;">为什么选择酷爱学堂</h2>
            <p class="section-description">
                酷爱学堂是清华大学发起建立的面向未来的慕课在线学习平台，为学习者提供从高校课程到实战技能的在线教育服务。
            </p>
            <el-row :gutter="20" type="flex" justify="space-around">
                <el-col :span="8" v-for="(item, index) in evaluations" :key="index">
                    <el-card shadow="hover" style="text-align: center;">
                        <img :src="item.icon" alt="Evaluation Icon" class="evaluation-icon" />
                        <h3>{{ item.title }}</h3>
                        <ul class="evaluation-details">
                            <li v-for="(detail, idx) in item.details" :key="idx">{{ detail }}</li>
                        </ul>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <div class="honors-section">
            <h2 class="section-title">我们的荣誉</h2>
            <el-row :gutter="20" type="flex" justify="space-around">
                <el-col :span="8" v-for="(honor, index) in honors" :key="index">
                    <el-card shadow="hover" class="honor-card">
                        <img :src="honor.icon" alt="Honor Icon" class="honor-icon" />
                        <div style="padding: 14px;">
                            <h3>{{ honor.title }}</h3>
                            <p>{{ honor.description }}</p>
                            <ul class="partners-list" v-if="honor.partners && honor.partners.length">
                                <li v-for="(partner, idx) in honor.partners" :key="idx">
                                    <img :src="partner.logo" alt="Partner Logo" class="partner-logo" />
                                </li>
                            </ul>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'HomePage',
    data() {
        return {
            carouselImages: [
                require('@/assets/course/首页轮播图06.png'),
                require('@/assets/course/首页轮播图01.png'),
                require('@/assets/course/首页轮播图05.png'),
                require('@/assets/course/首页轮播图03.png'),
                require('@/assets/course/首页轮播图04.png'),
            ],
            evaluations: [
                {
                    icon: 'https://storagecdn.xuetangx.com/public_assets/xuetangx/xuetngx2018/8e82f994475d2abfe0ba6845d1963238.icon_about_1.png', // 替换为实际图标路径
                    title: '致力于汇聚高校优质课程',
                    details: [
                        '平台运行5000余门课程',
                        '为学习者提供学习认证证书',
                        '打造随时随地学习的平台环境'
                    ]
                },
                {
                    icon: 'https://storagecdn.xuetangx.com/public_assets/xuetangx/xuetngx2018/629a255a160e9b8bf5700729ee868fc7.icon_about_2.png', // 替换为实际图标路径
                    title: '打造终身学习平台',
                    details: [
                        '通过在线教育的方式提供敏捷教育方案',
                        '通过体系化课程构建专业服务体系',
                        '打造服务于终身学习者的学习平台'
                    ]
                },
                {
                    icon: 'https://storagecdn.xuetangx.com/public_assets/xuetangx/xuetngx2018/ca2d682b042fbc3c5d66e747cf7a2b09.icon_about_3.png', // 替换为实际图标路径
                    title: '构建职业技能培训体系',
                    details: [
                        '联合百度、京东、美团等企业深度合作',
                        '融入实践实训环节，提供职业技能培训',
                        '帮助学习者更好地应对职场挑战'
                    ]
                }
            ],
            honors: [
                {
                    icon: 'https://x0.ifengimg.com/ucms/2021_45/C7577E0D95B311F1DFE9A0A38C288F82397EEDA2_size318_w1080_h1440.jpg',
                    title: '国家科技进步二等奖',
                    description: '学堂在线在教育科技领域做出了显著贡献，荣获国家级别殊荣。',
                    partners: null
                },
                {
                    icon: 'https://news.gdufs.edu.cn/__local/1/55/CB/4DDA47BECC96D33EFC118877E01_B498B3E0_142E01.png',
                    title: '国际慕课联盟成员',
                    description: '作为国际慕课联盟的一员，学堂在线致力于全球范围内的教育合作。',
                    partners: [
                        { logo: 'https://pic1.zhimg.com/v2-6f1396700986b9b02ed57dc7b6d38bf0_1200x500.jpg' },
                        { logo: 'https://moocs.unipus.cn/files/default/2022/01-28/1249299c634e175925.jpeg' }
                    ]
                },
                {
                    icon: 'https://img1.qunarzz.com/travel/d8/201404/21/c316116d5a9bb46dddb12cfb.jpg_r_640x424x70_8eaf23c1.jpg',
                    title: '清华大学发起建立',
                    description: '由清华大学创办，学堂在线继承了清华的优秀传统和教育资源。',
                    partners: null
                }
            ],

            showcaseImages: [
                { src: require('@/assets/course/清华大学logo.png'), alt: '特色展示1' },
                { src: require('@/assets/course/北京大学.png'), alt: '特色展示2' },
                { src: require('@/assets/course/西安交通大学.png'), alt: '特色展示3' },
                { src: require('@/assets/course/北京师范大学.png'), alt: '特色展示3' },
            ],
            categories: [
                { name: '编程开发', image: require('@/assets/course/编程开发.png') },
                { name: '设计艺术', image: require('@/assets/course/艺术设计.png') },
                { name: '商业管理', image: require('@/assets/course/商业管理.png') },
                { name: '语言学习', image: require('@/assets/course/语言学.png') },
                { name: '更多分类', image: require('@/assets/course/更多.png') },
            ],
            featuredCourses: [],
            hoverCategory: null,
        };
    },
    methods: {
        purchase(course) {
            alert(`您选择了购买课程: ${course.title}`);
            // 这里可以添加实际的购买逻辑
        },
        goToCourse() {
            //指定导航目标
            this.checkurl('/courses')
        },

        goToCourseDetail(courseId) {
            // 先判断是否已登录
            const isLoggedIn = this.$store.state.isLoggedIn || localStorage.getItem('token');
            if (isLoggedIn) {
                // 已登录，执行跳转到课程详情页
                this.$router.push({ name: 'CourseDetail', params: { id: courseId } });
            } else {
                // 未登录，跳转到登录页面
                this.$router.push('/login');
                this.$message({
                    message: '请先登录',
                    type: 'warning',
                    duration: 1500,
                });
            }
        },

        checkurl(targetRoute) {
            const isLoggedIn = this.$store.state.isLoggedIn || localStorage.getItem('token');

            if (isLoggedIn) {
                // 如果已登录，跳转到课程页面
                this.$router.push(targetRoute);
            } else {
                // 如果未登录，跳转到登录页面
                this.$router.push('/login');
                this.$message({
                    message: '请先登录',
                    type: 'warning',
                    duration: 1500,
                });
            }
        },
        //请求后端，像后端获取课程信息，并渲染到前端页面
        async fetchCourse() {
            try {
                const response = await axios.get(`http://localhost:8089/course/findTopRatedCourse`);
                // console.log("课程的信息为：", JSON.stringify(response.data, null, 2));
                this.featuredCourses = response.data
            } catch (error) {
                console.error('获取课程失败', error);
                this.$message({
                    message: '获取课程数据失败，请稍后重试。',
                    type: 'error',
                    duration: 2000,
                });
            }

        }
    },
    mounted() {
        //组件加载时调用方法
        this.fetchCourse();
    }
};
</script>

<style scoped>
.honors-section {
    background-color: #f7f9fc;
    padding: 10px;
    width: 100%;
}

.section-title {
    font-size: 24px;
    color: #333333;
    margin-bottom: 10px;
}

.section-description {
    font-size: 16px;
    color: #666666;
    margin-bottom: 20px;
}

.honor-card {
    text-align: center;
    transition: transform 0.3s ease;
    width: 350px;
    height: 300px;
    background: linear-gradient(135deg, #ffcccb, #ffe6e6, #f0f8ff);
    /* 三种浅色渐变 */
    /* 多种浅色渐变 */
    /* 三种颜色的渐变 */
    /* 45度角渐变，从红色到橙色 */
    /* 你可以根据需要调整颜色和渐变方向 */
    border-radius: 8px;
    /* 保持圆角 */


}

.honor-card:hover {
    transform: translateY(-10px);
}

.honor-icon {
    /* 添加边框来检查元素是否存在 */
    width: 80px;
    /* 设置固定宽度 */
    height: 80px;
    /* 设置固定高度 */
    object-fit: cover;
    /* 保持图片比例 */
    border-radius: 8px;
}

.honor-card h3 {
    font-size: 18px;
    color: #333333;
    margin-bottom: 10px;
}

.honor-card p {
    font-size: 14px;
    color: #666666;
    margin-bottom: 20px;
}

.partners-list {
    list-style-type: none;
    padding-left: 0;
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 10px;
}

.partner-logo {
    width: 60px;
    height: 60px;
    object-fit: contain;
}

.evaluation-section {
    margin-top: 30px;
    background: linear-gradient(90deg, rgb(76, 136, 228), rgb(216, 176, 255));
    padding: 40px 20px;
    width: 100%;
}

.section-title {
    font-size: 24px;
    color: #ffffff;
    margin-bottom: 10px;
}

.section-description {
    font-size: 18px;
    color: #fdfdfd;
    margin-bottom: 20px;
    margin-left: 40px;
}

.evaluation-icon {
    width: 60px;
    height: 60px;
    margin-bottom: 10px;
}

.evaluation-details {
    list-style-type: none;
    padding-left: 0;
    margin-top: 10px;
}

.evaluation-details li {
    font-size: 14px;
    color: #666666;
    margin-bottom: 5px;
}

.el-card__body {
    padding: 20px;
}

.el-card__header {
    border-bottom: 1px solid #ebeef5;
    padding: 15px 20px;
}

.el-card__header h3 {
    font-size: 18px;
    color: #333333;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}

.platform-advantages .interaction-buttons {
    margin-top: 10px;
}

.home-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 10px;
}

.carousel-wrapper {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
}

.carousel-content {
    width: 100%;
    position: relative;
    z-index: 2;
}

.carousel-image {
    width: 100%;
    height: 400px;
    object-fit: cover;
    cursor: pointer;
}

.carousel-wrapper::before,
.carousel-wrapper::after {
    content: "";
    position: absolute;
    top: 50%;
    width: 200px;
    height: 80%;
    background: linear-gradient(90deg, rgba(255, 0, 150, 0.3), rgba(255, 255, 0, 0.0));
    transform: translateY(-50%);
    z-index: 1;
}

.carousel-wrapper::before {
    left: -210px;
    background: linear-gradient(90deg, rgba(0, 123, 255, 0.5), rgba(255, 0, 150, 0));
}

.carousel-wrapper::after {
    right: -210px;
    background: linear-gradient(-90deg, rgba(0, 123, 255, 0.5), rgba(0, 255, 150, 0));
}

.section-title {
    text-align: center;
    margin: 40px 0 20px;
    font-size: 28px;
    color: #333;
}

.image-showcase {
    margin: 40px 0;
}

.showcase-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 10px;
    transition: transform 0.3s;
}

.showcase-image:hover {
    transform: scale(1.05);
}

.category-section .categories {
    display: flex;
    width: 100%;
    justify-content: space-around;
    flex-wrap: wrap;
    background: linear-gradient(135deg, #a0c8f0, #d0a7f0, #a0c8f0);
}

.category-item {
    text-align: center;
    margin: 20px;
    transition: transform 0.3s;
}

.category-image {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    object-fit: cover;
}

.category-image.hover-effect {
    transform: scale(1.1);
}

.featured-courses .el-card {
    margin-bottom: 20px;
}

.course-image {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.beijing {
    /* 卡片背景多颜色拼接 */
    background: linear-gradient(135deg, #ff7e5f, #feb47b, #fffae6);
}

.course-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
}

.testimonials .testimonial-item {
    text-align: center;
    padding: 20px;
}

.user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
}
</style>
