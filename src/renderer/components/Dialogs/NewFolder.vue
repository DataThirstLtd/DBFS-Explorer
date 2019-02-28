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
    navStack: state => state.navigator.navStack,
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
  mounted () {
    const self = this
    document.body.addEventListener('keyup', (e) => {
      if (self.dialog && e.keyCode === 13) {
        self.onClickNewFolder()
      }
    })
  },
  methods: {
    ...mapActions(['createNewFolder', 'showInfoSnackbar', 'closeDialog']),
    show: function () {
      this.path = `/${this.navStack.join('/')}`
      this.dialog = true
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
      this.folderName = ''
      this.path = ''
    }
  }
}
</script>
