import axios from 'axios'
import { ElMessage } from 'element-plus';
import useUserStore from '@/stores/modules/user'
import { storeToRefs } from 'pinia'

const request = axios.create({
     baseURL: import.meta.env.VITE_APP_BASE_API,
     timeout: 5000
})

// 请求拦截器
request.interceptors.request.use((config) => {
    const userStore = useUserStore()
    const {token} = storeToRefs(userStore)
    config.headers.token = token.value

    return config;
})

// 响应拦截器
request.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    let message = 'unknow error!';
    const state = error.response.state;
    switch (state) {
        case 401:
            message = 'token overdue';
            break;
        case 404:
            message = 'url error';
            break
    }
    ElMessage({
        type: 'error',
        message
    })
    return Promise.reject(error);
})



export default request;