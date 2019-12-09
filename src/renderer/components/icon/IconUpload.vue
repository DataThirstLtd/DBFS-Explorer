<template>
  <svg :width="width" :height="height" :fill="fill" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M13 10v6H7v-6H2l8-8 8 8h-5zM0 18h20v2H0v-2z"/>
  </svg>
</template>

<script>
export default {
  props: {
    height: {
      type: Number,
      required: false,
      default: () => 24
    },
    width: {
      type: Number,
      required: false,
      default: () => 24
    },
    fill: {
      type: String,
      required: false,
      default: () => '#000000'
    }
  }
}
</script>
