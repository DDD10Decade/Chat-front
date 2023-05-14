<template>
    <div id="Chatbase">
        <el-container style="height: 100vh;">
            <el-header><h1>在线聊天室</h1></el-header>
            <el-container style="height: 80vh;">
                <el-aside width="200px" style="height: 100%;">
                    <!--在线用户列表-->
                    <div class="onlineTable">
                        <el-table :data="onlineList" :max-height="tableHeight" height="calc(100%-10rem)" width="100%">
                            <el-table-column prop="name" label="在线用户" fixed="left"></el-table-column>
                        </el-table>
                    </div>
                </el-aside>
                <div style="height: 100vh;width: 100vh">
                    <el-main style="width: 100vh;height: 65vh;">
                        <!--聊天内容-->
                        <div class="chat-wrapper">
                            <div v-for="message in Chat_Messages" :key="message.id" class="message-item">
                                <span style="text-align: center">{{ message.time }}</span>
                                <div class="message-bubble"
                                     :class="[message.isMyMessage ? 'my-message' : 'other-message']">
                                    <span style="color: blue">{{ message.name }}</span>
                                    <div class="message-content">
                                        <!--                                        {{ message.content }}-->
                                        <div v-html="message.content"></div>
                                    </div>
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
                                           @click="sendMessage()">
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
import {useRoute} from "vue-router";
import {ElMessage} from "element-plus";

const Socket = io('http://127.0.0.1:5000', {autoConnect: true});


export default {
    props: {
        chat_messages: {
            type: Array,
        },
    },
    data() {
        const UserR = useRoute();
        return {
            UserName: UserR.params.name,
            Chat_Messages: [], // 初始化为一个空数组
            onlineList: [],//在线用户列表
            chatText: '',
            editor: null,
            editorContent: '',
            tableHeight: 600,
        };
    },
    created() {// 监听后端发送的更新事件，接收到更新事件时更新数据
        Socket.on('NewMessage', (data) => {
            var MyMassage = true;
            if (data.sendName !== this.UserName) {
                MyMassage = false;
            }
            const Recv_Message = {
                name: data.sendName,
                time: data.sendTime,
                id: Date.now().toString(),
                content: data.content,
                isMyMessage: MyMassage,
            };
            this.Chat_Messages.push(Recv_Message)
        });
        Socket.on("OtherLeave", (Other) => {
            var dict;
            for (dict in this.onlineList) {
                if (dict[name] === Other.name) {
                    this.onlineList.splice(dict, 1)
                }
            }
            ElMessage({
                message: Other.name + '离开聊天室',
                type: 'warning',
                duration: 3000
            });
        });
        Socket.on('updateList', (data) => {
            this.onlineList = [];
            var i;
            var List = Object.values(data);
            for (i in List) {
                const NewUser = {
                    name: List[i],
                    id: Date.now().toString()
                };
                this.onlineList.push(NewUser);
            }
            ElMessage({
                message: List[i] + '登录成功',
                type: 'success',
                duration: 3000
            })
        });
    },
    components: {},
    socket: {},
    methods: {
        // goBack() {
        //     this.$route.push("/")
        // },
        contentChange(html) {
            this.editorContent = html;
            this.$emit('contentChange', this.editorContent);
        },
        sendMessage() {
            var newMessage = {
                name: this.UserName,
                id: Date.now().toString(),
                content: this.editor.txt.html(),
                isMyMessage: true,
            };
            Socket.emit("NewMessage", {
                content: newMessage.content,
                name: newMessage.name
            });
        },
        getTableMaxHeight() {//获取容器当前高度，重设表格的最大高度
            this.$nextTick(function () {
                let box = document.querySelector(".onlineTable").attributes
                let box_clientHeight = box[0].ownerElement.clientHeight;
                this.tableHeight = box_clientHeight - 100;
            })
        },
    },
    watch: {},
    mounted() {
        Socket.emit('updateList', {"name": this.UserName});
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
        //获取容器当前高度，重设表格的最大高度
        this.getTableMaxHeight();
        let _this = this;
        window.onresize = function () {//用于使表格高度自适应的方法
            _this.getTableMaxHeight();//获取容器当前高度，重设表格的最大高度
        }
    },
    beforeUnmount() {
        // 在组件销毁前关闭Socket.IO连接
        if (Socket !== null) {
            Socket.emit("OtherLeave", {name: this.UserName});
            Socket.disconnect();
            // this.socket = null;
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

el-table {
    height: 100%;
    min-height: 70vh;
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

.onlineTable {
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    height: calc(100% - 3rem);
    background-color: white;
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
    text-align: right;
}

.other-message {
    background-color: #ffffff;
    align-self: flex-start;
    text-align: left;
}

.message-content {
    white-space: pre-wrap;
    overflow-wrap: break-word;
}
</style>