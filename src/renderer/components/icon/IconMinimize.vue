<template>
  <svg :width="width" :height="height" :fill="fill" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M0 10h24v4h-24z"/>
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
