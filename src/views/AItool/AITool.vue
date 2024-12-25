<template>
    <div>
        <header class="header">
            <h1>AI Tools</h1>
        </header>
        <div class="container">
            <aside class="sidebar">
                <h2>最近的提问</h2>
                <ul>
                    <li v-for="(record, index) in history" :key="index" @click="loadHistory(record)">
                        <strong>{{ record.question }}</strong>
                    </li>
                </ul>
            </aside>
            <main class="main-content">
                <div class="result">
                    <div v-if="loading" class="loading">生成中...</div>
                    <div v-else>
                        <div v-for="(item, index) in chatHistory" :key="index" :class="['chat-item', item.type]">
                            <div class="chat-item-header">
                                <!-- <img v-if="item.type === 'question'" class="icon user-icon"
                                    :src="$store.state.userAvatar" alt="User" /> -->
                                <!-- <img v-else class="icon ai-icon" src="" alt="AI" /> -->
                            </div>
                            <div v-if="item.type === 'question'" class="question"><img v-if="item.type === 'question'"
                                    class="icon user-icon" :src="$store.state.userAvatar" alt="User" />{{ item.question
                                }}
                            </div>
                            <img v-else class="icon user-icon" src="../../assets/image/AIlog.png" alt="AI" />
                            <div v-if="item.type === 'answer'" class="answer" v-html="item.text"></div>
                        </div>
                    </div>
                </div>
                <div class="form-container">
                    <el-form @submit.native.prevent="onSubmit" class="form">
                        <el-input v-model="inputText" type="textarea" rows="4" placeholder="请输入您的问题或需要生成的内容"
                            @input="onInput" clearable class="input-field"></el-input>
                        <el-button type="primary" native-type="submit" class="submit-button">提交</el-button>
                        <el-button type="success" @click="startVoiceRecognition" class="voice-button">语音输入</el-button>
                        <el-button type="info" @click="speakResult" class="voice-button">语音播放</el-button>
                        <el-button type="warning" @click="copyToClipboard" class="voice-button">复制结果</el-button>
                        <el-button type="danger" @click="shareResult" class="voice-button">分享结果</el-button>
                    </el-form>
                </div>
            </main>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            inputText: '',
            // selectedService: '',
            result: '',
            loading: false,
            history: [],
            darkMode: false,
            chatHistory: []
        };
    },
    //加载时，向后端获取历史记录
    async created() {
        try {
            const userId = this.$store.state.userId;
            const response = await axios.get(`http://localhost:8089/api/get-history/${userId}`);
            this.history = response.data.history || [];
        } catch (error) {
            console.error('获取历史记录失败:', error);
        }
    },
    methods: {
        onInput(value) {
            // 实时预览
            this.result = value;
        },
        async onSubmit() {
            if (!this.inputText) {
                this.$message.error('输入的内容不能为空！');
                return;
            }

            // 1. 将用户问题立即显示在界面上
            //   并且插入一个“AI 正在生成中...”的回答占位
            this.loading = true;
            const questionItem = { type: 'question', question: this.inputText };
            this.chatHistory.push(questionItem);

            // 插入一个 “生成中” 占位回答
            const inProgressAnswer = { type: 'answer', question: 'AI 正在生成中...' };
            this.chatHistory.push(inProgressAnswer);
            // 记录下这个占位回答所在的下标，后面好更新
            const inProgressIndex = this.chatHistory.length - 1;

            // 2. 清空输入框
            const currentQuestion = this.inputText;  // 缓存一下，以防后面需要
            this.inputText = '';

            // 3. 调用后端接口
            try {
                const response = await axios.post('http://localhost:8089/api/ask-question', {
                    //将用户的信息一同传入后端并存储于数据库中
                    question: currentQuestion,
                    userId: this.$store.state.userId,
                    username: this.$store.state.userName
                });

                // 后端返回的真正答案
                this.result = response.data.result || '（后端未返回结果）';

                // 4. 将占位回答替换为真实回答
                this.chatHistory[inProgressIndex].text = this.result;

                // 记录进“历史问题”列表
                this.history.unshift({
                    input: currentQuestion,
                    result: this.result
                });

            } catch (error) {
                console.error('请求失败:', error);
                this.$message.error('请求失败，请稍后再试。');
                // 如果失败，可以更新占位回答为“生成失败”
                this.chatHistory[inProgressIndex].text = 'AI生成失败，请稍后重试';
            } finally {
                this.loading = false;
            }
        },
        startVoiceRecognition() {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'zh-CN';
            recognition.onresult = (event) => {
                this.inputText = event.results[0][0].transcript;
            };
            recognition.start();
        },
        speakResult() {
            const utterance = new SpeechSynthesisUtterance(this.result);
            speechSynthesis.speak(utterance);
        },
        copyToClipboard() {
            navigator.clipboard.writeText(this.result).then(() => {
                this.$message.success('已复制到剪贴板');
            }, () => {
                this.$message.error('复制失败');
            });
        },
        shareResult() {
            if (navigator.share) {
                navigator.share({
                    title: 'AI Tools',
                    text: this.result,
                    url: window.location.href
                }).then(() => {
                    this.$message.success('分享成功');
                }, () => {
                    this.$message.error('分享失败');
                });
            } else {
                this.$message.warning('当前浏览器不支持分享功能');
            }
        },
        loadHistory(record) {
            this.inputText = record.question;
            this.result = record.answer;
            this.chatHistory = [
                { type: 'question', question: record.question },
                { type: 'answer', text: record.answer }
            ];
        },
    }
};
</script>

