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
    <properties />
    <new-folder />
    <delete-selected />
    <data-transfer />
    <transfer-state />
    <app-settings />
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
  import MainContent from './Layouts/MainContent'
  // Import dialogs
  import Properties from './Dialogs/Properties'
  import NewFolder from './Dialogs/NewFolder'
  import DeleteSelected from './Dialogs/DeleteSelected'
  import DataTransfer from './Dialogs/DataTransfer'
  import TransferState from './Dialogs/TransferState'
  import AppSettings from './Dialogs/AppSettings'
  // Import Other Components
  import Drag from './Misc/Drag'
  import Overlay from './Misc/Overlay'

  export default {
    name: 'home',
    components: {
      Sidebar,
      MainContent,
      Properties,
      NewFolder,
      DeleteSelected,
      DataTransfer,
      TransferState,
      AppSettings,
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
      this.fetchSettings()
    },
    methods: {
      ...mapGetters(['doesAuthDataExists']),
      ...mapActions([
        'init',
        'login',
        'fetchRootFs',
        'fetchSettings',
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
