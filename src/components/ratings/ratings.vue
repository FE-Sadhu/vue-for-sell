<template>
  <cube-scroll class="ratings" :data="computedRatings"><!-- 有变化的数组cube-scroll组件的data去watch，自定refresh dom高度 -->
    <div class="rating-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{seller.score}}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{seller.rankRate}}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <rating-select
        :ratings="ratings"
        :onlyContent="onlyContent"
        :selectType="selectType"
        @select="onSelectType"
        @toggle="onToggle"
        v-if="ratings.length"
      >
      </rating-select>
      <div class="rating-wrapper">
        <ul>
          <li
            v-for="(rating, index) in computedRatings"
            :key="index"
            class="rating-item border-bottom-1px"
          >
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28">
            </div>
            <div class="content">
              <div class="username">{{rating.username}}</div>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <span class="item"
                  v-for="(item, index) in rating.recommend"
                  :key="index"
                >
                  {{item}}
                </span>
              </div>
              <div class="time">
                {{format(rating.rateTime)}}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </cube-scroll>
</template>

<script>
import Split from 'components/split/split'
import Star from 'components/star/star'
import RatingSelect from 'components/rating-select/rating-select'
import { getRatings } from 'api/index'
import ratingMixin from 'common/mixins/rating'
import moment from 'moment'

export default {
  name: 'ratings',
  mixins: [ratingMixin],
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      ratings: []
    }
  },
  computed: {
    seller() {
      return this.data.seller
    }
  },
  methods: {
    fetch() {
      if (!this.fetched) {
        this.fetched = true
        getRatings({
          id: this.seller.id
        }).then(ratings => {
          this.ratings = ratings
        })
      }
    },
    format(time) {
      return moment(time).format('YYYY_MM_DD hh:mm')
    }
  },
  components: {
    Split,
    Star,
    RatingSelect
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .ratings
    position relative
    text-align left
    white-space normal
    .overview
      display flex
      padding 18px 0
    .overview-left
      flex 0 0 137px
      width 137px
      padding 6px 0
      text-align center
      border-right 1px solid #d9dde1
      .score
        color #fc9153
        font-size 24px
        line-height 28px
        margin-bottom 6px
      .title
        color #333
        font-size 12px
        line-height 12px
        margin-bottom 6px
      .rank
        color #999
        font-size 10px
        line-height 10px
    .overview-right
      flex 1
      padding 6px 0 6px 24px
      .score-wrapper
        display flex
        align-items center
        margin-bottom 8px
        .title
          color #333
          font-size 12px
          line-height 18px
        .star
          margin 0 12px
        .score
          color #fc9153
          font-size 12px
          line-height 18px
      .delivery-wrapper
        font-size 0
        .title
          color #333
          font-size 12px
          line-height 18px
        .delivery
          color #999
          font-size 12px
          line-height 18px
          margin-left 12px
  .rating-wrapper
    padding 0 18px
    .rating-item
      display flex
      padding 18px 0
      &:last-child
        border-none()
      .avatar
        flex 0 0 28px
        width 28px
        margin-right 12px
        img
          border-radius 50%
      .content
        flex 1
        position relative
        .username
          margin-bottom 4px
          color #333
          font-size 10px
          line-height 12px
        .star-wrapper
          display flex
          align-items center
          margin-bottom 6px
          // justify-content center
          .star
            margin-right 6px
          .delivery
            font-size $fontsize-small-s
            color $color-light-grey
        .text
          color $color-dark-grey
          font-size $fontsize-small
          line-height 18px
          margin-bottom 8px
        .recommend
          display flex
          align-items center
          flex-wrap wrap
          .icon-thumb_up, .item
            margin 0 8px 4px 0
            font-size $fontsize-small-s
          .icon-thumb_up
            color $color-blue
          .item
            padding 0 6px
            border: 1px solid $color-row-line
            border-radius 1px
            color $color-light-grey
            background $color-white
        .time
          position absolute
          right: 0
          top: 0
          line-height 12px
          font-size $fontsize-small
          color $color-light-grey
</style>
