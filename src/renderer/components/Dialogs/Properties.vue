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
        console.log(data)
      }).catch((error) => {
        console.error(error)
      })
    },
    hide: function () {
      this.closeDialog({ name: 'properties' })
    }
  }
}
</script>
