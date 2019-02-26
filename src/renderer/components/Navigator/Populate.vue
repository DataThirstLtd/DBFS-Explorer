<template>
  <div>
    <div class="ig-selected-item-wrapper">
      <div
        class="item-wrapper"
        :active="selectedItem.constructor === [].constructor && selectedItem.findIndex(x => x === item.path) > -1"
        @dblclick="onOpenItem"
        @click="onSelectItem"
        @contextmenu="showContextMenu">
        <v-icon
          v-if="item.is_dir"
          class="icon"
          :active="selectedItem.constructor === [].constructor && selectedItem.findIndex(x => x === item.path) > -1"
          large>
          fa-folder
        </v-icon>
        <v-icon
          v-else
          class="icon"
          :active="selectedItem.constructor === [].constructor && selectedItem.findIndex(x => x === item.path) > -1"
          large>
          fa-file
        </v-icon>
        <p
          class="name"
          :active="selectedItem.constructor === [].constructor && selectedItem.findIndex(x => x === item.path) > -1">
          {{ item.path.split('/').pop() || item.path }}
        </p>
        <div
          v-if="!item.is_dir && !item.file_size"
          class="vindicator">
          <v-icon
            class="icon"
            small>
            fa-times
          </v-icon>
        </div>
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
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'populate',
  props: {
    item: {
      type: Object,
      required: true
    },
    selectedItem: {
      type: Array,
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
      },
      meteCtrlKey: false
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
      'selectAppendItems',
      'selectItems',
      'setPrevPath',
      'openDialog',
      'pushNavStack',
      'clearItem'
    ]),
    ...mapGetters([
      'getSelectedItems'
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
          path: this.item.path
        })
        this.clearSelection()
        this.fetchSelection(this.item)
        this.clearItem()
      } else {
        this.$root.$emit('downloadItem')
      }
    },
    onSelectItem: function (e, clearItems) {
      if (e && e.metaKey && !clearItems) {
        this.selectAppendItems(this.item)
      } else {
        this.selectItems(this.item)
      }
    },
    showContextMenu: function (e) {
      const selectedItems = this.getSelectedItems()
      if (selectedItems.findIndex(x => x === this.item.path) < 0) {
        this.onSelectItem(e, true)
      }
      const self = this
      e.preventDefault()
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
    position: relative;
    width: 100px;
    height: auto;
    min-height: 110px;
    margin: 10px;
    padding: 20px 10px;
    cursor: pointer;
  }

  .item-wrapper > .icon {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 0;
  }

  .item-wrapper > .name {
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    padding: 10px;
    text-align: center;
    word-break: break-all;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .item-wrapper[active] {
    background: #E2ECFE;
    border-radius: 5px;
    z-index: 500;
  }

  .item-wrapper > .name[active] {
    background: #E2ECFE;
    word-break: break-all;
    overflow: auto;
    white-space: normal;
    text-overflow: unset;
    z-index: 500;
  }

  .item-wrapper > .vindicator {
    position: absolute;
    top: 0;
    right: 0;
  }

  .item-wrapper > .vindicator > .icon {
    background-color: rgb(219, 33, 33);
    color: white;
    padding: 7px 10px;
    border-radius: 50px;
  }

</style>
