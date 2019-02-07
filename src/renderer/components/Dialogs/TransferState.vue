<template>
  <v-bottom-sheet
    v-model="sheet"
    persistent>
    <v-card
      style="height: 500px;">
      <v-card-title class="headline grey lighten-4">
        <v-btn
          icon
          small
          color="#2A2A2A"
          @click="closeDialog({ name: 'transferState' })">
          <v-icon
            small
            class="white--text">
            fa-times
          </v-icon>
        </v-btn>
        Dowloads and Uploads
        <v-spacer />
        <v-btn
          :disabled="list.length < 1 || !list.some(item => { return Boolean(item.done || item.abort) })"
          flat
          small
          color="#2A2A2A"
          @click="clearFinished">
          <v-icon
            small left
            class="black--text">
            fa-times
          </v-icon>
          Clear Finished
        </v-btn>
      </v-card-title>
      <v-card-text
        v-if="list && list.constructor === [].constructor && list.length > 0"
        style="height: 80%; overflow: auto;">
        <list
          :transferList="list">
        </list>
      </v-card-text>
      <div
        v-else
        class="hero">
        Files you download or upload will appear here
      </div>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import List from './TransferState/List'

export default {
  name: 'transfer-state',
  components: {
    List
  },
  data () {
    return {
      sheet: false
    }
  },
  computed: mapState({
    active: state => state.config.dialogs.transferState.active,
    list: state => state.config.dialogs.transferState.list,
    onChangeActive: function () {
      return this.active
    },
    onChangeSheet: function () {
      return this.sheet
    }
  }),
  watch: {
    onChangeActive: function (active) {
      this.sheet = active
    },
    onChangeSheet: function (sheet) {
      if (!sheet) {
        this.closeDialog({ name: 'transferState' })
      }
    }
  },
  methods: {
    ...mapActions(['closeDialog', 'clearFinished'])
  }
}
</script>

<style scoped>
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
