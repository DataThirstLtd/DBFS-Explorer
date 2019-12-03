<template>
  <div>
    <icon-close
      v-if="name === 'close'"
      :width="width"
      :height="height"
      :fill="fill"
    />
    <icon-minimize
      v-if="name === 'minimize'"
      :width="width"
      :height="height"
      :fill="fill"
    />
    <icon-maximize
      v-if="name === 'maximize'"
      :width="width"
      :height="height"
      :fill="fill"
    />
  </div>
</template>

<script>
import IconClose from './IconClose'
import IconMinimize from './IconMinimize'
import IconMaximize from './IconMaximize'

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
    },
    name: {
      type: String,
      required: true,
      default: () => ''
    }
  },
  components: {
    IconClose,
    IconMinimize,
    IconMaximize
  }
}
</script>
