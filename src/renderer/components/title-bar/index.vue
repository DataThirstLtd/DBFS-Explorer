<template>
  <div :class="{
    'title-bar': true,
    'bg-container': !transparent,
    'text-xs': true,
    'text-white': true
  }"
  >
    <div v-if="platform === 'win32'" class="flex h-full items-center">
      <div class="px-3">
        DBFS-Explorer
      </div>
      <div class="flex-grow" />
      <button
        class="h-full no-drag px-4 bg-transparent hover:bg-hover-one cursor-pointer"
        @mouseenter="onMouseEnterMinimize"
        @mouseleave="onMouseLeave"
        @click="onClickMinimize"
      >
        <icon
          :width="13"
          :height="13"
          :fill="hover.minimize ? '#ffffff' : '#a1a1a1'"
          name="minimize"
        />
      </button>
      <button
        class="h-full no-drag px-4 bg-transparent hover:bg-hover-one cursor-pointer"
        @mouseenter="onMouseEnterMaximize"
        @mouseleave="onMouseLeave"
        @click="onClickMaximize"
      >
        <icon
          :width="13"
          :height="13"
          :fill="hover.maximize ? '#ffffff' : '#a1a1a1'"
          name="maximize"
        />
      </button>
      <button
        class="h-full no-drag px-4 bg-transparent hover:bg-red-700 cursor-pointer"
        @mouseenter="onMouseEnterClose"
        @mouseleave="onMouseLeave"
        @click="onClickClose"
      >
        <icon
          :width="13"
          :height="13"
          :fill="hover.close ? '#ffffff' : '#a1a1a1'"
          name="close"
        />
      </button>
    </div>
    <div v-else-if="platform === 'darwin'" class="h-full">
      <div v-if="menu" class="flex h-full items-center">
        <button
          class="h-6 no-drag px-2 bg-accent-two ml-20 mx-1 rounded-sm"
          @click="onClickDownloader"
        >
          <icon
            :width="13"
            :height="13"
            fill="#ffffff"
            name="download"
          />
        </button>
        <button
          class="h-6 no-drag px-2 bg-accent-two rounded-sm mx-1 cursor-pointer"
          @click="onClickNewFolder"
        >
          <icon
            :width="13"
            :height="13"
            fill="#ffffff"
            name="add-folder"
          />
        </button>
        <div class="flex-grow" />
        <button
          class="h-6 no-drag px-2 bg-accent-two rounded-sm mx-1 cursor-pointer mr-2"
          @click="onClickSignOut"
        >
          <icon
            :width="13"
            :height="13"
            fill="#ffffff"
            name="stand-by"
          />
        </button>
      </div>
      <div v-if="authMenu" class="flex h-full items-center">
        <div class="flex-grow" />
        <button
          class="h-full no-drag px-3 bg-container rounded-sm"
          @click="onClickSelectCredentials"
        >
          <icon
            :width="13"
            :height="13"
            fill="#ffffff"
            name="key"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { remote } from 'electron'
import Icon from '@/components/icon'
import { buildMenu, messageBox } from '@/utils'

const idPrefixMenuItem = 'title-bar-key-no-credentials-index'
var menuCredentials = null

function getdefaultStates () {
  return {
    platform: require('os').platform(),
    credentials: [],
    hover: {
      close: false,
      maximize: false,
      minimize: false
    }
  }
}

export default {
  components: {
    Icon
  },
  props: {
    transparent: {
      type: Boolean,
      required: false,
      default: () => false
    },
    menu: {
      type: Boolean,
      required: false,
      default: () => false
    },
    authMenu: {
      type: Boolean,
      required: false,
      default: () => false
    }
  },
  data () {
    return getdefaultStates()
  },
  created () {
    const self = this
    const _credentialsFound = function (data) {
      let menuItems = []
      data.forEach((item, index) => {
        menuItems.push({
          id: `title-bar-key-no-credentials-index-${index}`,
          label: item.domain,
          callback: () => {
            self.fillCredentialsById(`${idPrefixMenuItem}-${index}`)
          }
        })
      })
      menuCredentials = buildMenu(menuItems)
    }
    const _noCredentialsFound = function () {
      menuCredentials = buildMenu([
        {
          id: 'title-bar-key-no-credentials',
          label: 'No credentials found',
          callback: () => {},
          enabled: false
        }
      ])
    }
    this.readCredentials()
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          // update credentials
          this.credentials = Object.assign([], data)
          _credentialsFound(data)
        } else {
          _noCredentialsFound()
        }
      })
      .catch(err => {
        // eslint-disable-next-line no-console
        console.error(err)
        _noCredentialsFound()
      })
  },
  methods: {
    ...mapActions(['readCredentials', 'signOut']),
    fillCredentialsById (id) {
      const ti = this.credentials.findIndex((x, index) => `${idPrefixMenuItem}-${index}` === id)
      if (ti > -1) {
        this.$root.$emit('sign-in/fill-credentials', this.credentials[ti])
      }
    },
    onClickNewFolder () {
      this.$root.$emit('new-folder/toggle')
    },
    onClickMinimize () {
      remote.getCurrentWindow().minimize()
    },
    onClickMaximize () {
      if (remote.getCurrentWindow().isMaximized()) {
        remote.getCurrentWindow().unmaximize()
      } else {
        remote.getCurrentWindow().maximize()
      }
    },
    onClickClose () {
      remote.getCurrentWindow().close()
    },
    onMouseEnterClose () {
      this.hover.close = true
    },
    onMouseEnterMaximize () {
      this.hover.maximize = true
    },
    onMouseEnterMinimize () {
      this.hover.minimize = true
    },
    onMouseLeave () {
      this.hover.close = false
      this.hover.maximize = false
      this.hover.minimize = false
    },
    onClickDownloader () {
      this.$root.$emit('downloader/toggle')
    },
    onClickSelectCredentials (e) {
      if (menuCredentials) {
        menuCredentials.popup({
          window: remote.getCurrentWindow(),
          y: e.y + 20
        })
      }
    },
    onClickSignOut () {
      const self = this
      messageBox({
        type: 'warning',
        title: 'Sign Out',
        message: 'You are about to signout from the DBFS explorer account.',
        detail: 'Are you sure you want to signout?',
        pButtonCallback: () => {
          self.onSignOut()
        }
      })
    },
    onSignOut () {
      this.signOut()
      this.$router.replace({ path: '/sign-in' })
    }
  }
}
</script>
