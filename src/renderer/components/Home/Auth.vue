<template>
  <div>
    <v-dialog
      v-model="status"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition">
      <v-card style="height: 100%;">
        <div class="hero">
          <h1>hello</h1>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'auth',
  data () {
    return {
      status: true
    }
  },
  computed: {
    onAuthDialogStateChanged () {
      return this.$store.state.config.auth.dialog.status
    }
  },
  watch: {
    onAuthDialogStateChanged (status) {
      this.status = status
    }
  }
}
</script>
