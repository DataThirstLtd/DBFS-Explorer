<template>
  <div :class="{
    'title-bar': true,
    'bg-container': !transparent,
    'text-xs': true,
    'text-white': true
  }"
  >
    <div v-if="platform === 'win32'" class="flex h-full items-center">
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
    <div v-else-if="platform === 'darwin' && menu" class="flex h-full items-center">
      <button
        class="h-6 no-drag px-2 bg-accent-two ml-20 mx-1 rounded-sm"
        @click="onClickDownloader"
      >
        <icon
          :width="13"
          :height="13"
          fill="#ffffff"
          name="download"
        />
      </button>
      <button
        class="h-6 no-drag px-2 bg-accent-two rounded-sm mx-1 cursor-pointer"
      >
        <icon
          :width="13"
          :height="13"
          fill="#ffffff"
          name="add-folder"
        />
      </button>
      <div class="flex-grow" />
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
  props: {
    transparent: {
      type: Boolean,
      required: false,
      default: () => false
    },
    menu: {
      type: Boolean,
      required: false,
      default: () => false
    }
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
    onClickMinimize () {
      remote.getCurrentWindow().minimize()
    },
    onClickMaximize () {
      if (remote.getCurrentWindow().isMaximized()) {
        remote.getCurrentWindow().unmaximize()
      } else {
        remote.getCurrentWindow().maximize()
      }
    },
    onClickClose () {
      remote.getCurrentWindow().close()
    },
    onMouseEnterClose () {
      this.hover.close = true
    },
    onMouseEnterMaximize () {
      this.hover.maximize = true
    },
    onMouseEnterMinimize () {
      this.hover.minimize = true
    },
    onMouseLeave () {
      this.hover.close = false
      this.hover.maximize = false
      this.hover.minimize = false
    },
    onClickDownloader: function () {
      this.$root.$emit('downloader/toggle')
    }
  }
}
</script>
