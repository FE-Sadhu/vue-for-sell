<template>
  <transition name="fade"> <!-- 这个控制弹出层整体的动画，渐隐渐显 -->
    <cube-popup
      v-show="visible"
      :mask-closable=true
      :z-index=90
      position="bottom"
      type="shop-cart-list"
      @mask-click="maskClick"
    ><!-- v-show驱动两个transition -->
      <transition
        name="move"
        @after-leave="onLeave"
      > <!-- 这个控制弹出层的内容部分的动画 向y轴运动 -->
        <div v-show="visible">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span @click="empty" class="empty">清空</span>
          </div>
          <cube-scroll class="list-content" ref="listContent">
            <ul>
              <li
              class="food"
              v-for="food in selectFoods"
              :key="food.name"
              >
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>¥{{food.price*food.count}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cart-control @add="onAdd" :food="food"></cart-control>
                </div>
              </li>
            </ul>
          </cube-scroll>
        </div>
      </transition>
    </cube-popup>
  </transition>
</template>

<script>
import CartControl from 'components/cart-control/cart-control'
import popupMixin from 'common/mixins/popup'

const EVENT_LEAVE = 'leave'
const EVENT_ADD = 'add'
const EVENT_SHOW = 'show'

export default {
  name: 'shop-cart-list',
  mixins: [popupMixin],
  props: {
    selectFoods: {
      type: Array,
      default() {
        return []
      }
    }
  },
  created() {
    this.$on(EVENT_SHOW, () => {
      this.$nextTick(() => {
        this.$refs.listContent.refresh() // 当列表DOM show出来的时候要重新计算一下高度
      })
    }) // mixins里的show对这里不完整，可以通过此处的$on来监听show事件从而加上该组件show()中mixins没有的操作
  },
  methods: {
    maskClick() {
      this.hide()
    },
    onLeave() {
      this.$emit(EVENT_LEAVE)
    },
    onAdd(target) {
      this.$emit(EVENT_ADD, target)
    },
    empty() {
      this.dialogComp = this.$createDialog({
        type: 'confirm',
        // title: '清空购物车?',
        content: '清空购物车?',
        $events: {
          confirm: () => {
            this.selectFoods.forEach((food) => {
              food.count = 0
            })
            this.hide()
          }
        }
      })
      this.dialogComp.show()
    }
  },
  components: {
    CartControl
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .cube-shop-cart-list
    bottom: 48px
    &.fade-enter, &.fade-leave-active
      opacity: 0
    &.fade-enter-active, &.fade-leave-active
      transition: all .3s ease-in-out
    .move-enter, .move-leave-active
      transform: translate3d(0, 100%, 0)
    .move-enter-active, .move-leave-active
      transition: all .3s ease-in-out
    .list-header
      height: 40px
      line-height: 40px
      padding: 0 18px
      background: $color-background-ssss
      .title
        float: left
        font-size: $fontsize-medium
        color: $color-dark-grey
      .empty
        float: right
        font-size: $fontsize-small
        color: $color-blue

    .list-content
      padding: 0 18px
      max-height: 217px // 关键
      overflow: hidden
      background: $color-white
      .food
        position: relative
        padding: 12px 0
        box-sizing: border-box
        .name
          line-height: 24px
          font-size: $fontsize-medium
          color: $color-dark-grey
        .price
          position: absolute
          right: 90px
          bottom: 12px
          line-height: 24px
          font-weight: 700
          font-size: $fontsize-medium
          color: $color-red
        .cart-control-wrapper
          position: absolute
          right: 0
          bottom: 6px
</style>
