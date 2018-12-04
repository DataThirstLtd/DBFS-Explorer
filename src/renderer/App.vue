<template>
  <div id="app">
    <v-app>
      <router-view></router-view>
    </v-app>
  </div>
</template>

<script>
  export default {
    name: 'dbfs_explorer'
  }
</script>

<style>
  /* CSS */
  #app { font-family: 'Roboto'; background: transparent; }
  .drag-safe {
    -webkit-app-region: no-drag;
  }
  #application-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 38px;
    background: #EAEAEA;
    -webkit-app-region: drag;
    user-select: none;
  }
  #application-bar > .wrapper {
    margin-left: 70px;
  }
  #application-bar .btn {
    color: #383838;
  }
  #sidebar {
    position: fixed;
    top: 38px;
    left: 0;
    bottom: 0;
    width: 300px;
    background: #FFFFFF;
    border-right-style: solid;
    border-right-color: rgba(229, 229, 229, 0.596);
    border-right-width: 1px;
  }
  #main-content {
    position: fixed;
    top: 38px;
    left: 300px;
    bottom: 0;
    right: 0;
    background: white;
  }
  .layer-view {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
