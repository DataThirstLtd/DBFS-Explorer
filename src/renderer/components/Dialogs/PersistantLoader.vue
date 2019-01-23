<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="500">
    <v-card>
      <v-card-title
        class="grey lighten-2"
        primary-title>
        Pleae wait ...
      </v-card-title>
      <v-card-text>
        <v-progress-circular
          :size="50"
          class="hero-x"
          color="primary"
          indeterminate>
        </v-progress-circular>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'new-folder',
  data () {
    return {
      dialog: false,
      folderName: '',
      path: ''
    }
  },
  computed: mapState({
    active: state => state.config.dialogs.persistantLoader.active,
    onChangeActive: function () {
      return this.active
    }
  }),
  watch: {
    onChangeActive: function (state) {
      if (state) {
        this.show()
      } else {
        this.dialog = false
      }
    }
  },
  methods: {
    ...mapActions(['closeDialog']),
    show: function () {
      this.dialog = true
    },
    hide: function () {
      this.closeDialog({ name: 'persistantLoader' })
    }
  }
}
</script>
