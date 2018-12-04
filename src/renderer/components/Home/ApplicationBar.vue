<template>
  <div id="application-bar" flat
    :white="$store.state.config.auth.dialog.status"
    :small="platform === 'darwin'">
    <v-layout align-center row
      fill-height :class="`${platform === 'darwin' ? 'space-left' : null}`">
      <p v-if="platform !== 'darwin'" class="app-title">DBFS-Explorer</p>
      <v-btn v-if="!$store.state.config.auth.dialog.status"
        v-for="item in buttons.left" small
        :key="item.id" @click="item.callback"
        icon light class="drag-safe btn">
        <v-icon small>{{ item.icon }}</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn v-for="item in buttons.right" small
        :key="item.id" @click="item.callback"
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
          { id: 'id-app-connect', text: 'Connect', icon: 'fa-cloud', callback: this.connect },
          { id: 'id-app-download', text: 'Download', icon: 'fa-download', callback: () => {} },
          { id: 'id-app-delete', text: 'Delete', icon: 'fa-trash', callback: () => {} }
        ],
        right: [
          { id: 'id-app-about', text: 'About', icon: 'fa-star', callback: () => {} },
          { id: 'id-app-maximize', text: 'About', icon: 'fa-window-maximize', callback: () => {} },
          { id: 'id-app-minimize', text: 'About', icon: 'fa-minus', callback: () => {} },
          { id: 'id-app-close', text: 'About', icon: 'fa-times', callback: () => {} }
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
    }
  }
}
</script>
