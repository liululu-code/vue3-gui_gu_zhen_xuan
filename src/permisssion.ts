
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import router from '@/router/index'
import useUserStore from './stores/modules/user'
import { storeToRefs } from 'pinia'
import { ElNotification } from 'element-plus'


router.beforeEach(async (to, _) => {
    nprogress.start()
    const userStore = useUserStore()
    const { token } = storeToRefs(userStore)

    if (token.value) {
        if (to.path === '/login') {
            return { name: 'home' }
        } else {
            try {
                await userStore.userInfo()
            } catch (error) {
                ElNotification({
                    title: 'userInfo',
                    message: error as string
                })
                await userStore.userLogout()
                return { name: 'login', query: { redirect: to.path } }
            }
        }

    } else {
        if (to.path !== '/login') {
            return { name: 'login', query: { redirect: to.path } }
        }

    }
})

router.afterEach(async () => {
    nprogress.done()
})




