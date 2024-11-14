import { createApp } from 'vue'
import App from '@/App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'virtual:svg-icons-register'
import globalComponent from '@/components'
import '@/styles/index.scss'
import router from '@/router'
import pinia from '@/stores'
import '@/permisssion'

import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)
app.use(globalComponent)
app.use(ElementPlus, {
    locale: zhCn,
})
app.use(router)  
app.use(pinia)

app.mount('#app')
