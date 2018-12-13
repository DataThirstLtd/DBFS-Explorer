<template>
  <div id="main-content" small>
    <div class="wrapper">
      Main
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState({
    platform: state => state.config.platform
  })
}
</script>
