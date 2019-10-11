import { get } from './helpers'

const getSeller = get('api/seller') // 此时getSeller是一个函数
const getGoods = get('api/goods')
const getRatings = get('api/ratings')

export {
  getSeller,
  getGoods,
  getRatings
}
