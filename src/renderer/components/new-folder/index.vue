<template>
  <div
    id="new-folder-view"
    :show="show"
    class="bg-accent-one shadow-2xl rounded-sm px-3 py-3 mr-2"
  >
    <div class="flex h-5 items-center">
      <button
        class="w-auto no-drag p-1 mt-1 bg-transparent rounded-full"
        @click="onClickClose"
      >
        <icon
          :width="12"
          :height="12"
          fill="#a1a1a1"
          name="close"
        />
      </button>
      <p class="text-white text-sm ml-1 text-label-one" style="margin-top: 2.8px;">
        Create a new folder
      </p>
    </div>
    <div class="flex w-full h-6 items-center mt-4">
      <input
        id="new-folder-view-input"
        v-model="name"
        class="bg-accent-two w-full px-2 h-full text-white rounded-sm text-xs"
        placeholder="Enter name of the folder"
      >
      <button
        class="bg-primary px-2 h-full text-xs rounded-sm text-white ml-2"
        @click="onClickCreate"
      >
        CREATE
      </button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import Icon from '@/components/icon'

const path = require('path')

export default {
  components: {
    Icon
  },
  data () {
    return {
      show: false,
      name: ''
    }
  },
  computed: mapState({
    navStack: state => state.explorer.navStack,
    onChangeShow () {
      return this.show
    }
  }),
  watch: {
    onChangeShow (show) {
      if (!show) {
        this.name = ''
      } else {
        this.focusInput()
      }
    }
  },
  mounted () {
    this.$root.$on('new-folder/toggle', () => {
      if (this.show) {
        this.closeView()
      } else {
        this.openView()
      }
    })
    window.addEventListener('keyup', e => {
      if (this.show && e.keyCode === 27) {
        this.closeView()
      }
    })
  },
  methods: {
    ...mapActions(['createFolder']),
    onClickCreate () {
      const name = this.name

      // validate data
      if (!(name && this.navStack)) {
        return
      }

      // construct path
      const newFolderPath = path.join(
        this.navStack.join('/'),
        name
      )

      if (name) {
        this.createFolder({ path: newFolderPath }).catch(err => {
          this.$root.$emit('in-app-notify/error', {
            title: 'Failed to create folder',
            message: 'Unable to create folder. Please try again later.'
          })
        })
      }
    },
    onClickClose () {
      this.closeView()
    },
    closeView () {
      this.show = false
    },
    openView () {
      this.show = true
    },
    focusInput () {
      const inputEle = document.getElementById('new-folder-view-input')
      if (inputEle) {
        inputEle.focus()
        console.log('focus')
      }
    }
  }
}
</script>

<style scoped>
  #new-folder-view {
    position: fixed;
    top: 2.5rem;
    right: -100%;
    height: auto;
    width: 18rem;
    transition: right 0.2s;
  }
  #new-folder-view[show] {
    right: 0;
  }
</style>
