<template>
  <div class="absolute top-0 right-0 bottom-0 left-0">
    <div class="absolute top-0 right-0 left-0 h-10 border-b border-container-border">
      <div class="flex h-full w-full items-center px-2">
        <p class="text-xs text-label-one">
          {{ getAbsolutePath(navStack) }}
        </p>
      </div>
    </div>
    <div class="absolute right-0 bottom-0 left-0 px-3 py-2" style="top: 2.5rem;">
      <div class="flex h-full w-full">
        <template v-for="(item, index) in list">
          <div
            :key="`explorer-item-index-${index}`"
            class="flex-auto"
          >
            <folder
              :item="item"
              :db-click="dbClickFileFolder"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Folder from './folder'

export default {
  components: {
    Folder
  },
  props: {
    list: {
      type: Array,
      required: false,
      default: () => []
    },
    navStack: {
      type: Array,
      required: false,
      default: () => []
    },
    dbClickFileFolder: {
      type: Function,
      required: false,
      default: () => {}
    }
  },
  methods: {
    getAbsolutePath (stack) {
      if (stack && Array.isArray(stack) && stack.length > 0) {
        return stack.join('/')
      }

      return ''
    }
  }
}
</script>
