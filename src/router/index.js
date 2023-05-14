import {createRouter, createWebHistory} from 'vue-router'
import Store from "../tools/Storage";

const routes = [
    {
        path: "/",
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/Login.vue')
    },
    {
        path: '/chat/:name',
        name: 'chat',
        component: () => import('../components/Chat.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})
router.beforeEach((from) => {
    let isLogin = Store.getters.isLogin;
    if (isLogin || from.name === 'login') {
        return true;
    } else {
        return {name: 'login'}
    }
})
export default router
