<template>
  <div class="title-bar bg-container text-xs text-white">
    <div class="flex h-full items-center">
      <div class="px-3">
        DBFS-Explorer
      </div>
      <div class="flex-grow" />
      <button
        class="h-full no-drag px-4 bg-transparent hover:bg-hover-one cursor-pointer"
        @mouseenter="onMouseEnterMinimize"
        @mouseleave="onMouseLeave"
        @click="onClickMinimize"
      >
        <icon
          :width="13"
          :height="13"
          :fill="hover.minimize ? '#ffffff' : '#a1a1a1'"
          name="minimize"
        />
      </button>
      <button
        class="h-full no-drag px-4 bg-transparent hover:bg-hover-one cursor-pointer"
        @mouseenter="onMouseEnterMaximize"
        @mouseleave="onMouseLeave"
        @click="onClickMaximize"
      >
        <icon
          :width="13"
          :height="13"
          :fill="hover.maximize ? '#ffffff' : '#a1a1a1'"
          name="maximize"
        />
      </button>
      <button
        class="h-full no-drag px-4 bg-transparent hover:bg-red-700 cursor-pointer"
        @mouseenter="onMouseEnterClose"
        @mouseleave="onMouseLeave"
        @click="onClickClose"
      >
        <icon
          :width="13"
          :height="13"
          :fill="hover.close ? '#ffffff' : '#a1a1a1'"
          name="close"
        />
      </button>
    </div>
  </div>
</template>


<script>
import Icon from '@/components/icon'

const remote = require('electron').remote

export default {
  components: {
    Icon
  },
  data () {
    return {
      platform: require('os').platform(),
      hover: {
        close: false,
        maximize: false,
        minimize: false
      }
    }
  },
  methods: {
    onClickMinimize: function () {
      remote.getCurrentWindow().minimize()
    },
    onClickMaximize: function () {
      if (remote.getCurrentWindow().isMaximized()) {
        remote.getCurrentWindow().unmaximize()
      } else {
        remote.getCurrentWindow().maximize()
      }
    },
    onClickClose: function () {
      remote.getCurrentWindow().close()
    },
    onMouseEnterClose: function () {
      this.hover.close = true
    },
    onMouseEnterMaximize: function () {
      this.hover.maximize = true
    },
    onMouseEnterMinimize: function () {
      this.hover.minimize = true
    },
    onMouseLeave: function () {
      this.hover.close = false
      this.hover.maximize = false
      this.hover.minimize = false
    }
  }
}
</script>
