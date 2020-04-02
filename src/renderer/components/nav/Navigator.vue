<template>
  <div>
    <div v-if="viewAs === 'view_module'">
      <div class="d-flex align-center justify-space-start flex-wrap">
        <template v-for="(item, i) in 22">
          <div
            :key="`navigator-view_module-folder-index-${i}`"
          >
            <div class="folder ma-2">
              <div class="icon">
                <div
                  class="d-flex align-center justify-center"
                  style="height: 100%;"
                >
                  <v-icon large>
                    folder
                  </v-icon>
                </div>
              </div>
              <div class="label">
                <p class="caption ma-0 pa-0 text-center text-truncate">
                  Folder name
                </p>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-else-if="viewAs === 'view_list'">
      TODO: Implement <code>`v-data-table`</code>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    viewAs: {
      type: String,
      required: false,
      default: () => 'view_module'
    }
  }
}
</script>
