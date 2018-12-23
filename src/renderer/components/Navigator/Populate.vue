<template>
  <div>
    <div class="ig-selected-item-wrapper">
      <div v-if="item.is_dir"
        class="item-wrapper"
        :active="selectedItem === item.path"
        @dblclick="onOpenItem"
        @click="onSelectItem">
        <v-icon
          class="icon"
          :active="selectedItem === item.path"
          large>
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
    },
    selectedItem: {
      type: String,
      required: true
    }
  },
  methods: {
    ...mapActions(['clearSelection', 'fetchSelection', 'selectItem']),
    onOpenItem: function () {
      this.clearSelection()
      this.fetchSelection(this.item)
    },
    onSelectItem: function () {
      this.selectItem(this.item)
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
  .item-wrapper[active] {
    background: rgba(22, 82, 179, 0.452);
  }
</style>
