<template>
  <div
    id="app-downloader"
    :full="full"
    :close="!show"
    class="shadow-2xl z-50 bg-container"
  >
    <div class="absolute top-0 right-0 left-0 h-10">
      <div class="flex h-full items-center bg-accent-one px-3 text-label-one">
        <button
          class="bg-label-one rounded-full p-1 mr-2"
          @click="onClickClose"
        >
          <icon
            :width="9"
            :height="9"
            fill="#000000"
            name="close"
          />
        </button>
        <p>Downloads</p>
        <div class="flex-grow" />
        <button
          class="p-1"
          @click="onClickToggleFull"
        >
          <icon
            v-if="!full"
            :width="18"
            :height="18"
            fill="#888"
            name="arrow-up"
          />
          <icon
            v-else
            :width="18"
            :height="18"
            fill="#888"
            name="arrow-down"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/icon'

export default {
  components: {
    Icon
  },
  props: {
    show: {
      type: Boolean,
      required: true,
      default: () => false
    },
    onClickClose: {
      type: Function,
      required: true,
      default: () => {}
    },
    onClickShow: {
      type: Function,
      required: true,
      default: () => {}
    }
  },
  data () {
    return {
      full: false
    }
  },
  mounted () {
    this.$root.$on('downloader/toggle', () => {
      if (this.show) {
        this.onClickClose()
      } else {
        this.onClickShow()
      }
    })
  },
  methods: {
    onClickToggleFull () {
      this.full = Boolean(!this.full)
    }
  }
}
</script>

<style scoped>
  #app-downloader {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 50%;
    transition: height 0.5s, bottom 0.5s;
  }
  #app-downloader[close] {
    bottom: -100%;
  }
  #app-downloader[full] {
    height: 94%;
  }
</style>
