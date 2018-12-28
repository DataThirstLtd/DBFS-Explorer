<template>
  <div id="application-bar" flat small>
    <v-layout align-center row
      fill-height :class="`${getPlatform() === 'darwin' ? 'space-left' : null}`">
      <p class="app-title">
        DBFS-Explorer
      </p>
      <span style="padding: 0 10px">
        {{ routeName }}
      </span>
      <v-btn v-if="routeName !== 'auth'"
        v-for="item in buttons.left" small
        :key="item.id" @click="item.callback"
        icon light class="drag-safe btn">
        <v-icon small>{{ item.icon }}</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn
        v-for="item in buttons.right" small
        :key="item.id" @click="item.callback"
        v-if="(item.platforms.findIndex(x => x === getPlatform()) > -1)"
        icon light class="drag-safe btn">
        <v-icon small>{{ item.icon }}</v-icon>
      </v-btn>
    </v-layout>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

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
          { id: 'id-app-connect', text: 'Connect', icon: 'fa-cloud', callback: this.connect, platforms: ['darwin', 'win32', 'linux'] },
          { id: 'id-app-download', text: 'Download', icon: 'fa-download', callback: () => { this.toggleDialog({ name: 'transferState' }) }, platforms: ['darwin', 'win32', 'linux'] }
        ],
        right: [
          { id: 'id-app-about', text: 'About', icon: 'fa-star', callback: () => { this.openDialog({ name: 'about' }) }, platforms: ['darwin', 'win32', 'linux'] },
          { id: 'id-app-logout', text: 'Logout', icon: 'fa-power-off', callback: () => { console.log(this.isLoggedIn()) }, platforms: ['darwin', 'win32', 'linux'] }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['openDialog', 'toggleDialog']),
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
