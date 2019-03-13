<template>
  <div class="tab">
    <cube-tab-bar
      :showSlider=true
      v-model="selectedLabel"
      :data="tabs"
      ref="tabBar"
      class="border-bottom-1px"
    ><!--这些传的参数代表的意义文档都有，翻阅即可。selectedLabel这个v-model表示说我当前应该展示的是选中了的selectedLabel的tab -->
    </cube-tab-bar>
    <div class="slide-wrapper">
      <cube-slide
        :loop=false
        :auto-play=false
        :show-dots=false
        :initial-index="index"
        ref="slide"
      ><!--这些传的参数代表的意义文档都有，翻阅即可。-->
        <cube-slide-item>
          <goods></goods>
        </cube-slide-item>
        <cube-slide-item>
          <ratings></ratings>
        </cube-slide-item>
        <cube-slide-item>
          <seller></seller>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script>
import Goods from 'components/goods/goods'
import Ratings from 'components/ratings/ratings'
import Seller from 'components/seller/seller'

export default {
  name: 'tab',
  data() {
    return {
      index: 0,
      tabs: [{
        label: '商品'
      }, {
        label: '评价'
      }, {
        label: '商家'
      }]
    }
  },
  computed: {
    selectedLabel: {
      get() {
        return this.tabs[this.index].label // 也是根据index计算的
      },
      set(newVal) {
        this.index = this.tabs.findIndex((value) => {
          return value.label === newVal
        }) // 为什么这里会有setter 是因为tabBar的机制，你点击了另一个tab后，机制会去修改这个selectedLabel。所以需要有setter。
          // 这个setter这里的作用是计算当前tab对应数组tabs的index是多少，然后对应让cube-slide和cube-tab-bar切换显示哪个index的页面/tab
          // （newVal也是机制产生的值，这个值是切换后当前所在tab的文字）
      }
    }
  },
  components: {
    Goods,
    Ratings,
    Seller
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .tab
    >>> .cube-tab
      padding: 10px 0
    display: flex
    flex-direction: column
    height: 100%
    .slide-wrapper
      flex: 1
      overflow: hidden
</style>
