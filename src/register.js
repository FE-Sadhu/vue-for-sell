// 把header-detail组件变成api模式的调用 为了挂载到body下
import { createAPI } from 'cube-ui'
import Vue from 'vue'
import HeaderDeatil from './components/header-detail/header-detail'

createAPI(Vue, HeaderDeatil)
