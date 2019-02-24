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
          style="height: 450px; overflow-y: auto;">
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
            v-else-if="selectedItem.length === 1"
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
          <div
            v-else>
            <div
              v-for="(item, index) in infoList"
              :key="`infolist-${index}`"
              class="multi-list">
              <v-list
                style="background: transparent;"
                two-line
                subheader>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      File Name
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{ getFileName(item.data.path) }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      Storage Path
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{ item.data.path }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      Type
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{ item.data.is_dir ? 'Directory' : 'File' }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>
                      Size
                    </v-list-tile-title>
                    <v-list-tile-sub-title>
                      {{ getSize(item.data.file_size) }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </div>
          </div>
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
const forEach = require('async-foreach').forEach

export default {
  name: 'properties',
  data () {
    return {
      dialog: false,
      infoList: [],
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
      if (this.selectedItem.length === 1) {
        this.getStatus({
          item: this.selectedItem
        }).then(({ data }) => {
          self.loading.state = false
          this.info = data
        }).catch((error) => {
          console.error(error)
        })
      } else {
        forEach(this.selectedItem, function (selected) {
          const asyncDone = this.async()
          self.getStatus({
            item: selected
          }).then(({ data }) => {
            self.infoList.push({
              data
            })
            asyncDone()
          }).catch(() => {
            asyncDone()
          })
        }, function () {
          self.loading.state = false
        })
      }
    },
    hide: function () {
      this.infoList = []
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

<style scoped>
  .multi-list {
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
