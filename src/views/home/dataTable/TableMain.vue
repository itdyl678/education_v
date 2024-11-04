<template>
    <div class="data-screen">
        <h3>在线教育数据统计</h3>

        <!-- 基本统计数据 -->
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card shadow="hover" :style="{ backgroundColor: 'rgb(41, 182, 246)', color: 'white' }"
                    class="small-card">
                    <div class="card-content">
                        <i class="el-icon-user-solid" style="font-size: 32px;"></i> <!-- 增大图标大小 -->
                        <div class="text-content">
                            <div class="number">{{ studentCount }}</div>
                            <h4>用户总数</h4>
                            <p class="subtitle">Total Users</p>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" :style="{ backgroundColor: 'rgb(126, 87, 194)', color: 'white' }"
                    class="small-card">
                    <div class="card-content">
                        <i class="el-icon-notebook-2" style="font-size: 32px;"></i> <!-- 增大图标大小 -->
                        <div class="text-content">
                            <div class="number">{{ courseCount }}</div>
                            <h4>课程数量</h4>
                            <p class="subtitle">Course Count</p>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" :style="{ backgroundColor: 'rgb(51, 184, 108)', color: 'white' }"
                    class="small-card">
                    <div class="card-content">
                        <i class="el-icon-s-custom" style="font-size: 32px;"></i> <!-- 增大图标大小 -->
                        <div class="text-content">
                            <div class="number">{{ teacherCount }}</div>
                            <h4>教师数量</h4>
                            <p class="subtitle">Teacher Count</p>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="hover" :style="{ backgroundColor: 'rgb(110, 140, 215)', color: 'white' }"
                    class="small-card">
                    <div class="card-content">
                        <div class="icon-container">
                            <i class="el-icon-chat-dot-round" style="font-size: 32px;"></i> <!-- 增大图标大小 -->
                            <div class="red-dot"></div> <!-- 添加小红点 -->
                        </div>
                        <div class="text-content">
                            <div class="number">{{ feedbackCount }}</div>
                            <h4>用户反馈数量</h4>
                            <p class="subtitle">User Feedback Count</p>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 课程报名情况 -->
        <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="24">
                <el-card shadow="hover">
                    <h4>课程报名情况 Course Enrollment Status</h4>
                    <div ref="enrollmentChart" class="chart"></div>
                </el-card>
            </el-col>
        </el-row>

        <!-- 用户分布情况 -->
        <el-row :gutter="20" style="margin-top: 20px;">
            <el-col :span="12">
                <el-card shadow="hover">
                    <h4>用户年龄分布 User Age Distribution</h4>
                    <div ref="ageDistributionChart" class="chart"></div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <h4>用户地区分布 User Region Distribution</h4>
                    <div ref="regionDistributionChart" class="chart"></div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import * as echarts from 'echarts'; // 引入 ECharts

export default {
    name: 'TableMain',
    data() {
        return {
            studentCount: 1200,
            courseCount: 45,
            teacherCount: 30,
            feedbackCount: 150,
            enrollmentData: [200, 150, 280, 140, 320, 405], // 报名人数数据
            enrollmentLabels: ['1月', '2月', '3月', '4月', '5月', '6月'], // 标签
            ageDistributionData: [5, 20, 36, 10, 10], // 年龄分布数据
            ageDistributionLabels: ["0-10岁", "11-20岁", "21-30岁", "31-40岁", "41岁以上"], // 年龄分布标签
            regionDistributionData: [15, 30, 45, 10], // 地区分布数据
            regionDistributionLabels: ["华东", "华南", "华北", "其他"], // 地区分布标签
        };
    },
    mounted() {
        this.initEnrollmentChart(); // 初始化课程报名情况图表
        this.initAgeDistributionChart(); // 初始化用户年龄分布图表
        this.initRegionDistributionChart(); // 初始化用户地区分布图表
    },
    methods: {
        initEnrollmentChart() {
            const chartDom = this.$refs.enrollmentChart;
            const myChart = echarts.init(chartDom);

            const option = {
                title: { text: '课程报名情况' },
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', data: this.enrollmentLabels },
                yAxis: { type: 'value' },
                series: [{
                    name: '报名人数',
                    type: 'line',
                    data: this.enrollmentData,
                    smooth: true,
                    itemStyle: { color: '#42A5F5' },
                }],
            };

            myChart.setOption(option);
        },
        initAgeDistributionChart() {
            const chartDom = this.$refs.ageDistributionChart;
            const myChart = echarts.init(chartDom);

            const option = {
                title: { text: '用户年龄分布' },
                tooltip: { trigger: 'item' },
                series: [{
                    name: '年龄分布',
                    type: 'pie',
                    radius: '50%',
                    data: this.ageDistributionLabels.map((label, index) => ({
                        value: this.ageDistributionData[index],
                        name: label,
                    })),
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)',
                        },
                    },
                }],
            };

            myChart.setOption(option);
        },
        initRegionDistributionChart() {
            const chartDom = this.$refs.regionDistributionChart;
            const myChart = echarts.init(chartDom);

            const option = {
                title: { text: '用户地区分布' },
                tooltip: { trigger: 'axis' },
                xAxis: { type: 'category', data: this.regionDistributionLabels },
                yAxis: { type: 'value' },
                series: [{
                    name: '地区分布',
                    type: 'bar',
                    data: this.regionDistributionData,
                    itemStyle: { color: '#67C23A' },
                }],
            };

            myChart.setOption(option);
        },
    },
};
</script>

<style scoped>
/* 图标容器样式 */
.icon-container {
    position: relative;
    /* 是子元素能够相对于此容器定位 */
}

/* 整体页面样式 */
.data-screen {
    padding: 20px;
    background: linear-gradient(135deg, #f5f5f5, #ffffff);
    min-height: 100vh;
}

/* 卡片内容样式 */
.card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px;
    /* 减少内边距，使卡片看起来更小 */
}

/* 文字内容样式 */
.text-content {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

/* 数字样式 */
.number {
    font-size: 24px;
    font-weight: bold;
    color: white;
    margin-bottom: 5px;
}

/* 汉字标题样式 */
h4 {
    margin: 0;
    font-size: 18px;
    color: white;
    margin-bottom: 5px;
}

/* 英文标题样式 */
.subtitle {
    font-size: 14px;
    color: white;
    margin: 0;
}

/* 图表样式 */
.chart {
    width: 100%;
    height: 300px;
}

/* 卡片样式 */
.el-card {
    text-align: center;
    padding: 10px;
    /* 减少内边距，使卡片看起来更小 */
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s;
}

/* 鼠标悬停时的阴影效果 */
.el-card:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
}

/* 页面标题样式 */
h3 {
    text-align: center;
    margin-bottom: 20px;
    color: #303133;
}

/* 小红点样式 */
.red-dot {
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 10px;
    background-color: red;
    border-radius: 50%;
    /* 使小红点变成圆形 */
}

/* 行间距样式 */
.el-row {
    margin-bottom: 20px;
}

/* 列间距样式 */
.el-col {
    padding: 10px;
}

/* 小卡片类名 */
.small-card {
    height: 120px;
    /* 减少卡片高度 */
}
</style>