<template>
    <div class="home-page">
        <div class="carousel-wrapper">
            <!-- 轮播图区域 -->
            <el-carousel :interval="5000" arrow="always" indicator-position="outside" height="400px"
                class="carousel-content">
                <el-carousel-item v-for="(item, index) in carouselImages" :key="index">
                    <img :src="item" alt="Carousel Image" class="carousel-image" @click="checkurl()" />
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
                        :class="{ 'hover-effect': hoverCategory === index }" />
                    <h3>{{ category.name }}</h3>
                </div>
            </div>
        </div>

        <!-- 推荐课程区域 -->
        <div class="featured-courses">
            <h2 class="section-title">推荐课程</h2>
            <el-row :gutter="20">
                <el-col :span="6" v-for="(course, index) in featuredCourses" :key="index">
                    <el-card :body-style="{ padding: '0px' }" shadow="hover">
                        <img :src="course.image" class="course-image" alt="Course Image" @click="goToCourseDetail()" />
                        <div style="padding: 14px;">
                            <h3>{{ course.title }}</h3>
                            <p>{{ course.description }}</p>
                            <div class="course-footer">
                                <span>价格: <span style="color: red;">¥{{ course.price }}</span></span>
                                <el-button type="primary" size="small" @click="purchase(course)">购买</el-button>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>

        <!-- 学员评价区域 -->
        <div class="testimonials">
            <h2 class="section-title">学员评价</h2>
            <el-carousel :interval="8000" type="card" height="200px">
                <el-carousel-item v-for="(testimonial, index) in testimonials" :key="index">
                    <div class="testimonial-item">
                        <img :src="testimonial.avatar" alt="User Avatar" class="user-avatar" />
                        <p>"{{ testimonial.feedback }}"</p>
                        <h4>- {{ testimonial.name }}</h4>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </div>
    </div>
</template>

<script>
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
            featuredCourses: [
                {
                    title: 'Vue.js 从入门到精通',
                    description: '深入学习 Vue.js，构建高效的前端应用。',
                    image: require('@/assets/course/vue.png'),
                    price: 199,
                },
                {
                    title: 'Python 全栈开发',
                    description: '掌握 Python,成为全栈开发工程师。',
                    image: require('@/assets/course/python.png'),
                    price: 299,
                },
                {
                    title: 'UI/UX 设计基础',
                    description: '学习设计原则，打造优秀的用户体验。',
                    image: require('@/assets/course/UI.png'),
                    price: 159,
                },
                {
                    title: '商务英语口语',
                    description: '提升商务英语能力，沟通无障碍,向更好的未来进步',
                    image: require('@/assets/course/English.png'),
                    price: 129,
                },
            ],
            testimonials: [
                { name: '王茂dan', feedback: '这个平台的课程非常实用，老师讲解细致。', avatar: 'https://ww3.sinaimg.cn/mw690/d315af46ly1hnn5btbjr5j20j60j7mzv.jpg' },
                { name: '王五', feedback: '学到了很多新知识，受益匪浅！', avatar: 'https://ww4.sinaimg.cn/mw690/69c1dcbbgy1hplim6liu0j20u00u0myb.jpg' },
                { name: '赵六', feedback: '课程内容丰富，平台使用体验很好。', avatar: 'https://ww4.sinaimg.cn/mw690/008dHcm6gy1hurn601fpej30u00u0gow.jpg' },
            ],
            hoverCategory: null,
        };
    },
    methods: {
        purchase(course) {
            alert(`您选择了购买课程: ${course.title}`);
            // 这里可以添加实际的购买逻辑
        },
        goToCourseDetail() {
            // 使用 Vue Router 跳转到课程详情页，并传递课程信息作为参数
            this.$router.push('/courseDetail');
        },
        checkurl() {
            const isLoggedIn = this.$store.state.isLoggedIn || localStorage.getItem('token');

            if (isLoggedIn) {
                // 如果已登录，跳转到课程页面
                this.$router.push('/courses');
            } else {
                // 如果未登录，跳转到登录页面
                this.$router.push('/login');
                this.$message({
                    message: '请先登录',
                    type: 'warning',
                    duration: 1500,
                });
            }
        }
    }
};
</script>

<style scoped>
.home-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
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
    justify-content: space-around;
    flex-wrap: wrap;
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
