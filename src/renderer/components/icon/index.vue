<template>
  <div>
    <icon-layers
      v-if="name === 'databricks'"
      :width="width"
      :height="height"
      :fill="fill"
    />
    <icon-folder
      v-if="name === 'folder'"
      :width="width"
      :height="height"
      :fill="fill"
    />
    <icon-close
      v-else-if="name === 'close'"
      :width="width"
      :height="height"
      :fill="fill"
    />
    <icon-minimize
      v-else-if="name === 'minimize'"
      :width="width"
      :height="height"
      :fill="fill"
    />
    <icon-maximize
      v-else-if="name === 'maximize'"
      :width="width"
      :height="height"
      :fill="fill"
    />
  </div>
</template>

<script>
import IconClose from './IconClose'
import IconFolder from './IconFolder'
import IconLayers from './IconLayers'
import IconMinimize from './IconMinimize'
import IconMaximize from './IconMaximize'

export default {
  components: {
    IconClose,
    IconFolder,
    IconLayers,
    IconMinimize,
    IconMaximize
  },
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
  }
}
</script>
