<template>
    <div class="faculty-container">
        <!-- 筛选和搜索栏 -->
        <div class="filter-search-bar">
            <el-select v-model="selectedSubject" placeholder="选择科目" @change="handleFilterChange">
                <el-option v-for="subject in subjects" :key="subject" :label="subject" :value="subject"></el-option>
            </el-select>
            <el-select v-model="selectedTitle" placeholder="选择职称" @change="handleFilterChange">
                <el-option v-for="title in titles" :key="title" :label="title" :value="title"></el-option>
            </el-select>
            <el-input v-model="searchQuery" placeholder="搜索教师" prefix-icon="el-icon-search" class="search-input"
                @keyup.enter.native="handleSearch"></el-input>
        </div>

        <!-- 教师列表 -->
        <div class="teacher-list">
            <el-card v-for="teacher in displayedTeachers" :key="teacher.id" class="teacher-card"
                :body-style="{ padding: '0px' }" @click.native="viewTeacherDetail(teacher)">
                <div class="teacher-image">
                    <img :src="teacher.photo" alt="Teacher Photo" />
                </div>
                <div class="teacher-info">
                    <h3>{{ teacher.name }}</h3>
                    <p class="teacher-title">{{ teacher.title }}</p>
                    <p class="teacher-subject">{{ teacher.subject }}</p>
                    <p class="teacher-description">{{ teacher.description }}</p>
                </div>
            </el-card>
        </div>

        <!-- 教师详情弹窗 -->
        <el-dialog :visible.sync="detailDialogVisible" :title="selectedTeacher.name" width="50%" class="teacher-dialog">
            <div class="teacher-detail">
                <div class="detail-header">
                    <el-avatar :src="selectedTeacher.photo" size="large"></el-avatar>
                    <div class="detail-info">
                        <h3>{{ selectedTeacher.name }}</h3>
                        <p>
                            {{ selectedTeacher.title }} - {{ selectedTeacher.subject }}
                        </p>
                    </div>
                </div>
                <div class="detail-content">
                    <h4>教育背景</h4>
                    <p v-if="selectedTeacher.education">
                        {{ selectedTeacher.education }}
                    </p>
                    <p v-else>暂无教育背景信息</p>

                    <h4>教学科目</h4>
                    <p v-if="
                        selectedTeacher.teachingSubjects &&
                        selectedTeacher.teachingSubjects.length
                    ">
                        {{ selectedTeacher.teachingSubjects.join(', ') }}
                    </p>
                    <p v-else>暂无教学科目信息</p>

                    <h4>个人成就</h4>
                    <p v-if="selectedTeacher.achievements">
                        {{ selectedTeacher.achievements }}
                    </p>
                    <p v-else>暂无个人成就信息</p>
                </div>
                <!-- 评分和评论 -->
                <div class="rating-comments">
                    <h4>评分和评论</h4>
                    <el-rate v-model="userRating" @change="submitRating"></el-rate>
                    <el-input type="textarea" v-model="commentInput" placeholder="发表你的评论"></el-input>
                    <el-button type="primary" @click="submitComment">发表评论</el-button>
                    <div class="comments-list">
                        <div v-for="comment in selectedTeacher.comments" :key="comment.id" class="comment-item">
                            <el-avatar :src="comment.user.avatar"></el-avatar>
                            <div class="comment-content">
                                <span class="comment-user">{{ comment.user.name }}</span>
                                <el-rate :value="comment.rating" disabled></el-rate>
                                <span class="comment-time">{{ formatDate(comment.time) }}</span>
                                <p>{{ comment.content }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'TeacherIndex', // 确保组件名称正确
    data() {
        return {
            subjects: ['全部', '数学', '英语', '物理', '化学', '生物', '计算机'],
            titles: ['全部', '教授', '副教授', '讲师', '助教', '博士'],
            selectedSubject: '全部',
            selectedTitle: '全部',
            searchQuery: '',
            teachers: [
                // 示例教师数据，确保每个教师都有完整的属性
                {
                    id: 1,
                    name: '李华',
                    title: '教授',
                    subject: '数学',
                    photo: 'https://th.bing.com/th/id/R.5d2b2606b915e1b515b4ca613bae9d80?rik=%2fpiBP9yR5ORnsA&riu=http%3a%2f%2fwww.talkimages.cn%2fimages%2fmedium%2f20133087%2ftkf003_971308.jpg&ehk=e2K2AB6qP3guI6Km1CYSm7YGVo62kr4VLFvxzlSxo3I%3d&risl=&pid=ImgRaw&r=0',
                    description: '拥有20年教学经验，专注于高等数学的研究和教学。',
                    education: '清华大学数学系博士',
                    teachingSubjects: ['高等数学', '线性代数'],
                    achievements: '出版多本教材，获得国家级教学奖项。',
                    comments: [
                        {
                            id: 1,
                            user: {
                                name: '学生A',
                                avatar: 'https://via.placeholder.com/40',
                            },
                            rating: 5,
                            content: '李老师的课深入浅出，受益匪浅。',
                            time: new Date(),
                        },
                        // 更多评论...
                    ],
                },
                // 更多教师...
            ],
            displayedTeachers: [],
            detailDialogVisible: false,
            selectedTeacher: {
                id: null,
                name: '',
                photo: '',
                title: '',
                subject: '',
                description: '',
                education: '',
                teachingSubjects: [], // 初始化为空数组
                achievements: '',
                comments: [],
            },
            userRating: 0,
            commentInput: '',
        };
    },
    methods: {
        handleFilterChange() {
            this.filterTeachers();
        },
        handleSearch() {
            this.filterTeachers();
        },
        filterTeachers() {
            this.displayedTeachers = this.teachers.filter((teacher) => {
                const matchSubject =
                    this.selectedSubject === '全部' ||
                    teacher.subject === this.selectedSubject;
                const matchTitle =
                    this.selectedTitle === '全部' || teacher.title === this.selectedTitle;
                const matchSearch =
                    teacher.name.includes(this.searchQuery) ||
                    teacher.description.includes(this.searchQuery);
                return matchSubject && matchTitle && matchSearch;
            });
        },
        viewTeacherDetail(teacher) {
            // 确保 selectedTeacher 有所有必要的属性
            this.selectedTeacher = {
                id: teacher.id || null,
                name: teacher.name || '',
                photo: teacher.photo || '',
                title: teacher.title || '',
                subject: teacher.subject || '',
                description: teacher.description || '',
                education: teacher.education || '',
                teachingSubjects: teacher.teachingSubjects || [],
                achievements: teacher.achievements || '',
                comments: teacher.comments || [],
            };
            this.detailDialogVisible = true;
            this.userRating = 0;
            this.commentInput = '';
        },
        submitRating(value) {
            this.userRating = value;
        },
        submitComment() {
            if (!this.commentInput.trim()) {
                this.$message.error('评论内容不能为空！');
                return;
            }
            if (this.userRating === 0) {
                this.$message.error('请先给教师评分！');
                return;
            }
            const newComment = {
                id: this.selectedTeacher.comments.length + 1,
                user: {
                    name: '当前用户',
                    avatar: 'https://via.placeholder.com/40',
                },
                rating: this.userRating,
                content: this.commentInput,
                time: new Date(),
            };
            this.selectedTeacher.comments.unshift(newComment);
            this.commentInput = '';
            this.userRating = 0;
            this.$message.success('评论发表成功！');
        },
        formatDate(date) {
            if (!date) return '';
            const d = new Date(date);
            const year = d.getFullYear();
            const month = ('0' + (d.getMonth() + 1)).slice(-2);
            const day = ('0' + d.getDate()).slice(-2);
            const hour = ('0' + d.getHours()).slice(-2);
            const minute = ('0' + d.getMinutes()).slice(-2);
            return `${year}-${month}-${day} ${hour}:${minute}`;
        },
    },
    mounted() {
        // 初始化教师列表
        this.displayedTeachers = this.teachers;
    },
};
</script>

