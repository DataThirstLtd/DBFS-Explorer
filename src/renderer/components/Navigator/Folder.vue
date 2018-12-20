<template>
  <div>
    <v-layout row wrap>
      <populate v-for="(item, index) in selection"
      :key="index" :item="item" />
    </v-layout>
  </div>
</template>

<script>
import Populate from '@/components/Navigator/Populate'
export default {
  name: 'folder',
  components: {
    Populate
  },
  props: {
    selection: {
      type: Array,
      required: true
    },
    fetchWait: {
      type: Boolean,
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

