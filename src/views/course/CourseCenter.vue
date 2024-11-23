<template>
    <div class="all-courses">
        <!-- 标题区域 -->
        <div class="section-header" :style="headerBackgroundStyle">
            <div class="header-content">
                <h2 class="section-title">全部课程</h2>
                <p class="welcome-message">欢迎来到我们的在线课程平台！</p>
                <el-input v-model="searchQuery" placeholder="搜索课程..." prefix-icon="el-icon-search" clearable
                    class="search-bar" @input="handleSearch" />
                <el-button type="primary" icon="el-icon-filter" @click="showFilters = !showFilters"
                    class="filter-button">筛选</el-button>
            </div>
        </div>

        <!-- 筛选区域 -->
        <transition name="fade">
            <div class="filter-section" v-if="showFilters">
                <el-collapse v-model="activeFilters">
                    <el-collapse-item title="按价格筛选" name="1">
                        <el-radio-group v-model="priceFilter" class="filter-options">
                            <el-radio label="free" class="filter-option">免费课程</el-radio>
                            <el-radio label="paid" class="filter-option">付费课程</el-radio>
                            <el-radio label="all" class="filter-option">所有课程</el-radio>
                        </el-radio-group>
                    </el-collapse-item>
                    <el-collapse-item title="按类别筛选" name="2">
                        <el-checkbox-group v-model="selectedCategories" class="filter-options">
                            <el-checkbox v-for="category in categories" :key="category" :label="category"
                                class="filter-option">{{ category }}</el-checkbox>
                        </el-checkbox-group>
                    </el-collapse-item>
                </el-collapse>
                <el-button type="success" @click="applyFilters" class="filter-button">应用筛选</el-button>
                <el-button type="warning" @click="resetFilters" class="filter-button">重置筛选</el-button>
            </div>
        </transition>

        <!-- 分类导航栏区域 -->
        <div class="category-nav-horizontal">
            <nav>
                <ul class="category-nav-list">
                    <li v-for="category in visibleCategories" :key="category" @click="selectCategory(category)"
                        :class="{ 'active-category': selectedCategory === category }">
                        <el-button type="text" icon="el-icon-folder-opened" class="category-button">{{ category
                            }}</el-button>
                    </li>
                    <li @click="selectCategory('免费课程')" :class="{ 'active-category': selectedCategory === '免费课程' }">
                        <el-button type="text" icon="el-icon-gift" class="category-button">免费课程</el-button>
                    </li>
                    <li @click="selectCategory('')" :class="{ 'active-category': selectedCategory === '' }">
                        <el-button type="text" icon="el-icon-s-grid" class="category-button">全部课程</el-button>
                    </li>
                    <el-dropdown v-if="extraCategories.length" trigger="click" placement="bottom">
                        <el-button type="text" icon="el-icon-more" class="category-button"
                            style="margin-top: 10px;">更多</el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="extraItem in extraCategories" :key="extraItem"
                                @click.native="selectCategory(extraItem)">{{ extraItem }}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </ul>
            </nav>
        </div>

        <!-- 课程列表区域 -->
        <el-row :gutter="20" class="course-list">
            <el-col :span="6" v-for="(course, index) in paginatedCourses" :key="index">
                <el-card :body-style="{ padding: '0px' }" shadow="hover" class="animated-card"
                    :class="{ 'is-favorite': course.isFavorite }">
                    <div class="course-price" v-if="!course.isFree">¥{{ course.price }}</div>
                    <img :src="course.image" class="course-image" alt="Course Image" />
                    <div style="padding: 14px;">
                        <h3>{{ course.title }}</h3>
                        <div class="course-rating">
                            <el-rate v-model="course.rating" disabled show-score text-color="#ff9900"></el-rate>
                        </div>
                        <p class="course-description">{{ course.description }}</p>
                        <div class="course-footer">
                            <div class="course-details">
                                <el-tag :type="tagType(course.category)" effect="dark"
                                    :class="`category-tag-${course.category}`">{{ course.category }}</el-tag>
                                <el-tag type="success" v-if="course.isFree">免费</el-tag>
                            </div>
                            <div class="course-footer-buttons">
                                <el-button type="success" size="small" @click="purchase(course)" round
                                    v-if="!course.isFree">立即购买</el-button>
                                <el-button type="warning" size="small" @click="toggleFavorite(course)" round
                                    :icon="course.isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"
                                    style="margin-left: 10px;"></el-button>
                            </div>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 分页区域 -->
        <div class="pagination-section">
            <el-pagination background layout="prev, pager, next" :total="filteredCourses.length" :page-size="pageSize"
                :current-page.sync="currentPage" @current-change="handlePageChange" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'AllCourses',
    data() {
        return {
            searchQuery: '',
            selectedCategory: '',
            currentPage: 1,
            pageSize: 8,
            categories: ['编程开发', '设计艺术', '商业管理', '语言学习', '生活兴趣', '最新课程', '热门课程', '限时折扣'],
            courses: [
                {
                    title: 'Vue.js 从入门到精通',
                    description: '深入学习 Vue.js，构建高效的前端应用。',
                    image: require('@/assets/course/vue.png'),
                    category: '编程开发',
                    price: 199,
                    rating: 4.5,
                },
                {
                    title: 'UI/UX 设计基础',
                    description: '学习设计原则，打造优秀的用户体验。',
                    image: require('@/assets/course/UI.png'),
                    category: '设计艺术',
                    price: 159,
                    rating: 4.2,
                },
                {
                    title: 'Python 编程入门',
                    description: '了解 Python 编程的基础知识，适合初学者。',
                    image: require('@/assets/course/python.png'),
                    category: '编程开发',
                    price: 0,
                    isFree: true,
                    rating: 4.8,
                },
                {
                    title: '绘画基础',
                    description: '学习基本绘画技巧，激发您的艺术创造力。',
                    image: require('@/assets/course/绘画.png'),
                    category: '设计艺术',
                    price: 0,
                    isFree: true,
                    rating: 4.7,
                },
                {
                    title: '商务礼仪入门',
                    description: '学习基本的商务礼仪，提高职场表现。',
                    image: 'https://via.placeholder.com/300x200?text=Business+Etiquette+Course',
                    category: '商业管理',
                    price: 0,
                    isFree: true,
                    rating: 4.6,
                },
                {
                    title: '英语口语速成',
                    description: '提升您的英语口语能力，轻松应对各种场合。',
                    image: 'https://via.placeholder.com/300x200?text=English+Course',
                    category: '语言学习',
                    price: 129,
                    rating: 4.4,
                },
                {
                    title: '摄影技巧大全',
                    description: '从零开始学习摄影，拍出专业级照片。',
                    image: 'https://via.placeholder.com/300x200?text=Photography+Course',
                    category: '生活兴趣',
                    price: 99,
                    rating: 4.3,
                },
                {
                    title: 'React 全栈开发实战',
                    description: '掌握 React 及其生态系统，成为全栈开发者。',
                    image: 'https://via.placeholder.com/300x200?text=React+Course',
                    category: '编程开发',
                    price: 249,
                    rating: 4.6,
                },
                {
                    title: '平面设计进阶',
                    description: '深入学习平面设计，提升视觉传达能力。',
                    image: 'https://via.placeholder.com/300x200?text=Graphic+Design+Course',
                    category: '设计艺术',
                    price: 179,
                    rating: 4.5,
                },
                {
                    title: '市场营销策略',
                    description: '学习有效的市场营销策略，推动业务增长。',
                    image: 'https://via.placeholder.com/300x200?text=Marketing+Course',
                    category: '商业管理',
                    price: 149,
                    rating: 4.2,
                },
                {
                    title: '法语初级课程',
                    description: '从零开始学法语，开启新的语言之旅。',
                    image: 'https://via.placeholder.com/300x200?text=French+Course',
                    category: '语言学习',
                    price: 119,
                    rating: 4.1,
                },
                {
                    title: '瑜伽基础教程',
                    description: '学习瑜伽的基本动作，享受身心健康的乐趣。',
                    image: 'https://via.placeholder.com/300x200?text=Yoga+Course',
                    category: '生活兴趣',
                    price: 0,
                    isFree: true,
                    rating: 4.5,
                },
                {
                    title: 'Node.js 后端开发',
                    description: '掌握 Node.js 技术，构建高性能后端服务。',
                    image: 'https://via.placeholder.com/300x200?text=Node.js+Course',
                    category: '编程开发',
                    price: 229,
                    rating: 4.7,
                },
                {
                    title: '色彩搭配原理',
                    description: '了解色彩搭配的基本原理，提升审美能力。',
                    image: 'https://via.placeholder.com/300x200?text=Color+Theory+Course',
                    category: '设计艺术',
                    price: 139,
                    rating: 4.3,
                },
                {
                    title: '财务管理实务',
                    description: '学习财务管理知识，提高企业财务管理水平。',
                    image: 'https://via.placeholder.com/300x200?text=Finance+Course',
                    category: '商业管理',
                    price: 169,
                    rating: 4.4,
                },
                {
                    title: '西班牙语基础',
                    description: '从零开始学西班牙语，拓展国际视野。',
                    image: 'https://via.placeholder.com/300x200?text=Spanish+Course',
                    category: '语言学习',
                    price: 109,
                    rating: 4.2,
                },
                {
                    title: '烹饪技巧大全',
                    description: '学习各种烹饪技巧，成为家庭大厨。',
                    image: 'https://via.placeholder.com/300x200?text=Cooking+Course',
                    category: '生活兴趣',
                    price: 89,
                    rating: 4.1,
                },
                {
                    title: 'Angular 深入学习',
                    description: '全面掌握 Angular 框架，开发复杂的企业级应用。',
                    image: 'https://via.placeholder.com/300x200?text=Angular+Course',
                    category: '编程开发',
                    price: 239,
                    rating: 4.6,
                },
                {
                    title: '插画设计入门',
                    description: '学习插画设计的基本技巧，创作独特作品。',
                    image: 'https://via.placeholder.com/300x200?text=Illustration+Course',
                    category: '设计艺术',
                    price: 129,
                    rating: 4.4,
                },
                {
                    title: '人力资源管理',
                    description: '掌握人力资源管理的核心技能，提升团队效能。',
                    image: 'https://via.placeholder.com/300x200?text=HR+Management+Course',
                    category: '商业管理',
                    price: 159,
                    rating: 4.3,
                },
                {
                    title: '日语初级课程',
                    description: '从零开始学日语，体验日本文化。',
                    image: 'https://via.placeholder.com/300x200?text=Japanese+Course',
                    category: '语言学习',
                    price: 119,
                    rating: 4.2,
                },
                {
                    title: '旅行摄影指南',
                    description: '学习旅行摄影技巧，记录美好瞬间。',
                    image: 'https://via.placeholder.com/300x200?text=Travel+Photography+Course',
                    category: '生活兴趣',
                    price: 0,
                    isFree: true,
                    rating: 4.5,
                },
            ],
            filteredCourses: [],
            showFilters: false,
            activeFilters: [],
            priceFilter: 'all',
            selectedCategories: [],
        };
    },
    computed: {
        visibleCategories() {
            return this.categories.slice(0, 5);
        },
        extraCategories() {
            return this.categories.slice(5);
        },
        paginatedCourses() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.filteredCourses.slice(start, end);
        },
        headerBackgroundStyle() {
            return {
                backgroundImage: 'linear-gradient(to right, #ff9900, #ffcc33)',
                borderRadius: '8px',
                padding: '20px',
                color: '#fff',
            };
        },
    },
    created() {
        this.filteredCourses = this.courses;
    },
    methods: {
        handleSearch() {
            this.filterCourses();
        },
        filterCourses() {
            this.filteredCourses = this.courses.filter(course => {
                const matchesCategory = this.selectedCategory ? (
                    this.selectedCategory === '免费课程' ? course.isFree : course.category === this.selectedCategory
                ) : true;
                const matchesSearch = this.searchQuery ? course.title.includes(this.searchQuery) || course.description.includes(this.searchQuery) : true;
                const matchesPrice = this.priceFilter === 'all' || (this.priceFilter === 'free' ? course.isFree : !course.isFree);
                const matchesSelectedCategories = this.selectedCategories.length === 0 || this.selectedCategories.includes(course.category);
                return matchesCategory && matchesSearch && matchesPrice && matchesSelectedCategories;
            });
        },
        handlePageChange(page) {
            this.currentPage = page;
        },
        purchase(course) {
            alert(`您选择了购买课程: ${course.title}`);
            // 这里可以添加实际的购买逻辑
        },
        toggleFavorite(course) {
            course.isFavorite = !course.isFavorite;
        },
        tagType(category) {
            switch (category) {
                case '编程开发':
                    return 'primary';
                case '设计艺术':
                    return 'success';
                case '商业管理':
                    return 'warning';
                case '语言学习':
                    return 'danger';
                case '生活兴趣':
                    return 'info';
                default:
                    return 'default';
            }
        },
        resetFilters() {
            this.selectedCategory = '';
            this.searchQuery = '';
            this.priceFilter = 'all';
            this.selectedCategories = [];
            this.filterCourses();
        },
        selectCategory(category) {
            this.selectedCategory = category;
            this.filterCourses();
        },
        applyFilters() {
            this.filterCourses();
            this.showFilters = false;
        },
    }
};
</script>

