<template>
    <div class="all-courses">
        <!-- 标题区域 -->
        <div class="section-header" :style="headerBackgroundStyle">
            <div class="header-content">
                <h2 class="section-title">全部课程</h2>
                <p class="welcome-message">欢迎来到ku爱课程平台</p>
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
                    <img :src="course.img" class="course-image" alt="Course Image"
                        @click="goToCourseDetail(course.id)" />
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
import axios from 'axios';
export default {
    name: 'AllCourses',
    data() {
        return {
            searchQuery: '',
            selectedCategory: '',
            currentPage: 1,
            pageSize: 8,
            categories: ['编程开发', '设计艺术', '商业管理', '语言学习', '生活兴趣', '最新课程', '热门课程', '限时折扣'],
            courses: [], //初始化为空数组
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
    mounted() {
        this.fetchCourses();
    },
    methods: {
        handleSearch() {
            this.filterCourses();
        },
        goToCourseDetail(courseId) {
            //使用Vue Router 跳转到课程详情页面，并传递课程ID
            this.$router.push({ name: 'CourseDetail', params: { id: courseId } });
        },
        async fetchCourses() {
            try {
                const response = await axios.get(`http://localhost:8089/course/findCourseAll`);
                this.courses = response.data.map(course => ({
                    ...course, //使用扩展运算符（...）复制原始课程对象的所有属性
                    isFree: course.price === 0, //根据价格判断是否为免费课程
                    price: course.price || 0, //确保价格始终是一个数字，即使对于免费课程
                }));
                this.filteredCourses = this.courses; //初始话筛选结果,将所有课程作为初始化的过滤结果
            } catch (error) {
                console.error('获取数据失败：' + error);
            }
        },
        filterCourses() {
            this.filteredCourses = this.courses.filter(course => {
                const lowerCaseQuery = (this.searchQuery || '').toLowerCase();

                // 匹配分类
                const matchesCategory = this.selectedCategory ? (
                    this.selectedCategory === '免费课程' ? course.isFree : course.category === this.selectedCategory
                ) : true;

                // 匹配搜索查询（忽略大小写）
                const titleMatch = !lowerCaseQuery || course.title.toLowerCase().includes(lowerCaseQuery);
                const descriptionMatch = !lowerCaseQuery || course.description.toLowerCase().includes(lowerCaseQuery);
                const matchesSearch = titleMatch || descriptionMatch;

                // 匹配价格筛选
                const matchesPrice = this.priceFilter === 'all' ||
                    (this.priceFilter === 'free' ? course.isFree : !course.isFree);

                // 匹配选中的类别
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
    height: 180px;
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
    margin-top: 20px;
    transition: transform 0.3s, box-shadow 0.3s;
    background: linear-gradient(135deg, #c1a1f8, #85c3ff, #c1a1f8);
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