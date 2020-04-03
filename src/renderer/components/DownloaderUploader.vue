<template>
  <div
    :show="show"
    class="view-wrapper"
  >
    <v-card
      tile
      width="400"
      dark
    >
      <v-card-title
        class="subtitle-2 font-weight-bold primary py-2"
        style="cursor: pointer;"
      >
        Downloader
        <v-spacer />
        <v-btn
          class="mr-1"
          small
          icon
        >
          <v-icon small>
            open_in_new
          </v-icon>
        </v-btn>
        <v-btn
          small
          icon
          @click="onClickClose"
        >
          <v-icon small>
            clear
          </v-icon>
        </v-btn>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      show: false
    }
  },
  mounted () {
    this.$root.$on('downloader-uploader/toggle', this.toggleView)
    this.$root.$on('downloader-uploader/show', this.showView)
    this.$root.$on('downloader-uploader/hide', this.hideView)
    this.$nextTick(() => {
      this.$root.$emit('downloader-uploader/show')
    })
  },
  methods: {
    toggleView () {
      if (this.show) {
        this.$root.$emit('downloader-uplodaer/hide')
      } else {
        this.$root.$emit('downloader-uploader/show')
      }
    },
    onClickClose () {
      this.$root.$emit('downloader-uploaderhide')
    },
    showView () {
      this.show = true
    },
    hideView () {
      this.show = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .view-wrapper {
    position: fixed;
    right: 10px;
    bottom: -100%;
    z-index: 600;
    transition: all 0.2s ease-in-out;
    &[show] {
      bottom: 0;
    }
  }
</style>
