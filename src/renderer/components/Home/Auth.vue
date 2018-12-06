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
              v-model="url"
              placeholder="Enter URL"
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
      status: !this.isLoggedIn(),
      loading: false
    }
  },
  computed: {
    url: {
      set: function (url) {
        this.setUrl(url)
      },
      get: function () {
        return this.getUrl()
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
  methods: {
    ...mapGetters(['isLoggedIn', 'getUrl', 'getToken']),
    ...mapActions(['login', 'showInfoSnackbar']),
    ...mapMutations(['setUrl', 'setToken']),
    onClickContinue: function () {
      const context = this
      this.loading = true
      this.login(function (err) {
        context.loading = false
        if (err) {
          context.showInfoSnackbar({
            message: err.message,
            status: true
          })
        } else {
          context.status = false
        }
      })
    }
  }
}
</script>
