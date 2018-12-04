<template>
  <div id="application-bar" flat small
    :white="$store.state.config.dialog.auth.status">
    <v-layout align-center row
      fill-height :class="`${platform === 'darwin' ? 'space-left' : null}`">
      <p v-if="$store.state.config.dialog.auth.status" class="app-title">
        DBFS-Explorer : Authentication
      </p>
      <v-btn v-if="!$store.state.config.dialog.auth.status"
        v-for="item in buttons.left" small
        :key="item.id" @click="item.callback"
        icon light class="drag-safe btn">
        <v-icon small>{{ item.icon }}</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn
        v-for="item in buttons.right" small
        :key="item.id" @click="item.callback"
        v-if="(item.platforms.findIndex(x => x === platform) > -1)"
        icon light class="drag-safe btn">
        <v-icon small>{{ item.icon }}</v-icon>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'application-bar',
  data () {
    return {
      buttons: {
        left: [
          { id: 'id-app-connect', text: 'Connect', icon: 'fa-cloud', callback: this.connect, platforms: ['darwin', 'win32', 'linux'] },
          { id: 'id-app-download', text: 'Download', icon: 'fa-download', callback: () => {}, platforms: ['darwin', 'win32', 'linux'] },
          { id: 'id-app-delete', text: 'Delete', icon: 'fa-trash', callback: () => {}, platforms: ['darwin', 'win32', 'linux'] }
        ],
        right: [
          { id: 'id-app-about', text: 'About', icon: 'fa-star', callback: () => {}, platforms: ['darwin', 'win32', 'linux'] },
          { id: 'id-app-maximize', text: 'Maximize', icon: 'fa-window-maximize', callback: this.maximizeApp, platforms: ['win32', 'linux'] },
          { id: 'id-app-minimize', text: 'Minimize', icon: 'fa-minus', callback: this.minimizeApp, platforms: ['win32', 'linux'] },
          { id: 'id-app-close', text: 'Close', icon: 'fa-times', callback: this.closeApp, platforms: ['win32', 'linux'] }
        ]
      }
    }
  },
  computed: mapState({
    platform: state => state.config.platform
  }),
  methods: {
    connect: function () {
      console.log('on Click Connect')
    },
    maximizeApp: function () {
      this.$electron.remote.getCurrentWindow().maximize()
    },
    minimizeApp: function () {
      this.$electron.remote.getCurrentWindow().minimize()
    },
    closeApp: function () {
      this.$electron.remote.getCurrentWindow().close()
    }
  }
}
</script>
