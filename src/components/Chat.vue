<template>
    <div id="Chatbase">
        <el-container style="height: 100vh;">
            <el-header><h1>在线聊天室</h1></el-header>
            <el-container style="height: 80vh;">
                <el-aside width="200px" style="height: 100%;">
                    <el-table style="width: 100%;height: 100vh;">
                        <el-table-column prop="" label="在线用户"></el-table-column>
                    </el-table>
                </el-aside>
                <div style="height: 100vh;width: 100vh">
                    <el-main style="width: 100vh;height: 65vh;">聊天内容</el-main>
                    <el-footer style="width: 100vh;height: 30vh">
                        <el-container>
                            <div id="wangeditor" style="height: 100%;width: 100%">
                                <div ref="editorElem" style="text-align: left;height: 100%"
                                     class="textInput">
                                </div>
                            </div>
                            <div>
                                <el-button type="primary" style="float: right;height: 100%" @click="sendText">
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

export default {
    // name: "chat",
    data() {
        return {
            chatText: '',
            editor: null,
            editorContent: ''
        };
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
        sendText() {
            this.chatText = this.editor.txt.html()
            var param = {
                "text": this.chatText
            }
            this.$axios.post("/chat/submit", param)
            this.$message({
                type: 'success',
                message: '发送成功',
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
</style>