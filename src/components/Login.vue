<script setup lang='ts'>
import { ref } from 'vue';
import axios from '../utils/axios'
import Cookies from 'js-cookie'
const props = defineProps<{ showLogin: boolean }>()
const emits = defineEmits(['login'])
const username = ref('')
const password = ref('')
const inputDisabled = ref(false)
function submit(e: MouseEvent) {
    e.preventDefault()
    if (!username.value || !password.value) {
        return console.log('please fill correct info');
    }
    inputDisabled.value = true
    axios({
        url: 'api/user/login',
        method: 'post',
        data: {
            username: username.value,
            password: password.value
        }
    }).then(() => {
        inputDisabled.value = false
        emits('login')
    }).catch(() => {
        inputDisabled.value = false
    })
}
</script>

<template>
    <!-- <Transition name="login" :duration="1500"> -->
    <div class="flex-center">
        <h1 class="title"><span>Chat</span><span>Online</span></h1>
        <form class="user_from">
            <label class="account">
                <input v-model="username" type="text" class="user_input" placeholder="账号" maxlength="12"
                    :disabled="inputDisabled">
            </label>
            <label class="password">
                <input v-model="password" type="password" class="user_input" placeholder="密码" maxlength="12"
                    :disabled="inputDisabled">
            </label>
            <button class="user_btn" @click="submit" :disabled="inputDisabled">登录/注册</button>
        </form>
    </div>
    <!-- </Transition> -->
</template>

<style lang='less' scoped>
.flex-center {
    display: flex;
    flex-direction: column;
    align-items: center;

    .title {
        text-align: center;
        width: max-content;
        max-width: 100vw;
        font-size: 1.8rem;
        color: #fff;
        text-shadow: 0.4vw 0.8vw 0.4vw #7a7979;
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px;
    }

    .user_from {
        width: max-content;
        height: 8rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        .user_input {
            display: block;
            position: relative;
            width: 6rem;
            height: 1rem;
            border-radius: 9999px;
            outline: none;
            border: none;
            padding: 0 1rem;
            font-size: 18px;
            transition: all .3s;
            -webkit-appearance: none;
            appearance: none;

            &::placeholder {
                text-align: center;
                font-family: 'Courier New', Courier, monospace;
                transition: all .3s;
                user-select: none;
                -webkit-user-select: none;
            }

            &:focus {
                scale: 1.1;
                box-shadow: 0 2px 8px 0px #80d5e8;

                &::placeholder {
                    opacity: 0;
                }
            }
        }

        .account,
        .password {
            --account-opacity: 0;
            --account-translate: 0;
            position: relative;

            &::before {
                content: 'Account';
                position: absolute;
                top: 0;
                opacity: var(--account-opacity);
                translate: var(--account-translate);
                font-family: Georgia, 'Times New Roman', Times, serif;
                font-size: 25px;
                color: #fff;
                transition: all .3s;
            }

            &:has(input:focus) {
                --account-opacity: 1;
                --account-translate: 0 -35px 0;
            }
        }

        .password {
            &::before {
                content: 'Password';
            }
        }

        .user_btn {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 4rem;
            height: 1rem;
            border-radius: 9999px;
            outline: none;
            border: none;
            font-size: 0.3rem;
            font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            font-weight: 600;
            color: #fff;
            background: linear-gradient(-45deg, rgb(244, 62, 129), #ec316c);
            transition: font-size .2s ease;

            &:not(&:disabled) {
                cursor: pointer;
            }

            &:hover {
                &:not(&:disabled) {
                    box-shadow: inset 0 0 10px 0px #f00b5f;
                    font-size: 20px;
                }

            }

            &:active {
                &:not(&:disabled) {
                    background-color: rgba(244, 62, 129, .8);
                    box-shadow: none;
                }

            }

            &:disabled {
                position: relative;

                &::before {
                    content: '';
                    position: absolute;
                    z-index: 99;
                    width: 0.4rem;
                    height: 0.4rem;
                    top: 50%;
                    left: 1rem;
                    transform: translate(-50%, -50%);
                    background: url(../assets/login.svg) no-repeat;
                    background-size: 100% 100%;
                    transform-origin: center center;
                    animation: login-roate 1s linear infinite;
                }

                &::after {
                    content: '';
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    border-radius: 9999px;
                    z-index: 999;
                    background-color: rgba(255, 255, 255, .4);
                }
            }
        }
    }


}

@keyframes login-roate {
    0% {
        transform: translate(-50%, -50%) rotateZ(0);
    }

    100% {
        transform: translate(-50%, -50%) rotateZ(360deg);
    }
}

.v-enter-from .title,
.v-leave-to .title {

    translate: -200% 0 0;
    opacity: 0;
}

.v-enter-from .user_from,
.v-leave-to .user_from {
    translate: 200% 0 0;
    opacity: 0;
}

.v-enter-active .title,
.v-leave-active .title,
.v-enter-active .user_from,
.v-leave-active .user_from {
    transition: all .7s ease;
}
</style>