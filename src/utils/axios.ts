import axios, { type AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
const service = axios.create({
    timeout: 3000,
    withCredentials: true
})
service.interceptors.request.use((config) => {
    const uid = Cookies.get('uid')
    if (uid) {
        config.headers['uid'] = uid
    }
    return config
}, (error) => {
    return Promise.reject(error)
})

service.interceptors.response.use(
    data => {
        if (data.data.code === '000000') return data.data.data
        return Promise.reject(data.data)
    },
    err => {
        return Promise.reject(err)
    }
)
async function request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return service.request(config)
}

export default request