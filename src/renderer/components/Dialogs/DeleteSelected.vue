<template>
   <v-dialog
    v-model="dialog"
    persistent
    width="500">
    <v-card>
      <v-card-title
        class="grey lighten-2"
        primary-title>
        Delete Folder
      </v-card-title>
      <v-card-text>
        Are you sure about deleting "<strong>{{ options ? options.path : '' }}</strong>"?
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          flat
          @click="hide">
          Close
        </v-btn>
        <v-btn
          color="red"
          flat
          @click="onDelete">
          DELETE
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'delete-selected',
  data () {
    return {
      dialog: false
    }
  },
  computed: mapState({
    active: state => state.config.dialogs.delete.active,
    options: state => state.config.dialogs.delete.options,
    onChangeActive () {
      return this.active
    }
  }),
  watch: {
    onChangeActive (state) {
      if (state) {
        this.show()
      } else {
        this.dialog = false
      }
    }
  },
  methods: {
    ...mapActions(['openDialog', 'closeDialog', 'deleteSelected']),
    show: function () {
      if (this.options && this.options.path) {
        this.dialog = true
      }
    },
    hide: function () {
      this.closeDialog({ name: 'delete' })
    },
    onDelete: function () {
      if (this.options && this.options.path && this.options.prevPath) {
        this.deleteSelected({
          path: this.options.path,
          prevPath: this.options.prevPath
        })
      }
    }
  }
}
</script>

