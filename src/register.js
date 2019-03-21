// 把header-detail组件变成api模式的调用 为了挂载到body下
import { createAPI } from 'cube-ui'
import Vue from 'vue'
import HeaderDeatil from 'components/header-detail/header-detail'
import ShopCartList from 'components/shop-cart-list/shop-cart-list'
import ShopCartSticky from 'components/shop-cart-sticky/shop-cart-sticky'

createAPI(Vue, HeaderDeatil)
createAPI(Vue, ShopCartList) // 把ShopCartList注册变成一个API组件
createAPI(Vue, ShopCartSticky)
