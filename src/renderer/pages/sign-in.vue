<template>
  <div class="text-white">
    <div class="flex h-screen items-center">
      <div class="block m-auto rounded px-4 py-3" style="width: 24rem;">
        <div class="flex h-10 items-center">
          <logo class="h-8 w-auto" />
          <h2 class="text-xl mx-3">DBFS-Explorer</h2>
        </div>
        <p class="text-sm text-label-one my-2">
          Please provide URL and Bearer token to get started:
        </p>
        <div class="flex h-8 items-center w-full">
          <input id="input-azure" v-model="provider" type="radio" value="provider-azure">
          <label class="text-sm mx-2" for="input-azure">Azure</label>

          <input id="input-aws" v-model="provider" type="radio" value="provider-aws">
          <label class="text-sm mx-2" for="input-aws">AWS</label>
        </div>
        <div class="text-sm">
          <div class="flex h-10 items-center">
            <p class="text-label-one">https://</p>
            <input
              v-model="form.domain"
              class="bg-transparent w-64 rounded h-10 px-2"
              placeholder="Enter domain name"
            >
            <p class="text-label-one">
              {{ provider === 'provider-azure'
                ? '.azuredatabricks.net'
                : '.cloud.databricks.com'
              }}
            </p>
          </div>
          <input
            v-model="form.token"
            class="bg-transparent w-full rounded h-10 my-2"
            placeholder="Enter bearer token"
          >
          <button
            class="px-2 bg-primary h-10 text-white w-full text-base rounded uppercase"
            @click="onClickContinue"
          >
            Continue
          </button>
          <p class="text-label-one text-center text-xs mt-5">
            Copyright &copy; 2019-2020 Data Thirst Ltd. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Logo from '@/components/logo'

export default {
  layout: 'auth',
  transition: 'bounce',
  components: {
    Logo
  },
  data () {
    return {
      provider: 'provider-azure',
      form: {
        domain: '',
        token: '',
        url: ''
      }
    }
  },
  computed: {
    onChangeDomain () {
      return this.form.domain
    },
    onChangeProvider () {
      return this.provider
    }
  },
  watch: {
    onChangeDomain (domain) {
      console.log('onChangeDomain', domain)
      if (domain && typeof domain === 'string') {
        this.form.url = `https://${domain}.${this.provider === 'provider-azure' ? 'azuredatabricks.net' : 'cloud.databricks.com'}`
      }
    },
    onChangeProvider (provider) {
      this.form.url = `https://${this.form.domain}.${provider === 'provider-azure' ? 'azuredatabricks.net' : 'cloud.databricks.com'}`
    }
  },
  mounted () {
    this.$root.$emit('loader/show')
    this.$nextTick(() => {
      setTimeout(() => {
        this.$root.$emit('loader/hide')
      }, 1000)
    })
    this.$root.$on('sign-in/fill-credentials', ({ domain, token }) => {
      this.form.domain = domain
      this.form.token = token
    })
  },
  methods: {
    ...mapActions(['signIn']),
    onClickContinue () {
      const { domain, token, url } = this.form
      this.$root.$emit('loader/show')
      this.signIn({ domain, token, url })
        .then(() => {
          this.$router.push({ path: '/home' })
        })
        .finally(() => {
          setTimeout(() => {
            this.$root.$emit('loader/hide')
          }, 1000)
        })
    }
  }
}
</script>
