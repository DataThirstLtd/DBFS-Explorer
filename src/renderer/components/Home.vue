<template>
  <div id="wrapper">
    <sidebar :rootFs="rootFs"/>
    <main-content />
  </div>
</template>

<script>
  /**
   * Import Home component dependencies from './Home'
   */
  import { mapState, mapGetters, mapActions } from 'vuex'
  // import appConfig from '@/app.config.js'
  import Sidebar from './Layouts/Sidebar'
  import CommandBar from './Layouts/CommandBar'
  import MainContent from './Layouts/MainContent'

  export default {
    name: 'home',
    components: {
      Sidebar,
      CommandBar,
      MainContent
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
      ...mapActions(['init', 'login', 'fetchRootFs']),
      initHome: function () {
        const context = this
        this.fetchRootFs({
          domain: this.domain,
          token: this.token
        }).then(() => {
          if (!context.rootFs) {
            console.log('Empty')
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
