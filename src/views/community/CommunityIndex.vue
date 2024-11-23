<template>
    <div class="community-container">
        <!-- 顶部操作栏 -->
        <div class="community-header">
            <el-input v-model="searchQuery" placeholder="搜索帖子" prefix-icon="el-icon-search" class="search-input"
                @keyup.enter="handleSearch"></el-input>
            <el-button type="primary" @click="handleCreatePost">发帖</el-button>
        </div>

        <div class="community-main">
            <!-- 帖子列表区域 -->
            <div class="posts-container" v-infinite-scroll="loadMore" infinite-scroll-disabled="loading"
                infinite-scroll-distance="10">
                <!-- 排序控件 -->
                <div class="sort-container">
                    <el-select v-model="sortOption" placeholder="排序方式" @change="handleSortChange">
                        <el-option label="最新发布" value="newest"></el-option>
                        <el-option label="最热帖子" value="hottest"></el-option>
                    </el-select>
                </div>

                <!-- 帖子卡片 -->
                <el-card class="post-card" v-for="post in validDisplayedPosts" :key="post.id" shadow="hover">
                    <div class="post-header">
                        <h3 class="post-title" @click="viewPostDetail(post)">
                            {{ post.title }}
                        </h3>
                        <el-tag v-for="tag in post.tags" :key="tag" type="info" class="post-tag">
                            {{ tag }}
                        </el-tag>
                    </div>
                    <div class="post-content" @click="viewPostDetail(post)">
                        <p>{{ post.summary }}</p>
                    </div>
                    <div class="post-footer">
                        <div class="post-author">
                            <el-avatar v-if="post.author && post.author.avatar" :src="post.author.avatar"></el-avatar>
                            <span v-if="post.author">{{ post.author.name }}</span>
                            <el-badge v-if="post.author && post.author.points !== undefined" :value="post.author.points"
                                class="points-badge">
                                <el-tooltip content="用户积分" placement="top">
                                    <i class="el-icon-medal-1"></i>
                                </el-tooltip>
                            </el-badge>
                            <!-- 显示创建时间 -->
                            <span class="post-time">{{ formatDate(post.createdAt) }}</span>
                        </div>
                        <div class="post-actions">
                            <el-button type="text" @click="handleUpvote(post)" :class="{ upvoted: post.upvoted }">
                                <i class="el-icon-arrow-up"></i> {{ post.upvotes }}
                            </el-button>
                            <el-button type="text" @click="handleDownvote(post)" :class="{ downvoted: post.downvoted }">
                                <i class="el-icon-arrow-down"></i> {{ post.downvotes }}
                            </el-button>
                            <el-button type="text" @click="viewPostDetail(post)">
                                <i class="el-icon-chat-line-square"></i>
                                {{ post.comments.length }}
                            </el-button>
                        </div>
                    </div>
                </el-card>

                <!-- 加载中提示 -->
                <div v-if="loading" class="loading">
                    <el-loading-text>加载中...</el-loading-text>
                </div>
            </div>

            <!-- 侧边栏 -->
            <div class="sidebar">
                <!-- 分类标签 -->
                <div class="categories">
                    <h4>分类</h4>
                    <el-tag v-for="category in categories" :key="category"
                        :type="selectedCategory === category ? 'primary' : 'info'"
                        @click="handleCategorySelect(category)" class="category-tag">
                        {{ category }}
                    </el-tag>
                </div>

                <!-- 标签云 -->
                <div class="tag-cloud">
                    <h4>热门标签</h4>
                    <div class="tags">
                        <el-tag v-for="tag in popularTags" :key="tag.name" :style="{ fontSize: tag.size + 'px' }"
                            @click="handleTagClick(tag.name)" class="tag-cloud-item">
                            {{ tag.name }}
                        </el-tag>
                    </div>
                </div>

                <!-- 热门帖子 -->
                <div class="hot-posts">
                    <h4>热门帖子</h4>
                    <el-card v-for="hotPost in hotPosts" :key="hotPost.id" class="hot-post-card"
                        @click.native="viewPostDetail(hotPost)">
                        <h5>{{ hotPost.title }}</h5>
                        <p class="hot-post-summary">{{ hotPost.summary }}</p>
                    </el-card>
                </div>
            </div>
        </div>

        <!-- 发帖对话框 -->
        <el-dialog title="创建新帖子" :visible.sync="dialogVisible" width="50%" :before-close="handleDialogClose">
            <el-form :model="newPost" :rules="rules" ref="postForm" label-width="80px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="newPost.title"></el-input>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input type="textarea" v-model="newPost.content"
                        :autosize="{ minRows: 5, maxRows: 10 }"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-select v-model="newPost.category" placeholder="选择分类" multiple>
                        <el-option v-for="category in categories" :key="category" :label="category"
                            :value="category"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitPost">发 布</el-button>
            </span>
        </el-dialog>

        <!-- 帖子详情对话框 -->
        <el-dialog v-if="postDialogVisible && selectedPost && selectedPost.author" :visible.sync="postDialogVisible"
            :title="selectedPost.title" width="60%" class="post-dialog">
            <div class="post-detail">
                <div class="post-content">
                    <div class="post-info">
                        <el-avatar v-if="selectedPost.author.avatar" :src="selectedPost.author.avatar"></el-avatar>
                        <span>{{ selectedPost.author.name }}</span>
                        <span class="post-time">
                            {{ formatDate(selectedPost.createdAt) }}
                        </span>
                    </div>
                    <p>{{ selectedPost.content }}</p>
                </div>
                <!-- 评论区 -->
                <div class="comments-container">
                    <h4>评论</h4>
                    <div class="comments-list">
                        <div v-for="comment in selectedPost.comments" :key="comment.id" class="comment-item">
                            <template v-if="comment && comment.user">
                                <el-avatar v-if="comment.user.avatar" :src="comment.user.avatar"></el-avatar>
                                <div class="comment-content">
                                    <span class="comment-user">{{ comment.user.name }}</span>
                                    <span class="comment-time">{{ formatDate(comment.time) }}</span>
                                    <p>{{ comment.content }}</p>
                                </div>
                            </template>
                        </div>
                    </div>
                    <div class="comment-input">
                        <el-input type="textarea" v-model="commentInput" placeholder="发表你的评论"></el-input>
                        <el-button type="primary" @click="submitComment">发表评论</el-button>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'CommunityIndex',
    data() {
        return {
            searchQuery: '',
            posts: [
                // 示例帖子数据
                {
                    id: 1,
                    title: '如何学习 Vue.js？',
                    summary: '我是一名前端新手，想请教大家如何高效地学习 Vue.js...',
                    content: '详细内容...',
                    tags: ['前端', 'Vue.js'],
                    category: '前端',
                    author: {
                        name: '张三',
                        avatar: 'https://via.placeholder.com/40',
                        points: 120,
                    },
                    upvotes: 15,
                    downvotes: 2,
                    comments: [
                        {
                            id: 1,
                            user: {
                                name: '李四',
                                avatar: 'https://via.placeholder.com/40',
                            },
                            content: '感谢分享！',
                            time: new Date(),
                        },
                        // 更多评论...
                    ],
                    upvoted: false,
                    downvoted: false,
                    createdAt: new Date(),
                },
                // 更多帖子...
            ],
            hotPosts: [
                // 热门帖子数据
                {
                    id: 101,
                    title: 'Java 后端开发最佳实践',
                    summary: '分享一些关于 Java 开发的经验...',
                    author: {
                        name: '王五',
                        avatar: 'https://via.placeholder.com/40',
                    },
                    createdAt: new Date(),
                },
                // 更多热门帖子...
            ],
            categories: ['全部', '前端', '后端', '算法', '人工智能', '数据库'],
            selectedCategory: '全部',
            popularTags: [
                // 热门标签数据，包含名称和大小（用于字体大小）
                { name: 'JavaScript', size: 18 },
                { name: 'Python', size: 16 },
                { name: '算法', size: 20 },
                // 更多标签...
            ],
            dialogVisible: false,
            newPost: {
                title: '',
                content: '',
                category: [],
            },
            rules: {
                title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
                content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
            },
            pageSize: 5,
            currentPage: 1,
            loading: false,
            displayedPosts: [], // 当前显示的帖子列表
            sortOption: 'newest',
            postDialogVisible: false,
            selectedPost: {
                // 初始化 selectedPost，防止未定义
                id: null,
                title: '',
                content: '',
                author: {
                    name: '',
                    avatar: '',
                },
                comments: [],
                createdAt: null,
            },
            commentInput: '', // 评论输入框内容
        };
    },
    computed: {
        filteredPosts() {
            let filtered = this.posts;

            // 按分类过滤
            if (this.selectedCategory !== '全部') {
                filtered = filtered.filter((post) =>
                    post.category.includes(this.selectedCategory)
                );
            }

            // 按搜索关键字过滤
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(
                    (post) =>
                        post.title.toLowerCase().includes(query) ||
                        post.summary.toLowerCase().includes(query)
                );
            }

            // 按排序方式排序
            if (this.sortOption === 'newest') {
                filtered = filtered.sort((a, b) => b.createdAt - a.createdAt);
            } else if (this.sortOption === 'hottest') {
                filtered = filtered.sort((a, b) => b.upvotes - a.upvotes);
            }

            return filtered;
        },
        validDisplayedPosts() {
            // 过滤掉无效的帖子，避免在模板中使用 v-if 和 v-for
            return this.displayedPosts.filter((post) => post && post.author);
        },
    },
    methods: {
        handleSearch() {
            this.currentPage = 1;
            this.displayedPosts = this.filteredPosts.slice(0, this.pageSize);
        },
        handleCreatePost() {
            this.dialogVisible = true;
        },
        submitPost() {
            this.$refs.postForm.validate((valid) => {
                if (valid) {
                    const newId = this.posts.length + 1;
                    const now = new Date();
                    this.posts.unshift({
                        id: newId,
                        title: this.newPost.title,
                        summary: this.newPost.content.substring(0, 50) + '...',
                        content: this.newPost.content,
                        tags: this.newPost.category,
                        category: this.newPost.category,
                        author: {
                            name: '当前用户',
                            avatar: 'https://via.placeholder.com/40',
                            points: 100,
                        },
                        upvotes: 0,
                        downvotes: 0,
                        comments: [],
                        upvoted: false,
                        downvoted: false,
                        createdAt: now,
                    });
                    this.dialogVisible = false;
                    this.$message.success('帖子发布成功！');
                    // 清空表单
                    this.newPost = {
                        title: '',
                        content: '',
                        category: [],
                    };
                    this.displayedPosts = this.filteredPosts.slice(0, this.pageSize);
                } else {
                    this.$message.error('请填写完整的帖子信息！');
                    return false;
                }
            });
        },
        handleUpvote(post) {
            if (post.upvoted) {
                post.upvotes--;
            } else {
                post.upvotes++;
                if (post.downvoted) {
                    post.downvotes--;
                    post.downvoted = false;
                }
            }
            post.upvoted = !post.upvoted;
        },
        handleDownvote(post) {
            if (post.downvoted) {
                post.downvotes--;
            } else {
                post.downvotes++;
                if (post.upvoted) {
                    post.upvotes--;
                    post.upvoted = false;
                }
            }
            post.downvoted = !post.downvoted;
        },
        handleCategorySelect(category) {
            this.selectedCategory = category;
            this.currentPage = 1;
            this.displayedPosts = this.filteredPosts.slice(0, this.pageSize);
        },
        handleSortChange() {
            this.currentPage = 1;
            this.displayedPosts = this.filteredPosts.slice(0, this.pageSize);
        },
        loadMore() {
            if (this.loading) return;
            this.loading = true;
            setTimeout(() => {
                const nextPosts = this.filteredPosts.slice(
                    this.displayedPosts.length,
                    this.displayedPosts.length + this.pageSize
                );
                this.displayedPosts = this.displayedPosts.concat(nextPosts);
                this.loading = false;
            }, 1000);
        },
        handleDialogClose() {
            this.$confirm('确定要放弃编辑吗？').then(() => {
                this.dialogVisible = false;
            });
        },
        viewPostDetail(post) {
            if (post && post.author) {
                this.selectedPost = post;
                this.postDialogVisible = true;
                this.commentInput = '';
            }
        },
        submitComment() {
            if (!this.commentInput.trim()) {
                this.$message.error('评论内容不能为空！');
                return;
            }
            const newComment = {
                id: this.selectedPost.comments.length + 1,
                user: {
                    name: '当前用户',
                    avatar: 'https://via.placeholder.com/40',
                },
                content: this.commentInput,
                time: new Date(),
            };
            this.selectedPost.comments.push(newComment);
            this.commentInput = '';
            this.$message.success('评论发表成功！');
        },
        handleTagClick(tagName) {
            // 点击标签云中的标签，按照标签进行筛选
            this.searchQuery = tagName;
            this.handleSearch();
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
        // 初始化显示的帖子列表
        this.displayedPosts = this.filteredPosts.slice(0, this.pageSize);
    },
};
</script>

