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
    top: 1px;
    left: 0;
    right: 0;
    height: 60px;
    background: #EAEAEA;
    -webkit-app-region: drag;
    user-select: none;
    z-index: 500;
  }
  #application-bar[small] {
    height: 38px;
  }
  #application-bar[white] {
    background: #FFFFFF;
  }
  #application-bar > .space-left {
    margin-left: 70px;
  }
  #application-bar .btn {
    color: #383838;
  }
  #application-bar .app-title {
    font-family: 'Roboto-Medium';
    font-size: 14px;
    padding: 0 10px;
  }
  #sidebar {
    position: fixed;
    top: 61px;
    left: 0;
    bottom: 0;
    width: 300px;
    background: #FFFFFF;
    border-right-style: solid;
    border-right-color: rgba(229, 229, 229, 0.596);
    border-right-width: 1px;
  }
  #sidebar[small] {
    top: 39px;
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
    top: 39px;
  }
  .hero {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
