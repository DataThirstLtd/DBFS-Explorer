<template>
  <div class="text-white">
    <div v-if="loading">
      <div class="hero-xy">
        <spinner />
      </div>
      <logo class="hero-xy h-18 w-auto" />
    </div>
    <div v-else class="flex h-screen items-center">
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
import Logo from '@/components/logo'
import Spinner from '@/components/spinner'

export default {
  layout: 'auth',
  transition: 'bounce',
  components: {
    Logo,
    Spinner
  },
  data () {
    return {
      loading: true,
      provider: 'provider-azure'
    }
  },
  mounted () {
    this.$nextTick(() => {
      setTimeout(() => {
        this.loading = false
      }, 1000)
    })
  },
  methods: {
    onClickContinue () {
      this.loading = true
      setTimeout(() => {
        this.$router.replace({ path: '/home' })
      }, 1000)
    }
  }
}
</script>
