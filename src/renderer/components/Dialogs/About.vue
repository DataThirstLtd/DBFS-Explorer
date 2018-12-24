<template>
  <v-dialog
    v-model="dialog"
    width="500">
    <v-card>
      <v-card-title class="headline white">
        About
      </v-card-title>
      <v-card-text>
        <h1 style="font-weight: 400;"> DBFS Explorer </h1>
        <p>Version 0.1.0</p>
        <p>Copyright &copy; 2019 Data Thirst Ltd. All rights reserved</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          flat
          @click="dialog = false">
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'about',
  data () {
    return {
      dialog: false
    }
  },
  computed: mapState({
    active: state => state.config.dialogs.about.active,
    onActiveChange () {
      return this.active
    },
    onDialogChange () {
      return this.dialog
    }
  }),
  watch: {
    onActiveChange (state) {
      this.dialog = state
    },
    onDialogChange (state) {
      if (!state) {
        this.closeDialog({ name: 'about' })
      }
    }
  },
  methods: {
    ...mapActions(['closeDialog'])
  }
}
</script>