<style scoped>
.faculty-container {
    padding: 20px;
    background-color: #f5f7fa;
}

.filter-search-bar {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.filter-search-bar .el-select {
    margin-right: 10px;
    width: 150px;
}

.filter-search-bar .search-input {
    margin-left: auto;
    width: 300px;
}

.teacher-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}

.teacher-card {
    width: 30%;
    margin-bottom: 20px;
    cursor: pointer;
    transition: transform 0.3s;
}

.teacher-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.teacher-image img {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.teacher-info {
    padding: 15px;
}

.teacher-info h3 {
    margin: 0;
    font-size: 18px;
}

.teacher-title,
.teacher-subject {
    color: #909399;
    margin: 5px 0;
}

.teacher-description {
    color: #606266;
    font-size: 14px;
    line-height: 1.5;
}

.teacher-dialog .el-dialog__body {
    padding: 0;
}

.teacher-detail {
    padding: 20px;
}

.detail-header {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.detail-header .detail-info {
    margin-left: 20px;
}

.detail-content h4 {
    margin-top: 20px;
    color: #409eff;
}

.detail-content p {
    margin: 10px 0;
    line-height: 1.5;
}

.rating-comments {
    margin-top: 30px;
}

.rating-comments .el-rate {
    margin-bottom: 10px;
}

.comments-list {
    margin-top: 20px;
}

.comment-item {
    display: flex;
    margin-bottom: 15px;
}

.comment-content {
    margin-left: 10px;
}

.comment-user {
    font-weight: bold;
    margin-right: 10px;
}

.comment-time {
    color: #909399;
    font-size: 12px;
    margin-left: 10px;
}

.comment-content p {
    margin-top: 5px;
}

.comment-input {
    display: flex;
    align-items: flex-start;
    margin-top: 10px;
}

.comment-input .el-input {
    flex: 1;
}

.comment-input .el-button {
    margin-left: 10px;
}
</style>
