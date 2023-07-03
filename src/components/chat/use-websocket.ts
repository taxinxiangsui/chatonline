import Cookies from 'js-cookie';
import { computed, ref, type Ref } from 'vue'
import type { MsgContent, MsgList, NotNeedComputedFiled, UserInfo } from './types';
export default function useWebsocket() {
    const msgList = ref<MsgList[]>([])
    function createSocket(userInfo: Ref<UserInfo>, open?: () => void, firstReceive?: () => void, receive?: () => void) {
        const socket = new WebSocket(`ws://${import.meta.env.VITE_APP_SOCKET_URL}/socket/:${Cookies.get('uid')}`);
        socket.onopen = () => {
            open?.()
        }
        socket.addEventListener('message', async (event) => {
            const result = JSON.parse(event.data);
            if (result.type === 'init') {
                msgList.value = result.data
                msgList.value.forEach(item => {
                    item.msgList.forEach(msg => {
                        if (msg.isSelf) {
                            const n = setComputedFiled(msg.isSelf, userInfo)
                            msg.name = n.name
                            msg.avatar = n.avatar
                        }
                    })
                })
                firstReceive?.()
            } else if (result.type === 'msg' || result.type === 'ok') {
                insertMsgToResult(result, userInfo, receive)
            } else if (result.type === 'update') {
                msgList.value.forEach(item => {
                    item.msgList.forEach(msg => {
                        if (result.username === msg.username) {
                            for (const key in result.data) {
                                //@ts-ignore
                                msg[key] = result.data[key]
                            }
                        }
                    })
                })
            }
            else if (result.type === 'error') {
                console.log(result.data);
            }
        });
        return {
            send: (msg: string) => {
                socket.send(JSON.stringify({
                    content: msg
                }))
            },
            close: () => {
                socket.close()
            }
        }
    }
    async function insertMsgToResult(result: any, userInfo: Ref<UserInfo>, receive?: () => void) {
        const newMsg = result.data
        const addMsg = {
            msgId: newMsg.msgId,
            content: newMsg.content,
            isSelf: newMsg.isSelf,
            username: newMsg.username,
            ...setComputedFiled(result.type === 'ok', userInfo, newMsg)
        }
        if (!msgList.value.length) {
            msgList.value.push({
                time: newMsg.time,
                originalTime: newMsg.originalTime,
                msgList: [addMsg]
            })
        } else {
            const lastMsgGroup = msgList.value[msgList.value.length - 1]
            const lastMsgTime = lastMsgGroup.originalTime
            if (Date.parse(newMsg.originalTime) - Date.parse(lastMsgTime) <= 1000 * 60 * 2) {
                lastMsgGroup.msgList.push(addMsg)
            } else {
                msgList.value.push({
                    time: newMsg.time,
                    originalTime: newMsg.originalTime,
                    msgList: [addMsg]
                })
            }
        }
        receive?.()
    }
    interface SetMsg extends Object {
        name: string,
        avatar: string
    }
    function setComputedFiled(isSelf: boolean, data: Ref<UserInfo>, msg?: SetMsg): Omit<MsgContent, NotNeedComputedFiled> {
        if (isSelf) {
            return {
                name: computed(() => data.value.name),
                avatar: computed(() => data.value.avatar)
            }
        } else {
            return {
                name: msg?.name ?? '',
                avatar: msg?.avatar ?? ''
            }
        }
    }
    return {
        msgList,
        createSocket
    }
}

