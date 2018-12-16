<template>
  <div>
    <div>
      <div v-if="item.is_dir"
        class="item-wrapper"
        @click="onClickItem">
        <v-icon class="icon" large>
          fa-folder
        </v-icon>
        <p class="name">
          {{ item.path.split('/').pop() || item.path }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'populate',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions(['clearSelection', 'fetchSelection']),
    onClickItem: function () {
      this.clearSelection()
      this.fetchSelection(this.item)
    }
  }
}
</script>

<style scoped>
  .item-wrapper {
    width: 100px;
    height: auto;
    margin: 10px;
    cursor: pointer;
  }
  .item-wrapper > .icon {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 0;
  }
  .item-wrapper > .name {
    text-align: center;
  }
</style>
