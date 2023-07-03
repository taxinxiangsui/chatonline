<script setup lang='ts'>
import { ref, onBeforeMount, onMounted, nextTick, Ref } from 'vue';
import MyButton from '../MyButton.vue'
import axios from '../../utils/axios';
import Cookies from 'js-cookie';
import useWebsocket from './use-websocket';
interface UserInfo {
    username: string,
    name: string,
    avatar: string
}
const { msgList, createSocket } = useWebsocket()
const props = defineProps<{ showChat: boolean }>()
const emits = defineEmits(['signOut', 'showSetting'])
defineExpose({ updateUserInfo })
const userInfo = ref<UserInfo>()
const chatRoom = ref<HTMLDivElement>()
const showSlider = ref(false)
const inputDisabled = ref(true)
const chatBoxWidth = ref('60vw')
const chatBoxheight = ref('70vh')
const message = ref('')
let socket: {
    send: (msg: string) => void,
    close: () => void
}
onBeforeMount(() => {
    if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
        )
    ) {
        chatBoxWidth.value = '99vw'
        chatBoxheight.value = '88vh'
    }
})
onMounted(() => {
    init()
})
async function init() {
    axios({
        url: 'api/user/getUserInfo',
        method: 'get'
    }).then((res) => {
        sessionStorage.setItem('user', JSON.stringify(res))
        userInfo.value = (res as unknown) as UserInfo
        socket = createSocket(userInfo as Ref<UserInfo>, () => { inputDisabled.value = false }, () => scroll2Bottom('auto'), () => scroll2Bottom('smooth'))
    })
}
async function sendMsg(e: MouseEvent) {
    e.preventDefault()
    if (!message.value.trim()) {
        console.log('不能发生空消息');
        return
    }
    socket.send(message.value)
    message.value = ''
}
async function sign_out() {
    showSlider.value = false
    await nextTick()
    socket.close()
    Cookies.remove('uid')
    emits('signOut')
}
async function showSetting() {
    if (!userInfo.value) {
        return
    }
    showSlider.value = false
    await nextTick()
    emits('showSetting')
}
function updateUserInfo(key: keyof UserInfo, value: UserInfo[typeof key]) {
    if (userInfo.value) {
        userInfo.value[key] = value
    }
}
async function scroll2Bottom(type: ScrollBehavior) {
    await nextTick()
    chatRoom.value?.scrollIntoView({
        block: 'end',
        behavior: type,
    })
}
</script>

<template>
    <div>
        <div class="chat_box" :style="{ '--box-width': chatBoxWidth, '--box-height': chatBoxheight }">
            <section class="divider"></section>
            <div class="chat_room">
                <section ref="chatRoom">
                    <transition-group name="list">
                        <div class="chat_group" v-for="group in msgList" :key="group.time">
                            <p class="msg_time">{{ group.time }}</p>
                            <transition-group tag="ul" name="list" :key="group.time">
                                <li v-for="item in group.msgList" :key="item.msgId" :class="{ 'is-self': item.isSelf }">
                                    <div class="head" :style="item.avatar ? `background-image:url('${item.avatar}')` : ''">
                                    </div>
                                    <div class="content" :data-name="item.name">
                                        <span>{{ item.content }}</span>
                                    </div>
                                </li>
                            </transition-group>
                        </div>
                    </transition-group>
                </section>
            </div>
            <section class="divider"></section>
            <form class="chat_input">
                <input type="text" v-model="message" :disabled="inputDisabled">
                <button class="send_btn" :disabled="inputDisabled" @click="sendMsg">发送</button>
            </form>
        </div>
        <MyButton class="userinfo_btn" line_width="1rem" :line_height="6" line_gap="0.2rem" line_background="#210b35"
            change_background="rgb(197, 9, 239)" v-model="showSlider">
        </MyButton>
        <transition name="slider">
            <div v-show="showSlider" class="slider">
                <div class="avatar" :style="userInfo?.avatar ? `background-image:url('${userInfo?.avatar}')` : ''"
                    @click="showSetting"></div>
                <button class="sign-out_btn" @click="sign_out">退出</button>
            </div>
        </transition>
    </div>
</template>

