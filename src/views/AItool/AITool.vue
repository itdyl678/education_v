<template>
    <div :class="['ai-tools', darkMode ? 'dark' : 'light']">
        <header>
            <h1>AI Tools</h1>
            <div class="header-controls">
                <el-select v-model="selectedService" placeholder="请选择AI服务" class="service-select">
                    <el-option label="文本生成" value="text-generation"></el-option>
                    <el-option label="翻译" value="translation"></el-option>
                    <el-option label="问答" value="qa"></el-option>
                </el-select>
                <el-switch v-model="darkMode" active-text="暗模式" inactive-text="亮模式"></el-switch>
            </div>
        </header>
        <div class="container">
            <aside class="sidebar">
                <h2>最近的提问</h2>
                <ul>
                    <li v-for="(record, index) in history" :key="index" @click="loadHistory(record)">
                        <strong>{{ record.input }}</strong>
                    </li>
                </ul>
            </aside>
            <main class="main-content">
                <div class="result">
                    <div v-if="loading" class="loading">加载中...</div>
                    <div v-else>
                        <div v-for="(item, index) in chatHistory" :key="index" :class="['chat-item', item.type]">
                            <div v-if="item.type === 'question'" class="question">{{ item.text }}</div>
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
export default {
    data() {
        return {
            inputText: '',
            selectedService: '',
            result: '',
            loading: false,
            history: [],
            darkMode: false,
            chatHistory: []
        };
    },
    methods: {
        onInput(value) {
            // 实时预览
            this.result = value;
        },
        async onSubmit() {
            if (!this.inputText || !this.selectedService) {
                this.$message.error('请确保输入内容和服务类型都已选择！');
                return;
            }
            this.loading = true;
            this.chatHistory.push({ type: 'question', text: this.inputText });
            try {
                const response = await this.$axios.post('/api/ai-tools', {
                    text: this.inputText,
                    service: this.selectedService
                });
                this.result = response.data.result;
                this.chatHistory.push({ type: 'answer', text: this.result });
                this.history.unshift({
                    input: this.inputText,
                    result: this.result
                });
                if (this.history.length > 10) {
                    this.history.pop();
                }
            } catch (error) {
                console.error('请求失败:', error);
                this.$message.error('请求失败，请稍后再试。');
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
            this.inputText = record.input;
            this.result = record.result;
            this.chatHistory = [
                { type: 'question', text: record.input },
                { type: 'answer', text: record.result }
            ];
        }
    }
};
</script>

<style scoped>
.ai-tools {
    padding: 20px;
    transition: background-color 0.3s, color 0.3s;
}

.ai-tools.dark {
    background-color: #333;
    color: #fff;
}

.ai-tools.light {
    background-color: #fff;
    color: #333;
}

header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
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
    border-bottom: 1px solid #ccc;
}

.sidebar li:hover {
    background-color: #f0f0f0;
}

.main-content {
    flex-grow: 1;
    padding: 20px;
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
    background-color: #d4e6f1;
    /* 浅蓝色背景 */
    color: #333;
}

.chat-item.answer {
    background-color: #f0f0f0;
    color: #333;
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
</style>