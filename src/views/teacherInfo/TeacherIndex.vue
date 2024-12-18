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

        <!-- 教师列表或空状态提示 -->
        <div class="teacher-list">
            <template v-if="displayedTeachers.length > 0">
                <el-card v-for="teacher in displayedTeachers" :key="teacher.id" class="teacher-card"
                    :body-style="{ padding: '0px' }" @click.native="viewTeacherDetail(teacher)">
                    <div class="teacher-image">
                        <img :src="teacher.photo" alt="Teacher Photo" />
                    </div>
                    <div class="teacher-info">
                        <h3>{{ teacher.teacherName }}</h3>
                        <p class="teacher-title">{{ teacher.title }}</p>
                        <p class="teacher-subject">{{ teacher.subject }}</p>
                        <p class="teacher-description">{{ teacher.description }}</p>
                    </div>
                </el-card>
            </template>
            <template v-else>
                <!-- 使用 Element UI 的 el-empty 组件 -->
                <el-empty description="没有符合筛选条件的教师" />
                <!-- 或者使用自定义的提示信息和图片 -->
                <!--
                <div class="no-teachers">
                    <img src="path/to/your/no-data-image.png" alt="No Data" class="no-data-image" />
                    <p>没有符合筛选条件的教师。</p>
                </div>
                -->
            </template>
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
                        {{ selectedTeacher.teachingSubjects.split(',').join(', ') }}
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
                    <el-button type="primary" style="margin-top: 10px;" @click="submitComment">发表评论</el-button>
                    <div class="comments-list">
                        <div v-for="comment in selectedTeacher.comments" :key="comment.id" class="comment-item">
                            <el-avatar :src="comment.userCommentDTO.avatar"></el-avatar>
                            <div class="comment-content">
                                <span class="comment-user">{{ comment.userCommentDTO.username }}</span>
                                <el-rate :value="comment.rating" disabled></el-rate>
                                <span class="comment-time">{{ formatDate(comment.createAt) }}</span>
                                <p>{{ comment.comment }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';

export default {
    name: 'TeacherIndex', // 确保组件名称正确
    data() {
        return {
            subjects: ['全部', '数学', '英语', '物理', '化学', '生物', '计算机'],
            titles: ['全部', '教授', '副教授', '讲师', '助教', '博士'],
            selectedSubject: '全部',
            selectedTitle: '全部',
            searchQuery: '',
            teachers: [],
            displayedTeachers: [],
            detailDialogVisible: false,
            selectedTeacher: {
                id: null,
                name: '',
                photo: '',
                title: '',
                subject: '',
                detail: '',
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
        ...mapActions(['setTeacherId']), //引入setTeacherId action
        handleFilterChange() {
            console.log('Filter changed!');
            this.filterTeachers();
        },
        handleSearch() {
            this.filterTeachers();
        },
        filterTeachers() {
            // 检查是否有教师数据
            if (!this.teachers || this.teachers.length === 0) {
                console.log("没有可供筛选的教师数据。");
                return;
            }
            console.log("正在根据筛选条件过滤教师...");
            console.log("selectedSubject:", this.selectedSubject);
            console.log("selectedTitle:", this.selectedTitle);
            this.displayedTeachers = this.teachers.filter((teacher) => {
                const matchSubject =
                    this.selectedSubject === '全部' || teacher.subject === this.selectedSubject;
                const matchTitle =
                    this.selectedTitle === '全部' || teacher.title === this.selectedTitle;

                // 检查 teacher.teacherName 和 teacher.detail 是否有效
                const matchSearch =
                    (teacher.teacherName && teacher.teacherName.includes(this.searchQuery)) ||
                    (teacher.detail && teacher.detail.includes(this.searchQuery));

                return matchSubject && matchTitle && matchSearch;
            });
            // 如果过滤结果为空，输出提示
            if (this.displayedTeachers.length === 0) {
                console.log("没有符合筛选条件的教师。");
            } else {
                console.log("筛选后的教师：", this.displayedTeachers);
            }
        },


        //点击查看教师详情
        async viewTeacherDetail(teacher) {
            this.setTeacherId(teacher.id); //点击教师时更新Vuex中的教师ID
            try {
                const response = await axios.get(`http://localhost:8089/teacher/${teacher.id}`); //根据教师id查询教师信息

                console.log("教师的信息：", JSON.stringify(response.data, null, 2)); //null 是不替换任何键，2 代表每层缩进两个空格。
                this.selectedTeacher = response.data.data.teacher;  //更新详情教师信息，包括评论
                this.detailDialogVisible = true; //显示教师详情弹窗
                this.userRating = 0;   //重置评分
                this.commentInput = '';  //清空评论输入框
            } catch (error) {
                this.$message.error('获取教师详细信息失败');
            }

        },
        submitRating(value) {
            this.userRating = value;
        },
        async submitComment() {
            if (!this.commentInput.trim()) {
                this.$message.error('评论内容不能为空！');
                return;
            }
            if (this.userRating === 0) {
                this.$message.error('请先给教师评分！');
                return;
            }

            //从状态管理器中获取用户的头像信息
            const user = this.$store.state;
            // console.log("用户名：" + user.userName);
            // console.log("头像：" + user.userAvatar);
            const newComment = {
                user: {
                    name: user.userName,
                    avatar: user.userAvatar,
                },
                userId: localStorage.getItem('id'),
                teacherId: this.selectedTeacher.id, // 获取当前教师的 ID
                rating: this.userRating,
                comment: this.commentInput,
            };

            try {
                // 使用 axios 将评论数据提交到后端
                const response = await axios.post(`http://localhost:8089/comments/saveComments`, newComment);
                // 后端返回的评论数据包含自增的 id
                const savedComment = response.data.data.comment;

                // 格式化评论数据以匹配模板预期的结构
                const formattedComment = {
                    id: savedComment.id,
                    userCommentDTO: {
                        username: user.userName,
                        avatar: user.userAvatar,
                    },
                    rating: savedComment.rating,
                    comment: savedComment.comment,
                    createAt: savedComment.createAt, // 根据后端字段调整
                };
                // 将返回的评论数据添加到评论列表中
                this.selectedTeacher.comments.unshift(formattedComment);

                // 清空评论输入框和评分
                this.commentInput = '';
                this.userRating = 0;

                // 显示评论提交成功的提示
                this.$message.success('评论发表成功！');

            } catch (error) {
                console.error('提交评论失败:', error);
                this.$message.error('评论提交失败，请重试！');
            }
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

        async fetchTeachers() {
            try {
                const response = await axios.get(`http://localhost:8089/teacher/getTeacherAll`);
                console.log(response.data);
                this.teachers = response.data.data.teacher;
                console.log("更新后的教师数据：", this.teachers);  // 检查是否成功更新
                // 确保初始化时也赋值给 displayedTeachers
                this.displayedTeachers = [...this.teachers];  // 使用深拷贝避免引用传递
            } catch (error) {
                this.$message.error('加载教师数据失败');
            }

        }
    },
    mounted() {
        this.fetchTeachers();  //在组件加载时请求用户数据
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
    justify-content: space-around;
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