<style lang='less' scoped>
.chat_box {
    margin: 0 auto;
    width: var(--box-width);
    height: var(--box-height);
    background-color: #272626;
    padding-bottom: 20px;
    border-radius: 10px;
    overflow: hidden;

    .divider {
        height: 10px;
        width: 100%;
        background-color: #4f4e4e;
    }

    .chat_room {
        height: calc(100% - 80px);
        background-color: #4f4e4e;
        overflow-y: auto;
        overflow-x: hidden;

        &::-webkit-scrollbar {
            width: 5px;
            background-color: #4f4e4e;
        }

        &::-webkit-scrollbar-track {
            background-color: #4f4e4e;
        }

        &::-webkit-scrollbar-thumb {
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
            background-color: #959795;
        }

        .chat_group {
            height: max-content;

            .msg_time {
                margin: 0;
                text-align: center;
                font-size: 16px;
                color: #cbc9c9;
                letter-spacing: 1px;
                font-family: "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei";
            }
        }

        ul {
            width: auto;
            margin-left: 15px;
            margin-right: calc(15px - (var(--box-width) - 100%));
            list-style: none;
            padding: 0;
            color: #fff;
            font-size: 0.35rem;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

            li {
                width: 100%;
                margin: 15px 0;
                display: flex;
                align-items: self-start;
                overflow-anchor: none;

                .head {
                    margin-top: 5px;
                    width: 0.7rem;
                    height: 0.7rem;
                    border-radius: 50%;
                    // border: 1px solid black;
                    margin-right: 10px;
                    background: url(../../assets//defalut-avatar.svg) no-repeat;
                    background-size: 100% 100%;
                }

                .content {
                    display: flex;
                    flex-direction: column;
                    max-width: 53%;


                    &::before {
                        content: attr(data-name);
                        width: max-content;
                        font-size: 15px;
                        margin-bottom: 5px;
                    }

                    span {
                        word-break: break-all;
                        width: max-content;
                        max-width: 100%;
                        padding: 7px 12px;
                        background-color: rgb(53, 52, 53);
                        border-radius: 5px;
                    }
                }
            }

            .is-self {
                flex-direction: row-reverse;

                .head {
                    margin-left: 10px;
                    margin-right: 0;
                }

                .content {
                    align-items: end;

                    span {
                        background-color: rgb(106, 87, 101);
                    }
                }

            }
        }
    }

    .chat_input {
        margin: 20px 10px 0;
        height: 40px;
        display: flex;
        gap: 10px;

        input {
            display: block;
            flex: 1;
            height: 100%;
            padding: 0 20px;
            outline: none;
            border: none;
            border-radius: 5px;
            font-size: 18px;
        }

        .send_btn {
            position: relative;
            height: 100%;
            width: 100px;
            border: 1px solid rgb(193, 14, 242);
            outline: none;
            border-radius: 5px;
            background-color: black;
            color: #fff;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 17px;
            font-weight: 600;
            cursor: pointer;
            transition: all .1s;

            &::after {
                content: '>';
                position: absolute;
                transition: all .1s;
                opacity: 0;
            }

            &:hover {
                border-color: #fff;
                border-width: 2px;
                padding-right: 20px;
            }

            &:hover::after {
                opacity: 1;
                margin-left: 8px;
            }

            &:disabled {
                border-color: rgb(228, 177, 242);
                background-color: #3a3a3a;
            }
        }
    }
}

.list-move,
.list-enter-active,
.list-leave-active {
    transition: all 0.2s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

.list-leave-active {
    position: absolute;
}

.v-enter-from .chat_box,
.v-leave-to .chat_box {
    opacity: 0;
    translate: 0 -150% 0;
}

.v-leave-from .chat_box {
    transform: translateX(-50%)
}

.v-enter-active .chat_box,
.v-leave-active .chat_box {
    position: absolute;
    top: 10vh;
    left: 50%;
    transform: translateX(-50%);
    transition: all .7s;
}

.userinfo_btn {
    position: absolute;
    top: 20px;
    left: 20px;
}

.v-enter-from .userinfo_btn,
.v-leave-to .userinfo_btn {
    opacity: 0;
    translate: -80% 0 0;
}

.v-enter-active .userinfo_btn,
.v-leave-active .userinfo_btn {
    transition: all .7s;
}

.slider {
    position: absolute;
    height: calc(18px + 0.4rem + 20px);
    top: 10px;
    left: 0;
    padding-left: calc(40px + 1rem);
    padding-right: 20px;
    border-radius: 0 10px 10px 0;
    background-color: #272626;
    color: #fff;
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 20px;

    .avatar {
        width: 45px;
        height: 45px;
        border-radius: 50%;
        background: url(../../assets//defalut-avatar.svg);
        background-size: 100% 100%;
        cursor: pointer;
    }

    .sign-out_btn {
        position: relative;
        height: 35px;
        width: 70px;
        border: 1px solid rgb(236, 35, 35);
        outline: none;
        border-radius: 3px;
        background-color: transparent;
        color: rgb(236, 35, 35);
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        font-size: 17px;
        font-weight: 500;
        white-space: nowrap;
        cursor: pointer;
        transition: all .1s;

        &:hover {
            box-shadow: inset 0 0 3px 0 #ee7575;
        }
    }
}

.slider-enter-from,
.slider-leave-to {
    opacity: 0;
    translate: -80% 0 0;
}

.slider-enter-active,
.slider-leave-active {
    transition: all .2s;
}
</style>