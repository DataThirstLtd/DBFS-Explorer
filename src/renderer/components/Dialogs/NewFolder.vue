<template>
   <v-dialog
    v-model="dialog"
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
            label="Name of the folder">
          </v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            @click="dialog = false">
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
    folderEmpty: state => state.navigator.folderEmpty
  }),
  mounted () {
    const context = this
    this.$root.$on('openDialogNewFolder', () => {
      if (context.selection[0]) {
        let path = context.selection[0].path
        context.path = path ? path.split(nodePath.basename(path))[0] : '/'
        context.dialog = true
      } else if (context.folderEmpty.valid) {
        context.path = context.folderEmpty.path
        context.dialog = true
      }
    })
  },
  methods: {
    ...mapActions(['createNewFolder', 'showInfoSnackbar']),
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
      }).then((res) => {
        console.log(res)
      }).catch((error) => {
        console.error(error.code)
      })
    }
  }
}
</script>
