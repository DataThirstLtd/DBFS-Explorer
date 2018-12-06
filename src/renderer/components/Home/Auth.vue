<template>
  <div>
    <v-dialog
      v-model="status"
      fullscreen
      hide-overlay style="background: yellow;"
      transition="dialog-bottom-transition">
      <v-card>
        <div class="hero">
          <v-card flat width="500px">
            <h1 class="light-text">
              Welcome to DBFS-Explorer
            </h1>
            <p style="padding: 10px 0;">Please provide URL and Bearer token to get started. </p>
            <v-text-field
              prepend-icon="fa-link"
              flat solo
              placeholder="Enter URL">
            </v-text-field>
            <v-text-field
              prepend-icon="fa-key"
              flat solo
              placeholder="Enter Bearer token">
            </v-text-field>
            <v-btn
              color="primary"
              depressed block
              @click="authenticate">
              Continue
            </v-btn>
          </v-card>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'auth',
  data () {
    return {
      status: this.isLoggedIn
    }
  },
  methods: {
    ...mapGetters(['isLoggedIn']),
    authenticate: function () {
      this.$store.dispatch('setState', {
        name: 'auth',
        data: false
      })
    }
  }
}
</script>
