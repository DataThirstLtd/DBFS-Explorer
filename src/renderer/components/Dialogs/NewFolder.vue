<template>
   <v-dialog
    v-model="dialog"
    persistent
    width="500">
      <v-card>
        <v-card-title
          class="grey lighten-2"
          primary-title>
          Create New Folder
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="path"
            label="Path">
          </v-text-field>
          <v-text-field
            v-model="folderName"
            autofocus
            label="Name of the folder">
          </v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer />
          <v-btn
            flat
            @click="hide">
            Close
          </v-btn>
          <v-btn
            color="primary"
            flat
            @click="onClickNewFolder">
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'

const nodePath = require('path')

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
    selection: state => state.navigator.selection,
    folderEmpty: state => state.navigator.folderEmpty,
    active: state => state.config.dialogs.newFolder.active,
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
      if (this.selection[0]) {
        let path = this.selection[0].path
        this.path = path ? path.split(nodePath.basename(path))[0] : '/'
        this.dialog = true
      } else if (this.folderEmpty.valid) {
        this.path = this.folderEmpty.path
        this.dialog = true
      }
    },
    hide: function () {
      this.closeDialog({ name: 'newFolder' })
    },
    onClickNewFolder: function () {
      const { path, folderName } = this
      if (!(path && folderName)) {
        this.showInfoSnackbar({
          message: 'Incomplete information',
          status: true
        })
        return
      }
      this.createNewFolder({
        path,
        folderName
      })
    }
  }
}
</script>
