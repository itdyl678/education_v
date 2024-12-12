<template>
    <div class="live-stream-container">
        <!-- 动态背景 -->
        <div class="dynamic-background"></div>

        <!-- 直播视频播放器 -->
        <div class="video-player">
            <video controls autoplay>
                <source src="https://your-video-url.com/video.mp4" type="video/mp4">
                您的浏览器不支持 video 标签。
            </video>
        </div>

        <!-- 聊天窗口 -->
        <div class="chat-window">
            <div class="chat-messages">
                <div v-for="message in messages" :key="message.id" class="chat-message">
                    <strong>{{ message.username }}:</strong> {{ message.text }}
                </div>
            </div>
            <div class="chat-input">
                <el-input v-model="newMessage" placeholder="输入消息..." @keyup.enter="sendMessage"></el-input>
            </div>
        </div>

        <!-- 礼物系统 -->
        <div class="gift-system">
            <h3>送礼物</h3>
            <el-button type="success" @click="sendGift('花')">送花</el-button>
            <el-button type="warning" @click="sendGift('火箭')">送火箭</el-button>
            <el-button type="danger" @click="sendGift('跑车')">送跑车</el-button>
        </div>

        <!-- 观众列表 -->
        <div class="audience-list">
            <h3>观众列表</h3>
            <ul>
                <li v-for="viewer in viewers" :key="viewer.id">{{ viewer.name }}</li>
            </ul>
        </div>

        <!-- 控制栏 -->
        <div class="control-bar">
            <el-button type="primary" @click="like">点赞</el-button>
            <el-button type="info" @click="share">分享</el-button>
            <el-button type="success" @click="startLuckyDraw">观众互动轮盘</el-button>
        </div>

        <!-- 直播倒计时 -->
        <div class="live-countdown">
            剩余时间: {{ countdownTime }}
        </div>

        <!-- 观众反馈评分 -->
        <div class="rating-system">
            <h3>给主播打分</h3>
            <el-rate v-model="rating" @change="submitRating"></el-rate>
        </div>

        <!-- 观众互动轮盘 -->
        <div class="lucky-draw" v-if="showLuckyDraw">
            <h3>观众互动轮盘</h3>
            <el-button type="primary" @click="drawWinner">抽取幸运观众</el-button>
            <p v-if="winner">恭喜 {{ winner.name }} 成为幸运观众！</p>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            newMessage: '',
            messages: [],
            viewers: [
                { id: 1, name: '张三' },
                { id: 2, name: '李四' },
                { id: 3, name: '王五' }
            ],
            likes: 0,
            gifts: [],
            rating: 0,
            countdownTime: '00:00:00',
            showLuckyDraw: false,
            winner: null
        };
    },
    methods: {
        sendMessage() {
            if (this.newMessage.trim()) {
                this.messages.push({
                    id: this.messages.length + 1,
                    username: '当前用户',
                    text: this.newMessage
                });
                this.newMessage = '';
            } else {
                this.$message.warning('消息不能为空');
            }
        },
        sendGift(gift) {
            this.gifts.push({
                id: this.gifts.length + 1,
                gift: gift,
                sender: '当前用户'
            });
            this.$message.success(`已发送 ${gift}`);
        },
        like() {
            this.likes++;
            this.$message.success(`已点赞，当前点赞数: ${this.likes}`);
        },
        share() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.$message.success('链接已复制到剪贴板');
            }).catch(err => {
                this.$message.error('复制失败');
            });
        },
        startLuckyDraw() {
            this.showLuckyDraw = true;
        },
        drawWinner() {
            const randomIndex = Math.floor(Math.random() * this.viewers.length);
            this.winner = this.viewers[randomIndex];
            this.$message.success(`恭喜 ${this.winner.name} 成为幸运观众！`);
        },
        submitRating() {
            this.$message.success(`您给主播打了 ${this.rating} 星`);
        },
        startCountdown(duration) {
            let timeLeft = duration;
            const interval = setInterval(() => {
                if (timeLeft > 0) {
                    this.countdownTime = this.formatTime(timeLeft);
                    timeLeft--;
                } else {
                    clearInterval(interval);
                    this.countdownTime = '直播结束';
                }
            }, 1000);
        },
        formatTime(seconds) {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;
            return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
        }
    },
    mounted() {
        // 启动倒计时，例如直播时间为1小时
        this.startCountdown(3600);
    }
};
</script>

<style scoped>
.live-stream-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.dynamic-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%);
    opacity: 0.8;
    z-index: -1;
}

.video-player {
    width: 100%;
    max-width: 800px;
    margin-bottom: 20px;
}

.video-player video {
    width: 100%;
    height: auto;
}

.chat-window {
    width: 100%;
    max-width: 800px;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 300px;
}

.chat-messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 10px;
    background-color: #f9f9f9;
}

.chat-input {
    padding: 10px;
    background-color: #fff;
    border-top: 1px solid #ddd;
}

.chat-message {
    margin-bottom: 10px;
}

.gift-system {
    width: 100%;
    max-width: 800px;
    margin: 20px 0;
    display: flex;
    justify-content: space-around;
}

.audience-list {
    width: 100%;
    max-width: 800px;
    margin: 20px 0;
}

.audience-list ul {
    list-style-type: none;
    padding: 0;
}

.audience-list li {
    margin-bottom: 5px;
}

.control-bar {
    width: 100%;
    max-width: 800px;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.live-countdown {
    margin-top: 20px;
    font-weight: bold;
}

.rating-system {
    width: 100%;
    max-width: 800px;
    margin: 20px 0;
}

.lucky-draw {
    width: 100%;
    max-width: 800px;
    margin: 20px 0;
    text-align: center;
}
</style>