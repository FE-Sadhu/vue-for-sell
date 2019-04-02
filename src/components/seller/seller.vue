<template>
  <cube-scroll :options="sellerScrollOptions">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-bottom-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>元
            </div>
          </li>
        </ul>
        <div class="favorite" @click.stop="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-bottom-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul class="support">
          <li
            v-for="(item, index) in seller.supports"
            :key="index"
            class="support-item border-bottom-1px"
          >
          <support-ico :size=4 :type="item.type"></support-ico>
          <span class="desc">{{item.description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <cube-scroll :options="whiteScrollOptions" class="img-wrapper">
          <ul class="img-list">
            <li
              v-for="(item, index) in seller.pics"
              :key="index"
              class="img-item"
            >
              <img :src="item" width="120px" height="90px">
            </li>
          </ul>
        </cube-scroll>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-bottom-1px">商家信息</h1>
        <ul>
          <li
            class="info-item border-bottom-1px"
            v-for="(item, index) in seller.infos"
            :key="index"
          >
            <span>{{item}}</span>
          </li>
        </ul>
      </div>
    </div>
  </cube-scroll>
</template>

<script>
import Star from 'components/star/star'
import Split from 'components/split/split'
import SupportIco from 'components/support-ico/support-ico'
import { saveToLocal, loadFromLocal } from 'common/js/storage'

const KEY = 'favorite'

export default {
  name: 'seller',
  props: {
    data: Object,
    default() {
      return {}
    }
  },
  data() {
    return {
      favorite: false,
      sellerScrollOptions: {
        directionLockThreshold: 0,
        click: false
      },
      whiteScrollOptions: {
        scrollX: true,
        stopPropagation: true,
        directionLockThreshold: 0
      }
    }
  },
  computed: {
    seller() {
      return this.data.seller
    },
    favoriteText() {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  created() {
    this.favorite = loadFromLocal(this.seller.id, KEY, false)
  },
  methods: {
    toggleFavorite() {
      this.favorite = !this.favorite
      saveToLocal(this.seller.id, KEY, this.favorite)
    }
  },
  components: {
    Star,
    Split,
    SupportIco
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .overview
    position relative
    padding 18px
    .title
      margin-bottom 8px
      line-height 14px
      font-size $fontsize-medium
      color $color-dark-grey
    .desc
      display flex
      align-items center
      padding-bottom 18px
      .star
        margin-right 8px
      .text
        margin-right 12px
        line-height 18px
        font-size $fontsize-small-s
        color $color-grey
    .remark
      display flex
      padding-top 18px
      .block
        flex 1
        text-align center
        border-right 1px solid grey
        &:last-child
          border-right none
        h2
          margin-bottom 4px
          line-height 10px
          font-size $fontsize-small-s
          color $color-light-grey
        .content
          line-height 24px
          font-size $fontsize-small-s
          color $color-dark-grey
          .stress
            font-size $fontsize-large-xxx
    .favorite
      position absolute
      width 50px
      top 18px
      right 11px
      text-align center
      .icon-favorite
        display block
        margin-bottom 4px
        line-height 24px
        font-size $fontsize-large-xxx
        color $color-light-grey-s
        &.active
          color: $color-red
      .text
        line-height 10px
        font-size $fontsize-small-s
        color $color-grey
  .bulletin
    padding 18px 18px 0
    white-space normal
    .title
      color #333
      font-size 14px
      line-height 14px
      margin-bottom 8px
    .content-wrapper
      padding 0 12px 16px
      .content
        font-size 12px
        line-height 24px
        color #f01414
    .support
      .support-item
        padding 16px 12px
        display flex
        align-items center
        &:last-child
          border-bottom none
        .support-ico
          margin-right 6px
        .desc
          line-height 16px
          font-size $fontsize-small
          color: $color-dark-grey
  .pics
    padding 18px
    .title
      font-size 14px
      line-height 14px
      color #333
      margin-bottom 8px
      text-align center
    .img-wrapper
      display flex
      align-items center
      .img-list
        .img-item
          display inline-block
          width 120px
          height 90px
          margin-right 6px
  .info
    padding 18px 18px 0
    .title
      font-size 14px
      line-height 14px
      padding-bottom 12px
    .info-item
      padding 16px 12px
      font-size 12px
      line-height 12px
      &:last-child
        border-bottom none
</style>
