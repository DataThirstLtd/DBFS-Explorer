<template>
  <div class="flex h-screen text-white items-center p-2 fade-in-transition">
    <title-bar :transparent="true" />
    <div class="flex-grow" />
    <div class="w-64 h-auto p-2">
      <logo class="h-12 w-auto" />
      <div v-if="error.statusCode === 401">
        <h1 class="text-2xl my-2">
          You are not connected
        </h1>
      </div>
      <div v-else>
        <h1 class="text-sm my-2">
          Something happend
        </h1>
      </div>
      <p class="text-sm">
        Go back to sign in page to get started.
      </p>
      <nuxt-link to="/">
        <button class="bg-primary w-auto h-8 px-5 rounded-full text-sm mt-5">
          Go back
        </button>
      </nuxt-link>
    </div>
    <div class="flex-grow" />
  </div>
</template>

<script>
import TitleBar from '@/components/title-bar'
import Logo from '@/components/logo'
export default {
  props: ['error'],
  components: {
    Logo,
    TitleBar
  },
  transition: 'page'
}
</script>
