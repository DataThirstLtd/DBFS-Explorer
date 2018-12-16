<template>
  <div id="main-content" small>
    <div class="wrapper">
      <folder :list="list"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Folder from '@/components/Navigator/Folder'

export default {
  data () {
    return {
      list: {}
    }
  },
  components: {
    Folder
  },
  computed: mapState({
    platform: state => state.config.platform,
    buffer: state => state.navigator.buffer,
    selection: state => state.navigator.selection
  })
}
</script>
