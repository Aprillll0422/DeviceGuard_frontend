import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://127.0.0.1:8000',  // 替换成你的后端域名
  timeout: 0,                      // 请求超时 10 秒
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器（可选：统一加 token）
service.interceptors.request.use(
  config => {
    return config
  },
  error => Promise.reject(error)
)

// // 响应拦截器（统一处理错误）
service.interceptors.response.use(
  response => {
    return response.data  // 只返回 data 部分，前端更方便
  },
  error => {
    alert('网络错误，请稍后重试')
    return Promise.reject(error)
  }
)

export default service