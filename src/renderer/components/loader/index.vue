<template>
  <div
    v-if="show"
    class="fixed top-0 right-0 bottom-0 left-0 bg-app-background z-50"
  >
    <div class="hero-xy">
      <spinner />
    </div>
    <logo class="hero-xy h-18 w-auto" />
  </div>
</template>

<script>
import Logo from '@/components/logo'
import Spinner from '@/components/spinner'

export default {
  components: {
    Logo,
    Spinner
  },
  data () {
    return {
      show: false
    }
  },
  mounted () {
    this.$root.$on('loader/show', () => {
      this.show = true
    })
    this.$root.$on('loader/hide', () => {
      this.show = false
    })
  }
}
</script>
