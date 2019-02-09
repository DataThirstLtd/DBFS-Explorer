<template>
  <v-snackbar
    v-model="status" color="#626262" class="white--text"
    bottom right multi-line :timeout="4000">
    <h4>{{ info.message }}</h4>
    <v-btn
      color="white"
      flat
      @click="status = false">
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'info-snackbar',
  computed: {
    info: {
      get: function () {
        return this.getInfoSnackbarObject()
      }
    },
    status: {
      get: function () {
        return this.getInfoSnackbarStatus()
      },
      set: function (state) {
        this.setInfoSnackbar({ status: state })
      }
    }
  },
  methods: {
    ...mapGetters(['getInfoSnackbarTitle', 'getInfoSnackbarMessage', 'getInfoSnackbarStatus', 'getInfoSnackbarObject']),
    ...mapMutations(['setInfoSnackbar'])
  }
}
</script>

