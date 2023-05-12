<template>
    <div id="Chatbase">
        <el-container style="height: 100vh;">
            <el-header><h1>在线聊天室</h1></el-header>
            <el-container style="height: 80vh;">
                <el-aside width="200px" style="height: 100%;">
                    <el-table style="width: 100%;height: 100vh;">
                        <el-table-column prop="user_List" label="在线用户" fixed="left">
                        </el-table-column>
                    </el-table>
                </el-aside>
                <div style="height: 100vh;width: 100vh">
                    <el-main style="width: 100vh;height: 65vh;">
                        <!--聊天内容-->
                        <div class="chat-wrapper">
                            <div v-for="message in Chat_Messages" :key="message.id" class="message-item">
                                <div class="message-bubble"
                                     :class="[message.isMyMessage ? 'my-message' : 'other-message']">
                                    <div class="message-content">{{ message.content }}</div>
                                </div>
                            </div>
                        </div>
                    </el-main>
                    <el-footer style="width: 100vh;height: 30vh">
                        <el-container>
                            <div id="wangeditor" style="height: 100%;width: 100%">
                                <div ref="editorElem" style="text-align: left;height: 100%"
                                     class="textInput">
                                </div>
                            </div>
                            <div>
                                <el-button type="primary" style="float: right;height: 100%"
                                           @click="sendMessage">
                                    发送
                                </el-button>
                            </div>
                        </el-container>

                    </el-footer>
                </div>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import E from 'wangeditor';
import io from 'socket.io-client';


export default {
    // name: "chat",
    props: {
        chat_messages: {
            type: Array,
            default: () => []
        }
    },

    data() {
        return {
            Chat_Messages: [], // 初始化为一个空数组
            user_List: [],
            chatText: '',
            editor: null,
            editorContent: '',
        };
    },
    // 监听后端发送的更新事件，接收到更新事件时更新数据
    created() {
        const socket = io('http://localhost:5000');
        socket.on('new-message', (message) => {
            const Recv_Message = {
                id: Date.now().toString(),
                content: message,
                isMyMessage: false,
                timestamp: Date.now()
            };
            this.messages.push(Recv_Message)
        });
        socket.on('user_List', (online) => {
            this.user_List = online
        });
    },
    components: {},
    methods: {
        goBack() {
            this.$router.push("/")
        },
        contentChange(html) {
            this.editorContent = html;
            this.$emit('contentChange', this.editorContent);
        },
        sendMessage() {
            var newMessage = {
                id: Date.now().toString(),
                content: this.editor.txt.html(), //this.newMessageContent.trim(),
                isMyMessage: true,
                timestamp: Date.now()
            }
            this.Chat_Messages.push(newMessage)
            this.socket.emit('new-message', {
                content: newMessage.content
            })
        },
    },
    watch: {},
    mounted() {
        this.editor = new E(this.$refs.editorElem);
        //编辑器事件，每次改变都会获取Html内容
        this.editor.config.onchange = this.contentChange
        this.editor.config.menus = [
            //菜单配置
            'emoticon',
            'image',
            'strikeThrough',
            'foreColor',
            'undo',
            'redo'
        ];
        this.editor.create();//创建富文本实例
        this.editor.txt.html("说点骚话吧！");
    },
    beforeUnmount() {
        // 在组件销毁前关闭Socket.IO连接
        if (this.socket !== null) {
            this.socket.disconnect();
            this.socket = null;
        }
    },
}
</script>
<style>
#Chatbase {
    margin: 0;
    background: url("../assets/chat_bg.jpg") fixed no-repeat;
    background-size: 100% 100%;
    padding-bottom: 0;
    height: 100vh;
    flex-direction: column;
    flex: 1;
    z-index: -1;
}

el-main {
    background-color: white;
    z-index: auto;
}

#wangeditor {
    padding: 0;
    max-height: 25vh;
    min-width: 80vh;
    float: left;
}

#wangeditor div {
    max-height: 20vh;
}

.textInput {
    max-height: 20vh;
    min-width: 70vh;
    width: 100%;
}

.chat-wrapper {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow-y: auto;
    padding: 10px;
}

.message-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 10px;
}

.message-bubble {
    background: white;
    z-index: 1;
    display: inline-block;
    padding: 10px;
    border-radius: 10px;
    font-size: 14px;
    max-width: 80%;
    word-wrap: break-word;
}

.my-message {
    background-color: #DCF8C6;
    align-self: flex-end;
}

.other-message {
    background-color: #ffffff;
}

.message-content {
    white-space: pre-wrap;
    overflow-wrap: break-word;
}
</style>