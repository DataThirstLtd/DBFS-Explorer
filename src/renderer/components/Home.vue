<template>
  <div id="wrapper">
    <sidebar />
    <main-content />
  </div>
</template>

<script>
  /**
   * Import Home component dependencies from './Home'
   */
  import { mapState, mapGetters } from 'vuex'
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
      onTokenChange () {
        return this.token
      }
    }),
    watch: {
      onTokenChange (token) {
        if (this.doesAuthDataExists()) {
          console.log(this.token, this.domain)
        }
      }
    },
    methods: {
      ...mapGetters(['doesAuthDataExists']),
      init: function () {
      }
    }
  }
</script>
