<template>
  <div class="fade-in-transition">
    <title-bar :transparent="true" />
    <div class="main-content">
      <nuxt />
    </div>
  </div>
</template>

<script>
import TitleBar from '@/components/title-bar'

export default {
  components: {
    TitleBar
  }
}
</script>

<style lang="scss">
  @import url('@/assets/sass/_default.scss');
</style>
