<template>
   <v-dialog
    v-model="dialog"
    persistent
    width="500">
      <v-card>
        <v-card-title
          class="grey lighten-2"
          primary-title>
          Settings
        </v-card-title>
        <v-card-text
          class="scrollable-content">
          <v-list
            v-if="active"
            three-line
            subheader>
            <fields
              v-for="(item, index) in list"
              :key="`settings-field-${index}`"
              :item="item"
              :settings="settings"
              :onUpdateField="onUpdateField" />
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
import Fields from '@/components/Dialogs/Settings/Fields'

export default {
  name: 'app-settings',
  components: {
    Fields
  },
  data () {
    return {
      dialog: false,
      list: [
        { text: 'Download/Upload Thread Count', key: 'thread-count' }
      ]
    }
  },
  computed: mapState({
    active: state => state.config.dialogs.settings.active,
    settings: state => state.config.settings,
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
    ...mapActions(['showInfoSnackbar', 'closeDialog', 'updateSettings']),
    show: function () {
      this.dialog = true
    },
    hide: function () {
      this.closeDialog({ name: 'settings' })
    },
    onUpdateField: function ({ key, value }) {
      if (this.settings && this.settings.constructor === [].constructor) {
        const index = this.settings.findIndex(
          x => x.key === key
        )
        if (index > -1) {
          if (this.settings[index].value !== value) {
            this.updateSettings({ key, value })
          }
        }
      }
    }
  }
}
</script>

<style scoped>
  .scrollable-content {
    min-height: 100px;
    max-height: 300px;
    width: 100%;
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
