<template>
  <div id="sidebar" small>
    <div class="wrapper">
      File Tree view
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  data () {
    return {
    }
  },
  computed: mapState({
    platform: state => state.config.platform
  }),
  methods: {
    ...mapGetters(['getRootFs'])
  }
}
</script>