<style scoped>
.community-container {
    padding: 20px;
    background-color: #f5f7fa;
}

.community-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
}

.search-input {
    width: 300px;
}

.community-main {
    display: flex;
}

.posts-container {
    flex: 3;
    margin-right: 20px;
    overflow: auto;
}

.sort-container {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
}

.post-card {
    margin-bottom: 20px;
    cursor: pointer;
}

.post-title {
    font-size: 20px;
    margin: 0;
}

.post-title:hover {
    color: #409eff;
}

.post-tag {
    margin-left: 10px;
}

.post-content {
    margin-top: 10px;
}

.post-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}

.post-author {
    display: flex;
    align-items: center;
}

.post-author span {
    margin-left: 10px;
}

.post-time {
    margin-left: 20px;
    color: #909399;
    font-size: 12px;
}

.post-actions {
    display: flex;
    align-items: center;
}

.post-actions .el-button {
    margin-left: 10px;
}

.post-actions .upvoted {
    color: #409eff;
}

.post-actions .downvoted {
    color: #f56c6c;
}

.points-badge {
    margin-left: 10px;
}

.sidebar {
    flex: 1;
}

.categories,
.hot-posts,
.tag-cloud {
    background-color: #fff;
    padding: 20px;
    margin-bottom: 20px;
}

