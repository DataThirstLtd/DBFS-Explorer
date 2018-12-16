<template>
  <div id="sidebar" small>
    <div class="wrapper">
      <div
        v-if="rootFs.length < 1"
        class="hero-x">
        <v-progress-circular
          indeterminate
          :width="2"
          :size="20"
          color="primary">
        </v-progress-circular>
        <span style="padding: 0 10px;">
          Loading ...
        </span>
      </div>
      <v-treeview
        v-else
        :items="rootFs"
        activatable
        item-key="path"
        open-on-click>
        <template slot="prepend" slot-scope="{ item, open, leaf }">
          <div @click="onClickTreeItem(item)" class="tree-item">
            <div class="icon">
              <v-icon small>
                {{ item.is_dir ? 'fa-folder' : 'fa-file' }}
              </v-icon>
            </div>
            <div class="path">
              {{ item.path }}
            </div>
          </div>
        </template>
      </v-treeview>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    rootFs: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: mapState({
    platform: state => state.config.platform
  }),
  methods: {
    onClickTreeItem: function (path) {
      console.log(path)
    }
  }
}
</script>

<style scoped>
  .tree-item {
    padding: 0 10px;
    width: 100% !important;
  }
  .tree-item .icon {
    display: inline-block;
  }
  .tree-item .path {
    display: inline-block;
    margin: 0 10px;
  }
</style>
