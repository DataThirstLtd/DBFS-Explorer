<template>
  <div>
    <title-bar />
    <sidebar />
    <div class="nav-content">
      <nuxt />
    </div>
  </div>
</template>

<script>
import TitleBar from '@/components/title-bar'
import Sidebar from '@/components/sidebar'

export default {
  components: {
    TitleBar,
    Sidebar
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
