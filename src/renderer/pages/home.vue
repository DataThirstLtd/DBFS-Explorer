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
  mounted () {
    this.$root.$emit('loader/show')
    this.$nextTick(() => {
      this.listFolder({ path: '/', setList: true })
        .finally(() => {
          this.$root.$emit('loader/hide')
        })
    })
  },
  methods: {
    ...mapActions(['listFolder']),
    onOpenFileFolder (item) {
      console.log(item)
      if (item && item.constructor === {}.constructor) {
        if (item.is_dir) {
          this.listFolder({ path: item.path, setList: true })
        }
      }
    }
  }
}
</script>
