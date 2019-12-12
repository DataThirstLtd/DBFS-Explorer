<template>
  <div>
    <loader />
    <title-bar :menu="true" />
    <sidebar />
    <div class="nav-content">
      <nuxt />
    </div>
    <downloader
      :show="downloader.show"
      :onClickShow="onShowDownloader"
      :onClickClose="onCloseDownloader"
    />
    <new-folder />
  </div>
</template>

<script>
import TitleBar from '@/components/title-bar'
import Sidebar from '@/components/sidebar'
import Loader from '@/components/loader'
import NewFolder from '@/components/new-folder'
import Downloader from '@/components/downloader'

export default {
  components: {
    TitleBar,
    Sidebar,
    Loader,
    Downloader,
    NewFolder
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
  @import url('@/assets/sass/_default.scss')
</style>

<style scoped>
  ::-webkit-scrollbar {
    width: 0;
  }
</style>
