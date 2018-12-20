<template>
  <div id="main-content"
    small>
    <v-toolbar
      v-if="selection"
      class="content-nav"
      height="50px"
      flat>
      <v-btn icon
        @click="goBack">
        <v-icon small>fa-arrow-left</v-icon>
      </v-btn>
      <div>
        {{ getParentPath(selection[0]) || (folderEmpty.valid ? folderEmpty.path : '') }}
      </div>
      <v-spacer />
      <v-btn
        v-if="item.id === 'id-app-delete' ? selectedItem ? true : false : true"
        class="ig-folder-actions-button"
        v-for="item in appbarButtons.right" small
        :key="item.id" @click="item.callback"
        icon light>
        <v-icon
          :color="item.color || null"
          small>
          {{ item.icon }}
        </v-icon>
      </v-btn>
    </v-toolbar>
    <div v-if="selection && selection.length < 1 && !fetchWait && !folderEmpty.state"
      class="wrapper">
      Please select a target folder to view files
    </div>
    <div v-if="folderEmpty"
      class="wrapper"
      style="text-align: center; padding: 20px;">
      Empty Folder
    </div>
    <div style="padding: 10px;" class="wrapper">
      <v-layout
        v-if="fetchWait"
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
        :selectedItem="selectedItem"
        :fetchWait="fetchWait" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Folder from '@/components/Navigator/Folder'

const nodePath = require('path')

export default {
  components: {
    Folder
  },
  data () {
    return {
      appbarButtons: {
        right: [
          { id: 'id-app-delete', text: 'Delete', color: 'red', icon: 'fa-trash', callback: this.deleteItem, platforms: ['darwin', 'win32', 'linux'] },
          { id: 'id-app-new-folder', text: 'Delete', color: null, icon: 'fa-folder-plus', callback: () => { this.openDialog({ name: 'newFolder' }) }, platforms: ['darwin', 'win32', 'linux'] }
        ]
      }
    }
  },
  computed: mapState({
    platform: state => state.config.platform,
    buffer: state => state.navigator.buffer,
    selection: state => state.navigator.selection,
    selectedItem: state => state.navigator.selectedItem,
    folderEmpty: state => state.navigator.folderEmpty,
    fetchWait: state => state.navigator.fetchWait
  }),
  methods: {
    ...mapActions(['clearSelection', 'fetchSelection', 'openDialog']),
    getParentPath: function (data) {
      if (data && 'path' in data && data.path) {
        return data.path.split(nodePath.basename(data.path))[0] || data.path
      }
      return ''
    },
    goBack: function () {
      let targetObject = {}
      if (this.selection[0]) {
        const prevPath = this.getParentPath(this.selection[0])
        targetObject = Object.assign(
          {},
          this.selection[0],
          { path: prevPath.split(nodePath.basename(prevPath))[0] }
        )
      } else if (this.folderEmpty.valid) {
        const prevPath = this.folderEmpty.path
        targetObject = {
          path: prevPath.split(nodePath.basename(prevPath))[0],
          is_dir: true
        }
      }
      this.clearSelection()
      this.fetchSelection(targetObject)
    },
    deleteItem: function () {
      const prevPath = this.getParentPath({ path: this.selectedItem })
      const path = this.selectedItem
      if (path && path !== '/') {
        this.openDialog({
          name: 'delete',
          options: {
            path: path,
            prevPath: prevPath
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .content-nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }
</style>
