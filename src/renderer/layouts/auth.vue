<template>
  <div class="fade-in-transition">
    <loader />
    <in-app-notify />
    <title-bar :transparent="false" :auth-menu="true" />
    <div class="main-content">
      <nuxt />
    </div>
  </div>
</template>

<script>
import TitleBar from '@/components/title-bar'
import Loader from '@/components/loader'
import InAppNotify from '@/components/in-app-notify'

export default {
  components: {
    TitleBar,
    Loader,
    InAppNotify
  }
}
</script>

<style lang="scss">
  @import url('@/assets/sass/_default.scss');
</style>
