<template>
  <div />
</template>

<script>
export default {
  data () {
    return {
      routePath: ''
    }
  },
  created () {
    const params = getUrlVars()
    if (
      params &&
      params.constructor === {}.constructor &&
      'page' in params
    ) {
      this.routePath = `/${params.page}`
    }
  },
  mounted () {
    this.$nextTick(() => {
      /* const lottieViewer = document.getElementById('lottie-viewer')
      if (lottieViewer) {
        lottie.loadAnimation({
          container: lottieViewer,
          renderer: 'svg',
          loop: true,
          autoplay: true,
          animationData: LoaderJson
        }).setSpeed(1.5)
      } */
      setTimeout(() => {
        this.$router.replace({ path: this.routePath })
      }, 100)
    })
  }
}

function getUrlVars () {
  const vars = {}
  window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value
    }
  )
  return vars
}
</script>
