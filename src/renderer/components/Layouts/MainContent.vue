<template>
  <div id="main-content" small>
    Main Content
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
