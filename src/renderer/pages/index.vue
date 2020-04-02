<template>
  <div>
    <v-progress-circular
      width="3"
      size="74"
      color="primary"
      indeterminate
    >
      <img
        src="@/assets/logo.svg"
        width="auto"
        height="38"
      >
    </v-progress-circular>
  </div>
</template>

<script>
import Logo from '@/components/Logo'

export default {
  components: {
    Logo
  },
  mounted () {
    this.$nextTick(() => {
      this.splash()
    })
  },
  methods: {
    splash () {
      setTimeout(() => {
        this.$router.replace({ path: '/login' })
      }, 2000)
    }
  }
}
</script>
