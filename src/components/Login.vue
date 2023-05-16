<template>
    <div style="padding: 100px" id="container">
        <el-col :span="10" style="margin: auto;padding-top: 10vh">
            <el-card :body-style="{ padding: '0px' }">
                <el-image :src="require('../assets/title2.png')" class="title"></el-image>
                <el-container style="width: 100%;padding-top: 0">
                    <div class="input">
                        <el-input v-model="name" prefix-icon="el-icon-user" placeholder="请输入用户名"></el-input>
                    </div>
                </el-container>
                <el-container style="padding: 0">
                    <div class="input">
                        <el-input v-model="password" prefix-icon="el-icon-lock" placeholder="请输入密码"
                                  show-password></el-input>
                    </div>
                </el-container>
                <el-container>
                    <div class="input">
                        <el-button @click="login" style="width: 500px;text-align: center" type="primary"
                                   :disabled="disabled">
                            登录
                        </el-button>
                    </div>
                </el-container>
            </el-card>
        </el-col>
    </div>
</template>
<script>
import Storage from "@/tools/Storage";
import {ElMessage} from "element-plus";

export default {
    data() {
        return {
            name: "",
            password: "",
        }
    },
    computed: {
        disabled() {
            return this.name.length === 0 || this.password.length === 0;
        }
    },
    methods: {
        login() {
            let newUser = {
                name: this.name,
                password: this.password
            }
            Storage.commit("registUserInfo", newUser)
            ElMessage({//使用了组件  ElMessage  来在页面上显示一个消息提示框。
                message: '登录成功',
                type: 'success',
                duration: 3000
            })
            setTimeout(() => {
                this.$router.push({name: 'chat', params: {name: newUser.name}})
            }, 3000);
        },
    },
}
</script>
<style>
#container {
    background-color: #595959;
    background-image: url("~@/assets/login_bg.jpg");
    height: 100%;
    width: 100%;
    position: absolute;
}

.title {
    text-align: center;
    padding: 0;
}

.input {
    padding-top: 0;
    margin: 20px auto;
    width: 500px;
}
</style>