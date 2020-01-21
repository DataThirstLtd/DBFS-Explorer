<template>
  <div>
    <loader />
    <in-app-notify />
    <title-bar :menu="true" />
    <sidebar />
    <div class="nav-content">
      <nuxt />
    </div>
    <downloader
      :show="downloader.show"
      :on-click-show="onShowDownloader"
      :on-click-close="onCloseDownloader"
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
import InAppNotify from '@/components/in-app-notify'

export default {
  components: {
    TitleBar,
    Sidebar,
    Loader,
    Downloader,
    NewFolder,
    InAppNotify
  },
  data () {
    return {
      downloader: {
        show: false
      }
    }
  },
  methods: {
    onCloseDownloader () {
      this.downloader.show = false
    },
    onShowDownloader () {
      this.downloader.show = true
    }
  }
}
</script>

<style lang="scss">
  @import url('@/assets/sass/_default.scss');
</style>

<style scoped>
  ::-webkit-scrollbar {
    width: 0;
  }
</style>
