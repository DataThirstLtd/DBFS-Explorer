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
      <div
        v-if="routeName !== 'auth'">
          <v-btn
            v-for="item in buttons.left" small
            :key="item.id" @click="item.callback"
            icon light class="drag-safe btn">
            <v-tooltip
              bottom>
              <v-icon
                slot="activator"
                small>
                  {{ item.icon }}
                </v-icon>
              <span>{{ item.tooltip }}</span>
            </v-tooltip>
          </v-btn>
      </div>
      <v-spacer />
      <div
        v-for="item in buttons.right"
        :key="item.id">
        <v-btn
          v-if="checkPlatform(item)"
          class="drag-safe btn"
          small
          icon
          light
          @click="item.callback">
          <v-tooltip
            bottom>
            <v-icon
              slot="activator"
              small>
                {{ item.icon }}
              </v-icon>
            <span>{{ item.tooltip }}</span>
          </v-tooltip>
        </v-btn>
      </div>
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
          {
            id: 'id-app-download',
            text: 'Download',
            icon: 'fa-download',
            callback: () => { this.toggleDialog({ name: 'transferState' }) },
            platforms: ['darwin', 'win32', 'linux'],
            tooltip: 'Download/Upload Activity'
          }
        ],
        right: [
          {
            id: 'id-app-about',
            text: 'About',
            icon: 'fa-star',
            callback: () => { this.openDialog({ name: 'about' }) },
            platforms: ['darwin', 'win32', 'linux'],
            tooltip: 'About'
          },
          {
            id: 'id-app-logout',
            text: 'Logout',
            icon: 'fa-power-off',
            callback: () => { console.log(this.isLoggedIn()) },
            platforms: ['darwin', 'win32', 'linux'],
            tooltip: 'Logout'
          }
        ]
      }
    }
  },
  methods: {
    ...mapActions(['openDialog', 'toggleDialog']),
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
    }
  }
}
</script>
