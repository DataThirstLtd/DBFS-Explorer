<template>
  <v-list-tile>
    <thread-count
      v-if="item.key === 'thread-count'"
      :item="item"
      :onUpdateField="onUpdateField"
      :settings="settings" />
  </v-list-tile>
</template>

<script>
import ThreadCount from './ThreadCount'

export default {
  props: {
    item: {
      type: Object,
      required: true
    },
    settings: {
      type: Array,
      required: true
    },
    onUpdateField: {
      type: Function,
      required: true
    }
  },
  components: {
    ThreadCount
  }
}
</script>

