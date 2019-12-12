<template>
  <div class="fade-in-transition">
    <loader />
    <title-bar :transparent="false" :authMenu="true" />
    <div class="main-content">
      <nuxt />
    </div>
  </div>
</template>

<script>
import TitleBar from '@/components/title-bar'
import Loader from '@/components/loader'

export default {
  components: {
    TitleBar,
    Loader
  }
}
</script>

<style lang="scss">
  @import url('@/assets/sass/_default.scss');
</style>
