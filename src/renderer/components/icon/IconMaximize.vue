<template>
  <svg :width="width" :height="height" :fill="fill" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M22 6v16h-20v-16h20zm2-6h-24v24h24v-24z" />
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
