<template>
  <div>
    <v-list three-line>
      <template v-for="(item, index) in transferList">
        <v-list-tile
          :key="item.transferId"
          avatar
          @click="">
          <v-list-tile-avatar>
            <v-icon
              v-if="item.abort"
              class="error"
              color="white">
              fa-times
            </v-icon>
            <v-icon
              v-else-if="item.done"
              class="success"
              color="white">
              fa-check
            </v-icon>
            <v-progress-circular
              v-else
              :indeterminate="item.progress === 0 && item.started"
              :width="10"
              :size="150"
              :value="item.progress"
              color="primary">
              <span style="font-size: 10px;">{{`${item.progress}%`}}</span>
            </v-progress-circular>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title
              v-html="
              `<strong style='padding-right: 20px;'>
                ${item.abort ?
                  `Cancelled ${item.type ? 'Upload' : 'Download'}`
                  : item.done
                  ? `Completed ${item.type ? 'Upload' : 'Download'} of ${getSize(item.file.size)}`
                  : item.type ? `Uploading ${item.progress}% of ${getSize(item.file.size)}`
                  : `Downloading ${item.progress}% ${getSize(item.file.size) || ''}`}
                </strong>
                <b>Downloading from</b> - ${item.file.path}`
              "/>
            <v-list-tile-sub-title>
              <b>Downloading into</b> - {{ item.targetPath }}
            </v-list-tile-sub-title>
            <v-progress-linear
              v-if="!item.abort && item.started"
              :value="item.progress"
              :indeterminate="item.progress === 0">
            </v-progress-linear>
            <v-list-tile-sub-title
              v-else>
             {{ item.abort ? 'Canceled' : ' Waiting ...' }}
            </v-list-tile-sub-title> 
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn
              v-if="!item.done"
              icon
              small
              ripple>
              <v-icon
                small
                class="grey--text"
                @click="cancelTransfer(item)">
                fa-times
              </v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-divider
          :inset="item.inset"
          :key="index">
        </v-divider>
      </template>
    </v-list>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import helper from '@/assets/helper.js'

export default {
  name: 'list',
  props: {
    transferList: {
      type: Array,
      required: true
    }
  },
  methods: {
    ...mapActions(['cancelTransfer']),
    getSize: function (data) {
      return helper.getReadableFileSize({ size: data })
    }
  }
}
</script>

