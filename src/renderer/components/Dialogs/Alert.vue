<template>
   <v-dialog
    v-model="dialog"
    persistent
    width="500">
      <v-card>
        <v-card-title
          class="grey lighten-2"
          primary-title>
          {{ alert.options && alert.options.title }}
        </v-card-title>
        <v-card-text>
          {{ alert.options && alert.options.message }}
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer />
          <v-btn
            flat
            @click="hide">
            OK
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
      title: '',
      message: ''
    }
  },
  computed: mapState({
    alert: state => state.config.dialogs.alert,
    active: state => state.config.dialogs.alert.active,
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
    ...mapActions(['createNewFolder', 'showInfoSnackbar', 'closeDialog']),
    show: function () {
      this.dialog = true
    },
    hide: function () {
      this.closeDialog({ name: 'alert' })
    }
  }
}
</script>