.category-tag {
    margin: 5px 5px 0 0;
    cursor: pointer;
}

.tag-cloud .tags {
    display: flex;
    flex-wrap: wrap;
}

.tag-cloud-item {
    margin: 5px 5px 0 0;
    cursor: pointer;
}

.tag-cloud-item:hover {
    color: #409eff;
}

.hot-post-card {
    margin-bottom: 10px;
    cursor: pointer;
}

.hot-post-card h5 {
    margin: 0;
    font-size: 16px;
}

.hot-post-summary {
    color: #909399;
    font-size: 14px;
}

.loading {
    text-align: center;
    padding: 20px;
    color: #909399;
}

.post-dialog .el-dialog__body {
    padding: 0;
}

.post-detail {
    display: flex;
    flex-direction: column;
}

.post-detail .post-content {
    padding: 20px;
}

.post-info {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.post-info .post-time {
    margin-left: 20px;
    color: #909399;
    font-size: 12px;
}

.comments-container {
    padding: 20px;
    border-top: 1px solid #ebeef5;
}

.comments-list {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 20px;
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
}

.comment-content p {
    margin-top: 5px;
}

.comment-input {
    display: flex;
    align-items: flex-start;
}

.comment-input .el-input {
    flex: 1;
}

.comment-input .el-button {
    margin-left: 10px;
}
</style>
