<template>
    <div>
        <!-- 搜索框，输入用户名进行模糊查询 -->
        <el-input v-model="search" placeholder="请输入课程名" style="width: 200px; margin-bottom: 10px;"
            prefix-icon="el-icon-search" @keyup.enter.native="handleSearch">
        </el-input>

        <!-- 添加用户按钮，点击时调用 handleAdd 方法 -->
        <el-button type="primary" @click="handleAdd" style="margin-bottom: 10px;">添加课程</el-button>

        <!-- 用户信息表格 -->
        <el-table :data="filteredCourses" style="width: 100%; max-width: 1400px;" stripe>
            <!-- 序号列，自动编号 -->
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>

            <el-table-column prop="title" label="课程名" width="120" align="center"></el-table-column>

            <el-table-column prop="img" label="课程图片" width="120" align="center">
                <template slot-scope="scope">
                    <img :src="scope.row.img" alt="课程图片" style="width: 100px;height: 60px;object-fit: cover;">
                </template>
            </el-table-column>

            <el-table-column prop="category" label="课程类型" width="120" align="center"></el-table-column>

            <el-table-column prop="teacherId" label="教师ID" width="80" align="center"></el-table-column>

            <el-table-column prop="createTime" label="创建时间" width="200" align="center"></el-table-column>

            <el-table-column prop="rating" label="评分" width="80" align="center"></el-table-column>

            <el-table-column prop="courseStartTime" label="课程开课时间" width="180" align="center"></el-table-column>
            <!-- 操作列，包含编辑、删除、详情和禁用/启用按钮 -->
            <el-table-column label="操作" width="320" align="center">
                <template slot-scope="scope">
                    <!-- 编辑按钮，点击时调用 handleEdit 方法 -->
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <!-- 删除按钮，点击时调用 handleDelete 方法 -->
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    <!-- 详情按钮，点击时调用 handleDetails 方法 -->
                    <el-button size="mini" type="info" @click="handleDetails(scope.$index, scope.row)">详情</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
            :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[5, 10, 20, 50]"
            :total="total" style="margin-top: 20px; text-align: center;">
        </el-pagination>

        <!-- 添加/编辑用户对话框 -->
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="40%">
            <!-- 表单组件，绑定到 form 对象 -->
            <el-form :model="form" label-width="120px">
                <el-form-item label="课程名">
                    <el-input v-model="form.title" placeholder="请输入课程名"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                    <el-input v-model="form.price" placeholder="请输入价格"></el-input>
                </el-form-item>
                <el-form-item label="评分">
                    <el-input v-model.number="form.rating" placeholder="请输入评分"></el-input>
                </el-form-item>
                <el-form-item label="课程描述">
                    <el-input v-model.number="form.description" placeholder="请输入描述内容"></el-input>
                </el-form-item>
                <!-- 邮箱输入框 -->
                <el-form-item label="详情">
                    <el-input v-model="form.detail" placeholder="请输入课程详情" type="textarea" :rows="8"></el-input>
                </el-form-item>
            </el-form>
            <!-- 对话框底部的操作按钮 -->
            <span slot="footer" class="dialog-footer">
                <!-- 取消按钮，点击时关闭对话框 -->
                <el-button @click="dialogVisible = false">取 消</el-button>
                <!-- 确定按钮，点击时调用 handleSubmit 方法 -->
                <el-button type="primary" @click="handleSubmit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 用户详情对话框 -->
        <el-dialog title="课程详情" :visible.sync="detailsVisible" width="40%">
            <el-descriptions title="" :column="1" border>
                <el-descriptions-item label="课程名">{{ selectedCourse.title }}</el-descriptions-item>
                <el-descriptions-item label="教师ID">{{ selectedCourse.teacherId }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ selectedCourse.createTime }}</el-descriptions-item>
                <el-descriptions-item label="修改时间">{{ selectedCourse.updateTime }}</el-descriptions-item>
                <el-descriptions-item label="评分">{{ selectedCourse.rating }}</el-descriptions-item>
                <el-descriptions-item label="课程类型">{{ selectedCourse.category }}</el-descriptions-item>
                <el-descriptions-item label="价格">{{ selectedCourse.price }}</el-descriptions-item>
                <el-descriptions-item label="报名人数">{{ selectedCourse.joinCount }}</el-descriptions-item>
                <el-descriptions-item label="课程详情">{{ selectedCourse.detail }}</el-descriptions-item>
                <el-descriptions-item label="学习目标">{{ selectedCourse.learningGoal }}</el-descriptions-item>
                <!-- 修改用户头像显示 -->
                <el-descriptions-item label="课程图片">
                    <img :src="selectedCourse.img" alt="课程图片" style="width: 100px; height: 100px;">
                </el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'CourseInfo',
    data() {
        return {
            // 存储课程数据数组
            courses: [],
            // 控制对话框的显示与隐藏
            dialogVisible: false,
            // 对话框的标题
            dialogTitle: '',
            isEditMode: false,  // 用于区分是编辑模式还是添加模式
            // 表单数据对象
            form: {
                id: '',
                title: '',  //课程名
                description: '',
                teacherId: '',
                createTime: '',
                updatedTime: '',
                rating: '',
                category: '',  //课程类型
                img: '',
                price: '',
                joinCount: '',
                courseStartTime: '',
                detail: '',
                learningGoal: '',
            },
            // 当前编辑的用户索引，-1 表示新增用户
            currentIndex: -1,
            // 搜索关键字
            search: '',
            // 当前页码
            currentPage: 1,
            tempPage: 1,  // 用于输入框的临时页码
            // 每页显示的条数
            pageSize: 10,
            // 控制用户详情对话框的显示与隐藏
            detailsVisible: false,
            // 当前选中的课程
            selectedCourse: {},
            //总得数量
            total: 0,
        };
    },
    computed: {
        // 过滤后的用户列表
        filteredCourses() {
            return this.courses.map(course => ({
                //使用 ...course 可以快速、简洁地创建一个新对象，包含原对象的所有属性，
                //同时允许你添加或覆盖某些属性。这样可以有效避免直接修改原对象，保持代码的可维护性。
                ...course,
            }));
        }
    },
    async mounted() {
        await this.getCourseAll();  //挂载后调用getCourseAll方法
    },
    methods: {
        async getCourseAll() {
            try {
                // 使用 data 中的 currentPage ,search和 pageSize
                const { currentPage, pageSize, search } = this;
                const response = await axios.get(`http://localhost:8089/course/getCourseAll`, { params: { currentPage, pageSize, search } });
                const res = response.data
                console.log("ddddddddddddddddddddddcc" + res)
                // 确保响应数据符合预期格式
                if (res && Array.isArray(res.records)) {
                    this.courses = res.records;        // 课程数据列表
                    this.total = res.total;          // 总记录数,这些数据来源于mybatis-plus中自带的分页对象 IPage 包含的信息
                    this.currentPage = res.current;  // 当前页码
                } else {
                    console.error('Unexpected response format:', res);
                    this.courses = [];                 // 确保 courses 为空数组
                    this.total = 0;
                }
            } catch (error) {
                console.error("获取课程数据失败！", error);
                this.courses = [];
                this.total = 0;
            }

        },

        // 添加用户的方法
        handleAdd() {
            // 设置对话框标题为“添加课程信息”
            this.dialogTitle = '添加课程信息';
            // 设置编辑模式为 false，表示是新增课程
            this.isEditMode = false;
            // 清空表单数据
            this.form = {
                title: '', description: '', img: '', price: '',
                detail: '', rating: '',

            };
            // 设置当前编辑的用户索引为 -1（表示新增）
            this.currentIndex = -1;
            // 显示对话框
            this.dialogVisible = true;
        },
        // 编辑用户的方法
        handleEdit(index, row) {
            // 设置对话框标题为“编辑用户”
            this.dialogTitle = '编辑课程';
            // 设置编辑模式为 true，表示是编辑已有用户
            this.isEditMode = true;
            // 将当前行的数据复制到表单中
            this.form = { ...row };
            // 记录当前编辑的用户索引
            this.currentIndex = index;
            // 显示对话框
            this.dialogVisible = true;
        },
        // 搜索方法
        handleSearch() {
            // 触发搜索，重新计算过滤后的用户列表
            this.currentPage = 1;
            this.getCourseAll();
        },
        // 分页大小改变时的处理方法
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.getCourseAll();  // 更新获取数据
        },
        // 当前页码改变时的处理方法
        handleCurrentChange(newPage) {
            this.tempPage = newPage; //更新临时页码
            this.currentPage = newPage; //同步当前页码
            this.getCourseAll();  // 更新获取数据
        },

        // 查看用户详情的方法
        handleDetails(index, row) {
            // 设置当前选中的用户
            this.selectedCourse = { ...row };
            // 显示用户详情对话框
            this.detailsVisible = true;
        },
        // 提交表单的方法
        async handleSubmit() {
            if (this.currentIndex === -1) {
                //调用添加课程的异步函数
                this.addCourse({
                    title: this.form.title,
                    description: this.form.description,
                    price: this.form.price,
                    rating: this.form.rating,
                    detail: this.form.detail,
                })

            } else {
                // 如果是编辑用户，更新用户数组中的异步函数
                await this.updateCourse({
                    id: this.courses[this.currentIndex].id,  //对应数据库中某条课程记录的主键 id
                    title: this.form.title,
                    description: this.form.description,
                    price: this.form.price,
                    rating: this.form.rating,
                    detail: this.form.detail,
                });
            }
            // 关闭对话框
            this.dialogVisible = false;
            // 重置当前页码
            this.currentPage = 1;
        },

        //添加课程异步请求
        async addCourse(CourseDate) {
            try {
                const response = await axios.post(`http://localhost:8089/course/addCourse`, CourseDate);
                if (response.status === 201) {
                    //从新获取课程信息
                    await this.getCourseAll();

                    this.$message({
                        message: '课程添加成功',
                        type: "success",
                        duration: 1500
                    })
                }
            } catch (error) {
                this.$message({
                    message: '课程添加失败!',
                    type: 'error',
                    duration: 1550
                })
            }
        },
        //修改课程信息
        async updateCourse(CourseDate) {
            try {
                const response = await axios.put(`http://localhost:8089/course/updateCourse/${CourseDate.id}`, CourseDate);
                if (response.status === 200) {
                    await this.getCourseAll();
                    this.$message({
                        message: '修改成功!',
                        type: 'success',
                        duration: 2000
                    })
                }
            } catch (error) {
                this.$message({
                    message: '课程修改失败！',
                    type: 'error',
                    duration: 2000
                })
            }

        },

        //删除课程信息
        async handleDelete(index, row) {
            // 弹出确认对话框
            this.$confirm('此操作将永久删除该课程, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 确认删除后，从用户数组中移除该用户
                try {
                    const response = await axios.delete(`http://localhost:8089/course/${row.id}`); //调用后端删除接口
                    if (response.status === 200) {
                        this.courses.splice(index, 1);
                        // 显示删除成功的消息
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        await this.getCourseAll(); //刷新用户列表
                    }
                } catch (error) {
                    console.error("删除课程失败！", error);
                }
            }).catch(() => {
                // 取消删除后，显示已取消删除的消息
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
    }
}
</script>

<style scoped>
/* 基础样式 */
h2 {
    font-size: 24px;
    margin-bottom: 20px;
}

.el-input,
.el-button {
    margin-right: 10px;
}

.el-table {
    margin-top: 20px;
    width: 100%;
    max-width: 1400px;
}

.el-pagination {
    text-align: center;
}

/* 对话框样式 */
.el-dialog {
    border-radius: 10px;
}

.el-dialog__header {
    background-color: #f0f0f0;
    padding: 15px;
    border-bottom: 1px solid #ddd;
}

.el-dialog__body {
    padding: 20px;
}

.el-dialog__footer {
    padding: 10px;
    border-top: 1px solid #ddd;
    text-align: right;
}

.el-form-item {
    margin-bottom: 15px;
}

.el-button--primary {
    background-color: #409eff;
    border-color: #409eff;
}

.el-button--primary:hover {
    background-color: #66b1ff;
    border-color: #66b1ff;
}

/* 用户详情对话框样式 */
.el-descriptions {
    margin-top: 20px;
}

.el-descriptions-item {
    padding: 10px;
    border-bottom: 1px solid #ebebeb;
}

.el-descriptions-item:last-child {
    border-bottom: none;
}
</style>