<style scoped>
.all-courses {
    width: 80%;
    margin: 0 auto;
    padding: 20px;
}

.section-header {
    position: relative;
    margin-bottom: 20px;
    text-align: center;
}

.header-content {
    position: relative;
    z-index: 1;
}

.section-title {
    font-size: 28px;
    margin: 0;
    color: #fff;
}

.welcome-message {
    font-size: 16px;
    color: #fff;
    margin-bottom: 10px;
}

.search-bar {
    width: 300px;
    margin-bottom: 10px;
}

.filter-button {
    margin-left: 20px;
    /* 增加与搜索框的间距 */
}

.filter-section {
    background-color: #f1f1f1;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.category-nav-horizontal {
    margin-bottom: 20px;
    padding: 10px 0;
    background-color: #f1f1f1;
    border-radius: 8px;
    text-align: center;
}

.category-nav-list {
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.category-nav-list li {
    cursor: pointer;
    padding: 10px 20px;
    transition: background-color 0.3s, color 0.3s;
    border-radius: 4px;
    color: #333;
}

.category-nav-list li:hover {
    background-color: #e6e6e6;
    color: #000;
}

.active-category {
    background-color: #b3d8ff;
    color: #000;
    font-weight: bold;
}

.category-button {
    font-size: 16px;
    color: #333;
    /* 改变默认字体颜色 */
    transition: color 0.3s;
}

.category-button:hover {
    color: #ff9800;
    /* 鼠标悬停时的颜色 */
}

.course-list {
    margin-top: 20px;
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

.pagination-section {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.course-description {
    color: #666;
    font-size: 14px;
    margin-top: 8px;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
}

.course-footer-info {
    display: flex;
    align-items: center;
}

.animated-card {
    transition: transform 0.3s, box-shadow 0.3s;
}

.animated-card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.is-favorite {
    border: 2px solid #ff9800;
}

.course-price {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #ff9800;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-weight: bold;
}

.course-rating {
    margin-top: 5px;
    margin-bottom: 10px;
}

.course-details {
    display: flex;
    align-items: center;
    gap: 10px;
}

.course-footer-buttons {
    display: flex;
    align-items: center;
}

/* 美化筛选选项的字体效果 */
.filter-options {
    margin-top: 10px;
}

.filter-option {
    font-size: 16px;
    color: #333;
    margin-right: 20px;
    transition: color 0.3s;
}

.filter-option:hover {
    color: #ff9800;
}
</style>