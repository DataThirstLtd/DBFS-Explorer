<template>
  <div id="sidebar"
    :small="platform === 'darwin'">
    <div class="wrapper">
      <v-treeview
        v-model="tree"
        :items="rootFs"
        activatable
        item-key="path"
        open-on-click>
      </v-treeview>
      {{ rootFs }}
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  data () {
    return {
      rootFs: [
        { path: '.git', file: 'png' }
      ],
      tree: []
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
