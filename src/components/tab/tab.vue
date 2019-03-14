<template>
  <div class="tab">
    <cube-tab-bar
      :showSlider=true
      :useTransition=false
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
        @change="onChange"
        @scroll="onScroll"
        :options="slideOptions"
        ref="slide"
      ><!--这些传的参数代表的意义文档都有，翻阅即可。 change事件在slide页面切换时触发并且会派送当前页面索引 这里scroll事件其实就是bs里的scroll事件，在页面滑动时触发，需要配置options-->
        <cube-slide-item v-for="(tab, index) in tabs" :key="index">
          <component :is="tab.component" :data="tab.data"></component>
        </cube-slide-item>
      </cube-slide>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tab',
  props: {
    tabs: {
      type: Array,
      default() {
        return {}
      }
    },
    initialIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      index: this.initialIndex,
      slideOptions: {
        listenScroll: true,
        probeType: 3, // 当 probeType 为 2 的时候，会在屏幕滑动的过程中实时的派发 scroll 事件，具体参见better-scroll文档
        directionLockThreshold: 0 // 该项目未来slide组件里还会有纵轴方向上的滚动，而不止是目前的横轴滚动。
        // 配置directionxxx:0是为了避免之后横竖轴的影响
      }
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
  methods: {
    onChange(current) { // current就是change事件派发的索引，change事件在页面切换后的一瞬间派发的。
      this.index = current // 这样就实现了slide和tabBar联动,但是不完美。
    },
    onScroll(pos) {
      // console.log(pos.x)
      // console.log(this.$refs.tabBar) 组件实例
      const tabBarWidth = this.$refs.tabBar.$el.clientWidth // 拿到tabBar元素的宽度。
      const slideWidth = this.$refs.slide.slide.scrollerWidth // slide组件利用bs方法拿到宽度
      const transform = (-pos.x) / slideWidth * tabBarWidth // 计算出下划线该移动的距离
      this.$refs.tabBar.setSliderTransform(transform) // 利用cube-tab-bar的组件实例方法setSliderTransform可控制组件下划线（文档有）
    }
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
