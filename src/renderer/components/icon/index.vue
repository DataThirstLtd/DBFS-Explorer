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
    <icon-arrow-up
      v-else-if="name === 'arrow-up'"
      :width="width"
      :height="height"
      :fill="fill"
    />
    <icon-arrow-down
      v-else-if="name === 'arrow-down'"
      :width="width"
      :height="height"
      :fill="fill"
    />
    <icon-download
      v-else-if="name === 'download'"
      :width="width"
      :height="height"
      :fill="fill"
    />
    <icon-upload
      v-else-if="name === 'upload'"
      :width="width"
      :height="height"
      :fill="fill"
    />
    <icon-add-folder
      v-else-if="name === 'add-folder'"
      :width="width"
      :height="height"
      :fill="fill"
    />
    <icon-key
      v-else-if="name === 'key'"
      :width="width"
      :height="height"
      :fill="fill"
    />
    <icon-stand-by
      v-else-if="name === 'stand-by'"
      :width="width"
      :height="height"
      :fill="fill"
    />
  </div>
</template>

<script>
import IconKey from './IconKey'
import IconClose from './IconClose'
import IconFolder from './IconFolder'
import IconLayers from './IconLayers'
import IconMinimize from './IconMinimize'
import IconMaximize from './IconMaximize'
import IconArrowUp from './IconArrowUp'
import IconArrowDown from './IconArrowDown'
import IconDownload from './IconDownload'
import IconUpload from './IconUpload'
import IconAddFolder from './IconAddFolder'
import IconStandBy from './IconStandBy'

export default {
  components: {
    IconKey,
    IconClose,
    IconFolder,
    IconLayers,
    IconMinimize,
    IconMaximize,
    IconArrowUp,
    IconArrowDown,
    IconDownload,
    IconUpload,
    IconAddFolder,
    IconStandBy
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
