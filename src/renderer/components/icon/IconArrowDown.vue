<template>
  <svg :width="width" :height="height" :fill="fill" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
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
