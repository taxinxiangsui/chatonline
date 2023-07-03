<script setup lang='ts'>
import { ref, onBeforeMount, computed } from 'vue'
import axios from '../utils/axios'
const emit = defineEmits<{
    (e: 'back'): void,
    (e: 'update', formData: FormData): void
}>()
interface FormData {
    name: string
}
let temporaryAvatar: any
const formData = ref({
    name: '',
    avatar: ''
})
const submitDisabled = computed(() => {
    const user = JSON.parse(sessionStorage.getItem('user') || '')
    if (formData.value.avatar != user.avatar) {
        return false
    }
    for (const key in formData.value) {
        //@ts-ignore
        if (formData.value[key].trim() == '' && key != 'avatar') {
            return true
        }
        //@ts-ignore
        if (formData.value[key] != user[key]) {
            return false
        }
    }
    return true
})
onBeforeMount(() => {
    const user = sessionStorage.getItem('user')
    if (user) {
        const userInfo = JSON.parse(user)
        formData.value.name = userInfo.name ?? ''
        formData.value.avatar = userInfo.avatar ?? ''
    }

})
async function submit(e: MouseEvent) {
    e.preventDefault()
    try {
        const form = new FormData()
        form.append('avatar', temporaryAvatar)
        const avatarUrl = await axios({
            url: '/api/upload/avatar',
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            data: form
        })
        formData.value.avatar = avatarUrl
        await axios({
            url: '/api/user/update',
            method: 'post',
            data: formData.value
        })
        sessionStorage.setItem('user', JSON.stringify(formData.value))
        emit('update', formData.value)
    } catch (error) {

    }

}
function setAvatar(e: Event) {
    const file = (e.target as any).files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = (e) => {
        if (e.target) {
            formData.value.avatar = e.target.result as string
            temporaryAvatar = file
        }
    }

}
function back() {
    emit('back')
}
</script>

<template>
    <form class="setting_contanier">
        <a class="back" @click="back">
            <span class="icon">
                <svg t="1687834648159" class="icon" viewBox="0 0 1025 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    p-id="6700" width="1.5em" height="1.5em" color="white" fill="white">
                    <path
                        d="M513.706667 0a512 512 0 1 0 512 512 512 512 0 0 0-512-512z m0 938.666667a426.666667 426.666667 0 1 1 426.666666-426.666667 426.666667 426.666667 0 0 1-426.666666 426.666667z"
                        p-id="6701"></path>
                    <path class="icon-arrow"
                        d="M573.866667 332.373333a42.666667 42.666667 0 0 0-60.16 0l-149.333334 149.333334a42.666667 42.666667 0 0 0 0 60.586666l149.333334 149.333334a42.666667 42.666667 0 0 0 60.16-60.586667L454.826667 512l119.04-119.04a42.666667 42.666667 0 0 0 0-60.586667z"
                        p-id="6702"></path>
                    <path class="icon-line" stroke="currentColor" d="M380 512H800" stroke-width="100"
                        stroke-linecap="round">
                    </path>
                </svg>
            </span>
        </a>
        <label class="avatar" :style="formData.avatar ? `background-image:url('${formData.avatar}')` : ''">
            <input type="file" class="avatar_input" accept="image/png, image/jpeg, image/jpg" @change="setAvatar">
        </label>
        <div class="input_box">
            <span class="input_name">昵称：</span>
            <input type="text" size="1" maxlength="10" v-model="formData.name">
        </div>
        <button class="submit" @click="submit" :disabled="submitDisabled">保存</button>
    </form>
</template>

<style lang='less' scoped>
.setting_contanier {
    position: relative;
    width: 9.5rem;
    margin: 0 auto;
    background-color: rgba(39, 38, 38, .8);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.5rem 0;
    font-family: "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";

    .back {
        position: absolute;
        top: 10px;
        left: 10px;
        font-size: 0.4rem;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;

        .icon {
            display: inline-block;
            transition: scale .3s;

            .icon-line {
                transition: opacity .3s, stroke-dashoffset .2s;
                opacity: 0;
                stroke-dasharray: 420;
                stroke-dashoffset: 420;
            }

            .icon-arrow {
                transition: translate .3s;
            }

            &:hover {
                scale: 1.1;

                .icon-arrow {
                    translate: -10% 0 0;
                }

                .icon-line {
                    opacity: 1;
                    stroke-dashoffset: 0;
                }
            }

        }
    }

    .avatar {
        display: block;
        position: relative;
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        background: url(../assets//defalut-avatar.svg);
        background-size: 100% 100%;
        cursor: pointer;
        overflow: hidden;

        &::before,
        &::after {
            position: absolute;
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
        }

        &::before {
            content: '修改头像';
            translate: 0 -100% 0;
            opacity: 0;
            transition: all .2s;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            font-size: 17px;
            color: rgb(82, 79, 82);
            font-weight: 600;
            background-color: rgba(255, 255, 255, .2);
        }

        &::after {
            content: '';
            top: 0;
            left: 0;
            z-index: 99;
            background: inherit;
            filter: blur(3px);
            opacity: 0;
        }

        &:hover::before {
            translate: 0;
            opacity: 1;
        }

        &:hover::after {
            opacity: 1;
        }

        .avatar_input {
            display: none;
        }
    }

    .input_box {
        position: relative;
        margin-top: 0.5rem;
        width: 80%;
        display: flex;
        align-items: center;
        color: rgb(203, 63, 241);

        .input_name {
            font-size: 18px;
            font-weight: 600;
            padding: 0 10px;
            white-space: nowrap;
            flex: 0 0 max-content;
            backface-visibility: hidden; //解决文字闪烁
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            -ms-backface-visibility: hidden;
        }

        input {
            font-size: 18px;
            padding: 8px;
            border: none;
            outline: none;
            flex: 1 1 auto;
            background-color: #fff;
            border-radius: 5px;
        }

        &::after {
            content: '最大长度10位';
            position: absolute;
            font-size: 15px;
            color: #888787;
            line-height: 1;
            opacity: 0;
            left: 80px;
            bottom: 0;
            transition: opacity .2s, bottom .2s;
        }

        &:has(input:focus)::after {
            bottom: -1.5em;
            opacity: 1;
        }
    }

    .submit {
        margin-top: 0.8rem;
        width: 1.8rem;
        height: 40px;
        border: 1px solid rgb(193, 14, 242);
        outline: none;
        border-radius: 5px;
        background-color: rgb(41, 41, 41);
        color: #fff;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 17px;
        font-weight: 600;
        white-space: nowrap;
        cursor: pointer;
        transition: all .1s;

        &:not(&:disabled):hover {
            border-color: #fff;
            border-width: 2px;
        }

        &:disabled {
            border-color: #999;
            color: #999;
            cursor: default;
        }
    }
}

.v-enter-from,
.v-leave-to {
    position: fixed;
    translate: 0 200% 0;
    opacity: 0;
}

.v-leave-from,
.v-enter-to {
    position: fixed;
    transform: translateX(-50%);
}

.v-enter-active,
.v-leave-active {
    transition: all .7s;
    left: 50%;
    transform: translateX(-50%);
}
</style>