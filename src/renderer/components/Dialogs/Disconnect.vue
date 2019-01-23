<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="500">
    <v-card>
      <v-card-title
        class="grey lighten-2"
        primary-title>
        Disconnect
      </v-card-title>
      <v-card-text>
        All download/upload operations, if any, will be terminated
        Are you sure you want to disconnect from server?
      </v-card-text>
      <v-card-actions>
          <v-spacer />
          <v-btn
            flat
            @click="hide">
            No
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="onClickYes">
            Yes
          </v-btn>
        </v-card-actions>
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
    active: state => state.config.dialogs.disconnect.active,
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
    ...mapActions(['openDialog', 'closeDialog', 'disconnect', 'cancelAllTransfers']),
    show: function () {
      this.dialog = true
    },
    hide: function () {
      this.closeDialog({ name: 'disconnect' })
    },
    onClickYes: function () {
      const self = this
      this.dialog = false
      this.openDialog({ name: 'persistantLoader' })

      this.cancelAllTransfers().then(() => {
        self.disconnect().then(() => {
          // Go to Auth page
          self.closeDialog({ name: 'persistantLoader' })
          self.$router.replace('auth')
        })
      })
    }
  }
}
</script>
