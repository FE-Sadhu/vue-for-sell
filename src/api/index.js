import { get } from './helpers'

const getSeller = get('/api/seller') // 此时getSeller是一个函数
const getGoods = get('/api/goods')

export {
  getSeller,
  getGoods
}
