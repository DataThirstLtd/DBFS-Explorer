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
  #application-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 60px;
    background: rgba(221, 230, 237, 0.95);
    -webkit-app-region: drag;
    user-select: none;
  }
  #sidebar {
    position: fixed;
    top: 60px;
    left: 0;
    bottom: 0;
    width: 300px;
    background: #F4F5FA;
  }
  #main-content {
    position: fixed;
    top: 60px;
    left: 300px;
    bottom: 0;
    right: 0;
    background: white;
  }
</style>
