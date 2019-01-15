<template>
  <div id="wrapper"
    @click="onClickHome"
    @dragover="platform !== 'win32' && showDrag"
    @dragleave="platform !== 'win32' && hideDrag"
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
  import appConfig from '@/app.config.js'

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
      settings: state => state.config.settings,
      platform: state => state.config.platform,
      onInit () {
        return Boolean(this.token && this.domain)
      },
      onSettingsChange () {
        return this.settings
      }
    }),
    watch: {
      onInit: function (state) {
        console.log('onInit', state)
        if (state) {
          this.initHome()
        }
      },
      onSettingsChange: function (settings) {
        console.log('onSettingsChange', settings)
        if (settings && settings.constructor === [].constructor) {
          // If thread-count in settings
          const targetIndex = settings.findIndex(x => x.key === 'thread-count')
          if (targetIndex > -1) {
            this.initTransferActivity({
              threadCount: settings[targetIndex].value || appConfig.defaultThreadCount
            })
          } else {
            this.initTransferActivity({
              threadCount: appConfig.defaultThreadCount
            })
          }
        }
      }
    },
    mounted () {
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
        'dropFile',
        'initTransferActivity'
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
