<template>
  <div>
    <v-layout row>
      <div v-if="'ready' in list && !list.ready">
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
    </v-layout>
    <div class="hero-x">
      Empty
    </div>
  </div>
</template>

<script>
export default {
  name: 'folder',
  props: {
    list: {
      type: Object,
      required: true
    }
  },
  methods: {
    isReady: function () {
      let targetIndex = this.buffer.findIndex(x => x.data.path === this.selection.path)
      if (targetIndex > -1) {
        return this.buffer[targetIndex].data.ready
      }
      return false
    }
  }
}
</script>

