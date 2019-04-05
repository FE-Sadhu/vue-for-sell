// for 本地存储
import storage from 'good-storage'

const SELLER_KEY = '__seller__'

export function saveToLocal(id, key, val) { // id区分商家
  const seller = storage.get(SELLER_KEY, {}) // 从本地读取SELLER_KEY 读不到的话就赋一个空对象
  if (!seller[id]) {
    seller[id] = {}
  }
  seller[id][key] = val
  storage.set(SELLER_KEY, seller) // 最终对象seller存储起来
}

export function loadFromLocal(id, key, def) { // 从本地缓存取， def是默认值
  const seller = storage.get(SELLER_KEY, {})
  if (!seller[id]) {
    return def
  }
  return seller[id][key] || def
}
