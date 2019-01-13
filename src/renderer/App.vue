<template>
  <div id="app">
    <v-app>
      <application-bar
        :getPlatform="getPlatform"
        :isLoggedIn="isLoggedIn"
        :routeName="routeName"/>
      <router-view></router-view>
      <info-snackbar />
      <about />
      <alert />
    </v-app>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import ApplicationBar from '@/components/Layouts/ApplicationBar'
  import InfoSnackbar from '@/components/Misc/InfoSnackbar'
  import About from '@/components/Dialogs/About'
  import Alert from '@/components/Dialogs/Alert'

  export default {
    name: 'dbfs_explorer',
    data () {
      return {
        routeName: this.$router.currentRoute.name
      }
    },
    components: {
      ApplicationBar,
      InfoSnackbar,
      About,
      Alert
    },
    methods: {
      ...mapActions(['init']),
      ...mapGetters(['isLoggedIn', 'getPlatform'])
    },
    watch: {
      $route (to, from) {
        this.routeName = to.name
      }
    },
    mounted () {
      document.addEventListener('dragover', event => event.preventDefault())
      document.addEventListener('drop', event => event.preventDefault())
    }
  }
</script>

<style>
  /* CSS */
  #app { font-family: 'Roboto'; background: transparent; user-select: none; }
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
  .light-text {
    font-family: 'Roboto-Light'
  }
  #application-bar {
    position: fixed;
    top: 1px;
    left: 0;
    right: 0;
    height: 60px;
    background: #FFFFFF;
    -webkit-app-region: drag;
    user-select: none;
    border-bottom-style: solid;
    border-bottom-color: rgba(155, 151, 151, 0.411);
    border-bottom-width: 1px;
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
    margin: 10px 0;
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
  #command-bar {
    position: fixed;
    top: 60px;
    right: 0;
    bottom: 0;
    width: 40px;
    background: #FFFFFF;
    border-left-style: solid;
    border-left-color: rgba(229, 229, 229, 0.596);
    border-left-width: 1px;
  }
  #command-bar[small] {
    top: 39px;
  }
  #command-bar > .wrapper {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  #command-bar > .wrapper .command {
    margin: 5px 0;
  }
  .hero {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .hero-x {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  .page-hero {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 600;
  }
  .page-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.623);
  }
  .wrapper {
    padding: 10px;
  }
</style>
