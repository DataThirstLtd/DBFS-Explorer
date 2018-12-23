<template>
  <div
    v-if="drag"
    class="page-hero">
    <div class="wrapper">
      <div class="hero">
        <img
          class="indicator"
          src="@/assets/vector/file_upload.svg">
        <h2 class="indicator-info">Drop the file to start uploading</h2>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'drag',
  computed: mapState({
    drag: state => state.config.drag
  })
}
</script>

<style scoped>
  .wrapper {
    width: 600px;
    min-width: 300px;
    height: 300px;
    background: white;
    border-radius: 10px;
  }
  .indicator {
    width: auto;
    height: 200px;
    display: block;
    margin: auto;
  }
  .indicator-info {
    margin-top: 10px;
    text-align: center;
  }
</style>
