<template>
   <v-dialog
    v-model="dialog"
    persistent
    width="500">
    <v-card>
      <v-card-title
        class="grey lighten-2"
        primary-title>
        Delete Folder
      </v-card-title>
      <v-card-text>
        Are you sure about deleting file(s)?
        <v-list
          v-if="options && options.list"
          class="delete-list"
          subheader>
          <v-list-tile
            v-for="item in options.list"
            :key="item.transferId">
            <v-list-tile-content>
              <v-list-tile-title>{{ item }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn
          flat
          @click="hide">
          Close
        </v-btn>
        <v-btn
          color="red"
          flat
          @click="onDelete">
          DELETE
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'delete-selected',
  data () {
    return {
      dialog: false
    }
  },
  computed: mapState({
    active: state => state.config.dialogs.delete.active,
    options: state => state.config.dialogs.delete.options,
    onChangeActive () {
      return this.active
    }
  }),
  watch: {
    onChangeActive (state) {
      if (state) {
        this.show()
      } else {
        this.dialog = false
      }
    }
  },
  methods: {
    ...mapActions(['openDialog', 'closeDialog', 'deleteSelected']),
    show: function () {
      this.dialog = true
    },
    hide: function () {
      this.closeDialog({ name: 'delete' })
    },
    onDelete: function () {
      if (
        this.options && this.options.list &&
        this.options.list.constructor === [].constructor &&
        this.options.list.length > 0 && this.options.pwd
      ) {
        this.deleteSelected({
          list: this.options.list,
          pwd: this.options.pwd
        })
      }
    }
  }
}
</script>

<style scoped>
  .delete-list {
    max-height: 200px;
    overflow-y: auto;
    background: rgb(240, 240, 240);
    color: black;
    margin-top: 10px;
  }
</style>
