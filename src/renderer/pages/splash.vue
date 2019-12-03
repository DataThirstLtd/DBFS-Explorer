<template>
  <div class="text-white">
    <div
      id="splash-background"
      class="fixed top-0 right-0 bottom-0 left-0"
    />
    <div class="hero-xy">
      <h1
        class="text-5xl text-center font-extrabold text-yellow-500 tracking-wide"
      >
        ExorTrader
      </h1>
    </div>
    <div class="fixed right-0 bottom-0 left-0 h-auto">
      <div class="h-10 flex items-center text-xs text-yellow-500">
        <div class="flex-grow" />
        <div class="mx-1">
          <logo :width="18" :height="18" />
        </div>
        <p>exor.io</p>
        <div class="flex-grow" />
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '@/components/logo'

export default {
  components: {
    Logo
  }
}
</script>
