import { defineStore } from 'pinia'
import { ref } from 'vue'
import { LoginFormData } from '@/api/user/type'
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import constantRoutes from '@/router/routes'
// import { routes } from 'vue-router/auto-routes'
import type { RouteRecordRaw } from 'vue-router'

const useUserStore = defineStore('user', () => {

    let token = ref(localStorage.getItem('token') || '')

    // let name  = ref(localStorage.getItem('NAME') || '')
    // let avatar = ref(localStorage.getItem('AVATAR') || '')
    let name = ref('')
    let avatar = ref('')

    let menuRoutes: RouteRecordRaw[] = constantRoutes

    async function userLogin(data: LoginFormData) {
        const result = await reqLogin(data)
        if (result.code === 200) {
            token.value = result.data as string
            localStorage.setItem('token', token.value)
            return 'success'
        }
        else {
            return Promise.reject(result.data)
        }
    }

    async function userInfo() {
        const result = await reqUserInfo()
        if (result.code === 200) {
            name.value = result.data.name as string
            avatar.value = result.data.avatar as string
            // localStorage.setItem('NAME', name.value)
            // localStorage.setItem('AVATAR', avatar.value)
            const info = {
                name: name,
                avatar: avatar
            }
            return info
        }
        else {
            return Promise.reject(new Error(result.message))
        }
    }

    async function userLogout() {
        const result = await reqLogout()
        if (result.code === 200) {
            name.value = ''
            avatar.value = ''
            token.value = ''
            localStorage.removeItem('token')
            return 'success'
        } else {
            return Promise.reject(new Error(result.message))
        }
    }


    return {
        token,
        name,
        avatar,
        menuRoutes,
        userLogin,
        userInfo,
        userLogout,
    }
})

export default useUserStore