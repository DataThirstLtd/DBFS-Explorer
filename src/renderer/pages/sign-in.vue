<template>
  <div class="text-white">
    <div v-if="loading">
      <div class="hero-xy">
        <spinner />
      </div>
      <logo class="hero-xy h-18 w-auto" />
    </div>
    <div v-else>
      <div class="flex h-screen w-full items-center">
        <div class="flex-grow hidden lg:block xl:block mb-10">
          <div class="w-auth-box block m-auto">
            <img class="w-auto h-64 block m-auto" src="@/assets/vector/artwork.svg" />
            <div class="text-center">
              <h1 class="mt-5 text-2xl font-semibold">
                A quick way to upload and download files to the Databricks filesystem.
              </h1>
            </div>
          </div>
        </div>
        <div class="flex h-auto items-center mb-16 w-full lg:w-auth-box xl:w-auth-box">
          <div class="block m-auto rounded px-4 py-3" style="width: 24rem;">
            <div class="flex h-10 items-center">
              <logo class="h-8 w-auto" />
              <h2 class="text-xl font-semibold mx-3">DBFS-Explorer</h2>
            </div>
            <p class="text-sm text-label-one my-2">
              Please provide URL and Bearer token to get started:
            </p>
            <div class="flex h-8 items-center w-full">
              <input v-model="provider" type="radio" value="provider-azure" id="input-azure" />
              <label class="text-sm mx-2" for="input-azure">Azure</label>

              <input v-model="provider" type="radio" value="provider-aws" id="input-aws" />
              <label class="text-sm mx-2" for="input-aws">AWS</label>
            </div>
            <div class="text-sm">
              <div class="flex h-10 items-center">
                <p class="text-label">https://</p>
                <input
                  class="bg-transparent w-64 rounded h-10 px-2"
                  placeholder="Enter domain name"
                >
                <p class="text-label">
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
                class="px-2 bg-primary h-10 text-white w-full text-base font-semibold rounded uppercase"
              >
                Continue
              </button>
            </div>
          </div>
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
  }
}
</script>
