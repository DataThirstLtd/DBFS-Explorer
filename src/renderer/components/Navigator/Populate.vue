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
            v-for="(item, index) in contextMenu.menu"
            :key="index"
            @click="item.callback">
            <v-list-tile-action>
              <v-icon>
                {{ item.icon }}
              </v-icon>
            </v-list-tile-action>
            <v-list-tile-title>
              {{ item.title }}
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
          { title: 'Open', icon: 'fa fa-folder-open', callback: () => { this.onOpenItem() } },
          { title: 'Download', icon: 'fa fa-arrow-down', callback: () => { } },
          { title: 'Properties', icon: 'fa fa-info', callback: () => { } }
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
    ...mapActions(['clearSelection', 'fetchSelection', 'selectItem', 'setPrevPath', 'setCurrentPath']),
    onOpenItem: function () {
      this.setPrevPath({
        path: this.item.path.split(nodePath.basename(this.item.path))[0]
      })
      this.setCurrentPath({
        path: this.item.path + '/'
      })
      this.clearSelection()
      this.fetchSelection(this.item)
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
