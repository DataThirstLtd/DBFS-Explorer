<template>
  <div id="application-bar" flat small>
    <v-layout align-center row
      fill-height :class="`${getPlatform() === 'darwin' ? 'space-left' : null}`">
      <p class="app-title">
        DBFS-Explorer | {{ $platform }}
      </p>
      <span style="padding: 0 10px">
        {{ routeName }}
      </span>
      <div
        v-if="routeName !== 'auth'">
        <v-tooltip
          v-for="item in buttons.left"
          :key="item.id"
          bottom>
          <v-btn
            :disabled="persistantLoaderState"
            slot="activator"
            class="drag-safe btn"
            icon small light 
            @click="item.callback">
            <v-icon
              small>
              {{ item.icon }}
            </v-icon>
          </v-btn>
          <span>{{ item.tooltip }}</span>
        </v-tooltip>
      </div>
      <v-spacer />
      <div
        v-for="item in buttons.right"
        :key="item.id">
         <v-tooltip
          bottom>
          <v-btn
            v-if="checkPlatform(item) && hiddenOnPage(item)"
            :disabled="persistantLoaderState"
            slot="activator"
            class="drag-safe btn"
            small
            icon
            light
            @click="item.callback">
            <v-icon
              small>
              {{ item.icon }}
            </v-icon>
          </v-btn>
          <span>{{ item.tooltip }}</span>
        </v-tooltip>
      </div>
    </v-layout>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'application-bar',
  props: {
    getPlatform: {
      type: Function,
      required: true
    },
    isLoggedIn: {
      type: Function,
      required: true
    },
    routeName: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      buttons: {
        left: [
          {
            id: 'id-app-download',
            text: 'Download',
            icon: 'fa-download',
            callback: () => { this.toggleDialog({ name: 'transferState' }) },
            platforms: ['darwin', 'win32', 'linux'],
            tooltip: 'Download/Upload Activity',
            hiddenOnPages: ['auth']
          }
        ],
        right: [
          {
            id: 'id-app-settings',
            text: 'Settings',
            icon: 'fa-cog',
            callback: () => { this.openDialog({ name: 'settings' }) },
            platforms: ['darwin', 'win32', 'linux'],
            tooltip: 'Settings',
            hiddenOnPages: ['auth']
          },
          {
            id: 'id-app-load-credentials',
            text: 'Load Credentials',
            icon: 'fa-key',
            callback: this.onClickLoadCredentials,
            platforms: ['darwin', 'win32', 'linux'],
            tooltip: 'Load Credentials',
            hiddenOnPages: ['home']
          },
          {
            id: 'id-app-about',
            text: 'About',
            icon: 'fa-star',
            callback: () => { this.openDialog({ name: 'about' }) },
            platforms: ['darwin', 'win32', 'linux'],
            tooltip: 'About',
            hiddenOnPages: []
          },
          {
            id: 'id-app-logout',
            text: 'Logout',
            icon: 'fa-power-off',
            callback: () => { this.openDialog({ name: 'disconnect' }) },
            platforms: ['darwin', 'win32', 'linux'],
            tooltip: 'Logout',
            hiddenOnPages: ['auth']
          }
        ]
      }
    }
  },
  computed: mapState({
    persistantLoaderState: state => state.config.dialogs.persistantLoader.active
  }),
  methods: {
    ...mapActions(['openDialog', 'toggleDialog', 'loadCredentials']),
    onClickLoadCredentials: function () {
      const self = this
      this.loadCredentials().then(({domain, token}) => {
        self.$root.$emit('shareCredentials', { domain, token })
      })
    },
    maximizeApp: function () {
      this.$electron.remote.getCurrentWindow().maximize()
    },
    minimizeApp: function () {
      this.$electron.remote.getCurrentWindow().minimize()
    },
    closeApp: function () {
      this.$electron.remote.getCurrentWindow().close()
    },
    checkPlatform: function (item) {
      return (item.platforms.findIndex(x => x === this.getPlatform()) > -1)
    },
    hiddenOnPage: function (item) {
      if (item && item.hiddenOnPages &&
      item.hiddenOnPages.constructor === [].constructor &&
      item.hiddenOnPages.length > 0) {
        if (item.hiddenOnPages.indexOf(this.routeName) > -1) {
          return false
        }
      }
      return true
    }
  }
}
</script>
