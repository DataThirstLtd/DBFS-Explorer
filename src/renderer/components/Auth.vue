<template>
  <div>
    <div class="hero"
      v-if="authView">
      <v-card flat width="500px">
        <h1 class="light-text">
          Welcome to DBFS-Explorer
        </h1>
        <p style="padding: 10px 0;">
          Please provide URL and Bearer token to get started.
        </p>
        <v-text-field
          prepend-icon="fa-link"
          flat solo
          v-model="domain"
          placeholder="Enter URL or domain name"
          :disabled="loading">
        </v-text-field>
        <v-text-field
          prepend-icon="fa-key"
          flat solo
          v-model="token"
          placeholder="Enter Bearer token"
          :disabled="loading">
        </v-text-field>
        <v-btn
          color="primary"
          :loading="loading"
          :disabled="loading"
          depressed block
          @click="onContinue">
          Continue
        </v-btn>
      </v-card>
    </div>
    <div class="hero"
      v-if="!authView">
      <v-progress-circular
        :size="70"
        :width="3"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'auth',
  data () {
    return {
      authView: false,
      loading: false,
      domain: '',
      token: ''
    }
  },
  computed: {
    onAuthReady: function () {
      return this.$store.state.auth.onAuthReady
    }
  },
  watch: {
    onAuthReady: function (state) {
      if (state) {
        if (this.doesAuthDataExists()) {
          this.token = this.getToken()
          this.domain = this.getDomain()
          this.onContinue()
        } else {
          this.authView = true
        }
      }
    }
  },
  methods: {
    ...mapGetters(['getToken', 'getDomain', 'doesAuthDataExists']),
    ...mapActions(['login', 'showInfoSnackbar']),
    onContinue: function () {
      const context = this
      this.loading = true
      this.login({
        domain: this.domain,
        token: this.token,
        callback: function (err, res) {
          if (err) {
            context.showInfoSnackbar({
              message: err.message,
              status: true
            })
          } else {
            context.$router.push('home')
          }
          context.loading = false
          context.authView = true
        }
      })
    }
  }
}
</script>
