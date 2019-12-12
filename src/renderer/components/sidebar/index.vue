<template>
  <div id="sidebar" class="bg-container text-white text-sm overflow-y-auto">
    <div class="h-auto my-2">
      <div class="my-1 mb-3">
        <p class="px-3 text-xs text-label-one">Locations</p>
        <div class="px-2">
          <button class="w-full h-auto px-3 py-1 hover:bg-container-border">
            <div class="flex h-full items-center">
              <icon
                :width="14"
                :height="14"
                fill="#ffffff"
                name="folder"
              />
              <p class="ml-2">root</p>
            </div>
          </button>
        </div>
      </div>
      <div v-if="favourites.length > 0" class="my-1 mb-3">
        <p class="px-3 text-xs text-label-one">Favourites</p>
        <div class="px-2">
          <template v-for="(item, index) in favourites">
            <button
              :key="`sidebar-root-files-list-${index}`"
              class="w-full h-auto px-3 py-1 hover:bg-container-border"
            >
              <div class="flex h-full items-center">
                <icon
                  :width="14"
                  :height="14"
                  fill="#ffffff"
                  name="folder"
                />
                <p class="ml-2 text-left truncate">
                  {{ getNameFromFileEntry(item) }}
                </p>
              </div>
            </button>
          </template>
        </div>
      </div>
      <div class="my-1 mb-3">
        <p class="px-3 text-xs text-label-one">/root</p>
        <div class="px-2">
          <template v-for="(item, index) in files">
            <button
              :key="`sidebar-root-files-list-${index}`"
              class="w-full h-auto px-3 py-1 hover:bg-container-border"
            >
              <div class="flex h-full items-center">
                <icon
                  :width="14"
                  :height="14"
                  fill="#ffffff"
                  name="folder"
                />
                <p class="ml-2 text-left truncate">
                  {{ getNameFromFileEntry(item) }}
                </p>
              </div>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Icon from '@/components/icon'
import { getNameFromFileEntry } from '@/utils'

export default {
  components: {
    Icon
  },
  data () {
    return {
      files: [],
      favourites: []
    }
  },
  created () {
    const self = this
    this.listFolder({ path: '/' })
      .then(data => {
        this.files = Object.assign([], data)
      })
  },
  methods: {
    ...mapActions(['listFolder']),
    getNameFromFileEntry
  }
}
</script>
