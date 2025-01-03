<template>
    <div>
        <!-- 搜索框，输入用户名进行模糊查询 -->
        <el-input v-model="search" placeholder="请输入用户名" style="width: 200px; margin-bottom: 10px;"
            prefix-icon="el-icon-search" @keyup.enter.native="handleSearch">
        </el-input>

        <!-- 添加用户按钮，点击时调用 handleAdd 方法 -->
        <el-button type="primary" @click="handleAdd" style="margin-bottom: 10px;">添加用户</el-button>

        <!-- 用户信息表格 -->
        <el-table :data="filteredUsers" style="width: 100%; max-width: 1400px;" stripe>
            <!-- 序号列，自动编号 -->
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <!-- 用户名列，绑定到用户的 username 属性 -->
            <el-table-column prop="username" label="用户名" width="120" align="center"></el-table-column>
            <!-- 密码列，绑定到用户的 password 属性 -->
            <el-table-column prop="password" label="密码" width="120" align="center"></el-table-column>
            <!-- 年龄列，绑定到用户的 age 属性 -->
            <el-table-column prop="age" label="年龄" width="80" align="center"></el-table-column>
            <!-- 性别列，绑定到用户的 gender 属性 -->
            <el-table-column prop="gender" label="性别" width="80" align="center"></el-table-column>
            <!-- 邮箱列，绑定到用户的 email 属性 -->
            <el-table-column prop="email" label="邮箱" width="200" align="center"></el-table-column>
            <!-- 用户状态列，绑定到用户的 status 属性 -->
            <el-table-column prop="status" label="用户状态" width="120" align="center"></el-table-column>
            <!-- 修改时间列，绑定到用户的 updatedAt 属性 -->
            <el-table-column prop="formattedUpdatedAt" label="修改时间" width="180" align="center"></el-table-column>
            <!-- 操作列，包含编辑、删除、详情和禁用/启用按钮 -->
            <el-table-column label="操作" width="320" align="center">
                <template slot-scope="scope">
                    <!-- 编辑按钮，点击时调用 handleEdit 方法 -->
                    <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <!-- 删除按钮，点击时调用 handleDelete 方法 -->
                    <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    <!-- 详情按钮，点击时调用 handleDetails 方法 -->
                    <el-button size="mini" type="info" @click="handleDetails(scope.$index, scope.row)">详情</el-button>
                    <!-- 禁用/启用按钮，点击时调用 handleToggleStatus 方法 -->
                    <el-button size="mini" :type="scope.row.status === '正常' ? 'warning' : 'success'"
                        @click="handleToggleStatus(scope.$index, scope.row)">
                        {{ scope.row.status === '正常' ? '禁用' : '启用' }}
                    </el-button>
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
                <!-- 用户名输入框 -->
                <el-form-item label="用户名">
                    <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <!-- 密码输入框，显示为密码类型 -->
                <el-form-item label="密码">
                    <el-input v-model="form.password" placeholder="请输入密码" show-password
                        :disabled="isEditMode"></el-input>
                </el-form-item>
                <!-- 年龄输入框 -->
                <el-form-item label="年龄">
                    <el-input v-model.number="form.age" placeholder="请输入年龄"></el-input>
                </el-form-item>
                <!-- 性别选择框 -->
                <el-form-item label="性别">
                    <el-select v-model="form.gender" placeholder="请选择性别">
                        <el-option label="男" value="男"></el-option>
                        <el-option label="女" value="女"></el-option>
                    </el-select>
                </el-form-item>
                <!-- 邮箱输入框 -->
                <el-form-item label="邮箱">
                    <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <!-- 电话号码输入框 -->
                <el-form-item label="电话号码">
                    <el-input v-model="form.phone" placeholder="请输入电话号码"></el-input>
                </el-form-item>
                <!-- 身份证号输入框 -->
                <el-form-item label="身份证号">
                    <el-input v-model="form.idCard" placeholder="请输入身份证号"></el-input>
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
        <el-dialog title="用户详情" :visible.sync="detailsVisible" width="40%">
            <el-descriptions title="" :column="2" border>
                <el-descriptions-item label="用户名">{{ selectedUser.username }}</el-descriptions-item>
                <el-descriptions-item label="密码">{{ selectedUser.password }}</el-descriptions-item>
                <el-descriptions-item label="年龄">{{ selectedUser.age }}</el-descriptions-item>
                <el-descriptions-item label="性别">{{ selectedUser.gender }}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{ selectedUser.email }}</el-descriptions-item>
                <el-descriptions-item label="电话号码">{{ selectedUser.phone }}</el-descriptions-item>
                <el-descriptions-item label="身份证号">{{ selectedUser.idCard }}</el-descriptions-item>
                <el-descriptions-item label="创建时间">{{ selectedUser.formattedCreatedAt }}</el-descriptions-item>
                <el-descriptions-item label="用户状态">{{ selectedUser.status }}</el-descriptions-item>
                <el-descriptions-item label="修改时间">{{ selectedUser.formattedUpdatedAt }}</el-descriptions-item>
                <!-- 修改用户头像显示 -->
                <el-descriptions-item label="用户头像">
                    <img :src="selectedUser.avatar" alt="用户头像" style="width: 100px; height: 100px;">
                </el-descriptions-item>
            </el-descriptions>
        </el-dialog>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'UserInfo',
    data() {
        return {
            // 存储用户数据数组
            users: [],
            // 控制对话框的显示与隐藏
            dialogVisible: false,
            // 对话框的标题
            dialogTitle: '',
            isEditMode: false,  // 用于区分是编辑模式还是添加模式
            // 表单数据对象
            form: {
                id: '',
                username: '',
                password: '',
                age: '',
                gender: '',
                email: '',
                phone: '',
                idCard: '',
                createdAt: '',
                status: '',
                avatar: '',
                updatedAt: '',
                formattedCreatedAt: '',
                formattedUpdatedAt: ''
            },
            // 当前编辑的用户索引，-1 表示新增用户
            currentIndex: -1,
            // 搜索关键字
            search: '',
            // 当前页码
            currentPage: 1,
            tempPage: 1,  // 用于输入框的临时页码
            // 每页显示的条数
            pageSize: 5,
            // 控制用户详情对话框的显示与隐藏
            detailsVisible: false,
            // 当前选中的用户
            selectedUser: {},
            //总得数量
            total: 0,
        };
    },
    async mounted() {
        await this.getUserAll();  //组件挂载时调用getUserAll方法
    },

    computed: {
        // 过滤后的用户列表
        filteredUsers() {
            return this.users.map(user => ({
                //使用 ...user 可以快速、简洁地创建一个新对象，包含原对象的所有属性，
                //同时允许你添加或覆盖某些属性。这样可以有效避免直接修改原对象，保持代码的可维护性。
                ...user,
                status: user.status == 1 ? '正常' : '已禁用'  //状态转换
            }));
        }
    },
    methods: {
        // 获取所有的用户信息
        async getUserAll() {
            try {
                // 使用 data 中的 currentPage ,search和 pageSize
                const { currentPage, pageSize, search } = this;
                const response = await axios.get('http://localhost:8089/users/getUserAll', { params: { currentPage, pageSize, search } });

                console.log("-----------------------------");
                console.log(response.data);
                const res = response.data;

                // 确保响应数据符合预期格式
                if (res && Array.isArray(res.records)) {
                    this.users = res.records;        // 用户数据列表
                    this.total = res.total;          // 总记录数,这些数据来源于mybatis-plus中自带的分页对象 IPage 包含的信息
                    this.currentPage = res.current;  // 当前页码
                } else {
                    console.error('Unexpected response format:', res);
                    this.users = [];                 // 确保 users 为空数组
                    this.total = 0;
                }
            } catch (error) {
                console.error("获取用户数据失败！", error);
                this.users = [];
                this.total = 0;
            }
        },
        // 搜索方法
        handleSearch() {
            // 触发搜索，重新计算过滤后的用户列表
            this.currentPage = 1;
            this.getUserAll();
        },
        // 添加用户的方法
        handleAdd() {
            // 设置对话框标题为“添加用户”
            this.dialogTitle = '添加用户';
            // 设置编辑模式为 false，表示是新增用户
            this.isEditMode = false;
            // 清空表单数据
            this.form = { username: '', password: '', age: '', gender: '', email: '', phone: '', idCard: '', createdAt: '', status: '' };
            // 设置当前编辑的用户索引为 -1（表示新增）
            this.currentIndex = -1;
            // 显示对话框
            this.dialogVisible = true;
        },
        // 编辑用户的方法
        handleEdit(index, row) {
            // 设置对话框标题为“编辑用户”
            this.dialogTitle = '编辑用户';
            // 设置编辑模式为 true，表示是编辑已有用户
            this.isEditMode = true;
            // 将当前行的数据复制到表单中
            this.form = { ...row };
            // 记录当前编辑的用户索引
            this.currentIndex = index;
            // 显示对话框
            this.dialogVisible = true;
        },
        // 删除用户的方法
        async handleDelete(index, row) {
            // 弹出确认对话框
            this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                // 确认删除后，从用户数组中移除该用户
                try {
                    await axios.delete(`http://localhost:8089/users/${row.id}`); //调用后端删除接口
                    this.users.splice(index, 1);
                    // 显示删除成功的消息
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });

                    await this.getUserAll(); //刷新用户列表
                } catch (error) {
                    console.error("删除用户失败！", error);
                }
            }).catch(() => {
                // 取消删除后，显示已取消删除的消息
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 提交表单的方法
        async handleSubmit() {
            if (this.currentIndex === -1) {
                //调用添加用户的异步函数
                this.addUser({
                    username: this.form.username,
                    password: this.form.password,
                    age: this.form.age,
                    gender: this.form.gender,
                    email: this.form.email,
                    phone: this.form.phone,
                    idCard: this.form.idCard,
                    createdAt: new Date().toLocaleString(),
                    status: '正常',
                    updatedAt: new Date().toLocaleString(),
                })

            } else {
                // 如果是编辑用户，更新用户数组中的异步函数
                await this.updateUser({
                    id: this.users[this.currentIndex].id,
                    username: this.form.username,
                    password: this.form.password,
                    age: this.form.age,
                    gender: this.form.gender,
                    email: this.form.email,
                    phone: this.form.phone,
                    idCard: this.form.idCard,
                    // status: this.form.status,
                });
            }

            // 关闭对话框
            this.dialogVisible = false;
            // 重置当前页码
            this.currentPage = 1;
        },

        //增加用户信息并向服务器发起请求
        async addUser(userData) {
            try {
                const response = await axios.post('http://localhost:8089/users/addUser', userData);
                if (response.status === 201) {   //201表示创建成功

                    // 重新获取用户列表
                    await this.getUserAll();

                    this.$message({
                        type: 'success',
                        message: '用户添加成功',
                        duration: 2000
                    });
                }
            } catch (error) {
                this.$message({
                    type: 'error',
                    message: '添加用户失败！'
                });
            }
        },

        //更新用户的方法
        async updateUser(userData) {
            try {
                const response = await axios.put(`http://localhost:8089/users/updateUser/${userData.id}`, userData);
                if (response.status === 200) {
                    await this.getUserAll();  //刷新用户列表

                    //弹窗
                    this.$message({
                        type: 'success',
                        message: '修改成功',
                        duration: 2000

                    })
                }
            } catch (error) {
                this.$message({
                    message: '用户更新失败',
                    type: 'error',
                    duration: 2000
                })
            }
        },
        // 分页大小改变时的处理方法
        handleSizeChange(newSize) {
            this.pageSize = newSize;
            this.getUserAll();  // 更新获取数据
        },
        // 当前页码改变时的处理方法
        handleCurrentChange(newPage) {
            this.tempPage = newPage; //更新临时页码
            this.currentPage = newPage; //同步当前页码
            this.getUserAll();  // 更新获取数据
        },

        // 查看用户详情的方法
        handleDetails(index, row) {
            // 设置当前选中的用户
            this.selectedUser = { ...row };
            // 显示用户详情对话框
            this.detailsVisible = true;
        },
        // 切换用户状态的方法
        handleToggleStatus(index, row) {

            // 根据当前状态决定新的状态，‘正常’变为‘禁用’，‘禁用’变为‘正常’
            const newStatus = row.status === '正常' ? '禁用' : '正常';

            // 更新本地用户数据中的状态
            this.users[index].status = newStatus;

            // 更新最后修改时间
            // this.users[index].updatedAt = new Date().toLocaleString();

            // 提示信息，告知用户状态已切换
            this.$message({
                type: 'success',
                message: `${row.username} 已${newStatus}`,
                duration: 2000
            });

            // 调用更新用户状态的后端接口，保存修改到数据库
            this.updateUserStatus(this.users[index]);
        },

        // 调用后端接口更新用户状态
        async updateUserStatus(user) {
            try {
                // 发送 PUT 请求更新数据库中的用户状态
                const response = await axios.put(`http://localhost:8089/users/transForUser/${user.id}`, user);

                // 如果后端返回状态码为 200，表示更新成功
                if (response.status === 200) {
                    this.$message({
                        type: 'success',
                        message: '状态更新成功',
                        duration: 3000
                    });

                    //重新加载页面
                    await this.getUserAll();
                }
            } catch (error) {
                // 如果出现错误，提示用户更新失败
                this.$message({
                    type: 'error',
                    message: '状态更新失败',
                    duration: 2000
                });
            }
        }
    }
};
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