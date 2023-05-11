import Vuex from "vuex"
// 全局状态配置
const Store = new Vuex.Store({
    state() {
        return {
            userName: "",
            userPassword: "",
        }
    },
    getters: {
        isLogin: (state) => {
            return state.userName.length > 0
        }
    },
    mutations: {
        clearUserInfo(state) {
            state.userName = "";
            state.userPassword = "";
        },
        registUserInfo(state, {name, password}) {
            state.userName = name;
            state.userPassword = password;

        },
    }
})
export default Store;
