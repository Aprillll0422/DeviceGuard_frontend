import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
  baseURL: 'https://api.example.com',  // 替换成你的后端域名
  timeout: 10000,                      // 请求超时 10 秒
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器（可选：统一加 token）
service.interceptors.request.use(
  config => {
    // 如果有登录 token，可以在这里加到 header
    // const token = localStorage.getItem('token')
    // if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器（统一处理错误）
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 0) {
      // 后端业务错误
      alert(res.message || '请求失败')
      return Promise.reject(new Error(res.message))
    }
    return res.data  // 只返回 data 部分，前端更方便
  },
  error => {
    alert('网络错误，请稍后重试')
    return Promise.reject(error)
  }
)

export default service