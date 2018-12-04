<template>
  <div id="app">
    <v-app>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
  const platform = require('os').platform

  export default {
    name: 'dbfs_explorer',
    created () {
      this.$store.dispatch('setConfig', [
        { name: 'platform', data: platform() }
      ])
    }
  }
</script>

<style>
  /* CSS */
  #app { font-family: 'Roboto'; background: transparent; }
  .drag-safe {
    -webkit-app-region: no-drag;
  }
  ::-webkit-scrollbar {
    width: 0px;
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: transparent;
  }
  #application-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: #EAEAEA;
    -webkit-app-region: drag;
    user-select: none;
    z-index: 600;
  }
  #application-bar[small] {
    height: 38px;
  }
  #application-bar > .space-left {
    margin-left: 70px;
  }
  #application-bar .btn {
    color: #383838;
  }
  #sidebar {
    position: fixed;
    top: 60px;
    left: 0;
    bottom: 0;
    width: 300px;
    background: #FFFFFF;
    border-right-style: solid;
    border-right-color: rgba(229, 229, 229, 0.596);
    border-right-width: 1px;
  }
  #sidebar[small] {
    top: 38px;
  }
  #main-content {
    position: fixed;
    top: 60px;
    left: 300px;
    bottom: 0;
    right: 0;
    background: white;
  }
  #main-content[small] {
    top: 38px;
  }
  .layer-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
