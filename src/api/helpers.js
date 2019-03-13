// 对axios做一个封装
import axios from 'axios'

const ERR_OK = 0

// 函数柯里化 对于常用的url固化 在返回一个函数中就不用传了，只用传axios所需参数params就行

export function get(url) {
  return function(params) {
    return axios.get(url, {
      params
    }).then((res) => {
      const { errno, data } = res.data
      if (errno === ERR_OK) {
        return data
      }
    }).catch(() => {})
  }
}
