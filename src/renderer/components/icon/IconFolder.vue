<template>
  <svg :width="width" :height="height" :fill="fill" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
    <path d="M0 4c0-1.1.9-2 2-2h7l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4z" />
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
