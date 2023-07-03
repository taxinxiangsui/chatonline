import { type ComputedRef } from 'vue'
export interface UserInfo {
    username: string,
    name: string,
    avatar: string
}

export interface MsgList {
    time: string,
    originalTime: string,
    msgList: MsgContent[]
}
export interface MsgContent {
    msgId: string,
    content: string,
    isSelf: boolean,
    name: ComputedRef | string,
    username: string,
    avatar: ComputedRef | string
}
export type NotNeedComputedFiled = 'msgId' | 'content' | 'isSelf' | 'username'