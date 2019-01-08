<template>
  <div>
    <v-list three-line>
      <template v-for="(item, index) in transferList">
        <v-list-tile
          :key="item.id"
          avatar
          @click="">
          <v-list-tile-avatar>
            <v-icon
              v-if="item.done"
              class="success"
              color="white">
              fa-check
            </v-icon>
            <v-progress-circular
              v-else
              :indeterminate="item.progress === 0"
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
                ${item.type ? `Upload ${item.progress}% of ${getSize(item.file.size)}` : `Download ${item.progress}% of ${getSize(item.file.size)}`}
                </strong>
                ${item.file.name}`
              "/>
            <v-list-tile-sub-title v-html="item.file.path"></v-list-tile-sub-title>
            <v-progress-linear :value="item.progress" :indeterminate="item.progress === 0"></v-progress-linear>
          </v-list-tile-content>
          <v-list-tile-action>
            <v-btn
              v-if="!item.done"
              icon
              small
              ripple>
              <v-icon
                small
                class="grey--text">
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
    getSize: function (data) {
      return helper.getReadableFileSize({ size: data })
    }
  }
}
</script>

