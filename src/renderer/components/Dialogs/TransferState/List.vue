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
              indeterminate
              :width="10"
              :size="150"
              color="primary">
            </v-progress-circular>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title v-html="item.file.name"></v-list-tile-title>
            <v-list-tile-sub-title v-html="item.file.path"></v-list-tile-sub-title>
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
export default {
  name: 'list',
  props: {
    transferList: {
      type: Array,
      required: true
    }
  }
}
</script>

