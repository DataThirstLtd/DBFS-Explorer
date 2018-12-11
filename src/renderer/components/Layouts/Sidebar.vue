<template>
  <div id="sidebar"
    :small="platform === 'darwin'">
    hello
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  computed: mapState({
    platform: state => state.config.platform
  })
}
</script>
