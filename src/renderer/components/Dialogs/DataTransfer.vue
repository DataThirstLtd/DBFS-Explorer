<template>
  <v-dialog
    v-model="dialog"
    persistent
    width="500">
    <v-card>
      <v-card-title
        class="headline grey lighten-3">
        Confirm {{ (options && options.type > -1) ? options.type
          ? 'Uploading' : 'Downloading'
          : 'Downloading (or) Uploading' 
        }} Files/Folders
      </v-card-title>
      <v-card-text>
        <div class="scrollable-content">
          <v-list
            v-if="options"
            subheader
            three-line>
            <v-list-tile
              v-for="item in options.list"
              :key="item.id"
              @click="onToggleSelection(item)">
              <v-list-tile-action>
                <v-checkbox
                  readonly
                  :input-value="true"
                  :value="item.selected"
                  color="black">
                </v-checkbox>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>{{ item.file.name }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.file.path }}</v-list-tile-sub-title>
                <v-list-tile-sub-title>{{ getSize(item.file.size) }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </div>
      </v-card-text>
      <v-card-text
        v-if="(options && options.type > -1) && options.type">
        <v-text-field
          v-model="path"
          value="/"
          label="Path of the new file">
        </v-text-field>
      </v-card-text> 
      <v-card-actions>
        <v-spacer />
        <v-btn
          flat
          color="black"
          @click="dialog = false">
          Cancel
        </v-btn>
        <v-btn
          depressed
          color="primary"
          @click="onContinue">
          {{
            (options && options.type > -1) ? options.type
              ? 'Upload' : 'Download'
              : 'Continue'
          }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import helper from '@/assets/helper.js'

export default {
  name: 'data-transfer',
  data () {
    return {
      dialog: false,
      path: '/'
    }
  },
  computed: mapState({
    active: state => state.config.dialogs.dataTransfer.active,
    options: state => state.config.dialogs.dataTransfer.options,
    onActiveChange: function () {
      return this.active
    },
    onDialogChange: function () {
      return this.dialog
    }
  }),
  watch: {
    onActiveChange: function (state) {
      this.dialog = state
      if (state) {
        this.path = this.options.toPath
      }
    },
    onDialogChange: function (state) {
      if (!state) {
        this.closeDialog({ name: 'dataTransfer' })
      }
    }
  },
  methods: {
    ...mapActions([
      'closeDialog',
      'openDialog',
      'toggleListDataTransfer',
      'prepareUpload',
      'prepareDownload'
    ]),
    getSize: function (data) {
      return helper.getReadableFileSize({ size: data })
    },
    onToggleSelection: function ({ id }) {
      this.toggleListDataTransfer({ id })
    },
    onContinue: function () {
      if ((this.options && this.options.type > -1) && this.options.type === 1) {
        this.prepareUpload({
          options: this.options,
          path: this.path
        })
      } else {
        this.prepareDownload({
          options: this.options
        })
      }
      this.closeDialog({ name: 'dataTransfer' })
      this.openDialog({
        name: 'transferState'
      })
    }
  }
}
</script>

<style scoped>
  .scrollable-content {
    min-height: 100px;
    max-height: 300px;
    overflow: auto;
  }
  ::-webkit-scrollbar {
    width: 10px;
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.226);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.692);
  }
</style>
