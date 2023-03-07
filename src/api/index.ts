import { ElLoading, ElMessage, ElMessageBox } from 'element-plus';
import useStore from '@/store';
import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { localStorage } from '@/utils/storage'

let loadingInstance: any = null
const timeout = 30000

const closeLoading = () => {
    if (loadingInstance) {
        loadingInstance.close()
    }
}

// 创建axios实例
const service = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_API,  // '/dev-api'
    // timeout: 5000,
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
})

// 导出的时候会不同: motime为1分钟 普通默认为为3秒
service.defaults.timeout = timeout

// 请求拦截器
service.interceptors.request.use(
    (config: AxiosRequestConfig) => {

        loadingInstance = ElLoading.service({
            lock: false,
            text: '数据加载中，请耐心等待~',
            fullscreen: true,
            // background: 'rgba(0, 0, 0, 0.4)',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        })

        if (!config.headers) {
            throw new Error(`Expected 'config' and 'config.headers' not to be undefined`);
        }
        // 获取token
        const { user } = useStore()
        if (user.token) {
            config.headers.Authorization = `${localStorage.get('token')}`
        }

        const requestNo = new Date().getTime()

        //  form-data加上请求号
        if (config.headers['Content-Type'] === 'multipart/form-data') {
            config.data.append('requestNo', requestNo)
            return config
        }

        // 统一加上请求流水号
        if (!config.data || !config.data.requestNo) {
            if (!config.data) {
                config.data = { requestNo }
            } else {
                config.data.requestNo = requestNo
            }
        }

        return config
    }, (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
service.interceptors.response.use(
    (response: AxiosResponse) => {
        // console.log(response.data)
        const { code, msg } = response.data;
        if (code == '200' || code == '0000') {
            closeLoading()
            return response.data
        } else {
            closeLoading()
            ElMessage({
                message: msg || '系统出错',
                type: 'error'
            })
            return Promise.reject(new Error(msg || 'Error'))
        }
    },
    (error) => {
        const { code, msg } = error.response.data
        if (code === '403') {  // token 过期
            closeLoading()
            localStorage.clear(); // 清除浏览器全部缓存
            window.location.href = '/'; // 跳转登录页
            ElMessageBox.alert('当前页面已失效，请重新登录', '提示', {})
                .then(() => {
                })
                .catch(() => {
                });
        } else {
            closeLoading()
            ElMessage({
                message: msg || '系统出错',
                type: 'error'
            })
        }
        return Promise.reject(new Error(msg || 'Error'))
    }
)

export const fetchApi = service.request

// TODO: 可以做一个自动引入的方法
export * as login from './service/login'

export default fetchApi