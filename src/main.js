import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-plus'
import 'element-plus/dist/index.css'
import axios from "axios";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'bootstrap/dist/css/bootstrap.css'


const app = createApp(App)
app.use(router).use(Element).mount('#app')
app.config.globalProperties.$axios = axios;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

