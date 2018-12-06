<template>
  <div>
    <v-dialog
      v-model="status"
      fullscreen
      hide-overlay style="background: yellow;"
      transition="dialog-bottom-transition">
      <v-card>
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
              @click="onClickContinue">
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
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  name: 'auth',
  data () {
    return {
      authView: false,
      status: !this.doesAuthDataExists(),
      loading: false
    }
  },
  computed: {
    onTryLogin: function () {
      return this.$store.state.auth.tryLogin
    },
    domain: {
      set: function (domain) {
        this.setDomain(domain)
      },
      get: function () {
        return this.getDomain()
      }
    },
    token: {
      set: function (token) {
        this.setToken(token)
      },
      get: function () {
        return this.getToken()
      }
    }
  },
  watch: {
    onTryLogin: function (state) {
      if (state) {
        this.auth()
      } else {
        this.authView = true
      }
    }
  },
  methods: {
    ...mapGetters(['doesAuthDataExists', 'getDomain', 'getToken']),
    ...mapActions(['login', 'showInfoSnackbar']),
    ...mapMutations(['setDomain', 'setToken']),
    auth () {
      const context = this
      this.login(function (err) {
        context.loading = false
        if (err) {
          context.authView = true
          context.showInfoSnackbar({
            message: err.message,
            status: true
          })
        } else {
          context.status = false
        }
      })
    },
    onClickContinue: function () {
      this.loading = true
      this.auth()
    }
  }
}
</script>
