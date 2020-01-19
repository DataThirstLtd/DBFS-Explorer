<template>
  <div
    class="folder-item relative h-20 w-20 text-white text-xs rounded cursor-pointer hover:bg-container-border"
    @dblclick="dbClick(item)"
  >
    <div class="absolute top-0 right-0 left-0 h-10">
      <div class="hero-xy">
        <icon
          :width="30"
          :height="30"
          fill="#ffffff"
          name="folder"
        />
      </div>
    </div>
    <div
      class="absolute right-0 left-0 bottom-0 text-center p-1 truncate-two-lines"
      style="top: 2.5rem;"
    >
      {{ getNameFromFileEntry(item) }}
    </div>
  </div>
</template>

<script>
import Icon from '@/components/icon'
import { getNameFromFileEntry } from '@/utils'

export default {
  components: {
    Icon
  },
  props: {
    item: {
      type: Object,
      required: true,
      default: () => {}
    },
    dbClick: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  methods: {
    getNameFromFileEntry
  }
}
</script>

<style scoped>
  .folder-item {
    user-select: none;
  }
</style>
