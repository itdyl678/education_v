<template>
    <footer class="footer">
        <div class="footer-container">
            <!-- Logo 和简短介绍 -->
            <div class="footer-about">
                <img src="../../assets/image/首页logo1.jpg" alt="酷爱学堂 Logo" class="footer-logo" />
                <p class="footer-description">
                    酷爱学堂，您的在线学习伙伴，助您开启知识之旅。
                </p>
            </div>

            <!-- 快速链接 -->
            <div class="footer-links">
                <h3>快速链接</h3>
                <ul>
                    <li><router-link to="/">首页</router-link></li>
                    <li><router-link to="/courses">课程中心</router-link></li>
                    <li><router-link to="/teachers">师资力量</router-link></li>
                    <li><router-link to="/community">学习社区</router-link></li>
                    <li><router-link to="/ai-helper">AI 助手</router-link></li>
                    <li><router-link to="/live">直播</router-link></li>
                </ul>
            </div>

            <!-- 联系方式 -->
            <div class="footer-contact">
                <h3>联系我们</h3>
                <p>Email: support@kuailearning.com</p>
                <p>电话: 123-456-7890</p>
                <div class="social-media">
                    <a href="#" aria-label="WeChat">
                        <i class="el-icon-chat-dot-round"></i>
                    </a>
                    <a href="#" aria-label="Weibo">
                        <i class="el-icon-s-platform"></i>
                    </a>
                    <a href="#" aria-label="QQ">
                        <i class="el-icon-message"></i>
                    </a>
                </div>
            </div>
        </div>

        <!-- 底部版权信息 -->
        <div class="footer-bottom">
            <p>© 2023 酷爱学堂. 版权所有.</p>
        </div>
    </footer>
</template>

<script>
export default {
    name: 'Footer',
};
</script>

<style scoped>
.footer {
    background-color: #1e1e1e;
    color: #fff;
    padding: 40px 20px 20px;
    font-family: 'Arial', sans-serif;
}

.footer-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
}

.footer-about,
.footer-links,
.footer-contact {
    flex: 1 1 30%;
    margin: 20px 0;
}

.footer-logo {
    width: 150px;
    margin-bottom: 20px;
}

.footer-description {
    font-size: 14px;
    line-height: 1.6;
}

.footer-links h3,
.footer-contact h3 {
    font-size: 18px;
    margin-bottom: 15px;
}

.footer-links ul {
    list-style: none;
    padding: 0;
}

.footer-links ul li {
    margin-bottom: 10px;
}

.footer-links ul li a {
    color: #fff;
    text-decoration: none;
    font-size: 14px;
}

.footer-links ul li a:hover {
    color: #409EFF;
}

.footer-contact p {
    font-size: 14px;
    margin-bottom: 10px;
}

.social-media a {
    color: #fff;
    font-size: 20px;
    margin-right: 15px;
}

.social-media a:hover {
    color: #409EFF;
}

.footer-bottom {
    border-top: 1px solid #333;
    margin-top: 20px;
    padding-top: 20px;
    text-align: center;
}

.footer-bottom p {
    font-size: 14px;
    color: #ccc;
}

/* 响应式布局 */
@media (max-width: 768px) {
    .footer-container {
        flex-direction: column;
        align-items: center;
    }

    .footer-about,
    .footer-links,
    .footer-contact {
        flex: 1 1 100%;
        text-align: center;
    }

    .footer-logo {
        margin: 0 auto 20px;
    }
}
</style>
