<template>
  <div>
    <div class="ig-selected-item-wrapper">
      <div class="item-wrapper"
        :active="selectedItem === item.path"
        @dblclick="onOpenItem"
        @click="onSelectItem"
        @contextmenu="showContextMenu">
        <v-icon
          v-if="item.is_dir"
          class="icon"
          :active="selectedItem === item.path"
          large>
          fa-folder
        </v-icon>
        <v-icon
          v-else
          class="icon"
          :active="selectedItem === item.path"
          large>
          fa-file
        </v-icon>
        <p class="name">
          {{ item.path.split('/').pop() || item.path }}
        </p>
      </div>
      <v-menu
        v-model="contextMenu.showMenu"
        :position-x="contextMenu.x"
        :position-y="contextMenu.y"
        absolute
        offset-y>
        <v-list>
          <v-list-tile
            v-for="(menuItem, index) in contextMenu.menu"
            :key="index"
            @click="menuItem.callback"
            :disabled="isMenuDisabled(menuItem)">
            <v-list-tile-action>
              <v-icon
                :color="menuItem.color || null"
                small>
                {{ menuItem.icon }}
              </v-icon>
            </v-list-tile-action>
            <v-list-tile-title>
              {{ menuItem.title }}
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

const nodePath = require('path')

export default {
  name: 'populate',
  props: {
    item: {
      type: Object,
      required: true
    },
    selectedItem: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      contextMenu: {
        showMenu: false,
        x: 0,
        y: 0,
        menu: [
          {
            id: 'id-context-nav-open',
            title: 'Open',
            icon: 'fa fa-folder-open',
            color: '',
            callback: () => { this.onOpenItem() }
          },
          {
            id: 'id-context-nav-download',
            title: 'Download',
            icon: 'fa fa-arrow-down',
            color: '',
            callback: () => { this.$root.$emit('downloadItem') }
          },
          {
            id: 'id-context-nav-delete',
            title: 'Delete',
            icon: 'fa fa-trash',
            color: 'red',
            callback: () => { this.$root.$emit('deleteItem') }
          },
          {
            id: 'id-context-nav-properties',
            title: 'Properties',
            icon: 'fa fa-info-circle',
            color: '',
            callback: () => { this.$root.$emit('openProperties') }
          }
        ]
      }
    }
  },
  mounted () {
    const self = this
    self.$root.$on('hideContextMenu', () => {
      self.contextMenu.showMenu = false
    })
  },
  methods: {
    ...mapActions([
      'showInfoSnackbar',
      'clearSelection',
      'fetchSelection',
      'selectItem',
      'setPrevPath',
      'setCurrentPath',
      'openDialog',
      'pushNavStack',
      'clearItem'
    ]),
    isMenuDisabled: function (menuItem) {
      return Boolean(
        (!this.item.is_dir &&
        menuItem.id === 'id-context-nav-open') ||
        (this.item.is_dir &&
        menuItem.id === 'id-context-nav-download')
      )
    },
    onOpenItem: function () {
      if (this.item.is_dir) {
        this.pushNavStack({
          path: this.selectedItem
        })
        this.setPrevPath({
          path: this.item.path.split(nodePath.basename(this.item.path))[0]
        })
        this.setCurrentPath({
          path: this.item.path + '/'
        })
        this.clearSelection()
        this.fetchSelection(this.item)
        this.clearItem()
      } else {
        this.showInfoSnackbar({
          message: 'Not a directory',
          status: true
        })
      }
    },
    onSelectItem: function () {
      this.selectItem(this.item)
    },
    showContextMenu: function (e) {
      e.preventDefault()
      const self = this
      self.onSelectItem()
      self.$root.$emit('hideContextMenu')
      self.contextMenu.x = e.clientX
      self.contextMenu.y = e.clientY
      self.$nextTick(() => {
        self.contextMenu.showMenu = true
      })
    }
  }
}
</script>

<style scoped>
  .item-wrapper {
    width: 100px;
    height: auto;
    margin: 10px;
    cursor: pointer;
  }
  .item-wrapper > .icon {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 0;
  }
  .item-wrapper > .name {
    text-align: center;
  }
  .item-wrapper[active] {
    background: rgba(22, 82, 179, 0.452);
  }
</style>
