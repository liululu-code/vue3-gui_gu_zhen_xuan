<template>
    <div class="login_container">
        <el-row>
            <el-col :span="12" :xs="0">111111111111</el-col>
            <el-col :span="12" :xs="24">
                <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
                    <h1>Hello</h1>
                    <h2>欢迎来到金角巨兽的老巢</h2>
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" placeholder="input username" :prefix-icon="User"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="loginForm.password" placeholder="input password" :prefix-icon="Lock"
                            show-password></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="login_btn" @click="login" :loading="buttonLoading">login</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/stores/modules/user'
import { useRouter, useRoute } from 'vue-router'
import { ElNotification } from 'element-plus'
// import {LoginFormData} from '@/api/user/type'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const loginForm = reactive({
    username: 'admin',
    password: '111111',
})
let buttonLoading = ref(false)
const loginFormRef = ref()

const rules = {
    username: [
        {validator: checkUsername, trigger: 'change'}
    ],
    password: [
        { required: true, message: 'Please input password', trigger: 'blur' },
    ]
}

function checkUsername(_:any, value:any, callback:any) {
    if (value.length >= 5 && value.length <=6) {
        callback()
    } else {
        callback(new Error('length of username should from 5 to 6'))
    }
}


async function login() {
    try {
        await loginFormRef.value.validate((valid:any, _:any) => {
            if (valid) {
                console.log('submit');
            } else {
                return ;
            }
        })
        buttonLoading.value = true
        await userStore.userLogin(loginForm)
        buttonLoading.value = false
        
        router.push(route.query.redirect as string || '/')
        ElNotification({
            title: 'Success',
            message: 'Welcom, 金角巨兽'
        })
    } catch (error) {
        buttonLoading.value = false
        ElNotification({
            title: 'Error',
            message: error as string
        })
    }
}

</script>

<style scoped lang="scss">
.login_container {
    width: 100%;
    height: 100vh;
    background: url('@/assets/images/background.png') no-repeat;
    background-size: cover;

    .el-form {
        position: relative;
        width: 60%;
        top: 30vh;
        left: 20%;
        background: transparent;
        padding: 40px;

        h1 {
            color: pink;
            font-size: 40px;
        }

        h2 {
            color: black;
            font-size: 20px;
        }

        .login_btn {
            width: 100%;
        }
    }
}
</style>