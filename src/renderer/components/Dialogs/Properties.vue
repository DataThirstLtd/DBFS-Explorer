<template>
   <v-dialog
    v-model="dialog"
    persistent
    width="500">
      <v-card>
        <v-card-title
          class="grey lighten-2"
          primary-title>
          Properties
        </v-card-title>
        <v-card-text
          style="min-height: 300px;">
          <div
            v-if="loading.state"
            class="hero">
            <v-progress-circular
              :size="30"
              :width="2"
              color="primary"
              indeterminate />
          </div>
          <v-list
            v-else
            three-line
            subheader>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>
                  File Name
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ getFileName(info.path) }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>
                  Storage Path
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ info.path }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title>
                  Type
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ info.is_dir ? 'Directory' : 'File' }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-if="!info.is_dir">
              <v-list-tile-content>
                <v-list-tile-title>
                  Size
                </v-list-tile-title>
                <v-list-tile-sub-title
                  v-if="info.file_size">
                  {{ getSize(info.file_size) }}
                </v-list-tile-sub-title>
                <v-list-tile-sub-title
                  v-else>
                  <v-chip
                    label
                    color="red"
                    text-color="white"
                    style="margin: 5px 0;">
                    File corrupted
                  </v-chip>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer />
          <v-btn
            flat
            @click="hide">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
   </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import helper from '@/assets/helper.js'

const nodePath = require('path')

export default {
  name: 'properties',
  data () {
    return {
      dialog: false,
      info: {},
      loading: {
        state: true
      }
    }
  },
  computed: mapState({
    selectedItem: state => state.navigator.selectedItem,
    active: state => state.config.dialogs.properties.active,
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
    ...mapActions(['showInfoSnackbar', 'closeDialog', 'getStatus']),
    show: function () {
      const self = this
      this.dialog = true
      this.loading.state = true
      this.getStatus({
        item: this.selectedItem
      }).then(({data}) => {
        self.loading.state = false
        this.info = data
      }).catch((error) => {
        console.error(error)
      })
    },
    hide: function () {
      this.closeDialog({ name: 'properties' })
    },
    getFileName: function (path) {
      return nodePath.basename(path)
    },
    getSize: function (data) {
      return helper.getReadableFileSize({ size: data })
    }
  }
}
</script>
