<template>
  <div>
    <div class="shopcart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight': totalCount>0}">
              <i class="icon-shopping_cart"
                :class="{'highlight': totalCount>0}"
              ></i>
            </div>
            <div class="num" v-show="totalCount>0">
              <bubble :num="totalCount"></bubble>
            </div>
          </div>
          <div class="price" :class="{'hightlight': totalPrice>0}">¥{{totalPrice}}</div>
          <div class="desc">另需配送费¥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
          <div @click="pay" class="pay" :class="payClass"> <!-- 这里click加stop是防止冒泡影响到外层click事件 也可以不用stop，我们在click事件内部使用event.stopPropagation-->
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <div v-for="(ball, index) in balls" :key="index">
          <transition
            @before-enter="beforeDrop"
            @enter="dropping"
            @after-enter="afterDrop"
          >
            <div class="ball" v-show="ball.show">
              <div class="inner inner-hook"></div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Bubble from 'components/bubble/bubble'

const BALL_LEN = 10
const innerClsHook = 'inner-hook'

function createBalls() {
  let balls = []
  for (let i = 0; i < BALL_LEN; i++) {
    balls.push({
      show: false
    })
  }
  return balls
} // 返回十个小球，每个小球一开始都是show:false

export default {
  name: 'shop-cart',
  props: {
    selectFoods: {
      type: Array,
      default() {
        return []
      }
    }, // selectFoods是已选择商品
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    fold: {
      type: Boolean,
      default: true
    },
    sticky: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      balls: createBalls(), // 定义隐藏的小球
      listFold: this.fold // 设置一个标志位，默认控制list收起的。 listFold只有在data()中被this.fold初始化一次赋值后，之后的值与this.fold再无关联。这里的this.fold仅仅只是一个值。为了让他俩一直有关联，需要watch fold的变化（为了给sticky组件）
    }
  },
  computed: {
    totalPrice() {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.price * food.count
      })
      return total
    },
    totalCount() {
      let count = 0
      this.selectFoods.forEach((food) => {
        count += food.count
      })
      return count
    },
    payDesc() {
      if (this.totalPrice === 0) {
        return `¥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差${diff}元起送`
      } else {
        return '去结算'
      }
    },
    payClass() {
      if (!this.totalCount || this.totalPrice < this.minPrice) {
        return 'not-enough'
      } else {
        return 'enough'
      }
    }
  },
  created() {
    this.dropBalls = [] // 定义一个放正在下落的小球的数组 不放data里面是不需要响应式的。平时保留就好了
    // this.listFold = true // 设置一个标志位，默认控制list收起的
  },
  methods: {
    drop(el) { // 这个el就是加号那个DOM
      for (let i = 0; i < this.balls.length; i++) {
        const ball = this.balls[i]
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeDrop(el) {
      const ball = this.dropBalls[this.dropBalls.length - 1] // 下落小球数组中最后一个就是最新点击的
      const rect = ball.el.getBoundingClientRect() // 取得此时点击按钮的位置信息。这个el是+号的dom(参见drop())
      const x = rect.left - 32 // rect.left是点击的加号到左边屏幕的x轴距离，32是购物车到左边屏幕的x轴距离
      const y = -(window.innerHeight - rect.top - 22) // 整体高度window.innerHeight - 两个y距离得到中间距离. 为什么是负值是因为是小球是从购物车到达目标加号
      el.style.display = ''
      el.style.transform = el.style.webkitTransform = `translate3d(0, ${y}px, 0)` // 外层y轴移动
      const inner = el.getElementsByClassName(innerClsHook)[0]
      inner.style.transform = inner.style.webkitTransform = `translate3d(${x}px, 0, 0)` // 内层x轴移动
    },
    dropping(el, done) {
      this._reflow = document.body.offsetHeight // 浏览器重绘
      el.style.transform = el.style.webkitTransform = `translate3d(0, 0, 0)`
      const inner = el.getElementsByClassName(innerClsHook)[0]
      inner.style.transform = inner.style.webkitTransform = `translate3d(0, 0, 0)`
      el.addEventListener('transitionend', done) // 动画执行完成，去执行afterDrop函数
    },
    afterDrop(el) {
      const ball = this.dropBalls.shift()
      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    pay(e) {
      if (this.totalPrice < this.minPrice) {
        return
      }
      this.dialogComp = this.$createDialog({
        type: 'alert',
        title: '支付',
        content: `您需要支付共${this.totalPrice}元`
      })
      this.dialogComp.show()
      e.stopPropagation() // 在click事件中，就不会触发上层(祖先)click事件。这是在click事件内部的阻止事件冒泡方法。
    },
    toggleList() {
      if (this.listFold) {
        if (!this.totalCount) {
          return
        }
        this.listFold = false
        this._showShopCartList()
        this._showShopCartSticky()
      } else {
        this.listFold = true
        this._hideShopCartList()
      }
    },
    _showShopCartList() {
      this.shopCartListComp = this.shopCartListComp || this.$createShopCartList({
        $props: {
          selectFoods: 'selectFoods'
        },
        $events: { // api组件的监听事件方式
          hide: () => {
            this.listFold = true // 使得点击蒙层关闭弹出层后，再次点击shop-cart区域也能一次就点开弹出层
          },
          leave: () => {
            this._hideShopCartSticky() // -list组件hide()之后动画才会瞬间结束，此时销毁掉sticky组件
          },
          add: (el) => {
            this.shopCartStickyComp.drop(el)
          }
        }
      })
      this.shopCartListComp.show()
    },
    _showShopCartSticky() {
      this.shopCartStickyComp = this.shopCartStickyComp || this.$createShopCartSticky({
        $props: {
          selectFoods: 'selectFoods',
          deliveryPrice: 'deliveryPrice',
          minPrice: 'minPrice',
          fold: 'listFold', // 这个listFold需要跟this.fold做关联
          list: this.shopCartListComp
        }
      })
      this.shopCartStickyComp.show()
    },
    _hideShopCartList() {
      const comp = this.sticky ? this.$parent.list : this.shopCartListComp // this.$parent是调用当前组件的父组件
      comp.hide && comp.hide()
    },
    _hideShopCartSticky() {
      this.shopCartStickyComp.hide()
    }
  },
  watch: { // watch fold 是为了给  sticky 组件,因为 fold 是 prop，但是在 toggleList 函数中判断的是 listFold,你每次改变的  sticky 组件的 fold prop 的时候，也要去更新  sticky 的 listFold 值，这就通过 watch 实现的。
    fold(newVal) {
      this.listFold = newVal
    },
    totalCount(newVal) {
      if (!this.listFold && !newVal) {
        this._hideShopCartList()
      }
    }
  },
  components: {
    Bubble
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/mixin"
  @import "~common/stylus/variable"

  .shopcart
    height: 100%
    .content
      display: flex
      background: $color-background
      font-size: 0
      color: $color-light-grey
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: $color-background
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            text-align: center
            background: $color-dark-grey
            &.highlight
              background: $color-blue
            .icon-shopping_cart
              line-height: 44px
              font-size: $fontsize-large-xxx
              color: $color-light-grey
              &.highlight
                color: $color-white
          .num
            position: absolute
            top: 0
            right: 0
        .price
          display: inline-block
          vertical-align: top
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          font-weight: 700
          font-size: $fontsize-large
          &.highlight
            color: $color-white
        .desc
          display: inline-block
          vertical-align: top
          margin: 12px 0 0 12px
          line-height: 24px
          font-size: $fontsize-small-s
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          line-height: 48px
          text-align: center
          font-weight: 700
          font-size: $fontsize-small
          &.not-enough
            background: $color-dark-grey
          &.enough
            background: $color-green
            color: $color-white
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41) // 贝加尔曲线
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: $color-blue
          transition: all 0.4s linear
</style>
