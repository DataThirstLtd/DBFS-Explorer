<template>
  <div id="wrapper">
    <!-- layouts -->
    <sidebar :rootFs="rootFs"/>
    <main-content />
    <!-- Dialogs -->
    <new-folder />
    <delete-selected />
  </div>
</template>

<script>
  /**
   * Import Home component dependencies from './Home'
   */
  import { mapState, mapGetters, mapActions } from 'vuex'
  // Import appConfig from '@/app.config.js'
  import Sidebar from './Layouts/Sidebar'
  import CommandBar from './Layouts/CommandBar'
  import MainContent from './Layouts/MainContent'
  // Import dialogs
  import NewFolder from './Dialogs/NewFolder'
  import DeleteSelected from './Dialogs/DeleteSelected'

  export default {
    name: 'home',
    components: {
      Sidebar,
      CommandBar,
      MainContent,
      NewFolder,
      DeleteSelected
    },
    computed: mapState({
      token: state => state.auth.token,
      domain: state => state.auth.domain,
      rootFs: state => state.navigator.rootFs,
      onInit () {
        return Boolean(this.token && this.domain)
      }
    }),
    watch: {
      onInit (state) {
        if (state) {
          this.initHome()
        }
      }
    },
    created () {
      if (this.rootFs.length < 1) {
        if (this.domain && this.token) {
          this.initHome()
        } else {
          this.init()
        }
      }
    },
    methods: {
      ...mapGetters(['doesAuthDataExists']),
      ...mapActions(['init', 'login', 'fetchRootFs', 'clearSelection', 'fetchSelection']),
      initHome: function () {
        const context = this
        this.fetchRootFs({
          domain: this.domain,
          token: this.token
        }).then(() => {
          if (!context.rootFs) {
            console.log('Empty')
          } else {
            context.clearSelection()
            context.fetchSelection({
              path: '/',
              is_dir: true
            })
          }
        }).catch((error) => {
          if (error.message === 'Network Error') {
            context.$router.replace({
              path: '/'
            })
          }
        })
      }
    }
  }
</script>
