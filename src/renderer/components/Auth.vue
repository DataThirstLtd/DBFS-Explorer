<template>
  <div>
    <div class="hero">
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
          v-model="inputDomain"
          placeholder="Enter URL or domain name"
          :disabled="loading">
        </v-text-field>
        <v-text-field
          prepend-icon="fa-key"
          flat solo
          v-model="inputToken"
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
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  name: 'auth',
  data () {
    return {
      loading: false,
      inputDomain: this.domain,
      inputToken: this.token
    }
  },
  computed: mapState({
    domain: state => state.auth.domain,
    token: state => state.auth.token,
    onInit () {
      return Boolean(this.token && this.domain)
    }
  }),
  watch: {
    onInit (state) {
      if (state) {
        this.inputDomain = this.domain
        this.inputToken = this.token
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    ...mapGetters(['getToken', 'getDomain', 'doesAuthDataExists']),
    ...mapActions(['login', 'showInfoSnackbar', 'init', 'writeLog']),
    onContinue: function () {
      const context = this
      context.loading = true
      this.login({
        domain: this.inputDomain,
        token: this.inputToken
      }).then(() => {
        context.writeLog({
          level: 'info',
          message: 'login attempt -> Success'
        })
        context.loading = false
        context.$router.push('home')
      }).catch((error) => {
        context.writeLog({
          level: 'error',
          message: `login attempt -> FAILED`
        })
        context.writeLog({
          level: 'error',
          message: `Error code: ${error.code}, Error message: ${error.message}`
        })
        context.loading = false
        context.showInfoSnackbar({
          message: error.message,
          status: true
        })
      })
    }
  }
}
</script>
