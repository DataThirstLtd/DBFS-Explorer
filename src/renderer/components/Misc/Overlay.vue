<template>
  <div
    v-if="drag"
    class="page-overlay">
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'overlay',
  computed: mapState({
    drag: state => state.config.drag
  })
}
</script>
