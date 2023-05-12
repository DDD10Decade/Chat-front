import {createRouter, createWebHistory} from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Store from "../tools/Storage";

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/about',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
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
