<template>
  <div>
    <title-bar />
    <nuxt />
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
  @import url('@/assets/sass/_default.scss')
</style>
