const ALL = 2

export default {
  data() {
    return {
      onlyContent: true,
      selectType: ALL
    }
  },
  computed: {
    computedRatings() {
      let ret = []
      this.ratings.forEach(rating => {
        if (this.onlyContent && !rating.text) {
          return
        }
        if (this.selectType === ALL || this.selectType === rating.rateType) {
          ret.push(rating)
        }
      })
      return ret
    }
  },
  methods: {
    onSelectType(type) {
      this.selectType = type
    },
    onToggle() {
      this.onlyContent = !this.onlyContent
    }
  }
}
