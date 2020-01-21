<template>
  <div>
    <explorer
      :list="list"
      :nav-stack="navStack"
      :db-click-file-folder="onOpenFileFolder"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Explorer from '@/components/explorer'

export default {
  layout: 'app',
  middleware: 'auth',
  components: {
    Explorer
  },
  computed: mapState({
    list: state => state.explorer.list,
    navStack: state => state.explorer.navStack
  }),
  methods: {
    ...mapActions(['listFolder']),
    onOpenFileFolder (item) {
      if (item && item.constructor === {}.constructor) {
        if (item.is_dir) {
          this.listFolder({ path: item.path, save: true })
            .catch(err => {
              console.error(err)
              this.$root.$emit('in-app-notify/error', {
                title: 'Failed',
                message: 'Unable to open folder!'
              })
            })
        }
      }
    }
  }
}
</script>
