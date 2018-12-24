<template>
  <div id="wrapper"
    @click="onClickHome"
    @dragover="showDrag"
    @dragleave="hideDrag"
    @drop="dropFile">
    <!-- layouts -->
    <sidebar :rootFs="rootFs"/>
    <main-content />
    <!-- Dialogs -->
    <about />
    <new-folder />
    <delete-selected />
    <data-transfer />
    <!-- Misc -->
    <drag />
    <overlay />
  </div>
</template>

<script>
  /**
   * Import Home component dependencies from './Home'
   */
  import { mapState, mapGetters, mapActions } from 'vuex'
  import helper from '@/assets/helper.js'
  // Import appConfig from '@/app.config.js'
  import Sidebar from './Layouts/Sidebar'
  import CommandBar from './Layouts/CommandBar'
  import MainContent from './Layouts/MainContent'
  // Import dialogs
  import About from './Dialogs/About'
  import NewFolder from './Dialogs/NewFolder'
  import DeleteSelected from './Dialogs/DeleteSelected'
  import DataTransfer from './Dialogs/DataTransfer'
  // Import Other Components
  import Drag from './Misc/Drag'
  import Overlay from './Misc/Overlay'

  export default {
    name: 'home',
    components: {
      Sidebar,
      CommandBar,
      MainContent,
      About,
      NewFolder,
      DeleteSelected,
      DataTransfer,
      Drag,
      Overlay
    },
    computed: mapState({
      token: state => state.auth.token,
      domain: state => state.auth.domain,
      rootFs: state => state.navigator.rootFs,
      selectedItem: state => state.navigator.selectedItem,
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
      ...mapActions([
        'init',
        'login',
        'fetchRootFs',
        'clearSelection',
        'fetchSelection',
        'clearItem',
        'showDrag',
        'hideDrag',
        'dropFile'
      ]),
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
      },
      onClickHome: function (ev) {
        if (
          !(ev.target &&
          (helper.hasSomeParentTheClass(ev.target, 'ig-selected-item-wrapper') ||
          helper.hasSomeParentTheClass(ev.target, 'ig-folder-actions-button')))
        ) {
          if (this.selectedItem) {
            this.clearItem()
          }
        }
      }
    }
  }
</script>
