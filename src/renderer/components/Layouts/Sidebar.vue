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
      <div
        v-else>
        <v-btn
          icon
          color="#F2F2F2"
          @click="onClickTreeItem({ path: '/', is_dir: true })">
          /
        </v-btn>
        <v-treeview
          :items="rootFs"
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

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
    ...mapActions(['fetchSelection', 'clearSelection', 'clearNavStack', 'pushNavStack']),
    onClickTreeItem: function (selection) {
      this.clearNavStack()
      this.pushNavStack({
        path: selection.path
      })
      this.clearSelection()
      this.fetchSelection(selection)
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