<style scoped>
header {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-bottom: 1px;
}

.header-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    /* 调整控件之间的间距 */

}

.service-select {
    width: 150px;
    /* 调整选择器的宽度 */
}

.container {
    display: flex;
    height: calc(100vh - 100px);
    /* 线性渐变示例：从 120 度方向开始，三段淡色渐变 */
    background: linear-gradient(120deg,
            /* 起始为浅粉 */
            #ffd8d8 0%,
            /* 中间过渡到浅绿 */
            #d8ffe4 50%,
            /* 最后到浅蓝 */
            #d8eeff 100%);
}

.sidebar {
    width: 300px;
    border-right: 1px solid #ccc;
    overflow-y: auto;
}

.sidebar h2 {
    margin-bottom: 10px;
}

.sidebar ul {
    list-style: none;
    padding: 0;
}

.sidebar li {
    padding: 10px;
    cursor: pointer;
    border-bottom: 0px solid #ccc;
}

.sidebar li:hover {
    background-color: #268b93;
}

.main-content {
    flex-grow: 1;
    padding: 50px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.result {
    flex-grow: 1;
    border: 1px solid #ccc;
    padding: 15px;
    background-color: #f9f9f9;
    overflow-y: auto;
    margin-bottom: 20px;
    /* 增加答案区域和输入区域之间的间距 */
}

.loading {
    color: #333;
    font-size: 16px;
    text-align: center;
    margin-top: 20px;
}

.chat-item {
    margin-bottom: 10px;
    border-radius: 8px;
    padding: 10px;
}

.chat-item.question {
    background-color: #cbefef;
    /* 浅蓝色背景 */
    color: #333;
}

.chat-item.answer {
    /* 线性渐变，从左到右，用蓝色平滑过渡到紫色 */
    background: linear-gradient(to right,
            /* 渐变方向：从左到右，也可改为角度如 120deg */
            #cce0ff,
            /* 浅蓝 (起始) */
            #e6ccff
            /* 淡紫 (结束) */
        );
}

.answer {
    white-space: pre-wrap;
}

.form-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* 调整输入框之间的间距 */
}

.input-field {
    width: 100%;
}

.submit-button,
.voice-button {
    margin-top: 10px;
}

.icon.user-icon {
    width: 30px;
    /* 控制头像的宽度 */
    height: 30px;
    /* 控制头像的高度，与宽度相同才是正圆 */
    border-radius: 50%;
    /* 圆角度数设为 50%，让头像显示成圆形 */
    object-fit: cover;
    /* 如果图片比例和容器不一致，cover让图片剪裁适应容器 */
    margin-right: 8px;
    /* 可以根据需要在文字与头像之间留一些间距 */
}

.header {
    background: linear-gradient(120deg,
            #ffdee2,
            /* 粉色 */
            #d7f9d7,
            /* 绿色 */
            #d9f2ff
            /* 浅蓝 */
        );
}
</style>