<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab-wrapper">
      <tab :tabs="tabs"></tab>
    </div>
  </div>
</template>

<script>
import VHeader from 'components/v-header/v-header'
import Tab from 'components/tab/tab'
import Goods from 'components/goods/goods'
import Ratings from 'components/ratings/ratings'
import Seller from 'components/seller/seller'
import { getSeller } from 'api/index'

export default {
  name: 'app',
  data() {
    return {
      seller: {}
    }
  },
  created() {
    this._getSeller()
  },
  computed: {
    tabs() {
      return [
        {
          label: '商品',
          component: Goods,
          data: {
            seller: this.seller
          }
        }, {
          label: '评论',
          component: Ratings,
          data: {
            seller: this.seller
          }
        }, {
          label: '卖家',
          component: Seller,
          data: {
            seller: this.seller
          }
        }
      ]
    }
  },
  methods: {
    _getSeller() {
      getSeller().then((seller) => {
        this.seller = seller
      })
    }
  },
  components: {
    VHeader,
    Tab
  }
}
</script>

<style lang="stylus">
  .tab-wrapper
    position: fixed
    top: 136px
    left 0
    right 0
    bottom 0

</style>
