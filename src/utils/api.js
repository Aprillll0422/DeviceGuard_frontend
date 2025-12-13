import request from './index.js'  // 上面创建的请求实例

// 获取连接状态
export const getConnectionStatus = () => {
    return request({
      url: '/api/connect',
      method: 'get'
    })
}

// 获取包名、应用名
export const getAppList = () => {
    return request({
      url: '/api/apps',
      method: 'get'
    })
}

// 轮询任务是否完成
export const getTasks = () => {
    return request({
      url: '/api/tasks',
      method: 'get'
    })
}

// 获取消融规则文件
export const getRules = () => {
  return request({
    url: '/api/rulesDoc',
    method: 'get'
  })
}