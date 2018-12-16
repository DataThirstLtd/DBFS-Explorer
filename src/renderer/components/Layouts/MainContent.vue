<template>
  <div id="main-content" small>
    <div class="wrapper">
      <v-layout v-if="fetchWait"
        row>
        <v-progress-circular
          indeterminate
          :width="2"
          :size="20"
          color="primary">
        </v-progress-circular>
        <span style="padding: 0 10px;">
          Loading ...
        </span>
      </v-layout>
      <folder
        :selection="selection"
        :fetchWait="fetchWait" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Folder from '@/components/Navigator/Folder'

export default {
  components: {
    Folder
  },
  computed: mapState({
    platform: state => state.config.platform,
    buffer: state => state.navigator.buffer,
    selection: state => state.navigator.selection,
    fetchWait: state => state.navigator.fetchWait
  })
}
</script>
