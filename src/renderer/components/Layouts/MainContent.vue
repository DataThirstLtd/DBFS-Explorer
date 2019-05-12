<template>
  <div id="main-content"
    small>
    <v-toolbar
      v-if="selection"
      class="options"
      height="50px"
      flat>
      <v-btn icon
        @click="goBack">
        <v-icon small>fa-arrow-left</v-icon>
      </v-btn>
      <div>
        {{ `/${navStack.join('/')}` }}
      </div>
      <v-spacer />
      <div
        v-for="item in appbarButtons.right"
        :key="item.id">
        <v-tooltip
          bottom>
          <v-btn
            v-if="isHiddenAction(item) ? selectedItem ? true : false : true"
            slot="activator"
            class="ig-folder-actions-button"
            small
            icon
            light
            @click="item.callback">
            <v-icon
              :color="item.color || null"
              small>
              {{ item.icon }}
            </v-icon>
          </v-btn>
          <span>{{ item.tooltip }}</span>
        </v-tooltip>
      </div>
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
    <div
      class="files"
      style="padding: 5px 10px;">
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
import { mapState, mapActions, mapGetters } from 'vuex'
import Folder from '@/components/Navigator/Folder'

const nodePath = require('path')
const uniqid = require('uniqid')

export default {
  components: {
    Folder
  },
  data () {
    return {
      appbarButtons: {
        right: [
          {
            id: 'id-app-download',
            text: 'Download',
            color: '',
            icon: 'fa-arrow-down',
            callback: this.downloadItem,
            platforms: ['darwin', 'win32', 'linux'],
            tooltip: 'Download Selected File',
            hidden: true
          },
          {
            id: 'id-app-delete',
            text: 'Delete',
            color: 'red',
            icon: 'fa-trash',
            callback: this.deleteItem,
            platforms: ['darwin', 'win32', 'linux'],
            tooltip: 'Delete Selected File',
            hidden: true
          },
          {
            id: 'id-app-properties',
            text: 'Properties',
            color: '',
            icon: 'fa-info',
            callback: this.openProperties,
            platforms: ['darwin', 'win32', 'linux'],
            tooltip: 'View Properties of Selected File',
            hidden: true
          },
          {
            id: 'id-app-new-folder',
            text: 'New Folder',
            color: null,
            icon: 'fa-folder-plus',
            callback: this.newFolder,
            platforms: ['darwin', 'win32', 'linux'],
            tooltip: 'Create a new folder',
            hidden: false
          }
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
    fetchWait: state => state.navigator.fetchWait,
    navStack: state => state.navigator.navStack
  }),
  mounted () {
    const self = this
    this.$nextTick(() => {
      document.body.addEventListener('keyup', (e) => {
        const selection = self.getSelection()
        if (selection && selection.length > 0) {
          if (e.keyCode === 39) {
            // Arrow right
            if (self.selectedItem && self.selectedItem.length === 1) {
              const targetIndex = selection.findIndex(x => x.path === self.selectedItem[0])
              if (targetIndex > -1 && selection.length - 1 > targetIndex) {
                self.selectItems(selection[targetIndex + 1])
              } else {
                self.selectItems(selection[0])
              }
            } else {
              self.selectItems(selection[0])
            }
          } else if (e.keyCode === 37) {
            // Arrow left
            if (self.selectedItem && self.selectedItem.length === 1) {
              const targetIndex = selection.findIndex(x => x.path === self.selectedItem[0])
              console.log(targetIndex - 1)
              if (targetIndex > -1 && selection.length - 1 >= targetIndex) {
                if ((targetIndex - 1) >= 0) {
                  self.selectItems(selection[targetIndex - 1])
                } else {
                  self.selectItems(selection[selection.length - 1])
                }
              } else {
                self.selectItems(selection[0])
              }
            } else {
              self.selectItems(selection[0])
            }
          }
        }
        if (e.keyCode === 8) {
          !self.getDialogsCount() && self.goBack()
        }
        if (e.keyCode === 13) {
          const selectedItem = self.getSelectedItems()
          if (selectedItem && selectedItem.length === 1) {
            const selection = self.getSelection()
            if (selection) {
              const targetIndex = selection.findIndex(x => x.path === selectedItem[0])
              if (targetIndex > -1) {
                self.$root.$emit('openItem', selection[targetIndex])
              }
            }
          }
        }
      })
    })
    this.$root.$on('deleteItem', () => {
      self.deleteItem()
    })
    this.$root.$on('downloadItem', () => {
      self.downloadItem()
    })
    this.$root.$on('openProperties', () => {
      self.openProperties()
    })
  },
  methods: {
    ...mapGetters([
      'getSelection',
      'getDialogsCount',
      'getSelectedItems'
    ]),
    ...mapActions([
      'clearSelection',
      'fetchSelection',
      'openDialog',
      'popNavStack',
      'selectItems'
    ]),
    isHiddenAction: function (item) {
      const itemIndex = this.appbarButtons.right.findIndex(x => x.id === item.id)
      if (itemIndex > -1 && this.appbarButtons.right[itemIndex].hidden) {
        return true
      }
      return false
    },
    getParentPath: function (data) {
      if (data && 'path' in data && data.path) {
        return data.path.split(nodePath.basename(data.path))[0] || data.path
      }
      return ''
    },
    goBack: function () {
      this.popNavStack()
      this.clearSelection()
      this.fetchSelection({
        path: `/${this.navStack.join('/')}`
      })
    },
    deleteItem: function () {
      const pwd = `/${this.navStack.join('/')}`
      const list = this.selectedItem
      if (list && list.findIndex(x => x === '/') < 0) {
        this.openDialog({
          name: 'delete',
          options: {
            list: list,
            pwd
          }
        })
      }
    },
    downloadItem: function () {
      const self = this
      const transferObject = []
      const file = this.$electron.remote.dialog.showOpenDialog(
        this.$electron.remote.getCurrentWindow(),
        {
          properties: ['openDirectory', 'createDirectory']
        }
      )
      if (file && file.constructor === [].constructor && file.length > 0) {
        self.selectedItem.forEach((selected) => {
          const itemIndex = self.selection.findIndex(x => x.path === selected)
          if (itemIndex > -1 && !self.selection[itemIndex].is_dir) {
            if (file) {
              const item = self.selection[itemIndex]
              const uid = uniqid()
              transferObject.push({
                file: {
                  name: nodePath.basename(item.path),
                  path: item.path,
                  size: item.file_size
                },
                transferId: uid,
                selected: true,
                targetPath: nodePath.join(
                  `${file[0]}`,
                  nodePath.basename(item.path)
                )
              })
            }
          }
        })
        this.openDialog({
          name: 'dataTransfer',
          options: {
            list: transferObject,
            type: 0
          }
        })
      }
    },
    openProperties: function () {
      this.openDialog({
        name: 'properties'
      })
    },
    newFolder: function () {
      this.openDialog({
        name: 'newFolder'
      })
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
