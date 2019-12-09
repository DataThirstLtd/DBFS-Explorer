<template>
  <div class="fade-in-transition">
    <downloader
      :show="downloader.show"
      :onClickShow="onShowDownloader"
      :onClickClose="onCloseDownloader"
    />
    <title-bar :transparent="false" :menu="false" />
    <div class="main-content">
      <nuxt />
    </div>
  </div>
</template>

<script>
import TitleBar from '@/components/title-bar'
import Downloader from '@/components/downloader'

export default {
  components: {
    TitleBar,
    Downloader
  },
  data () {
    return {
      downloader: {
        show: false
      }
    }
  },
  methods: {
    onCloseDownloader: function () {
      this.downloader.show = false
    },
    onShowDownloader: function () {
      this.downloader.show = true
    }
  }
}
</script>

<style lang="scss">
  @import url('@/assets/sass/_default.scss');
</style>
