<template>
  <div>
    <div class="hero">
      <v-card flat width="500px">
        <div
          style="margin: 5px 0;">
          <v-layout
            row>
            <img
              class="auth-logo"
              src="@/assets/logo.png">
            <p
              class="auth-company">
              Data Thirst
            </p>
          </v-layout>
        </div>
        <h1 class="light-text">
          Welcome to DBFS-Explorer
        </h1>
        <p style="padding: 10px 0;">
          Please provide URL and Bearer token to get started.
        </p>
        <v-radio-group
          v-model="activeSuffix"
          row>
          <v-radio
            v-for="item in urlSuffix"
            :key="item.id"
            :label="item.name"
            :value="item.suffix"
            color="black"
          ></v-radio>
        </v-radio-group>
        <v-text-field
          :disabled="loading"
          :suffix="activeSuffix"
          prefix="https://"
          prepend-icon="fa-link"
          flat solo
          v-model="inputDomain"
          label="hello"
          placeholder="Enter domain name">
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
        <p
          class="copyright-info">
          Copyright &copy; 2019 Data Thirst Ltd. All rights reserved.
        </p>
      </v-card>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import helper from '@/assets/helper.js'

export default {
  name: 'auth',
  data () {
    return {
      loading: false,
      inputDomain: this.domain,
      inputToken: this.token,
      urlSuffix: [
        { name: 'Azure', id: 'auth-url-suffix-azure', suffix: '.azuredatabricks.net' },
        { name: 'AWS', id: 'auth-url-suffix-aws', suffix: '.cloud.databricks.com' }
      ],
      activeSuffix: '.azuredatabricks.net'
    }
  },
  computed: mapState({
    domain: state => state.auth.domain,
    token: state => state.auth.token,
    onChangeActiveSuffix: function () {
      return this.activeSuffix
    },
    onInit () {
      return Boolean(this.token && this.domain)
    }
  }),
  watch: {
    onInit (state) {
      this.fillCredentials({
        domain: this.domain,
        token: this.token
      })
    },
    onChangeActiveSuffix: function (suffix) {
      console.log(suffix)
    }
  },
  mounted () {
    const self = this
    this.init()
    this.$root.$on('shareCredentials', ({ domain, token }) => {
      self.fillCredentials({ domain, token })
    })
  },
  methods: {
    ...mapGetters(['getToken', 'getDomain', 'doesAuthDataExists']),
    ...mapActions(['login', 'showInfoSnackbar', 'init', 'writeLog']),
    onContinue: function () {
      const { inputDomain, inputToken, activeSuffix } = this
      if (inputDomain && inputToken) {
        const context = this
        context.loading = true
        this.login({
          domain: `https://${inputDomain}${activeSuffix}`,
          token: this.inputToken
        }).then(() => {
          context.writeLog({
            level: 'info',
            message: 'login attempt -> Success'
          })
          context.loading = false
          context.$router.replace('home')
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
      } else {
        this.showInfoSnackbar({
          message: 'Entered credentials are not valid. Please enter valid credentials and try again!',
          status: true
        })
      }
    },
    fillCredentials: function ({ domain, token }) {
      // Validate url
      // Url should match either azure or aws url formats
      // azure - https://domain.azuredatabricks.net
      // aws - https://domain.cloud.databricks.com
      if (domain && token && (domain.match(helper.getRegXObject().azure || domain.match(helper.getRegXObject().aws)))) {
        const extractedUrl = domain.match(helper.getRegXObject().domain)
        this.activeSuffix = `.${domain.split(extractedUrl[0])[1]}`
        this.inputDomain = (extractedUrl && extractedUrl[1]) || ''
        this.inputToken = token
      } else {
        this.showInfoSnackbar({
          message: 'Saved credentials are not valid. Please enter domain and token and try again!',
          status: true
        })
      }
    }
  }
}
</script>
